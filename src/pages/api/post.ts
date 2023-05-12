// pages/api/post/index.ts

import {prisma } from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

interface PostRequestBody {
    message: string;
}

// async function getUserIdByEmail(email: string | undefined) {
//   const user = await prisma.user.findUnique({
//     where: {
//       email: email,
//     },
//   });

//   if (user) {
//     return user.id;
//   } else {
//     return null; // El usuario no existe
//   }
// }



export default async function handle(req : NextApiRequest, res : NextApiResponse) {
  const { message } = req.body as PostRequestBody;
  const { email } = req.body;
  let userId = null;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email || undefined,
      },
    });

    if (user) {
      // Handle user found
      // res.status(200).json({ message: 'User found' });
      userId = user.id;
    } else {
      // Handle user not found
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // Handle error
    res.status(500).json({ message: 'Error retrieving user' });
  }

  // const session = await getServerSession(req, res, authOptions);
  const session = await getServerSession(req, res, authOptions)
  // console.log(req, authOptions)
  // Obtén la sesión del objeto de props
  // console.log("cookies:", req.cookies)
  // console.log("current session:", session);
  let userEmail : string | undefined = session?.user.email || undefined;
  // const userId = await getUserIdByEmail(userEmail);

  // Ver el token CSRF
  // const token = getCsrfToken().then(res => console.log(res));

  // Ver providers:
  // const providers = await getProviders()
  // console.log("Providers", providers)
  
  // console.log("session:", session)
  // console.log("id:", session?.user.id)

  const result = await prisma.post.create({
    data: {
      title: "",
      content: message, // el tipo data de prisma para un post tiene title y content
      published: true,
      authorId: userId,
    },
  });
  res.json(result);
}