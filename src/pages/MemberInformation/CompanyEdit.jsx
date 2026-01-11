// src/pages/CompanyEdit/CompanyEdit.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./EditProfile.css";

export default function CompanyEdit() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    COMPANY_EMAIL: "company@example.com",
    COMPANY_NAME: "이음컴퍼니",
    COMPANY_REGISTRATION: "123-45-67890",
    COMPANY_PHONE: "02-1234-5678",
    COMPANY_SIZE: "11~50명",
    COMPANY_REGION: "서울",
  });

  const errors = useMemo(() => {
    const e = {};
    if (!formData.COMPANY_NAME) e.COMPANY_NAME = "기업명을 입력해 주세요.";
    if (!formData.COMPANY_REGISTRATION) e.COMPANY_REGISTRATION = "사업자등록번호를 입력해 주세요.";
    if (!formData.COMPANY_PHONE) e.COMPANY_PHONE = "대표번호를 입력해 주세요.";
    return e;
  }, [formData]);

  const canSubmit = Object.keys(errors).length === 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    console.log("UPDATE COMPANY_USERS SET ...", formData);
    alert("기업 정보가 수정되었습니다.");
    nav("/company-dashboard");
  };

  return (
    <BackgroundShell>
      <div className="signup-page">
        <main className="signup-shell">
          <section className="signup-card">
            <header className="signup-header">
              <h1 className="signup-title">기업 정보 수정</h1>
              <p className="signup-sub">기업 정보를 최신 상태로 관리하세요.</p>
            </header>

            <form className="signup-form" onSubmit={onSubmit}>
              <div className="grid">
                <Field label="계정 이메일" value={formData.COMPANY_EMAIL} disabled />
                <Field
                  label="기업명"
                  value={formData.COMPANY_NAME}
                  onChange={(v) => setFormData((p) => ({ ...p, COMPANY_NAME: v }))}
                  error={errors.COMPANY_NAME}
                />
                <Field
                  label="사업자등록번호"
                  value={formData.COMPANY_REGISTRATION}
                  onChange={(v) => setFormData((p) => ({ ...p, COMPANY_REGISTRATION: v }))}
                  error={errors.COMPANY_REGISTRATION}
                />
                <Field
                  label="기업 대표번호"
                  value={formData.COMPANY_PHONE}
                  onChange={(v) => setFormData((p) => ({ ...p, COMPANY_PHONE: v }))}
                  error={errors.COMPANY_PHONE}
                />
                <Field
                  label="기업 규모"
                  type="select"
                  value={formData.COMPANY_SIZE}
                  onChange={(v) => setFormData((p) => ({ ...p, COMPANY_SIZE: v }))}
                  options={["1~10명", "11~50명", "51~200명", "201~1000명", "1000명 이상"]}
                />
                 <Field
                  label="지역"
                  type="select"
                  value={formData.COMPANY_REGION}
                  onChange={(v) => setFormData((p) => ({ ...p, COMPANY_REGION: v }))}
                  options={["", "서울", "경기", "인천", "대전", "대구", "부산", "광주", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]}
                />
              </div>

              <div className="actions" style={{ marginTop: "2rem" }}>
                <button className="btn ghost" type="button" onClick={() => nav(-1)}>취소</button>
                <button className="btn primary" type="submit" disabled={!canSubmit}>수정 완료</button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </BackgroundShell>
  );
}

function Field({ label, value, onChange, placeholder, error, type = "text", options = [], maxLength, disabled }) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label className="field-label">{label}</label>
      {type === "select" ? (
        <select className="control" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
          {options.map((op) => (
            <option key={op} value={op}>{op === "" ? "선택" : op}</option>
          ))}
        </select>
      ) : (
        <input
          className="control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          disabled={disabled}
        />
      )}
      {error && <p className="err">{error}</p>}
    </div>
  );
}