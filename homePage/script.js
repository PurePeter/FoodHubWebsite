// Animation will appear when scroll page
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // Khi phần tử vào trong viewport
        if (entry.intersectionRatio) {
            entry.target.classList.add('is-visible');
            // Ngừng quan sát sau khi đã hiển thị để không lặp lại animation
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1 // Kích hoạt khi 10% phần tử được nhìn thấy
});

scrollRevealElements.forEach(element => {
    revealObserver.observe(element);
});

document.addEventListener('DOMContentLoaded', function() {
    // --- Slider Banner ---
    const slider = document.querySelector('.banner-slider');
    if (slider) {
        const slidesWrapper = slider.querySelector('.slides-wrapper');
        const slides = slider.querySelectorAll('.slide');
        const dotsContainer = slider.querySelector('.dots-container');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        let slideIndex = 0;
        let slideInterval;

        // Tạo các nốt chấm tương ứng với số lượng slide
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slide = index;
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function showSlide(n) {
            // Xử lý vòng lặp cho index
            slideIndex = (n + slides.length) % slides.length;

            // Di chuyển wrapper của các slide để tạo hiệu ứng trượt
            slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;

            // Cập nhật class 'active' cho slide và dot để tạo hiệu ứng phóng to
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[slideIndex].classList.add('active');
            dots[slideIndex].classList.add('active');
        }

        function nextSlide() {
            showSlide(slideIndex + 1);
        }

        function prevSlide() {
            showSlide(slideIndex - 1);
        }

        function startSlideShow() {
            stopSlideShow(); // Dừng slideshow cũ trước khi bắt đầu cái mới
            slideInterval = setInterval(nextSlide, 5000); // Tự động chuyển ảnh sau 5 giây
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        // Gán sự kiện click cho các nút
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideShow(); // Reset lại bộ đếm thời gian khi người dùng tương tác
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideShow();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideNumber = parseInt(e.target.dataset.slide);
                showSlide(slideNumber);
                startSlideShow();
            });
        });

        // Khởi chạy slider
        showSlide(slideIndex);
        startSlideShow();
    }
});
