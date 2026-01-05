import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './List.css';

const dummyPosts = Array.from({ length: 8 }).map((_, i) => ({
  id: 114 - i,
  company: 'AWS Korea',
  title: `${2026 - Math.floor(i / 3)} 실리콘밸리 AWS 클라우드 관리자 모집 ${i + 1}`,
  tags: ['경력무관', '판교', '정규직'],
  dDay: 'D-12',
  views: Math.floor(Math.random() * 2000),
  date: '2025. 12. 22.'
}));

export default function List() {
  const nav = useNavigate();
  const [filter, setFilter] = useState("전체");

  return (
    <BackgroundShell>
      <div className="rl-wrap">
        {/* 헤더 (고정) */}
        <header className="rl-header">
          <div className="rl-headerInner">
            <div className="rl-brand" onClick={() => nav("/company-dashboard")}>
              <div className="rl-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" /><path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" opacity=".9"/><path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" opacity=".9"/></svg>
              </div>
              <div className="rl-brandText">잡매치 · 채용공고</div>
            </div>
            <div className="rl-actions">
              <button className="rl-pillBtn primary" onClick={() => nav("/helpwanted/create")}>공고 등록</button>
              <button className="rl-pillBtn" onClick={() => nav("/company-dashboard")}>나가기</button>
            </div>
          </div>
        </header>

        <main className="rl-main">
          {/* 타이틀 및 검색 */}
          <div className="rl-top">
            <h1 className="rl-pageTitle">진행 중인 채용공고 <span className="rl-count">{dummyPosts.length}</span></h1>
            <div className="rl-controls">
              <div className="rl-filters">
                {["전체", "개발", "디자인", "기획"].map(f => (
                  <button key={f} className={`rl-filterBtn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
              <div className="rl-searchBox">
                <input type="text" placeholder="직무, 회사명 검색" />
                <button>검색</button>
              </div>
            </div>
          </div>

          {/* 리스트 (카드형) */}
          <div className="rl-list">
            {dummyPosts.map(post => (
              <div key={post.id} className="rl-card" onClick={() => nav(`/helpwanted/${post.id}`)}>
                <div className="rl-cardLeft">
                  <div className="rl-company">{post.company}</div>
                  <h3 className="rl-cardTitle">{post.title}</h3>
                  <div className="rl-tags">
                    {post.tags.map((tag, idx) => <span key={idx} className="rl-tag">{tag}</span>)}
                  </div>
                </div>
                <div className="rl-cardRight">
                  <span className="rl-dDay">{post.dDay}</span>
                  <div className="rl-meta">조회 {post.views} · {post.date}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}