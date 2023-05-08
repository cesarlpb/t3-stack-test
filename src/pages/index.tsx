import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Test app</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Test <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link> */}
            {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link> */}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {/* {hello.data ? hello.data.greeting : "Loading tRPC query..."} */}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

const capitalize = (s: string, i:number = 1) => {
  return s.charAt(0).toUpperCase() + s.slice(i)
}
  return (
      <div className="flex flex-col items-center justify-center gap-4 space-y-2">
        <p className="flex items-center justify-center text-center text-2xl text-white">
          {sessionData && <span className="mr-2">Has inicido sesión como {sessionData.user?.name}</span>}
          {sessionData && <Image className="rounded-full ml-2" src={sessionData.user?.image || "/avatar.png"} width={32} height={32} alt={sessionData.user?.name || "usuario"}></Image>}
        </p>

        <p className="flex items-center justify-center text-center text-xl text-white">
          {<a className="rounded-full bg-white/20 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" href="/posts">Ver posts</a>}
        </p>

        <p className="flex items-center justify-center text-center text-2xl text-white">
          {secretMessage && <span>{capitalize(secretMessage, 1)}</span>}
        </p>

        <p></p>

        <button
          className="rounded-full bg-gray-500 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
      
        {sessionData ? "Cerrar sesión" : "Iniciar sesión"}
      </button>
    </div>
  );
};
