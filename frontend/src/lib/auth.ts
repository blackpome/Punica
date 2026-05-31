import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema as Record<string, unknown>,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // TODO: replace with your email provider (Resend, Nodemailer, etc.)
      // The url already contains the reset token as a query parameter.
      if (process.env.NODE_ENV !== "production") {
        console.log(`[password reset] ${user.email} → ${url}`);
        return;
      }
      // Example with Resend:
      // await resend.emails.send({
      //   from: "noreply@punica.security",
      //   to: user.email,
      //   subject: "Reset your Punica password",
      //   html: `<p>Click <a href="${url}">here</a> to reset your password. Link expires in 1 hour.</p>`,
      // });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [organization(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
