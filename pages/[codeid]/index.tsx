import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import prisma from "../../lib/prisma";
import { Return404 } from "../../lib/utils/ServerFuncs";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { codeid },
  } = ctx;
  try {
    const UrlRes = await prisma.urls.findUnique({
      where: { code: codeid.toString().trim() },
    });
    if (!UrlRes || !UrlRes?.url) return Return404();

    return { redirect: { destination: UrlRes.url }, props: {} };
  } catch (err) {
    return Return404();
  }
};

const UrlPage: NextPage = () => {
  const { push } = useRouter();
  if (push) push("/");
  return <article className="page w-full">An Error have Occured.</article>;
};

export default UrlPage;
