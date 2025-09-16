// =================================================================
// FILE CẤU HÌNH MÔI TRƯỜNG
// =================================================================
// Thay đổi giá trị của ENVIRONMENT thành "development" hoặc "production"
// để chuyển đổi giữa API local và API đã triển khai.
//
// - "development": Sử dụng server backend chạy ở máy của bạn (localhost).
// - "production": Sử dụng server backend đã triển khai trên Render.
// =================================================================

const ENVIRONMENT = "development"; // <-- THAY ĐỔI Ở ĐÂY

const API_URLS = {
  development: "http://localhost:3001/api",
  production: "https://food-hub-backend-086n.onrender.com/api",
};

const API_BASE_URL = API_URLS[ENVIRONMENT];
