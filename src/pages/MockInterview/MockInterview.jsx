import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './MockInterview.css';

const MockInterview = () => {
  const navigate = useNavigate();


  const [step, setStep] = useState('intro'); 
  
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const [finalResult, setFinalResult] = useState({ score: 0, reason: '' });

  const startInterview = () => {
    setStep('ai_generating');

    setTimeout(() => {
      const aiGeneratedQuestions = [
        "지원하신 직무와 관련하여 본인의 핵심 역량은 무엇이라고 생각하시나요?",
        "자소서에 언급하신 프로젝트에서 발생한 문제를 구체적으로 어떻게 해결하셨나요?",
        "입사 후 우리 회사에서 이루고 싶은 단기적인 목표는 무엇인가요?",
        "팀 활동 중 의견 충돌이 있었던 경험과 그 해결 과정을 말씀해 주세요.",
        "지원자님께서 생각하시는 '좋은 개발자'란 무엇인가요?",
        "마지막으로, 본인을 채용해야 하는 이유를 한 문장으로 말씀해 주세요."
      ];
      
      setQuestions(aiGeneratedQuestions);
      setStep('question');
    }, 3000);
  };

  // --- 면접 진행 (녹음) ---
  const toggleRecording = () => {
    if (isListening) {
      // 답변 완료 -> 다음으로
      stopRecordingAndNext();
    } else {
      // 답변 시작
      setIsListening(true);
      setStep('listening');
    }
  };

  // 답변 저장 및 다음 질문으로 이동
  const stopRecordingAndNext = () => {
    setIsListening(false);
    setStep('processing'); // "잠시만요..."

    // 녹음된 음성을 텍스트로 변환(STT)했다고 가정
    const currentAnswer = "네, 저는 과거 프로젝트 경험을 통해..."; 
    
    // 답변 저장
    const newAnswers = [...userAnswers, { 
      question: questions[currentQIndex], 
      answer: currentAnswer 
    }];
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        // 다음 질문이 남았으면 이동
        setCurrentQIndex(prev => prev + 1);
        setStep('question');
      } else {
        // 질문 끝! AI 평가 받으러 가기
        evaluateWithAI(newAnswers);
      }
    }, 1500);
  };

  // --- [단계 3] AI에게 답변 보내고 평가 받기 ---
  const evaluateWithAI = (answers) => {
    setStep('ai_evaluating');

    // (가상) API 호출: AI야, 내 답변들(answers) 평가해서 점수랑 이유 알려줘.
    // axios.post('/api/ai/evaluate', { answers }).then(...)
    setTimeout(() => {
      // AI가 내려준 평가 결과라고 가정
      const aiResult = {
        score: Math.floor(Math.random() * (98 - 70 + 1)) + 70, // 70~98점 랜덤
        reason: `[AI 종합 분석]\n총 ${answers.length}개의 질문에 대해 답변을 분석했습니다.\n\n` +
                `1. 직무 적합성: 자소서 내용과 일치하는 구체적인 경험을 제시하여 신뢰도가 높습니다.\n` +
                `2. 논리성: 답변의 기승전결이 뚜렷하나, 일부 질문에서는 결론이 다소 늦게 나오는 경향이 있습니다.\n` +
                `3. 태도: 자신감 있는 어조가 인상적입니다.\n\n` +
                `종합적으로 우리 회사의 인재상에 부합하는 지원자로 판단됩니다.`
      };

      setFinalResult(aiResult);
      saveToDatabase(aiResult); // DB 저장 함수 호출
    }, 4000); // 4초 동안 "AI가 채점 중..." 표시
  };

  // --- [단계 4] DB에 결과 저장 (INTERVIEW_RESULT 테이블) ---
  const saveToDatabase = (result) => {
    setStep('saving');

    const payload = {
      INTERVIEW_SCORE: String(result.score),
      INTERVIEW_REASON: result.reason,
      COVER_POSTS_COVER_POSTS_IDX: coverId
    };

    console.log("💾 DB 저장 데이터:", payload);

    // 저장 API 호출
    setTimeout(() => {
      setStep('result'); // 최종 결과 화면
    }, 1500);
  };

  return (
    <BackgroundShell>
      <div className="mi-container">
        
        {/* 화면 1: 인트로 */}
        {step === 'intro' && (
          <div className="mi-card intro-card">
            <h1 className="mi-title">AI 자소서 기반 면접</h1>
            <p className="mi-desc">
              제출하신 <strong>자기소개서</strong>를 AI에게 전송합니다.<br/>
              AI가 내용을 분석하여 <strong>맞춤형 질문 5~10개</strong>를 생성하고,<br/>
              면접 후 답변 내용을 바탕으로 합격 가능성을 예측해 줍니다.
            </p>
            <button className="mi-btn-start" onClick={startInterview}>
              자소서 전송 및 면접 시작
            </button>
          </div>
        )}

        {/* 화면 2: AI 질문 생성 중 */}
        {step === 'ai_generating' && (
          <div className="mi-card loading-card">
            <div className="mi-spinner"></div>
            <h3>AI가 자소서를 분석 중입니다...</h3>
            <p>지원 직무와 경험을 바탕으로 예상 질문을 추출하고 있습니다.</p>
          </div>
        )}

        {/* 화면 3: 질문 및 답변 진행 */}
        {(step === 'question' || step === 'listening') && (
          <div className="mi-interview-layout">
            <div className="mi-progress-container">
              <div className="mi-progress-text">Question {currentQIndex + 1} / {questions.length}</div>
              <div className="mi-progress-bg">
                <div 
                  className="mi-progress-fill" 
                  style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mi-question-box">
              <span className="mi-badge">AI 생성 질문 {currentQIndex + 1}</span>
              <h2 className="mi-q-text">"{questions[currentQIndex]}"</h2>
            </div>

            <div className={`mi-audio-visualizer ${step === 'listening' ? 'active' : ''}`}>
              <div className="bar"></div><div className="bar"></div><div className="bar"></div>
              <div className="bar"></div><div className="bar"></div>
            </div>

            <div className="mi-control-area">
              {step === 'question' ? (
                <button className="mi-mic-btn" onClick={toggleRecording}>🎙️ 답변 시작</button>
              ) : (
                <button className="mi-mic-btn stop" onClick={toggleRecording}>⏹️ 답변 완료</button>
              )}
              <p className="mi-status-text">
                {step === 'listening' ? "AI가 듣고 있습니다..." : "버튼을 눌러 답변하세요"}
              </p>
            </div>
          </div>
        )}

        {/* 화면 4: 답변 사이 대기 */}
        {step === 'processing' && (
          <div className="mi-card loading-card">
            <div className="mi-spinner-blue"></div>
            <h3>답변 저장 중...</h3>
          </div>
        )}

        {/* 화면 5: AI 평가 중 */}
        {step === 'ai_evaluating' && (
          <div className="mi-card loading-card">
            <div className="mi-spinner-blue"></div>
            <h3>AI 면접관이 평가 중입니다...</h3>
            <p>답변의 논리성, 전문성, 자소서와의 일치 여부를 분석합니다.</p>
          </div>
        )}

        {/* 화면 6: DB 저장 중 */}
        {step === 'saving' && (
          <div className="mi-card loading-card">
            <div className="mi-spinner-blue"></div>
            <h3>결과 리포트 저장 중...</h3>
            <p>나의 면접 기록에 점수와 피드백을 기록합니다.</p>
          </div>
        )}

        {/* 화면 7: 최종 결과 */}
        {step === 'result' && (
          <div className="mi-result-card">
            <h2>AI 면접 분석 리포트</h2>
            <div className="mi-score-circle">
              <span className="score">{finalResult.score}</span>
              <span className="label">점</span>
            </div>

            <div className="mi-feedback-detail">
              <div className="mi-fb-item">
                <h4>📋 AI 상세 피드백</h4>
                <p style={{ whiteSpace: "pre-line", textAlign: "left", lineHeight: "1.6" }}>
                  {finalResult.reason}
                </p>
              </div>
            </div>

            <div className="mi-btn-group">
              <button className="mi-btn-retry" onClick={() => window.location.reload()}>
                다시 하기
              </button>
              <button className="mi-btn-confirm" onClick={() => navigate('/jobseeker')}>
                대시보드로 이동
              </button>
            </div>
          </div>
        )}

      </div>
    </BackgroundShell>
  );
};

export default MockInterview;