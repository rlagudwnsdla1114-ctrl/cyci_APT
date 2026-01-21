import React, { useEffect, useState } from 'react';
import BackgroundShell from '../../components/BackgroundShell';
import './AIRecommendedTalent.css';
import { api } from "../../api/api";

// 아이콘 컴포넌트
function Ico({ name }) {
  const common = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 2 };
  if (name === "star") return <svg {...common} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
  if (name === "arrow-left") return <svg {...common} viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>;
  return null;
}
const token = localStorage.getItem("token");

const AIRecommendedTalent = () => {
  // 1. 현재 선택된 공고 상태
  const [selectedJob, setSelectedJob] = useState(null);
  const [myPostings, setMyPostings] = useState([]);


  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. 내 공고 목록 (DB: HELP_WANTED 테이블 데이터 예시)
  useEffect(() => {
    api.post("/api/ai/JobPostsList", null, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        const list = Array.isArray(res.data)? res.data : (res.data?.data ?? []);

        const cleaned = list.filter(x => x != null);

        console.log("raw:", list);
        console.log("cleaned:", cleaned);

        setMyPostings(cleaned);
      });
  },[]);

  // 3. 공고별 추천 인재 데이터
  const handleSelectJob = (post) => {
    setSelectedJob(post);
    setTalents([]);
    setLoading(true);

    const jobPostsIdx = post.jobPostsIdx ?? post.JobPostsIdx ?? post.id;

    api.post("/api/ai/AIComapnyMatch", {
      jobPostsIdx,
      topN: 20
    },{
    headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).then(res => {
      const list = Array.isArray(res.data)? res.data : (res.data?.data ?? []);
      const cleaned = list.filter(x => x != null);
      setTalents(cleaned);
      setLoading(false);
    });
  };

  const handleBack = () => {
    setSelectedJob(null);
    setTalents([]);
    setLoading(false);
  }

  return (
    <BackgroundShell>
      <div className="ait-container">
        <header className="ait-header">
          <div className="ait-header-inner">
            {selectedJob ? (
              <button className="ait-back-btn" onClick={() => setSelectedJob(null)}>
                <Ico name="arrow-left" /> 공고 목록으로 돌아가기
              </button>
            ) : null}
            <h1 className="ait-title">
              {selectedJob ? `[${selectedJob.title}] 추천 인재` : "추천받을 공고 선택"}
            </h1>
            <p className="ait-subtitle">
              {selectedJob 
                ? "AI가 해당 공고에 가장 적합한 인재를 선별했습니다." 
                : "인재를 추천받고 싶은 공고를 하나 선택해 주세요."}
            </p>
          </div>
        </header>

        <main className="ait-content">
          {!selectedJob ? (
            <div className="ait-job-list">
              {myPostings.map(post => (
                <div key={post.jobPostsIdx ?? post.JobPostsIdx ?? post.id} className="ait-job-card" onClick={() => setSelectedJob(post)}>
                  <div className="ait-job-info">
                    <span className="ait-job-dept">{post.techStack}</span> 
                    <h3 className="ait-job-title">{post.title}</h3>
                    <span className="ait-job-date">등록일: {post.postsCreateAt}</span>
                  </div>
                  <button className="ait-job-select-btn"type="button"onClick={(e) => { e.stopPropagation(); handleSelectJob(post); }}>
                  인재 추천 보기
                </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="ait-grid">
              {talents.map((talent, idx) => (
                <article key={talent.jobseekerIdx ?? talent.jobseekersIdx ?? idx} className="ait-card">
                  <div className="ait-card-header">
                    <div className="ait-score-badge">
                      <Ico name="star" />
                      <span>적합도 {talent.matchRate}%</span>
                    </div>
                  </div>

                  <h3 className="ait-name">
                    {talent.name ?? talent.jobseekerName}
                  </h3>

                  <div className="ait-reason-box">
                    <strong className="ait-reason-title">✨ AI 분석 리포트</strong>
                    <p className="ait-reason-text">{talent.reason}</p>
                  </div>

                  <button className="ait-btn">이력서 상세 보기</button>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </BackgroundShell>
  );
};

export default AIRecommendedTalent;