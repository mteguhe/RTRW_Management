package config

import (
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	DBDsn      string
	JWTSecret  string
	JWTExpiry  time.Duration
	Port       string
	CORSOrigin string
}

func Load() *Config {
	_ = godotenv.Load()

	expiry, err := time.ParseDuration(getEnv("JWT_EXPIRY", "24h"))
	if err != nil {
		expiry = 24 * time.Hour
	}

	return &Config{
		DBDsn:      getEnv("DB_DSN", "root:password@tcp(127.0.0.1:3306)/rtrw_db?charset=utf8mb4&parseTime=True&loc=Local"),
		JWTSecret:  getEnv("JWT_SECRET", "secret-key"),
		JWTExpiry:  expiry,
		Port:       getEnv("PORT", "8080"),
		CORSOrigin: getEnv("CORS_ORIGIN", "http://localhost:3000"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
