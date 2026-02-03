import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import './AiMatching.css';

const AiMatchingCompany = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await api.post('/api/ai/JobPostsList');
        
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const validJobPosts = res.data.filter(post => post.jobPostsIdx || post.JobPostsIdx);

          if (validJobPosts.length > 0) {
            setJobPosts(validJobPosts);
            const firstJobPost = validJobPosts[0];
            setSelectedPost(firstJobPost.jobPostsIdx?.toString() || firstJobPost.JobPostsIdx?.toString());
          } else {
            alert("공고 목록에 문제가 있습니다.");
          }
        } else {
          alert("공고 목록이 없습니다.");
        }
      } catch (error) {
        alert("공고 목록 로드 실패");
      }
    };

    fetchMyPosts();
  }, []);

  const handleSearch = () => {
    if (!selectedPost) {
      alert("공고를 선택해주세요.");
      return;
    }

    const jobPostsIdx = parseInt(selectedPost, 10);
    
    api.get(`/api/ai/selectComMatch?jobPostsIdx=${jobPostsIdx}`)
      .then(res => {
        setApplicants(res.data);
        setCurrentPage(1);
      })
      .catch(() => {
        alert("인재 검색에 실패했습니다.");
      });
  };

  const currentItems = applicants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="match-page">
      <div className="match-header">
        <h2>👥 회사 공고 적합 인재 리포트</h2>
        <div className="search-bar-container">
          {jobPosts.length > 0 ? (
            <>
              <select 
                value={selectedPost} 
                onChange={(e) => setSelectedPost(e.target.value)}
              >
                <option value="">공고 선택</option>
                {jobPosts.map((post) => {
                  const jobPostId = post.jobPostsIdx || post.JobPostsIdx || '';
                  return (
                    <option key={jobPostId} value={jobPostId}>
                      {post.title}
                    </option>
                  );
                })}
              </select>
              <button onClick={handleSearch} disabled={isLoading}>인재 검색</button>
            </>
          ) : (
            <p>공고 목록을 불러오는 중입니다...</p>
          )}
        </div>
      </div>

      <div className="match-table-box">
        <table className="match-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>보유 기술</th>
              <th>적합도</th>
              <th>분석일</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? currentItems.map((item, idx) => (
              <tr key={item.jobseekerIdx || item.jobPostsIdx}>
                <td>{idx + 1 + (currentPage - 1) * 10}</td>
                <td className="bold-blue">{item.name}</td>
                <td>
                  <div className="skill-tag-wrap">
                    {item.keySkill ? item.keySkill.split(',').map((s, index) => (
                      <span key={`${s.trim()}-${index}`} className="s-badge">
                        {s.trim()}
                      </span>
                    )) : <span>정보 없음</span>}
                  </div>
                </td>
                <td>{item.comAiReason}</td>
                <td>{item.matchRate}</td>
                <td>{item.matchDate}</td>
              </tr>
            )) : (
              <tr><td colSpan="6">결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AiMatchingCompany;
