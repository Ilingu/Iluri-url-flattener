import { GetServerSideProps, NextPage } from "next";
import { Return404 } from "../../lib/utils/UtilsFunc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { redirect: { destination: "/" }, props: {} };
  return Return404();
};

const UrlPage: NextPage = () => {
  return (
    <article className="page w-full">
      You will be automatically redirected...
    </article>
  );
};

export default UrlPage;
