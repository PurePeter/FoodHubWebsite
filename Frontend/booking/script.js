document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const loginRequiredMessage = document.getElementById(
    "login-required-message"
  );
  const bookingContent = document.getElementById("booking-content");
  const bookingForm = document.getElementById("booking-form");
  const dishSelectionContainer = document.getElementById(
    "dish-selection-container"
  );
  const selectedDishesSummary = document.getElementById(
    "selected-dishes-summary"
  );

  // --- State Management ---
  let allDishes = [];
  let selectedDishes = {}; // { dishId: quantity, ... }
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // --- Functions ---

  /**
   * Renders the list of all available dishes for selection.
   */
  function renderAllDishes() {
    dishSelectionContainer.innerHTML = ""; // Clear previous content
    if (allDishes.length === 0) {
      dishSelectionContainer.innerHTML =
        "<p>Không tải được danh sách món ăn.</p>";
      return;
    }

    allDishes.forEach((dish) => {
      const dishItem = document.createElement("div");
      dishItem.classList.add("dish-item-selection");
      dishItem.innerHTML = `
        <img src="${API_BASE_URL}/dishes/${dish._id}/image" alt="${
        dish.name
      }" class="dish-item-image">
        <div class="dish-item-info">
            <h4 class="dish-item-name">${dish.name}</h4>
            <span class="dish-item-price">${dish.price.toLocaleString(
              "vi-VN"
            )}đ</span>
        </div>
        <button class="btn-add-dish" data-id="${dish._id}">Thêm</button>
      `;
      dishSelectionContainer.appendChild(dishItem);
    });
  }

  /**
   * Renders the summary of selected dishes.
   */
  function renderSelectedDishesSummary() {
    selectedDishesSummary.innerHTML = ""; // Clear previous summary

    const selectedIds = Object.keys(selectedDishes);

    if (selectedIds.length === 0) {
      selectedDishesSummary.innerHTML = "<p>Chưa có món nào được chọn.</p>";
      return;
    }

    selectedIds.forEach((dishId) => {
      const dish = allDishes.find((d) => d._id === dishId);
      if (!dish) return;

      const quantity = selectedDishes[dishId];
      const summaryItem = document.createElement("div");
      summaryItem.classList.add("selected-dish-item");
      summaryItem.innerHTML = `
        <span>${dish.name}</span>
        <div class="quantity-controls">
            <button class="btn-quantity" data-id="${dishId}" data-change="-1">-</button>
            <span class="quantity">${quantity}</span>
            <button class="btn-quantity" data-id="${dishId}" data-change="1">+</button>
        </div>
      `;
      selectedDishesSummary.appendChild(summaryItem);
    });
  }

  /**
   * Fetches all dishes from the API.
   */
  async function fetchDishes() {
    dishSelectionContainer.innerHTML = `<div class="loader-wrapper"><div class="loader"></div></div>`;
    try {
      const response = await fetch(`${API_BASE_URL}/dishes`);
      if (!response.ok) throw new Error("Failed to fetch dishes");
      allDishes = await response.json();
      renderAllDishes();
    } catch (error) {
      console.error("Error fetching dishes:", error);
      dishSelectionContainer.innerHTML = `<p class="error-message">Lỗi: Không thể tải danh sách món ăn.</p>`;
    }
  }

  /**
   * Handles form submission.
   */
  async function handleBookingSubmit(event) {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const bookingData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      date: formData.get("date"),
      time: formData.get("time"),
      guests: parseInt(formData.get("guests"), 10),
      notes: formData.get("notes"),
      userId: loggedInUser._id,
      orderedDishes: Object.entries(selectedDishes).map(
        ([dishId, quantity]) => ({
          dish: dishId,
          quantity: quantity,
        })
      ),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        // Nếu lỗi là 404, có thể do backend chưa được cập nhật
        if (response.status === 404) {
          throw new Error(
            "Không tìm thấy API đặt bàn. Có thể backend chưa được cập nhật."
          );
        }
        // Cố gắng đọc lỗi từ server, nếu không được thì dùng thông báo chung
        const result = await response.json().catch(() => null);
        throw new Error(result.message || "Đặt bàn thất bại.");
      }

      const result = await response.json();
      alert("Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận.");
      bookingForm.reset();
      selectedDishes = {};
      renderSelectedDishesSummary();
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert(`Lỗi: ${error.message}`);
    }
  }

  // --- Event Listeners ---

  // Add dish to selection
  dishSelectionContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-add-dish")) {
      const dishId = event.target.dataset.id;
      if (selectedDishes[dishId]) {
        selectedDishes[dishId]++;
      } else {
        selectedDishes[dishId] = 1;
      }
      renderSelectedDishesSummary();
    }
  });

  // Change quantity of selected dish
  selectedDishesSummary.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-quantity")) {
      const dishId = event.target.dataset.id;
      const change = parseInt(event.target.dataset.change, 10);

      if (selectedDishes[dishId]) {
        selectedDishes[dishId] += change;
        if (selectedDishes[dishId] <= 0) {
          delete selectedDishes[dishId];
        }
      }
      renderSelectedDishesSummary();
    }
  });

  // Form submission
  bookingForm.addEventListener("submit", handleBookingSubmit);

  // --- Initialization ---

  function initializePage() {
    if (!loggedInUser) {
      // User not logged in
      loginRequiredMessage.style.display = "block";
      bookingContent.style.display = "none";
    } else {
      // User logged in
      loginRequiredMessage.style.display = "none";
      bookingContent.style.display = "block";

      // Pre-fill form with user info
      document.getElementById("name").value = loggedInUser.username || "";
      // You can add more pre-filled fields like phone if they exist in user object

      // Set min date for date input to today
      const today = new Date().toISOString().split("T")[0];
      document.getElementById("date").setAttribute("min", today);

      // Fetch dishes from API
      fetchDishes();
    }
  }

  initializePage();
});
