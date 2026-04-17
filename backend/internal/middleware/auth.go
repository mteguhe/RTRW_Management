package middleware

import (
	"strings"

	jwtpkg "rtrw/backend/pkg/jwt"
	"rtrw/backend/pkg/response"

	"github.com/gin-gonic/gin"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			response.Error(c, 401, "Token tidak ditemukan")
			return
		}
		token := strings.TrimPrefix(header, "Bearer ")
		claims, err := jwtpkg.Validate(token)
		if err != nil {
			response.Error(c, 401, "Token tidak valid")
			return
		}
		c.Set("user_id", claims.UserID)
		c.Set("role", claims.Role)
		c.Set("no_rt", claims.NoRT)
		c.Next()
	}
}

func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, _ := c.Get("role")
		roleStr, _ := role.(string)
		for _, r := range roles {
			if r == roleStr {
				c.Next()
				return
			}
		}
		response.Error(c, 403, "Akses ditolak")
	}
}
