// src/pages/JobSeekerEdit/JobSeekerEdit.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./EditProfile.css";
import { api } from "../../api/api"; // ✅ api.js 사용

export default function JobSeekerEdit() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  // ✅ DTO 필드명(jEmail, jName...) 그대로 사용
  const [formData, setFormData] = useState({
    jEmail: "",
    jName: "",
    jBirth: "",
    jPhone: "",
  });

  // ✅ 최초 로드시 구직자정보 조회 (백엔드가 POST라서 POST)
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setServerMsg("");

      try {
        const res = await api.post("/api/user/getJobseekerInfo"); // body 없음
        if (!alive) return;

        const dto = res.data; // MemberDTO (jIdx, jEmail, jName, jBirth, jPhone ...)
        setFormData((p) => ({
          ...p,
          jEmail: dto?.jEmail ?? "",
          jName: dto?.jName ?? "",
          jBirth: (dto?.jBirth ?? "").replace(/[^0-9]/g, "").slice(0, 8),
          jPhone: dto?.jPhone ?? "",
        }));
      } catch (err) {
        if (!alive) return;

        const msg =
          err?.response?.data ||
          err?.response?.data?.message ||
          err?.message ||
          "조회 중 오류가 발생했습니다.";

        setServerMsg(typeof msg === "string" ? msg : "조회 중 오류가 발생했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const errors = useMemo(() => {
    const e = {};
    if (!formData.jName) e.jName = "이름을 입력해 주세요.";
    if (!formData.jBirth || formData.jBirth.length !== 8) e.jBirth = "생년월일 8자리를 입력해 주세요.";
    if (!formData.jPhone) e.jPhone = "전화번호를 입력해 주세요.";
    return e;
  }, [formData]);

  const canSubmit = !loading && !submitting && Object.keys(errors).length === 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setServerMsg("");

    // ✅ mapper가 쓰는 key: jName, jBirth, jPhone (jIdx는 서버에서 userIdx로 set)
    const payload = {
      jName: formData.jName,
      jBirth: formData.jBirth,
      jPhone: formData.jPhone,
    };

    try {
      const res = await api.post("/api/user/EditJobseekerUser", payload);
      alert(typeof res.data === "string" ? res.data : "회원 정보가 수정되었습니다.");
      nav("/jobseeker");
    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "수정 중 오류가 발생했습니다.";

      setServerMsg(typeof msg === "string" ? msg : "수정 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackgroundShell>
      <div className="signup-page">
        <main className="signup-shell">
          <section className="signup-card">
            <header className="signup-header">
              <h1 className="signup-title">회원 정보 수정</h1>
              <p className="signup-sub">구직자님의 정보를 최신으로 유지하세요.</p>

              {loading && <p className="signup-sub">불러오는 중...</p>}

              {!loading && serverMsg && (
                <p className="err" style={{ marginTop: "0.75rem" }}>
                  {serverMsg}
                </p>
              )}
            </header>

            <form className="signup-form" onSubmit={onSubmit}>
              <div className="grid">
                <Field label="이메일" value={formData.jEmail} disabled />

                <Field
                  label="이름"
                  value={formData.jName}
                  onChange={(v) => setFormData((p) => ({ ...p, jName: v }))}
                  error={errors.jName}
                  disabled={loading || submitting}
                />

                <Field
                  label="생년월일"
                  placeholder="예) 19980505"
                  value={formData.jBirth}
                  onChange={(v) =>
                    setFormData((p) => ({
                      ...p,
                      jBirth: v.replace(/[^0-9]/g, "").slice(0, 8),
                    }))
                  }
                  error={errors.jBirth}
                  maxLength={8}
                  disabled={loading || submitting}
                />

                <Field
                  label="전화번호"
                  placeholder="010-0000-0000"
                  value={formData.jPhone}
                  onChange={(v) => setFormData((p) => ({ ...p, jPhone: v }))}
                  error={errors.jPhone}
                  disabled={loading || submitting}
                />
              </div>

              <div className="actions" style={{ marginTop: "2rem" }}>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => nav(-1)}
                  disabled={loading || submitting}
                >
                  취소
                </button>
                <button className="btn primary" type="submit" disabled={!canSubmit}>
                  {submitting ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </BackgroundShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  options = [],
  maxLength,
  disabled,
}) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label className="field-label">{label}</label>
      {type === "select" ? (
        <select
          className="control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
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
          maxLength={maxLength}
          disabled={disabled}
        />
      )}
      {error && <p className="err">{error}</p>}
    </div>
  );
}
