import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./JobSeekerDashboard.css";

function Ico({ name }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none" };
  switch (name) {
    case "doc":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8 12h8M8 16h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "filters":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M4 6h16M7 12h10M10 18h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
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
    case "mic":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M19 11a7 7 0 0 1-14 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 18v3"
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

export default function JobSeekerDashboard() {
  const nav = useNavigate();
  const [gateOpen, setGateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: AI매칭, 1: 추천기업, 2: 나의프로필
  const [flipped, setFlipped] = useState([false, false, false]);

  const toggleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const goHome = () => nav("/select");
  const goLogin = () => nav("/login");
  const goSignup = () => nav("/signup");
  const goResume = () => nav("/resume-create");

  return (
    <BackgroundShell>
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
                  <path
                    d="M4 10V6a2 2 0 0 1 2-2h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity=".9"
                  />
                  <path
                    d="M20 14v4a2 2 0 0 1-2 2h-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity=".9"
                  />
                </svg>
              </div>
              <div className="jsd-brandText">
                <div className="jsd-brandName">잡매치</div>
                <div className="jsd-brandSub">구직자 메인</div>
              </div>
            </div>

            <nav className="jsd-nav" aria-label="메인 메뉴">
              <button className="jsd-navBtn" type="button" onClick={() => window.alert("채용정보(준비중)")}>
                채용정보
              </button>
              <button className="jsd-navBtn" type="button" onClick={() => window.alert("AI 매칭(준비중)")}>
                AI 매칭
              </button>
              <button className="jsd-navBtn" type="button" onClick={() => window.alert("커뮤니티(준비중)")}>
                커뮤니티
              </button>
              <button className="jsd-navBtn" type="button" onClick={() => window.alert("고객센터(준비중)")}>
                고객센터
              </button>
            </nav>

            <div className="jsd-actions">
              <button className="jsd-pillBtn" type="button" onClick={goLogin}>
                로그인
              </button>
              <button className="jsd-pillBtn" type="button" onClick={goSignup}>
                회원가입
              </button>
              <button className="jsd-pillBtn primary" type="button" onClick={() => setGateOpen(true)}>
                마이페이지
              </button>
            </div>
          </div>
        </header>

        <main className="jsd-main">
          <section className="jsd-hero" aria-label="구직자 메인 히어로">
            <div className="jsd-heroLeft">
              <div className="jsd-kicker">
                <span className="jsd-kickerDot" aria-hidden="true" /> JOB SEEKER
              </div>
              <h1 className="jsd-title">나만을 위한 채용 매칭</h1>
              <p className="jsd-desc">
                자소서와 희망 조건을 기반으로 AI가 기업을 추천해요.<br/>
                메인에서 핵심 기능을 빠르게 실행하세요.
              </p>

              <div className="jsd-cta">
                <button 
                  className={`jsd-tabBtn ${activeTab === 0 ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab(0)}
                >
                  AI 매칭 보기
                </button>
                <button 
                  className={`jsd-tabBtn ${activeTab === 1 ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab(1)}
                >
                  추천 기업
                </button>
                <button 
                  className={`jsd-tabBtn ${activeTab === 2 ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab(2)}
                >
                  나의 프로필
                </button>
              </div>

              <div className="jsd-stats" aria-label="요약 지표">
                {/* 탭 0: AI 매칭 보기 */}
                {activeTab === 0 && (
                  <>
                {/* 프로필 완성도 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[0] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(0)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(0)}
                >
                  <div className="jsd-flipCardInner">
                    {/* 앞면 */}
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-profileCard">
                          <div className="jsd-cardTitle">
                            <span className="jsd-cardIcon">👤</span>
                            프로필 완성도
                          </div>
                          <div className="jsd-progressContainer">
                            <div className="jsd-progressBar">
                              <div className="jsd-progressFill" style={{width: '75%'}}></div>
                            </div>
                            <div className="jsd-progressText">75%</div>
                          </div>
                          <div className="jsd-cardSubtext">자소서, 이력서, 희망조건을 완성하세요</div>
                        </div>
                      </div>
                    </div>
                    {/* 뒷면 */}
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">프로필 완성하기</div>
                          <ul className="jsd-backList">
                            <li>✓ 자소서 작성 완료</li>
                            <li>○ 이력서 업로드</li>
                            <li>○ 희망조건 설정</li>
                          </ul>
                          <button className="jsd-backBtn" onClick={goResume} type="button">
                            지금 완성하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 최근 지원 현황 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[1] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(1)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(1)}
                >
                  <div className="jsd-flipCardInner">
                    {/* 앞면 */}
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-applicationCard">
                          <div className="jsd-cardTitle">
                            <span className="jsd-cardIcon">📋</span>
                            최근 지원 현황
                          </div>
                          <div className="jsd-appStatusList">
                            <div className="jsd-appStatusRow">
                              <span className="jsd-statusLabel">이번 달 지원:</span>
                              <span className="jsd-statusValue">8건</span>
                            </div>
                            <div className="jsd-appStatusRow">
                              <span className="jsd-statusLabel">면접 대기중:</span>
                              <span className="jsd-statusValue accent">3건</span>
                            </div>
                            <div className="jsd-appStatusRow">
                              <span className="jsd-statusLabel">합격:</span>
                              <span className="jsd-statusValue success">1건</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 뒷면 */}
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">지원 현황 분석</div>
                          <div className="jsd-backStats">
                            <div className="jsd-backStat">
                              <span className="jsd-backStatLabel">평균 응답률</span>
                              <span className="jsd-backStatValue">37.5%</span>
                            </div>
                            <div className="jsd-backStat">
                              <span className="jsd-backStatLabel">면접 진행율</span>
                              <span className="jsd-backStatValue">37.5%</span>
                            </div>
                          </div>
                          <p className="jsd-backAdvice">꾸준한 지원으로 성공률을 높이세요!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 나의 강점 - 🚀 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[2] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(2)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(2)}
                >
                  <div className="jsd-flipCardInner">
                    {/* 앞면 */}
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-strengthCard">
                          <div className="jsd-strengthIcon">🚀</div>
                          <div className="jsd-strengthTitle">나의 강점</div>
                          <ul className="jsd-strengthList">
                            <li>빠른 학습 능력</li>
                            <li>문제 해결 능력</li>
                            <li>팀 협업 역량</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* 뒷면 */}
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">강점 상세 분석</div>
                          <ul className="jsd-backList">
                            <li>React 숙련도: 9/10</li>
                            <li>커뮤니케이션: 8.5/10</li>
                            <li>자기주도성: 9/10</li>
                          </ul>
                          <button className="jsd-backBtn" onClick={() => window.alert("강점 개발하기(준비중)")} type="button">
                            강점 개발하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </>
                )}

                {/* 탭 1: 추천 기업 */}
                {activeTab === 1 && (
                  <>
                {/* 추천 기업 1 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[0] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(0)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(0)}
                >
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-companyCard">
                          <div className="jsd-companyLogo">🏢</div>
                          <div className="jsd-companyName">테크 스타트업 A</div>
                          <div className="jsd-companyRole">프론트엔드 개발자</div>
                          <div className="jsd-companyMatch">적합도 92%</div>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">적합 이유</div>
                          <ul className="jsd-backList">
                            <li>✓ React 경험 - 필수조건</li>
                            <li>✓ 영어 상급 - 우대조건</li>
                            <li>✓ GIT 숙련도 - 직무역량</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 추천 기업 2 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[1] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(1)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(1)}
                >
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-companyCard">
                          <div className="jsd-companyLogo">🏢</div>
                          <div className="jsd-companyName">핀테크 회사 B</div>
                          <div className="jsd-companyRole">웹 개발자</div>
                          <div className="jsd-companyMatch">적합도 88%</div>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">적합 이유</div>
                          <ul className="jsd-backList">
                            <li>✓ Node.js 경험 - 필수조건</li>
                            <li>✓ 일본어 기초 - 우대조건</li>
                            <li>✓ API 설계 - 직무역량</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 추천 기업 3 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[2] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(2)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(2)}
                >
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-companyCard">
                          <div className="jsd-companyLogo">🏢</div>
                          <div className="jsd-companyName">클라우드 서비스 C</div>
                          <div className="jsd-companyRole">풀스택 개발자</div>
                          <div className="jsd-companyMatch">적합도 85%</div>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">적합 이유</div>
                          <ul className="jsd-backList">
                            <li>✓ Python 경험 - 필수조건</li>
                            <li>✓ AWS 자격증 - 우대조건</li>
                            <li>✓ 데이터베이스 - 직무역량</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </>
                )}

                {/* 탭 2: 나의 프로필 (강점/약점 + 면접 결과) */}
                {activeTab === 2 && (
                  <>
                {/* 나의 강점/약점 분석 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[0] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(0)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(0)}
                >
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-analysisCard">
                          <div className="jsd-analysisIcon">🔍</div>
                          <div className="jsd-analysisTitle">AI 프로필 분석</div>
                          <ul className="jsd-analysisList">
                            <li className="strength">✓ 강점: 기술 역량</li>
                            <li className="weakness">✗ 약점: 커뮤니케이션</li>
                            <li className="opportunity">→ 개선점: 발표 능력</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">상세 분석</div>
                          <ul className="jsd-backList">
                            <li><strong>강점</strong><br/>기술 스택 다양성, 빠른 문제해결</li>
                            <li><strong>약점</strong><br/>팀 협업 표현, 영어 발표</li>
                            <li><strong>개선</strong><br/>스피킹 연습, 프레젠테이션</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 모의 면접 결과 1 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[1] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(1)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(1)}
                >
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-interviewCard">
                          <div className="jsd-interviewIcon">🎤</div>
                          <div className="jsd-interviewTitle">모의 면접 결과</div>
                          <div className="jsd-interviewScore">
                            <div className="jsd-scoreValue">82점</div>
                            <div className="jsd-scoreDate">최근: 12/22</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">피드백</div>
                          <ul className="jsd-backList">
                            <li><strong>좋은점</strong><br/>명확한 답변, 자신감</li>
                            <li><strong>개선점</strong><br/>구체적 사례, 경청 능력</li>
                            <li><strong>다음목표</strong><br/>90점 이상 달성</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 기술 스택 평가 */}
                <div 
                  className={`jsd-stat jsd-flipCard ${flipped[2] ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(2)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleFlip(2)}
                >
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-skillCard">
                          <div className="jsd-skillIcon">⭐</div>
                          <div className="jsd-skillTitle">기술 역량 평가</div>
                          <ul className="jsd-skillList">
                            <li>React: 9/10</li>
                            <li>Node.js: 8/10</li>
                            <li>English: 7/10</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">역량 분석</div>
                          <ul className="jsd-backList">
                            <li><strong>상위 20%</strong><br/>React, 문제해결력</li>
                            <li><strong>평균 수준</strong><br/>Node.js, DB설계</li>
                            <li><strong>강화 필요</strong><br/>영어, 리더십</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </div>
            </div>

            <div className="jsd-heroRight">
              <aside className="jsd-idBadge" aria-label="내 프로필(사원증)">
                {/* Lanyard wrapper to center it */}
                <div className="jsd-lanyardWrap">
                  <div className="jsd-idLanyard" aria-hidden="true">
                    <span className="jsd-idStrap left" />
                    <span className="jsd-idStrap right" />
                    <span className="jsd-idClip" />
                  </div>
                </div>

                <div className="jsd-idCard">
                  <div className="jsd-idTop">
                    <div className="jsd-idAvatar" aria-hidden="true">
                      KJ
                    </div>
                    <div className="jsd-idName">구직자 샘플</div>
                    <div className="jsd-idSub">웹 개발자 · 서울</div>
                  </div>

                  <div className="jsd-idStats">
                    <div className="jsd-idStat">
                      <div className="jsd-idStatLabel">지원 수</div>
                      <div className="jsd-idStatValue">3</div>
                    </div>
                    <div className="jsd-idStat">
                      <div className="jsd-idStatLabel">면접대기</div>
                      <div className="jsd-idStatValue">14</div>
                    </div>
                  </div>

                  <div className="jsd-idSection">
                    <div className="jsd-idSectionTitle">최근 공고</div>
                    <ul className="jsd-idList">
                      <li>프론트엔드 개발자 · 12/18</li>
                      <li>백엔드 개발자 · 12/10</li>
                    </ul>
                  </div>

                  <div className="jsd-idBrand" aria-hidden="true">
                    JOB MATCH · JOB SEEKER ID
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <div className="jsd-sectionTitle">내 프로필 관리</div>
          <section className="jsd-grid" aria-label="구직자 기능 카드">
            <button className="jsd-card" type="button" onClick={goResume}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco" aria-hidden="true">
                  <Ico name="doc" />
                </div>
                <span className="jsd-tag">작성률 100%</span>
              </div>
              <h3>자소서 작성/수정</h3>
              <p>자신의 경험을 잘 드러내는 자소서를 작성하세요</p>
              <div className="jsd-meta">마지막 수정: 12/20</div>
            </button>

            <button className="jsd-card" type="button" onClick={() => window.alert("채용 조건 입력/수정(준비중)")}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco" aria-hidden="true">
                  <Ico name="filters" />
                </div>
                <span className="jsd-tag">작성률 40%</span>
              </div>
              <h3>채용 조건 입력/수정</h3>
              <p>희망 조건을 설정하세요</p>
              <div className="jsd-meta">마지막 수정: 12/15</div>
            </button>

            <button className="jsd-card" type="button" onClick={() => window.alert("AI 매칭 결과(준비중)")}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco" aria-hidden="true">
                  <Ico name="spark" />
                </div>
                <span className="jsd-tag">NEW</span>
              </div>
              <h3>AI 매칭 결과</h3>
              <p>나에게 맞는 기업을 확인하세요</p>
              <div className="jsd-meta">Top 1 매칭률 86%</div>
            </button>

            <button className="jsd-card" type="button" onClick={() => window.alert("모의 면접(준비중)")}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco" aria-hidden="true">
                  <Ico name="mic" />
                </div>
                <span className="jsd-tag">최근 점수</span>
              </div>
              <h3>모의 면접</h3>
              <p>AI와 함께 면접 연습하기</p>
              <div className="jsd-meta">평균 75점</div>
            </button>
          </section>
        </main>

        <footer className="jsd-footer">
          <div className="jsd-footerInner">
            <div className="jsd-footerInfo">
              <span>(주)잡매치</span>
              <span className="jsd-sep">|</span>
              <span>대표: 김대표</span>
              <span className="jsd-sep">|</span>
              <span>사업자등록번호: 123-45-67890</span>
            </div>
            <div className="jsd-footerContact">
              <span>Tel: 02-1234-5678</span>
              <span className="jsd-sep">|</span>
              <span>Email: help@jobmatch.com</span>
              <span className="jsd-sep">|</span>
              <span>서울특별시 강남구 테헤란로 123 잡매치빌딩</span>
            </div>
            <div className="jsd-copy">
              &copy; 2025 JobMatch Corp. All rights reserved.
            </div>
          </div>
        </footer>

        {gateOpen && (
          <div className="jsd-modalBackdrop" onClick={() => setGateOpen(false)} role="presentation">
            <div className="jsd-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className="jsd-modalTitle">안내</div>
              <div className="jsd-modalDesc">로그인 후 이용해 주세요</div>

              <div className="jsd-modalActions">
                <button className="jsd-modalBtn" onClick={() => setGateOpen(false)} type="button">
                  취소
                </button>
                <button
                  className="jsd-modalBtn primary"
                  type="button"
                  onClick={() => {
                    setGateOpen(false);
                    nav("/login");
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BackgroundShell>
  );
}

