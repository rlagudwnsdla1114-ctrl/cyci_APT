import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./ApplicantResumeDetail.css";

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

export default function ApplicantResumeDetail() {
  const nav = useNavigate();
  const location = useLocation();
  const { jobseekerApplicantIdx } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/company/management/applicants/${jobseekerApplicantIdx}/resume`
      );
      const d = res.data?.data ?? res.data ?? null;
      setData(d);
    } catch (e) {
      alert("이력서 불러오기 실패");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobseekerApplicantIdx]);

  // 뒤로가기: management로 돌아가되, 원래 보고 있던 공고가 있으면 유지
  const goBack = () => {
    const jobPostsIdx = location.state?.jobPostsIdx;
    nav("/management", { state: jobPostsIdx ? { jobPostsIdx } : undefined });
  };

  const goJobPost = () => {
    if (!data?.jobPostsIdx) return;
    nav(`/postdetail/${data.jobPostsIdx}`, { state: { from: "company" } });
  };

  const initials = useMemo(() => {
    const n = (data?.name ?? "").trim();
    if (!n) return "JS";
    return n.slice(0, 2);
  }, [data?.name]);

  // cover_posts 필드들
  const hopeJob = safeParse(data?.hopeJob);
  const hopeRegion = toArray(data?.hopeRegion);
  const education = toArray(data?.education);
  const military = safeParse(data?.militaryStatus);
  const career = toArray(data?.career);
  const certification = toArray(data?.certification);
  const languageSkill = toArray(data?.languageSkill);

  // keyskill 태그화(쉼표/공백 기준 적당히)
  const keyskills = useMemo(() => {
    const raw = (data?.keyskill ?? "").trim();
    if (!raw) return [];
    return raw
      .split(/[,\n]/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [data?.keyskill]);

  const statusTone =
    data?.status === "최종"
      ? "final"
      : data?.status === "검토중"
      ? "review"
      : data?.status === "불합격"
      ? "reject"
      : "new";

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
                <div className="r-topTitleMain">지원자 이력서</div>
                <div className="r-topTitleSub">
                  기업용 열람 화면 · 섹션별로 한 번에 보기
                </div>
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
              {/* 좌측: 요약(실제 사이트 느낌) */}
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
                        <span className={`r-badge ${statusTone}`}>{data.status ?? "신규"}</span>
                      </div>

                      <div className="r-subline">
                        <span className="r-dot">지원공고</span>
                        <span className="r-muted">{data.jobTitle ?? "-"}</span>
                      </div>

                      <div className="r-subline">
                        <span className="r-dot">지원일</span>
                        <span className="r-muted">{data.appliedDate ?? "-"}</span>
                      </div>
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
                      지원자 목록
                    </button>
                  </div>

                  <div className="r-divider" />

                  <div className="r-quick">
                    <KV k="이메일" v={data.email} />
                    <KV k="전화번호" v={data.phone} />
                  </div>
                </div>

                <div className="r-sideCard">
                  <div className="r-sideTitle">희망 조건</div>
                  <KV
                    k="희망직무"
                    v={
                      hopeJob?.sub ? (
                        <ChipList items={hopeJob.sub} />
                      ) : (
                        <div className="r-empty">-</div>
                      )
                    }
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
                <Section
                  title="학력"
                  right={<span className="r-hint">최신 학력/학교 정보를 확인하세요</span>}
                >
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

                <Section title="병역 / 경력">
                  <div className="r-grid2">
                    <div className="r-miniCard">
                      <div className="r-miniTitle">병역</div>
                      <div className="r-miniBody">
                        {military ? (
                          <div className="r-miniText">
                            {military.type ? `상태: ${military.type}` : "-"}
                            {military.date ? ` (${military.date})` : ""}
                          </div>
                        ) : (
                          <div className="r-empty">-</div>
                        )}
                      </div>
                    </div>

                    <div className="r-miniCard">
                      <div className="r-miniTitle">경력</div>
                      <div className="r-miniBody">
                        {career.length === 0 ? (
                          <div className="r-empty">-</div>
                        ) : (
                          <pre className="r-pre">{JSON.stringify(career, null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="자격증 / 언어">
                  <div className="r-grid2">
                    <div className="r-miniCard">
                      <div className="r-miniTitle">자격증</div>
                      <div className="r-miniBody">
                        {certification.length === 0 ? (
                          <div className="r-empty">-</div>
                        ) : (
                          <pre className="r-pre">{JSON.stringify(certification, null, 2)}</pre>
                        )}
                      </div>
                    </div>

                    <div className="r-miniCard">
                      <div className="r-miniTitle">언어</div>
                      <div className="r-miniBody">
                        {languageSkill.length === 0 ? (
                          <div className="r-empty">-</div>
                        ) : (
                          <pre className="r-pre">{JSON.stringify(languageSkill, null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  </div>
                </Section>

                <Section title="지원동기">
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
