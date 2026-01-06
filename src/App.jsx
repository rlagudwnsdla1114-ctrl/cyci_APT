import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/intro/Splash";
import MemberSelect from "./pages/Choice/MemberSelect"; // 다시 추가
import JobSeekerDashboard from "./pages/JobSeekerDashboard/JobSeekerDashboard";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import CompanyDashboard from "./pages/CompanyDashboard/CompanyDashboard";
import ResumeCreate from "./pages/ResumeCreate/ResumeCreate";
import HelpWantedList from "./pages/HelpWanted/List";
import HelpWantedDetail from "./pages/HelpWanted/Detail";
import HelpWantedCreate from "./pages/HelpWanted/Create";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        
        {/* 다시 살려낸 회원 선택 페이지 */}
        <Route path="/select" element={<MemberSelect />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/jobseeker" element={<JobSeekerDashboard />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />

        <Route path="/resume-create" element={<ResumeCreate />} />
        <Route path="/helpwanted" element={<HelpWantedList />} />
        <Route path="/helpwanted/create" element={<HelpWantedCreate />} />
        <Route path="/helpwanted/:id" element={<HelpWantedDetail />} />
      </Routes>
    </BrowserRouter>
  );
}