package handler

import (
	"strconv"

	"rtrw/backend/internal/model"
	"rtrw/backend/internal/repository"
	"rtrw/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type FinanceHandler struct {
	repo *repository.FinanceRepository
}

func NewFinanceHandler(repo *repository.FinanceRepository) *FinanceHandler {
	return &FinanceHandler{repo: repo}
}

func (h *FinanceHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	scope := c.Query("scope")
	ftype := c.Query("type")

	finances, total, err := h.repo.FindAll(page, limit, scope, ftype)
	if err != nil {
		response.Error(c, 500, "Gagal mengambil data keuangan")
		return
	}
	response.Paginated(c, "Data keuangan", finances, total, page, limit)
}

func (h *FinanceHandler) GetSummary(c *gin.Context) {
	scope := c.DefaultQuery("scope", "rt")
	summary, err := h.repo.GetSummary(scope)
	if err != nil {
		response.Error(c, 500, "Gagal mengambil ringkasan keuangan")
		return
	}
	response.OK(c, "Ringkasan keuangan", summary)
}

type financeRequest struct {
	Scope       string  `json:"scope" binding:"required,oneof=rt rw"`
	Type        string  `json:"type" binding:"required,oneof=income expense"`
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	Description string  `json:"description"`
	Date        string  `json:"date" binding:"required"`
}

func (h *FinanceHandler) Create(c *gin.Context) {
	var req financeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	userID, _ := c.Get("user_id")
	uid, _ := userID.(uint)

	f := &model.Finance{
		Scope:       req.Scope,
		Type:        req.Type,
		Amount:      req.Amount,
		Description: req.Description,
		Date:        req.Date,
		CreatedBy:   uid,
	}
	if err := h.repo.Create(f); err != nil {
		response.Error(c, 500, "Gagal mencatat transaksi")
		return
	}
	response.Created(c, "Transaksi berhasil dicatat", f)
}
