import { toNodeHandler } from "better-auth/node";
import { auth } from "../../server/auth";

export default toNodeHandler(auth);