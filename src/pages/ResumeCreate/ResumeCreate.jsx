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
  // const [addressInfo, setAddressInfo] = useState({ address: "", detail: "" });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState([]);
  const [hopeJob, setHopeJob] = useState({ category: "", sub: [] });
  const [hopeRegion, setHopeRegion] = useState([]);
  const [education, setEducation] = useState([{ type: "", name: "", major: "", status: "", date: "" }]);
  const [militaryStatus, setMilitaryStatus] = useState({ type: "미필", date: ""});
  const [career, setCareer] = useState([]);
  const [certification, setCertification] = useState([]);
  const [languageSkill, setLanguageSkill] = useState([]);
  const [applyMotive, setApplyMotive] = useState("");
  const [growthProcess, setGrowthProcess] = useState("");
  const [personality, setPersonality] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [imageUrl, setImageUrl] = useState("");

    const payload = {
    hopeJob : JSON.stringify(hopeJob),
    hopeRegion : JSON.stringify(hopeRegion),
    education : JSON.stringify(education),
    militaryStatus : JSON.stringify(militaryStatus),
    career : JSON.stringify(career),
    certification : JSON.stringify(certification),
    languageSkill : JSON.stringify(languageSkill),
    applyMotive : applyMotive,
    growthProcess : growthProcess,
    personality :personality,
    jobExperience : jobExperience,
    imageUrl : imageUrl
  };

  const ymToInput = (ym) => (ym && ym.length === 6 ? `${ym.slice(0, 4)}-${ym.slice(4, 6)}` : "");
  const inputToYm = (v) => (v ? v.replace("-", "") : "");

  const ymdToInput = (ymd) =>
    (ymd && ymd.length === 8 ? `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}` : "");
  const inputToYmd = (v) => (v ? v.replaceAll("-", "") : "");

  const getStartYm = (period) => (typeof period === "string" ? period.slice(0, 6) : "");
  const getEndYm = (period) => (typeof period === "string" ? period.slice(6, 12) : "");



  // 핸들러
  // const handleAddressChange = (e) => setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });
  function handleSubToggle(sub) {
      setSelectedSub(prev => {
      const next = prev.includes(sub)
        ? prev.filter(x => x !== sub)
        : [...prev, sub];

      console.log("[세부직무 토글]", next); // ✅ 토글 결과 로그
      setHopeJob(prevHopeJob => ({
        ...prevHopeJob,
        sub: next
      }));
      console.log("[희망직무 업데이트]", hopeJob); // ✅ 희망직무 업데이트 로그
      return next;
    });

  }
  const handleRegionToggle = (reg) => {
    hopeRegion.includes(reg) ? setHopeRegion(hopeRegion.filter(r => r !== reg)) : setHopeRegion([...hopeRegion, reg]);
  };
  const updateList = (setFunc, list, idx, field, val) => {
    const newList = [...list]; newList[idx][field] = val; setFunc(newList);
  };
  const addToList = (setFunc, list, template) => setFunc([...list, template]);
  const removeFromList = (setFunc, list, idx) => setFunc(list.filter((_, i) => i !== idx));

  function goNext() {
    if (step < 4) {
      setStep(step + 1);
    } else {
      window.alert("이력서가 저장되었습니다!");
      
      axios.post('http://localhost:8080/api/cover/resume', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(res => {
        console.log(res.data);
      });

      nav("/jobseeker");
    }
  }
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
                    {/* <div className="rc-field"><label>주소</label><input type="text" name="address" value={addressInfo.address} onChange={handleAddressChange} placeholder="거주지 주소 입력" /></div> */}
                  </div>
                </div>

                <div className="rc-divider" />
                
                <h3 className="rc-subTitle">희망 직군 선택</h3>
                <div className="rc-grid-4">
                  {JOB_CATEGORIES.map((cat) => (
                    <button key={cat.id} className={`rc-cardBtn ${selectedCategory?.id === cat.id ? "selected" : ""}`} onClick={() => { 
                      console.log("[직군 선택]", cat); 
                      setSelectedCategory(cat); 
                      setHopeJob({...hopeJob, category: cat.label, sub: []});
                      setSelectedSub([]); 
                    }}>{cat.label}</button>
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
                    <button key={reg} className={`rc-chip ${hopeRegion.includes(reg) ? "active" : ""}`} onClick={() => {
                      handleRegionToggle(reg);
                      console.log("[희망지역 토글]", hopeRegion);
                    }}>{reg}</button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: 학력/경력 */}
            {step === 2 && (
              <div className="rc-content">
                <h2 className="rc-title">학력 및 경력 사항</h2>
                
                <h3 className="rc-subTitle">학력</h3>
                {education.map((edu, idx) => (
                  <div key={idx} className="rc-rowGroup">
                    <select value={edu.type} onChange={(e) => updateList(setEducation, education, idx, "type", e.target.value)}>
                      <option value="">구분</option>
                      {EDU_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="text" placeholder="학교명" value={edu.name} onChange={(e) => updateList(setEducation, education, idx, "name", e.target.value)} />
                    <input type="text" placeholder="전공" value={edu.major} onChange={(e) => updateList(setEducation, education, idx, "major", e.target.value)} />
                    <select className="short" value={edu.status} onChange={(e) => updateList(setEducation, education, idx, "status", e.target.value)}>
                      <option value="">상태</option><option>졸업</option><option>재학</option>
                    </select>
                    <input
                      type="month"
                      placeholder="졸업년월"
                      value={ymToInput(edu.date)}  // 화면에는 YYYY-MM
                      onChange={(e) => updateList(setEducation, education, idx, "date", inputToYm(e.target.value))} // 저장은 YYYYMM
                    />
                    {idx > 0 && <button className="rc-del" onClick={() => removeFromList(setEducation, education, idx)}>×</button>}
                  </div>
                ))}
                <button className="rc-addBtn" onClick={() => addToList(setEducation, education, { type: "", name: "", major: "", status: "", date: "" })}>+ 학력 추가</button>

                <div className="rc-divider" />

                <h3 className="rc-subTitle">병역</h3>
                <div className="rc-rowGroup">
                  <select value={militaryStatus.type} onChange={(e) => setMilitaryStatus({...militaryStatus, type: e.target.value})}>
                    {MILITARY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {militaryStatus.type === "군필" && (
                    <>
                      <input
                        type="month"
                        placeholder="전역년월"
                        value={ymToInput(militaryStatus.date)}
                        onChange={(e) => setMilitaryStatus({ ...militaryStatus, date: inputToYm(e.target.value) })}
                      />
                    </>
                  )}
                </div>

                <div className="rc-divider" />

                <h3 className="rc-subTitle">경력 사항</h3>
                {career.map((car, idx) => (
                  <div key={idx} className="rc-boxGroup">
                    <div className="rc-row">
                      <input type="text" placeholder="회사명" value={car.company} onChange={(e) => updateList(setCareer, career, idx, "company", e.target.value)} />
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ minWidth: 60, fontWeight: 600 }}>근무기간</span>

                        <input
                          type="month"
                          aria-label="근무 시작월"
                          value={ymToInput(getStartYm(car.period))}
                          onChange={(e) => {
                            const start = inputToYm(e.target.value); // YYYYMM
                            const end = getEndYm(car.period);
                            updateList(setCareer, career, idx, "period", `${start}${end}`);
                          }}
                        />

                        <span>~</span>

                        <input
                          type="month"
                          aria-label="근무 종료월"
                          value={ymToInput(getEndYm(car.period))}
                          onChange={(e) => {
                            const end = inputToYm(e.target.value); // YYYYMM
                            const start = getStartYm(car.period);
                            updateList(setCareer, career, idx, "period", `${start}${end}`);
                          }}
                        />
                      </div>

                      </div>
                    <textarea placeholder="담당 업무 및 성과" value={car.task} onChange={(e) => updateList(setCareer, career, idx, "task", e.target.value)} />
                    <button className="rc-textDel" onClick={() => removeFromList(setCareer, career, idx)}>삭제</button>
                  </div>
                ))}
                <button className="rc-addBtn" onClick={() => addToList(setCareer, career, { company: "", period: "", task: "" })}>+ 경력 추가</button>
              </div>
            )}

            {/* STEP 3: 스펙 */}
            {step === 3 && (
              <div className="rc-content">
                <h2 className="rc-title">보유 기술 및 자격</h2>
                
                <div className="rc-field">
                  <label>핵심 기술 (applyMotive)</label>
                  <input className="rc-fullInput" type="text" placeholder="예: React, Python, Figma (쉼표로 구분)" value={applyMotive} onChange={(e) => setApplyMotive(e.target.value)} />
                </div>

                <div className="rc-divider" />

                <h3 className="rc-subTitle">자격증</h3>
                {certification.map((cert, idx) => (
                  <div key={idx} className="rc-rowGroup">
                    <input type="text" placeholder="자격증명" value={cert.name} onChange={(e) => updateList(setCertification, certification, idx, "name", e.target.value)} />
                    <input type="text" placeholder="발행처" value={cert.issuer} onChange={(e) => updateList(setCertification, certification, idx, "issuer", e.target.value)} />
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ minWidth: 50, fontWeight: 600 }}>취득일 : </span>

                      <input
                        type="date"
                        aria-label="취득일"
                        value={ymdToInput(cert.date)} // 화면 YYYY-MM-DD
                        onChange={(e) =>
                          updateList(setCertification, certification, idx, "date", inputToYmd(e.target.value)) // 저장 YYYYMMDD
                        }
                      />
                    </div>
                    <button className="rc-del" onClick={() => removeFromList(setCertification, certification, idx)}>×</button>
                  </div>
                ))}
                <button className="rc-addBtn" onClick={() => addToList(setCertification, certification, { name: "", issuer: "", date: "" })}>+ 자격증 추가</button>

                <div className="rc-divider" />

                <h3 className="rc-subTitle">어학</h3>
                {languageSkill.map((lang, idx) => (
                  <div key={idx} className="rc-rowGroup">
                    <input type="text" placeholder="언어" value={lang.lang} onChange={(e) => updateList(setLanguageSkill, languageSkill, idx, "lang", e.target.value)} />
                    <input type="text" placeholder="시험명" value={lang.test} onChange={(e) => updateList(setLanguageSkill, languageSkill, idx, "test", e.target.value)} />
                    <input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      min="0"
                      placeholder="점수"
                      value={lang.score}
                      onChange={(e) => updateList(setLanguageSkill, languageSkill, idx, "score", e.target.value)}
                    />
                    <button className="rc-del" onClick={() => removeFromList(setLanguageSkill, languageSkill, idx)}>×</button>
                  </div>
                ))}
                <button className="rc-addBtn" onClick={() => addToList(setLanguageSkill, languageSkill, { lang: "", test: "", score: "" })}>+ 어학 추가</button>
              </div>
            )}

            {/* STEP 4: 자기소개서 */}
            {step === 4 && (
              <div className="rc-content">
                <h2 className="rc-title">자기소개서 작성</h2>
                <div className="rc-essay">
                  <label>1. 지원 동기 및 입사 후 포부</label>
                  <textarea placeholder="내용을 입력하세요..." value={applyMotive} onChange={(e) => setApplyMotive(e.target.value)} />
                </div>
                <div className="rc-essay">
                  <label>2. 성장 과정</label>
                  <textarea placeholder="내용을 입력하세요..." value={growthProcess} onChange={(e) => setGrowthProcess( e.target.value)} />
                </div>
                <div className="rc-essay">
                  <label>3. 성격의 장단점</label>
                  <textarea placeholder="내용을 입력하세요..." value={personality} onChange={(e) => setPersonality(e.target.value)} />
                </div>
                <div className="rc-essay">
                  <label>4. 직무 관련 경험 및 위기 극복</label>
                  <textarea placeholder="내용을 입력하세요..." value={jobExperience} onChange={(e) => setJobExperience(e.target.value)} />
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