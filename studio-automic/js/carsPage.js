/**
 * STUDIO AUTOMIC - 서브 페이지 (cars.html) 전용 제어 스크립트
 * - 카테고리 전환 (특판, 즉시출고, 친환경, 사업자, 전체)
 * - 제조사(로고 포함), 크기, 형태, 연료 다중 필터링
 * - 정렬 및 키워드 검색
 * - 상담 신청 모달 연동
 */

import { MASTER_CARS } from './carsData.js';
import { BRANDS } from './brandLogos.js';
import { initConsultModal } from './modal.js';
import { initMobileNav } from './nav.js';

// 1. 카테고리 메타 정보 정의
const CATEGORY_META = {
  all: {
    key: 'all',
    badge: 'ALL MODELS',
    title: '스튜디오 아우토믹 전체 차종',
    desc: '국산 및 수입 전 브랜드, 24개 금융사 공식 제휴 최저가 견적과 무보증 승인 혜택을 한자리에서 비교하세요.'
  },
  promo: {
    key: 'promo',
    badge: 'SPECIAL PROMOTION',
    title: '10월 특별 프로모션 차종',
    desc: '스튜디오 아우토믹 특별 프로모션 차종, 비공식 금융사 혜택까지 더해진 파격적인 조건'
  },
  immd: {
    key: 'immd',
    badge: 'IMMEDIATE DELIVERY',
    title: '7일 이내 도착! 즉시출고 가능 차량',
    desc: '출고 대기 줄이고 견적 혜택은 크게! 선구매 확보 물량으로 계약 즉시 전국 안전 탁송'
  },
  eco: {
    key: 'eco',
    badge: 'ECO FRIENDLY',
    title: '친환경 전기차 / 하이브리드 특가',
    desc: '지자체 친환경 보조금 100% 반영! 유지비와 취등록세 절감까지 누리는 친환경 스마트 라인업'
  },
  biz: {
    key: 'biz',
    badge: 'BUSINESS SPECIAL',
    title: '개인 & 법인 사업자 맞춤 특판',
    desc: '월 렌트·리스료 100% 손비처리, 9인승 이상 부가세 환급 및 건강보험료 인상 없는 절세 특화 라인업'
  }
};

// 2. 필터 상태 관리 객체
const state = {
  category: 'all',
  brandOrigin: 'all', // 'all', 'domestic', 'import'
  selectedBrand: null, // 브랜드 ID 또는 null(전체)
  selectedSize: null, // 크기 또는 null(전체)
  selectedBodyType: null, // 형태 또는 null(전체)
  selectedFuel: null, // 연료 또는 null(전체)
  keyword: '',
  sort: 'recommend'
};

// 3. 차량 카드 HTML 생성 (메인과 동일한 럭셔리 카드 디자인)
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

// 4. 제조사 칩 그리드 렌더링 (국산/수입 탭 필터링 포함)
function renderBrandChips() {
  const container = document.getElementById('brandChipsGrid');
  if (!container) return;

  const filteredBrands = BRANDS.filter(b => {
    if (state.brandOrigin === 'all') return true;
    return b.origin === state.brandOrigin;
  });

  container.innerHTML = filteredBrands.map(b => {
    const isSelected = state.selectedBrand === b.id;
    return `
      <button type="button" class="brand-chip ${isSelected ? 'active' : ''}" data-brand-id="${b.id}" title="${b.nameKo} (${b.nameEn})">
        <span class="brand-logo-icon">${b.logoSvg}</span>
        <span class="brand-name-ko">${b.nameKo}</span>
      </button>
    `;
  }).join('');

  // 칩 클릭 이벤트
  container.querySelectorAll('.brand-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const brandId = btn.getAttribute('data-brand-id');
      if (state.selectedBrand === brandId) {
        state.selectedBrand = null; // 토글 해제 -> 전체 보기
      } else {
        state.selectedBrand = brandId;
      }
      renderBrandChips();
      applyFiltersAndRender();
    });
  });
}

