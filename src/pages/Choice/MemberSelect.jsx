import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./MemberSelect.css";

export default function MemberSelect() {
  const nav = useNavigate();

  // ✅ 기업회원: 회사 대시보드로 이동
  const goCompany = () => nav("/company-dashboard");

  // 기존 유지
  const goJobSeeker = () => nav("/jobseeker");
  const goLogin = () => nav("/login");

  return (
    <BackgroundShell>
      <div className="ms-page">
        <div className="ms-wrap">
          <div className="ms-topbar">
            <div className="ms-topbarPill">
              <span className="ms-topbarText">이미 계정이 있나요?</span>
              <button className="ms-loginBtn" type="button" onClick={goLogin}>
                로그인 <span className="ms-loginArrow">→</span>
              </button>
            </div>
          </div>

          <header className="ms-header">
            <div className="ms-kicker">WELCOME</div>
            <h1>회원 유형을 선택하세요</h1>
            <p>원하는 회원 유형을 선택하면 다음 단계로 이동합니다.</p>
          </header>

          <section className="ms-grid">
            {/* 기업회원 */}
            <article
              className="ms-card company"
              role="button"
              tabIndex={0}
              onClick={goCompany}
              onKeyDown={(e) => e.key === "Enter" && goCompany()}
              aria-label="기업회원 선택"
            >
              <div className="ms-top">
                <div className="ms-badge">
                  <span className="ms-dot" />
                  기업회원
                </div>
                <span className="ms-chip">Employer</span>
              </div>

              <div className="ms-title">기업회원으로 시작</div>
              <p className="ms-desc">
                채용 공고를 올리고, 지원자 적합도를 빠르게 비교하세요.
              </p>

              <div className="ms-actions">
                <button
                  className="ms-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goCompany();
                  }}
                >
                  선택하기 <span className="ms-arrow">→</span>
                </button>
              </div>

              <div className="ms-hoverBox">회원님이 원하는 인재를 뽑아보세요</div>
            </article>

            {/* 취업희망자회원 */}
            <article
              className="ms-card jobseeker"
              role="button"
              tabIndex={0}
              onClick={goJobSeeker}
              onKeyDown={(e) => e.key === "Enter" && goJobSeeker()}
              aria-label="취업희망자회원 선택"
            >
              <div className="ms-top">
                <div className="ms-badge">
                  <span className="ms-dot" />
                  취업희망자회원
                </div>
                <span className="ms-chip">Candidate</span>
              </div>

              <div className="ms-title">취업희망자로 시작</div>
              <p className="ms-desc">
                프로필 기반으로 기업 적합도를 확인하고 모의면접까지 준비하세요.
              </p>

              <div className="ms-actions">
                <button
                  className="ms-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goJobSeeker();
                  }}
                >
                  선택하기 <span className="ms-arrow">→</span>
                </button>
              </div>

              <div className="ms-hoverBox">
                AI가 회원님과 적합도가 높은 기업을 추천해드립니다
              </div>
            </article>
          </section>
        </div>
      </div>
    </BackgroundShell>
  );
}
