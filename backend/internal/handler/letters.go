package handler

import (
	"fmt"
	"strconv"

	"rtrw/backend/internal/model"
	"rtrw/backend/internal/repository"
	"rtrw/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type LetterHandler struct {
	repo         *repository.LetterRepository
	residentRepo *repository.ResidentRepository
}

func NewLetterHandler(repo *repository.LetterRepository, residentRepo *repository.ResidentRepository) *LetterHandler {
	return &LetterHandler{repo: repo, residentRepo: residentRepo}
}

func (h *LetterHandler) GetAll(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")
	role, _ := c.Get("role")
	userID, _ := c.Get("user_id")
	noRTVal, _ := c.Get("no_rt")
	uid, _ := userID.(uint)
	noRT, _ := noRTVal.(uint)

	letters, total, err := h.repo.FindAll(page, limit, status, role.(string), uid, noRT)
	if err != nil {
		response.Error(c, 500, "Gagal mengambil data surat")
		return
	}
	response.Paginated(c, "Daftar surat", letters, total, page, limit)
}

func (h *LetterHandler) GetOne(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	letter, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Surat tidak ditemukan")
		return
	}
	response.OK(c, "Detail surat", letter)
}

type letterRequest struct {
	ResidentID uint   `json:"resident_id" binding:"required"`
	Type       string `json:"type" binding:"required,oneof=domisili pengantar"`
	Purpose    string `json:"purpose" binding:"required"`
}

func (h *LetterHandler) Create(c *gin.Context) {
	var req letterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}
	userID, _ := c.Get("user_id")
	uid, _ := userID.(uint)

	letter := &model.Letter{
		UserID:     uid,
		ResidentID: req.ResidentID,
		Type:       req.Type,
		Purpose:    req.Purpose,
		Status:     model.LetterStatusPendingRT,
	}
	if err := h.repo.Create(letter); err != nil {
		response.Error(c, 500, "Gagal mengajukan surat")
		return
	}
	response.Created(c, "Surat berhasil diajukan", letter)
}

type reviewRequest struct {
	Notes string `json:"notes"`
}

func (h *LetterHandler) ApproveRT(c *gin.Context) {
	h.reviewLetter(c, "approve_rt")
}

func (h *LetterHandler) RejectRT(c *gin.Context) {
	h.reviewLetter(c, "reject_rt")
}

func (h *LetterHandler) ApproveRW(c *gin.Context) {
	h.reviewLetter(c, "approve_rw")
}

func (h *LetterHandler) RejectRW(c *gin.Context) {
	h.reviewLetter(c, "reject_rw")
}

func (h *LetterHandler) reviewLetter(c *gin.Context, action string) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req reviewRequest
	_ = c.ShouldBindJSON(&req)

	letter, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Surat tidak ditemukan")
		return
	}

	reviewerID, _ := c.Get("user_id")
	noRTVal, _ := c.Get("no_rt")
	uid, _ := reviewerID.(uint)
	noRT, _ := noRTVal.(uint)

	switch action {
	case "approve_rt":
		if letter.Status != model.LetterStatusPendingRT {
			response.Error(c, 400, "Status surat tidak valid untuk aksi ini")
			return
		}
		if noRT > 0 && letter.Resident.NoRT != noRT {
			response.Error(c, 403, "Anda hanya dapat menyetujui surat warga RT Anda sendiri")
			return
		}
		letter.Status = model.LetterStatusPendingRW
		letter.NotesRT = req.Notes
		letter.ReviewedByRT = &uid
	case "reject_rt":
		if letter.Status != model.LetterStatusPendingRT {
			response.Error(c, 400, "Status surat tidak valid untuk aksi ini")
			return
		}
		if noRT > 0 && letter.Resident.NoRT != noRT {
			response.Error(c, 403, "Anda hanya dapat menolak surat warga RT Anda sendiri")
			return
		}
		letter.Status = model.LetterStatusRejectedRT
		letter.NotesRT = req.Notes
		letter.ReviewedByRT = &uid
	case "approve_rw":
		if letter.Status != model.LetterStatusPendingRW {
			response.Error(c, 400, "Status surat tidak valid untuk aksi ini")
			return
		}
		letter.Status = model.LetterStatusDone
		letter.NotesRW = req.Notes
		letter.ReviewedByRW = &uid
		letter.FileURL = fmt.Sprintf("/api/letters/%d/download", letter.ID)
	case "reject_rw":
		if letter.Status != model.LetterStatusPendingRW {
			response.Error(c, 400, "Status surat tidak valid untuk aksi ini")
			return
		}
		letter.Status = model.LetterStatusRejectedRW
		letter.NotesRW = req.Notes
		letter.ReviewedByRW = &uid
	}

	if err := h.repo.Update(letter); err != nil {
		response.Error(c, 500, "Gagal memperbarui surat")
		return
	}
	response.OK(c, "Surat berhasil diperbarui", letter)
}

