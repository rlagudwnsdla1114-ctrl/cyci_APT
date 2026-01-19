import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './MockInterview.css';
import { api } from "../../api/api";

const MockInterview = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState('intro'); 
  
  const [interviewId, setinterviewId] = useState(null);
  const [questions, setQusetions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const [isListening, setisListening] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const recordStartedAtRef = useRef(null);

  const [finalResult, setFinalResult] = useState({score: 0, reason: ''});

  const startInterview = async () => {
  setStep('ai_generating');

  const response = await api.post("/api/ai/InterviewQues");
    const { interviewId, questions } = response.data;

    const normalized = (questions || []).map((q, idx) => {
      if (typeof q === "string") return { id: idx + 1, text: q };
      if (q && typeof q === "object") {
        return {
          id: Number.isInteger(q.id) ? q.id : (idx + 1),
          text: String(q.text ?? q.question ?? q.q ?? ""),
        };
      }
      return { id: idx + 1, text: String(q ?? "") };
    });

    setinterviewId(interviewId);
    setQusetions(normalized);
    setCurrentQIndex(0);
    setStep("question");
  };

  const toggleRecording = async () => {
    if(isListening) {
      stopRecordingAndNext();
    }
    else {
      startRecording();
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    recordStartedAtRef.current = Date.now();

    mediaRecorderRef.current.ondataavailable = (e) => {
      if(e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current,{type: 'audio/mp3'});
      submitAnswerToBackend(audioBlob);
    };

    mediaRecorderRef.current.start();
    setisListening(true);
    setStep('listening');
  }

  const stopRecordingAndNext = () => {
    if(mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setisListening(false);
      setStep('processing')
    }
  };

  const submitAnswerToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append('interviewId',interviewId);

    const qId = currentQIndex + 1;
    formData.append("questionId", String(qId));

    formData.append('silenceDuration', String(0));
    formData.append('speakingDuration', String(0));

    formData.append('audioFile', audioBlob, 'answer.mp3');

    const response = await api.post("/api/ai/InterviewProcess", formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    });
    handleVisualSteps(response.data);
  };


  const handleVisualSteps = (feedbackData) => {
    setTimeout(() => {
      setStep('ai_evaluating');
    }, 1000);
    setTimeout(() => {
      if(currentQIndex < questions.length -1) {
        setCurrentQIndex(prev => prev + 1);
        setStep('question');
      } else {
        setFinalResult({
          score: feedbackData.totalScore||80,
          reason: feedbackData.feedback || "결과를 불러올 수 없습니다"
        });
        setStep('saving');

        setTimeout(() => {
          setStep('result');
        }, 1500);
      }
    }, 3500);
  }


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
              <h2 className="mi-q-text">"{questions[currentQIndex]?.text || ""}"</h2>
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