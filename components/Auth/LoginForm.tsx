import React, { FC } from "react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
// UI
import AuthCheck from "./AuthCheck";
import {
  FaEnvelope,
  FaGithub,
  FaGoogle,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

// Types
interface LoginFormProps {
  FromLoginPage?: boolean;
}
interface ChildrenProps {
  children: React.ReactElement | React.ReactElement[];
}
type AuthMetodVal = "signup" | "signin";

// JSX
const LoginForm: FC<LoginFormProps> = ({ FromLoginPage }) => {
  if (FromLoginPage)
    return (
      <AuthCheck fallback={<NotConnected />}>
        <AlreadyConnected />
      </AuthCheck>
    );

  return <NotConnected />;
};

const BoxContainer = ({ children }: ChildrenProps) => (
  <article className="page w-full">
    <div
      className="grid h-[70vh] w-[370px] grid-rows-6 justify-items-center rounded-xl bg-main-700 bg-opacity-95 
    py-4 px-2 text-lg text-main-50 sm:h-[60vh]"
    >
      {children}
    </div>
  </article>
);

const HeaderContainer = ({ children }: ChildrenProps) => (
  <header className="row-span-2 flex flex-col capitalize">
    <div className="mx-auto my-2 h-20 w-20 rounded-2xl bg-main-900 p-2">
      <Image
        src="/IMG/iluri-logo-192.png"
        alt="Home"
        className="rounded"
        width={64}
        height={64}
      />
    </div>
    {children}
  </header>
);

const AlreadyConnected = () => (
  <BoxContainer>
    <HeaderContainer>
      <h1 className="text-2xl font-bold tracking-wider">Already Connected!</h1>
    </HeaderContainer>
    <div className="row-span-4">
      <button
        onClick={() => signOut()}
        className="rounded-md bg-red-500 p-2 text-xl font-bold transition-all active:ring-1 active:ring-red-800"
      >
        <FaSignOutAlt className="icon" /> SignOut
      </button>
    </div>
  </BoxContainer>
);

const NotConnected = () => (
  <BoxContainer>
    <HeaderContainer>
      <h1 className="text-2xl font-bold tracking-wider">
        <FaSignInAlt className="icon" /> Join Iluri
      </h1>
    </HeaderContainer>
    <div className="row-span-4 flex w-full flex-col items-center">
      <h1 className="mb-2 flex-[0.3]">Choose a Providers:</h1>
      <div className="grid w-1/2 grid-rows-3 gap-y-1">
        <button
          onClick={() => signIn()}
          className="rounded bg-gray-900 py-1 text-lg font-semibold"
        >
          <FaGithub className="icon" /> Github
        </button>
        <button
          disabled
          title="Provider not configured yet 😓"
          className="rounded bg-gray-300 text-lg font-semibold text-main-900"
        >
          <FaGoogle className="icon" /> Google
        </button>
        <button
          disabled
          title="Provider not configured yet 😓"
          className="rounded bg-gray-300 text-lg font-semibold text-main-900"
        >
          <FaEnvelope className="icon" /> Email
        </button>
      </div>
    </div>
  </BoxContainer>
);

export default LoginForm;
