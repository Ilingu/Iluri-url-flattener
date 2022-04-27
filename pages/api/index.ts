import { NextApiRequest, NextApiResponse } from "next";

const ApiRoute = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(200).send(
    `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="/IMG/iluri-logo-192.png" alt="Our logo" />
          <title>API 😎</title>
          <style>
            * {
              font-family: Courier, monospace;
              color: #588209;
            }
            body {
              background-color: #f9ffe6;
            }
          </style>
        </head>
        <body>
          <div style="text-align: center">
            <h1><img src="/IMG/favicon.ico" /> Iluri - API ROUTE 💥</h1>
            <h3>✅ All services are up (because otherwise you wouldn't have been able to see this message)</h3>
            <p>PS: no, we aren't hiring (ಥ _ ಥ)</p>
          </div>
        </body>
      </html>`
  );

export default ApiRoute;
