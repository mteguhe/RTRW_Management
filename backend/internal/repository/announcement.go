package repository

import (
	"rtrw/backend/internal/model"

	"gorm.io/gorm"
)

type AnnouncementRepository struct {
	db *gorm.DB
}

func NewAnnouncementRepository(db *gorm.DB) *AnnouncementRepository {
	return &AnnouncementRepository{db: db}
}

func (r *AnnouncementRepository) FindAll(page, limit int, category string) ([]model.Announcement, int64, error) {
	var announcements []model.Announcement
	var total int64
	q := r.db.Model(&model.Announcement{}).Preload("Author")
	if category != "" {
		q = q.Where("category = ?", category)
	}
	q.Count(&total)
	err := q.Order("created_at DESC").Offset((page - 1) * limit).Limit(limit).Find(&announcements).Error
	return announcements, total, err
}

func (r *AnnouncementRepository) FindByID(id uint) (*model.Announcement, error) {
	var a model.Announcement
	if err := r.db.Preload("Author").First(&a, id).Error; err != nil {
		return nil, err
	}
	return &a, nil
}

func (r *AnnouncementRepository) Create(a *model.Announcement) error {
	return r.db.Create(a).Error
}

func (r *AnnouncementRepository) Update(a *model.Announcement) error {
	return r.db.Save(a).Error
}

func (r *AnnouncementRepository) Delete(id uint) error {
	return r.db.Delete(&model.Announcement{}, id).Error
}
