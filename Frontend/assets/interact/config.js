// Biến này sẽ quyết định dùng API nào
// - 'development': Dùng khi chỉ chạy trên máy tính (sử dụng localhost).
// - 'lan': Dùng khi cần test trên các thiết bị khác trong cùng mạng WiFi (điện thoại, máy tính bảng).
// - 'production': Dùng khi deploy website lên internet.
const ENVIRONMENT = "development"; // <-- CHỈ CẦN THAY ĐỔI Ở ĐÂY

// =================================================================
// QUAN TRỌNG: Thay 'YOUR_COMPUTER_IP' bằng địa chỉ IP của máy bạn
// Cách lấy IP: Mở Command Prompt (cmd) và gõ 'ipconfig'
// Tìm dòng "IPv4 Address" trong kết nối WiFi của bạn.
const LAN_IP_ADDRESS = "192.168.1.48"; // Ví dụ: "192.168.1.10"
// =================================================================

const API_URLS = {
  development: "http://localhost:3001/api",
  lan: `http://${LAN_IP_ADDRESS}:3001/api`,
  production: "https://food-hub-backend-086n.onrender.com/api",
};

const API_BASE_URL = API_URLS[ENVIRONMENT];
