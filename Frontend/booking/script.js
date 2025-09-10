document.addEventListener("DOMContentLoaded", function () {
  // --- Logic for booking form ---
  // The session is now managed by assets/interact/header.js
  // This script just needs to check for the existence of the user object
  const loggedInUser = localStorage.getItem("loggedInUser");

  const bookingContent = document.getElementById("booking-content");
  const loginMessage = document.getElementById("login-required-message");

  if (loggedInUser) {
    // User is logged in, show the booking form
    if (bookingContent) bookingContent.style.display = "block";
    if (loginMessage) loginMessage.style.display = "none";

    // Pre-fill user data if available
    const user = JSON.parse(loggedInUser);
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone"); // Assuming phone is not in user object

    if (nameInput && user.username) {
        nameInput.value = user.username;
    }

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