/**
 * STUDIO AUTOMIC - 슬라이더 엔진 (히어로 배너 + 차량 캐러셀)
 * - 자동 롤링 (지정 시간)
 * - 마우스 호버 시 일시 정지 (pause on hover)
 * - 좌우 화살표 내비게이션
 * - 터치 스와이프 / 마우스 드래그 지원
 */

// 1. 히어로 메인 배너 슬라이더 초기화
export function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot-btn');
  const prevBtn = document.querySelector('.hero-slider-nav .prev-slide');
  const nextBtn = document.querySelector('.hero-slider-nav .next-slide');
  const container = document.querySelector('.hero-slider-section');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoTimer = null;
  const INTERVAL = 6000; // 6초 간격

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function startTimer() {
    stopTimer();
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, INTERVAL);
  }

  function stopTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  window.pauseHeroSlider = stopTimer;
  window.showHeroSlide = showSlide;

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      showSlide(idx);
      startTimer();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startTimer();
    });
  }

  if (container) {
    container.addEventListener('mouseenter', stopTimer);
    container.addEventListener('mouseleave', startTimer);
  }

  showSlide(0);
  // 사용자가 편안하게 디자인을 비교하실 수 있도록 자동 롤링은 12초 주기로 여유롭게 실행
  const RELAXED_INTERVAL = 12000;
  function startRelaxedTimer() {
    stopTimer();
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, RELAXED_INTERVAL);
  }
  startRelaxedTimer();
}

// 2. 개별 차량 섹션 슬라이더 초기화 클래스
export class CarSectionSlider {
  constructor(sectionSelector, autoInterval = 4500) {
    this.section = document.querySelector(sectionSelector);
    if (!this.section) return;

    this.viewport = this.section.querySelector('.car-slider-viewport');
    this.track = this.section.querySelector('.car-slider-track');
    this.prevBtn = this.section.querySelector('.nav-arrow-btn.prev');
    this.nextBtn = this.section.querySelector('.nav-arrow-btn.next');
    this.autoInterval = autoInterval;
    this.autoTimer = null;
    this.currentIndex = 0;

    this.init();
  }

  init() {
    if (!this.track) return;
    this.cards = this.track.querySelectorAll('.car-card');
    if (!this.cards.length) return;

    // 네비게이션 버튼 이벤트
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.startAuto();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.startAuto();
      });
    }

    // 마우스 호버 시 자동 롤링 일시정지
    this.viewport.addEventListener('mouseenter', () => this.stopAuto());
    this.viewport.addEventListener('mouseleave', () => this.startAuto());

    // 터치 스와이프 이벤트 바인딩
    this.bindTouch();

    // 창 리사이즈 시 위치 재조정
    window.addEventListener('resize', () => this.updatePosition());

    // 자동 롤링 시작
    this.startAuto();
  }

  getStepWidth() {
    if (!this.cards.length) return 0;
    const card = this.cards[0];
    const style = window.getComputedStyle(this.track);
    const gap = parseFloat(style.gap) || 22;
    return card.offsetWidth + gap;
  }

  getMaxIndex() {
    const visibleWidth = this.viewport.offsetWidth;
    const step = this.getStepWidth();
    if (!step) return 0;
    const visibleCards = Math.round(visibleWidth / step) || 1;
    return Math.max(0, this.cards.length - visibleCards);
  }

  next() {
    const max = this.getMaxIndex();
    if (this.currentIndex >= max) {
      this.currentIndex = 0; // 루프
    } else {
      this.currentIndex++;
    }
    this.updatePosition();
  }

  prev() {
    const max = this.getMaxIndex();
    if (this.currentIndex <= 0) {
      this.currentIndex = max;
    } else {
      this.currentIndex--;
    }
    this.updatePosition();
  }

  updatePosition() {
    const step = this.getStepWidth();
    const offset = -(this.currentIndex * step);
    this.track.style.transform = `translateX(${offset}px)`;
  }

  startAuto() {
    this.stopAuto();
    if (this.autoInterval > 0) {
      this.autoTimer = setInterval(() => {
        this.next();
      }, this.autoInterval);
    }
  }

  stopAuto() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  bindTouch() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.viewport.addEventListener('touchstart', (e) => {
      this.stopAuto();
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    this.viewport.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    this.viewport.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - currentX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      this.startAuto();
    });
  }
}
