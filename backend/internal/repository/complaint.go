package repository

import (
	"rtrw/backend/internal/model"

	"gorm.io/gorm"
)

type ComplaintRepository struct {
	db *gorm.DB
}

func NewComplaintRepository(db *gorm.DB) *ComplaintRepository {
	return &ComplaintRepository{db: db}
}

func (r *ComplaintRepository) FindAll(page, limit int, status, role string, userID uint) ([]model.Complaint, int64, error) {
	var complaints []model.Complaint
	var total int64
	q := r.db.Model(&model.Complaint{}).Preload("User")
	if status != "" {
		q = q.Where("status = ?", status)
	}
	if role == "warga" {
		q = q.Where("user_id = ?", userID)
	}
	q.Count(&total)
	err := q.Order("created_at DESC").Offset((page - 1) * limit).Limit(limit).Find(&complaints).Error
	return complaints, total, err
}

func (r *ComplaintRepository) FindByID(id uint) (*model.Complaint, error) {
	var c model.Complaint
	if err := r.db.Preload("User").First(&c, id).Error; err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *ComplaintRepository) Create(c *model.Complaint) error {
	return r.db.Create(c).Error
}

func (r *ComplaintRepository) Update(c *model.Complaint) error {
	return r.db.Save(c).Error
}
