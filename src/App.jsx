import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/intro/Splash";
import MemberSelect from "./pages/Choice/MemberSelect";
import JobSeekerDashboard from "./pages/JobSeekerDashboard/JobSeekerDashboard";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import CompanyDashboard from "./pages/CompanyDashboard/CompanyDashboard";
import ResumeCreate from "./pages/ResumeCreate/ResumeCreate";
import HelpWantedList from "./pages/HelpWanted/List";
import HelpWantedDetail from "./pages/HelpWanted/Detail";
import HelpWantedCreate from "./pages/HelpWanted/Create";
import AIRecommendedTalent from "./pages/AIRecommendedTalent/AIRecommendedTalent";
import AIRecommendedCompany from "./pages/AIRecommendedCompany/AIRecommendedCompany";
import MockInterview from "./pages/MockInterview/MockInterview";
import AiInterviewHistory from "./pages/AiInterviewHistory/AiInterviewHistory";
import AiMatchingCompany from "./pages/AiMatchingCompany/AiMatchingCompany";
import AiMatchingJob from "./pages/AiMatchingJob/AiMatchingJob";
import Management from "./pages/ApplicantManagement/ApplicantManagement";

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

        {/*기업 AI 매칭*/}
        <Route path="/ai-talent" element={<AIRecommendedTalent />} />
        {/*구직자 AI 매칭*/}
        <Route path="/ai-match" element={<AIRecommendedCompany />} />
        {/*구직자 AI 면접*/}
        <Route path="/mock" element={<MockInterview />} />

        {/*면접 결과보기*/}
        <Route path="/ai-view" element={<AiInterviewHistory />} />
        {/*(회사) AI 매칭 결과*/}
        <Route path="/ai-com" element={<AiMatchingCompany />} />
        {/*(구직자) AI 매칭 결과*/}
        <Route path="/ai-job" element={<AiMatchingJob />} />

        {/*(기업) 지원자 관리*/}
        <Route path="/management" element={<Management />} />
      </Routes>
    </BrowserRouter>
  );
}