import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AiMatching.css';
import { api } from '../../api/api';

const AiMatchingSeeker = () => {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const nav = useNavigate();

  useEffect(() => {
    api.get('/api/ai/selectJobMatch')
    .then(res => {
      const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      const cleaned = list.filter(x => x != null);
      console.log("raw:", list);
      console.log("cleaned:", cleaned);

      setMatches(cleaned);
      setCurrentPage(1);
    });
  },[]);
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
            {currentItems.
            filter((item) => item != null)
            .map((item, idx) => (
              <tr key={item.mIdx ?? `${currentPage}-${idx}`}>
                <td>{matches.length - ((currentPage - 1) * 10 + idx)}</td>
                <td className="bold-blue">{item?.cName ?? "-"}</td>
                <td>{item.jobPos}</td>
                <td>
                  <div className="rate-container">
                    <span className="rate-val">{item.mRate}%</span>
                    <div className="rate-bar-bg"><div className="rate-bar-fill" style={{ width: `${item.mRate}%` }}></div></div>
                  </div>
                </td>
                <td>{item.m_date}</td>
                <td><span className="badge-status">{item.mStatus }</span></td>
                <td><button className="btn-detail-view" onClick={() => nav(`/helpwanted/${item.mIdx}`)}>공고 보기</button></td>
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