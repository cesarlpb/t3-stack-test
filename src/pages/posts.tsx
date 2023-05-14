import { SignOutButton } from "@clerk/clerk-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Img from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { Feed } from "~/components/feed";
import { toast } from "react-hot-toast";

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
    <div
      className={`flex justify-center align-middle col-span-${colSpan ?? 4}`}
    >
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

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content; // ['Invalid emoji']
      console.log("zod error: ", errorMessage);
      if (errorMessage && errorMessage[0]) {
        toast.error(
          `Vaya...${errorMessage[0]}\n👉🏼Prueba de nuevo más tarde.⏱️`
        ); // \n¡Ese no parece un emoji válido!😕
      } else {
        toast.error("Error al publicar el post.🥶 Prueba de nuevo más tarde.");
      }
      // toast.error("Error al publicar el post");
    },
  });

  const [input, setInput] = useState("");

  if (!user) return null;
  return (
    <>
      <div
        className="md:mt-18 mx-auto mt-40 
        flex w-8/12 flex-col 
        items-center justify-between 
        border-0 md:px-0 lg:mt-0
        lg:w-6/12 lg:flex-row"
      >
        <ProfilePicture width={80} height={80} />

        {!isPosting && (
          <>
            <input
              type="text"
              className="my-3 w-3/4 bg-transparent px-5 text-center text-lg outline-none md:w-8/12 md:text-start xl:text-xl"
              placeholder={`🤓Escribe ${
                window.innerWidth < 700 ? "" : "algunos "
              }emojis!😐`}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input !== "") {
                  mutate({ content: input });
                }
              }}
              value={input}
              disabled={isPosting}
            />
            <span className="rounded-r-lg bg-slate-900 px-2 py-2 text-slate-200">
              Enter
            </span>
            <div className="ms-3 flex flex-row items-center justify-center">
              {
                <button
                  className={`rounded-full 
              px-3 py-3 
              text-center font-semibold no-underline transition 
              hover:bg-cyan-400 
              ${
                input !== "" && !isPosting
                  ? "bg-[hsl(280,100%,70%)] text-black"
                  : "bg-gray-300 text-slate-500 disabled:opacity-75"
              }`}
                  onClick={() => mutate({ content: input })}
                  disabled={input == "" || isPosting}
                >
                  Publicar
                </button>
              }
            </div>
          </>
        )}
        {isPosting && (
          <div className="mx-auto flex flex-row items-center justify-between px-5 text-center">
            <div className="me-3">Publicando...🚀</div>
            <LoadingSpinner size={36} />
          </div>
        )}
      </div>
    </>
  );
};
const Posts: NextPage = () => {
  const user = useUser();

  if (!user) return null;
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) {
    return <LoadingPage />;
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
          {/* Navbar */}

          <CreatePostWizard />

          <div className="flex w-full flex-col items-center justify-center border-0 border-white">
            <h3 className="pb-2 text-2xl text-slate-200">Emojis:</h3>

            <div className="w-10/12 border-0 md:w-1/2">
              <div className="scrollbar-custom max-h-[400px] overflow-y-auto">
                {false && <Feed />}
              </div>
            </div>

            {true && <LoadingPage />}

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