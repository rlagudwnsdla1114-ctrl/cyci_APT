import { useMemo, useState } from "react";
// [변경 전] import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// [추가] useNavigate: 회원가입 성공 후 로그인 페이지로 이동하기 위해 추가
import axios from "axios";
// [추가] axios: API 호출을 위해 추가
import "./Signup.css";

export default function Signup() {
  const nav = useNavigate();
  // [추가] nav: 회원가입 성공 후 페이지 이동을 위해 추가
  const [role, setRole] = useState("jobseeker"); // "company" | "jobseeker"
  const [isLoading, setIsLoading] = useState(false);
  // [추가] isLoading: API 호출 중 로딩 상태를 관리하기 위해 추가

  const [common, setCommon] = useState({
    email: "",
    password: "",
    password2: "",
    region: "",
    agree: false,
  });

  const [jobseeker, setJobseeker] = useState({
    name: "",
    birthDate: "",
    phone: "",
  });

  const [company, setCompany] = useState({
    companyName: "",
    bizNumber: "",
    bizPhone: "",
    companySize: "1~10명",
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
      if (!company.bizPhone) e.bizPhone = "대표번호를 입력해 주세요.";
    } else {
      if (!jobseeker.name) e.name = "이름을 입력해 주세요.";
      if (jobseeker.birthDate.length !== 8) e.birthDate = "생년월일 8자리를 입력해 주세요 (예: 19980505).";
      if (!jobseeker.phone) e.phone = "전화번호를 입력해 주세요.";
    }

    return e;
  }, [role, common, company, jobseeker]);

  const canSubmit = Object.keys(errors).length === 0;

  // [변경 전] const onSubmit = (e) => {
  //   e.preventDefault();
  //   if (!canSubmit) return;
  //
  //   console.log("SIGNUP PAYLOAD:", { role, ...fields });
  //   alert(role === "company" ? "기업 회원가입 완료" : "구직자 회원가입 완료");
  // };

  // [변경 후] async/await를 사용하여 axios로 API 호출하도록 변경
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;

    setIsLoading(true);

    try {
      const payload = {
        role,
        email: common.email,
        password: common.password,
        region: common.region,
        ...(role === "company"
          ? {
              companyName: company.companyName,
              bizNumber: company.bizNumber,
              bizPhone: company.bizPhone,
              companySize: company.companySize,
            }
          : {
              name: jobseeker.name,
              birthDate: jobseeker.birthDate,
              phone: jobseeker.phone,
            }),
      };

      // [변경 전] "http://localhost:8080/api/auth/signup"
      // [변경 후] role에 따라 다른 엔드포인트 사용
      // - 기업: "http://localhost:8080/api/signup/companyusersignup"
      // - 구직자: "http://localhost:8080/api/signup/jobseekerusersignup"
      const endpoint = role === "company" 
        ? "http://localhost:8080/api/member/companyusersignup"
        : "http://localhost:8080/api/member/jobseekerusersignup";
      
      const response = await axios.post(
        endpoint,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("회원가입 성공:", response.data);
      alert(role === "company" ? "기업 회원가입이 완료되었습니다." : "구직자 회원가입이 완료되었습니다.");
      nav("/login");
      // [추가] 회원가입 성공 시 로그인 페이지로 이동
    } catch (error) {
      console.error("회원가입 실패:", error);
      // [추가] 에러 처리 로직 추가
      if (error.response) {
        // 서버에서 에러 응답이 온 경우
        const errorMessage = error.response.data?.message || error.response.data?.error || "회원가입에 실패했습니다.";
        alert(errorMessage);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        alert("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        // 요청 설정 중 에러가 발생한 경우
        alert("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
      // [추가] 로딩 상태 해제
    }
  };

  return (
    <div className="signup-page">
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
              {/* 공통 필드 */}
              <Field
                label="이메일"
                placeholder="example@domain.com"
                value={common.email}
                onChange={(v) => setCommon((p) => ({ ...p, email: v }))}
                error={errors.email}
                type="email"
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
                type="password"
                placeholder="8자 이상"
                value={common.password}
                onChange={(v) => setCommon((p) => ({ ...p, password: v }))}
                error={errors.password}
              />
              <Field
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호 다시 입력"
                value={common.password2}
                onChange={(v) => setCommon((p) => ({ ...p, password2: v }))}
                error={errors.password2}
              />

              {/* 역할별 필드 */}
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
                    label="기업 대표번호"
                    placeholder="예) 02-1234-5678"
                    value={company.bizPhone}
                    onChange={(v) => setCompany((p) => ({ ...p, bizPhone: v }))}
                    error={errors.bizPhone}
                  />
                  <Field
                    label="규모"
                    type="select"
                    value={company.companySize}
                    onChange={(v) => setCompany((p) => ({ ...p, companySize: v }))}
                    options={["1~10명", "11~50명", "51~200명", "201~1000명", "1000명 이상"]}
                  />
                </>
              ) : (
                <>
                  <Field
                    label="이름"
                    placeholder="이름을 입력해 주세요"
                    value={jobseeker.name}
                    onChange={(v) => setJobseeker((p) => ({ ...p, name: v }))}
                    error={errors.name}
                  />
                  <Field
                    label="생년월일"
                    placeholder="예) 19980505 (8자리)"
                    value={jobseeker.birthDate}
                    onChange={(v) => setJobseeker((p) => ({ ...p, birthDate: v.replace(/[^0-9]/g, "") }))}
                    error={errors.birthDate}
                    maxLength={8}
                  />
                  <Field
                    label="전화번호"
                    placeholder="010-0000-0000"
                    value={jobseeker.phone}
                    onChange={(v) => setJobseeker((p) => ({ ...p, phone: v }))}
                    error={errors.phone}
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
              <span> (필수) 서비스 이용약관 및 개인정보 처리방침에 동의합니다. </span>
            </label>
            {errors.agree && <p className="err">{errors.agree}</p>}

            <div className="actions">
              <button className="btn ghost" type="button" onClick={() => window.history.back()}>
                뒤로가기
              </button>
              {/* [변경 전] <button className="btn primary" type="submit" disabled={!canSubmit}> */}
              {/* [변경 후] isLoading 상태 추가 및 로딩 중 버튼 텍스트 변경 */}
              <button className="btn primary" type="submit" disabled={!canSubmit || isLoading}>
                {isLoading ? "처리 중..." : role === "company" ? "기업 회원가입" : "구직자 회원가입"}
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

function Field({ label, value, onChange, placeholder, error, type = "text", options = [], maxLength }) {
  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label className="field-label">{label}</label>
      {type === "select" ? (
        <select className="control" value={value} onChange={(e) => onChange(e.target.value)}>
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
        />
      )}
      {error && <p className="err">{error}</p>}
    </div>
  );
}