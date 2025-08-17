const mongoose = require("mongoose");
require("dotenv").config(); // Để đọc biến môi trường từ file .env
const fs = require("fs"); // Import module fs để đọc file
const path = require("path"); // Import module path để xử lý đường dẫn

// DEBUG: Thêm dòng này để kiểm tra xem biến môi trường đã được nạp đúng chưa
console.log("Giá trị MONGODB_URI được nạp:", process.env.MONGODB_URI);

const Dish = require("./models/Dish"); // Import model
const BannerSlide = require("./models/BannerSlide"); // Import BannerSlide model

// Hàm để đọc file ảnh và trả về Buffer cùng với contentType
async function getImageData(imagePath) {
  const fullPath = path.join(__dirname, imagePath); // Tạo đường dẫn tuyệt đối
  const imageData = fs.readFileSync(fullPath); // Đọc file ảnh
  const ext = path.extname(fullPath).toLowerCase(); // Lấy phần mở rộng của file

  let contentType = "application/octet-stream"; // Mặc định
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".gif":
      contentType = "image/gif";
      break;
    case ".webp":
      contentType = "image/webp";
      break;
    // Thêm các loại ảnh khác nếu cần
  }
  return { imageData, contentType };
}

// --- DỮ LIỆU MENU-LIST ---
// Đây là nơi bạn định nghĩa tất cả các món ăn sẽ được thêm vào cơ sở dữ liệu.
// Hãy chắc chắn rằng đường dẫn `imageUrl` là chính xác.
const menuListData = [
  {
    name: "Phở Bò",
    price: 55000,
    description: "Phở bò truyền thống với nước dùng đậm đà và thịt bò tươi.",
    imagePath: "../assets/img/pho.jpg", // Sử dụng imagePath tạm thời
    category: "main_course",
  },
  {
    name: "Bún Chả",
    price: 50000,
    description:
      "Bún chả Hà Nội với thịt nướng thơm lừng và nước chấm chua ngọt.",
    imagePath: "../assets/img/buncha.jpg",
    category: "main_course",
  },
  {
    name: "Cơm Tấm",
    price: 60000,
    description: "Cơm tấm sườn bì chả, một món ăn đặc trưng của miền Nam.",
    imagePath: "../assets/img/comtam.jpg",
    category: "main_course",
  },
  {
    name: "Bánh Xèo",
    price: 45000,
    description: "Bánh xèo giòn rụm với nhân tôm thịt và giá đỗ.",
    imagePath: "../assets/img/banhxeo.jpg",
    category: "appetizer",
  },
  {
    name: "Hamburger",
    price: 70000,
    description: "Hamburger bò với phô mai, rau diếp và cà chua.",
    imagePath: "../assets/img/burger.jpg",
    category: "main_course",
  },
  {
    name: "Pizza",
    price: 120000,
    description: "Pizza hải sản với nhiều loại topping tươi ngon.",
    imagePath: "../assets/img/pizza.jpg",
    category: "main_course",
  },
  {
    name: "Spaghetti",
    price: 85000,
    description: "Mì Ý sốt bò bằm cổ điển.",
    imagePath: "../assets/img/spaghetti.jpg",
    category: "main_course",
  },
  {
    name: "Bò Bít Tết",
    price: 150000,
    description: "Bò bít tết nhập khẩu dùng kèm khoai tây chiên và salad.",
    imagePath: "../assets/img/steak.jpg",
    category: "main_course",
  },
  {
    name: "Salad Trộn",
    price: 40000,
    description: "Salad rau củ tươi ngon với sốt dầu giấm.",
    imagePath: "../assets/img/salad.jpg",
    category: "appetizer",
  },
  {
    name: "Nước ngọt có ga",
    price: 20000,
    description: "Nước ngọt mát lạnh (Coca-cola, Pepsi, Sprite).",
    imagePath: "../assets/img/nuoc-ngot-co-ga.jpg",
    category: "drink",
  },
  {
    name: "Nước Cam Ép",
    price: 30000,
    description: "Nước cam ép nguyên chất, không đường.",
    imagePath: "../assets/img/orange-juice.jpg",
    category: "drink",
  },
  {
    name: "Món Tiramisu",
    price: 40000,
    description: "Món tráng miệng mát lạnh ngon ngọt được yêu thích",
    imagePath: "../assets/img/tiramisu.jpg",
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

    // Chuẩn bị dữ liệu với imageData và contentType
    const dishesToInsert = [];
    for (const item of menuListData) {
      const { imageData, contentType } = await getImageData(item.imagePath);
      dishesToInsert.push({
        name: item.name,
        price: item.price,
        description: item.description,
        imageData: imageData,
        contentType: contentType,
        category: item.category,
      });
    }

    // Thêm dữ liệu mới
    await Dish.insertMany(dishesToInsert);
    console.log("Đã thêm dữ liệu món ăn thành công!");

    // --- SEED BANNER SLIDES ---
    const bannerSlideData = [
      { imageUrl: "../assets/img/FoodMenuBanner.webp" },
      { imageUrl: "../assets/img/FoodBannerNoodle.webp" },
      { imageUrl: "../assets/img/FoodBannerSalad.webp" },
    ];

    await BannerSlide.deleteMany({});
    console.log('Đã xóa dữ liệu cũ trong collection "bannerslides".');

    await BannerSlide.insertMany(bannerSlideData);
    console.log("Đã thêm dữ liệu banner slide thành công!");
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
  } finally {
    // Đóng kết nối sau khi hoàn tất
    mongoose.connection.close();
    console.log("Đã đóng kết nối MongoDB.");
  }
};

seedDB();