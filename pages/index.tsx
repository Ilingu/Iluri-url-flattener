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
import FormUrlShortener from "../components/FormInputUrl";

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
        <div className="mt-5 flex h-36 w-screen flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold tracking-wider text-main-800">
            Paste your URL to be shortened:
          </h1>
          <FormUrlShortener method="insert" />
        </div>
      </article>
    </AuthCheck>
  );
};

export default HomePage;
