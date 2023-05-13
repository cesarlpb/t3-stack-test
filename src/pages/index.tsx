import { SignOutButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
// import { Post } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Img from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { LoadingPage } from "~/components/loading";

const ProfilePicture = ({
  authorImgUrl,
  width = 32,
  height = 32,
  colSpan = 4,
}: {
  authorImgUrl: string;
  width?: number;
  height?: number;
  colSpan?: number;
}) => {
  const { user, isLoaded: userLoaded } = useUser();
  // console.log("user:", user);
  if (!user) return null;
  return (
    <div className={`me-3 col-span-${colSpan}`}>
      <Img
        className="rounded-full"
        src={authorImgUrl || "/avatar.png"}
        alt={`@${user.username} profile picture` || "profile picture"}
        width={width ?? 24}
        height={height ?? 24}
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      className="mx-auto my-1 flex w-10/12 flex-row items-center justify-center rounded-xl bg-cyan-300/30 p-4 text-2xl text-white hover:bg-white/20"
      key={post.id}
    >
      <ProfilePicture
        authorImgUrl={author.profileImageUrl}
        width={48}
        height={48}
      />
      <div className="flex flex-col grow border-0 ps-5">
        <div className="flex flex-row align-middle">
          <div className="text-xs md:text-sm text-slate-200 font-thin">{`@${author.username}`}</div>
          <div className="text-xs md:text-sm text-slate-200/50 mx-2">·</div>
          <div className="ms-3 text-xs text-slate-400 md:text-sm align-baseline">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
              locale: es,
            })}
          </div>
        </div>
        <div className="">{post.content}</div>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  const previewData = data?.slice(0, 3) || [];
  
    if(!postsLoading) return <LoadingPage />;

    if(!previewData){
      return <div>Vaya... esos emojis no llegan🫥</div>
    }

    if(previewData){
      return(
      <>
      {previewData?.map((postWithAuthor) => (
        <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
      ))}
      </>
      );
    }
    
};

const Home: NextPage = () => {
  const { user, isLoaded: userLoaded} = useUser();
  // Empieza a cargar los posts ASAP
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  const previewData = data?.slice(0, 3) || [];

  // Se retorna un div vacío si el user no está cargado todavía
  if(!userLoaded){ return <div/> }

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
        justify-center gap-12 px-0 py-24 lg:py-8 lg:items-center"
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
                  {user && user?.username ? " " + user.username : " "}
                </span>
                👀!
              </h2>
            </div>
            <div className="flex justify-center lg:justify-end">
              {!user && (
                <SignInButton>
                  <button className="rounded-full bg-gray-500 px-10 py-3 text-center font-semibold text-slate-200 no-underline transition hover:bg-white/40">
                    Iniciar sesión
                  </button>
                </SignInButton>
              )}
              {!!user && (
                <SignOutButton>
                  <button className="rounded-full bg-gray-500 px-10 py-3 text-center font-semibold text-slate-200 no-underline transition hover:bg-white/20">
                    Cerrar sesión
                  </button>
                </SignOutButton>
              )}
            </div>
          </div>
        </div>

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-200 sm:text-[4rem]">
            My <span className="text-[hsl(280,100%,70%)]">Emojer</span> App 😐
          </h1>
          <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-8"></div>
          <div className="flex w-3/4 flex-col items-center justify-center border-0 border-white lg:w-1/2">
            <h3 className="pb-2 text-2xl text-slate-200">Últimos posts:</h3>
            {previewData &&
              previewData?.map((postWithAuthor) => (
                <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
              ))}
            {/* Solo aparece mientras se están cargando los posts */}
            {postsLoading && (
              <div className="mx-auto my-1 flex w-10/12 flex-row items-center justify-center rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                Cargando emojis 🙈...
              </div>
            )}
            {!previewData && (
              <div className="mx-auto my-1 flex w-10/12 flex-row items-center justify-center rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                No hay emojis, gg!🥶
              </div>
            )}
          </div>
          <Link
            className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 text-center font-semibold text-black no-underline transition hover:bg-cyan-200/70 hover:text-slate-200"
            href="/posts"
          >
            Ver mas posts
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
