package handler

import (
	"strconv"

	"rtrw/backend/internal/repository"
	"rtrw/backend/pkg/response"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	repo *repository.UserRepository
}

func NewUserHandler(repo *repository.UserRepository) *UserHandler {
	return &UserHandler{repo: repo}
}

func (h *UserHandler) GetRTAccounts(c *gin.Context) {
	users, err := h.repo.FindByRole("admin_rt")
	if err != nil {
		response.Error(c, 500, "Gagal mengambil data akun RT")
		return
	}
	response.OK(c, "Daftar akun RT", users)
}

type updateUserRequest struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var req updateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, err.Error())
		return
	}

	user, err := h.repo.FindByID(uint(id))
	if err != nil {
		response.Error(c, 404, "Pengguna tidak ditemukan")
		return
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			response.Error(c, 500, "Gagal memproses kata sandi")
			return
		}
		user.Password = string(hash)
	}

	if err := h.repo.Update(user); err != nil {
		response.Error(c, 500, "Gagal memperbarui akun")
		return
	}
	response.OK(c, "Akun berhasil diperbarui", user)
}
