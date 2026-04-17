package repository

import (
	"rtrw/backend/internal/model"

	"gorm.io/gorm"
)

type FinanceRepository struct {
	db *gorm.DB
}

func NewFinanceRepository(db *gorm.DB) *FinanceRepository {
	return &FinanceRepository{db: db}
}

func (r *FinanceRepository) FindAll(page, limit int, scope, ftype string) ([]model.Finance, int64, error) {
	var finances []model.Finance
	var total int64
	q := r.db.Model(&model.Finance{}).Preload("Creator")
	if scope != "" {
		q = q.Where("scope = ?", scope)
	}
	if ftype != "" {
		q = q.Where("type = ?", ftype)
	}
	q.Count(&total)
	err := q.Order("date DESC").Offset((page - 1) * limit).Limit(limit).Find(&finances).Error
	return finances, total, err
}

func (r *FinanceRepository) Create(f *model.Finance) error {
	return r.db.Create(f).Error
}

type FinanceSummary struct {
	Scope        string  `json:"scope"`
	TotalIncome  float64 `json:"total_income"`
	TotalExpense float64 `json:"total_expense"`
	Balance      float64 `json:"balance"`
}

func (r *FinanceRepository) GetSummary(scope string) (*FinanceSummary, error) {
	var income, expense float64
	r.db.Model(&model.Finance{}).
		Where("scope = ? AND type = ?", scope, "income").
		Select("COALESCE(SUM(amount), 0)").Scan(&income)
	r.db.Model(&model.Finance{}).
		Where("scope = ? AND type = ?", scope, "expense").
		Select("COALESCE(SUM(amount), 0)").Scan(&expense)
	return &FinanceSummary{
		Scope:        scope,
		TotalIncome:  income,
		TotalExpense: expense,
		Balance:      income - expense,
	}, nil
}
