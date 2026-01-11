import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AiMatching.css';

const AiMatchingSeeker = () => {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const nav = useNavigate();

  useEffect(() => {
    const dummyData = Array.from({ length: 20 }, (_, i) => ({
      m_idx: 200 - i, // DB 인덱스
      c_name: `(주)혁신테크 ${i + 1}`, // 기업명
      job_pos: '백엔드 신입 개발자', // 지원 직무
      m_rate: 95 - i, // 매칭률
      m_date: '2026-01-10', // 분석일자
      m_status: '확인완료'
    }));
    setMatches(dummyData);
  }, []);

  // 10개씩 페이징 로직
  const currentItems = matches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="match-page">
      <div className="match-header">
        <h2>🔎 나의 AI 기업 매칭 기록</h2>
        <p>나의 역량과 가장 잘 맞는 기업 리스트입니다. (최근 20건)</p>
      </div>

      <div className="match-table-box">
        <table className="match-table">
          <thead>
            <tr>
              <th>순번</th>
              <th>매칭 기업</th>
              <th>적합 직무</th>
              <th>매칭 적합도</th>
              <th>분석일</th>
              <th>상태</th>
              <th>상세분석</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={item.m_idx}>
                <td>{matches.length - ((currentPage - 1) * 10 + idx)}</td>
                <td className="bold-blue">{item.c_name}</td>
                <td>{item.job_pos}</td>
                <td>
                  <div className="rate-container">
                    <span className="rate-val">{item.m_rate}%</span>
                    <div className="rate-bar-bg"><div className="rate-bar-fill" style={{ width: `${item.m_rate}%` }}></div></div>
                  </div>
                </td>
                <td>{item.m_date}</td>
                <td><span className="badge-status">{item.m_status}</span></td>
                <td><button className="btn-detail-view" onClick={() => nav(`/job-detail/${item.m_idx}`)}>공고 보기</button></td>
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

export default AiMatchingSeeker;