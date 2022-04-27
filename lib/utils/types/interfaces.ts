import { HTTP_METHODS } from "./types";

export interface FunctionJobSuccess<T = any> {
  success: boolean;
  data?: T;
}

export interface APIResponse<T = any> {
  succeed: boolean;
  code: number;
  data: T;
}

export interface AnswerToReqArgsShape {
  success: boolean;
  code?: number;
  data?: string | object;
}

export interface ApiCallArgsShape {
  uri: string;
  method: HTTP_METHODS;
  body?: object;
}

export interface UrlsShape {
  id: string;
  code: string;
  url: string;
  createAt: string;
  updateAt: string;
  userId: string;
}
