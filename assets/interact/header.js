const navLinks = document.querySelectorAll('.header-navigate a');
const underline = document.querySelector('.nav-underline');

function moveUnderline(target) {
    const nav = target.parentElement;
    const rect = target.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    underline.style.width = `${rect.width}px`;
    underline.style.left = `${rect.left - navRect.left}px`;
}

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Trừ đi chiều cao header (nếu cần)
                    behavior: 'smooth'
                });
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                moveUnderline(this);
            }
        }
    });
});

// Khởi tạo vị trí underline cho link active lúc đầu
const activeLink = document.querySelector('.header-navigate a.active');
if (activeLink) moveUnderline(activeLink);

// Khi tải lại trang, di chuyển đến phần Home
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", function () {
    // --- Logic for header navigation ---
    const navLinks = document.querySelectorAll('.header-navigate a');
    const underline = document.querySelector('.nav-underline');

    function moveUnderline(target) {
        if (!underline || !target) return;
        const nav = target.parentElement;
        const rect = target.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        underline.style.width = `${rect.width}px`;
        underline.style.left = `${rect.left - navRect.left}px`;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // This logic is more for single-page apps with anchor links.
            // On the booking page, links go to other pages, so this might not be necessary,
            // but we keep it for consistency with the homepage script.
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    moveUnderline(this);
                }
            }
        });
    });

    // --- Dropdown Mutual Exclusivity ---
    const userAvatarWrapper = document.querySelector('.user-avatar-wrapper');
    const notificationWrapper = document.querySelector('.notification-wrapper');

    if (userAvatarWrapper && notificationWrapper) {
        // Toggle user dropdown
        userAvatarWrapper.addEventListener('click', function (e) {
            e.stopPropagation();
            const isActive = userAvatarWrapper.classList.contains('active');
            // Đóng notification nếu đang mở
            notificationWrapper.classList.remove('active');
            // Toggle user
            userAvatarWrapper.classList.toggle('active', !isActive);
        });
        // Toggle notification dropdown
        notificationWrapper.querySelector('.notification-btn').addEventListener('click', function (e) {
            e.stopPropagation();
            const isActive = notificationWrapper.classList.contains('active');
            // Đóng user nếu đang mở
            userAvatarWrapper.classList.remove('active');
            // Toggle notification
            notificationWrapper.classList.toggle('active', !isActive);
        });
        // Đóng cả hai khi click ra ngoài
        document.addEventListener('click', function () {
            userAvatarWrapper.classList.remove('active');
            notificationWrapper.classList.remove('active');
        });
    }

    /**
     * Hàm này xử lý logic cho dropdown menu của người dùng.
     * Nó kiểm tra xem người dùng có phải là khách hay không và xử lý sự kiện click cho phù hợp.
     */
    function handleUserDropdown() {
        const dropdownMenu = document.querySelector('.user-dropdown-menu');
        if (!dropdownMenu) return; // Thoát nếu không tìm thấy menu

        // Giả định rằng khi người dùng chưa đăng nhập, thẻ <body> sẽ có class="guest".
        const isGuest = document.body.classList.contains('guest');

        // Nếu là khách, thay đổi nội dung dropdown
        if (isGuest) {
            // Xóa các link hiện có
            dropdownMenu.innerHTML = '';

            // Tạo và thêm thông báo mới, làm cho nó trông giống một mục menu
            const guestMessage = document.createElement('p');
            guestMessage.textContent = 'Bạn cần đăng nhập để sử dụng những tính năng này!';
            
            // Thêm sự kiện click để chuyển đến trang đăng nhập
            // !!! QUAN TRỌNG: Hãy thay đổi './Login/index.html' thành URL trang đăng nhập thực tế của bạn
            guestMessage.href = './Login/index.html';

            dropdownMenu.appendChild(guestMessage);
        }
        // Nếu không phải là khách (đã đăng nhập), chúng ta không cần làm gì cả,
        // các link sẽ hoạt động bình thường.
    }

    /**
     * Hàm này xử lý logic cho dropdown thông báo.
     * Nếu là khách, nó sẽ hiển thị thông báo yêu cầu đăng nhập.
     */
    function handleNotificationDropdown() {
        const notificationMenu = document.querySelector('.notification-dropdown-menu');
        if (!notificationMenu) return;

        const isGuest = document.body.classList.contains('guest');

        if (isGuest) {
            // Thay thế nội dung bằng một link duy nhất đến trang đăng nhập
            notificationMenu.innerHTML = '<p href="./Login/index.html" class="user-dropdown-menu-guest-link">Bạn cần đăng nhập để xem thông báo!</p>';
        }
    }

    // Gọi hàm để thiết lập logic
    handleUserDropdown();
    handleNotificationDropdown();
});
