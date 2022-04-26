import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
import AuthCheck from "./Auth/AuthCheck";

const Navbar: FC = () => {
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
          <span
            className={`text-primary-lightest font-["Origami_Mommy"] text-xl`}
          >
            URL Flattener<span className="hidden sm:inline">🔗</span>
          </span>
        </a>
      </Link>
      <AuthCheck
        fallback={
          <Link href="/login">
            <a
              className="rounded-md bg-main-400 p-2 text-lg font-semibold text-main-800 shadow-lg 
              shadow-main-900 transition-all hover:font-bold hover:text-main-900 focus:ring-2 focus:ring-main-50"
            >
              Get Started!
            </a>
          </Link>
        }
      >
        <p>Connected</p>
      </AuthCheck>
    </nav>
  );
};

export default Navbar;
