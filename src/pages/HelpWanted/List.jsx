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

  // ✅ 구직자용 목록 API로 변경: /api/job/employment
  useEffect(() => {


    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/job/employment");
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

  const formatDate = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v.slice(0, 10);
    return String(v);
  };

  const filteredPosts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return posts.filter((p) => {
      const company = String(p.companyName ?? "").toLowerCase();
      const title = String(p.title ?? "").toLowerCase();
      const tech = String(p.techStack ?? "").toLowerCase();

      const keywordOk =
        !keyword ||
        company.includes(keyword) ||
        title.includes(keyword) ||
        tech.includes(keyword);

      // 현재 filter는 컬럼 없으니 일단 패스(추후 jobCategory 생기면 여기서 걸기)
      const filterOk = filter === "전체" ? true : true;

      return keywordOk && filterOk;
    });
  }, [posts, searchTerm, filter]);

  return (
    <BackgroundShell>
      <div className="rl-wrap">
        <header className="rl-header">
          <div className="rl-headerInner">
            <div className="rl-brand" onClick={() => nav("/jobseeker")}>
              <div className="rl-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M4 10V6a2 2 0 0 1 2-2h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity=".9"
                  />
                  <path
                    d="M20 14v4a2 2 0 0 1-2 2h-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity=".9"
                  />
                </svg>
              </div>
              <div className="rl-brandText">잡매치 · 채용공고</div>
            </div>
            <div className="rl-actions">
              <button className="rl-pillBtn" onClick={() => nav("/jobseeker")}>
                나가기
              </button>
            </div>
          </div>
        </header>

        <main className="rl-main">
          <div className="rl-top">
            <h1 className="rl-pageTitle">
              진행 중인 채용공고{" "}
              <span className="rl-count">{filteredPosts.length}</span>
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
                  placeholder="직무, 회사명, 기술스택 검색"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchTerm(tempInput)
                  }
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
              const id = p.jobPostsIdx; // ✅ 구직자 DTO 기준
              return (
                <div
                  key={id}
                  className="rl-card"
                  onClick={() => nav(`/helpwanted/${id}`)} // 네 라우터에 맞게 유지
                >
                  <div className="rl-cardLeft">
                    <div className="rl-company">{p.companyName ?? "-"}</div>
                    <h3 className="rl-cardTitle">{p.title ?? "-"}</h3>

                    <div className="rl-tags">
                      {[p.career, p.employmentType, p.education]
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((tag, idx) => (
                          <span key={idx} className="rl-tag">
                            {tag}
                          </span>
                        ))}
                    </div>

                    {/* ✅ salary 있으면 아래처럼 한 줄 더 */}
                    {p.salary ? (
                      <div className="rl-salaryLine">{p.salary}</div>
                    ) : null}
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

            {!loading && filteredPosts.length === 0 && (
              <div style={{ padding: 20, opacity: 0.7 }}>
                표시할 공고가 없습니다.
              </div>
            )}
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}
