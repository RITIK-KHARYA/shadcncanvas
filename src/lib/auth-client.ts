import { createAuthClient } from "better-auth/react";

// Always talk to the auth handler on the origin the app is served from. In
// development that may be either the Express port (5173) or the Vite port
// (5174); both mount the same auth middleware. In production it is the
// deployment origin that serves `/api/auth`.
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : import.meta.env.VITE_BETTER_AUTH_URL;

export const authClient = createAuthClient({ baseURL });

export const { signIn, signOut, useSession } = authClient;
  