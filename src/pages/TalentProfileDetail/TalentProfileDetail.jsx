import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./TalentProfileDetail.css";
import { api } from "../../api/api";

const TalentProfileDetail = () => {
  const { id } = useParams(); // ✅ 여기 id는 "jobseekerIdx"로 사용 (CompanyDashboard에서 /talent-detail/:jobseekerIdx 로 보냄)
  const nav = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const stateTalent = location.state?.talent || null;

  const [profile, setProfile] = useState(stateTalent ? normalizeFromState(stateTalent) : null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ URL query: jobPostsIdx (있으면 같이 넘겨줌 - 서버가 필요하면 사용)
  const jobPostsIdxFromQS = useMemo(() => {
    const v = searchParams.get("jobPostsIdx");
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);

  // ✅ 상세 조회 기준은 jobseekerIdx (stateTalent 우선 → 없으면 URL param)
  const jobseekerIdx = useMemo(() => {
    const a = Number(stateTalent?.jobseekerIdx);
    if (Number.isFinite(a) && a > 0) return a;

    const b = Number(id);
    if (Number.isFinite(b) && b > 0) return b;

    return null;
  }, [id, stateTalent]);

  useEffect(() => {
    // stateTalent가 있으면 화면을 먼저 그려줄 수 있으니 loading을 바로 false로 둘 수도 있는데,
    // 여기서는 "상세 API 반드시 호출" 구조 유지
    if (!jobseekerIdx) {
      setLoading(false);
      setErrorMsg("jobseekerIdx가 없어서 상세 조회를 할 수 없습니다.");
      if (!stateTalent) setProfile(null);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    console.log("[DETAIL] request by jobseekerIdx =", jobseekerIdx, "jobPostsIdx =", jobPostsIdxFromQS);

    // ✅ 핵심: comMatchingIdx로 때리지 말고 jobseekerIdx 전용 API로 호출
    api
      .get("/api/ai/talentDetailByJobseeker", {
        params: {
          jobseekerIdx,
          jobPostsIdx: jobPostsIdxFromQS ?? undefined,
        },
      })
      .then((res) => {
        const body = res.data ?? {};
        const data = body.data ?? body;

        if (!data || Object.keys(data).length === 0) {
          setProfile(null);
          setErrorMsg("상세 데이터가 없습니다.");
          return;
        }

        // 백엔드 응답 방어: jobseekerIdx 없으면 비정상으로 처리
        const jsIdx = Number(data.jobseekerIdx);
        if (!Number.isFinite(jsIdx) || jsIdx <= 0) {
          setProfile(null);
          setErrorMsg("상세 데이터가 없습니다. (응답에 jobseekerIdx 없음)");
          return;
        }

        const skills = String(data.keySkill ?? data.keyskill ?? "")
          .split(/[,/|]/g)
          .map((s) => s.trim())
          .filter(Boolean);

        setProfile({
          name: data.jobseekerName ?? data.jobseeker_name ?? "-",
          score: Number(data.comMatchScore ?? data.matchScore ?? data.score ?? 0) || 0,
          skills,
          matchDetail: data.comAiReason ?? data.aiReason ?? "",
          intro: data.apply ?? data.applyMotive ?? "",
          exp: data.exp ?? "-",
          education: data.education ?? "-",
          jobPostsIdx: data.jobPostsIdx ?? jobPostsIdxFromQS ?? null,
          jobseekerIdx: jsIdx,
          comMatchingIdx: data.comMatchingIdx ?? data.comMatchingIDX ?? null,
        });
      })
      .catch((err) => {
        console.error("[DETAIL] talentDetailByJobseeker error:", err);
        setProfile(null);
        setErrorMsg("상세 조회 실패 (네트워크/서버 오류)");
      })
      .finally(() => setLoading(false));
  }, [jobseekerIdx, jobPostsIdxFromQS, stateTalent]);

  if (loading) {
    return (
      <BackgroundShell>
        <div className="tpd-container">
          <button className="tpd-back" onClick={() => nav(-1)}>
            ← 돌아가기
          </button>
          <div className="tpd-loading">불러오는 중...</div>
        </div>
      </BackgroundShell>
    );
  }

  if (!profile) {
    return (
      <BackgroundShell>
        <div className="tpd-container">
          <button className="tpd-back" onClick={() => nav(-1)}>
            ← 돌아가기
          </button>
          <div className="tpd-loading">{errorMsg || "데이터가 없습니다."}</div>

          {stateTalent && (
            <div style={{ marginTop: 12, fontSize: 12, opacity: 0.85, whiteSpace: "pre-wrap" }}>
              전달받은 stateTalent:
              {"\n"}
              {JSON.stringify(stateTalent, null, 2)}
            </div>
          )}
        </div>
      </BackgroundShell>
    );
  }

  return (
    <BackgroundShell>
      <div className="tpd-container">
        <button className="tpd-back" onClick={() => nav(-1)}>
          ← 돌아가기
        </button>

        {!!errorMsg && (
          <div style={{ margin: "10px 0", color: "crimson", fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        <div className="tpd-layout">
          <aside className="tpd-sidebar">
            <div className="tpd-profile-img">👤</div>
            <h2 className="tpd-name">{profile.name}</h2>

            <div className="tpd-score-circle">
              <span className="tpd-score-num">{profile.score}</span>
              <span className="tpd-score-label">AI 적합도</span>
            </div>
          </aside>

          <main className="tpd-main">
            <section className="tpd-section">
              <h3>✨ AI 추천 사유</h3>
              <div className="tpd-ai-box">{profile.matchDetail}</div>
            </section>

            <section className="tpd-section">
              <h3>📝 자기소개</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{profile.intro}</p>
            </section>

            <section className="tpd-section">
              <h3>🛠 보유 기술</h3>
              <div className="tpd-skill-tags">
                {(profile.skills || []).length === 0 ? (
                  <span style={{ opacity: 0.7 }}>등록된 기술이 없습니다.</span>
                ) : (
                  (profile.skills || []).map((skill) => (
                    <span key={skill} className="tpd-tag">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </section>

            <section className="tpd-section">
              <h3>🎓 학력 및 경력</h3>
              <ul>
                <li>경력: {profile.exp}</li>
                <li>학력: {profile.education}</li>
              </ul>
            </section>

            <button className="tpd-offer-btn" type="button">
              면접 제안
            </button>
          </main>
        </div>
      </div>
    </BackgroundShell>
  );
};

export default TalentProfileDetail;

// ---------------- helpers ----------------
function normalizeFromState(talent) {
  // state로 넘어온 객체가 이미 화면용으로 가공된 경우도 있으니 최대한 안전하게 normalize
  const name = talent?.name ?? talent?.jobseekerName ?? "-";
  const score = Number(talent?.score ?? talent?.matchScore ?? 0) || 0;

  const tags =
    Array.isArray(talent?.tags)
      ? talent.tags
      : typeof talent?.tags === "string"
      ? talent.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const jobseekerIdx = Number(talent?.jobseekerIdx);
  const jobPostsIdx = Number(talent?.jobPostsIdx);
  const comMatchingIdx = Number(talent?.comMatchingIdx);

  return {
    name,
    score,
    skills: tags,
    matchDetail: talent?.matchDetail ?? "",
    intro: talent?.intro ?? "",
    exp: talent?.exp ?? "-",
    education: talent?.education ?? "-",
    jobPostsIdx: Number.isFinite(jobPostsIdx) && jobPostsIdx > 0 ? jobPostsIdx : null,
    jobseekerIdx: Number.isFinite(jobseekerIdx) && jobseekerIdx > 0 ? jobseekerIdx : null,
    comMatchingIdx: Number.isFinite(comMatchingIdx) && comMatchingIdx > 0 ? comMatchingIdx : null,
  };
}
