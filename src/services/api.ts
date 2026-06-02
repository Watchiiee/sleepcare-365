import axios from "axios";
import type { SleepReportResponse } from "../types/sleep";

// 백엔드 주소 (FastAPI 기본 주소)
const API_BASE_URL = "http://localhost:8000/api/v1";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// [기존] 파일 업로드 API 호출 함수
export const uploadSleepFile = async (
  file: File,
): Promise<SleepReportResponse> => {
  const formData = new FormData();
  formData.append("file", file); // 백엔드의 'file' 파라미터 이름과 같아야 함

  const response = await api.post<SleepReportResponse>(
    "/analysis/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // 파일 전송 필수 헤더
      },
    },
  );

  return response.data;
};

// [기존] 지난 리포트 내역 가져오기 API 호출 함수
export const getSleepHistory = async (): Promise<SleepReportResponse[]> => {
  const response = await api.get<SleepReportResponse[]>("/analysis/history");
  return response.data;
};

// =================================================================
// 💥 [신규 추가] RAG AI 코칭 인터페이스 연동 영역
// =================================================================

export interface AICoachRequest {
  user_id: string;
  question: string;
}

export interface AICoachResponse {
  status: string;
  metadata: {
    algorithm: string;
    version: string;
  };
  data: {
    user_id: string;
    retrieved_knowledge: string;
    ai_coaching_feedback: string;
  };
}

/**
 * RAG AI 엔진에 수면 데이터 기반 맞춤형 분석 질의를 요청하는 함수
 */
export const requestAICoaching = async (
  payload: AICoachRequest,
): Promise<AICoachResponse> => {
  // AI 서버 API 주소인 '/ai/coach'로 라우팅 (FastAPI에 매핑한 엔드포인트 구조 적용)
  const response = await api.post<AICoachResponse>("/ai/coach", payload);
  return response.data;
};
