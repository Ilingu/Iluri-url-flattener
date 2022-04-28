import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import prisma from "../../../lib/prisma";
import {
  AnswerToReq,
  Authentificate,
  GetAllUserURL,
  IsUrlOwner,
} from "../../../lib/utils/ServerFuncs";
import { FormatDataToJSON, IsURL } from "../../../lib/utils/UtilsFunc";

const APIEditShortedURL = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "PUT")
    return AnswerToReq(res, {
      success: false,
      data: "Only accept PUT method", // ❌
    });

  const JSONBody: { [K in string]: any } =
    typeof body === "string" ? JSON.parse(body) : body;
  if (!body || !JSONBody || !JSONBody["UrlID"] || !JSONBody["NewUrlLink"])
    return AnswerToReq(res, {
      success: false,
      data: "Url to shorten is missing", // ❌
    });

  const UrlToEditID = (JSONBody["UrlID"] as string).trim();
  const NewUrlLink = encodeURI(JSONBody["NewUrlLink"] as string).trim();
  if (NewUrlLink.length < 8 || NewUrlLink.length > 1000 || !IsURL(NewUrlLink))
    return AnswerToReq(res, {
      success: false,
      data: "Invalid Url", // ❌
    });

  try {
    const { success: AuthSuccess, data: session } = await Authentificate({
      req,
    });
    if (!AuthSuccess)
      return AnswerToReq(res, { success: false, data: "User Not Connected" }); // ❌

    if (!IsUrlOwner(session as Session, UrlToEditID))
      return AnswerToReq(res, {
        success: false,
        code: 403,
        data: "You're not the owner of this URL",
      }); // ❌

    await prisma.urls.update({
      where: { id: UrlToEditID },
      data: { url: NewUrlLink }, // Update
    });
    const { success, data: RawUserUrls } = await GetAllUserURL(
      (session as Session).user.email
    ); // Refresh Data and send it to client
    return AnswerToReq(res, {
      success: true,
      data: RawUserUrls.map(FormatDataToJSON) || null,
    }); // ✅
  } catch (err) {
    return AnswerToReq(res, { success: false, data: "Internal Error/Catch" }); // ❌
  }
};

export default APIEditShortedURL;
