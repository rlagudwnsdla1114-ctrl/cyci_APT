import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./JobSeekerDashboard.css";

function Ico({ name }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none" };
  switch (name) {
    case "doc":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
          <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12h8M8 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "filters":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 2l1.2 4.2L17 7.5l-3.8 1.3L12 13l-1.2-4.2L7 7.5l3.8-1.3L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M19 12l.8 2.7L22 15.5l-2.2.8L19 19l-.8-2.7L16 15.5l2.2-.8L19 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "mic":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="2" />
          <path d="M19 11a7 7 0 0 1-14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
    case "file-text-solid":
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm2 16H8v-2h8v2Zm0-4H8v-2h8v2Zm-3-5V3.5L18.5 9H13Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function JobSeekerDashboard() {
  const nav = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [gateOpen, setGateOpen] = useState(false);
  const [jobseekerName, setJobseekerName] = useState("");
  const [jobseekerBirth, setJobseekerBirth] = useState("");
  const [applyCount, setApplyCount] = useState(0);
  const [interviewWaitCount, setInterviewWaitCount] = useState(0);

const getAvatarText = (name) => {
const s = (name ?? "").trim();
if (!s) return "JS";
if (/[가-힣]/.test(s)) return s[0];


const parts = s.split(/\s+/).filter(Boolean);
if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
return s.slice(0, 2).toUpperCase();
};


// 생년월일 → 연령대(개인정보 최소화)
const getAgeGroup = (birthStr) => {
const s = (birthStr ?? "").toString().trim();
const yearMatch = s.match(/(\d{4})/);
if (!yearMatch) return "";


const year = Number(yearMatch[1]);
if (!year || year < 1900 || year > 2100) return "";


const nowYear = new Date().getFullYear();
const age = nowYear - year + 1; // 한국식 대략
const group = Math.floor(age / 10) * 10;
return group > 0 ? `${group}대` : "";
};

  const isLoggedIn = !!localStorage.getItem("token");

  const [topCompanies, setTopCompanies] = useState([]);
  const [topLoading, setTopLoading] = useState(false);

  const handleLogout = async () => {
    await api.post("/api/auth/logout").finally(() => {
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
  const goResume = () => nav("/resume-create");

  useEffect(() => {
    if (activeTab !== 1) return;

    if (!isLoggedIn) {
      setGateOpen(true);
      return;
    }

    setTopLoading(true);

    api
      .get("/api/ai/selectJobMatchTop")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        const cleaned = (list || []).filter(Boolean);
        setTopCompanies(cleaned.slice(0, 3));
      })
      .finally(() => {
        setTopLoading(false);
      });
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
if (!isLoggedIn) return;


const token = localStorage.getItem("token");


api
.get("/api/jobseeker/userinfo", {
headers: token ? { Authorization: `Bearer ${token}` } : {},
})
.then((res) => {
const data = res?.data?.data ?? res?.data ?? {};
setJobseekerName(data.jobseekerName ?? "");
setJobseekerBirth(data.jobseekerBirth ?? "");
})
.catch(() => {
// 실패해도 화면은 샘플 그대로 보이게 두면 됨
});
}, [isLoggedIn]);

  return (
    <BackgroundShell type="jobseeker">
      <div className="jsd">
        <header className="jsd-header">
          <div className="jsd-headerInner">
            <div className="jsd-brand" role="button" tabIndex={0} onClick={goHome}>
              <div className="jsd-mark" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".9" />
                  <path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".9" />
                </svg>
              </div>
              <div className="jsd-brandText">
                <div className="jsd-brandName">잡매치 · 구직자 메인페이지 </div>
                
              </div>
            </div>

            <nav className="jsd-nav" aria-label="메인 메뉴" style={{ marginLeft: -180 }}>
              <button className="jsd-navBtn" type="button" onClick={() => nav("/helpwanted")}>
                채용정보
              </button>
              <button className="jsd-navBtn" type="button" onClick={() => nav("/ai-match")}>
                AI 매칭
              </button>
              <button className="jsd-navBtn" type="button" onClick={() => nav("/mock")}>
                AI 모의 면접
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
                <>
                  <button className="jsd-pillBtn" type="button" onClick={handleLogout}>
                    로그아웃
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="jsd-main">
          <section className="jsd-hero">
            <div className="jsd-heroLeft">
              <div className="jsd-kicker">
                <span className="jsd-kickerDot" aria-hidden="true" /> JOB SEEKER
              </div>
              <h1 className="jsd-title">나만을 위한 채용 매칭</h1>
              <p className="jsd-desc">
                자소서와 희망 조건을 기반으로 AI가 기업을 추천해요.<br />
                메인에서 핵심 기능을 빠르게 실행하세요.
              </p>

              <div className="jsd-cta">
                <button className={`jsd-tabBtn ${activeTab === 0 ? "active" : ""}`} type="button" onClick={() => setActiveTab(0)}>
                  AI 매칭 보기
                </button>
                <button className={`jsd-tabBtn ${activeTab === 1 ? "active" : ""}`} type="button" onClick={() => setActiveTab(1)}>
                  추천 기업
                </button>
              </div>

              <div className="jsd-stats">
                {activeTab === 0 && (
                  <>
                    <div className="jsd-stat fixed-content">
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
                    <div className="jsd-stat fixed-content">
                      <div className="jsd-backContent">
                        <div className="jsd-backTitle">강점 상세 분석</div>
                        <ul className="jsd-backList">
                          <li>React 숙련도: 9/10</li>
                          <li>커뮤니케이션: 8.5/10</li>
                          <li>자기주도성: 9/10</li>
                        </ul>
                      </div>
                    </div>
                    <div className="jsd-stat fixed-content">
                      <div className="jsd-backContent">
                        <div className="jsd-backTitle">역량 분석 결과</div>
                        <ul className="jsd-backList">
                          <li>
                            <strong>상위 20%</strong>
                            <br />
                            React, 문제해결력
                          </li>
                          <li>
                            <strong>평균 수준</strong>
                            <br />
                            Node.js, DB설계
                          </li>
                          <li>
                            <strong>강화 필요</strong>
                            <br />
                            영어, 리더십
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
                {/* 기업 추천 TOP3 */}
                {activeTab === 1 && (
                  <>
                    {topLoading && (
                      <div className="jsd-stat fixed-content">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">추천 기업 불러오는 중...</div>
                          <ul className="jsd-backList">
                            <li>잠시만 기다려 주세요</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {!topLoading && topCompanies.length === 0 && (
                      <div className="jsd-stat fixed-content">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">추천 기업이 없습니다</div>
                          <ul className="jsd-backList">
                            <li>AI 매칭을 먼저 실행하거나</li>
                            <li>자소서/희망조건을 채워주세요</li>
                          </ul>
                          <button className="jsd-backBtn" onClick={() => nav("/ai-match")} type="button">
                            AI 매칭 하러가기
                          </button>
                        </div>
                      </div>
                    )}

                    {!topLoading &&
                      topCompanies.map((c, i) => {
                        const name = c?.cName ?? "기업명 없음";
                        const score = c?.mRate ?? 0;
                        const jobPos = c?.jobPos ?? "";
                        const reasonText = c?.aiReason ?? "";
                        const reasons = reasonText
                          ? reasonText
                              .split(/\r?\n|•|·|\/|,|;/)
                              .map((x) => x.trim())
                              .filter(Boolean)
                              .slice(0, 3)
                          : [];

                        return (
                          <div key={c?.mIdx ?? i} className="jsd-stat fixed-content">
                            <div className="jsd-backContent">
                              <div className="jsd-backTitle">{name}</div>
                              <ul className="jsd-backList">
                                <li>✓ 점수: {score}</li>
                                {jobPos ? <li>✓ 포지션: {jobPos}</li> : null}
                                {reasons.length > 0 ? reasons.map((r, j) => <li key={j}>✓ {r}</li>) : <li>✓ (사유 데이터 없음)</li>}
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
            </div>

            <div className="jsd-heroRight">
              <aside className="jsd-idBadge">
                <div className="jsd-lanyardWrap">
                  <div className="jsd-idLanyard">
                    <span className="jsd-idStrap left" />
                    <span className="jsd-idStrap right" />
                    <span className="jsd-idClip" />
                  </div>
                </div>
                <div className="jsd-idCard">
                  <div className="jsd-idTop">
                    <div className="jsd-idAvatar">{getAvatarText(jobseekerName)}</div>
                    <div className="jsd-idName">{jobseekerName || "구직자 샘플"}</div>
                    <div className="jsd-idSub">
                    {getAgeGroup(jobseekerBirth) ? `${getAgeGroup(jobseekerBirth)} · 구직자` : "구직자 · 정보 미설정"}
                    </div>
                  </div>
                  <div className="jsd-idStats">
                    <div className="jsd-idStat">
                      <div className="jsd-idStatLabel">지원 수</div>
                      <div className="jsd-idStatValue">{applyCount}</div>
                    </div>
                    <div className="jsd-idStat">
                      <div className="jsd-idStatLabel">면접대기</div>
                      <div className="jsd-idStatValue">{interviewWaitCount}</div>
                    </div>
                  </div>
                    <br/>
                  <br/>
                  <br/>
                
                  <div className="jsd-idBrand">JOB MATCH · JOB SEEKER ID</div>
                  
                
                </div>
              </aside>
            </div>
          </section>

          <div className="jsd-sectionTitle">내 프로필 관리</div>
          <section className="jsd-grid">
            <button className="jsd-card" type="button" onClick={goResume}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco">
                  <Ico name="doc" />
                </div>
              </div>
              <h3>자소서 작성/수정</h3>
              <p>자신의 경험을 잘 드러내는 자소서를 작성하세요</p>
            </button>

            <button className="jsd-card" type="button" onClick={() => nav("/jedit")}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco">
                  <Ico name="lock-solid" />
                </div>
              </div>
              <h3>회원 정보 수정</h3>
              <p>보안을 위해 회원자님의 정보를 보호하세요!</p>
              <div className="jsd-meta">보안 중요!</div>
            </button>

            <button className="jsd-card" type="button" onClick={() => nav("/ai-job")}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco">
                  <Ico name="spark" />
                </div>
              </div>
              <h3>AI 매칭 결과</h3>
              <p>나에게 맞는 기업을 확인하세요</p>
              <div className="jsd-meta">매칭 완료</div>
            </button>

            <button className="jsd-card" type="button" onClick={() => nav("/ai-view")}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco">
                  <Ico name="mic" />
                </div>
              </div>
              <h3>AI 모의 면접 결과</h3>
              <p>AI와 함께 면접 연습하기</p>
              <div className="jsd-meta">연습 진행 중</div>
            </button>

            <button className="jsd-card" type="button" onClick={() => nav("/myactivity")}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco">
                  <Ico name="file-text-solid" />
                </div>
              </div>
              <h3>지원 현황 보기</h3>
              <p>내가 지원한 현황을 모두 확인해보세요</p>
              <div className="jsd-meta">지원한 곳 보기</div>
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
            <div className="jsd-copy">&copy; 2025 JobMatch Corp. All rights reserved.</div>
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
