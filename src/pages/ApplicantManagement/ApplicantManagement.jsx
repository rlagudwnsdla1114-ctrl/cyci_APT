import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './ApplicantManagement.css';

export default function ApplicantManagement() {
  const nav = useNavigate();
  const [selectedJobPost, setSelectedJobPost] = useState(null);

  // 내가 작성한 채용공고 목록 (실제로는 API에서 가져와야 함)
  const myJobPosts = [
    {
      id: 101,
      title: '[신입/경력] 프론트엔드 개발자 모집',
      recruitCount: 2,
      applicants: 14,
      status: '진행중'
    },
    {
      id: 102,
      title: '[경력] 백엔드 개발자 채용',
      recruitCount: 1,
      applicants: 8,
      status: '진행중'
    },
    {
      id: 103,
      title: '[인턴] UI/UX 디자이너 모집',
      recruitCount: 3,
      applicants: 23,
      status: '마감'
    }
  ];

  // 지원자 데이터 (공고 ID별로 매핑, 실제로는 API에서 가져와야 함)
  const applicantsByJob = {
    101: [
      {
        id: 1,
        name: '김철수',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        appliedDate: '2025.01.20',
        status: '신규',
        matchScore: 95,
        skills: ['React', 'TypeScript', 'Next.js'],
        career: '3년',
        education: '대학교(4년) 졸업',
        resumeUrl: '/resume/1'
      },
      {
        id: 2,
        name: '이영희',
        email: 'lee@example.com',
        phone: '010-2345-6789',
        appliedDate: '2025.01.19',
        status: '검토중',
        matchScore: 88,
        skills: ['React', 'Vue.js', 'JavaScript'],
        career: '2년',
        education: '대학교(4년) 졸업',
        resumeUrl: '/resume/2'
      },
      {
        id: 3,
        name: '박민수',
        email: 'park@example.com',
        phone: '010-3456-7890',
        appliedDate: '2025.01.18',
        status: '검토중',
        matchScore: 82,
        skills: ['React', 'Redux', 'Node.js'],
        career: '1년',
        education: '대학교(4년) 졸업',
        resumeUrl: '/resume/3'
      },
      {
        id: 4,
        name: '최지영',
        email: 'choi@example.com',
        phone: '010-4567-8901',
        appliedDate: '2025.01.17',
        status: '최종',
        matchScore: 90,
        skills: ['React', 'TypeScript', 'GraphQL'],
        career: '4년',
        education: '대학교(4년) 졸업',
        resumeUrl: '/resume/4'
      }
    ],
    102: [
      {
        id: 5,
        name: '정대현',
        email: 'jung@example.com',
        phone: '010-5678-9012',
        appliedDate: '2025.01.21',
        status: '신규',
        matchScore: 92,
        skills: ['Java', 'Spring Boot', 'MySQL'],
        career: '5년',
        education: '대학교(4년) 졸업',
        resumeUrl: '/resume/5'
      },
      {
        id: 6,
        name: '강수진',
        email: 'kang@example.com',
        phone: '010-6789-0123',
        appliedDate: '2025.01.20',
        status: '검토중',
        matchScore: 85,
        skills: ['Java', 'Spring', 'PostgreSQL'],
        career: '3년',
        education: '대학교(4년) 졸업',
        resumeUrl: '/resume/6'
      }
    ],
    103: [
      {
        id: 7,
        name: '윤서연',
        email: 'yoon@example.com',
        phone: '010-7890-1234',
        appliedDate: '2025.01.05',
        status: '최종',
        matchScore: 88,
        skills: ['Figma', 'Sketch', 'Adobe XD'],
        career: '신입',
        education: '대학교(4년) 졸업',
        resumeUrl: '/resume/7'
      }
    ]
  };

  const [statusFilter, setStatusFilter] = useState('전체');

  // 선택된 공고의 지원자 목록
  const currentApplicants = selectedJobPost ? (applicantsByJob[selectedJobPost.id] || []) : [];

  // 상태별 필터링
  const filteredApplicants = statusFilter === '전체' 
    ? currentApplicants 
    : currentApplicants.filter(applicant => applicant.status === statusFilter);

  const handleJobPostSelect = (jobPost) => {
    setSelectedJobPost(jobPost);
    setStatusFilter('전체'); // 공고 변경 시 필터 초기화
  };

  const handleViewResume = (resumeUrl) => {
    // 이력서 상세 보기 (추후 구현)
    alert(`이력서 상세 페이지: ${resumeUrl}\n(추후 구현 예정)`);
  };

  const handleStatusChange = (applicantId, newStatus) => {
    // 지원자 상태 변경 (실제로는 API 호출)
    console.log(`지원자 ${applicantId}의 상태를 ${newStatus}로 변경`);
    alert(`지원자 상태가 "${newStatus}"로 변경되었습니다.`);
  };

  return (
    <BackgroundShell>
      <div className="am-wrap">
        {/* 헤더 */}
        <header className="am-header">
          <div className="am-headerInner">
            <div className="am-brand" onClick={() => nav("/company-dashboard")}>
              <div className="am-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" opacity=".9"/>
                  <path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" opacity=".9"/>
                </svg>
              </div>
              <div className="am-brandText">잡매치 · 지원자 관리</div>
            </div>
            <div className="am-actions">
              <button className="am-pillBtn" onClick={() => nav("/company-dashboard")}>
                대시보드로
              </button>
            </div>
          </div>
        </header>

        <main className="am-main">
          <div className="am-container">
            {/* 좌측: 공고 선택 */}
            <aside className="am-sidebar">
              <h2 className="am-sidebarTitle">내 채용공고</h2>
              <div className="am-jobPostList">
                {myJobPosts.map(jobPost => (
                  <div
                    key={jobPost.id}
                    className={`am-jobPostCard ${selectedJobPost?.id === jobPost.id ? 'active' : ''}`}
                    onClick={() => handleJobPostSelect(jobPost)}
                  >
                    <div className="am-jobPostHeader">
                      <span className={`am-statusBadge ${jobPost.status === '진행중' ? 'active' : 'closed'}`}>
                        {jobPost.status}
                      </span>
                      <span className="am-applicantCount">{jobPost.applicants}명 지원</span>
                    </div>
                    <h3 className="am-jobPostTitle">{jobPost.title}</h3>
                    <div className="am-jobPostMeta">
                      모집인원: {jobPost.recruitCount}명
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* 우측: 지원자 목록 */}
            <section className="am-content">
              {!selectedJobPost ? (
                <div className="am-empty">
                  <div className="am-emptyIcon">👥</div>
                  <p className="am-emptyText">좌측에서 채용공고를 선택해주세요.</p>
                  <p className="am-emptySubtext">선택한 공고의 지원자 목록이 여기에 표시됩니다.</p>
                </div>
              ) : (
                <>
                  <div className="am-contentHeader">
                    <div>
                      <h1 className="am-title">{selectedJobPost.title}</h1>
                      <p className="am-subtitle">총 {currentApplicants.length}명의 지원자가 있습니다.</p>
                    </div>
                    <div className="am-filters">
                      {['전체', '신규', '검토중', '최종'].map(status => (
                        <button
                          key={status}
                          className={`am-filterBtn ${statusFilter === status ? 'active' : ''}`}
                          onClick={() => setStatusFilter(status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredApplicants.length === 0 ? (
                    <div className="am-empty">
                      <div className="am-emptyIcon">📋</div>
                      <p className="am-emptyText">해당 상태의 지원자가 없습니다.</p>
                    </div>
                  ) : (
                    <div className="am-applicantList">
                      {filteredApplicants.map(applicant => (
                        <div key={applicant.id} className="am-applicantCard">
                          <div className="am-applicantHeader">
                            <div className="am-applicantInfo">
                              <h3 className="am-applicantName">{applicant.name}</h3>
                              <div className="am-applicantMeta">
                                <span>경력: {applicant.career}</span>
                                <span>•</span>
                                <span>학력: {applicant.education}</span>
                                <span>•</span>
                                <span>지원일: {applicant.appliedDate}</span>
                              </div>
                            </div>
                            <div className="am-applicantScore">
                              <div className="am-scoreCircle">
                                <span className="am-scoreValue">{applicant.matchScore}</span>
                                <span className="am-scoreLabel">점</span>
                              </div>
                            </div>
                          </div>

                          <div className="am-applicantSkills">
                            {applicant.skills.map((skill, idx) => (
                              <span key={idx} className="am-skillTag">{skill}</span>
                            ))}
                          </div>

                          <div className="am-applicantContact">
                            <div className="am-contactInfo">
                              <span>📧 {applicant.email}</span>
                              <span>📱 {applicant.phone}</span>
                            </div>
                            <div className="am-statusSelect">
                              <select
                                value={applicant.status}
                                onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                                className={`am-statusSelectInput am-status-${applicant.status}`}
                              >
                                <option value="신규">신규</option>
                                <option value="검토중">검토중</option>
                                <option value="최종">최종</option>
                                <option value="불합격">불합격</option>
                              </select>
                            </div>
                          </div>

                          <div className="am-applicantActions">
                            <button 
                              className="am-actionBtn primary"
                              onClick={() => handleViewResume(applicant.resumeUrl)}
                            >
                              이력서 상세 보기
                            </button>
                            <button className="am-actionBtn secondary">
                              연락하기
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}