// 5. 선택된 필터 요약 태그 렌더링
function renderActiveTags() {
  const container = document.getElementById('activeFiltersBar');
  if (!container) return;

  const tags = [];

  if (state.selectedBrand) {
    const brand = BRANDS.find(b => b.id === state.selectedBrand);
    if (brand) tags.push({ type: 'brand', label: `제조사: ${brand.nameKo}` });
  }

  if (state.selectedSize) {
    tags.push({ type: 'size', label: `크기: ${state.selectedSize}` });
  }

  if (state.selectedBodyType) {
    tags.push({ type: 'bodyType', label: `형태: ${state.selectedBodyType}` });
  }

  if (state.selectedFuel) {
    tags.push({ type: 'fuel', label: `연료: ${state.selectedFuel}` });
  }

  if (state.keyword) {
    tags.push({ type: 'keyword', label: `검색: "${state.keyword}"` });
  }

  if (tags.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = `
    <span class="active-filters-label">선택된 조건:</span>
    ${tags.map(t => `
      <span class="selected-tag-badge">
        <span>${t.label}</span>
        <button type="button" data-tag-type="${t.type}" aria-label="필터 해제">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    `).join('')}
  `;

  // 태그 삭제 버튼 이벤트
  container.querySelectorAll('button[data-tag-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-tag-type');
      if (type === 'brand') state.selectedBrand = null;
      if (type === 'size') state.selectedSize = null;
      if (type === 'bodyType') state.selectedBodyType = null;
      if (type === 'fuel') state.selectedFuel = null;
      if (type === 'keyword') {
        state.keyword = '';
        const searchInput = document.getElementById('carSearchInput');
        if (searchInput) searchInput.value = '';
      }
      updateChipActiveStyles();
      renderBrandChips();
      applyFiltersAndRender();
    });
  });
}

// 6. 칩 활성 스타일 UI 동기화
function updateChipActiveStyles() {
  // 크기 칩
  document.querySelectorAll('[data-filter-group="size"]').forEach(btn => {
    const val = btn.getAttribute('data-val');
    btn.classList.toggle('active', (val === '' && !state.selectedSize) || val === state.selectedSize);
  });

  // 형태 칩
  document.querySelectorAll('[data-filter-group="bodyType"]').forEach(btn => {
    const val = btn.getAttribute('data-val');
    btn.classList.toggle('active', (val === '' && !state.selectedBodyType) || val === state.selectedBodyType);
  });

  // 연료 칩
  document.querySelectorAll('[data-filter-group="fuel"]').forEach(btn => {
    const val = btn.getAttribute('data-val');
    btn.classList.toggle('active', (val === '' && !state.selectedFuel) || val === state.selectedFuel);
  });
}

