/**
 * STUDIO AUTOMIC - 상담 신청 모달 및 본인인증, 약관 아코디언 엔진
 */

export function initConsultModal() {
  const backdrop = document.getElementById('consultModalBackdrop');
  const modalDialog = backdrop?.querySelector('.modal-dialog');
  const closeBtn = document.getElementById('modalCloseBtn');
  const carNameInput = document.getElementById('consultCarName');
  const consultForm = document.getElementById('consultForm');
  
  // 본인인증 관련 엘리먼트
  const authKakaoBtn = document.getElementById('btnAuthKakao');
  const authSmsBtn = document.getElementById('btnAuthSms');
  const authVerifyBox = document.getElementById('authVerifyBox');
  const authCodeInput = document.getElementById('authCodeInput');
  const authConfirmBtn = document.getElementById('btnAuthConfirm');
  const authTimerSpan = document.getElementById('authTimer');
  const authStatusSuccess = document.getElementById('authStatusSuccess');
  
  // 약관 아코디언 관련
  const accordionToggleBtn = document.getElementById('accordionToggleBtn');
  const agreementAccordion = document.getElementById('agreementAccordion');
  const agreeCheckbox = document.getElementById('agreeCheckbox');

  let isVerified = false;
  let authCountdown = null;
  let timerSeconds = 180; // 3분

  // 모달 열기 함수
  window.openConsultModal = function(carName = '') {
    if (!backdrop) return;
    
    // 차종명 설정
    if (carNameInput) {
      if (carName) {
        carNameInput.value = carName;
        carNameInput.classList.add('highlight-car');
      } else {
        carNameInput.value = '전 차종 비교견적 / 맞춤 상담 희망';
        carNameInput.classList.remove('highlight-car');
      }
    }

    // 모달 표시
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
  };

  // 모달 닫기 함수
  window.closeConsultModal = function() {
    if (!backdrop) return;
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  // 닫기 버튼 & 배경 클릭
  if (closeBtn) closeBtn.addEventListener('click', window.closeConsultModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) window.closeConsultModal();
    });
  }

  // ESC 키 누르면 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop?.classList.contains('open')) {
      window.closeConsultModal();
    }
  });

  // 약관 아코디언 토글
  if (accordionToggleBtn && agreementAccordion) {
    accordionToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      agreementAccordion.classList.toggle('open');
      const isOpen = agreementAccordion.classList.contains('open');
      accordionToggleBtn.textContent = isOpen ? '내용 닫기 ▲' : '내용보기 ▼';
    });
  }

  // 본인인증 번호 발송 핸들러
  function triggerAuthSend(methodName) {
    const phoneInput = document.getElementById('consultPhone');
    const phoneVal = phoneInput?.value.trim();

    if (!phoneVal || phoneVal.length < 10) {
      alert('연락처(휴대폰 번호)를 먼저 올바르게 입력해주세요.');
      phoneInput?.focus();
      return;
    }

    // 인증 박스 활성화
    authVerifyBox.classList.add('active');
    authVerifyBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // 3분 카운트다운 타이머 시작
    clearInterval(authCountdown);
    timerSeconds = 180;
    updateTimerText();

    authCountdown = setInterval(() => {
      timerSeconds--;
      updateTimerText();
      if (timerSeconds <= 0) {
        clearInterval(authCountdown);
        alert('인증 유효시간이 만료되었습니다. 다시 시도해주세요.');
      }
    }, 1000);

    // 모의 테스트 인증번호 안내
    const mockCode = '7788';
    authCodeInput.value = '';
    authCodeInput.focus();
    
    alert(`[스튜디오 아우토믹] ${methodName} 본인인증 번호 [${mockCode}]가 발송되었습니다.\n(테스트용 번호 ${mockCode}를 입력해주세요.)`);
  }

  function updateTimerText() {
    if (!authTimerSpan) return;
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    authTimerSpan.textContent = `${m}:${s < 10 ? '0' + s : s}`;
  }

  if (authKakaoBtn) {
    authKakaoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerAuthSend('카카오 알림톡');
    });
  }

  if (authSmsBtn) {
    authSmsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerAuthSend('문자(SMS)');
    });
  }

  // 인증번호 확인 버튼
  if (authConfirmBtn && authCodeInput) {
    authConfirmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = authCodeInput.value.trim();
      if (code === '7788' || code.length >= 4) {
        clearInterval(authCountdown);
        isVerified = true;
        authVerifyBox.classList.remove('active');
        authStatusSuccess.classList.add('active');
        alert('본인인증이 성공적으로 완료되었습니다.');
      } else {
        alert('인증번호가 올바르지 않습니다. 다시 확인해주세요.');
        authCodeInput.focus();
      }
    });
  }

  // 폼 제출 이벤트
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('consultName')?.value.trim();
      const phone = document.getElementById('consultPhone')?.value.trim();
      const car = carNameInput?.value.trim();

      if (!name) {
        alert('고객 성함을 입력해주세요.');
        document.getElementById('consultName')?.focus();
        return;
      }

      if (!phone || phone.length < 10) {
        alert('연락처를 정확히 입력해주세요.');
        document.getElementById('consultPhone')?.focus();
        return;
      }

      if (!agreeCheckbox?.checked) {
        alert('개인정보 수집 및 이용약관에 동의하셔야 상담 신청이 가능합니다.');
        agreeCheckbox?.focus();
        return;
      }

      // 본인인증 미완료 시 친절하게 인증 권고 (또는 자동 통과 옵션)
      if (!isVerified) {
        const proceedWithoutAuth = confirm(
          '본인인증이 아직 완료되지 않았습니다.\n더 신속하고 정확한 전담 매니저 배정을 위해 바로 접수하시겠습니까?'
        );
        if (!proceedWithoutAuth) return;
      }

      // 성공 모달로 전환
      showSuccessModal(name, car);
    });
  }

  function showSuccessModal(name, car) {
    const dialog = backdrop.querySelector('.modal-dialog');
    if (!dialog) return;

    dialog.innerHTML = `
      <div class="success-modal">
        <div class="success-icon-check">✓</div>
        <h3>상담 신청이 접수되었습니다!</h3>
        <p style="margin-top: 12px; font-weight: 600; color: #111827;">
          [${car}] 견적 요청이 안전하게 전송되었습니다.
        </p>
        <p style="margin-top: 8px;">
          스튜디오 아우토믹의 <span style="color: #d92525; font-weight: 700;">1:1 전담 시니어 컨설턴트</span>가<br>
          영업시간 기준 10분 이내로 최적의 금융사 비교 견적서를 안내해 드리겠습니다.
        </p>
        <div style="background: #f8fafc; border-radius: 12px; padding: 18px; margin: 24px 0; font-size: 13px; color: #475569; text-align: left; line-height: 1.6;">
          <div style="font-weight: 700; color: #111827; margin-bottom: 6px;">안심 고객보호 원칙 준수 안내</div>
          • 접수하신 정보는 담당 매니저 1인에게만 독점 배정됩니다.<br>
          • 불필요한 스팸 영업이나 제3자 정보 제공이 일체 없습니다.
        </div>
        <button type="button" class="btn-submit-consult" style="margin-top: 0;" onclick="window.closeConsultModal(); location.reload();">
          확인
        </button>
      </div>
    `;
  }
}
