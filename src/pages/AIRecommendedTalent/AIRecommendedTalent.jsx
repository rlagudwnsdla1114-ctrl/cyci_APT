import React, { useState } from 'react';
import BackgroundShell from '../../components/BackgroundShell';
import './AIRecommendedTalent.css';

// 아이콘 컴포넌트
function Ico({ name }) {
  const common = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 2 };
  if (name === "star") return <svg {...common} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
  if (name === "check") return <svg {...common} viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>;
  return null;
}

const AIRecommendedTalent = () => {
  // DB: COMPANY_MATCHING 테이블 데이터 예시
  const recommendedTalents = [
    { 
      id: 1, 
      name: "김철수", 
      job: "프론트엔드 개발자", 
      score: 95, // COM_MATCH_SCORE
      reason: "보유 기술 스택(React, TypeScript)이 공고와 98% 일치하며, 동종 업계 프로젝트 경험이 풍부합니다.", // COM_AI_REASON
      tags: ["React", "3년차", "서울"]
    },
    { 
      id: 2, 
      name: "이영희", 
      job: "UI/UX 디자이너", 
      score: 88, 
      reason: "희망 근무 조건과 회사의 복지 혜택이 잘 부합하며, 포트폴리오의 디자인 톤이 회사 브랜드와 유사합니다.",
      tags: ["Figma", "신입", "경기"]
    },
  ];

  return (
    <BackgroundShell>
      <div className="ait-container">
        <header className="ait-header">
          <div className="ait-header-inner">
            <h1 className="ait-title">AI 추천 인재</h1>
            <p className="ait-subtitle">우리 회사 공고에 딱 맞는 최적의 인재를 AI가 분석했습니다.</p>
          </div>
        </header>

        <main className="ait-content">
          <div className="ait-grid">
            {recommendedTalents.map(talent => (
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
        </main>
      </div>
    </BackgroundShell>
  );
};

export default AIRecommendedTalent;