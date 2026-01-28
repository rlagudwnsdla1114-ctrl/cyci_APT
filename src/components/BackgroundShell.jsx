import "./BackgroundShell.css";

export default function BackgroundShell({ children, type = "jobseeker" }) {
  return (
    <div className={`bg-shell ${type === "company" ? "company" : "jobseeker"}`}>
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />
      <div className="bg-orb orb3" />
      <div className="bg-noise" />
      <div className="bg-content">{children}</div>
    </div>
  );
}
