import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../../api/api';
import './AiInterviewHistory.css';

const AiInterviewHistory = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await api.get('/api/ai/interviewHistory');
      setInterviewList(res.data);
    };
    fetchHistory();
  }, []);

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="interview-history-container">
      <header className="rl-header">
          <div className="rl-headerInner">
            <div className="rl-brand" onClick={() => nav("/jobseeker")}>
              <div className="rl-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M4 10V6a2 2 0 0 1 2-2h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity=".9"
                  />
                  <path
                    d="M20 14v4a2 2 0 0 1-2 2h-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity=".9"
                  />
                </svg>
              </div>
              <div className="rl-brandText">잡매치 · AI 모의 면접 결과</div>
            </div>
            <div className="rl-actions">
              <button className="rl-pillBtn" onClick={() => nav("/jobseeker")}>
                나가기
              </button>
            </div>
          </div>
        </header>
      <div className="history-header">
        <h2>🎤 AI 면접 결과 리포트</h2>
        <p>AI가 분석한 나의 면접 점수와 상세 피드백을 확인하세요.</p>
      </div>
      <div className="interview-items-wrapper">
        {interviewList.map((item, index) => {
          const round = interviewList.length - index; // 최신이 마지막 차수, 오래된게 1차
          return (
            <div key={item.interviewId} className={`interview-item-card ${expandedId === item.interviewId ? 'is-open' : ''}`}>
              <div className="card-summary" onClick={() => handleToggle(item.interviewId)}>
                <div className="info-left">
                  <span className="date-badge">No. {item.interviewId}</span>
                  <h3 className="interview-title">{round}차 대비 면접</h3>
                </div>

                <div className="info-right">
                  <div className="score-badge">
                    <span>종합점수</span>
                    <strong>{item.totalScore}점</strong>
                  </div>
                  <button className={`expand-circle-btn ${expandedId === item.interviewId ? 'rotated' : ''}`}>
                    <span className="arrow-icon">∨</span>
                  </button>
                </div>
              </div>
              <div className="card-detail-content">
                <div className="detail-inner">
                  <div className="detail-section">
                    <div className="section-label">💡 AI 정밀 분석 리포트</div>
                    <div className="feedback-text-area">{item.aiFeedback}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AiInterviewHistory;