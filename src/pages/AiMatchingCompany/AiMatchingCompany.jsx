import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import './AiMatching.css';

const AiMatchingCompany = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchMyPosts = async () => {
      const res = await api.post('/api/ai/JobPostsList'); 
      setJobPosts(res.data);
      if (res.data.length > 0) setSelectedPost(res.data[0].job_POSTS_IDX);
    };
    fetchMyPosts();
  }, []);

  const handleSearch = async () => {
    if (!selectedPost) return alert("공고를 선택해주세요.");
    setIsLoading(true);
    const res = await api.get(`/api/ai/selectComMatch?jobPostsIdx=${selectedPost}`);
    setApplicants(res.data);
    setCurrentPage(1);
    setIsLoading(false);
  };

  const currentItems = applicants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="match-page">
      <div className="match-header">
        <h2>👥 회사 공고 적합 인재 리포트</h2>
        <div className="search-bar-container">
          <select value={selectedPost} onChange={(e) => setSelectedPost(e.target.value)}>
            <option value="">공고 선택</option>
            {jobPosts.map(post => (
              <option key={post.job_POSTS_IDX} value={post.job_POSTS_IDX}>{post.title}</option>
            ))}
          </select>
          <button onClick={handleSearch} disabled={isLoading}>인재 검색</button>
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
              <th>상세보기</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? currentItems.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1 + (currentPage - 1) * 10}</td>
                <td className="bold-blue">{item.name}</td>
                <td>
                  <div className="skill-tag-wrap">
                    {item.keySkill?.split(',').map(s => <span key={s} className="s-badge">{s.trim()}</span>)}
                  </div>
                </td>
                <td>{item.matchRate}%</td>
                <td>{item.matchDate}</td>
                <td><button className="btn-contact">상세보기</button></td>
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