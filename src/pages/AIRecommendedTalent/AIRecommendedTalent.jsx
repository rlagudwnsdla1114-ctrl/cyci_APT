import React, { useState } from 'react';
import BackgroundShell from '../../components/BackgroundShell';
import './AIRecommendedTalent.css';

// 아이콘 컴포넌트
function Ico({ name }) {
  const common = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 2 };
  if (name === "star") return <svg {...common} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
  if (name === "arrow-left") return <svg {...common} viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>;
  return null;
}

const AIRecommendedTalent = () => {
  // 1. 현재 선택된 공고 상태 (null이면 공고 선택 화면, 값이 있으면 인재 추천 화면)
  const [selectedJob, setSelectedJob] = useState(null);

  // 2. 내 공고 목록 (DB: HELP_WANTED 테이블 데이터 예시)
  const myPostings = [
    { id: 101, title: "프론트엔드 시니어 개발자 채용", department: "개발팀", date: "2024-03-20" },
    { id: 102, title: "UI/UX 디자이너 경력직", department: "디자인팀", date: "2024-03-15" },
    { id: 103, title: "백엔드 자바 개발자 (Spring)", department: "개발팀", date: "2024-03-10" },
    // ... 공고가 10개 이상일 상황 대응
  ];

  // 3. 공고별 추천 인재 데이터 (실제로는 API 호출 시 selectedJob.id를 인자로 보냄)
  const talentData = {
    101: [
      { id: 1, name: "김철수", job: "프론트엔드 개발자", score: 95, reason: "React 숙련도가 매우 높으며 공고의 기술 스택과 일치합니다.", tags: ["React", "3년차"] },
      { id: 3, name: "박지성", job: "프론트엔드 개발자", score: 82, reason: "컴포넌트 설계 능력이 우수합니다.", tags: ["Vue", "5년차"] },
    ],
    102: [
      { id: 2, name: "이영희", job: "UI/UX 디자이너", score: 88, reason: "포트폴리오 스타일이 우리 브랜드와 일치합니다.", tags: ["Figma", "신입"] },
    ],
    103: [
      { id: 4, name: "최배달", job: "백엔드 개발자", score: 91, reason: "대규모 트래픽 처리 경험이 공고 요건에 부합합니다.", tags: ["Java", "7년차"] },
    ]
  };

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
            /* --- 1단계: 내 공고 리스트 (선택 화면) --- */
            <div className="ait-job-list">
              {myPostings.map(post => (
                <div key={post.id} className="ait-job-card" onClick={() => setSelectedJob(post)}>
                  <div className="ait-job-info">
                    <span className="ait-job-dept">{post.department}</span>
                    <h3 className="ait-job-title">{post.title}</h3>
                    <span className="ait-job-date">등록일: {post.date}</span>
                  </div>
                  <button className="ait-job-select-btn">인재 추천 보기</button>
                </div>
              ))}
            </div>
          ) : (
            /* --- 2단계: 선택된 공고의 인재 리스트 --- */
            <div className="ait-grid">
              {(talentData[selectedJob.id] || []).map(talent => (
                <article key={talent.id} className="ait-card">
                  <div className="ait-card-header">
                    <div className="ait-score-badge">
                      <Ico name="star" />
                      <span>적합도 {talent.score}%</span>
                    </div>
                    <span className="ait-job">{talent.job}</span>
                  </div>
                  <h3 className="ait-name">{talent.name}</h3>
                  <div className="ait-tags">
                    {talent.tags.map((tag, idx) => <span key={idx} className="ait-tag">{tag}</span>)}
                  </div>
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