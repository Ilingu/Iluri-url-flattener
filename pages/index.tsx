import { NextPage } from "next";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
// Auth
import AuthCheck from "../components/Auth/AuthCheck";
// Funcs
import { IsURL } from "../lib/utils/UtilsFunc";
// Icons
import { AiFillWarning } from "react-icons/ai";
import { FaCompressAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { ApiCall, copyToClipboard } from "../lib/utils/ClientFuncs";
import { UrlsShape } from "../lib/utils/types/interfaces";

const HomePage: NextPage = () => {
  const AnimationElement = useRef<HTMLSpanElement>();

  const RenderElement = (textToDisplay: string) => {
    if (AnimationElement.current)
      AnimationElement.current.textContent = textToDisplay;
  };

  useEffect(() => {
    const AnimationText = ["SHORTENER ⛓", "FLATTENER 📄", "PROTECTER 🔰"];
    let unsub: NodeJS.Timer;
    let TextIndex = 0;
    let pause = 0;
    let moving: "foward" | "backward" = "foward";

    unsub = setInterval(() => {
      if (pause > 0) return pause--;

      if (moving === "backward") {
        pause = 1;
        moving = "foward";
        return RenderElement("");
      }

      if (moving === "foward") {
        pause = 3;
        moving = "backward";
        RenderElement(AnimationText[TextIndex]);
      }

      if (TextIndex === AnimationText.length - 1) return (TextIndex = 0);
      TextIndex++;
    }, 300);

    return () => clearInterval(unsub);
  }, []);

  return (
    <AuthCheck>
      <article className="page w-full">
        <header className="text-center md:text-justify">
          <h1
            className={`min-h-[80px] min-w-[640px] font-["Origami_Mommy"] text-4xl font-semibold text-main-900`}
          >
            ILURI - URL <br className="block md:hidden" />
            <span
              className={`font-["Origami_Mommy"] text-4xl font-semibold text-main-900`}
              ref={AnimationElement}
            ></span>
          </h1>
        </header>
        <FormShortenUrl />
      </article>
    </AuthCheck>
  );
};

export default HomePage;

function FormShortenUrl() {
  const [_, startTransition] = useTransition();

  const [UrlToShorten, setUrlToShorten] = useState("");
  const [BadUrl, setBadUrl] = useState(false);
  const [UrlCode, setUrlCode] = useState("");

  const InputElement = useRef<HTMLInputElement>();

  useEffect(() => {
    InputElement.current?.focus();
  }, []);

  const ShortenUrl = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const SecureUrl = encodeURI(UrlToShorten?.trim() || "");
    if (SecureUrl.length < 8 || SecureUrl.length > 1000 || !IsURL(SecureUrl))
      return toast.error("Invalid URL");

    const ShortenUrlResponse = await ApiCall({
      uri: "/api/urls/new",
      method: "POST",
      body: { url: SecureUrl },
    });
    if (!ShortenUrlResponse.succeed || !ShortenUrlResponse?.data)
      return toast.error("Server Error, couldn't reach service.");

    const { code } = ShortenUrlResponse.data as UrlsShape;
    setUrlCode(`${window.location.host}/${code}`);
    toast.success(`Url stored, here your code: ${code}`);
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
    <div className="mt-5 flex h-36 w-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold tracking-wider text-main-800">
        Paste your URL to be shortened:
      </h1>
      <form
        onSubmit={ShortenUrl}
        className="mt-3 grid h-full w-1/2 grid-cols-6 place-content-center gap-x-2 gap-y-1 rounded-md p-5 ring-2 ring-black"
      >
        <input
          type="text"
          ref={InputElement}
          value={UrlToShorten}
          onChange={HandleChange}
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
          <FaCompressAlt className="icon" /> Shorten URL
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
    </div>
  );
}
