document.addEventListener("DOMContentLoaded", function () {
  // --- Elements ---
  const header = document.querySelector(".header");
  const menuCheckbox = document.getElementById("check");
  const userMenuCheckbox = document.getElementById("user-menu-check");
  const searchCheckbox = document.getElementById("search-check");
  const userAvatarWrapper = document.querySelector(".user-avatar-wrapper");
  const notificationWrapper = document.querySelector(".notification-wrapper");
  const navLinks = document.querySelectorAll(".header-navigate a");
  const underline = document.querySelector(".nav-underline");
  const searchInput = document.querySelector(".header-right-search input");
  const searchIcon = document.querySelector(".search-icon");
  const clearIcon = document.querySelector(".clear-icon");

  const mainCheckboxes = [
    menuCheckbox,
    userMenuCheckbox,
    searchCheckbox,
  ].filter(Boolean);
  const subMenus = [userAvatarWrapper, notificationWrapper].filter(Boolean);

  // --- General Functions ---
  function closeSubMenus() {
    subMenus.forEach((menu) => menu.classList.remove("active"));
  }
  function closeAllMainMenus() {
    mainCheckboxes.forEach((cb) => (cb.checked = false));
    if (header) header.classList.remove("search-active");
  }
  function closeEverything() {
    closeAllMainMenus();
    closeSubMenus();
  }

  // --- Event Listeners (Menus) ---
  mainCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        mainCheckboxes.forEach((otherCb) => {
          if (otherCb !== this) otherCb.checked = false;
        });
        closeSubMenus();
        if (this.id === "search-check") {
          header.classList.add("search-active");
          searchInput.focus();
        }
      } else {
        if (this.id === "search-check")
          header.classList.remove("search-active");
      }
    });
  });

  subMenus.forEach((menu) => {
    menu.addEventListener("click", function (e) {
      e.stopPropagation();
      const isActive = this.classList.contains("active");
      closeSubMenus();
      if (!isActive) this.classList.add("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (header && !header.contains(e.target)) closeEverything();
  });

  // --- Search Bar Logic ---
  if (searchInput && searchIcon && clearIcon) {
    const updateClearIconVisibility = () => {
      const hasText = searchInput.value.trim() !== "";
      clearIcon.style.visibility = hasText ? "visible" : "hidden";
      clearIcon.style.opacity = hasText ? "1" : "0";
    };

    const performSearch = () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        const isRootPage =
          window.location.pathname.endsWith("/") ||
          window.location.pathname.endsWith("index.html");
        const menuPageUrl = isRootPage
          ? "./MenuFood/menuFood.html"
          : "../MenuFood/menuFood.html";
        window.location.href = `${menuPageUrl}?search=${encodeURIComponent(
          searchTerm
        )}`;
      }
    };

    searchInput.addEventListener("input", () => {
      updateClearIconVisibility();
    });

    searchInput.addEventListener("focus", () => {
      updateClearIconVisibility();
    });

    searchInput.addEventListener("blur", () => {
      // Thêm một độ trễ nhỏ để sự kiện click trên clearIcon có thể được thực thi
      setTimeout(() => {
        clearIcon.style.visibility = "hidden";
        clearIcon.style.opacity = "0";
      }, 150);
    });

    clearIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (searchInput.value !== "") {
        searchInput.value = "";
        // Kích hoạt sự kiện 'input' để các script khác (như menuFood.js) có thể lắng nghe và cập nhật UI
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        searchInput.focus();
      }
    });

    searchIcon.addEventListener("click", (e) => {
      const isSearchOpen = searchCheckbox.checked;
      const hasText = searchInput.value.trim() !== "";

      if (isSearchOpen && hasText) {
        e.preventDefault();
        performSearch();
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        performSearch();
      }
    });

    // Initial check when the page loads
    updateClearIconVisibility();
  }

  // --- Notification List Logic ---
  function limitNotificationList() {
    const notificationList = document.querySelector(".notification-list");
    if (!notificationList) return;

    const notificationItems =
      notificationList.querySelectorAll(".notification-item");
    if (notificationItems.length > 5) {
      const itemHeight = notificationItems[0].offsetHeight;
      // Set max-height to show 5 full items and a half of the 6th to indicate scrollability
      notificationList.style.maxHeight = `${itemHeight * 5.5}px`;
      notificationList.style.overflowY = "scroll";
    }
  }

  // --- Navigation & Underline Logic ---
  const isHomePage =
    window.location.pathname.endsWith("/") ||
    window.location.pathname.endsWith("index.html");

  function moveUnderline(target) {
    if (!underline || !target) return;
    const nav = target.closest(".header-navigate");
    if (!nav) return;
    const targetRect = target.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    underline.style.width = `${targetRect.width}px`;
    underline.style.left = `${targetRect.left - navRect.left}px`;
    underline.style.opacity = 1;
  }

  function setActiveLink(activeLink) {
    navLinks.forEach((link) => link.classList.remove("active"));
    if (activeLink) {
      activeLink.classList.add("active");
      moveUnderline(activeLink);
    }
  }

  function getFileName(path) {
    return path.split("/").pop().split("#")[0];
  }

  function updateActiveLinkOnLoad() {
    const currentFileName = getFileName(window.location.pathname);
    let activeLink = null;

    if (isHomePage) {
      activeLink = document.querySelector('.header-navigate a[href*="#home"]');
    } else {
      for (const link of navLinks) {
        if (getFileName(link.href) === currentFileName) {
          activeLink = link;
          break;
        }
      }
    }
    setActiveLink(activeLink);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (isHomePage && href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    });
  });

  const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
  footerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (isHomePage && href.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const targetRect = targetElement.getBoundingClientRect();
          const absoluteTargetTop = targetRect.top + window.scrollY;
          const middleOffset = (window.innerHeight - targetRect.height) / 2;

          window.scrollTo({
            top: absoluteTargetTop - middleOffset,
            behavior: "smooth",
          });
        }
      }
    });
  });

  updateActiveLinkOnLoad();

  if (isHomePage) {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeLink = document.querySelector(
              `.header-navigate a[href="#${entry.target.id}"]`
            );
            setActiveLink(activeLink);
          }
        });
      },
      { rootMargin: "-15% 0px -65% 0px" }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  window.addEventListener("resize", () => {
    const activeLink = document.querySelector(".header-navigate a.active");
    if (activeLink) moveUnderline(activeLink);
  });

  // --- Session Management Logic ---
  const SessionManager = {
    inactivityTimeout: null,
    timeoutDuration: 30 * 60 * 1000,
    init: function () {
      this.checkSession();
      this.setupActivityListeners();
    },
    checkSession: function () {
      const loggedInUser = localStorage.getItem("loggedInUser");
      const loginTimestamp = localStorage.getItem("loginTimestamp");
      if (loggedInUser && loginTimestamp) {
        if (new Date().getTime() - loginTimestamp > this.timeoutDuration) {
          this.logout("Phiên đăng nhập đã hết hạn.");
        } else {
          this.updateUIForLoggedInUser(JSON.parse(loggedInUser));
          this.resetInactivityTimer();
        }
      } else {
        this.updateUIForGuest();
      }
    },
    updateUIForLoggedInUser: function (user) {
      document.body.classList.remove("guest");
      const loginBtn = document.querySelector(".login-btn");
      if (loginBtn) loginBtn.style.display = "none";
      if (userAvatarWrapper) userAvatarWrapper.style.display = "flex";
      if (notificationWrapper) notificationWrapper.style.display = "flex";
      const userAvatarImg = userAvatarWrapper.querySelector("img");
      if (userAvatarImg) {
        userAvatarImg.src =
          user.avatar ||
          (isHomePage
            ? "./assets/img/unknownAvatarUser.png"
            : "../assets/img/unknownAvatarUser.png");
        userAvatarImg.alt = user.username;
        userAvatarImg.title = user.username;
      }
      const userDropdownMenu = userAvatarWrapper.querySelector(
        ".user-dropdown-menu"
      );
      if (userDropdownMenu) {
        const allLinks = userDropdownMenu.querySelectorAll("a");
        const logoutLink = Array.from(allLinks).find(
          (link) => link.textContent.trim() === "Đăng xuất"
        );

        if (logoutLink) {
          logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            this.logout("Bạn đã đăng xuất thành công.");
          });
        }
      }
    },
    updateUIForGuest: function () {
      document.body.classList.add("guest");
      const loginBtn = document.querySelector(".login-btn");
      if (loginBtn) loginBtn.style.display = "flex";
      if (userAvatarWrapper) userAvatarWrapper.style.display = "none";
      if (notificationWrapper) notificationWrapper.style.display = "none";
    },
    logout: function (message) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("loginTimestamp");
      if (message) alert(message);
      window.location.reload();
    },
    resetInactivityTimer: function () {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = setTimeout(
        () => this.logout("Bạn đã không hoạt động trong 30 phút."),
        this.timeoutDuration
      );
    },
    setupActivityListeners: function () {
      const resetTimer = this.resetInactivityTimer.bind(this);
      ["mousemove", "keydown", "scroll"].forEach((event) =>
        window.addEventListener(event, resetTimer)
      );
    },
  };

  // --- Initialize All ---
  limitNotificationList();
  SessionManager.init();
});

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});
