import type { RouterOutputs } from "~/utils/api";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ProfilePicture } from "./feed";
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
        authorImgUrl={author?.profileImageUrl}
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

          <Link href={`/post/${post?.id}`}>
            <div className="ms-0 align-baseline text-xs text-slate-400 md:text-sm">
              {formatDistanceToNow(new Date(post?.createdAt), {
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