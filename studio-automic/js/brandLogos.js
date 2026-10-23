/**
 * STUDIO AUTOMIC - 제조사 로고 및 메타데이터
 * 15개 제조사 (국산 6개사, 수입 9개사)
 * 각 제조사의 선명한 벡터 SVG 로고 포함
 */

export const BRANDS = [
  // --- 국산 제조사 (6개사) ---
  {
    id: 'hyundai',
    nameKo: '현대',
    nameEn: 'HYUNDAI',
    origin: 'domestic',
    logoSvg: `<svg viewBox="0 0 100 60" fill="currentColor"><path d="M50 4C23.5 4 2 15.6 2 30s21.5 26 48 26 48-11.6 48-26S76.5 4 50 4zm0 47.5C26 51.5 6.5 41.9 6.5 30S26 8.5 50 8.5 93.5 18.1 93.5 30 74 51.5 50 51.5zm19.8-33.3c-2.3 0-5.1.7-8.1 2.1-4 1.9-8.4 5.3-11.7 9.8-3.3-4.5-7.7-7.9-11.7-9.8-3-1.4-5.8-2.1-8.1-2.1-5.2 0-8.5 3.3-8.5 8.4 0 9.2 12 21.3 22.3 21.3 2.1 0 3.9-.5 5.5-1.5 1.6 1 3.4 1.5 5.5 1.5 10.3 0 22.3-12.1 22.3-21.3 0-5.1-3.3-8.4-7.5-8.4zm-22.9 22.3c-1.8.8-3.8 1.3-5.9 1.3-7.5 0-16.1-9.3-16.1-15.6 0-2.4 1.4-3.9 3.5-3.9 1.3 0 2.9.5 4.8 1.4 3.7 1.8 8.1 5.4 11.2 10.2l2.5 6.6zm12.3-6.6c3.1-4.8 7.5-8.4 11.2-10.2 1.9-.9 3.5-1.4 4.8-1.4 2.1 0 3.5 1.5 3.5 3.9 0 6.3-8.6 15.6-16.1 15.6-2.1 0-4.1-.5-5.9-1.3l2.5-6.6z"/></svg>`
  },
  {
    id: 'kia',
    nameKo: '기아',
    nameEn: 'KIA',
    origin: 'domestic',
    logoSvg: `<svg viewBox="0 0 100 45" fill="currentColor"><path d="M7 10h11v25H7zm24 0h11v11l10-11h13L51 24l15 11H52L42 24v11H31zm44 0h11l11 25h-10l-2-5H75l-2 5H64zm7 6l-3 9h7z"/></svg>`
  },
  {
    id: 'genesis',
    nameKo: '제네시스',
    nameEn: 'GENESIS',
    origin: 'domestic',
    logoSvg: `<svg viewBox="0 0 120 50" fill="currentColor"><path d="M60 16l-8 7h16zm0-8C45 8 18 19 2 27c16 0 36-2 50-7-10 6-28 11-42 12 18 3 38 1 50-4-7 5-21 9-32 10 16 1 34-1 46-5l-4-4 10 5 10-5-4 4c12 4 30 6 46 5-11-1-25-5-32-10 12 5 32 7 50 4-14-1-32-6-42-12 14 5 34 7 50 7C102 19 75 8 60 8z"/></svg>`
  },
  {
    id: 'renault',
    nameKo: '르노코리아',
    nameEn: 'RENAULT',
    origin: 'domestic',
    logoSvg: `<svg viewBox="0 0 60 80" fill="currentColor"><path d="M30 0L2 40l28 40 28-40L30 0zm0 16.5L47.5 40 30 63.5 12.5 40 30 16.5zM30 25L19.5 40 30 55l10.5-15L30 25z"/></svg>`
  },
  {
    id: 'kgm',
    nameKo: 'KGM모빌리티',
    nameEn: 'KGM',
    origin: 'domestic',
    logoSvg: `<svg viewBox="0 0 100 50" fill="currentColor"><path d="M12 25c0-8.8 7.2-16 16-16 6.2 0 11.6 3.5 14.3 8.7l-7.2 4.1C33.7 19.3 31 17.5 28 17.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5c3 0 5.7-1.8 7.1-4.3l7.2 4.1c-2.7 5.2-8.1 8.7-14.3 8.7-8.8 0-16-7.2-16-16zm36-15h22v8.5H57.5v4.5h11v7.5h-11v9H48zm30 0h9.5l9 16.5 9-16.5H97v30h-8.5v-16l-8 14h-3l-8-14v16H78z"/></svg>`
  },
  {
    id: 'chevrolet',
    nameKo: '쉐보레',
    nameEn: 'CHEVROLET',
    origin: 'domestic',
    logoSvg: `<svg viewBox="0 0 120 50" fill="currentColor"><path d="M48 6h24v11h42l-4 16H72v11H48V33H6l4-16h38z"/></svg>`
  },

  // --- 수입 제조사 (9개사) ---
  {
    id: 'mercedes-benz',
    nameKo: '벤츠',
    nameEn: 'MERCEDES-BENZ',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" stroke-width="5"/><path d="M40 8L36 38l-27 15 29-2 2 30 2-30 29 2-27-15z"/></svg>`
  },
  {
    id: 'bmw',
    nameKo: 'BMW',
    nameEn: 'BMW',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" stroke-width="2"/><path d="M40 12v28H12A28 28 0 0 1 40 12zm0 56V40h28a28 28 0 0 1-28 28z"/></svg>`
  },
  {
    id: 'audi',
    nameKo: '아우디',
    nameEn: 'AUDI',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 140 50" fill="currentColor"><circle cx="28" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="56" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="84" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="112" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"/></svg>`
  },
  {
    id: 'tesla',
    nameKo: '테슬라',
    nameEn: 'TESLA',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 80 80" fill="currentColor"><path d="M40 14c-13.6 0-24.8 4.2-31 10.4l5.3 6.6C19.4 26 28.5 22.8 40 22.8s20.6 3.2 25.7 8.2l5.3-6.6C64.8 18.2 53.6 14 40 14zm-4.5 17.5v44.2h9V31.5c4.8.4 9.5 1.4 13.9 3.1l3.5-7.9c-5.4-2.1-11.2-3.4-17.4-3.8v-1.6h-9v1.6c-6.2.4-12 1.7-17.4 3.8l3.5 7.9c4.4-1.7 9.1-2.7 13.9-3.1z"/></svg>`
  },
  {
    id: 'byd',
    nameKo: 'BYD',
    nameEn: 'BYD',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 100 45" fill="currentColor"><circle cx="50" cy="22.5" r="21" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 13h10c3.5 0 6 1.8 6 4.7 0 2-1.2 3.5-3 4.2 2.3.6 3.8 2.3 3.8 4.8 0 3.2-2.7 5.3-6.8 5.3H22zm4.5 4v4h5.2c1.4 0 2.4-.8 2.4-2s-1-2-2.4-2zm0 7.5V32h5.8c1.6 0 2.6-.9 2.6-2.2 0-1.4-1-2.3-2.6-2.3zm18-11.5h4.8l4.8 8.5 4.8-8.5h4.8L54 26.5V36h-4.6v-9.5zm22 0h9.2c6.2 0 10.8 4.5 10.8 11.5s-4.6 11.5-10.8 11.5h-9.2zm4.6 4.2v14.6h4.5c3.5 0 6.1-2.8 6.1-7.3s-2.6-7.3-6.1-7.3z"/></svg>`
  },
  {
    id: 'polestar',
    nameKo: '폴스타',
    nameEn: 'POLESTAR',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 80 80" fill="currentColor"><path d="M40 6L33 33h20L40 6zm0 68l7-27H27l13 27zM6 40l27 7V27L6 40zm68 0l-27-7v20l27-13z"/></svg>`
  },
  {
    id: 'volvo',
    nameKo: '볼보',
    nameEn: 'VOLVO',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 80 80" fill="currentColor"><circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" stroke-width="6"/><path d="M57 13h12v12m-2-10L48 34" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="square"/></svg>`
  },
  {
    id: 'landrover',
    nameKo: '랜드로버',
    nameEn: 'LAND ROVER',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 110 55" fill="currentColor"><ellipse cx="55" cy="27.5" rx="52" ry="24" fill="none" stroke="currentColor" stroke-width="4"/><path d="M22 23h5v9h7v4H22zm18 0h5l4 9 4-9h5v13h-4v-8l-3.5 8h-3l-3.5-8v8h-4zm24 0h6c3.5 0 6 1.8 6 4.5 0 2-1.3 3.5-3.2 4.1L78 36h-5l-4-4.5h-1V36h-4zm4 3.5v3.5h2c1.2 0 2-.6 2-1.7 0-1.2-.8-1.8-2-1.8z"/></svg>`
  },
  {
    id: 'porsche',
    nameKo: '포르쉐',
    nameEn: 'PORSCHE',
    origin: 'import',
    logoSvg: `<svg viewBox="0 0 70 85" fill="currentColor"><path d="M35 4C20 4 8 10 8 10l5 58c3 9 22 13 22 13s19-4 22-13l5-58S50 4 35 4zm0 8c10 0 17 3 20 5l-2 20H17l-2-20c3-2 10-5 20-5zm-1 34h2v16h-2zm-12 11c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm24 0c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3z"/></svg>`
  }
];

export function getBrandById(id) {
  return BRANDS.find(b => b.id === id || b.nameKo === id || b.nameEn.toLowerCase() === id.toLowerCase());
}
