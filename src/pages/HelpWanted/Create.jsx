import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/api"; // 토큰 자동 포함된 axios 인스턴스
import BackgroundShell from "../../components/BackgroundShell";
import "./Create.css";

function toDateInput(v) {
  if (!v) return "";
  const s = String(v).trim();
  // "2026-01-15 17:58:52" 같은 경우 앞 10글자
  if (s.length >= 10) return s.slice(0, 10);
  return s;
}

function toTimeInput(v) {
  if (!v) return "";
  const s = String(v).trim();
  // "09:00:00" / "09:00" -> "09:00"
  if (s.length >= 5) return s.slice(0, 5);
  return s;
}

function splitRange(raw) {
  // "A ~ B", "A~B", "A - B" 등 대응
  if (!raw) return ["", ""];
  const s = String(raw).trim();
  const normalized = s.replace("–", "-").replace("—", "-");
  if (normalized.includes("~")) {
    const [a, b] = normalized.split("~").map((x) => x.trim());
    return [a ?? "", b ?? ""];
  }
  if (normalized.includes("-")) {
    // 날짜가 "2026-01-01 - 2026-01-31" 이런 식이면 split이 과하게 되므로
    // " - "가 있을 때만 범위로 간주
    if (normalized.includes(" - ")) {
      const [a, b] = normalized.split(" - ").map((x) => x.trim());
      return [a ?? "", b ?? ""];
    }
  }
  return ["", ""];
}

function parseSalary(raw) {
  // 기대 포맷 예:
  // "협의"
  // "연봉 3500"
  // "월급 300"
  // "시급 12000"
  // 또는 "회사내규", "면접 후 결정" 등 자유 텍스트
  const s = String(raw ?? "").trim();
  if (!s) return { salaryType: "협의", salaryAmount: "", salaryNote: "" };

  const lower = s.toLowerCase();

  // 협의/내규/면접 등은 note로 보관
  if (
    lower.includes("협의") ||
    lower.includes("내규") ||
    lower.includes("면접") ||
    lower.includes("결정")
  ) {
    return { salaryType: "협의", salaryAmount: "", salaryNote: s };
  }

  const types = ["연봉", "월급", "시급"];
  const found = types.find((t) => s.includes(t));
  if (!found) {
    // 못 맞추면 협의 + note로
    return { salaryType: "협의", salaryAmount: "", salaryNote: s };
  }

  // 숫자만 뽑기 (쉼표/원/만원 등 섞여도)
  const num = s.replace(/[^0-9]/g, "");
  return { salaryType: found, salaryAmount: num ? String(Number(num)) : "", salaryNote: "" };
}

