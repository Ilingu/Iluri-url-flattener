import { Urls } from "@prisma/client";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ParsedUrlQuery } from "querystring";
import prisma from "../prisma";
import {
  AnswerToReqArgsShape,
  APIResponse,
  FunctionJobSuccess,
} from "./types/interfaces";
import { IsURL } from "./UtilsFunc";

/**
 * @returns 404's Page
 */
export const Return404 = (): { notFound: true } => ({
  notFound: true,
});

/**
 * Check If it's a valid DB URL
 * @param {string} urlToCheck
 * @returns {boolean} `true` -- if the check succeed
 */
export const CheckUrl = (urlToCheck: string): boolean => {
  if (urlToCheck.length < 8 || urlToCheck.length > 1000 || !IsURL(urlToCheck))
    return false;
  return true;
};

interface AuthenticateArgsParams {
  req?: NextApiRequest;
  ctx?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>;
}
/**
 * Check If the request comes from an authentificate user
 * @param {NextApiRequest} req
 * @returns {FunctionJobSuccess} `{success: true}` -- if it's an authentificate user
 */
export const Authentificate = async ({
  req,
  ctx,
}: AuthenticateArgsParams): Promise<FunctionJobSuccess<Session | string>> => {
  try {
    const session = await getSession({ req, ctx });
    return {
      success: !!session,
      data: session,
    };
  } catch (err) {
    return { success: false, data: "Cannot Authenticate User/Catch" };
  }
};

/**
 * Check If the logged user is the owner of the ShortenedUrl
 * @param {Session} session
 * @param {string} UrlID
 * @returns {boolean} `true` -- if thus user is the owner of this ShortenedUrl
 */
export const IsUrlOwner = async (
  session: Session,
  UrlID: string
): Promise<boolean> => {
  try {
    const UserEmail = session?.user?.email;
    if (!UserEmail) return false;

    const { id: UserID } = await prisma.user.findUnique({
      where: { email: UserEmail },
    });
    if (!UserID) return false;

    const { userId: UrlAuthor } = await prisma.urls.findUnique({
      where: { id: UrlID },
    });
    if (UserID !== UrlAuthor) return false;
    return true;
  } catch (err) {
    return false;
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

/**
 * Get all Urls created by a user
 * @param {string} email the email of the user
 * @returns {Urls[]} All Urls created by this user
 */
export const GetAllUserURL = async (
  email: string
): Promise<FunctionJobSuccess<Urls[]>> => {
  try {
    const User = await prisma.user.findUnique({ where: { email } });
    if (!User) return { success: false };

    const UserUrls = await prisma.urls.findMany({
      where: { userId: User.id },
      include: { user: { select: { name: true } } },
    });
    if (!UserUrls) return { success: false };
    return { success: true, data: UserUrls };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
