import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import './AiInterviewHistory.css';

const AiInterviewHistory = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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
      <header className="history-header">
        <h2>🎤 AI 면접 결과 리포트</h2>
        <p>AI가 분석한 나의 면접 점수와 상세 피드백을 확인하세요.</p>
      </header>

      <div className="interview-items-wrapper">
        {interviewList.map((item) => (
          <div 
            key={item.interviewId} 
            className={`interview-item-card ${expandedId === item.interviewId ? 'is-open' : ''}`}
          >
            <div className="card-summary" onClick={() => handleToggle(item.interviewId)}>
              <div className="info-left">
                <span className="date-badge">No. {item.interviewId}</span>
                <h3 className="interview-title">{item.interviewTitle} 대비 면접</h3>
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
                  <div className="feedback-text-area">
                    {item.aiFeedback}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiInterviewHistory;