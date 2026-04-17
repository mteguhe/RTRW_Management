package handler

import (
	"strconv"
	"time"

	"rtrw/backend/internal/model"
	"rtrw/backend/internal/repository"
	"rtrw/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type AnnouncementHandler struct {
	repo *repository.AnnouncementRepository
}

func NewAnnouncementHandler(repo *repository.AnnouncementRepository) *AnnouncementHandler {
	return &AnnouncementHandler{repo: repo}
}

func (h *AnnouncementHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	category := c.Query("category")

	announcements, total, err := h.repo.FindAll(page, limit, category)
	if err != nil {
		response.Error(c, 500, "Gagal mengambil pengumuman")
		return
	}
	response.Paginated(c, "Daftar pengumuman", announcements, total, page, limit)
}

func (h *AnnouncementHandler) GetOne(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	a, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Pengumuman tidak ditemukan")
		return
	}
	response.OK(c, "Detail pengumuman", a)
}

type announcementRequest struct {
	Title    string `json:"title" binding:"required"`
	Content  string `json:"content" binding:"required"`
	Category string `json:"category" binding:"required,oneof=umum darurat kegiatan"`
}

func (h *AnnouncementHandler) Create(c *gin.Context) {
	var req announcementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	userID, _ := c.Get("user_id")
	uid, _ := userID.(uint)
	now := time.Now()
	a := &model.Announcement{
		Title:       req.Title,
		Content:     req.Content,
		Category:    req.Category,
		AuthorID:    uid,
		PublishedAt: &now,
	}
	if err := h.repo.Create(a); err != nil {
		response.Error(c, 500, "Gagal membuat pengumuman")
		return
	}
	response.Created(c, "Pengumuman berhasil dibuat", a)
}

func (h *AnnouncementHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	a, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Pengumuman tidak ditemukan")
		return
	}
	var req announcementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	a.Title = req.Title
	a.Content = req.Content
	a.Category = req.Category
	if err := h.repo.Update(a); err != nil {
		response.Error(c, 500, "Gagal memperbarui pengumuman")
		return
	}
	response.OK(c, "Pengumuman berhasil diperbarui", a)
}

func (h *AnnouncementHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.repo.Delete(uint(id)); err != nil {
		response.Error(c, 500, "Gagal menghapus pengumuman")
		return
	}
	response.OK(c, "Pengumuman berhasil dihapus", nil)
}
