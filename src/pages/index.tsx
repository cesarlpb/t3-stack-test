import { SignOutButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Post } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Img from "next/image";
import Link from "next/link";

import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const {user} = useUser();
  if(!user) return null;
  return (
    <div className="me-3">
      <Img className="rounded-full" src={user.profileImageUrl} alt={user.username || "profile picture"} width={24} height={24}/>
    </div>
  )
};

const Home: NextPage = () => {
  
  const user = useUser();
  const {data, isLoading} = api.posts.getAll.useQuery();
  const previewData: Post[] = data?.slice(0, 3) || [];

  return (
    <>
      <Head>
        <title>My Emojer App 😐 - A simple emoji-friendly app</title>
        <meta name="description" content="A simple emoji-friendly app with NextJS, TS, Prisma, Planetscale, Vercel, Axiom, Tailwind and some other stuff -- probably, maybe." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      
      <div className="flex flex-row items-center fixed top-0 px-10 py-5 bg-slate-900/70 justify-between w-full border-0">
        <Link href="/">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-200 sm:text-[2rem]">
            My <span className="text-[hsl(280,100%,70%)]">Emojer</span> App 🙃
          </h1>
        </Link>
        <div className="flex flex-row gap-4 sm:grid-cols-2 md:gap-8">
          <h2 className="flex flex-row items-center text-3xl text-slate-200 whitespace-pre">
            Bienvenid@ 
            <span className="text-[hsl(280,100%,70%)]">
              {user && user.user?.username ? " " + user.user.username : ' '}
            </span>👀!
          </h2>
        
          <div className="flex justify-center">
            {!user.isSignedIn && 
            <SignInButton>
              <button className="rounded-full bg-gray-500 px-10 py-3 font-semibold text-slate-200 no-underline transition hover:bg-white/40 text-center">
                Iniciar sesión
              </button>
            </SignInButton>}
            {!!user.isSignedIn && 
            <SignOutButton>
              <button className="rounded-full bg-gray-500 px-10 py-3 font-semibold text-slate-200 no-underline transition hover:bg-white/20 text-center">
                Cerrar sesión
              </button>
            </SignOutButton>}
          </div>
        </div>
      </div>

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-200 sm:text-[4rem]">
            My <span className="text-[hsl(280,100%,70%)]">Emojer</span> App 😐
          </h1>
          <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-8">  
          </div>
          <div className="flex flex-col items-center justify-center w-80 border-white border-0">
            <h3 className="text-2xl text-slate-200 pb-2">Últimos posts:</h3>
            {previewData && previewData?.map((post) => (
              <div className="flex flex-row items-center justify-center bg-white/10 rounded-xl p-4 my-1 text-white text-2xl hover:bg-white/20 w-10/12 mx-auto" key={post.id}>
                <CreatePostWizard />
                <span className="">{post.content}</span>
              </div>
          ))}
          {isLoading && <div className="flex flex-row items-center justify-center bg-white/10 rounded-xl p-4 my-1 text-white hover:bg-white/20 w-10/12 mx-auto">Cargando emojis 🙈...</div>}
          {!previewData && <div className="flex flex-row items-center justify-center bg-white/10 rounded-xl p-4 my-1 text-white hover:bg-white/20 w-10/12 mx-auto">No hay emojis, gg!🥶</div>}
          </div>
          <Link className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-black no-underline transition hover:bg-cyan-200/70 hover:text-slate-200 text-center"
          href="/posts">
            Ver mas posts
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
