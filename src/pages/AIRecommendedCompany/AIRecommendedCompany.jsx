import React from 'react';
import BackgroundShell from '../../components/BackgroundShell';
import './AIRecommendedCompany.css';

const AIRecommendedCompany = () => {
  // DB: JOBSEEKER_MATCHING 테이블 데이터 예시
  const recommendedJobs = [
    { 
      id: 1, 
      company: "(주)사이시옷", 
      title: "주니어 웹 개발자 채용", 
      score: 92,
      reason: "지원자님의 기술 스택(React)과 회사의 주요 프로젝트 언어가 일치하며, 선호하는 기업 규모에 해당합니다.", // JOB_AI_REASON
      salary: "3,500만원",
      loc: "서울 강남구"
    },
    { 
      id: 2, 
      company: "넥스트이노베이션", 
      title: "플랫폼 서비스 기획자", 
      score: 85, 
      reason: "과거 프로젝트 경험에서 보여준 리더십이 회사의 인재상과 부합합니다.",
      salary: "3,800만원",
      loc: "판교"
    },
  ];

  return (
    <BackgroundShell>
      <div className="aic-container">
        <header className="aic-header">
          <div className="aic-header-content">
            <h1 className="aic-title">AI 맞춤 추천 공고</h1>
            <p className="aic-subtitle">빅데이터 분석을 통해 합격 가능성이 높은 공고를 선별했습니다.</p>
          </div>
        </header>

        <div className="aic-list-wrap">
          {recommendedJobs.map(job => (
            <div key={job.id} className="aic-card">
              <div className="aic-match-ring">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray={`${job.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">{job.score}%</text>
                </svg>
                <span className="aic-match-label">매칭률</span>
              </div>

              <div className="aic-info">
                <h4 className="aic-company-name">{job.company}</h4>
                <h3 className="aic-job-title">{job.title}</h3>
                <div className="aic-meta">
                  <span>{job.salary}</span>
                  <span className="aic-divider">•</span>
                  <span>{job.loc}</span>
                </div>
                <div className="aic-ai-comment">
                  <span className="aic-icon">🤖</span>
                  <p>"{job.reason}"</p>
                </div>
              </div>

              <button className="aic-apply-btn">지원하기</button>
            </div>
          ))}
        </div>
      </div>
    </BackgroundShell>
  );
};

export default AIRecommendedCompany;