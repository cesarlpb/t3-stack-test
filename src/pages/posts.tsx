import { SignOutButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Img from "next/image";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ProfilePicture = ({ width, height }: { width?: number; height?: number }) => {
  const {user} = useUser();
  if(!user) return null;
  return (
  <div className="me-3">
    <Img className="rounded-full" 
    src={user.profileImageUrl} 
    alt={user.username || "profile picture"} 
    width={width ?? 16} 
    height={height ?? 16}/>
  </div>
  )
};
const CreatePostWizard = () => {
  const {user} = useUser();
  if(!user) return null;
  return (
    <ProfilePicture width={32} height={32}/>
  )
};
const Posts: NextPage = () => {
    const user = useUser();
    if(!user) return null;
    const {data, isLoading} = api.posts.getAll.useQuery();
    return(
        <>
        <Head>
          <title>My Emojer App 😐 - A simple emoji-friendly app</title>
          <meta name="description" content="A simple emoji-friendly app with NextJS, TS, Prisma, Planetscale, Vercel, Axiom, Tailwind and some other stuff -- probably, maybe." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          
          <div className="flex flex-row fixed top-0 px-10 py-5 bg-slate-900/70 justify-between w-full border-0">
          <a href="/">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-200 sm:text-[2rem]">
              My <span className="text-[hsl(280,100%,70%)]">Emojer</span> App 🙃
            </h1>
          </a>
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

          <div className="flex flex-col items-center justify-center w-full border-white border-0">
            <h3 className="text-2xl text-slate-200 pb-2">Emojis:</h3>
            
          <div className="w-1/2 border-0">
          {data && data?.map((post) => (
            <div className="flex flex-row items-center justify-center bg-white/10 rounded-xl p-4 my-1 text-white text-2xl hover:bg-white/20 w-10/12 mx-auto" key={post.id}>
              <ProfilePicture width={48} height={48} />
              <div className="flex flex-col">
                <span className="ms-3 text-xs text-slate-400">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}</span>
                <span className="ms-3">{post.content}</span>
              </div>
            </div>
          ))}
          </div>

          {isLoading && <div className="flex flex-row items-center justify-center bg-white/10 rounded-xl p-4 my-1 text-white hover:bg-white/20 w-10/12 mx-auto">Cargando emojis 🙈...</div>}
          {!data && <div className="flex flex-row items-center justify-center bg-white/10 rounded-xl p-4 my-1 text-white hover:bg-white/20 w-10/12 mx-auto">No hay emojis, gg!🥶</div>}
          </div>
        </div>
      </main>
        </>
    )
};

export default Posts;