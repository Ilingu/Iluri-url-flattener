import { NextApiRequest, NextApiResponse } from "next";

const ApiRoute = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: "API ROUTE" });
};
export default ApiRoute;
