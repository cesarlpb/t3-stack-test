// Imports
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
// Hoja de estilos global
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
  <>
    <ClerkProvider {...pageProps}>
      <Head>
        <title>My Emojer App 😐 - A simple emoji-friendly app</title>
        <meta
          name="description"
          content="A simple emoji-friendly app with NextJS, TS, Prisma, Planetscale, Vercel, Axiom, Tailwind and some other stuff -- probably, maybe."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center"/>
      <Component {...pageProps} />
    </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
