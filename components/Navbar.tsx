import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";

const Navbar: FC = () => {
  return (
    <nav className="flex h-20 w-full items-center justify-between bg-gradient-to-r from-primary-description-whither to-primary-800 px-5">
      <Link href="/">
        <a className="flex items-center gap-x-2">
          <img src="/IMG/favicon.png" alt="Home" className="w-16 rounded" />
          <span className="text-lg font-bold text-primary-lightest">
            URL Flattener<span className="hidden sm:inline">🌐</span>
          </span>
        </a>
      </Link>

      <Link href="/login">
        <a></a>
      </Link>
    </nav>
  );
};

export default Navbar;
