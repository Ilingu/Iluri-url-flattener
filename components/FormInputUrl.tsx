import {
  ChangeEvent,
  FC,
  FormEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import toast from "react-hot-toast";
import { AiFillWarning } from "react-icons/ai";
import { FaCompressAlt, FaEdit } from "react-icons/fa";
import {
  copyToClipboard,
  EditUrlLink,
  ShortenUrl,
} from "../lib/utils/ClientFuncs";
import { IsURL } from "../lib/utils/UtilsFunc";

interface Props {
  method: "insert" | "update";
  baseUrl?: string;
  EditUrlID?: string;
}

const FormUrlShortener: FC<Props> = ({ method, baseUrl, EditUrlID }) => {
  const [_, startTransition] = useTransition();

  const [UrlToShorten, setUrlToShorten] = useState("");
  const [BadUrl, setBadUrl] = useState(false);
  const [UrlCode, setUrlCode] = useState("");

  const InputElement = useRef<HTMLInputElement>();

  useEffect(() => {
    InputElement.current?.focus();
  }, []);

  useEffect(() => {
    if (!baseUrl || !EditUrlID) return;
    setUrlToShorten(baseUrl);
  }, [baseUrl, EditUrlID]);

  const SubmitLink = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const { success, data } = await ShortenUrl(UrlToShorten);
    if (!success) return toast.error(data);

    toast.success(`Url stored, here your code: ${data}`);
    setUrlCode(`${window.location.host}/${data}`);
  };

  const EditLink = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const { success, data } = await EditUrlLink(UrlToShorten, EditUrlID);
    if (!success) return toast.error(data);
    toast.success(`Url Link edited successfully!`);
  };

  const HandleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const _Url = evt?.target?.value || "";
    setUrlToShorten(_Url);
    startTransition(() => {
      const isValidUrl = IsURL(_Url);
      setBadUrl(!isValidUrl);
    });
  };
  return (
    <form
      onSubmit={method === "insert" ? SubmitLink : EditLink}
      className="mt-3 grid h-full w-1/2 grid-cols-6 place-content-center gap-x-2 gap-y-1 rounded-md p-5 ring-2 ring-black"
    >
      <input
        type="url"
        ref={InputElement}
        value={UrlToShorten}
        onChange={HandleChange}
        required
        placeholder="https://www.verylongurl.com/verylonguri"
        className="col-span-4 h-10 rounded bg-main-700 bg-opacity-80 p-2 text-main-50 
          outline-none transition-all focus:ring-2 focus:ring-amber-400"
      />
      <button
        type="submit"
        disabled={BadUrl}
        className={`col-span-2 h-10 rounded-md bg-main-500 p-2 outline-none transition-all hover:bg-main-400 focus:ring-2 
          focus:ring-amber-400${BadUrl ? " opacity-60" : ""}`}
      >
        {method === "insert" ? (
          <>
            <FaCompressAlt className="icon" /> Shorten URL
          </>
        ) : (
          <>
            <FaEdit className="icon" /> Edit Link
          </>
        )}
      </button>
      <style jsx>
        {`
          input::placeholder {
            color: #ddd;
          }
        `}
      </style>{" "}
      {BadUrl && (
        <p className="col-span-6 text-center font-semibold text-red-500">
          <AiFillWarning className="icon" /> Invalid Url
        </p>
      )}
      {UrlCode.length > 0 && (
        <p className="col-span-6 mt-5 text-center text-xl text-main-800">
          Your shortened URL: <br />
          <span
            className="cursor-pointer select-all text-3xl font-bold text-emerald-600 transition-all hover:text-main-700 hover:underline hover:decoration-green-500"
            onClick={() => {
              copyToClipboard(UrlCode);
              toast.success("Url Copied into Clipboard");
            }}
          >
            {UrlCode}
          </span>
        </p>
      )}
    </form>
  );
};

export default FormUrlShortener;
