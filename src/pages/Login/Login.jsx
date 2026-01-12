import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; 
import BackgroundShell from "../../components/BackgroundShell";
import "./Login.css";

export default function Login() {
  const nav = useNavigate();
  const [role, setRole] = useState("jobseeker"); // 'jobseeker' | 'company'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // [테스트용] 로그인 로직 (role에 따라 분기 처리가 필요하다면 여기서 활용)
    console.log(`로그인 시도 - 유형: ${role}, 이메일: ${email}`);
    
    localStorage.setItem("isLoggedIn", "true"); 
    localStorage.setItem("userRole", role); // 역할도 저장해두면 추후 활용 가능

    // 역할에 따라 이동 경로를 다르게 설정할 수도 있습니다.
    if (role === "company") {
       nav("/company"); // 기업 메인 페이지 예시
    } else {
       nav("/jobseeker");
    }
  };

  return (
    <BackgroundShell>
      <div className="lg-page">
        <div className="lg-card">
          <div className="lg-head">
            <div className="lg-title">로그인</div>
            <div className="lg-sub">계정으로 접속해 서비스를 이용하세요</div>
          </div>

          {/* 구직자/기업 선택 토글 (Signup 스타일 차용) */}
          <div className={`lg-segmented ${role}`}>
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
            <span className="lg-seg-indicator" aria-hidden="true" />
          </div>

          <form className="lg-form" onSubmit={handleLoginSubmit}>
            <label className="lg-field">
              <span>{role === "company" ? "기업 이메일" : "이메일"}</span>
              <input 
                type="email" 
                placeholder="example@email.com" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
              />
            </label>
            <label className="lg-field">
              <span>비밀번호</span>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required 
              />
            </label>
            <button className="lg-btn" type="submit">
              {role === "company" ? "기업 로그인" : "구직자 로그인"}
            </button>

            <div className="lg-foot">
              <button type="button" className="lg-link" onClick={() => nav("/signup")}>회원가입</button>
              <button type="button" className="lg-link" onClick={() => nav("/select")}>회원 선택으로</button>
            </div>
          </form>
        </div>
      </div>
    </BackgroundShell>
  );
}