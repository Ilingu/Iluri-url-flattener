import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
// Auth
import AuthCheck from "./Auth/AuthCheck";
import { useSession } from "next-auth/react";

const Navbar: FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex h-20 w-full items-center justify-between bg-gradient-to-r from-main-600 to-main-700 px-5 text-main-50">
      <Link href="/">
        <a className="flex items-center gap-x-2">
          <Image
            src="/IMG/iluri-logo-192.png"
            alt="Home"
            className="rounded"
            width={64}
            height={64}
          />
          <span className={`font-["Origami_Mommy"] text-xl`}>Iluri</span>
        </a>
      </Link>
      <AuthCheck
        fallback={
          <Link href="/login">
            <a
              className="rounded-md bg-main-400 p-2 text-lg font-semibold text-main-800 shadow-lg 
              shadow-main-900 transition-all hover:font-bold hover:text-main-900 focus:ring-2 focus:ring-amber-400"
            >
              Get Started!
            </a>
          </Link>
        }
      >
        <Link href="/account" passHref>
          <Image
            src={session?.user?.image}
            alt="User Avatar"
            width={64}
            height={64}
            className="cursor-pointer rounded-md transition-all hover:opacity-75"
          />
        </Link>
      </AuthCheck>
    </nav>
  );
};

export default Navbar;
