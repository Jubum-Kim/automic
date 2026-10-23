/**
 * STUDIO AUTOMIC - 모바일 전용 반응형 내비게이션 드로어 엔진
 */

export function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawerNavLinks = document.querySelectorAll('.mobile-drawer-nav a');

  if (!toggleBtn || !drawerBackdrop) return;

  function openDrawer() {
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDrawer();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  // 배경 클릭 시 닫기
  drawerBackdrop.addEventListener('click', (e) => {
    if (e.target === drawerBackdrop) {
      closeDrawer();
    }
  });

  // ESC 키 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerBackdrop.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 메뉴 항목 클릭 시 드로어 닫기
  drawerNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // 윈도우 창 크기가 데스크톱으로 전환되면 모바일 드로어 자동 닫기
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && drawerBackdrop.classList.contains('open')) {
      closeDrawer();
    }
  });
}
