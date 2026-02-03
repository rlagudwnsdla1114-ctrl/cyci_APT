import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./TalentProfileDetail.css"

function safeParse(v) {
  if (!v) return null;
  if (typeof v === "object") return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

function toArray(v) {
  const p = safeParse(v);
  if (!p) return [];
  if (Array.isArray(p)) return p;
  return [p];
}

function Chip({ children }) {
  return <span className="r-chip">{children}</span>;
}

function ChipList({ items }) {
  if (!items || items.length === 0) return <div className="r-empty">-</div>;
  return (
    <div className="r-chipRow">
      {items.map((x, i) => (
        <Chip key={`${String(x)}-${i}`}>{String(x)}</Chip>
      ))}
    </div>
  );
}

function Section({ title, right, children }) {
  return (
    <section className="r-card">
      <div className="r-cardHead">
        <h3 className="r-cardTitle">{title}</h3>
        {right ? <div className="r-cardRight">{right}</div> : null}
      </div>
      <div className="r-cardBody">{children}</div>
    </section>
  );
}

function KV({ k, v }) {
  return (
    <div className="r-kv">
      <div className="r-k">{k}</div>
      <div className="r-v">{v ?? <span className="r-empty">-</span>}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="r-skel">
      <div className="r-skelTop" />
      <div className="r-skelGrid">
        <div className="r-skelBox" />
        <div className="r-skelBox" />
      </div>
      <div className="r-skelBox" />
      <div className="r-skelBox" />
    </div>
  );
}

function splitSkills(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return [];
  return s
    .split(/[,/|\n]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

function normalizeTalentDetail(resData, fallbackJobseekerIdx, fallbackJobPostsIdx) {
  const d = resData?.data ?? resData ?? null;
  if (!d || typeof d !== "object") return null;

  const jobseekerIdx =
    Number(d.jobseekerIdx ?? d.jobSeekerIdx ?? fallbackJobseekerIdx) || null;

  if (!jobseekerIdx) return null;

  return {
    // 좌측 카드
    jobseekerIdx,
    jobPostsIdx: Number(d.jobPostsIdx ?? fallbackJobPostsIdx) || null,
    name: d.jobseekerName ?? d.name ?? d.jobseeker_name ?? "-",
    imageUrl: d.imageUrl ?? d.profileImgUrl ?? null,

    // AI 정보
    matchScore: Number(d.comMatchScore ?? d.matchScore ?? d.score ?? 0) || 0,
    aiReason: d.comAiReason ?? d.aiReason ?? d.matchDetail ?? "",

    // 태그
    keyskill: d.keySkill ?? d.keyskill ?? d.keySkills ?? "",

    // 아래 섹션들(서버 필드가 있으면 매핑해서 보여줌)
    education: d.education ?? null,
    career: d.career ?? null,
    certification: d.certification ?? null,
    languageSkill: d.languageSkill ?? null,

    applyMotive: d.applyMotive ?? d.apply ?? d.intro ?? "",
    growthProcess: d.growthProcess ?? "",
    personality: d.personality ?? "",
    jobExperience: d.jobExperience ?? d.exp ?? "",

    // 희망조건(있으면)
    hopeJob: d.hopeJob ?? null,
    hopeRegion: d.hopeRegion ?? null,

    // 연락처(있으면)
    email: d.email ?? null,
    phone: d.phone ?? null,

    // 화면 표시용
    jobTitle: d.jobTitle ?? d.postTitle ?? null,
    appliedDate: d.appliedDate ?? null,
    status: d.status ?? null,
  };
}

export default function TalentProfileDetail() {
  const nav = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // ✅ id == jobseekerIdx
  const [searchParams] = useSearchParams();

  const jobPostsIdxFromQS = useMemo(() => {
    const v = searchParams.get("jobPostsIdx");
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [searchParams]);

  const jobseekerIdx = useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [id]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const load = async () => {
    if (!jobseekerIdx) {
      setData(null);
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await api.get("/api/ai/talentResume", {
        params: { jobseekerIdx },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const normalized = normalizeTalentDetail(res.data, jobseekerIdx, jobPostsIdxFromQS);
      setData(normalized);
    } catch (e) {
      alert("이력서(인재 상세) 불러오기 실패");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobseekerIdx, jobPostsIdxFromQS]);

  // 뒤로가기: 기존처럼 nav(-1) 기본, management로 돌리고 싶으면 아래 주석 해제해서 사용
  const goBack = () => {
    // ✅ 1) 그냥 이전 화면
    nav(-1);

    // ✅ 2) management로 고정 복귀 + jobPostsIdx 유지 (원하면 이 방식으로)
    // const jp = location.state?.jobPostsIdx ?? jobPostsIdxFromQS;
    // nav("/management", { state: jp ? { jobPostsIdx: jp } : undefined });
  };

  const goJobPost = () => {
    const jp = data?.jobPostsIdx;
    if (!jp) return;
    nav(`/postdetail/${jp}`, { state: { from: "company" } });
  };

  const initials = useMemo(() => {
    const n = (data?.name ?? "").trim();
    if (!n) return "JS";
    return n.slice(0, 2);
  }, [data?.name]);

  // 희망 조건 (있을 때만)
  const hopeJob = safeParse(data?.hopeJob);
  const hopeRegion = toArray(data?.hopeRegion);

  // 학력/경력/자격증/언어 (응답이 배열/JSON/문자열 무엇이든 방어)
  const education = toArray(data?.education);
  const career = toArray(data?.career);
  const certification = toArray(data?.certification);
  const languageSkill = toArray(data?.languageSkill);

  // keyskill -> 태그 배열
  const keyskills = useMemo(() => splitSkills(data?.keyskill), [data?.keyskill]);

  // 배지 톤: 기존 status 있으면 활용, 없으면 점수 기반
  const statusTone = useMemo(() => {
    const s = String(data?.status ?? "").trim();
    if (s === "최종") return "final";
    if (s === "검토중") return "review";
    if (s === "불합격") return "reject";
    if (s) return "new";

    const sc = Number(data?.matchScore ?? 0) || 0;
    if (sc >= 85) return "final";
    if (sc >= 70) return "review";
    if (sc > 0) return "new";
    return "reject";
  }, [data?.status, data?.matchScore]);

  return (
    <BackgroundShell>
      <div className="r-page">
        {/* 상단 바 */}
        <header className="r-topbar">
          <div className="r-topbarInner">
            <div className="r-topLeft">
              <button className="r-ghostBtn" onClick={goBack}>
                ← 목록
              </button>
              <div className="r-topTitle">
                <div className="r-topTitleMain">인재 이력서 상세</div>
                <div className="r-topTitleSub">기업용 열람 화면 · 섹션별로 한 번에 보기</div>
              </div>
            </div>

            <div className="r-topRight">
              <button className="r-btn" onClick={() => window.print()}>
                인쇄
              </button>
              <button className="r-btn primary" onClick={goJobPost} disabled={!data?.jobPostsIdx}>
                공고 보기
              </button>
            </div>
          </div>
        </header>

        <main className="r-main">
          {loading && <Skeleton />}

          {!loading && !data && (
            <div className="r-emptyBox">
              <div className="r-emptyIcon">📄</div>
              <div className="r-emptyText">이력서 데이터를 찾을 수 없습니다.</div>
              <button className="r-btn primary" onClick={goBack}>
                돌아가기
              </button>
            </div>
          )}

          {!loading && data && (
            <div className="r-layout">
              {/* 좌측: 요약 */}
              <aside className="r-side">
                <div className="r-profileCard">
                  <div className="r-profileTop">
                    {data.imageUrl ? (
                      <img className="r-avatarImg" src={data.imageUrl} alt="profile" />
                    ) : (
                      <div className="r-avatar">{initials}</div>
                    )}

                    <div className="r-profileInfo">
                      <div className="r-nameRow">
                        <div className="r-name">{data.name}</div>
                        <span className={`r-badge ${statusTone}`}>
                          {data.status ?? `AI ${data.matchScore}점`}
                        </span>
                      </div>

                      <div className="r-subline">
                        <span className="r-dot">AI 적합도</span>
                        <span className="r-muted">{data.matchScore ?? 0}</span>
                      </div>

                      {data.jobTitle ? (
                        <div className="r-subline">
                          <span className="r-dot">관련 공고</span>
                          <span className="r-muted">{data.jobTitle}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="r-profileActions">
                    <button
                      className="r-btn"
                      onClick={() => (window.location.href = `mailto:${data.email}`)}
                      disabled={!data.email}
                    >
                      메일
                    </button>
                    <button
                      className="r-btn"
                      onClick={() => (window.location.href = `tel:${data.phone}`)}
                      disabled={!data.phone}
                    >
                      전화
                    </button>
                    <button className="r-btn primary" onClick={goBack}>
                      인재 목록
                    </button>
                  </div>

                  <div className="r-divider" />

                  <div className="r-quick">
                    <KV k="이메일" v={data.email} />
                    <KV k="전화번호" v={data.phone} />
                    <KV k="jobseekerIdx" v={data.jobseekerIdx} />
                  </div>
                </div>

                {/* 희망 조건: 없으면 카드 자체는 보여도 - 처리됨 */}
                <div className="r-sideCard">
                  <div className="r-sideTitle">희망 조건</div>
                  <KV
                    k="희망직무"
                    v={hopeJob?.sub ? <ChipList items={hopeJob.sub} /> : <div className="r-empty">-</div>}
                  />
                  <KV k="직군" v={hopeJob?.category ? <ChipList items={[hopeJob.category]} /> : "-"} />
                  <KV k="근무지역" v={<ChipList items={hopeRegion} />} />
                </div>

                <div className="r-sideCard">
                  <div className="r-sideTitle">보유 기술</div>
                  <ChipList items={keyskills} />
                </div>
              </aside>

              {/* 우측: 본문 섹션 */}
              <section className="r-content">
                <Section title="AI 추천 사유" right={<span className="r-hint">백엔드 AI 응답 그대로 표시</span>}>
                  <div className="r-text">{data.aiReason || "-"}</div>
                </Section>

                <Section title="학력" right={<span className="r-hint">최신 학력/학교 정보를 확인하세요</span>}>
                  {education.length === 0 ? (
                    <div className="r-empty">-</div>
                  ) : (
                    <div className="r-list">
                      {education.map((e, i) => (
                        <div className="r-listItem" key={i}>
                          <div className="r-listMain">
                            <div className="r-listTitle">{e?.name || e?.school || "학력 정보"}</div>
                            <div className="r-listSub">
                              {e?.type ? `유형: ${e.type}` : null}
                              {e?.major ? ` · 전공: ${e.major}` : null}
                              {e?.status ? ` · 상태: ${e.status}` : null}
                            </div>
                          </div>
                          <div className="r-listRight">{e?.date || ""}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>

                <Section title="경력">
                  {career.length === 0 ? <div className="r-empty">-</div> : <pre className="r-pre">{JSON.stringify(career, null, 2)}</pre>}
                </Section>

                <Section title="자격증 / 언어">
                  <div className="r-grid2">
                    <div className="r-miniCard">
                      <div className="r-miniTitle">자격증</div>
                      <div className="r-miniBody">
                        {certification.length === 0 ? <div className="r-empty">-</div> : <pre className="r-pre">{JSON.stringify(certification, null, 2)}</pre>}
                      </div>
                    </div>

                    <div className="r-miniCard">
                      <div className="r-miniTitle">언어</div>
                      <div className="r-miniBody">
                        {languageSkill.length === 0 ? <div className="r-empty">-</div> : <pre className="r-pre">{JSON.stringify(languageSkill, null, 2)}</pre>}
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="자기소개">
                  <div className="r-text">{data.applyMotive || "-"}</div>
                </Section>

                <Section title="성장과정">
                  <div className="r-text">{data.growthProcess || "-"}</div>
                </Section>

                <Section title="성격 및 강점/약점">
                  <div className="r-text">{data.personality || "-"}</div>
                </Section>

                <Section title="프로젝트/직무 경험">
                  <div className="r-text">{data.jobExperience || "-"}</div>
                </Section>

                <div className="r-bottomBar">
                  <button className="r-btn" onClick={goBack}>
                    ← 목록으로
                  </button>
                  <button className="r-btn primary" onClick={goJobPost} disabled={!data?.jobPostsIdx}>
                    공고 보기
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </BackgroundShell>
  );
}