func (h *LetterHandler) Download(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	letter, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Surat tidak ditemukan")
		return
	}
	if letter.Status != model.LetterStatusDone {
		response.Error(c, 400, "Surat belum disetujui")
		return
	}

	letterType := "Pengantar"
	if letter.Type == "domisili" {
		letterType = "Keterangan Domisili"
	}

	html := fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Surat %s - No. %d</title>
<style>
  body { font-family: 'Times New Roman', serif; margin: 60px; color: #000; }
  .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 16px; margin-bottom: 24px; }
  .header h1 { font-size: 18px; font-weight: bold; margin: 0; }
  .header h2 { font-size: 14px; font-weight: bold; margin: 4px 0; }
  .header p { font-size: 11px; margin: 2px 0; }
  .title { text-align: center; margin: 24px 0; }
  .title h3 { font-size: 16px; font-weight: bold; text-decoration: underline; text-transform: uppercase; }
  .title p { font-size: 12px; }
  table { width: 100%%; margin: 20px 0; }
  td { font-size: 12px; padding: 4px 8px; vertical-align: top; }
  td:first-child { width: 180px; }
  td:nth-child(2) { width: 16px; }
  .content { font-size: 12px; line-height: 1.8; margin: 20px 0; text-align: justify; }
  .signature { margin-top: 60px; text-align: right; }
  .signature p { font-size: 12px; }
  .signature .name { font-weight: bold; margin-top: 80px; text-decoration: underline; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
<div class="header">
  <h1>RUKUN WARGA 017</h1>
  <h2>KELURAHAN CENGKARENG TIMUR — KECAMATAN CENGKARENG</h2>
  <h2>KOTA ADMINISTRASI JAKARTA BARAT</h2>
  <p>Rusun Cinta Kasih Tzu Chi, Jl. Daan Mogot KM 16, Cengkareng Timur</p>
  <p>Email: rw017.cintakasih@gmail.com</p>
</div>
<div class="title">
  <h3>Surat %s</h3>
  <p>Nomor: %d/RW017/SK/%d</p>
</div>
<div class="content">
  <p>Yang bertanda tangan di bawah ini, Ketua RW 017 Kelurahan Cengkareng Timur, Kecamatan Cengkareng, Kota Administrasi Jakarta Barat, menerangkan bahwa:</p>
</div>
<table>
  <tr><td>Nama Lengkap</td><td>:</td><td><strong>%s</strong></td></tr>
  <tr><td>NIK</td><td>:</td><td>%s</td></tr>
  <tr><td>No. KK</td><td>:</td><td>%s</td></tr>
  <tr><td>Alamat</td><td>:</td><td>%s, Blok %s</td></tr>
  <tr><td>Tempat / Tgl Lahir</td><td>:</td><td>%s / %s</td></tr>
  <tr><td>Jenis Kelamin</td><td>:</td><td>%s</td></tr>
  <tr><td>Agama</td><td>:</td><td>%s</td></tr>
  <tr><td>Status Pernikahan</td><td>:</td><td>%s</td></tr>
  <tr><td>Status Warga</td><td>:</td><td>%s</td></tr>
</table>
<div class="content">
  <p>Adalah benar merupakan warga yang berdomisili di wilayah RW 017 Kelurahan Cengkareng Timur, Rusun Cinta Kasih Tzu Chi.</p>
  <p>Surat keterangan ini dibuat untuk keperluan: <strong>%s</strong></p>
  <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
</div>
<div class="signature">
  <p>Jakarta, %s</p>
  <p>Ketua RW 017</p>
  <p class="name">____________________</p>
</div>
</body>
</html>`,
		letterType, letter.ID,
		letterType, letter.ID, letter.CreatedAt.Year(),
		letter.Resident.Nama,
		letter.Resident.NIK,
		letter.Resident.NoKK,
		letter.Resident.Alamat, letter.Resident.Blok,
		letter.Resident.TempatLahir, letter.Resident.TanggalLahir,
		letter.Resident.JenisKelamin,
		letter.Resident.Agama,
		letter.Resident.StatusPernikahan,
		letter.Resident.StatusWarga,
		letter.Purpose,
		letter.UpdatedAt.Format("02 January 2006"),
	)

	c.Header("Content-Type", "text/html; charset=utf-8")
	c.Header("Content-Disposition", fmt.Sprintf(`inline; filename="surat-%d.html"`, letter.ID))
	c.String(200, html)
}
