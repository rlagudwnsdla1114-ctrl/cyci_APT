import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./List.css";

export default function List() {
  const nav = useNavigate();
  const [filter, setFilter] = useState("전체");
  const [tempInput, setTempInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ 서버에서 공고 목록 불러오기
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/jobseeker/employment");
        const list = res.data?.data ?? res.data ?? [];
        setPosts(Array.isArray(list) ? list : []);
      } catch (e) {
        console.log(e);
        alert("채용공고 불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredPosts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return posts.filter((p) => {
      // 서버 DTO 필드명 대응 (둘 중 뭐가 오든 대응)
      const company = (p.companyName ?? p.company ?? "").toLowerCase();
      const title = (p.title ?? "").toLowerCase();

      const keywordOk = !keyword || company.includes(keyword) || title.includes(keyword);

      // 현재 filter(개발/디자인/기획)는 DB에 컬럼 없으면 일단 통과시키고,
      // 나중에 jobCategory 컬럼 생기면 여기서 걸면 됨
      const filterOk = filter === "전체" ? true : true;

      return keywordOk && filterOk;
    });
  }, [posts, searchTerm, filter]);

  const formatDate = (v) => {
    if (!v) return "";
    // yyyy-mm-dd... 형태면 앞만
    if (typeof v === "string") return v.slice(0, 10);
    return String(v);
  };

  return (
    <BackgroundShell>
      <div className="rl-wrap">
        <header className="rl-header">
          <div className="rl-headerInner">
            <div className="rl-brand" onClick={() => nav("/jobseeker")}>
              <div className="rl-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" opacity=".9" />
                  <path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" opacity=".9" />
                </svg>
              </div>
              <div className="rl-brandText">잡매치 · 채용공고</div>
            </div>
            <div className="rl-actions">
              <button className="rl-pillBtn" onClick={() => nav("/jobseeker")}>나가기</button>
            </div>
          </div>
        </header>

        <main className="rl-main">
          <div className="rl-top">
            <h1 className="rl-pageTitle">
              진행 중인 채용공고 <span className="rl-count">{filteredPosts.length}</span>
            </h1>

            <div className="rl-controls">
              <div className="rl-filters">
                {["전체", "개발", "디자인", "기획"].map((f) => (
                  <button
                    key={f}
                    className={`rl-filterBtn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                    type="button"
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="rl-searchBox">
                <input
                  type="text"
                  placeholder="직무, 회사명 검색"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setSearchTerm(tempInput)}
                />
                <button type="button" onClick={() => setSearchTerm(tempInput)}>
                  검색
                </button>
              </div>
            </div>
          </div>

          {loading && <div style={{ padding: 12 }}>불러오는 중...</div>}

          <div className="rl-list">
            {filteredPosts.map((p) => {
              const id = p.jobPostsIdx ?? p.JOB_POSTS_IDX ?? p.id;
              return (
                <div
                  key={id}
                  className="rl-card"
                  onClick={() => nav(`/helpwanted/${id}`)}
                >
                  <div className="rl-cardLeft">
                    <div className="rl-company">{p.companyName ?? `회사 #${p.companyIdx ?? ""}`}</div>
                    <h3 className="rl-cardTitle">{p.title}</h3>

                    <div className="rl-tags">
                      {/* 있으면 보여주고 없으면 빈칸 */}
                      {[
                        p.career,
                        p.employmentType,
                        p.education,
                      ]
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((tag, idx) => (
                          <span key={idx} className="rl-tag">{tag}</span>
                        ))}
                    </div>
                  </div>

                  <div className="rl-cardRight">
                    <span className="rl-dDay">{p.dDay ?? ""}</span>
                    <div className="rl-meta">
                      조회 {p.viewCount ?? 0} · {formatDate(p.postsCreatedAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}
