import { Post, PrismaClient } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { createPost } from "~/server/createPost";

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

export default function Posts({posts} : {posts: FormattedPost[]}) {
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession()

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
    console.log(`Mensaje: ${event.target.value}`)
  }  

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(`Mensaje enviado: ${message}`);
    setMessage("");
  }

  async function handlePublish() {
    const userId = session?.user.id
    if (userId) {
      const post = await createPost(message, userId)
      console.log(`Mensaje publicado: ${post.content}`)
    }
    setMessage('')
  }
  
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
                onClick={handlePublish}
            >
                Publicar
            </button>
            </div>
        </form>
        <div className="mt-10 w-full">
          <> 
            {posts.map(post => (
              // console.log(JSON.stringify(post, null, 2)),
              post.published && <div 
              className="flex flex-row items-center justify-start bg-white/10 rounded-xl p-4 my-1 text-white hover:bg-white/20 w-10/12 mx-auto"
              key={post.id}>
                <Image className="rounded-full" src={post.authorImage || "/avatar.png"} width={32} height={32} alt={"avatar"}/>
                <div className="flex flex-col">
                <p className="ml-3 text-xs text-slate-400">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}</p>
                <p className="ml-3">{post.content}</p>
                </div>

                </div>
            ))}
          </>
        </div>

      </div>
    </main>
  );
}
