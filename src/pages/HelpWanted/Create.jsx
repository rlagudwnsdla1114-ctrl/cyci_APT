import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './Create.css';

export default function Create() {
  const nav = useNavigate();
  
  // ✅ DB 컬럼(JOB_POSTS)에 맞춰 상태 초기화
  const [form, setForm] = useState({
    title: '',              // TITLE (공고 제목)
    recruitCount: '',       // RECRUIT_COUNT (모집 인원)
    employmentType: '',     // EMPLOYMENT_TYPE (고용 형태: 정규직, 계약직 등)
    salary: '',             // SALARY (급여)
    workTime: '',           // WORK_TIME (근무 시간)
    career: '',             // CAREER (경력: 신입, 경력, 무관)
    education: '',          // EDUCATION (학력)
    techStack: '',          // TECH_STACK (기술 스택)
    applicationPeriod: '',  // APPLICATION_PERIOD (접수 기간)
    attachFile: null        // ATTACH_FILE (첨부 파일)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, attachFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("전송할 데이터:", form);
    
    // TODO: 여기서 백엔드 API로 form 데이터를 전송하세요.
    // axios.post('/api/job-posts', formData) ...
    
    alert('구인광고가 등록되었습니다!');
    nav('/helpwanted');
  };

  return (
    <BackgroundShell>
      <div className="rc-wrap">
        <div className="rc-simple-header">
          <span className="rc-page-label">공고 등록</span>
        </div>

        <main className="rc-main">
          <div className="rc-panel fade-in">
            <h2 className="rc-title">새로운 인재를 찾아보세요</h2>
            <p className="rc-desc">JOB_POSTS 테이블에 저장될 상세 정보를 입력해주세요.</p>

            <form onSubmit={handleSubmit}>
              
              {/* 1. 공고 제목 (TITLE) */}
              <div className="rc-field">
                <label>공고 제목</label>
                <input 
                  className="rc-input" 
                  name="title"
                  placeholder="예: [신입/경력] 프론트엔드 개발자 모집" 
                  value={form.title} 
                  onChange={handleChange} 
                  required
                />
              </div>

              <div className="rc-row">
                {/* 2. 모집 인원 (RECRUIT_COUNT) */}
                <div className="rc-field half">
                  <label>모집 인원</label>
                  <input 
                    type="number"
                    className="rc-input" 
                    name="recruitCount"
                    placeholder="예: 0 (명)" 
                    value={form.recruitCount} 
                    onChange={handleChange} 
                  />
                </div>

                {/* 3. 고용 형태 (EMPLOYMENT_TYPE) */}
                <div className="rc-field half">
                  <label>고용 형태</label>
                  <select 
                    className="rc-input" 
                    name="employmentType" 
                    value={form.employmentType} 
                    onChange={handleChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="정규직">정규직</option>
                    <option value="계약직">계약직</option>
                    <option value="인턴">인턴</option>
                    <option value="프리랜서">프리랜서</option>
                  </select>
                </div>
              </div>

              <div className="rc-row">
                 {/* 4. 급여 (SALARY) */}
                <div className="rc-field half">
                  <label>급여</label>
                  <input 
                    className="rc-input" 
                    name="salary"
                    placeholder="예: 회사내규에 따름 or 3,500만원" 
                    value={form.salary} 
                    onChange={handleChange} 
                  />
                </div>

                {/* 5. 근무 시간 (WORK_TIME) */}
                <div className="rc-field half">
                  <label>근무 시간</label>
                  <input 
                    className="rc-input" 
                    name="workTime"
                    placeholder="예: 09:00 ~ 18:00" 
                    value={form.workTime} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="rc-row">
                {/* 6. 경력 (CAREER) */}
                <div className="rc-field half">
                  <label>경력 요건</label>
                  <select 
                    className="rc-input" 
                    name="career" 
                    value={form.career} 
                    onChange={handleChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="신입">신입</option>
                    <option value="경력">경력</option>
                    <option value="경력무관">경력무관</option>
                  </select>
                </div>

                {/* 7. 학력 (EDUCATION) */}
                <div className="rc-field half">
                  <label>학력 요건</label>
                  <select 
                    className="rc-input" 
                    name="education" 
                    value={form.education} 
                    onChange={handleChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="학력무관">학력무관</option>
                    <option value="고등학교 졸업">고등학교 졸업</option>
                    <option value="대학(2,3년) 졸업">대학(2,3년) 졸업</option>
                    <option value="대학교(4년) 졸업">대학교(4년) 졸업</option>
                    <option value="대학원 석사 졸업">대학원 석사 졸업</option>
                  </select>
                </div>
              </div>

              {/* 8. 접수 기간 (APPLICATION_PERIOD) */}
              <div className="rc-field">
                <label>접수 기간</label>
                <input 
                  className="rc-input" 
                  name="applicationPeriod"
                  placeholder="예: 2024-05-01 ~ 2024-05-31" 
                  value={form.applicationPeriod} 
                  onChange={handleChange} 
                />
              </div>

              {/* 9. 기술 스택 (TECH_STACK) */}
              <div className="rc-field">
                <label>기술 스택 (자격 요건 및 우대 사항)</label>
                <textarea 
                  className="rc-textarea" 
                  name="techStack"
                  placeholder="예: React, Node.js, AWS 사용 가능자 우대" 
                  value={form.techStack} 
                  onChange={handleChange} 
                  rows={5}
                />
              </div>

              {/* 10. 첨부 파일 (ATTACH_FILE) */}
              <div className="rc-field">
                <label>상세 공고 이미지 또는 파일</label>
                <div className="rc-fileBox">
                  <input 
                    type="file" 
                    id="file" 
                    name="attachFile"
                    onChange={handleFileChange}
                    hidden 
                  />
                  <label htmlFor="file" className="rc-fileBtn">파일 선택</label>
                  <span className="rc-fileInfo">
                    {form.attachFile ? form.attachFile.name : "공고문 파일 (PDF, IMG)"}
                  </span>
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