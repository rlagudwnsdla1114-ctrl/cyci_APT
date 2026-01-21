import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './AIRecommendedCompany.css';
import { api } from "../../api/api";

const AIRecommendedCompany = () => {  

  const [loading, setLoading] = useState(false);   // true → 불러오는 중
  const [empty, setEmpty] = useState(false);       // true → 추천 공고 없음
  const [recommendedJobs, setRecommendedJobs] = useState([]);

    const nav = useNavigate();


  useEffect(() => {
    console.log("들어옴1");
    setLoading(true);
    setEmpty(false);

    api.post("/api/ai/AIRecommendedCompany")
    .then(res => {
      console.log(res);
      console.log("들어옴2");
      const lists = Array.isArray(res.data?.lists) ? res.data.lists : [];
      setRecommendedJobs(lists);
      console.log("lists:", lists);
      setEmpty(lists.length === 0);
    })
    .catch(() => setEmpty(true))
    .finally(() => setLoading(false));
  },[]);

  return (
    <BackgroundShell>
      <div className="aic-container">
        <header className="aic-header">
          <div className="aic-header-content">
            <h1 className="aic-title">AI 맞춤 추천 공고</h1>
            <p className="aic-subtitle">
              빅데이터 분석을 통해 합격 가능성이 높은 공고를 선별했습니다.
            </p>
          </div>
        </header>

        {loading && (
          <div className="aic-list-wrap">
            <div className="aic-card" style={{ justifyContent: "center" }}>
              <div className="aic-info" style={{ textAlign: "center" }}>
                <h3 className="aic-job-title">불러오는 중...</h3>
              </div>
            </div>
          </div>
        )}

        {!loading && empty && (
          <div className="aic-list-wrap">
            <div className="aic-card" style={{ justifyContent: "center" }}>
              <div className="aic-info" style={{ textAlign: "center" }}>
                <h3 className="aic-job-title">추천 공고가 없습니다.</h3>
                <p className="aic-subtitle">
                  이력서 정보를 조금 더 채우면 추천 정확도가 올라갑니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && !empty && (
          <div className="aic-list-wrap">
            {recommendedJobs.map(job => (
              <div key={job.idx} className="aic-card">
                <div className="aic-match-ring">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${job.score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">
                      {job.score}%
                    </text>
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

                <button className="aic-apply-btn" onClick={() => nav(`/helpwanted/${job.jpIdx}`)}>공고 보기</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </BackgroundShell>
  );
};

export default AIRecommendedCompany;
