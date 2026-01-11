import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './List.css';

const dummyPosts = Array.from({ length: 8 }).map((_, i) => ({
  id: 114 - i,
  company: i % 2 === 0 ? 'AWS Korea' : 'Google Korea',
  title: `${2026 - Math.floor(i / 3)} 실리콘밸리 클라우드 관리자 모집 ${i + 1}`,
  tags: ['경력무관', '판교', '정규직'],
  dDay: 'D-12',
  views: Math.floor(Math.random() * 2000),
  date: '2025. 12. 22.'
}));

export default function List() {
  const nav = useNavigate();
  const [filter, setFilter] = useState("전체");
  const [tempInput, setTempInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = dummyPosts.filter(post =>
    post.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BackgroundShell>
      <div className="rl-wrap">
        <header className="rl-header">
          <div className="rl-headerInner">
            {/* 구직자 대시보드로 이동하도록 변경 */}
            <div className="rl-brand" onClick={() => nav("/jobseeker")}>
              <div className="rl-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" opacity=".9"/>
                  <path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" opacity=".9"/>
                </svg>
              </div>
              <div className="rl-brandText">잡매치 · 채용공고</div>
            </div>
            <div className="rl-actions">
              {/* 공고 등록 버튼 제거 및 나가기 경로 수정 */}
              <button className="rl-pillBtn" onClick={() => nav("/jobseeker")}>나가기</button>
            </div>
          </div>
        </header>

        <main className="rl-main">
          <div className="rl-top">
            <h1 className="rl-pageTitle">진행 중인 채용공고 <span className="rl-count">{filteredPosts.length}</span></h1>
            <div className="rl-controls">
              <div className="rl-filters">
                {["전체", "개발", "디자인", "기획"].map(f => (
                  <button key={f} className={`rl-filterBtn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
              <div className="rl-searchBox">
                <input 
                  type="text" 
                  placeholder="직무, 회사명 검색" 
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(tempInput)}
                />
                <button onClick={() => setSearchTerm(tempInput)}>검색</button>
              </div>
            </div>
          </div>

          <div className="rl-list">
            {filteredPosts.map(post => (
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