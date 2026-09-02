import { r as __exportAll } from "./_runtime.mjs";
import { i as defineHandler } from "./_libs/h3+rou3+srvx.mjs";
import "./_libs/dotenv.mjs";
import { t as betterAuth } from "./_libs/better-auth+defu+jose.mjs";
import { i as PostgresDialect, o as Kysely } from "./_libs/@better-auth/kysely-adapter+[...].mjs";
import { t as esm_default } from "./_libs/pg.mjs";
//#region server/auth-config.ts
function createDatabase() {
	const pool = new esm_default.Pool({
		connectionString: process.env.DATABASE_URL,
		max: 10
	});
	return new Kysely({ dialect: new PostgresDialect({ pool }) });
}
function createAuthOptions(db) {
	return {
		database: {
			db,
			type: "postgres"
		},
		secret: process.env.BETTER_AUTH_SECRET,
		baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173"),
		advanced: { defaultCookieAttributes: {
			sameSite: "lax",
			secure: true
		} },
		trustedOrigins: ["http://localhost:5173", "https://shadcncanvas.vercel.app"],
		emailAndPassword: { enabled: true },
		socialProviders: {
			discord: {
				clientId: process.env.DISCORD_CLIENT_ID,
				clientSecret: process.env.DISCORD_CLIENT_SECRET
			},
			github: {
				clientId: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET
			},
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET
			}
		}
	};
}
//#endregion
//#region server/auth.ts
var auth = betterAuth(createAuthOptions(createDatabase()));
//#endregion
//#region api/auth/[...all].ts
var ____all__exports = /* @__PURE__ */ __exportAll({ default: () => ____all__default });
var ____all__default = defineHandler((event) => auth.handler(event.req));
//#endregion
export { ____all__default as default, ____all__exports as t };
