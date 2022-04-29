import { Urls } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { FaEdit } from "react-icons/fa";
import AuthCheck from "../../components/Auth/AuthCheck";
import FormUrlShortener from "../../components/FormInputUrl";
import prisma from "../../lib/prisma";
import {
  Authentificate,
  Return404,
  IsUrlOwner,
} from "../../lib/utils/ServerFuncs";
import { FormatDataToJSON } from "../../lib/utils/UtilsFunc";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { codeid },
  } = ctx;
  try {
    const { success: Auth, data: session } = await Authentificate({
      ctx,
    });
    if (!Auth || !(session as Session)?.user?.email)
      return { props: { UrlData: null } };

    const UrlRes = await prisma.urls.findUnique({
      where: { code: codeid.toString().trim() },
    });
    if (!UrlRes || !UrlRes?.id) return Return404();

    const IsOwner = await IsUrlOwner(session as Session, UrlRes.id);
    if (!IsOwner) return Return404();

    return { props: { UrlData: FormatDataToJSON(UrlRes) } };
  } catch (err) {
    return Return404();
  }
};

interface SSRProps {
  UrlData: Urls;
}

const EditPage: NextPage<SSRProps> = ({ UrlData }) => {
  if (!UrlData) return <article className="page w-full">Error: No Url</article>;
  const { code, url, id } = UrlData;
  return (
    <AuthCheck>
      <article className="page w-full">
        <header className="text-center">
          <h1 className="min-h-[80px] min-w-[640px] text-4xl font-semibold text-main-900">
            Edit `{code}`
          </h1>
        </header>
        <div className="mt-5 flex h-36 w-screen flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold tracking-wider text-main-800">
            <FaEdit className="icon" /> Edit the link of this url
          </h1>
          <FormUrlShortener method="update" baseUrl={url} EditUrlID={id} />
        </div>
      </article>
    </AuthCheck>
  );
};

export default EditPage;
