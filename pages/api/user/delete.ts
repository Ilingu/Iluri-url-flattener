import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import prisma from "../../../lib/prisma";
import {
  AnswerToReq,
  Authentificate,
  GetUserID,
} from "../../../lib/utils/ServerFuncs";

const APIEditShortedURL = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE")
    return AnswerToReq(res, {
      success: false,
      data: "Only accept DELETE method", // ❌
    });

  try {
    const { success: AuthSuccess, data: session } = await Authentificate({
      req,
    });
    if (!AuthSuccess)
      return AnswerToReq(res, { success: false, data: "User Not Connected" }); // ❌

    const { success: UserIDSuccess, data: userId } = await GetUserID(
      session as Session
    );
    if (!UserIDSuccess || !userId)
      return AnswerToReq(res, { success: false, data: "User Not Connected" }); // ❌

    /* Delete All User data */
    await prisma.urls.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await prisma.account.deleteMany({ where: { userId } });
    await prisma.session.deleteMany({ where: { userId } });

    return AnswerToReq(res, { success: true }); // ✅
  } catch (err) {
    return AnswerToReq(res, { success: false, data: "Internal Error/Catch" }); // ❌
  }
};

export default APIEditShortedURL;
