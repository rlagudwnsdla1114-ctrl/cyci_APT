import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "../JobSeekerDashboard/JobSeekerDashboard.css"; // JSD 틀 유지
import "./MemberSelect.css";

function Ico({ name }) {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none" };
  switch (name) {
    case "doc": return (
      <svg {...common} aria-hidden="true">
        <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
        <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12h8M8 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
    case "spark": return (
      <svg {...common} aria-hidden="true">
        <path d="M12 2l1.2 4.2L17 7.5l-3.8 1.3L12 13l-1.2-4.2L7 7.5l3.8-1.3L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M19 12l.8 2.7L22 15.5l-2.2.8L19 19l-.8-2.7L16 15.5l2.2-.8L19 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
    default: return null;
  }
}

export default function MemberSelect() {
  const nav = useNavigate();
  const [gateOpen, setGateOpen] = useState(false);
  const [flipped, setFlipped] = useState([false, false, false]);

  const toggleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  // ✅ 모든 주요 버튼 클릭 시 "로그인 유도 안내창"을 띄우는 함수
  const handleAction = (e) => {
    if (e) e.stopPropagation();
    setGateOpen(true);
  };

  const goLogin = () => nav("/login");
  const goSignup = () => nav("/signup");

  return (
    <BackgroundShell>
      <div className="jsd">
        <header className="jsd-header">
          <div className="jsd-headerInner">
            <div className="jsd-brand" role="button" onClick={() => nav("/")}>
              <div className="jsd-mark" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".9" />
                  <path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".9" />
                </svg>
              </div>
              <div className="jsd-brandText">
                <div className="jsd-brandName">잡매치</div>
                <div className="jsd-brandSub">회원 서비스 안내</div>
              </div>
            </div>

            <nav className="jsd-nav" aria-label="메인 메뉴">
              <button className="jsd-navBtn" type="button" onClick={handleAction}>채용정보</button>
              <button className="jsd-navBtn" type="button" onClick={handleAction}>AI 매칭</button>
            </nav>

            <div className="jsd-actions">
              <button className="jsd-pillBtn" type="button" onClick={goLogin}>로그인</button>
              <button className="jsd-pillBtn" type="button" onClick={goSignup}>회원가입</button>
            </div>
          </div>
        </header>

        <main className="jsd-main">
          <section className="jsd-hero">
            <div className="jsd-heroLeft">
              <div className="jsd-kicker"><span className="jsd-kickerDot" /> WELCOME TO JOBMATCH</div>
              <h1 className="jsd-title">당신에게 꼭 맞는<br/>파트너를 찾으세요</h1>
              <p className="jsd-desc">
                기업과 구직자를 잇는 가장 스마트한 기술.<br/>
                원하는 회원 유형을 선택하여 맞춤형 서비스를 시작해 보세요.
              </p>
              <div className="jsd-cta">
                <button className="jsd-tabBtn active" type="button">통합 서비스 안내</button>
              </div>

              <div className="jsd-stats">
                {/* 카드 1: 기업회원 안내 */}
                <div className={`jsd-stat jsd-flipCard ${flipped[0] ? 'flipped' : ''}`} onClick={() => toggleFlip(0)}>
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-profileCard">
                          <div className="jsd-cardTitle">🏢 기업 회원</div>
                          <div className="jsd-cardSubtext" style={{marginTop:'20px'}}>우수한 인재를 찾고 계신가요?</div>
                          <div className="jsd-meta">인재 검색 · 공고 관리 · 분석</div>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">기업 서비스</div>
                          <ul className="jsd-backList">
                            <li>✓ AI 기반 인재 추천</li>
                            <li>✓ 공고 등록 및 관리</li>
                          </ul>
                          <button className="jsd-backBtn" onClick={handleAction} type="button">기업으로 시작</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 카드 2: 구직자회원 안내 */}
                <div className={`jsd-stat jsd-flipCard ${flipped[1] ? 'flipped' : ''}`} onClick={() => toggleFlip(1)}>
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-applicationCard">
                          <div className="jsd-cardTitle">👤 구직자 회원</div>
                          <div className="jsd-cardSubtext" style={{marginTop:'20px'}}>나에게 맞는 직장을 찾으시나요?</div>
                          <div className="jsd-meta">맞춤 공고 · 자소서 분석 · 면접</div>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">구직 서비스</div>
                          <ul className="jsd-backList">
                            <li>✓ 맞춤형 채용 매칭</li>
                            <li>✓ AI 면접 피드백</li>
                          </ul>
                          <button className="jsd-backBtn" onClick={handleAction} type="button">구직자로 시작</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 카드 3: 특징 */}
                <div className={`jsd-stat jsd-flipCard ${flipped[2] ? 'flipped' : ''}`} onClick={() => toggleFlip(2)}>
                  <div className="jsd-flipCardInner">
                    <div className="jsd-flipCardFront">
                      <div className="jsd-statContent">
                        <div className="jsd-strengthCard">
                          <div className="jsd-strengthIcon">🚀</div>
                          <div className="jsd-strengthTitle">왜 잡매치인가요?</div>
                          <div className="jsd-cardSubtext">정교한 매칭 알고리즘</div>
                        </div>
                      </div>
                    </div>
                    <div className="jsd-flipCardBack">
                      <div className="jsd-statContent">
                        <div className="jsd-backContent">
                          <div className="jsd-backTitle">ABOUT US</div>
                          <p className="jsd-backAdvice">데이터를 기반으로 최적의<br/>커리어를 연결해 드립니다.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="jsd-heroRight">
              <aside className="jsd-idBadge" aria-label="가입 정보 안내">
                <div className="jsd-lanyardWrap">
                  <div className="jsd-idLanyard" aria-hidden="true">
                    <span className="jsd-idStrap left" /><span className="jsd-idStrap right" /><span className="jsd-idClip" />
                  </div>
                </div>
                <div className="jsd-idCard">
                  <div className="jsd-idTop">
                    <div className="jsd-idAvatar" aria-hidden="true">JM</div>
                    <div className="jsd-idName">JOB MATCH</div>
                    <div className="jsd-idSub">Smart Matching Hub</div>
                  </div>

                  <div className="jsd-idStats">
                    <div className="jsd-idStat">
                      <div className="jsd-idStatLabel">플랫폼</div>
                      <div className="jsd-idStatValue">통합형</div>
                    </div>
                    <div className="jsd-idStat">
                      <div className="jsd-idStatLabel">기술 기반</div>
                      <div className="jsd-idStatValue">AI 엔진</div>
                    </div>
                  </div>

                  <div className="jsd-idSection">
                    <div className="jsd-idSectionTitle">서비스 아이덴티티</div>
                    <ul className="jsd-idList">
                      <li>기업과 인재의 스마트한 가교</li>
                      <li>데이터 중심의 채용 생태계</li>
                    </ul>
                  </div>

                  <div className="jsd-idBrand" aria-hidden="true">
                    OFFICIAL · ACCESS PASS
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <div className="jsd-sectionTitle">간편 안내</div>
          <section className="jsd-grid" aria-label="브랜드 가치 안내">

            <button className="jsd-card" type="button" onClick={handleAction}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco"><Ico name="doc" /></div>
                <span className="jsd-tag">Security</span>
              </div>
              <h3>철저한 데이터 보안</h3>
              <p>기업과 개인의 소중한 정보를 암호화하여 안전하게 보호합니다.</p>
            </button>

            <button className="jsd-card" type="button" onClick={handleAction}>
              <div className="jsd-cardTop">
                <div className="jsd-cardIco"><Ico name="spark" /></div>
                <span className="jsd-tag">Technology</span>
              </div>
              <h3>독자적인 AI 엔진</h3>
              <p>잡매치만의 고도화된 매칭 알고리즘으로 채용의 효율을 높입니다.</p>
            </button>
            
          </section>
        </main>

        <footer className="jsd-footer">
          <div className="jsd-footerInner">
            <div className="jsd-copy">&copy; 2025 JobMatch Corp. All rights reserved.</div>
          </div>
        </footer>

        {/* ✅ 로그인 유도 안내 모달 */}
        {gateOpen && (
          <div className="jsd-modalBackdrop" onClick={() => setGateOpen(false)}>
            <div className="jsd-modal" onClick={(e) => e.stopPropagation()}>
              <div className="jsd-modalTitle">안내</div>
              <div className="jsd-modalDesc">로그인 후 이용해 주세요</div>
              <div className="jsd-modalActions">
                <button className="jsd-modalBtn" onClick={() => setGateOpen(false)}>취소</button>
                <button className="jsd-modalBtn primary" onClick={() => { setGateOpen(false); goLogin(); }}>확인</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BackgroundShell>
  );
}