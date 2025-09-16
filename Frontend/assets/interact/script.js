document.addEventListener("DOMContentLoaded", function () {
  // --- Check login status for booking link ---
  const bookingNavLink = document.getElementById("booking-nav-link");
  if (bookingNavLink) {
    bookingNavLink.addEventListener("click", (event) => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (!loggedInUser) {
        event.preventDefault(); // Ngăn chuyển hướng mặc định
        alert("Vui lòng đăng nhập để đặt bàn!");
      }
      // Nếu đã đăng nhập, không cần làm gì, liên kết sẽ hoạt động bình thường
    });
  }

  // --- Animation for scroll reveal ---
  const scrollRevealElements = document.querySelectorAll(".scroll-reveal");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  scrollRevealElements.forEach((element) => revealObserver.observe(element));

  // --- Slider Banner ---
  const slider = document.querySelector(".banner-slider");
  let bannerFetchInitiated = false; // Cờ để đảm bảo chỉ fetch 1 lần

  // Hàm để tải và khởi tạo banner
  function loadAndInitBanners() {
    if (!slider || bannerFetchInitiated) return;
    bannerFetchInitiated = true;

    const slidesWrapper = slider.querySelector(".slides-wrapper");
    const dotsContainer = slider.querySelector(".dots-container");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");

    // Hiển thị loader trước khi fetch
    slidesWrapper.innerHTML = `<div class="loader-wrapper"><div class="loader"></div></div>`;
    if (prevBtn) prevBtn.style.display = "block";
    if (nextBtn) nextBtn.style.display = "block";
    if (dotsContainer) dotsContainer.style.display = "block";

    fetch(`${API_BASE_URL}/bannerslides`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        slidesWrapper.innerHTML = ""; // Xóa loader
        if (data.length === 0) {
          throw new Error("No banners found");
        }
        data.forEach((slideData) => {
          const slide = document.createElement("div");
          slide.classList.add("slide");
          const img = document.createElement("img");
          // Tạo URL đầy đủ đến ảnh trên backend
          img.src = `${API_BASE_URL}/images/${slideData.imageName}`;
          img.alt = "FoodHub Banner";
          slide.appendChild(img);
          slidesWrapper.appendChild(slide);
        });
        initSlider(slider, slidesWrapper, dotsContainer, prevBtn, nextBtn);
      })
      .catch((error) => {
        console.error("Error fetching banner slides:", error);
        slidesWrapper.innerHTML = `<p class='error-message'>Không thể tải banner!</p>`;
        // Ẩn các nút điều khiển slider khi có lỗi
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
        if (dotsContainer) dotsContainer.style.display = "none";
      })
      .finally(() => {
        // Reset cờ sau khi fetch xong (thành công hoặc thất bại)
        // để có thể fetch lại nếu cần (ví dụ: người dùng refresh)
        bannerFetchInitiated = false;
      });
  }

  // Gọi hàm tải banner khi trang được tải lần đầu
  loadAndInitBanners();

  // Xử lý khi trang được hiển thị lại từ bfcache
  window.addEventListener("pageshow", function (event) {
    // event.persisted là true nếu trang được tải từ bfcache
    if (event.persisted) {
      console.log("Page was loaded from the bfcache. Re-initializing banners.");
      // Tải lại banner để đảm bảo dữ liệu luôn mới nhất
      loadAndInitBanners();
    }
  });

  // Hàm khởi tạo slider (được tách ra để tái sử dụng)
  function initSlider(slider, slidesWrapper, dotsContainer, prevBtn, nextBtn) {
    // Xóa các dot cũ trước khi tạo mới
    dotsContainer.innerHTML = "";

    let slideIndex = 0;
    let slideInterval;
    let slides = [];
    let dots = [];

    slides = slider.querySelectorAll(".slide");

    // Nếu không có slide nào thì không làm gì cả
    if (slides.length === 0) return;

    slides.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.dataset.slide = index;
      dotsContainer.appendChild(dot);
    });

    dots = dotsContainer.querySelectorAll(".dot");

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const slideNumber = parseInt(e.target.dataset.slide);
        showSlide(slideNumber);
        startSlideShow();
      });
    });

    function showSlide(n) {
      slideIndex = (n + slides.length) % slides.length;
      slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));
      if (slides[slideIndex]) slides[slideIndex].classList.add("active");
      if (dots[slideIndex]) dots[slideIndex].classList.add("active");
    }

    function nextSlide() {
      showSlide(slideIndex + 1);
    }

    function prevSlide() {
      showSlide(slideIndex - 1);
    }

    function startSlideShow() {
      stopSlideShow();
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
      clearInterval(slideInterval);
    }

    prevBtn.addEventListener("click", () => {
      prevSlide();
      startSlideShow();
    });

    nextBtn.addEventListener("click", () => {
      nextSlide();
      startSlideShow();
    });

    showSlide(slideIndex);
    startSlideShow();
  }
});

/*
  Phần mã cũ đã được tích hợp vào trong sự kiện DOMContentLoaded ở trên
  để đảm bảo thứ tự thực thi và quản lý code tốt hơn.
*/
/*
  if (slider) {
    const slidesWrapper = slider.querySelector(".slides-wrapper");
    const dotsContainer = slider.querySelector(".dots-container");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    let slideIndex = 0;
    let slideInterval;
    let slides = [];
    let dots = [];
  }
*/
