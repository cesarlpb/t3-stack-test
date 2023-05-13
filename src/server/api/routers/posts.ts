import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
// import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Filtramos los datos que se van a enviar en el cliente
const FilterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    name: `${user.firstName}, ${user.lastName}`,
    profileImageUrl: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
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
      };
    });
  }),
});
