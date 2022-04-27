import { ApiCallArgsShape, APIResponse } from "./types/interfaces";
import { IsURL } from "./UtilsFunc";

/**
 * @returns 404's Page
 */
export const Return404 = () => ({
  notFound: true,
});

/**
 * Handle API fetch
 * @param
 * @returns 404's Page
 */
export const ApiCall = async ({
  uri,
  method,
  body,
}: ApiCallArgsShape): Promise<APIResponse<object | string>> => {
  try {
    uri = encodeURI(uri.trim());
    if (!IsURL(`http://test.com${uri.startsWith("/") ? uri : `/${uri}`}`))
      throw new Error("Invalid URI");

    const APIRequest = await fetch(uri, {
      method,
      body: JSON.stringify(body || {}),
    });
    const APIResponse = await APIRequest.json();
    return APIResponse;
  } catch (err) {
    console.error(err);
    return { succeed: false, code: 100, data: "Cannot Fetch/Client" };
  }
};

/**
 * Copy Text To User Clipbord
 * @param {string} text
 */
export const copyToClipboard = (text: string) =>
  navigator.clipboard.writeText(text);
