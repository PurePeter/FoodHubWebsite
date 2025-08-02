const mongoose = require("mongoose");
require("dotenv").config(); // Để đọc biến môi trường từ file .env

// DEBUG: Thêm dòng này để kiểm tra xem biến môi trường đã được nạp đúng chưa
console.log("Giá trị MONGODB_URI được nạp:", process.env.MONGODB_URI);

const Dish = require("./models/Dish"); // Import model

// --- DỮ LIỆU MENU-LIST ---
// Đây là nơi bạn định nghĩa tất cả các món ăn sẽ được thêm vào cơ sở dữ liệu.
// Hãy chắc chắn rằng đường dẫn `imageUrl` là chính xác.
const menuListData = [
  {
    name: "Phở Bò",
    price: 55000,
    description: "Phở bò truyền thống với nước dùng đậm đà và thịt bò tươi.",
    imageUrl: "../assets/img/pho.jpg",
    category: "main_course",
  },
  {
    name: "Bún Chả",
    price: 50000,
    description:
      "Bún chả Hà Nội với thịt nướng thơm lừng và nước chấm chua ngọt.",
    imageUrl: "../assets/img/buncha.jpg",
    category: "main_course",
  },
  {
    name: "Cơm Tấm",
    price: 60000,
    description: "Cơm tấm sườn bì chả, một món ăn đặc trưng của miền Nam.",
    imageUrl: "../assets/img/comtam.jpg",
    category: "main_course",
  },
  {
    name: "Bánh Xèo",
    price: 45000,
    description: "Bánh xèo giòn rụm với nhân tôm thịt và giá đỗ.",
    imageUrl: "../assets/img/banhxeo.jpg",
    category: "appetizer",
  },
  {
    name: "Hamburger",
    price: 70000,
    description: "Hamburger bò với phô mai, rau diếp và cà chua.",
    imageUrl: "../assets/img/burger.jpg",
    category: "main_course",
  },
  {
    name: "Pizza",
    price: 120000,
    description: "Pizza hải sản với nhiều loại topping tươi ngon.",
    imageUrl: "../assets/img/pizza.jpg",
    category: "main_course",
  },
  {
    name: "Spaghetti",
    price: 85000,
    description: "Mì Ý sốt bò bằm cổ điển.",
    imageUrl: "../assets/img/spaghetti.jpg",
    category: "main_course",
  },
  {
    name: "Bò Bít Tết",
    price: 150000,
    description: "Bò bít tết nhập khẩu dùng kèm khoai tây chiên và salad.",
    imageUrl: "../assets/img/steak.jpg",
    category: "main_course",
  },
  {
    name: "Salad Trộn",
    price: 40000,
    description: "Salad rau củ tươi ngon với sốt dầu giấm.",
    imageUrl: "../assets/img/salad.jpg",
    category: "appetizer",
  },
  {
    name: "Nước ngọt có ga",
    price: 20000,
    description: "Nước ngọt mát lạnh (Coca-cola, Pepsi, Sprite).",
    imageUrl: "../assets/img/nuoc-ngot-co-ga.jpg",
    category: "drink",
  },
  {
    name: "Nước Cam Ép",
    price: 30000,
    description: "Nước cam ép nguyên chất, không đường.",
    imageUrl: "../assets/img/orange-juice.jpg",
    category: "drink",
  },
  {
    name: "Món Tiramisu",
    price: 40000,
    description: "Món tráng miệng mát lạnh ngon ngọt được yêu thích",
    imageUrl: "../assets/img/tiramisu.jpg",
    category: "dessert",
  },
];

const seedDB = async () => {
  try {
    // Kết nối tới MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Đã kết nối tới MongoDB Atlas!");

    // Xóa dữ liệu cũ (tùy chọn, hữu ích khi chạy lại script nhiều lần)
    await Dish.deleteMany({});
    console.log('Đã xóa dữ liệu cũ trong collection "dishes".');

    // Thêm dữ liệu mới
    await Dish.insertMany(menuListData);
    console.log("Đã thêm dữ liệu món ăn thành công!");
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
  } finally {
    // Đóng kết nối sau khi hoàn tất
    mongoose.connection.close();
    console.log("Đã đóng kết nối MongoDB.");
  }
};

seedDB();
