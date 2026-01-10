import React, { useState, useEffect } from 'react';
import './AiMatching.css';

const AiMatchingCompany = () => {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // 실제 구현 시: axios.get('/api/matching/company/history')...
    const dummyData = Array.from({ length: 20 }, (_, i) => ({
      m_idx: 500 - i,
      u_name: `지원자 ${String.fromCharCode(65 + i)}`, // 지원자명 (A, B, C...)
      u_skills: ['Java', 'Spring', 'MySQL', 'React'].slice(0, Math.floor(Math.random() * 3) + 2),
      job_cate: '서버 개발자',
      m_rate: 88 - i,
      m_date: '2026-01-10',
      u_status: i % 2 === 0 ? '검토중' : '대기'
    }));
    setApplicants(dummyData);
  }, []);

  const currentItems = applicants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="match-page">
      <div className="match-header">
        <h2>👥 회사 공고 적합 인재 리포트</h2>
        <p>현재 채용 중인 직무에 매칭된 우수 지원자 리스트입니다.</p>
      </div>

      <div className="match-table-box">
        <table className="match-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>보유 기술</th>
              <th>매칭 직무</th>
              <th>적합도</th>
              <th>분석일</th>
              <th>인재관리</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={item.m_idx}>
                <td>{idx + 1 + (currentPage - 1) * 10}</td>
                <td className="bold-blue">{item.u_name}</td>
                <td>
                  <div className="skill-tag-wrap">
                    {item.u_skills.map(s => <span key={s} className="s-badge">{s}</span>)}
                  </div>
                </td>
                <td>{item.job_cate}</td>
                <td>
                  <div className="rate-container">
                    <span className="rate-val" style={{ color: '#2ecc71' }}>{item.m_rate}%</span>
                    <div className="rate-bar-bg"><div className="rate-bar-fill green" style={{ width: `${item.m_rate}%` }}></div></div>
                  </div>
                </td>
                <td>{item.m_date}</td>
                <td><button className="btn-contact">연락하기</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="match-pagination">
        <button className={currentPage === 1 ? 'active' : ''} onClick={() => setCurrentPage(1)}>1</button>
        <button className={currentPage === 2 ? 'active' : ''} onClick={() => setCurrentPage(2)}>2</button>
      </div>
    </div>
  );
};

export default AiMatchingCompany;