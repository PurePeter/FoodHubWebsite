document.addEventListener("DOMContentLoaded", function () {
  // --- Animation for scroll reveal ---
  const scrollRevealElements = document.querySelectorAll(".scroll-reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  scrollRevealElements.forEach((element) => revealObserver.observe(element));

  // --- State Management ---
  let allDishes = [];
  let currentFilters = {
    searchTerm: "",
    category: "all",
    sort: "default",
  };

  // --- DOM Elements ---
  const menuList = document.querySelector(".menu-list");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("search-input"); // Lấy tham chiếu đến thanh tìm kiếm

  // --- Main Function to Render Dishes ---
  function renderDishes() {
    let filteredDishes = [...allDishes];

    // 1. Filter by Search Term
    if (currentFilters.searchTerm) {
      filteredDishes = filteredDishes.filter(
        (dish) =>
          dish.name.toLowerCase().includes(currentFilters.searchTerm) ||
          dish.description.toLowerCase().includes(currentFilters.searchTerm)
      );
    }

    // 2. Filter by Category
    if (currentFilters.category !== "all") {
      filteredDishes = filteredDishes.filter(
        (dish) => dish.category === currentFilters.category
      );
    }

    // 3. Sort
    switch (currentFilters.sort) {
      case "az":
        filteredDishes.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        filteredDishes.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filteredDishes.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredDishes.sort((a, b) => b.price - a.price);
        break;
    }

    // 4. Display on page
    menuList.innerHTML = "";
    menuList.style.display = "grid"; // Đảm bảo hiển thị lưới khi có kết quả
    if (filteredDishes.length === 0) {
      menuList.style.display = "block";
      menuList.innerHTML = `<p class="no-results" style='font-size: 1.6rem; margin-left: 30px'>Không tìm thấy món ăn nào phù hợp với từ '${currentFilters.searchTerm}'.</p>`;
      return;
    }

    filteredDishes.forEach((dish) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("menu-item");
      menuItem.innerHTML = `
                <img src="../assets/img/${dish.image}" alt="${dish.name}">
                <h2>${dish.name}</h2>
                <p>${dish.description}</p>
                <span class="menu-price">${dish.price.toLocaleString(
                  "vi-VN"
                )}đ</span>
                <button class="order-btn">Đặt món</button>
            `;
      menuList.appendChild(menuItem);
    });
  }

  // --- Event Listeners ---
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilters.category = button.dataset.category;
      renderDishes();
    });
  });

  sortSelect.addEventListener("change", (e) => {
    currentFilters.sort = e.target.value;
    renderDishes();
  });

  // Lắng nghe sự kiện nhập liệu trên thanh tìm kiếm
  searchInput.addEventListener("input", (e) => {
    currentFilters.searchTerm = e.target.value.toLowerCase();
    renderDishes();
  });

  // --- Initial Fetch ---
  async function initializeMenu() {
    const urlParams = new URLSearchParams(window.location.search);
    currentFilters.searchTerm = urlParams.get("search")?.toLowerCase() || "";

    // Đặt giá trị cho thanh tìm kiếm khi khởi tạo
    searchInput.value = currentFilters.searchTerm;

    try {
      const response = await fetch("../assets/data/dishes.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      allDishes = await response.json();
      renderDishes();
    } catch (error) {
      console.error("Lỗi khi tải thực đơn:", error);
      menuList.style.display = "block";
      menuList.innerHTML =
        "<p class='error-message' style='font-size: 1.6rem; margin-left: 16px'>Không thể tải được thực đơn. Vui lòng thử lại sau!</p>";
    }
  }

  initializeMenu();
});
