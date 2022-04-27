import { NextPage } from "next";
import AuthCheck from "../../components/Auth/AuthCheck";

const EditPage: NextPage = () => {
  return (
    <AuthCheck>
      <article className="page w-full"></article>
    </AuthCheck>
  );
};

export default EditPage;
