// Ambient declarations for the untyped Express dependency used by the
// development server. Keeping this inside `server/` ensures the Node
// TypeScript project (which includes this directory) can resolve it.
declare module "express";
declare module "connect";
