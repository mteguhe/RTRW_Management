package repository

import (
	"rtrw/backend/internal/model"

	"gorm.io/gorm"
)

type LetterRepository struct {
	db *gorm.DB
}

func NewLetterRepository(db *gorm.DB) *LetterRepository {
	return &LetterRepository{db: db}
}

func (r *LetterRepository) FindAll(page, limit int, status, role string, userID, noRT uint) ([]model.Letter, int64, error) {
	var letters []model.Letter
	var total int64
	q := r.db.Model(&model.Letter{}).Preload("User").Preload("Resident")
	if status != "" {
		q = q.Where("letters.status = ?", status)
	}
	switch role {
	case "warga":
		q = q.Where("letters.user_id = ?", userID)
	case "admin_rt":
		if noRT > 0 {
			q = q.Joins("JOIN residents ON residents.id = letters.resident_id AND residents.deleted_at IS NULL").
				Where("residents.no_rt = ?", noRT)
		}
	}
	q.Count(&total)
	err := q.Order("letters.created_at DESC").Offset((page - 1) * limit).Limit(limit).Find(&letters).Error
	return letters, total, err
}

func (r *LetterRepository) FindByID(id uint) (*model.Letter, error) {
	var letter model.Letter
	if err := r.db.Preload("User").Preload("Resident").First(&letter, id).Error; err != nil {
		return nil, err
	}
	return &letter, nil
}

func (r *LetterRepository) Create(letter *model.Letter) error {
	return r.db.Create(letter).Error
}

func (r *LetterRepository) Update(letter *model.Letter) error {
	return r.db.Save(letter).Error
}

func (r *LetterRepository) CountPending() (int64, error) {
	var count int64
	err := r.db.Model(&model.Letter{}).
		Where("status IN ?", []string{"pending_rt", "pending_rw"}).
		Count(&count).Error
	return count, err
}
