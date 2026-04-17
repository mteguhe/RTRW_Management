package model

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleAdminRW Role = "admin_rw"
	RoleAdminRT Role = "admin_rt"
	RoleWarga   Role = "warga"
	RoleGuest   Role = "guest"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string         `json:"name" gorm:"not null;size:255"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null;size:255"`
	Password  string         `json:"-" gorm:"not null;size:255"`
	Role      Role           `json:"role" gorm:"type:enum('admin_rw','admin_rt','warga','guest');not null;default:'warga'"`
	NoRT      uint           `json:"no_rt" gorm:"default:0"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

type Resident struct {
	ID               uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID           *uint          `json:"user_id"`
	User             *User          `json:"user,omitempty" gorm:"foreignKey:UserID"`
	NIK              string         `json:"nik" gorm:"uniqueIndex;not null;size:16"`
	NoKK             string         `json:"no_kk" gorm:"not null;size:16;index"`
	Nama             string         `json:"nama" gorm:"not null;size:255"`
	Alamat           string         `json:"alamat" gorm:"type:text"`
	NoRT             uint           `json:"no_rt" gorm:"default:0;index"`
	Blok             string         `json:"blok" gorm:"size:20"`
	Lantai           string         `json:"lantai" gorm:"size:10"`
	StatusPernikahan string         `json:"status_pernikahan" gorm:"type:enum('lajang','kawin','cerai_hidup','cerai_mati')"`
	Agama            string         `json:"agama" gorm:"type:enum('islam','kristen','katolik','hindu','budha','other')"`
	TempatLahir      string         `json:"tempat_lahir" gorm:"size:100"`
	TanggalLahir     string         `json:"tanggal_lahir" gorm:"type:date"`
	JenisKelamin     string         `json:"jenis_kelamin" gorm:"type:enum('pria','wanita')"`
	StatusWarga      string         `json:"status_warga" gorm:"type:enum('aktif','tidak_aktif');default:'aktif'"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `json:"-" gorm:"index"`
}

type Announcement struct {
	ID          uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string     `json:"title" gorm:"not null;size:255"`
	Content     string     `json:"content" gorm:"type:text;not null"`
	Category    string     `json:"category" gorm:"type:enum('umum','darurat','kegiatan');not null"`
	AuthorID    uint       `json:"author_id" gorm:"not null"`
	Author      User       `json:"author" gorm:"foreignKey:AuthorID"`
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time  `json:"created_at"`
}

type LetterStatus string

const (
	LetterStatusPendingRT  LetterStatus = "pending_rt"
	LetterStatusApprovedRT LetterStatus = "approved_rt"
	LetterStatusRejectedRT LetterStatus = "rejected_rt"
	LetterStatusPendingRW  LetterStatus = "pending_rw"
	LetterStatusApprovedRW LetterStatus = "approved_rw"
	LetterStatusRejectedRW LetterStatus = "rejected_rw"
	LetterStatusDone       LetterStatus = "done"
)

type Letter struct {
	ID           uint         `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID       uint         `json:"user_id" gorm:"not null"`
	User         User         `json:"user" gorm:"foreignKey:UserID"`
	ResidentID   uint         `json:"resident_id" gorm:"not null"`
	Resident     Resident     `json:"resident" gorm:"foreignKey:ResidentID"`
	Type         string       `json:"type" gorm:"type:enum('domisili','pengantar');not null"`
	Status       LetterStatus `json:"status" gorm:"type:enum('pending_rt','approved_rt','rejected_rt','pending_rw','approved_rw','rejected_rw','done');default:'pending_rt'"`
	Purpose      string       `json:"purpose" gorm:"type:text"`
	NotesRT      string       `json:"notes_rt" gorm:"type:text"`
	NotesRW      string       `json:"notes_rw" gorm:"type:text"`
	ReviewedByRT *uint        `json:"reviewed_by_rt"`
	ReviewedByRW *uint        `json:"reviewed_by_rw"`
	FileURL      string       `json:"file_url" gorm:"size:500"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
}

type Finance struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Scope       string    `json:"scope" gorm:"type:enum('rt','rw');not null"`
	Type        string    `json:"type" gorm:"type:enum('income','expense');not null"`
	Amount      float64   `json:"amount" gorm:"type:decimal(15,2);not null"`
	Description string    `json:"description" gorm:"type:text"`
	Date        string    `json:"date" gorm:"type:date;not null"`
	CreatedBy   uint      `json:"created_by" gorm:"not null"`
	Creator     User      `json:"creator" gorm:"foreignKey:CreatedBy"`
	CreatedAt   time.Time `json:"created_at"`
}

type Complaint struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID      uint      `json:"user_id" gorm:"not null"`
	User        User      `json:"user" gorm:"foreignKey:UserID"`
	Title       string    `json:"title" gorm:"not null;size:255"`
	Description string    `json:"description" gorm:"type:text;not null"`
	Status      string    `json:"status" gorm:"type:enum('open','in_progress','resolved');default:'open'"`
	Response    string    `json:"response" gorm:"type:text"`
	RespondedBy *uint     `json:"responded_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
