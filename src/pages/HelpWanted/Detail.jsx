import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./Detail.css";

export default function Detail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/jobseeker/employment/${id}`);
        const data = res.data?.data ?? res.data;
        setPost(data);
      } catch (e) {
        console.log(e);
        alert("상세 불러오기 실패");
        nav("/helpwanted");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, nav]);

  const formatDate = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v.slice(0, 10);
    return String(v);
  };

  if (loading) {
    return (
      <BackgroundShell>
        <div style={{ padding: 20 }}>불러오는 중...</div>
      </BackgroundShell>
    );
  }

  if (!post) return null;

  return (
    <BackgroundShell>
      <div className="rd-wrap">
        <header className="rd-header">
          <div className="rd-headerInner">
            <button className="rd-back" onClick={() => nav("/helpwanted")}>← 목록으로</button>
            <div className="rd-brand">채용공고 상세</div>
            <div style={{ width: 80 }} />
          </div>
        </header>

        <main className="rd-main">
          <div className="rd-paper fade-in">
            <div className="rd-top">
              <span className="rd-badge">채용중</span>
              <h1 className="rd-title">{post.title}</h1>
              <div className="rd-meta">
                <span>{post.companyName ?? `회사 #${post.companyIdx ?? ""}`}</span>
                <span className="rd-sep">·</span>
                <span>{formatDate(post.postsCreatedAt)}</span>
                <span className="rd-sep">·</span>
                <span>조회 {post.viewCount ?? 0}</span>
              </div>
            </div>

            <div className="rd-divider" />

            <div className="rd-file">
              <span className="rd-fileLabel">첨부파일</span>
              {post.attachFile ? (
                <a
                  className="rd-fileLink"
                  href={`${api.defaults.baseURL}/uploads/${post.attachFile}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 {post.attachFile} <span className="rd-down">다운로드</span>
                </a>
              ) : (
                <span style={{ opacity: 0.7 }}>첨부파일 없음</span>
              )}
            </div>

            <div className="rd-body">
              {/* 테이블 구조상 body 컬럼이 없어서 techStack를 본문처럼 보여주는 예시 */}
              {(post.techStack || "")
                .split("\n")
                .filter((line) => line.trim().length > 0)
                .map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
            </div>

            <div className="rd-actions">
              <button className="rd-btn primary" onClick={() => alert("지원 기능은 준비중입니다.")}>지원하기</button>
              <button className="rd-btn secondary" type="button">관심공고 등록</button>
            </div>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}
