import { SignOutButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { CustomLink } from "~/components/customLink";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";
import Img from "next/image";
import { PostView } from "~/components/postview";

const ProfileFeed = (props: { userId : string }) => {
  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({ userId: props.userId });
  
  if(isLoading) return <LoadingPage height={true} content="Cargando cositas...🤓" />;
  
  if(!data || data?.length === 0) return <div>El usuario aún no ha creado posts😐</div>;

  return (
    <div className="flex flex-col gap-4">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  )
};

const ProfilePage: NextPage<{ username : string }> = ({ username }) => {
  const { user } = useUser(); // isLoaded: usedLoaded
  // console.log("User loaded: ", username);
  // Empieza a cargar los posts ASAP
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  // Se retorna un div vacío si el user no está cargado todavía
  if (isLoading) {
    console.log("Is loading..."); // Esto no aparece nunca ahora ya que la página se precarga
    return <LoadingPage height={true} content="Cargando cositas...🤓" />;
  }

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${username ?? ""} | 🤠Emojer App - A simple emoji-friendly app`}</title>
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
        justify-center gap-12 px-0 py-24 lg:items-center lg:py-8"
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
        {/* Navbar */}

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8 ">
          {/* <h1 className="text-5xl font-extrabold tracking-tight text-slate-200 sm:text-[4rem]">
            My <span className="text-[hsl(280,100%,70%)]">Emojer</span> App 😐
          </h1> */}
          <div className="flex flex-col gap-4 sm:grid-cols-2 md:gap-8"></div>
          
          <div className="flex w-3/4 flex-col items-center justify-center border-0 border-slate-400 lg:w-1/2">
            <PageLayout>
              <div className="flex flex-col w-screen h-24 border
              border-slate-400 bg-slate-400 relative">
                <Img className="-mb-[64px] absolute bottom-0 left-0 rounded-full 
                border-4 border-black ml-4" src={data?.profileImageUrl} 
                width={128} height={128} alt={`${data?.username ?? ""} foto de perfil`}
                priority={true}/>
              </div>
              <div className="flex flex-col w-screen h-96">
                <div className="flex flex-row h-[64px]"></div>  
                <h3 className="flex flex-row p-4 text-2xl text-slate-200 font-bold">
                  {`@${data.username ?? ""}`}
                </h3>
                <div className="w-full border border-slate-400 overflow-y-auto">
                  <div className="w-1/2 mx-auto">
                    <ProfileFeed userId={data.id} />
                  </div>
                </div>
              </div>
            </PageLayout>
          </div>
          
          <div className="flex flex-row justify-between gap-x-2">
            <CustomLink icon="home" href="/" text="Inicio" />
            <CustomLink icon="arrow-left" href="/posts" text="Posts" />
          </div>

        </div>
      </main>
    </>
  );
};

export const getStaticProps : GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug as string;
  if(typeof slug !== 'string') throw new Error('No hay slug');

  const username = slug.replace('@', '');

  await helpers.profile.getUserByUsername.prefetch({ username })

  return{
    props: {
      trpcState: helpers.dehydrate(),
      username
    }
  }
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
};

export default ProfilePage;

