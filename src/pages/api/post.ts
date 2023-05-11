// pages/api/post/index.ts

// import { getSession } from 'next-auth/react'; // NOOOO
// import { getSession } from "next-auth/react"
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { fetchData } from "next-auth/client/_utils";
import { cookies, headers } from "next/headers";
interface PostRequestBody {
    message: string;
}

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
// const authOptions: NextAuthOptions = {
//   // your configs
// }

const logger = {
  error: console.error,
  warn: console.warn,
  debug: console.log,
};
export const getServerSession = async () => {
  // code from `next-auth/next` for RSC
    const req: any = {
      headers: Object.fromEntries(headers()),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value]),
      ),
    };
// next-auth/utils is not listed in export, next will not let you import it
// duplicating
function parseUrl(url: string | undefined) {
  let _url2;

  const defaultUrl = new URL("http://localhost:3000/api/auth");

  if (url && !url.startsWith("http")) {
    url = `https://${url}`;
  }

  const _url = new URL(
    (_url2 = url) !== null && _url2 !== void 0 ? _url2 : defaultUrl,
  );

  const path = (
    _url.pathname === "/" ? defaultUrl.pathname : _url.pathname
  ).replace(/\/$/, "");
  const base = `${_url.origin}${path}`;

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  };
}
// local variable in `next-auth/react`
const __NEXTAUTH = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL).origin,
  basePath: parseUrl(process.env.NEXTAUTH_URL).path,
  baseUrlServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ??
      process.env.NEXTAUTH_URL ??
      process.env.VERCEL_URL,
  ).origin,
  basePathServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ?? process.env.NEXTAUTH_URL,
  ).path,
  _lastSync: 0,
  _session: undefined,
  _getSession: () => {
    // nope
  },
};

  // the old `next-auth/react` getSession
    const session = await fetchData("session", __NEXTAUTH, logger, { req });
  
    return session;
  };
export default async function handle(req : NextApiRequest, res : NextApiResponse) {
  const { message } = req.body as PostRequestBody;
  // const session = await getSession(); // RIP?
  const session = await getServerSession()
  
  console.log(session)
  console.log("id:", session?.user.id)
  const result = await prisma.post.create({
    data: {
      title: "",
      content: message, // el tipo data de prisma para un post tiene title y content
      published: true,
      // author: { connect: { id: session?.user?.id } },
      // author: { connect: { email: session?.user.email || undefined} },
      authorId: session?.user.id,
      // authorId: sessionData?.user?.id || undefined,
    },
  });
  res.json(result);
}