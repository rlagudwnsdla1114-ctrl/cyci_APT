import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/api"; // ✅ axios 대신 api 사용(토큰 자동)
import BackgroundShell from "../../components/BackgroundShell";
import "./Create.css";

export default function Create() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ 수정 모드: /helpwanted/create?id=123 이런 식
  const editId = searchParams.get("id");
  const isEditMode = !!editId;

  const [isLoading, setIsLoading] = useState(false);

  // ✅ DB 컬럼(JOB_POSTS)에 맞춰 상태 초기화
  const [form, setForm] = useState({
    title: "",
    recruitCount: "",
    employmentType: "",
    salary: "",
    workTime: "",
    career: "",
    education: "",
    techStack: "",
    applicationPeriod: "",
    attachFile: "",
  });

  // ✅ 수정 모드일 때 기존 데이터 불러오기(진짜 API 호출)
  useEffect(() => {
    if (!isEditMode) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);

        // ✅ 회사 전용 상세 조회
        const res = await api.get(`/api/company/employment/${editId}`);
        const data = res.data?.data; // ApiResponse.success() 형태면 보통 data에 들어있음

        if (!data) {
          alert("공고 데이터를 불러오지 못했습니다.");
          return;
        }

        setForm({
          title: data.title ?? "",
          recruitCount: data.recruitCount ?? "",
          employmentType: data.employmentType ?? "",
          salary: data.salary ?? "",
          workTime: data.workTime ?? "",
          career: data.career ?? "",
          education: data.education ?? "",
          techStack: data.techStack ?? "",
          applicationPeriod: data.applicationPeriod ?? "",
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 지금은 파일 업로드가 아니라 "파일명 문자열 저장"만 하는 구조 유지
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      attachFile: file.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const payload = {
      title: form.title,
      recruitCount: form.recruitCount === "" ? null : Number(form.recruitCount),
      employmentType: form.employmentType,
      salary: form.salary,
      workTime: form.workTime,
      career: form.career,
      education: form.education,
      techStack: form.techStack,
      applicationPeriod: form.applicationPeriod,
      attachFile: form.attachFile,
    };

    try {
      setIsLoading(true);

      if (isEditMode) {
        // ✅ 회사 전용 수정
        await api.put(`/api/company/employment/${editId}`, payload);
        alert("구인광고가 수정되었습니다!");
      } else {
        // ✅ 회사 전용 등록
        await api.post(`/api/company/employment/create`, payload);
        alert("구인광고가 등록되었습니다!");
      }

      // ✅ 완료 후 이동 (네 라우트에 맞춰서)
      nav("/postlist"); // 공고관리 리스트로 보내는 게 자연스러움
    } catch (e) {
      console.log(e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (e?.response?.status === 401 ? "로그인이 필요합니다." : "처리 중 오류가 발생했습니다.");
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

              <div className="rc-row">
                <div className="rc-field half">
                  <label>모집 인원</label>
                  <input
                    type="number"
                    className="rc-input"
                    name="recruitCount"
                    placeholder="예: 0 (명)"
                    value={form.recruitCount}
                    onChange={handleChange}
                    disabled={isLoading}
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

              <div className="rc-row">
                <div className="rc-field half">
                  <label>급여</label>
                  <input
                    className="rc-input"
                    name="salary"
                    placeholder="예: 회사내규에 따름 or 3,500만원"
                    value={form.salary}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="rc-field half">
                  <label>근무 시간</label>
                  <input
                    className="rc-input"
                    name="workTime"
                    placeholder="예: 09:00 ~ 18:00"
                    value={form.workTime}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

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

              <div className="rc-field">
                <label>접수 기간</label>
                <input
                  className="rc-input"
                  name="applicationPeriod"
                  placeholder="예: 2024-05-01 ~ 2024-05-31"
                  value={form.applicationPeriod}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

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

              <div className="rc-field">
                <label>상세 공고 이미지 또는 파일</label>
                <div className="rc-fileBox">
                  <input type="file" id="file" name="attachFile" onChange={handleFileChange} hidden disabled={isLoading} />
                  <label htmlFor="file" className="rc-fileBtn">
                    파일 선택
                  </label>
                  <span className="rc-fileInfo">{form.attachFile ? form.attachFile : "공고문 파일 (PDF, IMG)"}</span>
                </div>
              </div>

              <div className="rc-bottom">
                <button type="button" className="rc-btn cancel" onClick={() => nav(-1)} disabled={isLoading}>
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
