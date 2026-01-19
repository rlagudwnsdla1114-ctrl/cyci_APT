import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api/api';
import BackgroundShell from '../../components/BackgroundShell';
import './ApplicantManagement.css';

export default function ApplicantManagement() {
  const nav = useNavigate();
  const location = useLocation();

  const [myJobPosts, setMyJobPosts] = useState([]);
  const [selectedJobPost, setSelectedJobPost] = useState(null);

  const [statusFilter, setStatusFilter] = useState('전체');
  const [applicants, setApplicants] = useState([]);

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // 공고 상세 보기(구직자 상세 라우트와 동일하면 그대로)
  const handleViewJobPost = (jobPostsIdx) => {
    console.log("view job post:", jobPostsIdx);
    nav(`/postdetail/${jobPostsIdx}`);
  };

  const loadJobPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await api.get('/api/company/management/jobposts');
      const list = res.data?.data ?? res.data ?? [];
      setMyJobPosts(Array.isArray(list) ? list : []);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.log(e);
      alert('공고 목록 불러오기 실패');
      return [];
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadApplicants = async (jobPostsIdx, filter) => {
    if (!jobPostsIdx) return;
    try {
      setLoadingApplicants(true);
      const params = {};
      if (filter && filter !== '전체') params.status = filter;

      const res = await api.get(`/api/company/management/jobposts/${jobPostsIdx}/applicants`, { params });
      const list = res.data?.data ?? res.data ?? [];
      setApplicants(Array.isArray(list) ? list : []);
    } catch (e) {
      console.log(e);
      alert('지원자 목록 불러오기 실패');
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  // 최초 로드: 내 공고 불러오고, (state로 넘어온 jobPostsIdx 있으면) 그거 선택
  useEffect(() => {
    (async () => {
      const list = await loadJobPosts();

      const goJobPostsIdx = location.state?.jobPostsIdx; // 다른 페이지에서 nav('/management', {state:{jobPostsIdx:3}}) 가능
      let initial = null;

      if (goJobPostsIdx) {
        initial = list.find((p) => p.jobPostsIdx === goJobPostsIdx) ?? null;
      }
      if (!initial && list.length > 0) initial = list[0];

      if (initial) {
        setSelectedJobPost(initial);
        setStatusFilter('전체');
        await loadApplicants(initial.jobPostsIdx, '전체');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJobPostSelect = async (jobPost) => {
    setSelectedJobPost(jobPost);
    setStatusFilter('전체');
    await loadApplicants(jobPost.jobPostsIdx, '전체');
  };

  const handleFilterClick = async (filter) => {
    setStatusFilter(filter);
    if (!selectedJobPost) return;
    await loadApplicants(selectedJobPost.jobPostsIdx, filter);
  };

  const handleStatusChange = async (jobseekerApplicantIdx, newStatus) => {
    try {
      await api.patch(`/api/company/management/applicants/${jobseekerApplicantIdx}/status`, { status: newStatus });
      if (selectedJobPost) await loadApplicants(selectedJobPost.jobPostsIdx, statusFilter);
      // 지원자 수는 SCRAP 제외 count라 상태 변경만으로는 변동 없지만, 필요하면 공고 목록도 갱신 가능
      // await loadJobPosts();
    } catch (e) {
      console.log(e);
      alert('상태 변경 실패');
    }
  };

const handleViewResume = (jobseekerApplicantIdx) => {
  nav(`/company/management/applicants/${jobseekerApplicantIdx}/resume`, {
    state: { jobPostsIdx: selectedJobPost?.jobPostsIdx }
  });
};

  const handleContact = (email, phone) => {
    // 간단 연락(원하면 모달/쪽지 기능으로 바꾸기)
    const choice = window.confirm('메일로 연락할까요?\n취소를 누르면 전화로 이동합니다.');
    if (choice) window.location.href = `mailto:${email}`;
    else window.location.href = `tel:${phone}`;
  };

  return (
    <BackgroundShell>
      <div className="am-wrap">
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

            <aside className="am-sidebar">
              <h2 className="am-sidebarTitle">내 채용공고</h2>

              {loadingPosts && <div style={{ padding: 12 }}>불러오는 중...</div>}

              <div className="am-jobPostList">
                {myJobPosts.map(jobPost => (
                  <div
                    key={jobPost.jobPostsIdx}
                    className={`am-jobPostCard ${selectedJobPost?.jobPostsIdx === jobPost.jobPostsIdx ? 'active' : ''}`}
                    onClick={() => handleJobPostSelect(jobPost)}
                  >
                    <div className="am-jobPostHeader">
                      <span className={`am-statusBadge ${jobPost.status === '진행중' ? 'active' : 'closed'}`}>
                        {jobPost.status}
                      </span>
                      <span className="am-applicantCount">{jobPost.applicants ?? 0}명 지원</span>
                    </div>

                    <h3 className="am-jobPostTitle">{jobPost.title}</h3>
                    <div className="am-jobPostMeta">모집인원: {jobPost.recruitCount ?? 0}명</div>

                    {/* 옵션: 공고보기 버튼 (카드 클릭과 분리) */}
                    <div className="am-jobPostActions">
                      <button
                        className="am-miniBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewJobPost(jobPost.jobPostsIdx);
                        }}
                      >
                        공고 보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!loadingPosts && myJobPosts.length === 0 && (
                <div style={{ padding: 16, opacity: 0.7 }}>등록된 공고가 없습니다.</div>
              )}
            </aside>

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
                      <p className="am-subtitle">총 {applicants.length}명의 지원자가 있습니다.</p>
                    </div>

                    <div className="am-headerRight">
                      <button className="am-pillBtn" onClick={() => handleViewJobPost(selectedJobPost.jobPostsIdx)}>
                        공고 보기
                      </button>

                      <div className="am-filters">
                        {['전체', '신규', '검토중', '최종'].map(status => (
                          <button
                            key={status}
                            className={`am-filterBtn ${statusFilter === status ? 'active' : ''}`}
                            onClick={() => handleFilterClick(status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {loadingApplicants && <div style={{ padding: 12 }}>불러오는 중...</div>}

                  {!loadingApplicants && applicants.length === 0 ? (
                    <div className="am-empty">
                      <div className="am-emptyIcon">📋</div>
                      <p className="am-emptyText">해당 상태의 지원자가 없습니다.</p>
                    </div>
                  ) : (
                    <div className="am-applicantList">
                      {applicants.map(applicant => (
                        <div key={applicant.jobseekerApplicantIdx} className="am-applicantCard">
                          <div className="am-applicantHeader">
                            <div className="am-applicantInfo">
                              <h3 className="am-applicantName">{applicant.name}</h3>
                              <div className="am-applicantMeta">
                                <span>지원일: {applicant.appliedDate}</span>
                              </div>
                            </div>

                            {/* matchScore/skills/career/education은 지금 DB조회에 없어서 일단 비움(원하면 join해서 내려주면 됨) */}
                            <div className="am-applicantScore" style={{ opacity: 0.5 }}>
                              <div className="am-scoreCircle">
                                <span className="am-scoreValue">-</span>
                                <span className="am-scoreLabel">점</span>
                              </div>
                            </div>
                          </div>

                          <div className="am-applicantContact">
                            <div className="am-contactInfo">
                              <span>📧 {applicant.email}</span>
                              <span>📱 {applicant.phone}</span>
                            </div>

                            <div className="am-statusSelect">
                              <select
                                value={applicant.status ?? '신규'}
                                onChange={(e) => handleStatusChange(applicant.jobseekerApplicantIdx, e.target.value)}
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
                              onClick={() => handleViewResume(applicant.jobseekerApplicantIdx)}
                            >
                              이력서 상세 보기
                            </button>

                            <button
                              className="am-actionBtn secondary"
                              onClick={() => handleContact(applicant.email, applicant.phone)}
                            >
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
