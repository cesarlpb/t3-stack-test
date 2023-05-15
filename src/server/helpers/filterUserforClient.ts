import { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";

// Filtramos los datos que se van a enviar en el cliente
export const FilterUserForClient = (user: User) => {
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
