import toast from "react-hot-toast";
import {
  ApiCallArgsShape,
  APIResponse,
  FunctionJobSuccess,
  UrlsShape,
} from "./types/interfaces";
import { IsURL } from "./UtilsFunc";

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

/**
 * Shorten Link Url
 * @param {string} UrlToShorten
 * @returns {string} the shortened url
 */
export const ShortenUrl = async (
  UrlToShorten: string
): Promise<FunctionJobSuccess<string>> => {
  const SecureUrl = encodeURI(UrlToShorten?.trim() || "");
  if (SecureUrl.length < 8 || SecureUrl.length > 1000 || !IsURL(SecureUrl))
    return { success: false, data: "Invalid URL" };

  const ShortenUrlResponse = await ApiCall({
    uri: "/api/urls/new",
    method: "POST",
    body: { url: SecureUrl },
  });
  if (!ShortenUrlResponse.succeed || !ShortenUrlResponse?.data)
    return { success: false, data: "Server Error, couldn't reach service." };

  const { code } = ShortenUrlResponse.data as UrlsShape;
  return { success: true, data: code };
};

/**
 * Shorten Link Url
 * @param {string} UrlID
 * @param {string} NewLink
 * @returns {string} the shortened url
 */
export const EditUrlLink = async (
  NewLink: string,
  UrlID: string
): Promise<FunctionJobSuccess> => {
  const SecureUrl = encodeURI(NewLink?.trim() || "");
  if (SecureUrl.length < 8 || SecureUrl.length > 1000 || !IsURL(SecureUrl))
    return { success: false, data: "Invalid URL" };

  const EditUrlRes = await ApiCall({
    uri: "/api/urls/edit",
    method: "PUT",
    body: { UrlID, NewUrlLink: SecureUrl },
  });
  if (!EditUrlRes.succeed || !EditUrlRes?.data)
    return {
      success: false,
      data: `Server Error, couldn't reach service: ${EditUrlRes?.data}`,
    };

  return { success: true };
};
