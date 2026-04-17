package handler

import (
	"rtrw/backend/internal/model"
	"rtrw/backend/internal/repository"
	"rtrw/backend/pkg/jwt"
	"rtrw/backend/pkg/response"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	userRepo  *repository.UserRepository
	jwtExpiry time.Duration
}

func NewAuthHandler(userRepo *repository.UserRepository, jwtExpiry time.Duration) *AuthHandler {
	return &AuthHandler{userRepo: userRepo, jwtExpiry: jwtExpiry}
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type registerRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role"`
	NoRT     uint   `json:"no_rt"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}

	user, err := h.userRepo.FindByEmail(req.Email)
	if err != nil {
		response.Error(c, 401, "Email atau kata sandi salah")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		response.Error(c, 401, "Email atau kata sandi salah")
		return
	}

	token, err := jwt.Generate(user.ID, string(user.Role), user.NoRT, h.jwtExpiry)
	if err != nil {
		response.Error(c, 500, "Gagal membuat token")
		return
	}

	response.OK(c, "Login berhasil", gin.H{
		"token": token,
		"user":  user,
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.Error(c, 500, "Gagal memproses kata sandi")
		return
	}

	role := model.RoleWarga
	if req.Role != "" {
		role = model.Role(req.Role)
	}

	user := &model.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hash),
		Role:     role,
		NoRT:     req.NoRT,
	}

	if err := h.userRepo.Create(user); err != nil {
		response.Error(c, 409, "Email sudah terdaftar")
		return
	}

	response.Created(c, "Registrasi berhasil", user)
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID, _ := c.Get("user_id")
	uid, _ := userID.(uint)

	user, err := h.userRepo.FindByID(uid)
	if err != nil {
		response.Error(c, 404, "Pengguna tidak ditemukan")
		return
	}

	response.OK(c, "Data pengguna", user)
}
