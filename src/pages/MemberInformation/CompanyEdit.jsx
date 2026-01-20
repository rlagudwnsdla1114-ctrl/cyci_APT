// src/pages/CompanyEdit/CompanyEdit.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./EditProfile.css";
import { api } from "../../api/api"; // ✅ 네가 올린 api.js 사용

export default function CompanyEdit() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  // ✅ DTO 필드명(cEmail, cName...) 그대로 사용
  const [formData, setFormData] = useState({
    cEmail: "",
    cName: "",
    cRegistration: "",
    cPhone: "",
    cSize: "11~50명",
    cRegion: "서울",
  });

  // ✅ 최초 로드시 회사정보 조회 (백엔드가 POST라서 POST)
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setServerMsg("");

      try {
        const res = await api.post("/api/user/getCompanyInfo"); // body 없음
        console.log(res);
        // res.data = MemberDTO (cIdx, cEmail, cName ...)
        if (!alive) return;

        const dto = res.data;
        setFormData((p) => ({
          ...p,
          cEmail: dto?.cEmail ?? "",
          cName: dto?.cName ?? "",
          cRegistration: dto?.cRegistration ?? "",
          cPhone: dto?.cPhone ?? "",
          cSize: dto?.cSize ?? "11~50명",
          cRegion: dto?.cRegion ?? "서울",
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
    if (!formData.cName) e.cName = "기업명을 입력해 주세요.";
    if (!formData.cRegistration) e.cRegistration = "사업자등록번호를 입력해 주세요.";
    if (!formData.cPhone) e.cPhone = "대표번호를 입력해 주세요.";
    return e;
  }, [formData]);

  const canSubmit = !loading && !submitting && Object.keys(errors).length === 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setServerMsg("");

    // ✅ mapper가 쓰는 key: cName, cRegistration, cPhone, cSize, cRegion (cIdx는 서버에서 userIdx로 set)
    const payload = {
      cName: formData.cName,
      cRegistration: formData.cRegistration,
      cPhone: formData.cPhone,
      cSize: formData.cSize,
      cRegion: formData.cRegion,
    };

    try {
      const res = await api.post("/api/user/EditCompanyUser", payload);
      alert(typeof res.data === "string" ? res.data : "기업 정보가 수정되었습니다.");
      nav("/company-dashboard");
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
              <h1 className="signup-title">기업 정보 수정</h1>
              <p className="signup-sub">기업 정보를 최신 상태로 관리하세요.</p>

              {loading && <p className="signup-sub">불러오는 중...</p>}

              {!loading && serverMsg && (
                <p className="err" style={{ marginTop: "0.75rem" }}>
                  {serverMsg}
                </p>
              )}
            </header>

            <form className="signup-form" onSubmit={onSubmit}>
              <div className="grid">
                <Field label="계정 이메일" value={formData.cEmail} disabled />

                <Field
                  label="기업명"
                  value={formData.cName}
                  onChange={(v) => setFormData((p) => ({ ...p, cName: v }))}
                  error={errors.cName}
                  disabled={loading || submitting}
                />

                <Field
                  label="사업자등록번호"
                  value={formData.cRegistration}
                  onChange={(v) => setFormData((p) => ({ ...p, cRegistration: v }))}
                  error={errors.cRegistration}
                  disabled={loading || submitting}
                />

                <Field
                  label="기업 대표번호"
                  value={formData.cPhone}
                  onChange={(v) => setFormData((p) => ({ ...p, cPhone: v }))}
                  error={errors.cPhone}
                  disabled={loading || submitting}
                />

                <Field
                  label="기업 규모"
                  type="select"
                  value={formData.cSize}
                  onChange={(v) => setFormData((p) => ({ ...p, cSize: v }))}
                  options={["1~10명", "11~50명", "51~200명", "201~1000명", "1000명 이상"]}
                  disabled={loading || submitting}
                />

                <Field
                  label="지역"
                  type="select"
                  value={formData.cRegion}
                  onChange={(v) => setFormData((p) => ({ ...p, cRegion: v }))}
                  options={[
                    "",
                    "서울",
                    "경기",
                    "인천",
                    "대전",
                    "대구",
                    "부산",
                    "광주",
                    "세종",
                    "강원",
                    "충북",
                    "충남",
                    "전북",
                    "전남",
                    "경북",
                    "경남",
                    "제주",
                  ]}
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
                  {submitting ? "저장 중..." : "수정 완료"}
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
        <select className="control" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
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
