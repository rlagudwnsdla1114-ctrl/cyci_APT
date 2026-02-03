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

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await api.post("/api/ai/JobPostsList");

        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const validJobPosts = res.data.filter(
            (post) => post.jobPostsIdx != null || post.JobPostsIdx != null
          );

          if (validJobPosts.length > 0) {
            setJobPosts(validJobPosts);

            const first = validJobPosts[0];
            const firstId =
              first.jobPostsIdx?.toString() || first.JobPostsIdx?.toString() || "";
            setSelectedPost(firstId);
          } else {
            alert("공고 목록에 문제가 있습니다.");
          }
        } else {
          alert("공고 목록이 없습니다.");
        }
      } catch (e) {
        alert("공고 목록 로드 실패");
      }
    };

    fetchMyPosts();
  }, []);

  const handleSearch = () => {
    if (!selectedPost) {
      alert("공고를 선택해주세요.");
      return;
    }

    const jobPostsIdx = Number(selectedPost);
    if (!Number.isFinite(jobPostsIdx) || jobPostsIdx <= 0) {
      alert("공고 ID가 올바르지 않습니다.");
      return;
    }

    setIsLoading(true);

    api
      .get(`/api/ai/selectComMatch?jobPostsIdx=${jobPostsIdx}`)
      .then((res) => {
        console.log("selectComMatch 응답 첫번째:", res.data?.[0]);
        const data = Array.isArray(res.data) ? res.data : [];
        setApplicants(data);
        setCurrentPage(1);
      })
      .catch(() => {
        alert("인재 검색에 실패했습니다.");
        setApplicants([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(applicants.length / itemsPerPage));
  }, [applicants.length]);

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
          {jobPosts.length > 0 ? (
            <>
              <select
                value={selectedPost}
                onChange={(e) => setSelectedPost(e.target.value)}
                disabled={isLoading}
              >
                <option value="">공고 선택</option>
                {jobPosts.map((post) => {
                  const jobPostId = post.jobPostsIdx ?? post.JobPostsIdx ?? "";
                  return (
                    <option key={String(jobPostId)} value={String(jobPostId)}>
                      {post.title ?? "(제목 없음)"}
                    </option>
                  );
                })}
              </select>

              <button onClick={handleSearch} disabled={isLoading || !selectedPost}>
                {isLoading ? "검색 중..." : "인재 검색"}
              </button>
            </>
          ) : (
            <p>공고 목록을 불러오는 중입니다...</p>
          )}
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
              <th>분석 사유</th>
              <th>분석일</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, idx) => (
                <tr key={`${item.jobSeekerIdx ?? "x"}-${item.jobPostsIdx ?? "y"}-${idx}`}>
                  <td>{idx + 1 + (currentPage - 1) * itemsPerPage}</td>

                  <td className="bold-blue">{item.name ?? "이름 없음"}</td>

                  <td>
                    <div className="skill-tag-wrap">
                      {item.keySkill ? (
                        String(item.keySkill)
                          .split(",")
                          .map((s, i) => (
                            <span key={`${s.trim()}-${i}`} className="s-badge">
                              {s.trim()}
                            </span>
                          ))
                      ) : (
                        <span>정보 없음</span>
                      )}
                    </div>
                  </td>

                  <td>{item.matchRate ?? 0}</td>
                  <td>{item.comAiReason ?? "없음"}</td>
                  <td>{item.matchDate ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AiMatchingCompany;