export default function Create() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  // 수정 모드: /helpwanted/create?id=123
  const editId = searchParams.get("id");
  const isEditMode = !!editId;

  const [isLoading, setIsLoading] = useState(false);

  // ✅ 입력을 더 편하게: 날짜/시간/급여를 분리 입력
  const [form, setForm] = useState({
    title: "",
    recruitCount: "",
    employmentType: "",
    career: "",
    education: "",
    techStack: "",

    // 급여
    salaryType: "협의", // 협의 | 연봉 | 월급 | 시급
    salaryAmount: "",  // 숫자(문자열로 관리)
    salaryNote: "",    // 협의/내규 등 텍스트

    // 근무시간
    workStart: "",
    workEnd: "",
    workTimeNote: "", // 시간이 아니라 텍스트로 쓰고 싶을 때

    // 접수기간
    applicationStart: "",
    applicationEnd: "",
    applicationNote: "", // 날짜 대신 텍스트로 쓰고 싶을 때

    attachFile: "",
  });

  const canUseWorkTimeRange = !!(form.workStart && form.workEnd);
  const canUseApplicationRange = !!(form.applicationStart && form.applicationEnd);

  // 수정 모드 기존 데이터 로드 + 파싱
  useEffect(() => {
    if (!isEditMode) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/company/employment/${editId}`);
        const data = res.data?.data;

        if (!data) {
          alert("공고 데이터를 불러오지 못했습니다.");
          return;
        }

        // 접수기간 파싱
        const [appA, appB] = splitRange(data.applicationPeriod);
        const appStart = toDateInput(appA);
        const appEnd = toDateInput(appB);

        // 근무시간 파싱
        const [wtA, wtB] = splitRange(data.workTime);
        const workStart = toTimeInput(wtA);
        const workEnd = toTimeInput(wtB);

        // 급여 파싱
        const salaryParsed = parseSalary(data.salary);

        setForm({
          title: data.title ?? "",
          recruitCount:
            data.recruitCount === null || data.recruitCount === undefined
              ? ""
              : String(data.recruitCount),
          employmentType: data.employmentType ?? "",
          career: data.career ?? "",
          education: data.education ?? "",
          techStack: data.techStack ?? "",

          salaryType: salaryParsed.salaryType,
          salaryAmount: salaryParsed.salaryAmount,
          salaryNote: salaryParsed.salaryNote,

          workStart,
          workEnd,
          workTimeNote: !workStart && !workEnd ? (data.workTime ?? "") : "",

          applicationStart: appStart,
          applicationEnd: appEnd,
          applicationNote: !appStart && !appEnd ? (data.applicationPeriod ?? "") : "",

          attachFile: data.attachFile ?? "",
        });
      } catch (e) {
        console.log(e);
        alert("공고 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [isEditMode, editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      // 급여 타입을 협의로 바꾸면 amount 비우고 note 활성화
      if (name === "salaryType") {
        if (value === "협의") {
          return { ...prev, salaryType: value, salaryAmount: "", salaryNote: prev.salaryNote || "협의" };
        }
        return { ...prev, salaryType: value, salaryNote: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  // 파일 업로드가 아니라 "파일명 문자열 저장" 유지
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, attachFile: file.name }));
  };

  // payload 생성(서버 컬럼은 문자열이므로 다시 합쳐서 보냄)
  const payload = useMemo(() => {
    const recruitCount =
      form.recruitCount === "" ? null : Number(form.recruitCount);

    const salary =
      form.salaryType === "협의"
        ? (form.salaryNote?.trim() ? form.salaryNote.trim() : "협의")
        : (form.salaryAmount?.trim()
            ? `${form.salaryType} ${Number(form.salaryAmount).toLocaleString()}`
            : "");

    const workTime =
      form.workStart && form.workEnd
        ? `${form.workStart} ~ ${form.workEnd}`
        : (form.workTimeNote?.trim() ?? "");

    const applicationPeriod =
      form.applicationStart && form.applicationEnd
        ? `${form.applicationStart} ~ ${form.applicationEnd}`
        : (form.applicationNote?.trim() ?? "");

    return {
      title: form.title,
      recruitCount,
      employmentType: form.employmentType,
      salary,
      workTime,
      career: form.career,
      education: form.education,
      techStack: form.techStack,
      applicationPeriod,
      attachFile: form.attachFile,
    };
  }, [form]);

  const validateBeforeSubmit = () => {
    if (!form.title.trim()) {
      alert("공고 제목은 필수입니다.");
      return false;
    }

    // 접수기간: 하나만 입력되면 경고
    if ((form.applicationStart && !form.applicationEnd) || (!form.applicationStart && form.applicationEnd)) {
      alert("접수기간은 시작/마감을 둘 다 입력하거나, 아래 텍스트로만 입력하세요.");
      return false;
    }
    if (form.applicationStart && form.applicationEnd && form.applicationEnd < form.applicationStart) {
      alert("접수 마감일이 시작일보다 빠를 수 없습니다.");
      return false;
    }

    // 근무시간: 하나만 입력되면 경고
    if ((form.workStart && !form.workEnd) || (!form.workStart && form.workEnd)) {
      alert("근무시간은 시작/종료를 둘 다 입력하거나, 아래 텍스트로만 입력하세요.");
      return false;
    }

    // 급여: 협의가 아닌데 금액이 비면 경고(원하면 완화 가능)
    if (form.salaryType !== "협의" && !form.salaryAmount.trim()) {
      alert("급여 유형이 협의가 아니면 금액을 입력하세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validateBeforeSubmit()) return;

    try {
      setIsLoading(true);

      if (isEditMode) {
        await api.put(`/api/company/employment/${editId}`, payload);
        alert("구인광고가 수정되었습니다!");
      } else {
        await api.post(`/api/company/employment/create`, payload);
        alert("구인광고가 등록되었습니다!");
      }

      nav("/postlist");
    } catch (e2) {
      console.log(e2);
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data?.error ||
        (e2?.response?.status === 401 ? "로그인이 필요합니다." : "처리 중 오류가 발생했습니다.");
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundShell>
      <div className="rc-wrap">
        <div className="rc-simple-header">
          <span className="rc-page-label">{isEditMode ? "공고 수정" : "공고 등록"}</span>
        </div>

        <main className="rc-main">
          <div className="rc-panel fade-in">
            <h2 className="rc-title">{isEditMode ? "기존 공고를 수정합니다" : "새로운 인재를 찾아보세요"}</h2>
            <p className="rc-desc">JOB_POSTS 테이블에 저장될 상세 정보를 입력해주세요.</p>

            <form onSubmit={handleSubmit}>
              {/* 공고 제목 */}
              <div className="rc-field">
                <label>공고 제목</label>
                <input
                  className="rc-input"
                  name="title"
                  placeholder="예: [신입/경력] 프론트엔드 개발자 모집"
                  value={form.title}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* 모집인원 / 고용형태 */}
              <div className="rc-row">
                <div className="rc-field half">
                  <label>모집 인원</label>
                  <input
                    type="number"
                    className="rc-input"
                    name="recruitCount"
                    placeholder="예: 3"
                    value={form.recruitCount}
                    onChange={handleChange}
                    disabled={isLoading}
                    min={0}
                    step={1}
                  />
                </div>

                <div className="rc-field half">
                  <label>고용 형태</label>
                  <select
                    className="rc-input"
                    name="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">선택하세요</option>
                    <option value="정규직">정규직</option>
                    <option value="계약직">계약직</option>
                    <option value="인턴">인턴</option>
                    <option value="프리랜서">프리랜서</option>
                  </select>
                </div>
              </div>

              {/* 급여(편하게) */}
              <div className="rc-row">
                <div className="rc-field half">
                  <label>급여 유형</label>
                  <select
                    className="rc-input"
                    name="salaryType"
                    value={form.salaryType}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="협의">협의</option>
                    <option value="연봉">연봉</option>
                    <option value="월급">월급</option>
                    <option value="시급">시급</option>
                  </select>
                </div>

                <div className="rc-field half">
                  <label>{form.salaryType === "협의" ? "급여 설명(선택)" : "금액"}</label>
                  {form.salaryType === "협의" ? (
                    <input
                      className="rc-input"
                      name="salaryNote"
                      placeholder="예: 회사내규에 따름 / 면접 후 결정"
                      value={form.salaryNote}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  ) : (
                    <input
                      type="number"
                      className="rc-input"
                      name="salaryAmount"
                      placeholder="숫자만 입력"
                      value={form.salaryAmount}
                      onChange={handleChange}
                      disabled={isLoading}
                      min={0}
                    />
                  )}
                </div>
              </div>

              {/* 근무시간(편하게) */}
              <div className="rc-row">
                <div className="rc-field half">
                  <label>근무 시작</label>
                  <input
                    type="time"
                    className="rc-input"
                    name="workStart"
                    value={form.workStart}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="rc-field half">
                  <label>근무 종료</label>
                  <input
                    type="time"
                    className="rc-input"
                    name="workEnd"
                    value={form.workEnd}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 근무시간 텍스트(시간 입력 안 할 때만) */}
              <div className="rc-field">
                <label>근무 시간 설명(선택)</label>
                <input
                  className="rc-input"
                  name="workTimeNote"
                  placeholder={canUseWorkTimeRange ? "시간 입력 중이면 비워도 됩니다" : "예: 탄력근무 / 교대근무 / 09:00 ~ 18:00"}
                  value={form.workTimeNote}
                  onChange={handleChange}
                  disabled={isLoading || canUseWorkTimeRange}
                />
              </div>

              {/* 경력/학력 */}
              <div className="rc-row">
                <div className="rc-field half">
                  <label>경력 요건</label>
                  <select
                    className="rc-input"
                    name="career"
                    value={form.career}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">선택하세요</option>
                    <option value="신입">신입</option>
                    <option value="경력">경력</option>
                    <option value="경력무관">경력무관</option>
                  </select>
                </div>

                <div className="rc-field half">
                  <label>학력 요건</label>
                  <select
                    className="rc-input"
                    name="education"
                    value={form.education}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="">선택하세요</option>
                    <option value="학력무관">학력무관</option>
                    <option value="고등학교 졸업">고등학교 졸업</option>
                    <option value="대학(2,3년) 졸업">대학(2,3년) 졸업</option>
                    <option value="대학교(4년) 졸업">대학교(4년) 졸업</option>
                    <option value="대학원 석사 졸업">대학원 석사 졸업</option>
                  </select>
                </div>
              </div>

              {/* 접수기간(편하게) */}
              <div className="rc-row">
                <div className="rc-field half">
                  <label>접수 시작</label>
                  <input
                    type="date"
                    className="rc-input"
                    name="applicationStart"
                    value={form.applicationStart}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="rc-field half">
                  <label>접수 마감</label>
                  <input
                    type="date"
                    className="rc-input"
                    name="applicationEnd"
                    value={form.applicationEnd}
                    onChange={handleChange}
                    disabled={isLoading}
                    min={form.applicationStart || undefined}
                  />
                </div>
              </div>

              {/* 접수기간 텍스트(날짜 입력 안 할 때만) */}
              <div className="rc-field">
                <label>접수 기간 설명(선택)</label>
                <input
                  className="rc-input"
                  name="applicationNote"
                  placeholder={canUseApplicationRange ? "날짜 입력 중이면 비워도 됩니다" : "예: 상시채용 / 채용시 마감"}
                  value={form.applicationNote}
                  onChange={handleChange}
                  disabled={isLoading || canUseApplicationRange}
                />
              </div>

              {/* 기술스택 */}
              <div className="rc-field">
                <label>기술 스택 (자격 요건 및 우대 사항)</label>
                <textarea
                  className="rc-textarea"
                  name="techStack"
                  placeholder="예: React, Node.js, AWS 사용 가능자 우대"
                  value={form.techStack}
                  onChange={handleChange}
                  rows={5}
                  disabled={isLoading}
                />
              </div>

              {/* 파일 */}
              <div className="rc-field">
                <label>상세 공고 이미지 또는 파일</label>
                <div className="rc-fileBox">
                  <input
                    type="file"
                    id="file"
                    name="attachFile"
                    onChange={handleFileChange}
                    hidden
                    disabled={isLoading}
                  />
                  <label htmlFor="file" className="rc-fileBtn">
                    파일 선택
                  </label>
                  <span className="rc-fileInfo">
                    {form.attachFile ? form.attachFile : "공고문 파일 (PDF, IMG)"}
                  </span>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="rc-bottom">
                <button
                  type="button"
                  className="rc-btn cancel"
                  onClick={() => nav(-1)}
                  disabled={isLoading}
                >
                  취소
                </button>
                <button type="submit" className="rc-btn submit" disabled={isLoading}>
                  {isLoading ? "처리 중..." : isEditMode ? "수정 완료" : "공고 등록하기"}
                </button>
              </div>

              {/* 디버그용(원하면 지워) */}
              {/* <pre>{JSON.stringify(payload, null, 2)}</pre> */}
            </form>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}
