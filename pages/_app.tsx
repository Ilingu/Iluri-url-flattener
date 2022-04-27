import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
// UI
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import MetaTags from "../components/Metatags";
import { Toaster } from "react-hot-toast";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <MetaTags />
      <main className="flex h-screen flex-col">
        <Navbar />
        <Component {...pageProps} />
      </main>
      <Toaster position="top-right" />
    </SessionProvider>
  );
}

export default App;
