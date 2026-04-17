package handler

import (
	"strconv"

	"rtrw/backend/internal/model"
	"rtrw/backend/internal/repository"
	"rtrw/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type ResidentHandler struct {
	repo *repository.ResidentRepository
}

func NewResidentHandler(repo *repository.ResidentRepository) *ResidentHandler {
	return &ResidentHandler{repo: repo}
}

func (h *ResidentHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")
	role, _ := c.Get("role")
	noRTVal, _ := c.Get("no_rt")
	noRT, _ := noRTVal.(uint)
	// admin_rt only sees their own RT's residents
	if role != "admin_rt" {
		noRT = 0
	}

	residents, total, err := h.repo.FindAll(page, limit, search, noRT)
	if err != nil {
		response.Error(c, 500, "Gagal mengambil data warga")
		return
	}
	response.Paginated(c, "Data warga", residents, total, page, limit)
}

func (h *ResidentHandler) GetOne(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	resident, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Warga tidak ditemukan")
		return
	}
	response.OK(c, "Data warga", resident)
}

func (h *ResidentHandler) GetFamily(c *gin.Context) {
	noKK := c.Param("no_kk")
	residents, err := h.repo.FindByNoKK(noKK)
	if err != nil {
		response.Error(c, 500, "Gagal mengambil data keluarga")
		return
	}
	response.OK(c, "Data keluarga", residents)
}

func (h *ResidentHandler) Create(c *gin.Context) {
	var resident model.Resident
	if err := c.ShouldBindJSON(&resident); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	if err := h.repo.Create(&resident); err != nil {
		response.Error(c, 409, "NIK sudah terdaftar")
		return
	}
	response.Created(c, "Warga berhasil ditambahkan", resident)
}

func (h *ResidentHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	resident, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Warga tidak ditemukan")
		return
	}
	if err := c.ShouldBindJSON(resident); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	resident.ID = uint(id)
	if err := h.repo.Update(resident); err != nil {
		response.Error(c, 500, "Gagal memperbarui data warga")
		return
	}
	response.OK(c, "Data warga berhasil diperbarui", resident)
}

func (h *ResidentHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.repo.Delete(uint(id)); err != nil {
		response.Error(c, 500, "Gagal menghapus data warga")
		return
	}
	response.OK(c, "Warga berhasil dihapus", nil)
}
