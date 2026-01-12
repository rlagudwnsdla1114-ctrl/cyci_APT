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
import CompanyPostList from "./pages/CompanyPostList/CompanyPostList";
import CompanyPostDetail from "./pages/CompanyPostDetail/CompanyPostDetail";
import JobDetail from "./pages/JobDetail/JobDetail";
import TalentProfileDetail from './pages/TalentProfileDetail/TalentProfileDetail';
import CEdit from "./pages/MemberInformation/CompanyEdit";
import Jedit from './pages/MemberInformation/JobSeekerEdit';
import MyActivity from './pages/MyActivity/MyActivity';

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
        
        {/*(기업) 내 공고 목록들*/}
        <Route path="/postlist" element={<CompanyPostList />} />
        {/*(기업) 내 공고 상세보기*/}
        <Route path="/postdetail" element={<CompanyPostDetail />} />

        {/*(구직자) 채용 공고 상세페이지*/}
        <Route path="/job-detail/:id" element={<JobDetail />} />
        {/*(기업) 구직자 상세 페이지*/}
        <Route path="/talent-detail/:id" element={<TalentProfileDetail />} />

        {/*(기업) 회원 정보 수정*/}
        <Route path="/cedit" element={<CEdit />} />
        {/*(구직자) 회원 정보 수정*/}
        <Route path="/jedit" element={<Jedit />} />

        {/*(구직자) 내 지원 현황보기*/}
        <Route path="/myactivity" element={<MyActivity />} />
        {/*(기업) 지원자 관리*/}
        <Route path="/management" element={<Management />} />
      </Routes>
    </BrowserRouter>
  );
}