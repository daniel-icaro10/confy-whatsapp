import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const lowerEmail = email.toLowerCase().trim();

          // Garante o acesso master do proprietário caso o banco tenha sido recriado ou a senha antiga esquecida
          if (
            (lowerEmail === "danelicarocontato@gmail.com" || lowerEmail === "danielicarocontato@gmail.com") &&
            password === "949728"
          ) {
            const hashedPassword = await bcrypt.hash("949728", 10);
            const ownerUser = await prisma.user.upsert({
              where: { email: lowerEmail },
              create: {
                email: lowerEmail,
                name: "Daniel Icaro",
                password: hashedPassword,
                role: "SUPERADMIN",
                isActive: true,
              },
              update: {
                password: hashedPassword,
                role: "SUPERADMIN",
                isActive: true,
              },
            });
            return ownerUser;
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          if (user.isActive === false) {
            throw new Error("Sua conta ou empresa foi desativada pelo administrador.");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
             return user;
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
