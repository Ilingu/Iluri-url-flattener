import { NextPage } from "next";
import { useEffect, useRef } from "react";
import AuthCheck from "../components/Auth/AuthCheck";

const HomePage: NextPage = () => {
  const AnimationElement = useRef<HTMLSpanElement>();

  const RenderElement = (textToDisplay: string) => {
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
        <header>
          <h1
            className={`min-w-[640px] font-["Origami_Mommy"] text-4xl font-semibold text-main-900`}
          >
            ILURI - URL{" "}
            <span
              className={`font-["Origami_Mommy"] text-4xl font-semibold text-main-900`}
              ref={AnimationElement}
            ></span>
          </h1>
        </header>
      </article>
    </AuthCheck>
  );
};

export default HomePage;
