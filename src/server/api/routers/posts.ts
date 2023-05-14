import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

// Filtramos los datos que se van a enviar en el cliente
const FilterUserForClient = (user: User) => {
  if (!user)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "User no encontrado",
    });
  const fullName = `${user?.firstName ?? ""}, ${user?.lastName ?? ""}`;
  return {
    id: user?.id,
    username: user?.username,
    name: fullName,
    profileImageUrl: user?.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(FilterUserForClient);

    // console.log(users);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author || !author?.username)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author del post o username no encontrados",
        });
      return {
        post,
        author: author,
        // Alternativa de return:
        /*
        return {
          post,
          author: {
            ...author,
            username: author.username,
          }
        }
        */
      };
    });
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;
      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
});
