// pages/api/post/index.ts

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface PostRequestBody {
    message: string;
}

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req : NextApiRequest, res : NextApiResponse) {
  const { message } = req.body as PostRequestBody;

  // const session = await getSession({ req });
  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      content: message, // el tipo data de prisma para un post tiene title y content
      // author: { connect: { id: session?.user?.id } },
      author: { connect: { id: session?.user?.id }},
    },
  });
  res.json(result);
}