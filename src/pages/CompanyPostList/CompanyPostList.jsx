import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './CompanyPostList.css'; // 전용 스타일

export default function CompanyPostList() {
  const nav = useNavigate();

  // 실제로는 로그인한 기업의 COMPANY_IDX로 필터링된 JOB_POSTS 데이터를 가져옵니다
  const myPosts = [
    { id: 113, title: '2026년 실리콘밸리 AWS 클라우드 관리자 모집', date: '2025. 12. 08.', views: 382 },
    { id: 114, title: '프론트엔드 개발자 채용', date: '2025. 12. 10.', views: 150 },
  ];

  return (
    <BackgroundShell>
      <div className="cp-list-wrap">
        <header className="cp-header">
          <button className="cp-back" onClick={() => nav("/company-dashboard")}>← 대시보드</button>
          <h2 className="cp-title">내가 올린 채용 공고</h2>
          <button className="cp-add-btn" onClick={() => nav("/helpwanted/create")}>신규 공고 등록</button>
        </header>

        <main className="cp-main">
          {myPosts.map(post => (
            <div key={post.id} className="cp-card" onClick={() => nav(`/postdetail?id=${post.id}`)}>
              <div className="cp-info">
                <h3>{post.title}</h3>
                <p>등록일: {post.date} | 조회수: {post.views}</p>
              </div>
              <div className="cp-arrow">관리하기 〉</div>
            </div>
          ))}
        </main>
      </div>
    </BackgroundShell>
  );
}