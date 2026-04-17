package repository

import (
	"rtrw/backend/internal/model"

	"gorm.io/gorm"
)

type ResidentRepository struct {
	db *gorm.DB
}

func NewResidentRepository(db *gorm.DB) *ResidentRepository {
	return &ResidentRepository{db: db}
}

func (r *ResidentRepository) FindAll(page, limit int, search string, noRT uint) ([]model.Resident, int64, error) {
	var residents []model.Resident
	var total int64
	q := r.db.Model(&model.Resident{})
	if noRT > 0 {
		q = q.Where("no_rt = ?", noRT)
	}
	if search != "" {
		q = q.Where("nama LIKE ? OR nik LIKE ? OR no_kk LIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}
	q.Count(&total)
	err := q.Offset((page - 1) * limit).Limit(limit).Find(&residents).Error
	return residents, total, err
}

func (r *ResidentRepository) FindByID(id uint) (*model.Resident, error) {
	var resident model.Resident
	if err := r.db.First(&resident, id).Error; err != nil {
		return nil, err
	}
	return &resident, nil
}

func (r *ResidentRepository) FindByNoKK(noKK string) ([]model.Resident, error) {
	var residents []model.Resident
	err := r.db.Where("no_kk = ?", noKK).Find(&residents).Error
	return residents, err
}

func (r *ResidentRepository) FindByNIK(nik string) (*model.Resident, error) {
	var resident model.Resident
	if err := r.db.Where("nik = ?", nik).First(&resident).Error; err != nil {
		return nil, err
	}
	return &resident, nil
}

func (r *ResidentRepository) Create(resident *model.Resident) error {
	return r.db.Create(resident).Error
}

func (r *ResidentRepository) Update(resident *model.Resident) error {
	return r.db.Save(resident).Error
}

func (r *ResidentRepository) Delete(id uint) error {
	return r.db.Delete(&model.Resident{}, id).Error
}

func (r *ResidentRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&model.Resident{}).Where("status_warga = ?", "aktif").Count(&count).Error
	return count, err
}
