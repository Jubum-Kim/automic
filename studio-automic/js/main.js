/**
 * STUDIO AUTOMIC - 메인 애플리케이션 진입점
 */

import { CAR_DATA, REVIEWS } from './carsData.js';
import { initHeroSlider, CarSectionSlider } from './slider.js';
import { initConsultModal } from './modal.js';

// 1. 차량 카드 HTML 템플릿 생성기 (첫번째 첨부 이미지 스타일 모사)
function createCarCardHTML(car) {
  return `
    <article class="car-card" data-id="${car.id}">
      <div class="card-badge-box">
        <span class="card-badge" style="background-color: ${car.badgeColor || '#d92525'}">
          ${car.badge}
        </span>
      </div>

      <div class="card-header-info">
        <h4 class="card-title-en">${car.nameEn}</h4>
        <p class="card-title-ko">${car.nameKo}</p>
      </div>

      <div class="card-img-wrap">
        <img src="${car.image}" alt="${car.nameEn}" class="card-img" loading="lazy" />
      </div>

      <div class="card-price-row">
        <div class="price-sub-label">옵션포함 차량가</div>
        <div class="price-main-val">${car.priceFormatted}</div>
      </div>

      <div class="card-finance-table">
        <div class="finance-row header">
          <div class="cell-label">구분</div>
          <div class="cell-rent">렌트(${car.rentCondition})</div>
          <div class="cell-lease">리스(${car.leaseCondition})</div>
        </div>
        <div class="finance-row">
          <div class="cell-label">기간</div>
          <div class="cell-rent">${car.period}</div>
          <div class="cell-lease">${car.period}</div>
        </div>
        <div class="finance-row">
          <div class="cell-label">월 납입금</div>
          <div class="cell-rent price">${car.rentPrice}</div>
          <div class="cell-lease price">${car.leasePrice}</div>
        </div>
      </div>

      <div class="card-tags">
        ${car.tags.map(t => `<span class="tag-badge">#${t}</span>`).join('')}
      </div>

      <button type="button" class="btn-card-consult" data-car="${car.nameEn} - ${car.nameKo}">
        <span>상담 신청</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </article>
  `;
}

// 2. 고객 리뷰 카드 HTML 생성기
function createReviewCardHTML(rev) {
  return `
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <span class="review-tag">${rev.tag}</span>
      <p class="review-text">"${rev.text}"</p>
      <div class="review-footer">
        <div>
          <span class="review-author">${rev.name}</span>
          <span style="font-size: 11px; color: #94a3b8; margin-left: 6px;">(${rev.type})</span>
        </div>
        <span style="font-size: 11px; color: #94a3b8;">${rev.date}</span>
      </div>
    </div>
  `;
}

// 3. 렌더링 함수
function renderCarSections() {
  const promoTrack = document.getElementById('promoCarTrack');
  const immdTrack = document.getElementById('immdCarTrack');
  const ecoTrack = document.getElementById('ecoCarTrack');
  const bizTrack = document.getElementById('bizCarTrack');
  const reviewGrid = document.getElementById('reviewGrid');

  if (promoTrack) promoTrack.innerHTML = CAR_DATA.promotion.map(createCarCardHTML).join('');
  if (immdTrack) immdTrack.innerHTML = CAR_DATA.immediate.map(createCarCardHTML).join('');
  if (ecoTrack) ecoTrack.innerHTML = CAR_DATA.eco.map(createCarCardHTML).join('');
  if (bizTrack) bizTrack.innerHTML = CAR_DATA.business.map(createCarCardHTML).join('');
  if (reviewGrid) reviewGrid.innerHTML = REVIEWS.map(createReviewCardHTML).join('');

  // 모든 [상담 신청] 버튼에 클릭 이벤트 위임
  document.addEventListener('click', (e) => {
    const consultBtn = e.target.closest('.btn-card-consult');
    if (consultBtn) {
      const carName = consultBtn.getAttribute('data-car') || '';
      window.openConsultModal(carName);
    }
  });
}

// 4. 헤더 스크롤 효과
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

// 5. 완충 섹션 내 렌트 VS 리스 비교 탭 인터랙션
function initCompareTabs() {
  const tabBtns = document.querySelectorAll('.compare-tabs .tab-btn');
  const rentRow = document.getElementById('compareRentCol');
  const leaseRow = document.getElementById('compareLeaseCol');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');

      const allRows = document.querySelectorAll('.compare-table tbody tr');
      allRows.forEach(row => {
        const type = row.getAttribute('data-type');
        if (target === 'all' || type === target) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

// 6. TOP 버튼 스크롤
function initTopButton() {
  const topBtn = document.getElementById('quickTopBtn');
  if (topBtn) {
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// 7. 숫자 카운트 애니메이션 (신뢰 통계)
function initCounterAnimation() {
  const statsSection = document.querySelector('.trust-stats-bar');
  if (!statsSection) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      const counters = document.querySelectorAll('.stat-val');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1500;
        const step = Math.ceil(target / (duration / 25));

        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          counter.textContent = start.toLocaleString() + suffix;
        }, 25);
      });
    }
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

// 초기화 실행
document.addEventListener('DOMContentLoaded', () => {
  // 1. 차량 데이터 렌더링
  renderCarSections();

  // 2. 모달 초기화
  initConsultModal();

  // 3. 히어로 배너 슬라이더 초기화
  initHeroSlider();

  // 4. 각 차량 섹션 슬라이더 초기화 (적당한 시간으로 자동 슬라이딩 & 멈춤 & 네비게이션)
  new CarSectionSlider('#sectionPromo', 4000);
  new CarSectionSlider('#sectionImmediate', 4500);
  new CarSectionSlider('#sectionEco', 4200);
  new CarSectionSlider('#sectionBusiness', 4800);

  // 5. 기타 UI 컴포넌트
  initHeaderScroll();
  initCompareTabs();
  initTopButton();
  initCounterAnimation();
});
