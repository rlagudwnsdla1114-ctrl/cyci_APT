import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./CompanyDashboard.css";

function Ico({ name }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none" };
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
          <path d="M4 13h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "check":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M7 7h14M7 12h14M7 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
          <path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 21a6 6 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M17.5 7.5a3 3 0 1 0-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "lock-solid":
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 10V8a6 6 0 0 1 12 0v2h1a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V11a1 1 0 0 1 1-1h1Zm2 0h8V8a4 4 0 0 0-8 0v2Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function CompanyDashboard() {
  const nav = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  // 0: 공고/지원자/최신매칭(요약), 1: 추천 인재
  const [activeTab, setActiveTab] = useState(0);

  // ✅ 더미 제거: 초기값은 "비어있음" 상태로
  const [loading, setLoading] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [applicantCount, setApplicantCount] = useState(0);
  const [top3, setTop3] = useState([]);
  const [recommendedTalents, setRecommendedTalents] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);

    api
      .get("/api/ai/companySummary")
      .then((res) => {
        const data = res?.data?.data ?? res?.data ?? {};

        const pc = data.postCount ?? data.jobPostCount ?? data.postsCount ?? data.postCnt ?? 0;
        const ac = data.applicantCount ?? data.applyCount ?? data.applicantsCount ?? data.applicantCnt ?? 0;

        const top3List = data.top3 ?? data.matchTop3 ?? data.matchingTop3 ?? data.top3Matching ?? [];
        const talents = data.recommendedTalents ?? data.talents ?? data.recommendList ?? data.aiTalentList ?? [];

        setPostCount(Number(pc) || 0);
        setApplicantCount(Number(ac) || 0);

        // top3
        if (Array.isArray(top3List)) {
          setTop3(
            top3List.slice(0, 3).map((x, idx) => ({
              jobseekerName: x?.jobseekerName ?? x?.name ?? x?.JOBSEEKER_NAME ?? `지원자${idx + 1}`,
              matchScore: x?.matchScore ?? x?.score ?? x?.MATCH_SCORE ?? 0,
            }))
          );
        } else {
          setTop3([]);
        }

        // recommendedTalents
        if (Array.isArray(talents)) {
          setRecommendedTalents(
            talents.slice(0, 3).map((x, idx) => ({
              id: x?.jobseekerIdx ?? x?.id ?? idx + 1,
              name: x?.jobseekerName ?? x?.name ?? x?.JOBSEEKER_NAME ?? "지원자",
              job: x?.hopeJob ?? x?.job ?? x?.position ?? "직무",
              score: x?.matchScore ?? x?.score ?? 0,
              tags: Array.isArray(x?.tags)
                ? x.tags
                : typeof x?.tags === "string"
                ? x.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [],
            }))
          );
        } else {
          setRecommendedTalents([]);
        }
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const handleLogout = () => {
    api.post("/api/auth/logout").finally(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      nav("/select");
    });
  };

  const goHome = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      nav("/select");
      return;
    }

    if (userRole === "company") nav("/company-dashboard");
    else if (userRole === "jobseeker") nav("/jobseeker");
    else nav("/select");
  };

  const goLogin = () => nav("/login");
  const goSignup = () => nav("/signup");

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
                <div className="jsd-brandSub">기업 메인</div>
              </div>
            </div>

            <nav className="jsd-nav" aria-label="메인 메뉴">
              <button className="jsd-navBtn" type="button" onClick={() => nav("/ai-talent")}>
                AI 추천 인재
              </button>
            </nav>

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
                <button className="jsd-pillBtn" type="button" onClick={handleLogout}>
                  로그아웃
                </button>
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
                채용 공고와 조건을 입력하면 AI가 적합한 지원자를 추천해요.<br />
                메인에서 핵심 기능을 바로 실행하세요.
              </p>

              <div className="cd-cta">
                <button
                  className={`cd-ctaBtn ${activeTab === 0 ? "primary" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(0)}
                >
                  공고/지원자
                </button>
                <button
                  className={`cd-ctaBtn ${activeTab === 1 ? "primary" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(1)}
                >
                  추천 인재
                </button>
              </div>

              {loading && <div style={{ marginTop: 12 }}>불러오는 중...</div>}

              <div className="cd-stats">
                {activeTab === 0 && (
                  <>
                    <div className="cd-stat">
                      <div className="cd-statContent">
                        <div className="cd-cardTitle">
                          <span className="cd-cardIcon">📢</span> 공고 현황
                        </div>
                        <div className="cd-statBig">{postCount}건</div>
                        <div className="cd-cardSubtext">활성화된 공고 | {postCount}건</div>
                        <button className="cd-backBtn" onClick={() => nav("/postlist")}>
                          공고 관리하기
                        </button>
                      </div>
                    </div>

                    <div className="cd-stat">
                      <div className="cd-statContent">
                        <div className="cd-cardTitle">
                          <span className="cd-cardIcon">👥</span> 지원자 현황
                        </div>
                        <div className="cd-statBig">{applicantCount}명</div>
                        <div className="cd-cardSubtext">지원자 | {applicantCount}건</div>
                        <button className="cd-backBtn" onClick={() => nav("/management")}>
                          지원자 보기
                        </button>
                      </div>
                    </div>

                    <div className="cd-stat">
                      <div className="cd-statContent">
                        <div className="cd-cardTitle">
                          <span className="cd-cardIcon">🏆</span> 최신 매칭
                        </div>

                        {top3.length === 0 ? (
                          <div style={{ marginTop: 8, opacity: 0.7 }}>데이터 없음</div>
                        ) : (
                          <ul className="cd-backCandidateList">
                            {top3.map((x, i) => (
                              <li key={i}>
                                <strong>
                                  {i + 1}. {x?.jobseekerName ?? "지원자"}
                                </strong>{" "}
                                <span className="cd-backCandidateScore">{x?.matchScore ?? 0}%</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 1 && (
                  <>
                    {recommendedTalents.length === 0 ? (
                      <div style={{ marginTop: 8, opacity: 0.7 }}>추천 인재 데이터 없음</div>
                    ) : (
                      recommendedTalents.map((talent, index) => {
                        const rankLabel =
                          index === 0 ? "AI 최상 매칭" :
                          index === 1 ? "AI 상위 매칭" :
                          "AI 우수 매칭"

                        return (
                          <div key={talent.id} className="cd-stat">
                            <div className="cd-statContent">
                              <div className="cd-cardTitle">
                                <span className="cd-cardIcon">✨</span> {rankLabel}
                              </div>

                              <div className="cd-statBig" style={{ color: "#2f6fff" }}>
                                {talent.score}점
                              </div>

                              <div className="cd-cardSubtext">
                                {talent.name}님 {talent.tags?.length ? `| ${talent.tags.join(", ")}` : ""}
                              </div>

                              <button
                                className="cd-backBtn"
                                onClick={() => nav(`/talent-detail/${talent.id}`)}
                              >
                                상세 프로필 보기
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="cd-heroRight">
              <aside className="cd-idBadge" aria-label="내 프로필(사원증)">
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
                      <div className="cd-idStatValue">{postCount}</div>
                    </div>
                    <div className="cd-idStat">
                      <div className="cd-idStatLabel">지원자</div>
                      <div className="cd-idStatValue">{applicantCount}</div>
                    </div>
                  </div>

                  <div className="cd-idBrand" aria-hidden="true">
                    JOB MATCH · COMPANY ID
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <div className="cd-sectionTitle">내 프로필 관리</div>
          <section className="cd-grid" aria-label="기업 기능 카드">
            <button className="cd-card" type="button" onClick={() => nav("/helpwanted/create")}>
              <div className="cd-cardTop">
                <div className="cd-cardIco" aria-hidden="true">
                  <Ico name="briefcase" />
                </div>
              </div>
              <h3>채용 공고 입력/수정</h3>
              <p>채용 조건을 입력하세요</p>
            </button>

            <button className="cd-card" type="button" onClick={() => nav("/cedit")}>
              <div className="cd-cardTop">
                <div className="cd-cardIco" aria-hidden="true">
                  <Ico name="lock-solid" />
                </div>
              </div>
              <h3>회원 정보 수정</h3>
              <p>보안을 위해 회원자님의 정보를 보호하세요!</p>
            </button>

            <button className="cd-card" type="button" onClick={() => nav("/management")}>
              <div className="cd-cardTop">
                <div className="cd-cardIco" aria-hidden="true">
                  <Ico name="users" />
                </div>
              </div>
              <h3>AI 매칭 결과</h3>
              <p>AI의 매칭 결과를 확인해보세요!</p>
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
            <div className="cd-copy">&copy; 2025 JobMatch Corp. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </BackgroundShell>
  );
}
