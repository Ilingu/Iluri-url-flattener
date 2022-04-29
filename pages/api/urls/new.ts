import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import prisma from "../../../lib/prisma";
import {
  AnswerToReq,
  Authentificate,
  CheckUrl,
} from "../../../lib/utils/ServerFuncs";
import { ReturnFormattedUrl } from "../../../lib/utils/UtilsFunc";

const APINewShortedURL = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    body,
    headers: { host },
  } = req;

  if (method !== "POST")
    return AnswerToReq(res, {
      success: false,
      data: "Only accept POST method", // ❌
    });

  const JSONBody: { [K in string]: any } =
    typeof body === "string" ? JSON.parse(body) : body;
  if (!body || !JSONBody || !JSONBody["url"])
    return AnswerToReq(res, {
      success: false,
      data: "Url to shorten is missing", // ❌
    });

  const URLToShorten = encodeURI((JSONBody["url"] as string).trim());
  if (!CheckUrl(URLToShorten))
    return AnswerToReq(res, {
      success: false,
      data: "Invalid Url", // ❌
    });
  if (ReturnFormattedUrl(URLToShorten).host === host)
    return AnswerToReq(res, {
      success: false,
      data: "Url Cannot be the same than the website url you're in.", // ❌
    });

  try {
    const { success: AuthSuccess, data: session } = await Authentificate({
      req,
    });
    if (!AuthSuccess)
      return AnswerToReq(res, { success: false, data: "User Not Connected" }); // ❌

    const {
      user: { email },
    } = session as Session;
    const DBResponse = await prisma.urls.create({
      data: {
        url: URLToShorten,
        code: randomUUID().slice(0, 8),
        user: { connect: { email } },
      },
    });

    if (!DBResponse)
      return AnswerToReq(res, { success: false, data: "Couldn't create URL" }); // ❌

    return AnswerToReq(res, { success: true, data: DBResponse }); // ✅
  } catch (err) {
    return AnswerToReq(res, { success: false, data: err }); // ❌
  }
};

export default APINewShortedURL;
