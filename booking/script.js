document.addEventListener("DOMContentLoaded", function () {
  // --- Logic for booking form ---
  // Assume login status is stored in localStorage
  // On successful login: localStorage.setItem('isLoggedIn', 'true');
  // On logout: localStorage.removeItem('isLoggedIn');
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const bookingContent = document.getElementById("booking-content");
  const loginMessage = document.getElementById("login-required-message");

  if (isLoggedIn === "true") {
    // User is logged in, show the booking form
    if (bookingContent) bookingContent.style.display = "block";
    if (loginMessage) loginMessage.style.display = "none";
  } else {
    // User is not logged in, show a message and the login prompt
    if (bookingContent) bookingContent.style.display = "none";
    if (loginMessage) loginMessage.style.display = "block";
  }

  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission
      alert(
        "Đặt bàn thành công! Chúng tôi sẽ sớm liên hệ với bạn để xác nhận."
      );
      bookingForm.reset(); // Clear the form fields
    });
  }
});
