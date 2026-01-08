import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./CompanyDashboard.css";

function Ico({ name }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none" }; // 아이콘 크기도 약간 키움
  switch (name) {
    case "briefcase":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M9 7V6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 9h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4 13h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "check":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M7 7h14M7 12h14M7 17h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M3 7l1 1 2-3M3 12l1 1 2-3M3 17l1 1 2-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 2l1.2 4.2L17 7.5l-3.8 1.3L12 13l-1.2-4.2L7 7.5l3.8-1.3L12 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M19 12l.8 2.7L22 15.5l-2.2.8L19 19l-.8-2.7L16 15.5l2.2-.8L19 12z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "users":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M16 11a4 4 0 1 0-8 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 21a6 6 0 0 1 16 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17.5 7.5a3 3 0 1 0-3-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function CompanyDashboard() {
  const nav = useNavigate();
  const [gateOpen, setGateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: 인재매칭, 1: 공고관리
  const [flipped, setFlipped] = useState([false, false, false]);

  const toggleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };


  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    goHome();
  };

  const goHome = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole");

    if(isLoggedIn) {
      if(userRole === "COMPANY") {
        nav("/company-dashboard");
      }
      else if(userRole === "SEEKER") {
        nav("/jobseeker");
      }
    }
    else {
      nav("/select");
    }
  }
  const goLogin = () => nav("/login");
  const goSignup = () => nav("/signup");
  
  // ✅ 로그인 여부 확인
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <BackgroundShell>
      {/* 디자인 유지를 위해 구직자와 동일한 jsd 클래스 사용 */}
      <div className="jsd"> 
        <header className="jsd-header">
          <div className="jsd-headerInner">
            <div
              className="jsd-brand"
              role="button"
              tabIndex={0}
              onClick={goHome}
              onKeyDown={(e) => e.key === "Enter" && goHome()}
            >
              <div className="jsd-mark" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".9" />
                  <path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".9" />
                </svg>
              </div>
              <div className="jsd-brandText">
                <div className="jsd-brandName" >잡매치</div>
                <div className="jsd-brandSub">기업 메인</div>
              </div>
            </div>

            <nav className="jsd-nav" aria-label="메인 메뉴">
              <button className="jsd-navBtn" type="button" onClick={() => window.alert("인재 찾기(준비중)")}>인재 찾기</button>
              <button className="jsd-navBtn" type="button" onClick={() => window.alert("공고 관리(준비중)")}>공고 관리</button>
            </nav>

            {/* ✅ 버튼 영역: CSS 구조를 100% 유지하며 조건부 렌더링 적용 */}
            <div className="jsd-actions">
              {!isLoggedIn ? (
                <>
                  <button className="jsd-pillBtn" type="button" onClick={goLogin}>
                    로그인
                  </button>
                  <button className="jsd-pillBtn" type="button" onClick={goSignup}>
                    회원가입
                  </button>
                </>
              ) : (
                <>
                  <button className="jsd-pillBtn" type="button" onClick={handleLogout}>
                    로그아웃
                  </button>
                  {/* 기업페이지이므로 마이페이지 대신 '기업 관리'로 표시 가능 */}
                  <button className="jsd-pillBtn primary" type="button" onClick={() => setGateOpen(true)}>
                    기업 관리
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="cd-main">
          <section className="cd-hero" aria-label="기업회원 메인 히어로">
            <div className="cd-heroLeft">
              <div className="cd-kicker">
                <span className="cd-kickerDot" aria-hidden="true" /> COMPANY
              </div>
              <h1 className="cd-title">딱 맞는 인재를 빠르게</h1>
              <p className="cd-desc">
                채용 공고와 조건을 입력하면 AI가 적합한 지원자를 추천해요.<br/>
                메인에서 핵심 기능을 바로 실행하세요.
              </p>

              <div className="cd-cta">
                <button className="cd-ctaBtn primary" type="button" onClick={() => nav('/helpwanted')}>
                  공고 작성
                </button>
                <button className="cd-ctaBtn" type="button" onClick={() => window.alert("AI 추천 인재(준비중)")}>
                  추천 인재 보기
                </button>
              </div>

              <div className="cd-stats" aria-label="요약 지표">
                {/* 공고 현황 */}
                <div 
                  className={`cd-stat cd-flipCard ${flipped[0] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(0)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(0)}
                >
                  <div className="cd-flipCardInner">
                    {/* 앞면 */}
                    <div className="cd-flipCardFront">
                      <div className="cd-statContent">
                        <div style={{ width: '100%' }}>
                          <div className="cd-cardTitle">
                            <span className="cd-cardIcon">📢</span>
                            공고 현황
                          </div>
                          <div className="cd-statBig">3건</div>
                          <div className="cd-cardSubtext">활성화된 공고 | 14명 지원중</div>
                        </div>
                      </div>
                    </div>
                    {/* 뒷면 */}
                    <div className="cd-flipCardBack">
                      <div className="cd-statContent">
                        <div className="cd-backContent">
                          <div className="cd-backTitle">공고 분석</div>
                          <ul className="cd-backList">
                            <li>○ 프론트엔드: 5명 지원</li>
                            <li>○ 백엔드: 7명 지원</li>
                            <li>○ 데이터분석가: 2명 지원</li>
                          </ul>
                          <button className="cd-backBtn" onClick={() => nav('/helpwanted')} type="button">
                            공고 관리하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 지원자 현황 */}
                <div 
                  className={`cd-stat cd-flipCard ${flipped[1] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(1)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(1)}
                >
                  <div className="cd-flipCardInner">
                    {/* 앞면 */}
                    <div className="cd-flipCardFront">
                      <div className="cd-statContent">
                        <div style={{ width: '100%' }}>
                          <div className="cd-cardTitle">
                            <span className="cd-cardIcon">👥</span>
                            지원자 현황
                          </div>
                          <div className="cd-statBig">14명</div>
                          <div className="cd-cardSubtext">신규 3 · 검토중 7 · 최종 4</div>
                        </div>
                      </div>
                    </div>
                    {/* 뒷면 */}
                    <div className="cd-flipCardBack">
                      <div className="cd-statContent">
                        <div className="cd-backContent">
                          <div className="cd-backTitle">지원자 분석</div>
                          <div className="cd-backStats">
                            <div className="cd-backStat">
                              <span className="cd-backStatLabel">신규</span>
                              <span className="cd-backStatValue">3명</span>
                            </div>
                            <div className="cd-backStat">
                              <span className="cd-backStatLabel">검토중</span>
                              <span className="cd-backStatValue">7명</span>
                            </div>
                            <div className="cd-backStat">
                              <span className="cd-backStatLabel">최종</span>
                              <span className="cd-backStatValue">4명</span>
                            </div>
                          </div>
                          <p className="cd-backAdvice">신규 지원자를 확인하세요!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 적합도 높은 지원자 TOP 3 */}
                <div 
                  className={`cd-stat cd-flipCard ${flipped[2] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(2)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(2)}
                >
                  <div className="cd-flipCardInner">
                    {/* 앞면 */}
                    <div className="cd-flipCardFront">
                      <div className="cd-statContent">
                        <div style={{ width: '100%' }}>
                          <div className="cd-cardTitle">
                            <span className="cd-cardIcon">🎯</span>
                            적합도 높은 지원자
                          </div>
                          <div className="cd-topCandidatesList">
                            <div className="cd-candidateItem">
                              <div className="cd-candidateRank">1</div>
                              <div className="cd-candidateInfo">
                                <div className="cd-candidateName">김준호</div>
                                <div className="cd-candidateScore">88%</div>
                              </div>
                            </div>
                            <div className="cd-candidateItem">
                              <div className="cd-candidateRank">2</div>
                              <div className="cd-candidateInfo">
                                <div className="cd-candidateName">이서진</div>
                                <div className="cd-candidateScore">85%</div>
                              </div>
                            </div>
                            <div className="cd-candidateItem">
                              <div className="cd-candidateRank">3</div>
                              <div className="cd-candidateInfo">
                                <div className="cd-candidateName">박지현</div>
                                <div className="cd-candidateScore">82%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 뒷면 */}
                    <div className="cd-flipCardBack">
                      <div className="cd-statContent">
                        <div className="cd-backContent">
                          <div className="cd-backTitle">TOP 3 상세</div>
                          <ul className="cd-backCandidateList">
                            <li>
                              <strong>1. 김준호</strong><br/>
                              <span className="cd-backCandidateScore">88% · 경력 5년</span>
                            </li>
                            <li>
                              <strong>2. 이서진</strong><br/>
                              <span className="cd-backCandidateScore">85% · 경력 3년</span>
                            </li>
                            <li>
                              <strong>3. 박지현</strong><br/>
                              <span className="cd-backCandidateScore">82% · 경력 2년</span>
                            </li>
                          </ul>
                          <button className="cd-backBtn" onClick={() => window.alert("지원자 상세보기 (준비중)")} type="button">
                            지원자 보기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cd-heroRight">
              <aside className="cd-idBadge" aria-label="내 프로필(사원증)">
                {/* Lanyard wrapper to center it */}
                <div className="cd-lanyardWrap">
                  <div className="cd-idLanyard" aria-hidden="true">
                    <span className="cd-idStrap left" />
                    <span className="cd-idStrap right" />
                    <span className="cd-idClip" />
                  </div>
                </div>

                <div className="cd-idCard">
                  <div className="cd-idTop">
                    <div className="cd-idAvatar" aria-hidden="true">
                      CM
                    </div>
                    <div className="cd-idName">회사명 샘플</div>
                    <div className="cd-idSub">채용 담당자 · 서울</div>
                  </div>

                  <div className="cd-idStats">
                    <div className="cd-idStat">
                      <div className="cd-idStatLabel">공고 수</div>
                      <div className="cd-idStatValue">3</div>
                    </div>
                    <div className="cd-idStat">
                      <div className="cd-idStatLabel">지원자</div>
                      <div className="cd-idStatValue">14</div>
                    </div>
                  </div>

                  <div className="cd-idSection">
                    <div className="cd-idSectionTitle">최근 공고</div>
                    <ul className="cd-idList">
                      <li>프론트엔드 개발자 · 12/18</li>
                      <li>백엔드 개발자 · 12/10</li>
                    </ul>
                  </div>

                  <div className="cd-idBrand" aria-hidden="true">
                    JOB MATCH · COMPANY ID
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <div className="cd-sectionTitle">핵심 기능</div>
          <section className="cd-grid" aria-label="기업 기능 카드">
            <button className="cd-card" type="button" onClick={() => nav('/helpwanted')}> 
              <div className="cd-cardTop">
                <div className="cd-cardIco" aria-hidden="true">
                  <Ico name="briefcase" />
                </div>
              </div>
              <h3>채용 공고 입력/수정</h3>
              <p>채용 조건을 입력하세요</p>
              <div className="cd-meta">마지막 수정: 12/16</div>
            </button>

            <button className="cd-card" type="button" onClick={() => window.alert("필수/우대 조건 관리 (준비중)")}>
              <div className="cd-cardTop">
                <div className="cd-cardIco" aria-hidden="true">
                  <Ico name="check" />
                </div>
              </div>
              <h3>필수/우대 조건 관리</h3>
              <p>상세 조건을 설정하세요</p>
              <div className="cd-meta">마지막 수정: 12/17</div>
            </button>

            <button className="cd-card" type="button" onClick={() => window.alert("AI 추천 인재 (준비중)")}>
              <div className="cd-cardTop">
                <div className="cd-cardIco" aria-hidden="true">
                  <Ico name="spark" />
                </div>
              </div>
              <h3>AI 추천 인재</h3>
              <p>조건에 맞는 인재를 확인하세요</p>
              <div className="cd-meta">Top 1 매칭률 82%</div>
            </button>

            <button className="cd-card" type="button" onClick={() => window.alert("지원자 관리 (준비중)")}>
              <div className="cd-cardTop">
                <div className="cd-cardIco" aria-hidden="true">
                  <Ico name="users" />
                </div>
              </div>
              <h3>지원자 관리</h3>
              <p>지원자 현황을 확인하세요</p>
              <div className="cd-meta">3명</div>
            </button>
          </section>
        </main>

        <footer className="cd-footer">
          <div className="cd-footerInner">
            <div className="cd-footerInfo">
              <span>(주)잡매치</span>
              <span className="cd-sep">|</span>
              <span>대표: 김대표</span>
              <span className="cd-sep">|</span>
              <span>사업자등록번호: 123-45-67890</span>
            </div>
            <div className="cd-footerContact">
              <span>Tel: 02-1234-5678</span>
              <span className="cd-sep">|</span>
              <span>Email: help@jobmatch.com</span>
              <span className="cd-sep">|</span>
              <span>서울특별시 강남구 테헤란로 123 잡매치빌딩</span>
            </div>
            <div className="cd-copy">
              &copy; 2025 JobMatch Corp. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </BackgroundShell>
  );
}