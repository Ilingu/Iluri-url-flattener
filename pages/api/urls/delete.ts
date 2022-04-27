import { NextApiRequest, NextApiResponse } from "next";
import { AnswerToReq, Authentificate } from "../../../lib/utils/ServerFuncs";

const APIDeleteShortedURL = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return AnswerToReq({ res, success: true }); // ✅
  } catch (err) {
    return AnswerToReq({ res, success: false, data: "Internal Error/Catch" }); // ❌
  }
};

export default APIDeleteShortedURL;
