import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; 
import BackgroundShell from "../../components/BackgroundShell";
import "./Login.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    /* // [Axios 연동 및 로그인 상태 저장 로직]
    const response = await axios.post("http://localhost:8080/api/login", {
      email: email,
      password: password
    });

    const { accountTypeIdx, token } = response.data;
    
    // 로그인 성공 시 로컬 스토리지 등에 상태 저장
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", accountTypeIdx); 

    if (accountTypeIdx === 1) {
      nav("/jobseeker", { replace: true });
    } else if (accountTypeIdx === 2) {
      nav("/company-dashboard", { replace: true });
    }
    */

    // [테스트용] 로그인 버튼 누르면 일단 구직자 페이지로 이동
    localStorage.setItem("isLoggedIn", "true"); // 임시로 로그인 상태 저장
    nav("/jobseeker");
  };

  return (
    <BackgroundShell>
      <div className="lg-page">
        <div className="lg-card">
          <div className="lg-head">
            <div className="lg-title">로그인</div>
            <div className="lg-sub">계정으로 접속해 서비스를 이용하세요</div>
          </div>

          <form className="lg-form" onSubmit={handleLoginSubmit}>
            <label className="lg-field">
              <span>이메일</span>
              <input type="email" placeholder="example@email.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </label>
            <label className="lg-field">
              <span>비밀번호</span>
              <input type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </label>
            <button className="lg-btn" type="submit">로그인</button>

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