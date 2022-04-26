import { NextPage } from "next";
import AuthCheck from "../components/Auth/AuthCheck";

const HomePage: NextPage = () => {
  return (
    <AuthCheck>
      <article className="page w-full"></article>
    </AuthCheck>
  );
};

export default HomePage;
