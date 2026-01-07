import { useState, useEffect, use } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundShell from "../../components/BackgroundShell";
import axios from "axios"; 
import "./ResumeCreate.css";

const JOB_CATEGORIES = [
  { id: "dev", label: "💻 개발 · 데이터", sub: ["프론트엔드", "백엔드", "풀스택", "iOS/Android", "AI/머신러닝", "데이터 엔지니어", "DevOps", "보안"] },
  { id: "design", label: "🎨 디자인", sub: ["UI/UX 디자인", "웹 디자인", "그래픽", "3D/영상", "브랜드", "패키지"] },
  { id: "business", label: "📊 기획 · 전략", sub: ["PM/PO", "사업개발", "전략기획", "경영지원", "데이터분석", "컨설팅"] },
  { id: "marketing", label: "📢 마케팅", sub: ["디지털 마케팅", "콘텐츠", "브랜드", "퍼포먼스", "PR/홍보", "카피라이터"] },
  { id: "sales", label: "🤝 영업", sub: ["기업영업(B2B)", "해외영업", "기술영업", "고객상담(CS)", "매장관리"] },
  { id: "finance", label: "💰 금융 · 회계", sub: ["회계/재무", "세무", "투자/심사", "금융사무", "인사(HR)"] },
  { id: "eng", label: "⚙️ 엔지니어링", sub: ["기계설계", "전자/제어", "생산관리", "품질관리(QA)", "건설/토목"] },
  { id: "medical", label: "🏥 의료 · 바이오", sub: ["의료사무", "간호/간병", "제약/바이오", "임상연구", "식품/영양"] },
];

const REGIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "해외"];
const EDU_TYPES = ["고등학교 졸업", "대학(2,3년) 졸업", "대학교(4년) 졸업", "대학원(석사) 졸업", "대학원(박사) 졸업"];
const MILITARY_TYPES = ["군필", "미필", "면제", "해당없음"];

