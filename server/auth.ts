import "dotenv/config";
import { betterAuth } from "better-auth";
import { createAuthOptions, createDatabase } from "./auth-config";

export const auth = betterAuth(createAuthOptions(createDatabase()));

export type Auth = typeof auth;