import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/api"; // 토큰 자동 포함된 axios 인스턴스
import BackgroundShell from "../../components/BackgroundShell";
import "./Create.css";

function toDateInput(v) {
  if (!v) return "";
  const s = String(v).trim();
  if (s.length >= 10) return s.slice(0, 10);
  return s;
}

function toTimeInput(v) {
  if (!v) return "";
  const s = String(v).trim();
  if (s.length >= 5) return s.slice(0, 5);
  return s;
}

function splitRange(raw) {
  if (!raw) return ["", ""];
  const s = String(raw).trim();
  const normalized = s.replace("–", "-").replace("—", "-");

  if (normalized.includes("~")) {
    const [a, b] = normalized.split("~").map((x) => x.trim());
    return [a ?? "", b ?? ""];
  }
  if (normalized.includes("-")) {
    if (normalized.includes(" - ")) {
      const [a, b] = normalized.split(" - ").map((x) => x.trim());
      return [a ?? "", b ?? ""];
    }
  }
  return ["", ""];
}

function parseSalary(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return { salaryType: "협의", salaryAmount: "", salaryNote: "" };

  const lower = s.toLowerCase();

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
    return { salaryType: "협의", salaryAmount: "", salaryNote: s };
  }

  const num = s.replace(/[^0-9]/g, "");
  return {
    salaryType: found,
    salaryAmount: num ? String(Number(num)) : "",
    salaryNote: "",
  };
}

export default function Create() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("id");
  const isEditMode = !!editId;

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    recruitCount: "",
    employmentType: "",
    career: "",
    education: "",
    techStack: "",

    salaryType: "협의",
    salaryAmount: "",
    salaryNote: "",

    workStart: "",
    workEnd: "",
    workTimeNote: "",

    applicationStart: "",
    applicationEnd: "",
    applicationNote: "",

    // ✅ 파일 저장명/원본명 분리
    attachFile: "",        // 서버 저장명(UUID...)
    attachFileOrigin: "",  // 원본 파일명
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

        const [appA, appB] = splitRange(data.applicationPeriod);
        const appStart = toDateInput(appA);
        const appEnd = toDateInput(appB);

        const [wtA, wtB] = splitRange(data.workTime);
        const workStart = toTimeInput(wtA);
        const workEnd = toTimeInput(wtB);

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

          // ✅ 기존 파일 정보도 유지
          attachFile: data.attachFile ?? "",
          attachFileOrigin: data.attachFileOrigin ?? "",
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
      if (name === "salaryType") {
        if (value === "협의") {
          return {
            ...prev,
            salaryType: value,
            salaryAmount: "",
            salaryNote: prev.salaryNote || "협의",
          };
        }
        return { ...prev, salaryType: value, salaryNote: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  // ✅ 파일 선택 -> 서버 업로드 -> attachFile/attachFileOrigin 세팅
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

      const fd = new FormData();
      fd.append("file", file);

      const res = await api.post(`/api/company/employment/upload`, fd);
      const info = res.data?.data;

      setForm((prev) => ({
        ...prev,
        attachFile: info?.attachFile ?? "",
        attachFileOrigin: info?.attachFileOrigin ?? file.name,
      }));
    } catch (err) {
      console.log(err);
      alert("파일 업로드 실패");
    } finally {
      setIsLoading(false);
    }
  };

  // payload 생성
  const payload = useMemo(() => {
    const recruitCount = form.recruitCount === "" ? null : Number(form.recruitCount);

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

      // ✅ DB에 둘 다 저장
      attachFile: form.attachFile,               // 저장명(UUID...)
      attachFileOrigin: form.attachFileOrigin,   // 원본명
    };
  }, [form]);

  const validateBeforeSubmit = () => {
    if (!form.title.trim()) {
      alert("공고 제목은 필수입니다.");
      return false;
    }

    if ((form.applicationStart && !form.applicationEnd) || (!form.applicationStart && form.applicationEnd)) {
      alert("접수기간은 시작/마감을 둘 다 입력하거나, 아래 텍스트로만 입력하세요.");
      return false;
    }
    if (form.applicationStart && form.applicationEnd && form.applicationEnd < form.applicationStart) {
      alert("접수 마감일이 시작일보다 빠를 수 없습니다.");
      return false;
    }

    if ((form.workStart && !form.workEnd) || (!form.workStart && form.workEnd)) {
      alert("근무시간은 시작/종료를 둘 다 입력하거나, 아래 텍스트로만 입력하세요.");
      return false;
    }

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

              {/* 급여 */}
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

              {/* 근무시간 */}
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

              {/* 접수기간 */}
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
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                  />
                  <label htmlFor="file" className="rc-fileBtn">
                    파일 선택
                  </label>
                  <span className="rc-fileInfo">
                    {form.attachFileOrigin ? form.attachFileOrigin : "공고문 파일 (PDF, IMG)"}
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
            </form>
          </div>
        </main>
      </div>
    </BackgroundShell>
  );
}
