import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import {
  AnswerToReqArgsShape,
  APIResponse,
  FunctionJobSuccess,
} from "./types/interfaces";

/**
 * Check If the request comes from an authentificate user
 * @param {NextApiRequest} req
 * @returns {FunctionJobSuccess} `{success: true}` -- if it's an authentificate user
 */
export const Authentificate = async (
  req: NextApiRequest
): Promise<FunctionJobSuccess<string | Session>> => {
  try {
    const session = await getSession({ req });
    return {
      success: !!session,
      data: session,
    };
  } catch (err) {
    return { success: false, data: "Cannot Authenticate User/Catch" };
  }
};

/**
 * @param {object} data optinal, default = `{}`
 * @param {number} code optinal, default = `200`
 * @returns {APIResponse} APISuccessResponse Object
 */
const HandleSuccess = (data?: object, code?: number): APIResponse<object> => ({
  succeed: true,
  code: code || 200,
  data: data || {},
});

/**
 * @param {object} data optinal, default = `"Error in api route"`
 * @param {number} code optinal, default = `500`
 * @returns {APIResponse} APIErrorResponse Object
 */
const HandleError = (data?: string, code?: number): APIResponse<string> => {
  console.error(data || "Error in api route");
  return {
    succeed: false,
    code: code || 500,
    data: data || "Error in api route",
  };
};

/**
 * Response To The Api Request with a bunch of options
 * @param {NextApiResponse} res The Response Handler of Next `NextApiResponse`
 * @param {AnswerToReqArgsShape} Args
 *
 * `success`: If the request failed or succeed `boolean`
 *
 * `code`: The HTTP_CODE response (Optional) `number`
 *
 * `data`: Additional Data to return `string | object`
 */
export const AnswerToReq = (
  res: NextApiResponse,
  { success, code, data }: AnswerToReqArgsShape
) => {
  const ResponseObj: APIResponse<object | string> = success
    ? HandleSuccess(data as object, code)
    : HandleError(data as string, code);

  let CodeToSend: number = 500;
  if (code) CodeToSend = code;
  if (success && !code) CodeToSend = 200;
  return res.status(CodeToSend).json(ResponseObj);
};
