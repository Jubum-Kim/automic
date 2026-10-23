/**
 * STUDIO AUTOMIC - 메인 애플리케이션 진입점
 */

import { CAR_DATA, REVIEWS } from './carsData.js';
import { initHeroSlider, CarSectionSlider } from './slider.js';
import { initConsultModal } from './modal.js';
import { initMobileNav } from './nav.js';

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

  // 전체보기 확장 그리드 요소
  const promoGrid = document.getElementById('promoCarGrid');
  const immdGrid = document.getElementById('immdCarGrid');
  const ecoGrid = document.getElementById('ecoCarGrid');
  const bizGrid = document.getElementById('bizCarGrid');

  const reviewGrid = document.getElementById('reviewGrid');

  // 슬라이더 트랙 렌더링
  if (promoTrack) promoTrack.innerHTML = CAR_DATA.promotion.map(createCarCardHTML).join('');
  if (immdTrack) immdTrack.innerHTML = CAR_DATA.immediate.map(createCarCardHTML).join('');
  if (ecoTrack) ecoTrack.innerHTML = CAR_DATA.eco.map(createCarCardHTML).join('');
  if (bizTrack) bizTrack.innerHTML = CAR_DATA.business.map(createCarCardHTML).join('');

  // 전체보기 확장 그리드 렌더링
  if (promoGrid) promoGrid.innerHTML = CAR_DATA.promotion.map(createCarCardHTML).join('');
  if (immdGrid) immdGrid.innerHTML = CAR_DATA.immediate.map(createCarCardHTML).join('');
  if (ecoGrid) ecoGrid.innerHTML = CAR_DATA.eco.map(createCarCardHTML).join('');
  if (bizGrid) bizGrid.innerHTML = CAR_DATA.business.map(createCarCardHTML).join('');

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

// 4. 전체보기 / 더보기 토글 엔진
function initViewAllToggle() {
  const sectionLabels = {
    promo: {
      name: '10월 특별 프로모션 차종',
      count: CAR_DATA.promotion.length
    },
    immediate: {
      name: '7일 이내 즉시출고 가능 차량',
      count: CAR_DATA.immediate.length
    },
    eco: {
      name: '친환경 전기차 / 하이브리드 특가',
      count: CAR_DATA.eco.length
    },
    business: {
      name: '개인 & 법인 사업자 맞춤 특판',
      count: CAR_DATA.business.length
    }
  };

  const toggleButtons = document.querySelectorAll('.btn-section-viewall, .btn-more-toggle');

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (!target) return;

      const gridEl = document.getElementById(`${target}CarGrid`);
      if (!gridEl) return;

      const isCurrentlyOpen = gridEl.style.display !== 'none';
      const relatedBtns = document.querySelectorAll(`[data-target="${target}"]`);
      const info = sectionLabels[target] || { name: '차종', count: 8 };

      if (!isCurrentlyOpen) {
        // [열기 - 전체보기 활성화]
        gridEl.style.display = 'grid';

        relatedBtns.forEach(b => {
          b.classList.add('active');
          b.setAttribute('aria-expanded', 'true');

          const viewAllTxt = b.querySelector('.viewall-text');
          if (viewAllTxt) viewAllTxt.textContent = '접기';

          const moreTxt = b.querySelector('.btn-text');
          if (moreTxt) moreTxt.textContent = `${info.name} 접기`;
        });

        // 사용자가 자연스럽게 전체 리스트를 확인할 수 있도록 부드럽게 스크롤
        setTimeout(() => {
          gridEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);

      } else {
        // [닫기 - 접기 활성화]
        gridEl.style.display = 'none';

        relatedBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-expanded', 'false');

          const viewAllTxt = b.querySelector('.viewall-text');
          if (viewAllTxt) viewAllTxt.textContent = '전체보기';

          const moreTxt = b.querySelector('.btn-text');
          if (moreTxt) moreTxt.textContent = `${info.name} 더보기 (전체 ${info.count}대 펼치기)`;
        });

        // 접을 때 섹션 상단으로 복귀
        const sectionWrap = gridEl.closest('.section-wrap');
        if (sectionWrap) {
          sectionWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// 5. 헤더 스크롤 효과
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

// 8. 숫자 카운트 애니메이션 (신뢰 통계)
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
  // 1. 차량 데이터 렌더링 (슬라이더 + 전체보기 그리드)
  renderCarSections();

  // 2. 전체보기 / 더보기 버튼 인터랙션 초기화
  initViewAllToggle();

  // 3. 모달 초기화
  initConsultModal();

  // 4. 히어로 배너 슬라이더 초기화
  initHeroSlider();

  // 5. 각 차량 섹션 슬라이더 초기화 (적당한 시간으로 자동 슬라이딩 & 멈춤 & 네비게이션)
  new CarSectionSlider('#sectionPromo', 4000);
  new CarSectionSlider('#sectionImmediate', 4500);
  new CarSectionSlider('#sectionEco', 4200);
  new CarSectionSlider('#sectionBusiness', 4800);

  // 6. 기타 UI 컴포넌트
  initHeaderScroll();
  initTopButton();
  initCounterAnimation();
  initMobileNav();
});
