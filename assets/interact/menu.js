document.addEventListener("DOMContentLoaded", () => {
  const menuList = document.querySelector(".menu-list");

  if (menuList) {
    fetch("./assets/data/dishes.json") // Thay đổi đường dẫn fetch
      .then((response) => response.json())
      .then((data) => {
        const featuredDishes = getFeaturedDishes(data);
        featuredDishes.forEach((dish) => {
          const menuItem = createMenuItem(dish);
          menuList.appendChild(menuItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
        menuList.style.display = "block";
        menuList.innerHTML =
          "<p class='error-message' style='font-size: 1.6rem; margin-left: 30px'>Không thể tải được thực đơn. Vui lòng thử lại sau!</p>";
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
  const menuItem = document.createElement("div");
  menuItem.classList.add("menu-item");

  menuItem.innerHTML = `
        <img src="./assets/img/${dish.image}" alt="${dish.name}">
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>
        <div class="menu-price">${dish.price.toLocaleString("vi-VN")} VNĐ</div>
        <button class="order-btn">Đặt món</button>
    `;

  return menuItem;
}
