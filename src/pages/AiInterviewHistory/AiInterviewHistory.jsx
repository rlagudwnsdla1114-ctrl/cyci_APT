import React, { useState, useEffect } from 'react';
import './AiInterviewHistory.css';

const AiInterviewHistory = () => {
  // 1. 상태 관리: DB에서 가져온 면접 리스트와 현재 펼쳐진 카드의 ID
  const [interviewList, setInterviewList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // 2. 백엔드 연동을 가정한 데이터 로드 (useEffect)
  useEffect(() => {
    // 실제 구현 시: axios.get('/api/interview/all').then(...)
    const dummyData = [
      {
        interview_id: 1,
        interview_title: "2026 상반기 삼성전자 대비 면접",
        interview_date: "2026-01-10",
        total_score: 92,
        stt_content: "질문: 본인의 강점은? 답변: 저의 강점은 끈기입니다. 국비 교육 과정 중 어려운 프로젝트를 만났을 때 끝까지 포기하지 않고...",
        ai_feedback: "답변의 논리적 구성이 훌륭합니다. 자신감 있는 어조가 긍정적이나, 특정 단어(아, 음)의 반복을 줄이면 완벽할 것 같습니다.",
        result_status: "PASS"
      },
      {
        interview_id: 2,
        interview_title: "백엔드 개발자 기술 면접 연습",
        interview_date: "2026-01-05",
        total_score: 78,
        stt_content: "질문: REST API에 대해 설명하세요. 답변: REST API는 자원을 이름으로 구분하여 해당 자원의 상태를 주고받는 것을 의미합니다...",
        ai_feedback: "기술적인 개념 설명은 정확합니다. 하지만 답변 중간에 시선이 아래로 향하는 시간이 길어 보완이 필요합니다.",
        result_status: "RE-TRY"
      },
      {
        interview_id: 3,
        interview_title: "스타트업 인성 면접",
        interview_date: "2025-12-28",
        total_score: 65,
        stt_content: "질문: 협업 중 갈등 발생 시 어떻게 하나요? 답변: 저는 일단 상대방의 의견을 듣고... 어... 그 다음에...",
        ai_feedback: "당황했을 때 말이 빨라지는 경향이 있습니다. 침착하게 생각을 정리한 후 답변하는 연습이 필요합니다.",
        result_status: "FAIL"
      }
    ];
    setInterviewList(dummyData);
  }, []);

  // 3. 펼치기/접기 핸들러
  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="interview-history-container">
      <header className="history-header">
        <h2>🎤 AI 면접 결과 리포트</h2>
        <p>지금까지 진행한 모든 AI 면접 분석 결과를 확인하세요.</p>
      </header>

      <div className="interview-items-wrapper">
        {interviewList.map((item) => (
          <div 
            key={item.interview_id} 
            className={`interview-item-card ${expandedId === item.interview_id ? 'is-open' : ''}`}
          >
            {/* 상단: 요약 정보 (항상 노출) */}
            <div className="card-summary" onClick={() => handleToggle(item.interview_id)}>
              <div className="info-left">
                <span className="date-badge">{item.interview_date}</span>
                <h3 className="interview-title">{item.interview_title}</h3>
              </div>
              
              <div className="info-right">
                <div className="score-badge">
                  <span>종합점수</span>
                  <strong>{item.total_score}점</strong>
                </div>
                {/* 텍스트 펼치기 버튼 (이미지 스타일 반영) */}
                <button className={`expand-circle-btn ${expandedId === item.interview_id ? 'rotated' : ''}`}>
                  <span className="arrow-icon">∨</span>
                </button>
              </div>
            </div>

            {/* 하단: 상세 내용 (펼쳐졌을 때만 노출) */}
            <div className="card-detail-content">
              <div className="detail-inner">
                <div className="detail-section">
                  <div className="section-label">💬 면접 답변 스크립트 (STT)</div>
                  <div className="stt-text-area">
                    {item.stt_content}
                  </div>
                </div>

                <div className="detail-section">
                  <div className="section-label">💡 AI 정밀 피드백</div>
                  <div className="feedback-text-area">
                    {item.ai_feedback}
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