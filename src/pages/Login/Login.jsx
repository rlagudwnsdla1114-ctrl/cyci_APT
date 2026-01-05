import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./Login.css";

export default function Login() {
  const nav = useNavigate();

  return (
    <BackgroundShell>
      <div className="lg-page">
        <div className="lg-card">
          <div className="lg-head">
            <div className="lg-title">로그인</div>
            <div className="lg-sub">계정으로 접속해 서비스를 이용하세요</div>
          </div>

          <form
            className="lg-form"
            onSubmit={(e) => {
              e.preventDefault();
              // 데모: 일단 로그인 성공 처리 대신 이동만
              nav("/jobseeker");
            }}
          >
            <label className="lg-field">
              <span>이메일</span>
              <input type="email" placeholder="example@email.com" required />
            </label>

            <label className="lg-field">
              <span>비밀번호</span>
              <input type="password" placeholder="••••••••" required />
            </label>

            <button className="lg-btn" type="submit">로그인</button>

            <div className="lg-foot">
              <button type="button" className="lg-link" onClick={() => nav("/signup")}>
                회원가입
              </button>
              <button type="button" className="lg-link" onClick={() => nav("/select")}>
                회원 선택으로
              </button>
            </div>
          </form>
        </div>
      </div>
    </BackgroundShell>
  );
}
