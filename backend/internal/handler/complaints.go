package handler

import (
	"strconv"

	"rtrw/backend/internal/model"
	"rtrw/backend/internal/repository"
	"rtrw/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type ComplaintHandler struct {
	repo *repository.ComplaintRepository
}

func NewComplaintHandler(repo *repository.ComplaintRepository) *ComplaintHandler {
	return &ComplaintHandler{repo: repo}
}

func (h *ComplaintHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")
	role, _ := c.Get("role")
	userID, _ := c.Get("user_id")
	uid, _ := userID.(uint)

	complaints, total, err := h.repo.FindAll(page, limit, status, role.(string), uid)
	if err != nil {
		response.Error(c, 500, "Gagal mengambil pengaduan")
		return
	}
	response.Paginated(c, "Daftar pengaduan", complaints, total, page, limit)
}

func (h *ComplaintHandler) GetOne(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	complaint, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Pengaduan tidak ditemukan")
		return
	}
	response.OK(c, "Detail pengaduan", complaint)
}

type complaintRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
}

func (h *ComplaintHandler) Create(c *gin.Context) {
	var req complaintRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	userID, _ := c.Get("user_id")
	uid, _ := userID.(uint)

	complaint := &model.Complaint{
		UserID:      uid,
		Title:       req.Title,
		Description: req.Description,
		Status:      "open",
	}
	if err := h.repo.Create(complaint); err != nil {
		response.Error(c, 500, "Gagal membuat pengaduan")
		return
	}
	response.Created(c, "Pengaduan berhasil dikirim", complaint)
}

type statusUpdateRequest struct {
	Status   string `json:"status" binding:"required,oneof=open in_progress resolved"`
	Response string `json:"response"`
}

func (h *ComplaintHandler) UpdateStatus(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	complaint, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Pengaduan tidak ditemukan")
		return
	}
	var req statusUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	userID, _ := c.Get("user_id")
	uid, _ := userID.(uint)

	complaint.Status = req.Status
	complaint.Response = req.Response
	complaint.RespondedBy = &uid

	if err := h.repo.Update(complaint); err != nil {
		response.Error(c, 500, "Gagal memperbarui status pengaduan")
		return
	}
	response.OK(c, "Status pengaduan berhasil diperbarui", complaint)
}
