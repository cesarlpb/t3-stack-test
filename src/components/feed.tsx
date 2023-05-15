import { api } from "~/utils/api";
import { LoadingPage } from "./loading";
import type { RouterOutputs } from "~/utils/api";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Img from "next/image";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const ProfilePicture = ({
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
  if (!user && !userLoaded) return null;
  return (
    <div className={`me-3 col-span-${colSpan}`}>
      <Img
        className="rounded-full"
        src={authorImgUrl || "/avatar.png"}
        alt={
          user?.username
            ? `@${user?.username || ""} profile picture`
            : "profile picture"
        }
        width={width ?? 24}
        height={height ?? 24}
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      className="w-12/12 mx-auto my-1 flex flex-row items-center justify-center 
      rounded-xl bg-cyan-300/30 p-4 text-2xl text-white 
      hover:bg-white/20 md:w-10/12"
      key={post.id}
    >
      <ProfilePicture
        authorImgUrl={author.profileImageUrl}
        width={48}
        height={48}
      />
      <div className="flex grow flex-col border-0 ps-5">
        <div className="flex flex-row align-middle">
          <Link href={author ? `/@${author?.username || ""}` : "/"}>
            <div className="text-xs font-thin text-slate-200 md:text-sm">
              {author ? `@${author?.username || ""}` : ""}
            </div>
          </Link>

          <div className="mx-2 text-xs text-slate-200/50 md:text-sm">·</div>

          <Link href={`/post/${post.id}`}>
            <div className="ms-0 align-baseline text-xs text-slate-400 md:text-sm">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </div>
          </Link>
        </div>

        <div>{post.content}</div>
      </div>
    </div>
  );
};

export const Feed = (props: { postsNumber?: number }) => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  let slicedData = data || [];

  if (props.postsNumber) {
    slicedData = data?.slice(0, props.postsNumber) || [];
  }

  if (postsLoading) {
    return <LoadingPage />;
  } else if (!data) {
    return <div className="">Vaya... esos emojis no llegan🫥</div>;
  } else {
    return (
      <>
        {slicedData.map((postWithAuthor) => (
          <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
        ))}
      </>
    );
  }
};
