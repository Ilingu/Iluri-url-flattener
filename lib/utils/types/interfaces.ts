import { NextApiResponse } from "next";

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
  res: NextApiResponse;
  success: boolean;
  code?: number;
  data?: string | object;
}