// 7. 필터링 및 렌더링 메인 함수
function applyFiltersAndRender() {
  const resultGrid = document.getElementById('carsMainGrid');
  const countEl = document.getElementById('totalResultCount');
  if (!resultGrid) return;

  // 필터링 적용
  let filtered = MASTER_CARS.filter(car => {
    // 1) 카테고리 필터
    if (state.category !== 'all') {
      const catMap = { promo: 'promo', immd: 'immediate', eco: 'eco', biz: 'business' };
      const targetCat = catMap[state.category] || state.category;
      if (!car.categories.includes(targetCat)) return false;
    }

    // 2) 제조사 필터
    if (state.selectedBrand && car.brandId !== state.selectedBrand) {
      return false;
    }

    // 3) 크기 필터
    if (state.selectedSize && car.size !== state.selectedSize) {
      return false;
    }

    // 4) 형태 필터
    if (state.selectedBodyType && car.bodyType !== state.selectedBodyType) {
      return false;
    }

    // 5) 연료 필터
    if (state.selectedFuel && car.fuel !== state.selectedFuel) {
      return false;
    }

    // 6) 키워드 검색
    if (state.keyword) {
      const q = state.keyword.toLowerCase();
      const matchName = car.nameKo.toLowerCase().includes(q) || car.nameEn.toLowerCase().includes(q);
      const matchBrand = car.brandKo.toLowerCase().includes(q) || car.brandEn.toLowerCase().includes(q);
      const matchTag = car.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchTag) return false;
    }

    return true;
  });

  // 정렬 적용
  if (state.sort === 'rentLow') {
    filtered.sort((a, b) => parseInt(a.rentPrice.replace(/[^0-9]/g, '')) - parseInt(b.rentPrice.replace(/[^0-9]/g, '')));
  } else if (state.sort === 'priceLow') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sort === 'priceHigh') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // 카운트 표시
  if (countEl) countEl.textContent = filtered.length;

  // 그리드 렌더링
  if (filtered.length > 0) {
    resultGrid.innerHTML = filtered.map(createCarCardHTML).join('');
  } else {
    // 결과 없음 엠티 스테이트
    resultGrid.innerHTML = `
      <div class="empty-cars-box">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">선택하신 조건에 해당하는 차량이 없습니다.</h3>
        <p class="empty-desc">
          원하시는 차종과 옵션이 목록에 없더라도, 스튜디오 아우토믹 24개 금융사 네트워크를 통해 전국 최저가 비공식 견적을 즉시 찾아드립니다.
        </p>
        <div class="empty-actions">
          <button type="button" class="btn-empty-reset" id="emptyResetBtn">필터 초기화</button>
          <button type="button" class="btn-empty-consult" onclick="window.openConsultModal('원하는 차종 1:1 맞춤 견적 문의');">
            1:1 맞춤 견적 신청하기
          </button>
        </div>
      </div>
    `;

    document.getElementById('emptyResetBtn')?.addEventListener('click', resetAllFilters);
  }

  renderActiveTags();
  updateMobileFilterCountBadge();
}

// 8. 필터 전체 초기화
function resetAllFilters() {
  state.selectedBrand = null;
  state.selectedSize = null;
  state.selectedBodyType = null;
  state.selectedFuel = null;
  state.keyword = '';
  state.sort = 'recommend';

  const searchInput = document.getElementById('carSearchInput');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('carSortSelect');
  if (sortSelect) sortSelect.value = 'recommend';

  renderBrandChips();
  updateChipActiveStyles();
  applyFiltersAndRender();
}

// 9. 카테고리 전환 및 배너 메타 갱신
function setCategory(catKey) {
  state.category = catKey in CATEGORY_META ? catKey : 'all';

  // URL 쿼리 파라미터 업데이트 (새로고침 없이)
  const url = new URL(window.location);
  url.searchParams.set('category', state.category);
  window.history.pushState({}, '', url);

  // 배너 메타 갱신
  const meta = CATEGORY_META[state.category];
  const badgeEl = document.getElementById('subHeroBadge');
  const titleEl = document.getElementById('subHeroTitle');
  const descEl = document.getElementById('subHeroDesc');
  const breadcrumbEl = document.getElementById('breadcrumbCategory');

  if (badgeEl) badgeEl.textContent = meta.badge;
  if (titleEl) titleEl.textContent = meta.title;
  if (descEl) descEl.textContent = meta.desc;
  if (breadcrumbEl) breadcrumbEl.textContent = meta.title.replace('스튜디오 아우토믹 ', '');

  // 탭 버튼 active 클래스 갱신
  document.querySelectorAll('.category-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === state.category);
  });

  // GNB 메뉴 활성 표시
  document.querySelectorAll('.gnb-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href.includes(`category=${state.category}`));
  });

  applyFiltersAndRender();
}

