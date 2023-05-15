import Link from "next/link";

export function CustomLink(props: { href: string; text: string }) {
  return (
    <Link
      className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 
            text-center font-semibold text-black no-underline transition 
            hover:bg-cyan-200/70 hover:text-slate-200"
      href={props.href}
    >
      {props.text}
    </Link>
  );
}
