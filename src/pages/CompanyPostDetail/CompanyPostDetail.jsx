import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./CompanyPostDetail.css";

export default function CompanyPostDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const formatDate = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v.slice(0, 10);
    return String(v);
  };

  const normalizePost = (p) => {
    if (!p) return null;
    return {
      ...p,
      // title 키가 다를 수도 있으니 안전장치
      title: p.title ?? p.postTitle ?? p.employmentTitle ?? "-",

      // 회사명 키가 다를 수도 있으니 안전장치(스네이크/중첩 포함)
      companyName:
        p.companyName ??
        p.company_name ??
        p.company?.companyName ??
        p.company?.name ??
        "",

      companyIdx:
        p.companyIdx ??
        p.company_idx ??
        p.company?.companyIdx ??
        p.company?.idx,

      postsCreatedAt:
        p.postsCreatedAt ??
        p.createdAt ??
        p.posts_created_at ??
        p.created_at,

      viewCount: p.viewCount ?? p.view_count ?? 0,

      techStack: p.techStack ?? p.tech_stack ?? "",
      recruitCount: p.recruitCount ?? p.recruit_count,
      employmentType: p.employmentType ?? p.employment_type,
      workTime: p.workTime ?? p.work_time,
      applicationPeriod: p.applicationPeriod ?? p.application_period,

      attachFile: p.attachFile ?? p.attach_file,
      attachFileOrigin: p.attachFileOrigin ?? p.attach_file_origin ?? "", // ✅ 원본 파일명
      attachFileUrl: p.attachFileUrl ?? p.attach_file_url, // 혹시 URL로 주는 경우 대비
    };
  };

  // 상세 조회
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/company/employment/${id}`);

        // 응답 구조 방어
        const payload = res.data?.data ?? res.data;
        const item = payload?.employment ?? payload?.post ?? payload;

        const normalized = normalizePost(item);
        setPost(normalized);
        setCompanyName(normalized?.companyName || "");
      } catch (e) {
        console.log(e);
        alert("공고 상세 불러오기 실패(로그인/권한 확인)");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 회사이름이 응답에 없을 때: companyIdx로 별도 조회(너희 엔드포인트로 1줄 수정)
  useEffect(() => {
    if (!post) return;
    if (post.companyName) return;
    if (!post.companyIdx) return;

    (async () => {
      try {
        // TODO: 너희 백엔드 회사조회 엔드포인트로 바꿔줘
        const r = await api.get(`/api/company/${post.companyIdx}`);
        const d = r.data?.data ?? r.data;
        const name =
          d?.companyName ?? d?.name ?? d?.company_name ?? d?.company?.name ?? "";
        setCompanyName(name || `회사 #${post.companyIdx}`);
      } catch (e) {
        setCompanyName(`회사 #${post.companyIdx}`);
      }
    })();
  }, [post]);

  const chips = useMemo(() => {
    const raw = post?.techStack ?? "";
    return raw
      .split(/[,/|]/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [post]);

  // ✅ 첨부파일 다운로드 (백엔드: GET /api/company/employment/{id}/attachment)
  const downloadAttachment = async () => {
    if (!id) return;
    if (downloading) return;
    if (!post?.attachFile) {
      alert("첨부파일이 없습니다.");
      return;
    }

    try {
      setDownloading(true);

      const res = await api.get(`/api/company/employment/${id}/attachment`, {
        responseType: "blob",
      });

      // 파일명 추출(Content-Disposition)
      const cd =
        res.headers?.["content-disposition"] || res.headers?.["Content-Disposition"];

      let filename = post.attachFileOrigin || post.attachFile || "attachment";

      if (cd) {
        const m1 = cd.match(/filename\*\=UTF-8''([^;]+)/i);
        const m2 = cd.match(/filename\=\"?([^\";]+)\"?/i);
        const raw = m1?.[1] || m2?.[1];
        if (raw) filename = decodeURIComponent(raw);
      }

      // 다운로드 트리거
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

  const handleDelete = async () => {
    if (deleting) return;

    const ok = window.confirm("정말 이 공고를 삭제할까요? 삭제하면 복구할 수 없습니다.");
    if (!ok) return;

    try {
      setDeleting(true);
      await api.delete(`/api/company/employment/${id}`);
      alert("삭제되었습니다.");
      nav("/postlist");
    } catch (e) {
      console.log(e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (e?.response?.status === 401
          ? "로그인이 필요합니다."
          : "삭제 중 오류가 발생했습니다.");
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <BackgroundShell>
      <div className="job-wrap">
        <header className="job-header">
          <div className="job-headerInner">
            <button className="job-back" onClick={() => nav("/postlist")}>
              ← 목록으로
            </button>
            <div className="job-brand">공고 관리 상세</div>
            <div style={{ width: 80 }} />
          </div>
        </header>

        <main className="job-mainArea">
          <div className="job-shell">
            {loading && <div className="job-paper">불러오는 중...</div>}
            {!loading && !post && <div className="job-paper">데이터가 없습니다.</div>}

            {!loading && post && (
              <div className="job-layout">
                {/* 좌측: 상세 섹션 */}
                <section className="job-main">
                  <div className="job-paper">
                    <div className="job-top">
                      <div className="job-topRow">
                        <span className="job-badge">관리중</span>
                        <span className="job-subtle">조회 {post.viewCount ?? 0}</span>
                        <span className="job-dot">·</span>
                        <span className="job-subtle">{formatDate(post.postsCreatedAt)}</span>
                      </div>

                      <h1 className="job-title">{post.title}</h1>

                      <div className="job-companyLine">
                        <div className="job-companyName">
                          {companyName || `회사 #${post.companyIdx ?? ""}`}
                        </div>
                      </div>

                      {chips.length > 0 && (
                        <div className="job-chipRow">
                          {chips.map((c, i) => (
                            <span key={i} className="job-chip">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="job-divider" />

                    <div className="job-section">
                      <div className="job-sectionTitle">모집 요강</div>
                      <div className="job-grid">
                        <Info label="모집 인원" value={post.recruitCount ?? "-"} />
                        <Info label="고용 형태" value={post.employmentType ?? "-"} />
                        <Info label="급여" value={post.salary ?? "-"} />
                        <Info label="근무 시간" value={post.workTime ?? "-"} />
                      </div>
                    </div>

                    <div className="job-section">
                      <div className="job-sectionTitle">자격 요건</div>
                      <div className="job-grid">
                        <Info label="경력" value={post.career ?? "-"} />
                        <Info label="학력" value={post.education ?? "-"} />
                        <Info
                          label="기술 스택"
                          value={
                            chips.length ? chips.join(", ") : post.techStack ?? "-"
                          }
                        />
                      </div>
                    </div>

                    <div className="job-section">
                      <div className="job-sectionTitle">접수 정보</div>
                      <div className="job-grid">
                        <Info label="지원 기간" value={post.applicationPeriod ?? "-"} />

                        {/* ✅ 첨부파일 다운로드 */}
                        <Info
                          label="첨부 파일"
                          value={
                            post.attachFile ? (
                              post.attachFileUrl ? (
                                <a
                                  className="job-link"
                                  href={post.attachFileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {post.attachFileOrigin || post.attachFile}
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  className="job-linkBtn"
                                  onClick={downloadAttachment}
                                  disabled={downloading}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    padding: 0,
                                    cursor: downloading ? "not-allowed" : "pointer",
                                    textDecoration: "underline",
                                  }}
                                >
                                  {downloading
                                    ? "다운로드 중..."
                                    : post.attachFileOrigin || post.attachFile}
                                </button>
                              )
                            ) : (
                              "-"
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 우측: 요약 + 액션 */}
                <aside className="job-side">
                  <div className="job-card sticky">
                    <div className="job-cardTitle">요약</div>

                    <div className="job-kv">
                      <div className="job-k">{companyName || "-"}</div>
                      <div className="job-v">{post.title}</div>
                    </div>

                    <div className="job-miniList">
                      <Mini label="고용형태" value={post.employmentType ?? "-"} />
                      <Mini label="급여" value={post.salary ?? "-"} />
                      <Mini label="경력" value={post.career ?? "-"} />
                      <Mini label="학력" value={post.education ?? "-"} />
                      <Mini label="지원기간" value={post.applicationPeriod ?? "-"} />
                    </div>

                    <div className="job-actions">
                      <button
                        className="job-btn primary"
                        onClick={() => nav(`/helpwanted/create?id=${id}`)}
                        disabled={deleting}
                      >
                        이 공고 수정하기
                      </button>

                      <button
                        className="job-btn danger"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting ? "삭제 중..." : "삭제하기"}
                      </button>

                      <button
                        className="job-btn ghost"
                        onClick={() => nav("/postlist")}
                        disabled={deleting}
                      >
                        목록으로
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}

function Info({ label, value }) {
  return (
    <div className="job-info">
      <div className="job-infoLabel">{label}</div>
      <div className="job-infoValue">{value}</div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="job-miniRow">
      <div className="job-miniLabel">{label}</div>
      <div className="job-miniValue">{value}</div>
    </div>
  );
}
