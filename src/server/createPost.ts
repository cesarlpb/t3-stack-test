import { Post, PrismaClient } from '@prisma/client'

export async function createPost(content: string, userId: string): Promise<Post> {
    const prisma = new PrismaClient()
    const post = await prisma.post.create({
      data: {
        content: content,
        published: true,
        author: { connect: { id: userId } }
      }
    })
    return post
  }
  