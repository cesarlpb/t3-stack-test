import { SignOutButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Img from "next/image";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from "next/link";
// import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";

const ProfilePicture = ({ width, height, colSpan }: { width?: number; height?: number, colSpan?: number }) => {
  
  const {user} = useUser();

  if(!user) return null;
  return (
  <div className={`flex justify-center col-span-${colSpan ?? 4} mx-auto`}>
    <Img className="rounded-full"
    src={user.profileImageUrl} 
    alt={user.username || "profile picture"} 
    width={width ?? 16} 
    height={height ?? 16}/>
  </div>
  )
};
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
const CreatePostWizard = () => {
  const {user} = useUser();
  if(!user) return null;
  return (
    <>
    <div 
    className="flex flex-col md:flex-row 
    mx-auto
    justify-between items-center 
    w-8/12 md:w-6/12 
    mt-40 md:mt-18 lg:mt-0
    md:px-5 border-0">
      <ProfilePicture width={80} height={80} colSpan={4}/>
      <input 
      type="text" 
      className="w-full md:w-10/12 bg-transparent px-5 my-3 text-center md:text-start outline-none text-lg xl:text-xl" 
      placeholder="🤓Escribe algunos emojis!😐"
      onChange={handleInputChange}
      />
      <button 
      className="rounded-full bg-[hsl(280,100%,70%)] py-3 px-5 font-semibold text-black no-underline transition hover:bg-cyan-400 text-center">
        Publicar
      </button>
    </div>
    </>
  )
};
const Posts: NextPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if(window.matchMedia("(max-width: 600px)").matches){
      setIsMobile(true);
    }
    // console.log(isMobile);
  }, []);
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
        
        <div 
        className="container-fluid w-full flex flex-col 
        lg:items-center justify-center gap-12 px-0 py-8">
          
          <div className="flex flex-col lg:flex-row 
          fixed top-0 px-10 py-5 bg-slate-900/70 
          justify-center items-end lg:items-center
          gap-y-2 lg:gap-y-0 
          lg:justify-between w-full border-0">
            <Link href="/">
              <h1 className="font-extrabold tracking-tight text-slate-200 text-[2rem] md:text-4xl">
                My <span className="text-[hsl(280,100%,70%)]">Emojer</span> App 🙃
              </h1>
            </Link>
            <div className="flex flex-col lg:flex-row gap-4 sm:grid-cols-2 md:gap-8">
              <h2 className="flex flex-row items-center text-3xl text-slate-200 whitespace-pre">
                Bienvenid@ 
                <span className="text-[hsl(280,100%,70%)]">
                  {user && user.user?.username ? " " + user.user.username : ' '}
                </span>👀!
              </h2>
            </div>
            <div className="flex lg:justify-end justify-center">
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

          <CreatePostWizard />

          <div className="flex flex-col items-center justify-center w-full border-white border-0">
            <h3 className="text-2xl text-slate-200 pb-2">Emojis:</h3>
            
          <div className="w-10/12 md:w-1/2 border-0">
            <div className="max-h-[400px] overflow-y-auto">
            {data && data?.map((post) => (
              <div className="flex-row items-center justify-center 
              bg-white/10 rounded-xl p-4 my-1 text-white text-2xl 
              hover:bg-white/20 w-10/12 mx-auto grid grid-flow-col auto-cols-fr gap-2" key={post.id}>
                <ProfilePicture width={48} height={48} colSpan={isMobile ? 2 : 4} />                
                <div className="flex flex-col col-span-8">
                  <span className="ms-3 text-xs text-slate-400">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}</span>
                  <span className="ms-3">{post.content}</span>
                </div>
              </div>
            ))}
            </div>
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