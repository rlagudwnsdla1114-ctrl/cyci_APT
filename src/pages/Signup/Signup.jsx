import { useMemo, useState } from "react";
import "./Signup.css";

export default function Signup() {
  const [role, setRole] = useState("jobseeker"); // "company" | "jobseeker"

  const [common, setCommon] = useState({
    email: "",
    password: "",
    password2: "",
    region: "",
    agree: false,
  });

  const [jobseeker, setJobseeker] = useState({
    desiredRole: "",
    experience: "신입",
    skills: "",
    portfolio: "",
    workType: "무관",
    salaryRange: "협의",
  });

  const [company, setCompany] = useState({
    companyName: "",
    bizNumber: "",
    industry: "",
    companySize: "1~10명",
    website: "",
    hiringLocation: "",
  });

  const fields = useMemo(() => {
    return role === "company"
      ? { ...common, ...company }
      : { ...common, ...jobseeker };
  }, [role, common, company, jobseeker]);

  const errors = useMemo(() => {
    const e = {};
    if (!common.email.includes("@")) e.email = "이메일 형식을 확인해 주세요.";
    if (common.password.length < 8) e.password = "비밀번호는 8자 이상이 좋아요.";
    if (common.password !== common.password2) e.password2 = "비밀번호가 일치하지 않아요.";
    if (!common.region) e.region = "지역을 선택해 주세요.";
    if (!common.agree) e.agree = "약관 동의가 필요해요.";

    if (role === "company") {
      if (!company.companyName) e.companyName = "기업명을 입력해 주세요.";
      if (!company.bizNumber) e.bizNumber = "사업자등록번호를 입력해 주세요.";
      if (!company.industry) e.industry = "업종을 선택해 주세요.";
      if (!company.hiringLocation) e.hiringLocation = "채용 근무지를 입력해 주세요.";
    } else {
      if (!jobseeker.desiredRole) e.desiredRole = "희망 직무를 입력해 주세요.";
      if (!jobseeker.skills) e.skills = "기술 스택을 최소 1개는 적어주세요.";
    }

    return e;
  }, [role, common, company, jobseeker]);

  const canSubmit = Object.keys(errors).length === 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // TODO: API 연동 위치
    console.log("SIGNUP PAYLOAD:", { role, ...fields });

    alert(
      role === "company"
        ? "기업 회원가입 완료(예시) — 다음 단계로 로그인/온보딩 연결하면 돼요."
        : "구직자 회원가입 완료(예시) — 다음 단계로 로그인/온보딩 연결하면 돼요."
    );
  };

  return (
    <div className="signup-page">
      {/* 배경은 “전과 동일”하게 쓰려면 기존 배경 wrapper class를 여기 컨테이너에 그대로 적용하면 돼요 */}
      <div className="signup-bg" />

      <main className="signup-shell">
        <section className="signup-card">
          <header className="signup-header">
            <div className="signup-title-wrap">
              <h1 className="signup-title">회원가입</h1>
              <p className="signup-sub">
                역할을 선택하면 필요한 정보만 깔끔하게 입력할 수 있어요.
              </p>
            </div>

            {/* 슬라이더(세그먼트) */}
            <div className={`segmented ${role}`}>
              <button
                type="button"
                className={role === "jobseeker" ? "active" : ""}
                onClick={() => setRole("jobseeker")}
              >
                구직자
              </button>
              <button
                type="button"
                className={role === "company" ? "active" : ""}
                onClick={() => setRole("company")}
              >
                기업
              </button>
              <span className="seg-indicator" aria-hidden="true" />
            </div>
          </header>

          <form className="signup-form" onSubmit={onSubmit}>
            <div className="grid">
              {/* 공통 */}
              <Field
                label="이메일"
                placeholder="example@domain.com"
                value={common.email}
                onChange={(v) => setCommon((p) => ({ ...p, email: v }))}
                error={errors.email}
                type="email"
                autoComplete="email"
              />

              <Field
                label="지역"
                type="select"
                value={common.region}
                onChange={(v) => setCommon((p) => ({ ...p, region: v }))}
                error={errors.region}
                options={["", "서울", "경기", "인천", "대전", "대구", "부산", "광주", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]}
              />

              <Field
                label="비밀번호"
                placeholder="8자 이상"
                value={common.password}
                onChange={(v) => setCommon((p) => ({ ...p, password: v }))}
                error={errors.password}
                type="password"
                autoComplete="new-password"
              />

              <Field
                label="비밀번호 확인"
                placeholder="비밀번호 다시 입력"
                value={common.password2}
                onChange={(v) => setCommon((p) => ({ ...p, password2: v }))}
                error={errors.password2}
                type="password"
                autoComplete="new-password"
              />

              {/* 역할별 */}
              {role === "company" ? (
                <>
                  <Field
                    label="기업명"
                    placeholder="예) 이음컴퍼니"
                    value={company.companyName}
                    onChange={(v) => setCompany((p) => ({ ...p, companyName: v }))}
                    error={errors.companyName}
                  />
                  <Field
                    label="사업자등록번호"
                    placeholder="예) 123-45-67890"
                    value={company.bizNumber}
                    onChange={(v) => setCompany((p) => ({ ...p, bizNumber: v }))}
                    error={errors.bizNumber}
                  />
                  <Field
                    label="업종"
                    type="select"
                    value={company.industry}
                    onChange={(v) => setCompany((p) => ({ ...p, industry: v }))}
                    error={errors.industry}
                    options={["", "IT/소프트웨어", "제조", "유통/물류", "금융", "교육", "의료/바이오", "공공/기관", "기타"]}
                  />
                  <Field
                    label="규모"
                    type="select"
                    value={company.companySize}
                    onChange={(v) => setCompany((p) => ({ ...p, companySize: v }))}
                    options={["1~10명", "11~50명", "51~200명", "201~1000명", "1000명 이상"]}
                  />
                  <Field
                    label="웹사이트(선택)"
                    placeholder="https://"
                    value={company.website}
                    onChange={(v) => setCompany((p) => ({ ...p, website: v }))}
                  />
                  <Field
                    label="채용 근무지"
                    placeholder="예) 서울 강남 / 재택 / 혼합"
                    value={company.hiringLocation}
                    onChange={(v) => setCompany((p) => ({ ...p, hiringLocation: v }))}
                    error={errors.hiringLocation}
                  />
                </>
              ) : (
                <>
                  <Field
                    label="희망 직무"
                    placeholder="예) 프론트엔드 개발자"
                    value={jobseeker.desiredRole}
                    onChange={(v) => setJobseeker((p) => ({ ...p, desiredRole: v }))}
                    error={errors.desiredRole}
                  />
                  <Field
                    label="경력"
                    type="select"
                    value={jobseeker.experience}
                    onChange={(v) => setJobseeker((p) => ({ ...p, experience: v }))}
                    options={["신입", "1~3년", "3~5년", "5년 이상"]}
                  />
                  <Field
                    label="기술 스택"
                    placeholder="예) React, TypeScript, Node.js"
                    value={jobseeker.skills}
                    onChange={(v) => setJobseeker((p) => ({ ...p, skills: v }))}
                    error={errors.skills}
                  />
                  <Field
                    label="포트폴리오/깃허브(선택)"
                    placeholder="https://"
                    value={jobseeker.portfolio}
                    onChange={(v) => setJobseeker((p) => ({ ...p, portfolio: v }))}
                  />
                  <Field
                    label="근무 형태"
                    type="select"
                    value={jobseeker.workType}
                    onChange={(v) => setJobseeker((p) => ({ ...p, workType: v }))}
                    options={["무관", "재택", "출근", "혼합"]}
                  />
                  <Field
                    label="희망 연봉"
                    type="select"
                    value={jobseeker.salaryRange}
                    onChange={(v) => setJobseeker((p) => ({ ...p, salaryRange: v }))}
                    options={["협의", "2,000~3,000", "3,000~4,000", "4,000~5,000", "5,000+"]}
                  />
                </>
              )}
            </div>

            <label className={`agree ${errors.agree ? "has-error" : ""}`}>
              <input
                type="checkbox"
                checked={common.agree}
                onChange={(e) => setCommon((p) => ({ ...p, agree: e.target.checked }))}
              />
              <span>
                (필수) 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
              </span>
            </label>
            {errors.agree && <p className="err">{errors.agree}</p>}

            <div className="actions">
              <button className="btn ghost" type="button" onClick={() => history.back()}>
                뒤로가기
              </button>
              <button className="btn primary" type="submit" disabled={!canSubmit}>
                {role === "company" ? "기업 회원가입" : "구직자 회원가입"}
              </button>
            </div>

            <div className="footer-hint">
              이미 계정이 있나요? <a href="/login">로그인</a>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  autoComplete,
  options = [],
}) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label className="field-label">{label}</label>

      {type === "select" ? (
        <select
          className="control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((op) => (
            <option key={op} value={op}>
              {op === "" ? "선택" : op}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
        />
      )}

      {error && <p className="err">{error}</p>}
    </div>
  );
}