export default function ResumeCreate() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
   const [form, setForm] = useState({
    jobseekerName: "",
    jobseekerEmail: "",
    jobseekerPhone: "",
    jobseekerBirth: "",
  });

  
  useEffect(() => {
      axios.get('http://localhost:8080/api/cover/userinfo', {
        withCredentials: true,
      })
      .then(res => {
        console.log(res.data);
        setForm(res.data);
      });
  },  []);
  


  // 데이터 상태
  const [basicInfo, setBasicInfo] = useState({ name: "", birthday: "", email: "", phone: "", address: "" });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [educationList, setEducationList] = useState([{ type: "", name: "", major: "", status: "", date: "" }]);
  const [military, setMilitary] = useState({ type: "미필", rank: "", reason: "" });
  const [careerList, setCareerList] = useState([]);
  const [certList, setCertList] = useState([]);
  const [langList, setLangList] = useState([]);
  const [skills, setSkills] = useState("");
  const [intro, setIntro] = useState({ motivation: "", growth: "", personality: "", crisis: "" });

  // 핸들러
  const handleBasicChange = (e) => setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  const handleSubToggle = (sub) => {
    selectedSub.includes(sub) ? setSelectedSub(selectedSub.filter(s => s !== sub)) : setSelectedSub([...selectedSub, sub]);
  };
  const handleRegionToggle = (reg) => {
    selectedRegions.includes(reg) ? setSelectedRegions(selectedRegions.filter(r => r !== reg)) : setSelectedRegions([...selectedRegions, reg]);
  };
  const updateList = (setFunc, list, idx, field, val) => {
    const newList = [...list]; newList[idx][field] = val; setFunc(newList);
  };
  const addToList = (setFunc, list, template) => setFunc([...list, template]);
  const removeFromList = (setFunc, list, idx) => setFunc(list.filter((_, i) => i !== idx));

  const goNext = () => step < 4 ? setStep(step + 1) : window.alert("이력서가 저장되었습니다!");
  const goBack = () => step > 1 ? setStep(step - 1) : nav("/jobseeker");

  return (
    <BackgroundShell>
      <div className="rc-wrap">
        {/* 헤더: 대시보드와 동일한 스타일 + 단계 표시 */}
        <header className="rc-header">
          <div className="rc-headerInner">
            <div className="rc-brand" onClick={() => nav("/jobseeker")}>
              <div className="rc-mark">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" /><path d="M4 10V6a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" opacity=".9"/><path d="M20 14v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" opacity=".9"/></svg>
              </div>
              <div className="rc-brandText">
                <div className="rc-brandName">잡매치</div>
                <div className="rc-brandSub">표준 이력서 작성</div>
              </div>
            </div>

            {/* 단계 표시 (Stepper) - 중앙 배치 */}
            <div className="rc-steps">
              {["기본 정보", "학력/경력", "스펙/역량", "자기소개서"].map((label, i) => (
                <div key={i} className={`rc-stepItem ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}>
                  <div className="rc-stepCircle">{i + 1}</div>
                  <span className="rc-stepLabel">{label}</span>
                </div>
              ))}
            </div>

            <div className="rc-actions">
              <button className="rc-closeBtn" onClick={() => nav("/jobseeker")}>나가기</button>
            </div>
          </div>
        </header>

        <main className="rc-main">
          <div className="rc-paper fade-in"
          style={{marginTop: '40px'}}>
            {/* STEP 1: 기본 정보 */}
            {step === 1 && (
              <div className="rc-content">
                <h2 className="rc-title">기본 정보 및 희망 직무</h2>
                <div className="rc-grid-basic">
                  <div className="rc-photoBox">
                    <div className="rc-photoIcon">📷</div>
                    <span>사진 등록 (3x4)</span>
                  </div>
                  <div className="rc-inputs">
                    <div className="rc-row">
                      <div className="rc-field"><label>이름</label><input type="text" name="name" value={form.jobseekerName} readOnly /></div>
                      <div className="rc-field"><label>생년월일</label><input type="text" name="birthday" value={form.jobseekerBirth} readOnly /></div>
                    </div>
                    <div className="rc-row">
                      <div className="rc-field"><label>이메일</label><input type="text" name="email" value={form.jobseekerEmail} readOnly /></div>
                      <div className="rc-field"><label>연락처</label><input type="text" name="phone" value={form.jobseekerPhone} readOnly /></div>
                    </div>
                    <div className="rc-field"><label>주소</label><input type="text" name="address" value={basicInfo.address} onChange={handleBasicChange} placeholder="거주지 주소 입력" /></div>
                  </div>
                </div>

                <div className="rc-divider" />
                
                <h3 className="rc-subTitle">희망 직군 선택</h3>
                <div className="rc-grid-4">
                  {JOB_CATEGORIES.map((cat) => (
                    <button key={cat.id} className={`rc-cardBtn ${selectedCategory?.id === cat.id ? "selected" : ""}`} onClick={() => { setSelectedCategory(cat); setSelectedSub([]); }}>{cat.label}</button>
                  ))}
                </div>

                {selectedCategory && (
                  <div className="rc-subArea fade-in">
                    <h4 className="rc-miniTitle">세부 직무 (다중 선택)</h4>
                    <div className="rc-chips">
                      {selectedCategory.sub.map(sub => (
                        <button key={sub} className={`rc-chip ${selectedSub.includes(sub) ? "active" : ""}`} onClick={() => handleSubToggle(sub)}>{sub}</button>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="rc-subTitle" style={{marginTop:30}}>희망 근무 지역</h3>
                <div className="rc-chips">
                  {REGIONS.map(reg => (
                    <button key={reg} className={`rc-chip ${selectedRegions.includes(reg) ? "active" : ""}`} onClick={() => handleRegionToggle(reg)}>{reg}</button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: 학력/경력 */}
            {step === 2 && (
              <div className="rc-content">
                <h2 className="rc-title">학력 및 경력 사항</h2>
                
                <h3 className="rc-subTitle">학력</h3>
                {educationList.map((edu, idx) => (
                  <div key={idx} className="rc-rowGroup">
                    <select value={edu.type} onChange={(e) => updateList(setEducationList, educationList, idx, "type", e.target.value)}>
                      <option value="">구분</option>
                      {EDU_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="text" placeholder="학교명" value={edu.name} onChange={(e) => updateList(setEducationList, educationList, idx, "name", e.target.value)} />
                    <input type="text" placeholder="전공" value={edu.major} onChange={(e) => updateList(setEducationList, educationList, idx, "major", e.target.value)} />
                    <select className="short" value={edu.status} onChange={(e) => updateList(setEducationList, educationList, idx, "status", e.target.value)}>
                      <option value="">상태</option><option>졸업</option><option>재학</option>
                    </select>
                    <input type="text" placeholder="졸업년월" value={edu.date} onChange={(e) => updateList(setEducationList, educationList, idx, "date", e.target.value)} />
                    {idx > 0 && <button className="rc-del" onClick={() => removeFromList(setEducationList, educationList, idx)}>×</button>}
                  </div>
                ))}
                <button className="rc-addBtn" onClick={() => addToList(setEducationList, educationList, { type: "", name: "", major: "", status: "", date: "" })}>+ 학력 추가</button>

                <div className="rc-divider" />

                <h3 className="rc-subTitle">병역</h3>
                <div className="rc-rowGroup">
                  <select value={military.type} onChange={(e) => setMilitary({...military, type: e.target.value})}>
                    {MILITARY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {military.type === "군필" && (
                    <>
                      <input type="text" placeholder="계급" value={military.rank} onChange={(e) => setMilitary({...military, rank: e.target.value})} />
                      <input type="text" placeholder="군별" value={military.reason} onChange={(e) => setMilitary({...military, reason: e.target.value})} />
                    </>
                  )}
                </div>

                <div className="rc-divider" />

                <h3 className="rc-subTitle">경력 사항</h3>
                {careerList.map((car, idx) => (
                  <div key={idx} className="rc-boxGroup">
                    <div className="rc-row">
                      <input type="text" placeholder="회사명" value={car.company} onChange={(e) => updateList(setCareerList, careerList, idx, "company", e.target.value)} />
                      <input type="text" placeholder="근무기간" value={car.period} onChange={(e) => updateList(setCareerList, careerList, idx, "period", e.target.value)} />
                    </div>
                    <textarea placeholder="담당 업무 및 성과" value={car.task} onChange={(e) => updateList(setCareerList, careerList, idx, "task", e.target.value)} />
                    <button className="rc-textDel" onClick={() => removeFromList(setCareerList, careerList, idx)}>삭제</button>
                  </div>
                ))}
                <button className="rc-addBtn" onClick={() => addToList(setCareerList, careerList, { company: "", period: "", task: "" })}>+ 경력 추가</button>
              </div>
            )}

            {/* STEP 3: 스펙 */}
            {step === 3 && (
              <div className="rc-content">
                <h2 className="rc-title">보유 기술 및 자격</h2>
                
                <div className="rc-field">
                  <label>핵심 기술 (Skills)</label>
                  <input className="rc-fullInput" type="text" placeholder="예: React, Python, Figma (쉼표로 구분)" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>

                <div className="rc-divider" />

                <h3 className="rc-subTitle">자격증</h3>
                {certList.map((cert, idx) => (
                  <div key={idx} className="rc-rowGroup">
                    <input type="text" placeholder="자격증명" value={cert.name} onChange={(e) => updateList(setCertList, certList, idx, "name", e.target.value)} />
                    <input type="text" placeholder="발행처" value={cert.issuer} onChange={(e) => updateList(setCertList, certList, idx, "issuer", e.target.value)} />
                    <input type="text" placeholder="취득일" value={cert.date} onChange={(e) => updateList(setCertList, certList, idx, "date", e.target.value)} />
                    <button className="rc-del" onClick={() => removeFromList(setCertList, certList, idx)}>×</button>
                  </div>
                ))}
                <button className="rc-addBtn" onClick={() => addToList(setCertList, certList, { name: "", issuer: "", date: "" })}>+ 자격증 추가</button>

                <div className="rc-divider" />

                <h3 className="rc-subTitle">어학</h3>
                {langList.map((lang, idx) => (
                  <div key={idx} className="rc-rowGroup">
                    <input type="text" placeholder="언어" value={lang.lang} onChange={(e) => updateList(setLangList, langList, idx, "lang", e.target.value)} />
                    <input type="text" placeholder="시험명" value={lang.test} onChange={(e) => updateList(setLangList, langList, idx, "test", e.target.value)} />
                    <input type="text" placeholder="점수" value={lang.score} onChange={(e) => updateList(setLangList, langList, idx, "score", e.target.value)} />
                    <button className="rc-del" onClick={() => removeFromList(setLangList, langList, idx)}>×</button>
                  </div>
                ))}
                <button className="rc-addBtn" onClick={() => addToList(setLangList, langList, { lang: "", test: "", score: "" })}>+ 어학 추가</button>
              </div>
            )}

            {/* STEP 4: 자기소개서 */}
            {step === 4 && (
              <div className="rc-content">
                <h2 className="rc-title">자기소개서 작성</h2>
                <p className="rc-desc">구체적인 경험을 바탕으로 작성해주세요. 글자 크기를 키워 가독성을 높였습니다.</p>

                <div className="rc-essay">
                  <label>1. 지원 동기 및 입사 후 포부</label>
                  <textarea placeholder="내용을 입력하세요..." value={intro.motivation} onChange={(e) => setIntro({...intro, motivation: e.target.value})} />
                </div>
                <div className="rc-essay">
                  <label>2. 성장 과정</label>
                  <textarea placeholder="내용을 입력하세요..." value={intro.growth} onChange={(e) => setIntro({...intro, growth: e.target.value})} />
                </div>
                <div className="rc-essay">
                  <label>3. 성격의 장단점</label>
                  <textarea placeholder="내용을 입력하세요..." value={intro.personality} onChange={(e) => setIntro({...intro, personality: e.target.value})} />
                </div>
                <div className="rc-essay">
                  <label>4. 직무 관련 경험 및 위기 극복</label>
                  <textarea placeholder="내용을 입력하세요..." value={intro.crisis} onChange={(e) => setIntro({...intro, crisis: e.target.value})} />
                </div>
              </div>
            )}

            <div className="rc-bottomNav">
              <button className="rc-navBtn back" onClick={goBack}>{step === 1 ? "취소" : "이전"}</button>
              <button className="rc-navBtn next" onClick={goNext}>{step === 4 ? "완료" : "다음"}</button>
            </div>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}