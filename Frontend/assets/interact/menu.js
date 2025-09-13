document.addEventListener("DOMContentLoaded", () => {
  const menuList = document.querySelector(".menu-list");

  if (menuList) {
    fetch("http://localhost:3001/api/dishes")
      .then((response) => response.json())
      .then((data) => {
        menuList.innerHTML = ""; // Xóa loader sau khi dữ liệu được tải
        const featuredDishes = getFeaturedDishes(data);
        featuredDishes.forEach((dish) => {
          const menuItem = createMenuItem(dish);
          if (menuItem) menuList.appendChild(menuItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
        menuList.style.display = "block";
        menuList.innerHTML = `<p class='error-message' style='font-size: 1.6rem; margin-left: 30px; color: red;'>Không thể tải được thực đơn. Vui lòng thử lại sau!</p>`;
      });
  }
});

function getFeaturedDishes(dishes) {
  const mainCourse = dishes.find((dish) => dish.category === "main_course");
  const appetizer = dishes.find((dish) => dish.category === "appetizer");
  const drink = dishes.find((dish) => dish.category === "drink");

  let anotherMainCourse = null;
  if (mainCourse) {
    // Lấy thêm một món chính khác để đủ 4 món
    anotherMainCourse = dishes.find(
      (dish) => dish.category === "main_course" && dish._id !== mainCourse._id
    );
  }

  return [mainCourse, appetizer, drink, anotherMainCourse].filter(Boolean); // filter(Boolean) để loại bỏ các giá trị null/undefined nếu không tìm thấy
}

function createMenuItem(dish) {
  if (!dish) return null;

  const menuItem = document.createElement("div");
  menuItem.classList.add("menu-item");

  // Sử dụng endpoint API để lấy ảnh
  const imageUrl = `http://localhost:3001/api/dishes/${dish._id}/image`;

  menuItem.innerHTML = `
        <img src="${imageUrl}" alt="${dish.name}">
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>
        <div class="menu-price">${dish.price.toLocaleString("vi-VN")} VNĐ</div>
        <button class="order-btn">Đặt món</button>
    `;

  // Thêm logic kiểm tra đăng nhập cho nút "đặt món"
  const orderBtn = menuItem.querySelector(".order-btn");
  orderBtn.addEventListener("click", () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      window.location.href = "./booking/booking.html";
    } else {
      alert("Vui lòng đăng nhập để đặt món.");
    }
  });

  return menuItem;
}
