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
        const dotsContainer = slider.querySelector('.dots-container');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        let slideIndex = 0;
        let slideInterval;
        let slides = [];
        let dots = [];

        function initSlider() {
            slides = slider.querySelectorAll('.slide');
            dots = dotsContainer.querySelectorAll('.dot');

            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.dataset.slide = index;
                dotsContainer.appendChild(dot);
            });

            dots = dotsContainer.querySelectorAll('.dot');

            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const slideNumber = parseInt(e.target.dataset.slide);
                    showSlide(slideNumber);
                    startSlideShow();
                });
            });

            showSlide(slideIndex);
            startSlideShow();
        }

        function showSlide(n) {
            slideIndex = (n + slides.length) % slides.length;
            slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
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
            stopSlideShow();
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideShow();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideShow();
        });

        fetch('http://localhost:3001/api/bannerslides')
            .then(response => response.json())
            .then(data => {
                data.forEach(slideData => {
                    const slide = document.createElement('div');
                    slide.classList.add('slide');
                    const img = document.createElement('img');
                    img.src = slideData.imageUrl.replace('..', '.');
                    img.alt = 'FoodHub Banner';
                    slide.appendChild(img);
                    slidesWrapper.appendChild(slide);
                });
                initSlider();
            })
            .catch(error => console.error('Error fetching banner slides:', error));
    }
});