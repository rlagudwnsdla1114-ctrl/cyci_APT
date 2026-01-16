import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import BackgroundShell from "../../components/BackgroundShell";
import "./Login.css";

export default function Login() {
  const nav = useNavigate();
  const [role, setRole] = useState("jobseeker"); // 'jobseeker' | 'company'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const logindata =
  role === "company"
    ? { companyEmail: email, companyPassword: password }
    : { jobseekerEmail: email, jobseekerPassword: password };

    // [핵심 1] 역할에 따라 요청 보낼 주소 결정
    const loginUrl = role === "company" 
      ? "/api/company/login" 
      : "/api/jobseeker/login";

    try {
      // 결정된 주소(loginUrl)로 요청 전송
      const response = await api.post(loginUrl, logindata);

      if(response.status === 200) {
        console.log("로그인 성공");
        
        // [핵심 2] 백엔드에서 객체({token: "..."})가 아니라 문자열("apple_...")을 바로 줌
        // response.data.token이 아니라 response.data를 저장해야 함
      const token = response.data?.data;

        // 토큰이 비어있으면 로그인 실패 처리 (백엔드에서 null 리턴 시)
        if (!token) {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
            return;
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", role); 
        localStorage.setItem("token", token); // 문자열 토큰 저장

        alert("로그인에 성공!");
        
        // 페이지 이동
        if (role === "company") {
          nav("/company-dashboard");
        } else { 
          nav("/jobseeker");
        }
      }
    }  catch (error) {
      if (error.response?.status === 401) {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        return;
      }
      console.error(error);
      alert("로그인 처리 중 오류가 발생했습니다."); 
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