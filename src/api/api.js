// src/api/api.js
import axios from "axios";

const BASE_URL = "http://localhost:8080";

// ✅ 일반 API (AccessToken 붙는 애)
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // refreshToken을 HttpOnly 쿠키로 쓰는 경우 필수
});

// ✅ refresh 전용 (Authorization 안 붙이고, interceptor 영향 안 받게)
const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// =========================
// Request: AccessToken 자동 첨부
// =========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =========================
// Response: 401이면 refresh → 원요청 재시도
// (동시 요청 여러개 들어오면 refresh 1번만 하고 큐 처리)
// =========================
let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, newToken = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  pendingQueue = [];
}

function forceLogoutAndRedirect() {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  const role = localStorage.getItem("userRole");
  localStorage.removeItem("userRole");

  // 원하는 페이지로 보내면 됨
  if (role === "company") window.location.href = "/login";
  else if (role === "jobseeker") window.location.href = "/login";
  else window.location.href = "/select";
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    // ✅ 네트워크 에러면 그냥 던짐
    if (!status) return Promise.reject(error);

    // ✅ refresh/logout 요청 자체가 실패한건 재시도하면 무한루프라서 바로 탈출
    const url = original?.url || "";
    const isAuthApi = url.includes("/api/auth/refresh") || url.includes("/api/auth/logout");

    // ✅ 401(만료/무효) 처리
    if (status === 401 && !original._retry && !isAuthApi) {
      original._retry = true;

      // 이미 refresh 진행 중이면 큐에 쌓았다가 끝나면 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (newToken) => {
              original.headers = original.headers || {};
              original.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // ✅ 서버가 refreshToken을 HttpOnly 쿠키로 관리한다면 body 없이 호출해도 됨
        // (네 AuthController는 body 없어도 처리 가능하게 만들어둔 상태)
        const r = await refreshApi.post("/api/auth/refresh");

        // ✅ 응답 구조: ApiResponse<TokenRes> 라면 보통 r.data.data 안에 들어있음
        const tokenRes = r.data?.data ?? r.data;
        const newAccessToken =
          tokenRes?.accessToken || tokenRes?.token || tokenRes?.access_token;

        if (!newAccessToken) {
          throw new Error("No accessToken in refresh response");
        }

        // ✅ 새 토큰 저장 + 기본 헤더 갱신
        localStorage.setItem("token", newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // ✅ 원래 요청 다시 시도
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (e) {
        processQueue(e, null);
        forceLogoutAndRedirect();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    // ✅ 403은 권한 문제(역할 다른데 접근 등) — 필요하면 여기서 처리
    // if (status === 403) { ... }

    return Promise.reject(error);
  }
);
