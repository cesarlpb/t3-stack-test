import { SignOutButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Img from "next/image";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
// import { isMobile } from 'react-device-detect'; // librería device-detect para comprobar userAgent de dispositivo
import { useEffect, useState } from "react";
import { LoadingPage } from "~/components/loading";

const ProfilePicture = ({
  width,
  height,
  colSpan,
}: {
  width?: number;
  height?: number;
  colSpan?: number;
}) => {
  const { user } = useUser();

  if (!user) return null;
  return (
    <div className={`flex justify-center align-middle col-span-${colSpan ?? 4}`}>
      <Img
        className="rounded-full"
        src={user.profileImageUrl}
        alt={user.username || "profile picture"}
        width={width ?? 16}
        height={height ?? 16}
      />
    </div>
  );
};
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <>
      <div
        className="md:mt-18 mx-auto mt-40 
    flex
    w-8/12 flex-col 
    items-center justify-between 
    border-0 md:w-6/12 md:flex-row
    md:px-5 lg:mt-0"
      >
        <ProfilePicture width={80} height={80} colSpan={4} />
        <input
          type="text"
          className="my-3 w-full bg-transparent px-5 text-center text-lg outline-none md:w-10/12 md:text-start xl:text-xl"
          placeholder="🤓Escribe algunos emojis!😐"
          onChange={handleInputChange}
        />
        <button className="rounded-full bg-[hsl(280,100%,70%)] px-5 py-3 text-center font-semibold text-black no-underline transition hover:bg-cyan-400">
          Publicar
        </button>
      </div>
    </>
  );
};
const Posts: NextPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setIsMobile(true);
    }
    // console.log(isMobile);
  }, []);
  const user = useUser();
  if (!user) return null;
  const { data, isLoading } = api.posts.getAll.useQuery();
  
  if(isLoading){
    return <LoadingPage />
  }
  
  return (
    <>
      <Head>
        <title>My Emojer App 😐 - A simple emoji-friendly app</title>
        <meta
          name="description"
          content="A simple emoji-friendly app with NextJS, TS, Prisma, Planetscale, Vercel, Axiom, Tailwind and some other stuff -- probably, maybe."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {/* Navbar */}
        <div
          className="container-fluid flex w-full flex-col 
        justify-center gap-12 px-0 py-8 lg:items-center"
        >
          <div
            className="fixed top-0 flex 
          w-full flex-col items-end justify-center gap-y-2 
          border-0 bg-slate-900/70 px-10
          py-5 lg:flex-row 
          lg:items-center lg:justify-between lg:gap-y-0"
          >
            <Link href="/">
              <h1 className="text-[2rem] font-extrabold tracking-tight text-slate-200 md:text-4xl">
                My <span className="text-[hsl(280,100%,70%)]">Emojer</span> App
                🙃
              </h1>
            </Link>
            <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-8 lg:flex-row">
              <h2 className="flex flex-row items-center whitespace-pre text-3xl text-slate-200">
                Bienvenid@
                <span className="text-[hsl(280,100%,70%)]">
                  {user && user.user?.username ? " " + user.user.username : " "}
                </span>
                👀!
              </h2>
            </div>
            <div className="flex justify-center lg:justify-end">
              {!user.isSignedIn && (
                <SignInButton>
                  <button className="rounded-full bg-gray-500 px-10 py-3 text-center font-semibold text-slate-200 no-underline transition hover:bg-white/40">
                    Iniciar sesión
                  </button>
                </SignInButton>
              )}
              {!!user.isSignedIn && (
                <SignOutButton>
                  <button className="rounded-full bg-gray-500 px-10 py-3 text-center font-semibold text-slate-200 no-underline transition hover:bg-white/20">
                    Cerrar sesión
                  </button>
                </SignOutButton>
              )}
            </div>
          </div>

          <CreatePostWizard />

          <div className="flex w-full flex-col items-center justify-center border-0 border-white">
            <h3 className="pb-2 text-2xl text-slate-200">Emojis:</h3>

            <div className="w-10/12 border-0 md:w-1/2">
              <div className="max-h-[400px] overflow-y-auto">
                {data &&
                  data?.map((post) => (
                    <div
                      className="mx-auto my-1 flex w-10/12 flex-row items-center justify-center rounded-xl bg-cyan-300/30 p-4 text-2xl text-white hover:bg-white/20"
                      key={post.post.id}
                    >
                      <ProfilePicture
                        width={isMobile ? 48 : 48}
                        height={isMobile ? 48 : 48}
                        colSpan={isMobile ? 4 : 2}
                      />
                      <div className="col-span-8 flex flex-col ms-5">
                        <div className="flex flex-row ms-3">
                        <div className="text-xs md:text-sm text-slate-200 font-thin">{post?.author ? `@${post.author.username || ""}` : ""}</div>
                        <div className="text-xs md:text-sm text-slate-200/50 mx-2">·</div>
                        <div className="text-xs md:text-sm text-slate-200/50">
                          {formatDistanceToNow(new Date(post.post.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </div>
                        </div>
                        <span className="ms-3">{post.post.content}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {isLoading && (
              <div className="mx-auto my-1 flex w-10/12 flex-row items-center justify-center rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                Cargando emojis 🙈...
              </div>
            )}
            {!data && (
              <div className="mx-auto my-1 flex w-10/12 flex-row items-center justify-center rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                No hay emojis, gg!🥶
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Posts;
