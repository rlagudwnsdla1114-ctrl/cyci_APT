import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackgroundShell from '../../components/BackgroundShell';
import './TalentProfileDetail.css';

const TalentProfileDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();

  // 실제로는 API에서 id로 데이터를 가져와야 함 (현재는 샘플 데이터)
  const talentProfiles = {
    1: { name: "김철수", job: "프론트엔드 개발자", score: 95, exp: "3년", education: "한국대학교 컴퓨터공학 졸업", skills: ["React", "TypeScript", "Node.js"], intro: "안녕하세요, 사용자 중심의 UI를 고민하는 개발자 김철수입니다.", matchDetail: "해당 지원자는 귀사의 핵심 기술 스택인 React와 TypeScript에 대한 깊은 이해도를 보유하고 있습니다." },
    2: { name: "이영희", job: "UI/UX 디자이너", score: 88, exp: "신입", education: "디자인예술대학교 산업디자인 졸업", skills: ["Figma", "Photoshop", "Illustrator"], intro: "심미성과 기능성을 동시에 잡는 디자이너 이영희입니다.", matchDetail: "회사의 브랜드 톤앤매너와 지원자의 포트폴리오 스타일이 매우 유사하여 즉시 전력감이 가능합니다." }
  };

  const profile = talentProfiles[id] || talentProfiles[1]; // 못찾으면 1번 예시

  return (
    <BackgroundShell>
      <div className="tpd-container">
        <button className="tpd-back" onClick={() => nav(-1)}>← 돌아가기</button>
        
        <div className="tpd-layout">
          {/* 왼쪽: 기본 정보 */}
          <aside className="tpd-sidebar">
            <div className="tpd-profile-img">👤</div>
            <h2 className="tpd-name">{profile.name}</h2>
            <p className="tpd-job-title">{profile.job}</p>
            <div className="tpd-score-circle">
              <span className="tpd-score-num">{profile.score}</span>
              <span className="tpd-score-label">AI 적합도</span>
            </div>
          </aside>

          {/* 오른쪽: 상세 이력 및 AI 분석 */}
          <main className="tpd-main">
            <section className="tpd-section">
              <h3>✨ AI 추천 사유</h3>
              <div className="tpd-ai-box">
                <p>{profile.matchDetail}</p>
              </div>
            </section>

            <section className="tpd-section">
              <h3>📝 자기소개</h3>
              <p className="tpd-text">{profile.intro}</p>
            </section>

            <section className="tpd-section">
              <h3>🛠 보유 기술</h3>
              <div className="tpd-skill-tags">
                {profile.skills.map(skill => <span key={skill} className="tpd-tag">{skill}</span>)}
              </div>
            </section>

            <section className="tpd-section">
              <h3>🎓 학력 및 경력</h3>
              <ul className="tpd-list">
                <li><strong>경력:</strong> {profile.exp}</li>
                <li><strong>학력:</strong> {profile.education}</li>
              </ul>
            </section>

            <div className="tpd-actions">
              <button className="tpd-offer-btn">면접 제안</button>
            </div>
          </main>
        </div>
      </div>
    </BackgroundShell>
  );
};

export default TalentProfileDetail;