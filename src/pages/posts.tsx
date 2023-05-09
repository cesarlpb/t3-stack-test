import { Post, PrismaClient } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { format } from "path";

/* Fetch all posts (in /pages/index.tsx)
// export async function getStaticProps() {
//   const prisma = new PrismaClient()
//   const posts = await prisma.post.findMany({
//     orderBy: {
//       createdAt: 'desc'
//     }
//   })

//   // Formatear las fechas de creación y actualización como cadenas
//   const formattedPosts = posts.map(post => {
//     return {
//       ...post,
//       createdAt: post.createdAt.toISOString(),
//       updatedAt: post.updatedAt.toISOString()
//     }
//   })

//   return {
//     props : { posts: formattedPosts }
//   }
  } */

// Extiendo el tipo Post para incluir el authorImage:
type FormattedPost = Post & { authorImage: string }
interface Props {
  formattedPosts: FormattedPost[]
}

export async function getStaticProps() {
  const prisma = new PrismaClient()
  const posts = await prisma.post.findMany({
    include: {
      author: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Formatear las fechas de creación y actualización como cadenas
  
  // const formattedPosts = posts.map(post => {
  //   console.log(JSON.stringify(post, null, 2));
  //   return {
  //     ...post,
  //     createdAt: post.createdAt.toISOString(),
  //     updatedAt: post.updatedAt.toISOString(),
  //     authorImage: post.author?.image || '/avatar.png'
  //   }
  // })

  const formattedPosts = posts.map(post => {
      return {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        authorImage: post.author?.image || '/avatar.png'
      }
    })
  

  return {
    props : { posts: formattedPosts }
  }
}


// const posts = api.post.getAll.useQuery().data ?? []; // check
// const postsQuery = api.post.getAll.useQuery();
// const posts = postsQuery.data ?? [];
// console.log(JSON.stringify(posts, null, 2));
export default function Posts({posts} : {posts: FormattedPost[]}) {
  const [message, setMessage] = useState("");

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
    console.log(`Mensaje: ${event.target.value}`)
  }  

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(`Mensaje enviado: ${message}`);
    setMessage("");
  }

//   const PostsPage = ({ posts }: { posts: Post[] }) => {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex flex-col items-center justify-start min-h-screen w-3/4 border-r-2 border-l-2 border-slate-400 py-5">
          <form onSubmit={handleSubmit} className="top-0 w-full max-w-xl">
              <div className="flex items-center border-b-2 border-gray-500 py-2">
              <input
                  type="text"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Escribe un mensaje..."
                  className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
              />

              <button
                  type="submit"
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                  Publicar
              </button>
              </div>
          </form>
          <div className="mt-10 w-full">
            <> 
              {posts.map(post => (
                // console.log(JSON.stringify(post, null, 2)),
                <div 
                className="flex flex-row items-center justify-start bg-white/10 rounded-xl p-4 my-1 text-white hover:bg-white/20 w-10/12 mx-auto"
                key={post.id}>
                  <Image className="rounded-full" src={post.authorImage || "/avatar.png"} width={32} height={32} alt={"avatar"}/>
                  <span className="ml-3">{post}</span>
                  <span className="ml-3">{post.content}</span>

                  </div>
              ))}
            </>
          </div>

        </div>
      </main>
    );
//   }
}
