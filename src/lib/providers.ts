import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { verifyPassword } from "@/lib/bcrypt";
import { sendVerificationRequest } from "@/lib/sendVerificationRequest";
import type { User } from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/db/connection";

export const authProviders = [
  Google,
  Nodemailer({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
    maxAge: 5 * 60,
    sendVerificationRequest: sendVerificationRequest,
  }),
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials): Promise<User | null> {
      if (!credentials?.email || !credentials?.password) return null;

      try {
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password as string
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role as string,
          emailVerified: user.emailVerified || undefined,
        };
      } catch (error) {
        console.error("Error en la autenticación:", error);
        return null;
      }
    },
  }),
];
