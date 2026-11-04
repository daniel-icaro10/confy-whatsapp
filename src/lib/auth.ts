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

          // Garante o acesso master do proprietário/administrador caso o banco tenha sido recriado ou a senha esquecida
          const isMasterOwner =
            (lowerEmail === "danelicarocontato@gmail.com" || lowerEmail === "danielicarocontato@gmail.com") &&
            password === "949728";
          const isMasterAdmin =
            (lowerEmail === "admin@tvreels.com" || lowerEmail === "admin@admin.com") &&
            (password === "admin123456" || password === "admin123");

          if (isMasterOwner || isMasterAdmin) {
            const masterPass = isMasterOwner ? "949728" : password;
            const hashedPassword = await bcrypt.hash(masterPass, 10);
            const masterUser = await prisma.user.upsert({
              where: { email: lowerEmail },
              create: {
                email: lowerEmail,
                name: isMasterOwner ? "Daniel Icaro" : "Administrador Master",
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
            return masterUser;
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
