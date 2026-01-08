import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './Create.css';

export default function Create() {
  const nav = useNavigate();
  const [form, setForm] = useState({ view: '', url: '', personnel: '', title: '', employment : '' , personal_history: '', education: '', salary: '', support_period: '', skills: ''});

  

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('구인광고가 등록되었습니다!');
    nav('/helpwanted');
  };

  return (
    <BackgroundShell>
      <div className="rc-wrap">
        {/* 심플 헤더: 텍스트만 좌측 상단 배치 */}
        <div className="rc-simple-header">
          <span className="rc-page-label">공고 등록</span>
        </div>

        <main className="rc-main">
          <div className="rc-panel fade-in">
            <h2 className="rc-title">새로운 인재를 찾아보세요</h2>
            <p className="rc-desc">상세한 직무 내용을 입력할수록 AI 매칭 정확도가 올라갑니다.</p>

            <form onSubmit={handleSubmit}>
              <div className="rc-field">
                <label>공고 제목</label>
                <input 
                  className="rc-input" 
                  placeholder="예: [신입/경력] 프론트엔드 개발자 모집" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                />
              </div>

              <div className="rc-field">
                <label>상세 내용</label>
                <textarea 
                  className="rc-textarea" 
                  placeholder="주요 업무, 자격 요건, 우대 사항 등을 상세히 적어주세요." 
                  value={form.content} 
                  onChange={e => setForm({...form, content: e.target.value})} 
                />
              </div>

              <div className="rc-field">
                <label>첨부 파일</label>
                <div className="rc-fileBox">
                  <input type="file" id="file" hidden />
                  <label htmlFor="file" className="rc-fileBtn">파일 선택</label>
                  <span className="rc-fileInfo">공고문 파일 (PDF, DOCX)</span>
                </div>
              </div>

              <div className="rc-bottom">
                <button type="button" className="rc-btn cancel" onClick={() => nav("/helpwanted")}>취소</button>
                <button type="submit" className="rc-btn submit">공고 등록하기</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}