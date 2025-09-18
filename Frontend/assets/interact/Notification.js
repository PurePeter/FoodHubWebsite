document.addEventListener("DOMContentLoaded", () => {
  const notificationList = document.querySelector(".notification-list");

  if (!notificationList) {
    console.error("Element with class .notification-list not found!");
    return;
  }

  const loaderHTML = `
    <div class="loader-wrapper" style="padding: 20px 0;">
        <div class="loader"></div>
    </div>
  `;

  async function fetchNotifications() {
    notificationList.innerHTML = loaderHTML; // Hiển thị loader

    try {
      // Sử dụng biến toàn cục API_BASE_URL từ config.js
      const response = await fetch(`${window.API_BASE_URL}/notifications`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const notifications = await response.json();
      renderNotifications(notifications);
    } catch (error) {
      console.error("Could not fetch notifications:", error);
      notificationList.innerHTML =
        '<li class="notification-item" style="text-align: center; padding: 10px;">Không thể tải thông báo.</li>';
    }
  }

  function renderNotifications(notifications) {
    notificationList.innerHTML = ""; // Xóa loader hoặc các thông báo cũ

    if (notifications.length === 0) {
      notificationList.innerHTML =
        '<li class="notification-item" style="text-align: center; padding: 10px;">Không có thông báo mới.</li>';
      return;
    }

    notifications.forEach((notification) => {
      const notificationItem = document.createElement("li");
      notificationItem.className = "notification-item";

      // Chuyển đổi đường dẫn ảnh từ backend cho phù hợp với frontend
      const imagePath = notification.image.replace('../FoodHubWebsite/Frontend', '.');

      notificationItem.innerHTML = `
        <a href="${notification.link || "#"}">
          <img src="${imagePath}" alt="${notification.title}" class="notification-img">
          <div class="notification-info">
            <div class="notification-name">${notification.title}</div>
            <div class="notificaiton-desc">${notification.description}</div>
            <div class="notification-time">${notification.time}</div>
          </div>
        </a>
      `;
      notificationList.appendChild(notificationItem);
    });
  }

  fetchNotifications();
});