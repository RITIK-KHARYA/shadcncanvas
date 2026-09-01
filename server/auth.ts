import "dotenv/config";
import { betterAuth } from "better-auth";
import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

const db = new Kysely<Record<string, unknown>>({
  dialect: new PostgresDialect({ pool }),
});

export const auth = betterAuth({
  database: {
    db,
    type: "postgres",
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5173",
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

export type Auth = typeof auth;