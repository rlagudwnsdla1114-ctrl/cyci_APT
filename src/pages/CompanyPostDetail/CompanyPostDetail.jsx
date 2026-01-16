import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "../HelpWanted/Detail.css";

export default function CompanyPostDetail() {
  const nav = useNavigate();
  const { id } = useParams(); // /postdetail/:id

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v.slice(0, 10);
    return String(v);
  };

  // 상세 조회
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/company/employment/${id}`);
        setPost(res.data?.data ?? null);
      } catch (e) {
        console.log(e);
        alert("공고 상세 불러오기 실패(로그인/권한 확인)");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ✅ 삭제
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
        (e?.response?.status === 401 ? "로그인이 필요합니다." : "삭제 중 오류가 발생했습니다.");
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <BackgroundShell>
      <div className="rd-wrap">
        <header className="rd-header">
          <div className="rd-headerInner">
            <button className="rd-back" onClick={() => nav("/postlist")}>
              ← 목록으로
            </button>
            <div className="rd-brand">공고 관리 상세</div>
            <div style={{ width: 80 }} />
          </div>
        </header>

        <main className="rd-main">
          <div className="rd-paper">
            {loading && <div style={{ padding: 12 }}>불러오는 중...</div>}

            {!loading && !post && <div style={{ padding: 12 }}>데이터가 없습니다.</div>}

            {!loading && post && (
              <>
                <div className="rd-top">
                  <span className="rd-badge">관리중</span>
                  <h1 className="rd-title">{post.title}</h1>

                  <div className="rd-meta">
                    <span>{post.companyName ?? `회사 #${post.companyIdx ?? ""}`}</span>
                    <span className="rd-sep">·</span>
                    <span>조회 {post.viewCount ?? 0}</span>
                    <span className="rd-sep">·</span>
                    <span>{formatDate(post.postsCreatedAt)}</span>
                  </div>
                </div>

                <div className="rd-divider" />

                <div className="rd-body">
                  <p><b>모집 인원</b>: {post.recruitCount ?? "-"}</p>
                  <p><b>고용 형태</b>: {post.employmentType ?? "-"}</p>
                  <p><b>급여</b>: {post.salary ?? "-"}</p>
                  <p><b>근무 시간</b>: {post.workTime ?? "-"}</p>
                  <p><b>경력</b>: {post.career ?? "-"}</p>
                  <p><b>학력</b>: {post.education ?? "-"}</p>
                  <p><b>기술 스택</b>: {post.techStack ?? "-"}</p>
                  <p><b>지원 기간</b>: {post.applicationPeriod ?? "-"}</p>

                  {post.attachFile && <p><b>첨부 파일</b>: {post.attachFile}</p>}
                </div>

                <div className="rd-actions">
                  <button
                    className="rd-btn primary"
                    onClick={() => nav(`/helpwanted/create?id=${id}`)}
                    disabled={deleting}
                  >
                    이 공고 수정하기
                  </button>

                  {/* ✅ 삭제 버튼 추가 */}
                  <button
                    className="rd-btn secondary"
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{ borderColor: "#ff4d4f", color: "#ff4d4f" }} // 원하면 CSS로 빼도 됨
                  >
                    {deleting ? "삭제 중..." : "삭제하기"}
                  </button>

                  <button className="rd-btn secondary" onClick={() => nav("/postlist")} disabled={deleting}>
                    목록으로
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}
