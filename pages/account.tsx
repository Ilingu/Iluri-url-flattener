import { Urls } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaClock,
  FaEdit,
  FaFingerprint,
  FaSignOutAlt,
  FaTrashAlt,
} from "react-icons/fa";
import AuthCheck from "../components/Auth/AuthCheck";
import { ApiCall } from "../lib/utils/ClientFuncs";
import {
  Authentificate,
  GetAllUserURL,
  Return404,
} from "../lib/utils/ServerFuncs";
import { FormatDataToJSON, ReturnFormattedUrl } from "../lib/utils/UtilsFunc";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { success: Auth, data: session } = await Authentificate({
      ctx,
    });
    if (!Auth || !(session as Session)?.user?.email)
      return { props: { UserUrls: null } };

    const { success, data: RawUserUrls } = await GetAllUserURL(
      (session as Session).user.email
    );
    if (!success || RawUserUrls.length <= 0)
      return { props: { UserUrls: null } };

    const UserUrls = RawUserUrls.map(FormatDataToJSON);
    return { props: { UserUrlsSSR: UserUrls } };
  } catch (err) {
    return Return404();
  }
};

interface SSRProps {
  UserUrlsSSR: Urls[];
}

const AccountPage: NextPage<SSRProps> = ({ UserUrlsSSR }) => {
  const { data: session } = useSession();

  const [UserUrls, setNewUserUrls] = useState(() => UserUrlsSSR);
  const [RenderedUrls, NewRender] = useState<JSX.Element[]>();

  const DeleteUrl = useCallback(async (UrlId: string) => {
    UrlId = UrlId.trim();
    if (UrlId.length <= 0) return toast.error("Cannot delete.");

    const DeleteResponse = await ApiCall({
      uri: "/api/urls/delete",
      method: "DELETE",
      body: { UrlID: UrlId },
    });
    if (!DeleteResponse.succeed || !DeleteResponse?.data)
      return toast.error("Server Error, couldn't reach service.");
    const RefreshedUserUrl = DeleteResponse.data as Urls[];
    setNewUserUrls(RefreshedUserUrl);
  }, []);

  const DeleteAccount = async () => {
    const DeleteResponse = await ApiCall({
      uri: "/api/user/delete",
      method: "DELETE",
    });

    if (!DeleteResponse.succeed || !DeleteResponse?.data)
      return toast.error("Couldn't reach server, cannot delete this account.");
    toast.success("Your account is now deleted");
    history.pushState("", "", "/login");
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    if (!UserUrls || UserUrls.length <= 0) return;
    const JSXElements = UserUrls.map((UrlData) => (
      <UrlItem key={UrlData.id} {...UrlData} DeleteUrl={DeleteUrl} />
    ));
    NewRender(JSXElements);
  }, [UserUrls, DeleteUrl]);

  const { user } = session || {};
  return (
    <AuthCheck>
      <article className="page w-full">
        <header className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-main-700 underline">
            Welcome {user?.name} 👋
          </h1>
          <h2 className="text-3xl font-semibold text-main-900">You can:</h2>
          <div className="mt-4 flex justify-center gap-x-5 text-xl">
            <p
              onClick={() => signOut()}
              className="cursor-pointer leading-5 text-main-800 transition-all hover:text-amber-500 hover:underline
             hover:decoration-amber-500"
            >
              <FaSignOutAlt className="icon" /> Sign Out
            </p>
            <p
              className="cursor-pointer leading-5 text-main-800 transition-all hover:text-red-500 hover:underline
             hover:decoration-red-500"
              title="Double Click -- Delete All your information (urls and account) from the DB. Note that this won't revoke the oauth with github."
              onDoubleClick={() => DeleteAccount()}
            >
              <FaTrashAlt className="icon" /> Delete Account
            </p>
          </div>
          <hr className="my-10" />
        </header>
        <section className="w-full text-center">
          <h1 className="text-4xl font-bold text-main-700">Your Urls:</h1>
          <div className="grid max-h-[500px] grid-cols-1 gap-y-4">
            {RenderedUrls || "Nothing To Show!"}
          </div>
        </section>
      </article>
    </AuthCheck>
  );
};

type UrlItemType = Urls & { DeleteUrl: (UrlId: string) => void };
function UrlItem({ url, code, createAt, id, DeleteUrl }: UrlItemType) {
  const { host } = ReturnFormattedUrl(url);

  return (
    <div className="flex min-h-[150px] flex-col items-center justify-between rounded-lg bg-main-100 bg-opacity-50 p-2 shadow-md shadow-main-800 ring-2 ring-main-700">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        title={url}
        className="text-xl font-bold text-blue-600 hover:underline hover:decoration-cyan-500"
      >
        {host}
      </a>
      <div>
        <ul className="text-left text-main-600">
          <li>
            <FaFingerprint className="icon" />{" "}
            <a
              href={`${window.location.origin}/${code}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-main-700 hover:underline"
            >
              {code}
            </a>
          </li>
          <li>
            <FaClock className="icon" />{" "}
            <span
              className="font-bold text-main-700"
              title={new Date(createAt).toLocaleString()}
            >
              {new Date(createAt).toDateString()}
            </span>
          </li>
        </ul>
      </div>
      <div className="flex justify-center gap-x-5">
        <Link href={`/${code}/edit`}>
          <a>
            <button
              className="leading-5 text-main-800 transition-all hover:text-blue-500 hover:underline
             hover:decoration-blue-500"
            >
              <FaEdit className="icon" /> Edit
            </button>
          </a>
        </Link>
        <button
          className="leading-5 text-main-800 transition-all hover:text-red-500 hover:underline
             hover:decoration-red-500"
          onDoubleClick={() => DeleteUrl(id)}
        >
          <FaTrashAlt className="icon" /> Delete
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
