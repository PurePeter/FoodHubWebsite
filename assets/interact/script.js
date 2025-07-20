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
    wrapper.classList.remove("active");
    wrapper.classList.add("forgot-active");
});

backToSignInLink.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.remove("forgot-active");
    wrapper.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", function () {
    // Xử lý đăng nhập bằng Google
    const googleBtn = document.querySelector(".fa-google").closest("a");
    googleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        // Thực hiện chuyển hướng hoặc gọi API đăng nhập Google tại đây
        alert("Tính năng đăng nhập bằng Google sẽ sớm được cập nhật!");
        // window.location.href = "link_google_oauth";
    });

    // Xử lý đăng nhập bằng Facebook
    const facebookBtn = document.querySelector(".fa-facebook-f").closest("a");
    facebookBtn.addEventListener("click", function (e) {
        e.preventDefault();
        // Thực hiện chuyển hướng hoặc gọi API đăng nhập Facebook tại đây
        alert("Tính năng đăng nhập bằng Facebook sẽ sớm được cập nhật!");
        // window.location.href = "link_facebook_oauth";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Chọn tất cả icon con mắt trong form đăng ký
    document
        .querySelectorAll(".form-wrapper .fa-eye")
        .forEach(function (eyeIcon) {
            eyeIcon.addEventListener("click", function (e) {
                e.preventDefault();
                // Tìm input liền trước icon
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
