const signUpBtnLink = document.querySelector(".signUpBtn-link");
const signInBtnLink = document.querySelector(".signInBtn-link");
const wrapper = document.querySelector(".right-wrapper");
const forgotLink = document.querySelector(".forgot-link");
const backToSignInLink = document.querySelector(".backToSignIn-link");

signUpBtnLink.addEventListener("click", () => {
  wrapper.classList.toggle("active");
});

signInBtnLink.addEventListener("click", () => {
  wrapper.classList.toggle("active");
});

forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  wrapper.classList.add("forgot-active");
});

backToSignInLink.addEventListener("click", (e) => {
  e.preventDefault();
  wrapper.classList.remove("forgot-active");
});

// Lấy form đăng ký và đăng nhập
const signInForm = document.querySelector(".form-wrapper.sign-in form");
const signUpForm = document.querySelector(".form-wrapper.sign-up form");

// URL của API
const apiUrl = "http://localhost:3001/api";

// --- Notification Logic ---
const notification = document.getElementById("notification");
const notificationMessage = notification.querySelector(".notification-message");
const notificationClose = notification.querySelector(".notification-close");
let notificationTimeout;

const hideNotification = () => {
  notification.classList.remove("show");
  clearTimeout(notificationTimeout);
};

const showNotification = (message, isSuccess) => {
  // Clear any existing notification
  hideNotification();

  // Set message and style
  notificationMessage.textContent = message;
  notification.style.backgroundColor = isSuccess ? "#4CAF50" : "#f44336";

  // Remove old underline if it exists
  const oldUnderline = notification.querySelector(".notification-underline");
  if (oldUnderline) oldUnderline.remove();

  // Create and add new underline
  const underline = document.createElement("div");
  underline.classList.add("notification-underline");
  notification.appendChild(underline);

  // Show notification
  notification.classList.add("show");

  // Set timeout to hide
  // Set timeout to hide
  notificationTimeout = setTimeout(hideNotification, 3000);
};

notificationClose.addEventListener("click", hideNotification);

// Hàm xử lý đăng nhập thành công
const handleLoginSuccess = (user) => {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("loginTimestamp", new Date().getTime());
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000);
};

// Hàm xử lý submit form đăng nhập
const handleSignInSubmit = async (e) => {
  e.preventDefault();

  const email = signInForm.querySelector('input[type="email"]').value;
  const password = signInForm.querySelector('input[type="password"]').value;

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (response.ok) {
      showNotification(result.message, true);
      handleLoginSuccess(result.user);
    } else {
      showNotification(result.message, false);
    }
  } catch (error) {
    showNotification("Lỗi kết nối máy chủ. Vui lòng thử lại.", false);
  }
};

// Hàm xử lý submit form đăng ký
const handleSignUpSubmit = async (e) => {
  e.preventDefault();

  const username = signUpForm.querySelector('input[type="text"]').value;
  const email = signUpForm.querySelector('input[type="email"]').value;
  const password = signUpForm.querySelectorAll('input[type="password"]')[0]
    .value;
  const confirmPassword = signUpForm.querySelectorAll(
    'input[type="password"]'
  )[1].value;
  const agreeTerms = signUpForm.querySelector('input[type="checkbox"]').checked;

  if (password !== confirmPassword) {
    showNotification("Mật khẩu không khớp.", false);
    return;
  }
  if (!agreeTerms) {
    showNotification("Bạn phải đồng ý với các điều khoản.", false);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const result = await response.json();
    if (response.ok) {
      showNotification(result.message, true);
      handleLoginSuccess(result.user);
    } else {
      showNotification(result.message, false);
    }
  } catch (error) {
    showNotification("Lỗi kết nối máy chủ. Vui lòng thử lại.", false);
  }
};

// Xử lý form đăng nhập
signInForm.addEventListener("submit", handleSignInSubmit);

// Xử lý form đăng ký
signUpForm.addEventListener("submit", handleSignUpSubmit);

// Thêm sự kiện keydown cho các input trong form đăng nhập
signInForm.querySelectorAll("input").forEach(input => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của Enter (ví dụ: xuống dòng)
      signInForm.dispatchEvent(new Event('submit')); // Kích hoạt sự kiện submit của form
    }
  });
});

// Thêm sự kiện keydown cho các input trong form đăng ký
signUpForm.querySelectorAll("input").forEach(input => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của Enter
      signUpForm.dispatchEvent(new Event('submit')); // Kích hoạt sự kiện submit của form
    }
  });
});

// --- Other event listeners (unchanged) ---
document.addEventListener("DOMContentLoaded", function () {
  const googleBtn = document.querySelector(".fa-google").closest("a");
  googleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Tính năng đăng nhập bằng Google sẽ sớm được cập nhật!");
  });

  const facebookBtn = document.querySelector(".fa-facebook-f").closest("a");
  facebookBtn.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Tính năng đăng nhập bằng Facebook sẽ sớm được cập nhật!");
  });

  document
    .querySelectorAll(".form-wrapper .fa-eye")
    .forEach(function (eyeIcon) {
      eyeIcon.addEventListener("click", function (e) {
        e.preventDefault();
        const input = this.parentElement.querySelector("input");
        if (input.type === "password") {
          input.type = "text";
          this.classList.add("fa-eye-slash");
          this.classList.remove("fa-eye");
        } else {
          input.type = "password";
          this.classList.add("fa-eye");
          this.classList.remove("fa-eye-slash");
        }
        input.focus();
      });
    });

  const forgotForm = document.querySelector(".forgot-password form");
  forgotForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
      alert(
        `Link đặt lại mật khẩu đã được gửi đến ${email}. Vui lòng kiểm tra email của bạn!`
      );
    }
  });
});
