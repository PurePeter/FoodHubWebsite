document.addEventListener("DOMContentLoaded", () => {
  const loginRequiredMessage = document.getElementById(
    "login-required-message"
  );
  const historySection = document.getElementById("history-section");
  const historyListContainer = document.getElementById("booking-history-list");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    // Nếu chưa đăng nhập, hiển thị thông báo
    loginRequiredMessage.style.display = "block";
    historySection.style.display = "none";
  } else {
    // Nếu đã đăng nhập, hiển thị nội dung và tải lịch sử
    loginRequiredMessage.style.display = "none";
    historySection.style.display = "block";
    loadBookingHistory(loggedInUser._id);
  }

  async function loadBookingHistory(userId) {
    // Hiển thị loader
    historyListContainer.innerHTML = `<div class="loader-wrapper"><div class="loader"></div></div>`;

    try {
      // Giả sử API endpoint là /bookings/user/:userId
      const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`, // Token được lưu cùng với thông tin user khi đăng nhập
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const bookings = await response.json();
      renderBookingHistory(bookings);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đặt bàn:", error);
      historyListContainer.innerHTML = `<p class="error-message">Không thể tải lịch sử đặt bàn. Vui lòng thử lại sau!</p>`;
    }
  }

  function renderBookingHistory(bookings) {
    historyListContainer.innerHTML = ""; // Xóa loader

    if (bookings.length === 0) {
      historyListContainer.innerHTML = `<p class="no-results">Bạn chưa có lịch sử đặt bàn nào.</p>`;
      return;
    }

    // Sắp xếp các booking theo ngày gần nhất lên đầu
    bookings.sort((a, b) => new Date(b.date) - new Date(a.date));

    bookings.forEach((booking) => {
      const bookingItem = document.createElement("div");
      bookingItem.classList.add("booking-item");

      const bookingDate = new Date(booking.date);
      const formattedDate = bookingDate.toLocaleDateString("vi-VN");

      // Định dạng trạng thái
      let statusClass = "";
      let statusText = "";
      switch (booking.status) {
        case "confirmed":
          statusClass = "status-confirmed";
          statusText = "Đã xác nhận";
          break;
        case "pending":
          statusClass = "status-pending";
          statusText = "Chờ xác nhận";
          break;
        case "cancelled":
          statusClass = "status-cancelled";
          statusText = "Đã hủy";
          break;
        default:
          statusText = booking.status;
      }

      bookingItem.innerHTML = `
                <div class="booking-detail"><strong>Ngày đặt:</strong> ${formattedDate}</div>
                <div class="booking-detail"><strong>Giờ đặt:</strong> ${booking.time}</div>
                <div class="booking-detail"><strong>Số người:</strong> ${booking.guests}</div>
                <div class="booking-detail">
                    <strong>Trạng thái:</strong> 
                    <span class="booking-status ${statusClass}">${statusText}</span>
                </div>
            `;
      historyListContainer.appendChild(bookingItem);
    });
  }
});
