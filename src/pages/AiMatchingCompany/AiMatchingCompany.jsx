import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";
import "./AiMatching.css";

const AiMatchingCompany = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const pickJobPostsIdx = (p) => {
    if (!p || typeof p !== "object") return null;

    const candidates = [
      "jobPostsIdx",
      "job_POSTS_IDX",
      "JOB_POSTS_IDX",
      "job_posts_idx",
      "postsIdx",
      "POSTS_IDX",
      "id",
      "IDX",
    ];

    for (const k of candidates) {
      if (p[k] != null) return p[k];
    }

    const keys = Object.keys(p);
    const idxKey = keys.find((k) => /job.*posts.*idx/i.test(k) || /posts.*idx/i.test(k));
    return idxKey ? p[idxKey] : null;
  };

  const pickTitle = (p) => {
    if (!p || typeof p !== "object") return "(제목없음)";

    const candidates = [
      "title",
      "jobTitle",
      "job_posts_title",
      "JOB_POSTS_TITLE",
      "jobPostsTitle",
      "JOB_POSTS_NAME",
      "name",
    ];

    for (const k of candidates) {
      if (p[k] != null) return p[k];
    }

    const keys = Object.keys(p);
    const titleKey = keys.find((k) => /title/i.test(k) || /name/i.test(k));
    return titleKey ? p[titleKey] : "(제목없음)";
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      const res = await api.post("/api/ai/JobPostsList");

      const raw = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
      console.log("JobPostsList payload:", res.data);
      console.log("JobPostsList raw:", raw);

      const normalized = raw
        .map((p) => {
          const postsIdx = pickJobPostsIdx(p);
          const title = pickTitle(p);

          if (postsIdx == null) return null;

          return {
            ...p,
            postsIdx: String(postsIdx),
            title: String(title),
          };
        })
        .filter(Boolean);

      console.log("JobPostsList keys[0]:", Object.keys(raw?.[0] || {}));
      console.log("JobPostsList normalized:", normalized);

      setJobPosts(normalized);

      if (normalized.length > 0) {
        setSelectedPost(normalized[0].postsIdx);
      } else {
        setSelectedPost("");
      }
    };

    fetchMyPosts();
  }, []);

  const handleSearch = () => {
    if (!selectedPost) return alert("공고를 선택해주세요.");

    const jobPostsIdxNum = Number(selectedPost);
    if (!Number.isFinite(jobPostsIdxNum) || jobPostsIdxNum <= 0) {
      return alert("공고 값이 올바르지 않습니다.");
    }

    setIsLoading(true);

    api
      .get("/api/ai/selectComMatch", { params: { jobPostsIdx: jobPostsIdxNum } })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setApplicants(list);
        setCurrentPage(1);
        setIsLoading(false);
      });
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(applicants.length / itemsPerPage)), [applicants.length]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return applicants.slice(start, start + itemsPerPage);
  }, [applicants, currentPage]);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="match-page">
      <div className="match-header">
        <h2>👥 회사 공고 적합 인재 리포트</h2>

        <div className="search-bar-container">
          <select value={selectedPost} onChange={(e) => setSelectedPost(e.target.value)}>
            {jobPosts.length === 0 ? (
              <option value="">공고 없음</option>
            ) : (
              jobPosts.map((post) => (
                <option key={post.postsIdx} value={post.postsIdx}>
                  {post.title}
                </option>
              ))
            )}
          </select>

          <button onClick={handleSearch} disabled={isLoading || !selectedPost}>
            {isLoading ? "검색중..." : "인재 검색"}
          </button>
        </div>
      </div>

      <div className="match-table-box">
        <table className="match-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>보유 기술</th>
              <th>적합도</th>
              <th>분석일</th>
              <th>상세보기</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, idx) => {
                const name = item.jobseekerName ?? "";
                const keySkill = item.keySkill ?? "";
                const score = item.comMatchScore ?? "";
                const date = item.matchingCreateat ?? "";
                const rowNo = idx + 1 + (currentPage - 1) * itemsPerPage;

                const rowKey = `${item.companyApplicantIdx ?? "ca"}-${item.jobseekerIdx ?? "js"}-${item.jobPostsIdx ?? "jp"}-${rowNo}`;

                return (
                  <tr key={rowKey}>
                    <td>{rowNo}</td>
                    <td className="bold-blue">{name || "-"}</td>
                    <td>
                      <div className="skill-tag-wrap">
                        {keySkill
                          ? keySkill.split(",").map((s) => {
                              const t = s.trim();
                              if (!t) return null;
                              return (
                                <span key={t} className="s-badge">
                                  {t}
                                </span>
                              );
                            })
                          : "-"}
                      </div>
                    </td>
                    <td>{String(score)}%</td>
                    <td>{date || "-"}</td>
                    <td>
                      <button
                        className="btn-contact"
                        onClick={() => {
                          alert(item.comAiReason ?? "상세 내용이 없습니다.");
                        }}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">
                  {isLoading ? "불러오는 중..." : "결과가 없습니다. 공고 선택 후 '인재 검색'을 눌러주세요."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {applicants.length > 0 && (
          <div className="pagination" style={{ marginTop: 12 }}>
            <button onClick={goPrev} disabled={currentPage === 1}>
              이전
            </button>
            <span style={{ margin: "0 10px" }}>
              {currentPage} / {totalPages}
            </span>
            <button onClick={goNext} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMatchingCompany;
