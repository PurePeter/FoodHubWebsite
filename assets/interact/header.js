document.addEventListener("DOMContentLoaded", function () {
    // --- Elements --- 
    const header = document.querySelector('.header');
    const menuCheckbox = document.getElementById("check");
    const userMenuCheckbox = document.getElementById("user-menu-check");
    const searchCheckbox = document.getElementById("search-check");
    const userAvatarWrapper = document.querySelector(".user-avatar-wrapper");
    const notificationWrapper = document.querySelector(".notification-wrapper");

    const mainCheckboxes = [menuCheckbox, userMenuCheckbox, searchCheckbox].filter(Boolean);
    const subMenus = [userAvatarWrapper, notificationWrapper].filter(Boolean);

    // --- Close Functions ---
    function closeSubMenus() {
        subMenus.forEach(menu => menu.classList.remove('active'));
    }

    function closeAllMainMenus() {
        mainCheckboxes.forEach(cb => cb.checked = false);
        if (header) {
            header.classList.remove("search-active");
        }
    }

    function closeEverything() {
        closeAllMainMenus();
        closeSubMenus();
    }

    // --- Event Listeners ---

    // 1. Handle Main Menus (checkboxes)
    mainCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Close other main menus
                mainCheckboxes.forEach(otherCb => {
                    if (otherCb !== this) otherCb.checked = false;
                });
                // Close all sub-menus when a main menu is opened
                closeSubMenus();

                // Special handling for search bar
                if (this.id === 'search-check') {
                    header.classList.add("search-active");
                    searchInput.focus();
                } else {
                    header.classList.remove("search-active");
                }
            } else {
                // Cleanup when a menu is unchecked manually
                if (this.id === 'search-check') {
                    header.classList.remove("search-active");
                }
            }
        });
    });

    // 2. Handle Sub-Menus (avatar, notifications)
    subMenus.forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation(); // IMPORTANT: Prevents the global click listener from firing
            const isActive = this.classList.contains('active');
            // First, close the other sub-menu
            closeSubMenus();
            // Then, if the clicked menu was not already active, open it.
            if (!isActive) {
                this.classList.add('active');
            }
        });
    });

    // 3. Global Click-Away Listener
    document.addEventListener('click', (e) => {
        if (header && !header.contains(e.target)) {
            closeEverything();
        }
    });

    // --- Guest User Dropdown Logic (UNCHANGED) ---
    function handleUserDropdown() {
        const dropdownMenu = document.querySelector(".user-dropdown-menu");
        if (!dropdownMenu) return;
        const isGuest = document.body.classList.contains("guest");
        if (isGuest) {
            dropdownMenu.innerHTML = '<p class="user-dropdown-menu-guest-link">Bạn cần đăng nhập để sử dụng những tính năng này!</p>';
        }
    }

    // --- Guest Notification Dropdown Logic (UNCHANGED) ---
    function handleNotificationDropdown() {
        const notificationMenu = document.querySelector(".notification-dropdown-menu");
        if (!notificationMenu) return;
        const isGuest = document.body.classList.contains("guest");
        if (isGuest) {
            notificationMenu.innerHTML = '<p href="./Login/index.html" class="user-dropdown-menu-guest-link">Bạn cần đăng nhập để xem thông báo!</p>';
        }
    }

    handleUserDropdown();
    handleNotificationDropdown();

    // --- Search Bar Logic ---
    const searchInput = document.querySelector('.header-right-search input');
    const searchIcon = document.querySelector('.search-icon');
    const clearIcon = document.querySelector('.clear-icon');

    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const path = window.location.pathname;
            const pageName = path.substring(path.lastIndexOf('/') + 1);
            const isRootPage = pageName === '' || pageName === 'index.html';
            const menuPageUrl = isRootPage
                ? "./MenuFood/menuFood.html"
                : "../MenuFood/menuFood.html";
            window.location.href = `${menuPageUrl}?search=${encodeURIComponent(searchTerm)}`;
        }
    }

    if (searchInput && searchIcon && clearIcon && searchCheckbox) {
        searchInput.addEventListener('input', () => {
            const hasText = searchInput.value.trim() !== '';
            clearIcon.style.visibility = hasText ? 'visible' : 'hidden';
            clearIcon.style.opacity = hasText ? '1' : '0';
        });

        clearIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            searchInput.value = '';
            clearIcon.style.visibility = 'hidden';
            clearIcon.style.opacity = '0';
            searchInput.focus();
        });

        searchIcon.addEventListener('click', (e) => {
            // Only perform search if the search bar is already open and there's text.
            // Otherwise, let the label do its default job of toggling the checkbox.
            if (searchCheckbox.checked && searchInput.value.trim() !== '') {
                e.preventDefault(); // Stop the label from closing the search bar.
                performSearch();
            }
        });

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                performSearch();
            }
        });

        clearIcon.style.visibility = 'hidden';
        clearIcon.style.opacity = '0';
    }

    // --- Navigation Underline Logic (UNCHANGED) ---
    const navLinks = document.querySelectorAll(".header-navigate a");
    const underline = document.querySelector(".nav-underline");

    function moveUnderline(target) {
        if (!underline || !target) return;
        const nav = target.closest(".header-navigate");
        if (!nav) return;
        const targetRect = target.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        underline.style.width = `${targetRect.width}px`;
        underline.style.left = `${targetRect.left - navRect.left}px`;
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            if (this.getAttribute("href").startsWith("#")) {
                e.preventDefault();
                const targetId = this.getAttribute("href").substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: "smooth",
                    });
                    navLinks.forEach((l) => l.classList.remove("active"));
                    this.classList.add("active");
                    moveUnderline(this);
                }
            }
        });
    });

    const activeLink = document.querySelector(".header-navigate a.active");
    if (activeLink) {
        moveUnderline(activeLink);
    }
});

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});