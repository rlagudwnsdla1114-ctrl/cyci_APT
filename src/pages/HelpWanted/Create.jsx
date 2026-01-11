import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './Create.css';

export default function Create() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 1. URL 파라미터에서 id가 있는지 확인 (수정 모드 판별)
  const editId = searchParams.get("id");
  const isEditMode = !!editId;

  // ✅ DB 컬럼(JOB_POSTS)에 맞춰 상태 초기화
  const [form, setForm] = useState({
    title: '',             // TITLE (공고 제목)
    recruitCount: '',       // RECRUIT_COUNT (모집 인원)
    employmentType: '',     // EMPLOYMENT_TYPE (고용 형태)
    salary: '',             // SALARY (급여)
    workTime: '',           // WORK_TIME (근무 시간)
    career: '',             // CAREER (경력)
    education: '',          // EDUCATION (학력)
    techStack: '',          // TECH_STACK (기술 스택)
    applicationPeriod: '',  // APPLICATION_PERIOD (접수 기간)
    attachFile: null        // ATTACH_FILE (첨부 파일)
  });

  // 2. 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode) {
      // 실제 구현 시: axios.get(`/api/job-posts/${editId}`).then(res => setForm(res.data))
      console.log(`${editId}번 공고 데이터를 불러와서 폼에 채웁니다.`);
      
      // 테스트용 예시 데이터 세팅 (실제로는 서버에서 가져온 값으로 대체)
      setForm({
        title: '2026년 실리콘밸리 AWS 클라우드 관리자 모집',
        recruitCount: '5',
        employmentType: '정규직',
        salary: '6000만원 이상',
        workTime: '09:00 ~ 18:00',
        career: '경력',
        education: '대학교(4년) 졸업',
        techStack: 'AWS, Docker, Kubernetes',
        applicationPeriod: '2025-12-31까지',
        attachFile: null
      });
    }
  }, [isEditMode, editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, attachFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      // 수정 API 호출 (PUT /api/job-posts/${editId})
      console.log("수정 데이터:", form);
      alert('구인광고가 수정되었습니다!');
    } else {
      // 등록 API 호출 (POST /api/job-posts)
      console.log("등록 데이터:", form);
      alert('구인광고가 등록되었습니다!');
    }
    
    // 완료 후 기업용 공고 관리 리스트로 이동
    nav('/company/helpwanted'); 
  };

  return (
    <BackgroundShell>
      <div className="rc-wrap">
        <div className="rc-simple-header">
          {/* 모드에 따라 상단 라벨 변경 */}
          <span className="rc-page-label">{isEditMode ? "공고 수정" : "공고 등록"}</span>
        </div>

        <main className="rc-main">
          <div className="rc-panel fade-in">
            {/* 모드에 따라 타이틀 변경 */}
            <h2 className="rc-title">
              {isEditMode ? "기존 공고를 수정합니다" : "새로운 인재를 찾아보세요"}
            </h2>
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
                <button type="button" className="rc-btn cancel" onClick={() => nav(-1)}>취소</button>
                {/* 모드에 따라 버튼 텍스트 변경 */}
                <button type="submit" className="rc-btn submit">
                  {isEditMode ? "수정 완료" : "공고 등록하기"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}