import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './Detail.css';

export default function Detail() {
  const nav = useNavigate();
  const post = {
    id: 113,
    title: '2026년 실리콘밸리 AWS 클라우드 관리자 모집',
    company: 'AWS Korea',
    views: 382,
    date: '2025. 12. 08.',
    file: 'AWS경력자_모집_공고문.pdf',
    body: `[주요 업무]\n- AWS 클라우드 인프라 설계 및 운영\n- CI/CD 파이프라인 구축\n- 보안 아키텍처 수립 및 모니터링\n\n[자격 요건]\n- 클라우드 관련 경력 3년 이상\n- Linux/Windows 서버 운영 경험\n- 영어 회화 가능자 (비즈니스 레벨)\n\n[우대 사항]\n- AWS 자격증 보유자 (SA Pro 등)\n- 대규모 트래픽 처리 경험`
  };

  return (
    <BackgroundShell>
      <div className="rd-wrap">
        <header className="rd-header">
          <div className="rd-headerInner">
            <button className="rd-back" onClick={() => nav("/helpwanted")}>← 목록으로</button>
            <div className="rd-brand">채용공고 상세</div>
            <div style={{width: 80}}></div>
          </div>
        </header>

        <main className="rd-main">
          <div className="rd-paper fade-in">
            <div className="rd-top">
              <span className="rd-badge">채용중</span>
              <h1 className="rd-title">{post.title}</h1>
              <div className="rd-meta">
                <span>{post.company}</span>
                <span className="rd-sep">·</span>
                <span>{post.date}</span>
                <span className="rd-sep">·</span>
                <span>조회 {post.views}</span>
              </div>
            </div>

            <div className="rd-divider" />

            <div className="rd-file">
              <span className="rd-fileLabel">첨부파일</span>
              <a href="#" className="rd-fileLink">📄 {post.file} <span className="rd-down">다운로드</span></a>
            </div>

            <div className="rd-body">
              {post.body.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            <div className="rd-actions">
              <button className="rd-btn primary" onClick={() => alert("지원 기능은 준비중입니다.")}>지원하기</button>
              <button className="rd-btn secondary">관심공고 등록</button>
            </div>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}