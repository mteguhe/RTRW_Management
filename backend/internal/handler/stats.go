package handler

import (
	"rtrw/backend/internal/repository"
	"rtrw/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	residentRepo *repository.ResidentRepository
	letterRepo   *repository.LetterRepository
	financeRepo  *repository.FinanceRepository
}

func NewStatsHandler(rr *repository.ResidentRepository, lr *repository.LetterRepository, fr *repository.FinanceRepository) *StatsHandler {
	return &StatsHandler{residentRepo: rr, letterRepo: lr, financeRepo: fr}
}

func (h *StatsHandler) Get(c *gin.Context) {
	totalWarga, _ := h.residentRepo.Count()
	pendingSurat, _ := h.letterRepo.CountPending()
	kasRT, _ := h.financeRepo.GetSummary("rt")
	kasRW, _ := h.financeRepo.GetSummary("rw")

	response.OK(c, "Statistik dashboard", map[string]interface{}{
		"total_warga":   totalWarga,
		"pending_surat": pendingSurat,
		"kas_rt":        kasRT,
		"kas_rw":        kasRW,
	})
}
