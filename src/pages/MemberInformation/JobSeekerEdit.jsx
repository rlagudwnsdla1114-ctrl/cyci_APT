// src/pages/JobSeekerEdit/JobSeekerEdit.jsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./EditProfile.css";

export default function JobSeekerEdit() {
  const nav = useNavigate();
  
  // 초기 데이터 (실제 구현 시 API로 DB의 JOBSEEKER_USERS 데이터를 가져와야 함)
  const [formData, setFormData] = useState({
    JOBSEEKER_EMAIL: "seeker@example.com", 
    JOBSEEKER_NAME: "구직자 샘플",
    JOBSEEKER_BIRTH: "19980505",
    JOBSEEKER_PHONE: "010-0000-0000",
  });

  const errors = useMemo(() => {
    const e = {};
    if (!formData.JOBSEEKER_NAME) e.JOBSEEKER_NAME = "이름을 입력해 주세요.";
    if (formData.JOBSEEKER_BIRTH.length !== 8) e.JOBSEEKER_BIRTH = "생년월일 8자리를 입력해 주세요.";
    if (!formData.JOBSEEKER_PHONE) e.JOBSEEKER_PHONE = "전화번호를 입력해 주세요.";
    return e;
  }, [formData]);

  const canSubmit = Object.keys(errors).length === 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    // DB 업데이트용 페이로드
    console.log("UPDATE JOBSEEKER_USERS SET ...", formData);
    alert("회원 정보가 수정되었습니다.");
    nav("/jobseeker");
  };

  return (
    <BackgroundShell>
      <div className="signup-page">
        <main className="signup-shell">
          <section className="signup-card">
            <header className="signup-header">
              <h1 className="signup-title">회원 정보 수정</h1>
              <p className="signup-sub">구직자님의 정보를 최신으로 유지하세요.</p>
            </header>

            <form className="signup-form" onSubmit={onSubmit}>
              <div className="grid">
                <Field label="이메일" value={formData.JOBSEEKER_EMAIL} disabled />
                <Field
                  label="이름"
                  value={formData.JOBSEEKER_NAME}
                  onChange={(v) => setFormData((p) => ({ ...p, JOBSEEKER_NAME: v }))}
                  error={errors.JOBSEEKER_NAME}
                />
                <Field
                  label="생년월일"
                  placeholder="예) 19980505"
                  value={formData.JOBSEEKER_BIRTH}
                  onChange={(v) => setFormData((p) => ({ ...p, JOBSEEKER_BIRTH: v.replace(/[^0-9]/g, "") }))}
                  error={errors.JOBSEEKER_BIRTH}
                  maxLength={8}
                />
                <Field
                  label="전화번호"
                  placeholder="010-0000-0000"
                  value={formData.JOBSEEKER_PHONE}
                  onChange={(v) => setFormData((p) => ({ ...p, JOBSEEKER_PHONE: v }))}
                  error={errors.JOBSEEKER_PHONE}
                />
              </div>

              <div className="actions" style={{ marginTop: "2rem" }}>
                <button className="btn ghost" type="button" onClick={() => nav(-1)}>취소</button>
                <button className="btn primary" type="submit" disabled={!canSubmit}>저장하기</button>
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