document.addEventListener("DOMContentLoaded", () => {
  const loginRequiredMessage = document.getElementById(
    "login-required-message"
  );
  const favouriteSection = document.getElementById("favourite-section");
  const favouriteListContainer = document.getElementById("favourite-list");
  const sortSelect = document.getElementById("sort-select");

  // Biến để lưu trữ danh sách món ăn yêu thích và trạng thái sắp xếp
  let favoriteDishes = [];
  let currentSort = "default";

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    // Nếu chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
    loginRequiredMessage.style.display = "block";
    favouriteSection.style.display = "none";
    // Sửa lại đường dẫn cho nút đăng nhập
    const loginBtn = loginRequiredMessage.querySelector("a.btn");
    if (loginBtn) {
      loginBtn.href = "../../Login/login.html";
    }
  } else {
    // Nếu đã đăng nhập, hiển thị nội dung trang và tải các món yêu thích
    loginRequiredMessage.style.display = "none";
    favouriteSection.style.display = "block";
    initializeFavouritePage();
  }

  async function initializeFavouritePage() {
    // Hiển thị loader
    favouriteListContainer.innerHTML = `<div class="loader-wrapper"><div class="loader"></div></div>`;

    try {
      // Lấy danh sách ID các món yêu thích từ localStorage
      let favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");

      if (favoriteIds.length === 0) {
        displayNoFavorites();
        return;
      }

      // Fetch tất cả các món ăn từ API
      const response = await fetch(`${API_BASE_URL}/dishes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allDishes = await response.json();

      // Lọc ra các món ăn có trong danh sách yêu thích
      favoriteDishes = allDishes.filter((dish) =>
        favoriteIds.includes(dish._id)
      );

      // Thêm event listener cho dropdown sắp xếp
      sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderFavoriteDishes(); // Gọi lại hàm render để sắp xếp và hiển thị lại
      });

      // Render lần đầu
      renderFavoriteDishes();
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
      favouriteListContainer.innerHTML = `<p class="error-message">Không thể tải danh sách yêu thích. Vui lòng thử lại sau!</p>`;
    }
  }

  function renderFavoriteDishes(dishes) {
    // Tạo một bản sao của danh sách để sắp xếp mà không ảnh hưởng đến mảng gốc
    let dishesToRender = [...favoriteDishes];

    // Sắp xếp danh sách dựa trên lựa chọn hiện tại
    switch (currentSort) {
      case "az":
        dishesToRender.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        dishesToRender.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        dishesToRender.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        dishesToRender.sort((a, b) => b.price - a.price);
        break;
      // Mặc định không cần làm gì
    }

    favouriteListContainer.innerHTML = ""; // Xóa loader

    if (dishesToRender.length === 0) {
      displayNoFavorites();
      // Ẩn bộ lọc nếu không có món nào
      sortSelect.style.display = "none";
      return;
    }

    dishesToRender.forEach((dish) => {
      const menuItem = document.createElement("div");
      // Thêm class 'menu-item' để tái sử dụng style từ trang menu
      menuItem.classList.add("menu-item");
      const imageUrl = `${API_BASE_URL}/dishes/${dish._id}/image`;

      menuItem.innerHTML = `
        <div class="menu-item-header">
            <img src="${imageUrl}" alt="${dish.name}">
            <button class="favorite-btn active" data-id="${
              dish._id
            }" title="Bỏ yêu thích">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <h3>${dish.name}</h3>
        <p>${dish.description}</p>
        <span class="menu-price">${dish.price.toLocaleString("vi-VN")}đ</span>
        <button class="order-btn">Đặt món</button>
      `;

      // Xử lý sự kiện click nút "Bỏ yêu thích"
      const favoriteBtn = menuItem.querySelector(".favorite-btn");
      favoriteBtn.addEventListener("click", () => {
        const dishId = favoriteBtn.dataset.id;
        let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        favorites = favorites.filter((id) => id !== dishId);
        // Cập nhật lại danh sách món ăn gốc
        favoriteDishes = favoriteDishes.filter((d) => d._id !== dishId);

        localStorage.setItem("favorites", JSON.stringify(favorites));

        // Xóa món ăn khỏi giao diện ngay lập tức
        menuItem.remove();

        // Cập nhật lại giao diện nếu cần
        // Nếu không còn món nào, hiển thị thông báo
        if (favouriteListContainer.children.length === 0) {
          displayNoFavorites();
        }
      });

      // Xử lý sự kiện click nút "Đặt món"
      const orderBtn = menuItem.querySelector(".order-btn");
      orderBtn.addEventListener("click", () => {
        // Người dùng chắc chắn đã đăng nhập để vào trang này
        window.location.href = "../../booking/booking.html";
      });

      favouriteListContainer.appendChild(menuItem);
    });
  }

  function displayNoFavorites() {
    favouriteListContainer.innerHTML = `
      <p class="no-results">
        Bạn chưa có món ăn yêu thích nào. <br>
        <a href="../../MenuFood/menuFood.html">Khám phá thực đơn</a> ngay!
      </p>`;
  }
});
