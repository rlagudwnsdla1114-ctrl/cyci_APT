import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import "./Splash.css";

export default function Splash() {
  const nav = useNavigate();

  useEffect(() => {
    // 3.8초 애니메이션 종료 후 회원 선택(Choice) 페이지로 이동
    const t = setTimeout(() => {
      nav("/select", { replace: true }); 
    }, 3800);

    return () => clearTimeout(t);
  }, [nav]);

  return (
    <BackgroundShell>
      <div className="sp-page">
        <div className="sp-stack" aria-label="스플래시 문구">
          <div className="sp-line l1">취업을 찾으시나요?</div>
          <div className="sp-line l2">직원을 찾으세요?</div>
          <div className="sp-line l3">여기서 한번에 다 해결하세요</div>
        </div>
      </div>
    </BackgroundShell>
  );
}