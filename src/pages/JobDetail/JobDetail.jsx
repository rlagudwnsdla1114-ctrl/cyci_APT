import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './JobDetail.css'; // 새로워진 CSS 적용

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 페이지 최상단으로 스크롤 이동 (상세 페이지 진입 시 필수 UX)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="job-detail-wrapper">
      <div className="job-detail-container">
        {/* --- 1. 상단 네비게이션 및 헤더 --- */}
        <div className="detail-header">
          <button className="btn-back-text" onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button>
          <div className="company-info">
            <span className="company-name">(주)혁신테크</span>
          </div>
          <h1 className="job-title">백엔드 개발자 (Spring Boot / Java)</h1>
          <div className="job-meta-tags">
            <span className="meta-tag">서울 강남구</span>
            <span className="meta-tag">경력 1~3년</span>
            <span className="meta-tag active">마감임박</span>
          </div>
        </div>

        <hr className="divider" />

        {/* --- 2. 상세 내용 본문 (구조화된 정보) --- */}
        <div className="detail-body">
          <section className="content-section">
            <h3>이런 일을 합니다 (주요 업무)</h3>
            <ul>
              <li>Spring Boot 기반의 대규모 트래픽 처리 백엔드 시스템 설계 및 개발</li>
              <li>MSA(Microservices Architecture) 기반의 서비스 구축 및 운영</li>
              <li>Legacy 시스템을 현대적인 아키텍처로 개선</li>
              <li>RESTful API 설계 및 문서화 (Swagger 활용)</li>
            </ul>
          </section>

          <section className="content-section">
            <h3>이런 분을 찾습니다 (자격 요건)</h3>
            <ul>
              <li>Java 언어에 대한 깊은 이해가 있으신 분</li>
              <li>Spring Framework (Boot, MVC, Data JPA) 능숙하게 사용 가능하신 분</li>
              <li>RDBMS (MySQL, MariaDB 등) 설계 및 쿼리 튜닝 경험이 있으신 분</li>
              <li>Git을 활용한 협업에 익숙하신 분</li>
            </ul>
          </section>

          <section className="content-section">
            <h3>기술 스택 (Tech Stack)</h3>
            <div className="skill-tags">
              <span className="skill-badge">Java</span>
              <span className="skill-badge">Spring Boot</span>
              <span className="skill-badge">MySQL</span>
              <span className="skill-badge">AWS</span>
              <span className="skill-badge">Docker</span>
              <span className="skill-badge">Redis</span>
            </div>
          </section>
        </div>
      </div>

      {/* --- 3. 하단 액션 버튼 (요청하신 스타일) --- */}
      <div className="action-footer-bar">
        <div className="action-button-group-fixed">
          <button className="btn-apply-blue">지원하기</button>
          <button className="btn-bookmark-gray">관심공고</button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;