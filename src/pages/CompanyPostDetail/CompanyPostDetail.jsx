import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import '../HelpWanted/Detail.css'; 

export default function CompanyPostDetail() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  // 1. URL 쿼리 파라미터에서 id 가져오기 (?id=113)
  const id = searchParams.get("id");

  // 예시 데이터 (실제로는 useEffect 내에서 id를 이용해 API 호출을 해야 합니다)
  const post = {
    id: id || 113,
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
            <button className="rd-back" onClick={() => nav("/company/helpwanted")}>← 목록으로</button>
            <div className="rd-brand">공고 관리 상세</div>
            <div style={{width: 80}}></div>
          </div>
        </header>

        <main className="rd-main">
          <div className="rd-paper">
            <div className="rd-top">
              <span className="rd-badge">관리중</span>
              <h1 className="rd-title">{post.title}</h1>
              <div className="rd-meta">
                <span>{post.company}</span>
                <span className="rd-sep">·</span>
                <span>조회 {post.views}</span>
              </div>
            </div>

            <div className="rd-divider" />

            <div className="rd-body">
              {post.body.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            <div className="rd-actions">
              {/* 2. 상단에서 정의한 id 변수를 사용하여 수정 페이지로 연결 */}
              <button 
                className="rd-btn primary" 
                onClick={() => nav(`/helpwanted/create?id=${id}`)}
              >
                이 공고 수정하기
              </button>
              <button className="rd-btn secondary" onClick={() => nav("/company/helpwanted")}>목록으로</button>
            </div>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}