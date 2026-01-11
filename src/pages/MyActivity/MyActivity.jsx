import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./MyActivity.css";

export default function MyActivity() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("applied");

  // 1. 데이터를 useState로 관리해야 리스트가 변할 때 화면(숫자)이 갱신됩니다.
  const [appliedList, setAppliedList] = useState([
    { id: 1, company: "(주)테크이음", title: "프론트엔드 신입 개발자 채용", date: "2025-05-10", status: "검토중" },
    { id: 2, company: "이음소프트", title: "React/Node.js 경력직 모집", date: "2025-05-08", status: "합격" },
    { id: 3, company: "글로벌IT", title: "UI/UX 디자이너 인턴", date: "2025-05-01", status: "불합격" },
  ]);

  const [scrappedList, setScrappedList] = useState([
    { id: 101, company: "네트워크보안", title: "보안 솔루션 운영 담당자", location: "서울 강남구", dDay: "D-5" },
    { id: 102, company: "데이터랩", title: "데이터 분석가 채용 (신입/경력)", location: "경기 판교", dDay: "D-12" },
  ]);

  // 2. 지원하기 버튼 클릭 시 실행될 함수
  const handleApply = (item) => {
    if (!window.confirm(`${item.company}에 바로 지원하시겠습니까?`)) return;

    // A. 관심 공고에서 삭제
    setScrappedList(scrappedList.filter(s => s.id !== item.id));

    // B. 지원 현황에 추가 (오늘 날짜로 추가)
    const newApplied = {
      id: Date.now(),
      company: item.company,
      title: item.title,
      date: new Date().toISOString().split('T')[0],
      status: "검토중"
    };
    setAppliedList([newApplied, ...appliedList]);

    // C. 지원 현황 탭으로 이동
    setActiveTab("applied");
    
    alert("지원이 완료되었습니다!");
  };

  return (
    <BackgroundShell>
      <div className="activity-page">
        <div className="activity-bg" />
        
        <main className="activity-shell">
          <section className="activity-card">
            <header className="activity-header">
              <div className="header-left">
                <h1 className="activity-title">나의 활동 내역</h1>
                <p className="activity-sub">지원한 공고와 관심 있는 기업을 관리하세요.</p>
              </div>
              <button className="btn-back" onClick={() => nav("/jobseeker")}>대시보드로 돌아가기</button>
            </header>

            {/* 탭 메뉴 - 여기 .count 숫자들은 list.length에 의해 자동 갱신됨 */}
            <nav className="activity-tabs">
              <button 
                className={`tab-item ${activeTab === "applied" ? "active" : ""}`}
                onClick={() => setActiveTab("applied")}
              >
                지원 현황 <span className="count">{appliedList.length}</span>
              </button>
              <button 
                className={`tab-item ${activeTab === "scrapped" ? "active" : ""}`}
                onClick={() => setActiveTab("scrapped")}
              >
                관심 공고 <span className="count">{scrappedList.length}</span>
              </button>
            </nav>

            <div className="activity-content">
              {activeTab === "applied" ? (
                <div className="list-container">
                  {appliedList.map((item) => (
                    <div key={item.id} className="status-item">
                      <div className="item-info">
                        <span className="item-company">{item.company}</span>
                        <h3 className="item-title">{item.title}</h3>
                        <span className="item-date">지원일: {item.date}</span>
                      </div>
                      <div className={`item-status ${item.status === "합격" ? "pass" : item.status === "불합격" ? "fail" : "wait"}`}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="list-container">
                  {scrappedList.map((item) => (
                    <div key={item.id} className="status-item scrapped">
                      <div className="item-info">
                        <span className="item-company">{item.company}</span>
                        <h3 className="item-title">{item.title}</h3>
                        <span className="item-location">{item.location}</span>
                      </div>
                      <div className="item-side">
                        <span className="d-day">{item.dDay}</span>
                        <button className="btn-apply-sm" onClick={() => handleApply(item)}>지원하기</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </BackgroundShell>
  );
}