// 10. 모바일 바텀시트 필터 제어 & 활성 필터 개수 뱃지 갱신
function updateMobileFilterCountBadge() {
  const badge = document.getElementById('mobileFilterBadge');
  const applyText = document.getElementById('filterApplyCountText');
  const totalCountEl = document.getElementById('totalResultCount');

  const count = (state.selectedBrand ? 1 : 0) +
                (state.selectedSize ? 1 : 0) +
                (state.selectedBodyType ? 1 : 0) +
                (state.selectedFuel ? 1 : 0) +
                (state.keyword ? 1 : 0);

  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }

  if (applyText && totalCountEl) {
    applyText.textContent = `${totalCountEl.textContent}대 맞춤 차량 보기`;
  }
}

function initMobileFilterSheet() {
  const openBtn = document.getElementById('openMobileFilterBtn');
  const closeBtn = document.getElementById('closeFilterSheetBtn');
  const applyBtn = document.getElementById('applyFilterSheetBtn');
  const backdrop = document.getElementById('filterSheetBackdrop');
  const filterCard = document.getElementById('filterCard');
  const mobileResetBtn = document.getElementById('mobileFilterResetBtn');

  function openSheet() {
    if (!filterCard || !backdrop) return;
    backdrop.classList.add('open');
    filterCard.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSheet() {
    if (!filterCard || !backdrop) return;
    filterCard.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openSheet);
  closeBtn?.addEventListener('click', closeSheet);
  applyBtn?.addEventListener('click', closeSheet);
  backdrop?.addEventListener('click', closeSheet);

  mobileResetBtn?.addEventListener('click', () => {
    resetAllFilters();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && filterCard?.classList.contains('open')) {
      closeSheet();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && filterCard?.classList.contains('open')) {
      closeSheet();
    }
  });
}

// 11. 이벤트 리스너 바인딩
function initEvents() {
  // 모바일 바텀시트 제어 초기화
  initMobileFilterSheet();

  // 1) 카테고리 탭 클릭
  document.querySelectorAll('.category-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat');
      setCategory(cat);
    });
  });

  // 2) 국산 / 수입 탭 클릭
  document.querySelectorAll('.brand-origin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.brand-origin-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.brandOrigin = btn.getAttribute('data-origin');
      renderBrandChips();
    });
  });

  // 3) 크기, 형태, 연료 칩 클릭
  document.querySelectorAll('.filter-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-filter-group');
      const val = btn.getAttribute('data-val');

      if (group === 'size') state.selectedSize = val || null;
      if (group === 'bodyType') state.selectedBodyType = val || null;
      if (group === 'fuel') state.selectedFuel = val || null;

      updateChipActiveStyles();
      applyFiltersAndRender();
    });
  });

  // 4) 필터 전체 초기화 버튼
  document.getElementById('filterResetBtn')?.addEventListener('click', resetAllFilters);

  // 5) 정렬 드롭다운
  document.getElementById('carSortSelect')?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    applyFiltersAndRender();
  });

  // 6) 차량명 검색 인풋 (디바운스 적용)
  let searchTimer = null;
  const searchInput = document.getElementById('carSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.keyword = e.target.value.trim();
        applyFiltersAndRender();
      }, 250);
    });
  }

  // 7) 차량 카드 [상담 신청] 버튼 클릭 위임
  document.addEventListener('click', (e) => {
    const consultBtn = e.target.closest('.btn-card-consult');
    if (consultBtn) {
      const carName = consultBtn.getAttribute('data-car') || '';
      window.openConsultModal(carName);
    }
  });

  // 8) 헤더 스크롤 효과
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 9) TOP 버튼
  document.getElementById('quickTopBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 초기화 실행
document.addEventListener('DOMContentLoaded', () => {
  // 모달 초기화
  initConsultModal();

  // URL에서 초기 카테고리 파싱
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get('category') || 'promo';

  // UI 구성요소 초기화
  renderBrandChips();
  updateChipActiveStyles();
  initEvents();
  initMobileNav();

  // 초기 카테고리 적용
  setCategory(initialCategory);
});
