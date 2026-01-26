import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./MyActivity.css";

export default function MyActivity() {
  const nav = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("applied");

  const [appliedList, setAppliedList] = useState([]);
  const [scrappedList, setScrappedList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Detail에서 넘어올 때 탭 지정
  useEffect(() => {
    const tab = location.state?.tab;
    if (tab === "applied" || tab === "scrapped") setActiveTab(tab);
  }, [location.state]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [aRes, sRes] = await Promise.all([
        api.get("/api/jobseeker/activity/applied"),
        api.get("/api/jobseeker/activity/scrapped"),
      ]);

      const a = aRes.data?.data ?? aRes.data ?? [];
      const s = sRes.data?.data ?? sRes.data ?? [];

      setAppliedList(Array.isArray(a) ? a : []);
      setScrappedList(Array.isArray(s) ? s : []);
    } catch (e) {
      alert("활동 내역 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

    // ✅ 지원한 공고 삭제(지원 취소) - 2번 확인 + 검토중만 가능
    const handleDeleteApplied = async (jobPostsIdx, status) => {
      if (status !== "검토중") {
        alert("검토중 상태일 때만 지원 취소가 가능합니다.");
        return;
      }


      const first = window.confirm("지원 내역을 삭제(지원 취소)할까요?");
      if (!first) return;


      const second = window.confirm("정말로 지원을 취소하시겠습니까? (되돌릴 수 없습니다)");
      if (!second) return;


      try {
        await api.delete(`/api/jobseeker/activity/applied/${jobPostsIdx}`);
        alert("지원 내역이 삭제되었습니다.");


        // ✅ 즉시 화면에서 제거(확실하게)
        setAppliedList((prev) => prev.filter((x) => x.jobPostsIdx !== jobPostsIdx));


        // ✅ 그리고 서버 기준으로 한 번 더 동기화
        await loadAll();
      } catch (e) {
        alert("지원 내역 삭제 실패");
      }
    };

  // ✅ 관심공고에서 지원하기 (SCRAP -> 검토중 전환 or 신규 지원)
  const handleApply = async (jobPostsIdx) => {
    if (!window.confirm("바로 지원하시겠습니까?")) return;

    try {
      await api.post(`/api/jobseeker/activity/apply/${jobPostsIdx}`);
      alert("지원이 완료되었습니다!");
      await loadAll();
      setActiveTab("applied");
    } catch (e) {
      alert("지원 처리 중 오류가 발생했습니다.");
      if (e?.response?.status === 409) {
        alert("이미 지원한 공고입니다.");
        setActiveTab("applied");
        return;
      }
      alert("지원 처리 실패");
    }
  };

  // ✅ 관심공고 해제
  const handleUnscrap = async (jobPostsIdx) => {
    if (!window.confirm("관심공고에서 제거할까요?")) return;

    try {
      await api.delete(`/api/jobseeker/activity/scrap/${jobPostsIdx}`);
      await loadAll();
    } catch (e) {
      alert("관심공고 해제 실패");
    }
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
                <p className="activity-sub">지원한 공고와 관심 있는 공고를 관리하세요.</p>
              </div>
              <button className="btn-back" onClick={() => nav("/jobseeker")}>
                대시보드로 돌아가기
              </button>
            </header>

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

            {loading && <div style={{ padding: 12 }}>불러오는 중...</div>}

            <div className="activity-content">
              {activeTab === "applied" ? (
                <div className="list-container">
                  {appliedList.map((item) => (
                    <div key={item.jobPostsIdx} className="status-item">
                      <div className="item-info">
                        <span className="item-company">{item.companyName}</span>
                        <h3 className="item-title">{item.title}</h3>
                        <span className="item-date">
                          지원일: {(item.appliedAt ?? "").toString().slice(0, 10)}
                        </span>
                        <button
                          className="btn-detail-view"
                          onClick={() => nav(`/helpwanted/${item.jobPostsIdx}`)}
                        >
                          공고 보기
                        </button>
                        <button
                          className="btn-apply-sm"
                          style={{ marginLeft: 8, opacity: 0.85 }}
                          onClick={() => handleDeleteApplied(item.jobPostsIdx, item.status)}
                          >
                          지원 취소
                        </button>
                      </div>

                      <div
                        className={`item-status ${
                          item.status === "합격"
                            ? "pass"
                            : item.status === "불합격"
                            ? "fail"
                            : "wait"
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>
                  ))}
                  {!loading && appliedList.length === 0 && (
                    <div style={{ padding: 20, opacity: 0.7 }}>지원한 공고가 없습니다.</div>
                  )}
                </div>
              ) : (
                <div className="list-container">
                  {scrappedList.map((item) => (
                    <div key={item.jobPostsIdx} className="status-item scrapped">
                      <div className="item-info">
                        <span className="item-company">{item.companyName}</span>
                        <h3 className="item-title">{item.title}</h3>
                        <span className="item-location" style={{ opacity: 0.7 }}>
                          등록일: {(item.scrappedAt ?? "").toString().slice(0, 10)}
                        </span>
                      </div>

                      <div className="item-side">
                        <button
                          className="btn-apply-sm"
                          onClick={() => handleApply(item.jobPostsIdx)}
                        >
                          지원하기
                        </button>
                        <button
                          className="btn-apply-sm"
                          style={{ marginLeft: 8, opacity: 0.8 }}
                          onClick={() => handleUnscrap(item.jobPostsIdx)}
                        >
                          해제
                        </button>
                      </div>
                    </div>
                  ))}
                  {!loading && scrappedList.length === 0 && (
                    <div style={{ padding: 20, opacity: 0.7 }}>관심공고가 없습니다.</div>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </BackgroundShell>
  );
}
