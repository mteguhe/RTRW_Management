package main

import (
	"log"
	"rtrw/backend/internal/config"
	"rtrw/backend/internal/handler"
	"rtrw/backend/internal/middleware"
	"rtrw/backend/internal/model"
	"rtrw/backend/internal/repository"
	jwtpkg "rtrw/backend/pkg/jwt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()
	jwtpkg.Init(cfg.JWTSecret)

	db, err := gorm.Open(mysql.Open(cfg.DBDsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal koneksi database: %v", err)
	}

	if err := db.AutoMigrate(
		&model.User{},
		&model.Resident{},
		&model.Announcement{},
		&model.Letter{},
		&model.Finance{},
		&model.Complaint{},
	); err != nil {
		log.Fatalf("Gagal migrasi database: %v", err)
	}

	// Repositories
	userRepo := repository.NewUserRepository(db)
	residentRepo := repository.NewResidentRepository(db)
	announcementRepo := repository.NewAnnouncementRepository(db)
	letterRepo := repository.NewLetterRepository(db)
	financeRepo := repository.NewFinanceRepository(db)
	complaintRepo := repository.NewComplaintRepository(db)

	// Handlers
	authH := handler.NewAuthHandler(userRepo, cfg.JWTExpiry)
	userH := handler.NewUserHandler(userRepo)
	residentH := handler.NewResidentHandler(residentRepo)
	announcementH := handler.NewAnnouncementHandler(announcementRepo)
	letterH := handler.NewLetterHandler(letterRepo, residentRepo)
	financeH := handler.NewFinanceHandler(financeRepo)
	complaintH := handler.NewComplaintHandler(complaintRepo)
	statsH := handler.NewStatsHandler(residentRepo, letterRepo, financeRepo)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.CORSOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")

	// Auth routes (public)
	auth := api.Group("/auth")
	{
		auth.POST("/login", authH.Login)
		auth.POST("/register", authH.Register)
		auth.GET("/me", middleware.Auth(), authH.Me)
	}

	// Public announcements
	api.GET("/announcements", announcementH.GetAll)
	api.GET("/announcements/:id", announcementH.GetOne)

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.Auth())
	{
		// Stats
		protected.GET("stats", statsH.Get)

		// User management (admin RW only)
		users := protected.Group("users")
		users.Use(middleware.RequireRole("admin_rw"))
		{
			users.GET("/rt-accounts", userH.GetRTAccounts)
			users.PUT("/:id", userH.UpdateUser)
		}

		// Residents
		residents := protected.Group("residents")
		{
			residents.GET("", residentH.GetAll)
			residents.GET(":id", residentH.GetOne)
			residents.GET("family/:no_kk", residentH.GetFamily)
			// Admin only
			adminOnly := residents.Group("")
			adminOnly.Use(middleware.RequireRole("admin_rw", "admin_rt"))
			{
				adminOnly.POST("", residentH.Create)
				adminOnly.PUT(":id", residentH.Update)
				adminOnly.DELETE(":id", residentH.Delete)
			}
		}

		// Announcements (write)
		announcements := protected.Group("announcements")
		announcements.Use(middleware.RequireRole("admin_rw", "admin_rt"))
		{
			announcements.POST("", announcementH.Create)
			announcements.PUT(":id", announcementH.Update)
			announcements.DELETE(":id", announcementH.Delete)
		}

		// Letters
		letters := protected.Group("letters")
		{
			letters.GET("", letterH.GetAll)
			letters.GET(":id", letterH.GetOne)
			letters.GET(":id/download", letterH.Download)
			letters.POST("", middleware.RequireRole("warga", "admin_rt"), letterH.Create)
			letters.PUT(":id/approve-rt", middleware.RequireRole("admin_rt"), letterH.ApproveRT)
			letters.PUT(":id/reject-rt", middleware.RequireRole("admin_rt"), letterH.RejectRT)
			letters.PUT(":id/approve-rw", middleware.RequireRole("admin_rw"), letterH.ApproveRW)
			letters.PUT(":id/reject-rw", middleware.RequireRole("admin_rw"), letterH.RejectRW)
		}

		// Finances
		finances := protected.Group("finances")
		{
			finances.GET("", financeH.GetAll)
			finances.GET("summary", financeH.GetSummary)
			finances.POST("", middleware.RequireRole("admin_rw", "admin_rt"), financeH.Create)
		}

		// Complaints
		complaints := protected.Group("complaints")
		{
			complaints.GET("", complaintH.GetAll)
			complaints.GET(":id", complaintH.GetOne)
			complaints.POST("", complaintH.Create)
			complaints.PUT(":id/status", middleware.RequireRole("admin_rw", "admin_rt"), complaintH.UpdateStatus)
		}
	}

	log.Printf("Server berjalan di port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
