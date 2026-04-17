package response

import "github.com/gin-gonic/gin"

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type PaginatedResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Meta    Meta        `json:"meta"`
}

type Meta struct {
	Total  int64 `json:"total"`
	Page   int   `json:"page"`
	Limit  int   `json:"limit"`
	Pages  int64 `json:"pages"`
}

func OK(c *gin.Context, message string, data interface{}) {
	c.JSON(200, Response{Success: true, Message: message, Data: data})
}

func Created(c *gin.Context, message string, data interface{}) {
	c.JSON(201, Response{Success: true, Message: message, Data: data})
}

func Error(c *gin.Context, code int, message string) {
	c.AbortWithStatusJSON(code, Response{Success: false, Message: message})
}

func Paginated(c *gin.Context, message string, data interface{}, total int64, page, limit int) {
	pages := total / int64(limit)
	if total%int64(limit) > 0 {
		pages++
	}
	c.JSON(200, PaginatedResponse{
		Success: true,
		Message: message,
		Data:    data,
		Meta:    Meta{Total: total, Page: page, Limit: limit, Pages: pages},
	})
}
