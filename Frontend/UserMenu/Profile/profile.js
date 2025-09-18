document.addEventListener("DOMContentLoaded", () => {
  const loginRequiredMessage = document.getElementById(
    "login-required-message"
  );
  const profileSection = document.getElementById("profile-section");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    // Nếu chưa đăng nhập, hiển thị thông báo và ẩn nội dung trang
    loginRequiredMessage.style.display = "block";
    profileSection.style.display = "none";
  } else {
    // Nếu đã đăng nhập, ẩn thông báo và hiển thị nội dung trang
    loginRequiredMessage.style.display = "none";
    profileSection.style.display = "block";
    initializeProfilePage(loggedInUser);

    
  }
});

function initializeProfilePage(user) {
  // --- Populate user data ---
  document.getElementById("sidebar-username").textContent = user.username;
  document.getElementById("username").value = user.username;
  document.getElementById("email").value = user.email;
  // Các trường khác như fullname, phone sẽ được thêm sau khi có API

  // --- Tab switching logic ---
  const navLinks = document.querySelectorAll(".sidebar-nav a");
  const profileTabs = document.querySelectorAll(".profile-tab");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Cập nhật class 'active' cho link điều hướng
      navLinks.forEach((nav) => nav.classList.remove("active"));
      link.classList.add("active");

      // Lấy target tab từ href
      const targetId = link.getAttribute("href").substring(1);
      const targetTab = document.getElementById(targetId);

      // Ẩn tất cả các tab và hiển thị tab tương ứng
      profileTabs.forEach((tab) => tab.classList.remove("active"));
      if (targetTab) {
        targetTab.classList.add("active");
      }
    });
  });

  // --- Form submission placeholders ---
  const accountInfoForm = document.getElementById("account-info-form");
  if (accountInfoForm) {
    accountInfoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Tính năng cập nhật thông tin đang được phát triển!");
      // Logic cập nhật thông tin sẽ được thêm ở đây
    });
  }

  const changePasswordForm = document.getElementById("change-password-form");
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Tính năng đổi mật khẩu đang được phát triển!");
      // Logic đổi mật khẩu sẽ được thêm ở đây
    });
  }

  // --- Avatar upload placeholder ---
  const avatarUpload = document.getElementById("avatar-upload");
  if (avatarUpload) {
    avatarUpload.addEventListener("change", () => {
      alert("Tính năng thay đổi ảnh đại diện đang được phát triển!");
    });
  }
}
