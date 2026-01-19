import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./Detail.css";

export default function Detail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const formatDate = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v.slice(0, 10);
    return String(v);
  };

  // ✅ 상세 조회 (구직자용 백엔드 경로로 변경)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/job/employment/${id}`);
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

  const chips = useMemo(() => {
    const raw = post?.techStack ?? "";
    return raw
      .split(/[,/|]/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [post]);

  // ✅ 첨부파일 다운로드 (GET /api/job/employment/{id}/attachment)
  const downloadAttachment = async () => {
    if (!post?.attachFile) {
      alert("첨부파일이 없습니다.");
      return;
    }
    if (downloading) return;

    try {
      setDownloading(true);

      const res = await api.get(`/api/job/employment/${id}/attachment`, {
        responseType: "blob",
      });

      // 파일명 추출(Content-Disposition)
      const cd =
        res.headers?.["content-disposition"] || res.headers?.["Content-Disposition"];

      let filename =
        post.attachFileOrigin || post.attachFile || "attachment";

      if (cd) {
        const m1 = cd.match(/filename\*\=UTF-8''([^;]+)/i);
        const m2 = cd.match(/filename\=\"?([^\";]+)\"?/i);
        const raw = m1?.[1] || m2?.[1];
        if (raw) filename = decodeURIComponent(raw);
      }

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.log(e);
      const msg =
        e?.response?.status === 404
          ? "파일이 없거나 권한이 없습니다."
          : "다운로드 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setDownloading(false);
    }
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
            <button className="rd-back" onClick={() => nav("/helpwanted")}>
              ← 목록으로
            </button>
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

              {/* 기술스택 칩(있으면) */}
              {chips.length > 0 && (
                <div className="job-chipRow" style={{ marginTop: 14 }}>
                  {chips.map((c, i) => (
                    <span key={i} className="job-chip">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rd-divider" />

            {/* ✅ 첨부파일: 이제는 서버 download 엔드포인트로 */}
            <div className="rd-file">
              <span className="rd-fileLabel">첨부파일</span>

              {post.attachFile ? (
                <button
                  type="button"
                  className="rd-fileLink"
                  onClick={downloadAttachment}
                  disabled={downloading}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: downloading ? "not-allowed" : "pointer",
                    textAlign: "left",
                  }}
                >
                  📄 {post.attachFileOrigin || post.attachFile}{" "}
                  <span className="rd-down">
                    {downloading ? "다운로드 중..." : "다운로드"}
                  </span>
                </button>
              ) : (
                <span style={{ opacity: 0.7 }}>첨부파일 없음</span>
              )}
            </div>

            <div className="rd-divider" />

            {/* ✅ 구직자용 상세 섹션 (테이블 컬럼 기반) */}
            <div className="rd-body">
              <p><b>모집 인원</b>: {post.recruitCount ?? "-"}</p>
              <p><b>고용 형태</b>: {post.employmentType ?? "-"}</p>
              <p><b>급여</b>: {post.salary ?? "-"}</p>
              <p><b>근무 시간</b>: {post.workTime ?? "-"}</p>
              <p><b>경력</b>: {post.career ?? "-"}</p>
              <p><b>학력</b>: {post.education ?? "-"}</p>
              <p><b>지원 기간</b>: {post.applicationPeriod ?? "-"}</p>

              {/* 테이블에 본문 컬럼이 없어서 techStack를 본문 느낌으로 보여주고 싶으면 아래 유지 */}
              {post.techStack ? (
                <>
                  <div className="rd-divider" />
                  <p><b>기술 스택 / 우대사항</b></p>
                  {(post.techStack || "")
                    .split("\n")
                    .filter((line) => line.trim().length > 0)
                    .map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                </>
              ) : null}
            </div>

            <div className="rd-actions">
              <button
                className="rd-btn primary"
                onClick={() => alert("지원 기능은 준비중입니다.")}
              >
                지원하기
              </button>
              <button
                className="rd-btn secondary"
                type="button"
                onClick={() => alert("관심공고 기능은 준비중입니다.")}
              >
                관심공고 등록
              </button>
            </div>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}
