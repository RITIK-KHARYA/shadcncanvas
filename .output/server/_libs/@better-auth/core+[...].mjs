import { t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/@better-auth/core/dist/env/env-impl.mjs
var _envShim = Object.create(null);
var _getEnv = (useShim) => globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (useShim ? _envShim : globalThis);
var env = new Proxy(_envShim, {
	get(_, prop) {
		return _getEnv()[prop] ?? _envShim[prop];
	},
	has(_, prop) {
		return prop in _getEnv() || prop in _envShim;
	},
	set(_, prop, value) {
		const env = _getEnv(true);
		env[prop] = value;
		return true;
	},
	deleteProperty(_, prop) {
		if (!prop) return false;
		const env = _getEnv(true);
		delete env[prop];
		return true;
	},
	ownKeys() {
		const env = _getEnv(true);
		return Object.keys(env);
	}
});
function toBoolean(val) {
	return val ? val !== "false" : false;
}
var nodeENV = env.NODE_ENV ?? "";
/** Detect if `NODE_ENV` environment variable is `production` */
var isProduction = nodeENV === "production";
/** Detect if `NODE_ENV` environment variable is `dev` or `development` */
var isDevelopment = () => nodeENV === "dev" || nodeENV === "development";
/** Detect if `NODE_ENV` environment variable is `test` */
var isTest = () => nodeENV === "test" || toBoolean(env.TEST);
/**
* Get environment variable with fallback
*/
function getEnvVar(key, fallback) {
	if (typeof process !== "undefined" && process.env) return process.env[key] ?? fallback;
	if (typeof Deno !== "undefined") return Deno.env.get(key) ?? fallback;
	if (typeof Bun !== "undefined") return Bun.env[key] ?? fallback;
	return fallback;
}
/**
* Get boolean environment variable
*/
function getBooleanEnvVar(key, fallback = true) {
	const value = getEnvVar(key);
	if (!value) return fallback;
	return value !== "0" && value.toLowerCase() !== "false" && value !== "";
}
/**
* Common environment variables used in Better Auth
*/
var ENV = Object.freeze({
	get BETTER_AUTH_SECRET() {
		return getEnvVar("BETTER_AUTH_SECRET");
	},
	get AUTH_SECRET() {
		return getEnvVar("AUTH_SECRET");
	},
	get BETTER_AUTH_TELEMETRY() {
		return getEnvVar("BETTER_AUTH_TELEMETRY");
	},
	get BETTER_AUTH_TELEMETRY_ID() {
		return getEnvVar("BETTER_AUTH_TELEMETRY_ID");
	},
	get NODE_ENV() {
		return getEnvVar("NODE_ENV", "development");
	},
	get PACKAGE_VERSION() {
		return getEnvVar("PACKAGE_VERSION", "0.0.0");
	},
	get BETTER_AUTH_TELEMETRY_ENDPOINT() {
		return getEnvVar("BETTER_AUTH_TELEMETRY_ENDPOINT", "");
	}
});
//#endregion
//#region node_modules/@better-auth/core/dist/env/color-depth.mjs
var COLORS_2 = 1;
var COLORS_16 = 4;
var COLORS_256 = 8;
var COLORS_16m = 24;
var TERM_ENVS = {
	eterm: COLORS_16,
	cons25: COLORS_16,
	console: COLORS_16,
	cygwin: COLORS_16,
	dtterm: COLORS_16,
	gnome: COLORS_16,
	hurd: COLORS_16,
	jfbterm: COLORS_16,
	konsole: COLORS_16,
	kterm: COLORS_16,
	mlterm: COLORS_16,
	mosh: COLORS_16m,
	putty: COLORS_16,
	st: COLORS_16,
	"rxvt-unicode-24bit": COLORS_16m,
	terminator: COLORS_16m,
	"xterm-kitty": COLORS_16m
};
var CI_ENVS_MAP = new Map(Object.entries({
	APPVEYOR: COLORS_256,
	BUILDKITE: COLORS_256,
	CIRCLECI: COLORS_16m,
	DRONE: COLORS_256,
	GITEA_ACTIONS: COLORS_16m,
	GITHUB_ACTIONS: COLORS_16m,
	GITLAB_CI: COLORS_256,
	TRAVIS: COLORS_256
}));
var TERM_ENVS_REG_EXP = [
	/ansi/,
	/color/,
	/linux/,
	/direct/,
	/^con[0-9]*x[0-9]/,
	/^rxvt/,
	/^screen/,
	/^xterm/,
	/^vt100/,
	/^vt220/
];
function getColorDepth() {
	if (getEnvVar("FORCE_COLOR") !== void 0) switch (getEnvVar("FORCE_COLOR")) {
		case "":
		case "1":
		case "true": return COLORS_16;
		case "2": return COLORS_256;
		case "3": return COLORS_16m;
		default: return COLORS_2;
	}
	if (getEnvVar("NODE_DISABLE_COLORS") !== void 0 && getEnvVar("NODE_DISABLE_COLORS") !== "" || getEnvVar("NO_COLOR") !== void 0 && getEnvVar("NO_COLOR") !== "" || getEnvVar("TERM") === "dumb") return COLORS_2;
	if (getEnvVar("TMUX")) return COLORS_16m;
	if ("TF_BUILD" in env && "AGENT_NAME" in env) return COLORS_16;
	if ("CI" in env) {
		for (const { 0: envName, 1: colors } of CI_ENVS_MAP) if (envName in env) return colors;
		if (getEnvVar("CI_NAME") === "codeship") return COLORS_256;
		return COLORS_2;
	}
	if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.exec(getEnvVar("TEAMCITY_VERSION")) !== null ? COLORS_16 : COLORS_2;
	switch (getEnvVar("TERM_PROGRAM")) {
		case "iTerm.app":
			if (!getEnvVar("TERM_PROGRAM_VERSION") || /^[0-2]\./.exec(getEnvVar("TERM_PROGRAM_VERSION")) !== null) return COLORS_256;
			return COLORS_16m;
		case "HyperTerm":
		case "MacTerm": return COLORS_16m;
		case "Apple_Terminal": return COLORS_256;
	}
	if (getEnvVar("COLORTERM") === "truecolor" || getEnvVar("COLORTERM") === "24bit") return COLORS_16m;
	if (getEnvVar("TERM")) {
		if (/truecolor/.exec(getEnvVar("TERM")) !== null) return COLORS_16m;
		if (/^xterm-256/.exec(getEnvVar("TERM")) !== null) return COLORS_256;
		const termEnv = getEnvVar("TERM").toLowerCase();
		if (TERM_ENVS[termEnv]) return TERM_ENVS[termEnv];
		if (TERM_ENVS_REG_EXP.some((term) => term.exec(termEnv) !== null)) return COLORS_16;
	}
	if (getEnvVar("COLORTERM")) return COLORS_16;
	return COLORS_2;
}
//#endregion
//#region node_modules/@better-auth/core/dist/context/global.mjs
var symbol = Symbol.for("better-auth:global");
var bind = null;
var __context = {};
var __betterAuthVersion = "1.7.2";
/**
* We store context instance in the globalThis.
*
* The reason we do this is that some bundlers, web framework, or package managers might
* create multiple copies of BetterAuth in the same process intentionally or unintentionally.
*
* For example, yarn v1, Next.js, SSR, Vite...
*
* @internal
*/
function __getBetterAuthGlobal() {
	if (!globalThis[symbol]) {
		globalThis[symbol] = {
			version: __betterAuthVersion,
			epoch: 1,
			context: __context
		};
		bind = globalThis[symbol];
	}
	bind = globalThis[symbol];
	if (bind.version !== __betterAuthVersion) {
		bind.version = __betterAuthVersion;
		bind.epoch++;
	}
	return globalThis[symbol];
}
function __getCurrentEndpointContext() {
	return __getBetterAuthGlobal().context.endpointContextAsyncStorage?.getStore();
}
function getBetterAuthVersion() {
	return __getBetterAuthGlobal().version;
}
//#endregion
//#region node_modules/@better-auth/core/dist/env/logger.mjs
var TTY_COLORS = {
	reset: "\x1B[0m",
	bright: "\x1B[1m",
	dim: "\x1B[2m",
	undim: "\x1B[22m",
	underscore: "\x1B[4m",
	blink: "\x1B[5m",
	reverse: "\x1B[7m",
	hidden: "\x1B[8m",
	fg: {
		black: "\x1B[30m",
		red: "\x1B[31m",
		green: "\x1B[32m",
		yellow: "\x1B[33m",
		blue: "\x1B[34m",
		magenta: "\x1B[35m",
		cyan: "\x1B[36m",
		white: "\x1B[37m"
	},
	bg: {
		black: "\x1B[40m",
		red: "\x1B[41m",
		green: "\x1B[42m",
		yellow: "\x1B[43m",
		blue: "\x1B[44m",
		magenta: "\x1B[45m",
		cyan: "\x1B[46m",
		white: "\x1B[47m"
	}
};
var levels = [
	"debug",
	"info",
	"success",
	"warn",
	"error"
];
function shouldPublishLog(currentLogLevel, logLevel) {
	return levels.indexOf(logLevel) >= levels.indexOf(currentLogLevel);
}
var levelColors = {
	info: TTY_COLORS.fg.blue,
	success: TTY_COLORS.fg.green,
	warn: TTY_COLORS.fg.yellow,
	error: TTY_COLORS.fg.red,
	debug: TTY_COLORS.fg.magenta
};
var formatMessage = (level, message, colorsEnabled) => {
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	if (colorsEnabled) return `${TTY_COLORS.dim}${timestamp}${TTY_COLORS.reset} ${levelColors[level]}${level.toUpperCase()}${TTY_COLORS.reset} ${TTY_COLORS.bright}[Better Auth]:${TTY_COLORS.reset} ${message}`;
	return `${timestamp} ${level.toUpperCase()} [Better Auth]: ${message}`;
};
var createLogger = (options) => {
	const enabled = options?.disabled !== true;
	const logLevel = options?.level ?? "warn";
	const colorsEnabled = options?.disableColors !== void 0 ? !options.disableColors : getColorDepth() !== 1;
	const LogFunc = (level, message, args = []) => {
		if (!enabled || !shouldPublishLog(logLevel, level)) return;
		const formattedMessage = formatMessage(level, message, colorsEnabled);
		if (!options || typeof options.log !== "function") {
			if (level === "error") console.error(formattedMessage, ...args);
			else if (level === "warn") console.warn(formattedMessage, ...args);
			else console.log(formattedMessage, ...args);
			return;
		}
		options.log(level === "success" ? "info" : level, message, ...args);
	};
	return {
		...Object.fromEntries(levels.map((level) => [level, (...[message, ...args]) => LogFunc(level, message, args)])),
		get level() {
			return logLevel;
		}
	};
};
var defaultLogger = createLogger();
var getCurrentLogger = () => {
	const currentLogger = __getCurrentEndpointContext()?.context.logger;
	return currentLogger && currentLogger !== logger ? currentLogger : defaultLogger;
};
var logger = {
	debug: (...params) => getCurrentLogger().debug(...params),
	info: (...params) => getCurrentLogger().info(...params),
	success: (...params) => getCurrentLogger().success(...params),
	warn: (...params) => getCurrentLogger().warn(...params),
	error: (...params) => getCurrentLogger().error(...params),
	get level() {
		return getCurrentLogger().level;
	}
};
//#endregion
//#region node_modules/@better-auth/core/dist/utils/error-codes.mjs
function defineErrorCodes(codes) {
	return Object.fromEntries(Object.entries(codes).map(([key, value]) => [key, {
		code: key,
		message: value,
		toString: () => key
	}]));
}
//#endregion
//#region node_modules/@better-auth/core/dist/error/codes.mjs
var BASE_ERROR_CODES = defineErrorCodes({
	USER_NOT_FOUND: "User not found",
	FAILED_TO_CREATE_USER: "Failed to create user",
	FAILED_TO_CREATE_SESSION: "Failed to create session",
	FAILED_TO_UPDATE_USER: "Failed to update user",
	FAILED_TO_GET_SESSION: "Failed to get session",
	INVALID_PASSWORD: "Invalid password",
	INVALID_EMAIL: "Invalid email",
	INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
	INVALID_USER: "Invalid user",
	SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
	PROVIDER_NOT_FOUND: "Provider not found",
	INVALID_TOKEN: "Invalid token",
	TOKEN_EXPIRED: "Token expired",
	ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
	FAILED_TO_GET_USER_INFO: "Failed to get user info",
	USER_EMAIL_NOT_FOUND: "User email not found",
	EMAIL_NOT_VERIFIED: "Email not verified",
	PASSWORD_TOO_SHORT: "Password too short",
	PASSWORD_TOO_LONG: "Password too long",
	USER_ALREADY_EXISTS: "User already exists.",
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
	EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
	CHANGE_EMAIL_DISABLED: "Change email is disabled",
	CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
	SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
	FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
	ACCOUNT_NOT_FOUND: "Account not found",
	USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account.",
	CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "Cross-site navigation login blocked. This request appears to be a CSRF attack.",
	VERIFICATION_EMAIL_NOT_ENABLED: "Verification email isn't enabled",
	EMAIL_ALREADY_VERIFIED: "Email is already verified",
	EMAIL_MISMATCH: "Email mismatch",
	SESSION_NOT_FRESH: "Session is not fresh",
	LINKED_ACCOUNT_ALREADY_EXISTS: "Linked account already exists",
	INVALID_ORIGIN: "Invalid origin",
	INVALID_CALLBACK_URL: "Invalid callbackURL",
	INVALID_REDIRECT_URL: "Invalid redirectURL",
	INVALID_ERROR_CALLBACK_URL: "Invalid errorCallbackURL",
	INVALID_NEW_USER_CALLBACK_URL: "Invalid newUserCallbackURL",
	MISSING_OR_NULL_ORIGIN: "Missing or null Origin",
	CALLBACK_URL_REQUIRED: "callbackURL is required",
	FAILED_TO_CREATE_VERIFICATION: "Unable to create verification",
	FIELD_NOT_ALLOWED: "Field not allowed to be set",
	ASYNC_VALIDATION_NOT_SUPPORTED: "Async validation is not supported",
	VALIDATION_ERROR: "Validation Error",
	MISSING_FIELD: "Field is required",
	METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED: "POST method requires deferSessionRefresh to be enabled in session config",
	BODY_MUST_BE_AN_OBJECT: "Body must be an object",
	PASSWORD_ALREADY_SET: "User already has a password set"
});
//#endregion
//#region node_modules/better-call/dist/error.mjs
function isErrorStackTraceLimitWritable() {
	const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
	if (desc === void 0) return Object.isExtensible(Error);
	return Object.prototype.hasOwnProperty.call(desc, "writable") ? desc.writable : desc.set !== void 0;
}
/**
* Hide internal stack frames from the error stack trace.
*/
function hideInternalStackFrames(stack) {
	const lines = stack.split("\n    at ");
	if (lines.length <= 1) return stack;
	lines.splice(1, 1);
	return lines.join("\n    at ");
}
/**
* Creates a custom error class that hides stack frames.
*/
function makeErrorForHideStackFrame(Base, clazz) {
	class HideStackFramesError extends Base {
		#hiddenStack;
		constructor(...args) {
			if (isErrorStackTraceLimitWritable()) {
				const limit = Error.stackTraceLimit;
				Error.stackTraceLimit = 0;
				super(...args);
				Error.stackTraceLimit = limit;
			} else super(...args);
			const stack = (/* @__PURE__ */ new Error()).stack;
			if (stack) this.#hiddenStack = hideInternalStackFrames(stack.replace(/^Error/, this.name));
		}
		get errorStack() {
			return this.#hiddenStack;
		}
	}
	Object.defineProperty(HideStackFramesError.prototype, "constructor", {
		get() {
			return clazz;
		},
		enumerable: false,
		configurable: true
	});
	return HideStackFramesError;
}
var statusCodes = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	MULTIPLE_CHOICES: 300,
	MOVED_PERMANENTLY: 301,
	FOUND: 302,
	SEE_OTHER: 303,
	NOT_MODIFIED: 304,
	TEMPORARY_REDIRECT: 307,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	PAYLOAD_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	"I'M_A_TEAPOT": 418,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_ENTITY: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NOT_EXTENDED: 510,
	NETWORK_AUTHENTICATION_REQUIRED: 511
};
var InternalAPIError = class extends Error {
	status;
	body;
	headers;
	statusCode;
	constructor(status = "INTERNAL_SERVER_ERROR", body = void 0, headers = {}, statusCode = typeof status === "number" ? status : statusCodes[status]) {
		super(body?.message, body?.cause ? { cause: body.cause } : void 0);
		this.status = status;
		this.body = body;
		this.headers = headers;
		this.statusCode = statusCode;
		this.name = "APIError";
		this.status = status;
		this.headers = headers;
		this.statusCode = statusCode;
		this.body = body;
	}
};
var ValidationError$1 = class extends InternalAPIError {
	message;
	issues;
	constructor(message, issues) {
		super(400, {
			message,
			code: "VALIDATION_ERROR"
		});
		this.message = message;
		this.issues = issues;
		this.issues = issues;
	}
};
var BetterCallError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "BetterCallError";
	}
};
var kAPIErrorHeaderSymbol = Symbol.for("better-call:api-error-headers");
var APIError$1 = makeErrorForHideStackFrame(InternalAPIError, Error);
//#endregion
//#region node_modules/@better-auth/core/dist/error/index.mjs
var BetterAuthError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "BetterAuthError";
		this.message = message;
		this.stack = "";
	}
};
var APIError = class APIError extends APIError$1 {
	constructor(...args) {
		super(...args);
	}
	static fromStatus(status, body) {
		return new APIError(status, body);
	}
	static from(status, error) {
		return new APIError(status, {
			message: error.message,
			code: error.code
		});
	}
};
//#endregion
//#region node_modules/@better-auth/utils/dist/random.mjs
function expandAlphabet(alphabet) {
	switch (alphabet) {
		case "a-z": return "abcdefghijklmnopqrstuvwxyz";
		case "A-Z": return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		case "0-9": return "0123456789";
		case "-_": return "-_";
		default: throw new Error(`Unsupported alphabet: ${alphabet}`);
	}
}
function createRandomStringGenerator(...baseAlphabets) {
	const baseCharSet = baseAlphabets.map(expandAlphabet).join("");
	if (baseCharSet.length === 0) throw new Error("No valid characters provided for random string generation.");
	const baseCharSetLength = baseCharSet.length;
	return (length, ...alphabets) => {
		if (length <= 0) throw new Error("Length must be a positive integer.");
		let charSet = baseCharSet;
		let charSetLength = baseCharSetLength;
		if (alphabets.length > 0) {
			charSet = alphabets.map(expandAlphabet).join("");
			charSetLength = charSet.length;
		}
		const maxValid = Math.floor(256 / charSetLength) * charSetLength;
		const buf = new Uint8Array(length * 2);
		const bufLength = buf.length;
		let result = "";
		let bufIndex = bufLength;
		let rand;
		while (result.length < length) {
			if (bufIndex >= bufLength) {
				crypto.getRandomValues(buf);
				bufIndex = 0;
			}
			rand = buf[bufIndex++];
			if (rand < maxValid) result += charSet[rand % charSetLength];
		}
		return result;
	};
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var strictDecoder = new TextDecoder("utf-8", { fatal: true });
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
	const size = buffers.reduce((acc, { length }) => acc + length, 0);
	const buf = new Uint8Array(size);
	let i = 0;
	for (const buffer of buffers) {
		buf.set(buffer, i);
		i += buffer.length;
	}
	return buf;
}
function writeUInt32BE(buf, value, offset) {
	if (value < 0 || value >= MAX_INT32) throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
	buf.set([
		value >>> 24,
		value >>> 16,
		value >>> 8,
		value & 255
	], offset);
}
function uint64be(value) {
	const high = Math.floor(value / MAX_INT32);
	const low = value % MAX_INT32;
	const buf = /* @__PURE__ */ new Uint8Array(8);
	writeUInt32BE(buf, high, 0);
	writeUInt32BE(buf, low, 4);
	return buf;
}
function uint32be(value) {
	const buf = /* @__PURE__ */ new Uint8Array(4);
	writeUInt32BE(buf, value);
	return buf;
}
function encode$2(string) {
	const bytes = new Uint8Array(string.length);
	for (let i = 0; i < string.length; i++) {
		const code = string.charCodeAt(i);
		if (code > 127) throw new TypeError("non-ASCII string encountered in encode()");
		bytes[i] = code;
	}
	return bytes;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/crypto_key.js
var unusable = (name, prop = "algorithm.name") => /* @__PURE__ */ new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
function checkUsage(key, usage) {
	if (usage && !key.usages.includes(usage)) throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
}
function checkModulusLength(alg, key) {
	const { modulusLength } = key.algorithm;
	if (typeof modulusLength !== "number" || modulusLength < 2048) throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
}
function checkCryptoKey(key, expected, usage) {
	const algorithm = key.algorithm;
	if (algorithm.name !== expected.name) throw unusable(expected.name);
	if (expected.hash && algorithm.hash?.name !== expected.hash) throw unusable(expected.hash, "algorithm.hash");
	if (expected.namedCurve && algorithm.namedCurve !== expected.namedCurve) throw unusable(expected.namedCurve, "algorithm.namedCurve");
	if (expected.length !== void 0 && algorithm.length !== expected.length) throw unusable(expected.length, "algorithm.length");
	checkUsage(key, usage);
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/invalid_key_input.js
function message(msg, actual, ...types) {
	if (types.length > 2) {
		const last = types.pop();
		msg += `one of type ${types.join(", ")}, or ${last}.`;
	} else if (types.length === 2) msg += `one of type ${types[0]} or ${types[1]}.`;
	else msg += `of type ${types[0]}.`;
	if (actual == null) msg += ` Received ${actual}`;
	else if (typeof actual === "function" && actual.name) msg += ` Received function ${actual.name}`;
	else if (typeof actual === "object" && actual != null) {
		if (actual.constructor?.name) msg += ` Received an instance of ${actual.constructor.name}`;
	}
	return msg;
}
var invalidKeyInput = (actual, ...types) => message("Key must be ", actual, ...types);
var withAlg = (alg, actual, ...types) => message(`Key for the ${alg} algorithm must be `, actual, ...types);
//#endregion
//#region node_modules/jose/dist/webapi/util/errors.js
var JOSEError = class extends Error {
	static code = "ERR_JOSE_GENERIC";
	code = "ERR_JOSE_GENERIC";
	constructor(message, options) {
		super(message, options);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);
	}
};
var JWTClaimValidationFailed = class extends JOSEError {
	static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	claim;
	reason;
	payload;
	constructor(message, payload, claim = "unspecified", reason = "unspecified") {
		super(message, { cause: {
			claim,
			reason,
			payload
		} });
		this.claim = claim;
		this.reason = reason;
		this.payload = payload;
	}
};
var JWTExpired = class extends JOSEError {
	static code = "ERR_JWT_EXPIRED";
	code = "ERR_JWT_EXPIRED";
	claim;
	reason;
	payload;
	constructor(message, payload, claim = "unspecified", reason = "unspecified") {
		super(message, { cause: {
			claim,
			reason,
			payload
		} });
		this.claim = claim;
		this.reason = reason;
		this.payload = payload;
	}
};
var JOSEAlgNotAllowed = class extends JOSEError {
	static code = "ERR_JOSE_ALG_NOT_ALLOWED";
	code = "ERR_JOSE_ALG_NOT_ALLOWED";
};
var JOSENotSupported = class extends JOSEError {
	static code = "ERR_JOSE_NOT_SUPPORTED";
	code = "ERR_JOSE_NOT_SUPPORTED";
};
var JWEDecryptionFailed = class extends JOSEError {
	static code = "ERR_JWE_DECRYPTION_FAILED";
	code = "ERR_JWE_DECRYPTION_FAILED";
	constructor(message = "decryption operation failed", options) {
		super(message, options);
	}
};
var JWEInvalid = class extends JOSEError {
	static code = "ERR_JWE_INVALID";
	code = "ERR_JWE_INVALID";
};
var JWSInvalid = class extends JOSEError {
	static code = "ERR_JWS_INVALID";
	code = "ERR_JWS_INVALID";
};
var JWTInvalid = class extends JOSEError {
	static code = "ERR_JWT_INVALID";
	code = "ERR_JWT_INVALID";
};
var JWKInvalid = class extends JOSEError {
	static code = "ERR_JWK_INVALID";
	code = "ERR_JWK_INVALID";
};
var JWKSInvalid = class extends JOSEError {
	static code = "ERR_JWKS_INVALID";
	code = "ERR_JWKS_INVALID";
};
var JWKSNoMatchingKey = class extends JOSEError {
	static code = "ERR_JWKS_NO_MATCHING_KEY";
	code = "ERR_JWKS_NO_MATCHING_KEY";
	constructor(message = "no applicable key found in the JSON Web Key Set", options) {
		super(message, options);
	}
};
var JWKSMultipleMatchingKeys = class extends JOSEError {
	[Symbol.asyncIterator] = async function* () {};
	static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
	code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
	constructor(message = "multiple matching keys found in the JSON Web Key Set", options) {
		super(message, options);
	}
};
var JWKSTimeout = class extends JOSEError {
	static code = "ERR_JWKS_TIMEOUT";
	code = "ERR_JWKS_TIMEOUT";
	constructor(message = "request timed out", options) {
		super(message, options);
	}
};
var JWSSignatureVerificationFailed = class extends JOSEError {
	static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
	code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
	constructor(message = "signature verification failed", options) {
		super(message, options);
	}
};
//#endregion
//#region node_modules/jose/dist/webapi/lib/is_key_like.js
function assertCryptoKey(key) {
	if (!isCryptoKey(key)) throw new Error("CryptoKey instance expected");
}
var isCryptoKey = (key) => {
	if (key?.[Symbol.toStringTag] === "CryptoKey") return true;
	try {
		return key instanceof CryptoKey;
	} catch {
		return false;
	}
};
var isKeyObject = (key) => key?.[Symbol.toStringTag] === "KeyObject";
var isKeyLike = (key) => isCryptoKey(key) || isKeyObject(key);
//#endregion
//#region node_modules/jose/dist/webapi/lib/base64.js
function encodeBase64(input) {
	if (Uint8Array.prototype.toBase64) return input.toBase64();
	const CHUNK_SIZE = 32768;
	const arr = [];
	for (let i = 0; i < input.length; i += CHUNK_SIZE) arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
	return btoa(arr.join(""));
}
function decodeBase64(encoded) {
	if (Uint8Array.fromBase64) return Uint8Array.fromBase64(encoded);
	const binary = atob(encoded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
//#endregion
//#region node_modules/jose/dist/webapi/util/base64url.js
var invalid = "The input to be decoded is not correctly encoded.";
function decode$1(input) {
	if (Uint8Array.fromBase64) try {
		return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), { alphabet: "base64url" });
	} catch (cause) {
		throw new TypeError(invalid, { cause });
	}
	let encoded = input;
	if (encoded instanceof Uint8Array) encoded = decoder.decode(encoded);
	if (encoded.includes("+") || encoded.includes("/")) throw new TypeError(invalid);
	encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
	try {
		return decodeBase64(encoded);
	} catch {
		throw new TypeError(invalid);
	}
}
function encode$1(input) {
	let unencoded = input;
	if (typeof unencoded === "string") unencoded = encoder.encode(unencoded);
	if (Uint8Array.prototype.toBase64) return unencoded.toBase64({
		alphabet: "base64url",
		omitPadding: true
	});
	return encodeBase64(unencoded).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/type_checks.js
function assertUint8Array(input, label) {
	if (!(input instanceof Uint8Array)) throw new TypeError(`${label} must be an instance of Uint8Array`);
}
function isObject$1(input) {
	if (typeof input !== "object" || input === null || Object.prototype.toString.call(input) !== "[object Object]") return false;
	const prototype = Object.getPrototypeOf(input);
	return prototype === null || Object.getPrototypeOf(prototype) === null;
}
function isJwkSet(input) {
	return isObject$1(input) && Array.isArray(input.keys) && Array.from(input.keys).every(isObject$1);
}
function isDisjoint(...headers) {
	const parameters = /* @__PURE__ */ new Set();
	for (const header of headers) {
		if (!header) continue;
		for (const parameter of Object.keys(header)) {
			if (parameters.has(parameter)) return false;
			parameters.add(parameter);
		}
	}
	return true;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/helpers.js
var unprotected = Symbol();
function assertNotSet(value, name) {
	if (value !== void 0) throw new TypeError(`${name} can only be called once`);
}
function decodeBase64url(value, label, ErrorClass) {
	try {
		return decode$1(value);
	} catch {
		throw new ErrorClass(`Failed to base64url decode the ${label}`);
	}
}
function encodeBase64url(value, label, ErrorClass) {
	try {
		return encode$2(value);
	} catch {
		throw new ErrorClass(`The ${label} is not a valid base64url string`);
	}
}
async function digest(algorithm, data) {
	const subtleDigest = `SHA-${algorithm.slice(-3)}`;
	return new Uint8Array(await crypto.subtle.digest(subtleDigest, data));
}
function parseJoseHeader(b64, ErrorClass, message) {
	let parsed;
	try {
		parsed = JSON.parse(strictDecoder.decode(decode$1(b64)));
	} catch {
		throw new ErrorClass(message);
	}
	if (!isObject$1(parsed)) throw new ErrorClass(message);
	return parsed;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jwk_to_key.js
async function jwkToKey(entry, jwk) {
	if (jwk.kty === "RSA" && "oth" in jwk && jwk.oth !== void 0) throw new JOSENotSupported("RSA JWK \"oth\" (Other Primes Info) Parameter value is not supported");
	if (!entry.kty.includes(jwk.kty)) throw new JOSENotSupported("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
	const algorithm = entry.resolve?.({
		kty: jwk.kty,
		crv: jwk.crv
	}) ?? entry.subtle;
	const isPrivate = !!(jwk.d || jwk.priv);
	const keyData = { ...jwk };
	if (keyData.kty !== "AKP") delete keyData.alg;
	delete keyData.use;
	return crypto.subtle.importKey("jwk", keyData, algorithm, jwk.ext ?? !isPrivate, jwk.key_ops ?? entry.usages[isPrivate ? 1 : 0]);
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jwk_metadata.js
function snapshotJwk(jwk) {
	return {
		__proto__: null,
		...jwk
	};
}
function normalizeJwk(jwk) {
	const normalized = snapshotJwk(jwk);
	if (normalized.ext !== void 0 && typeof normalized.ext !== "boolean") throw new TypeError("\"ext\" (Extractable) Parameter must be a boolean");
	if (normalized.key_ops !== void 0) {
		const value = normalized.key_ops;
		const keyOps = Array.isArray(value) ? [...value] : void 0;
		if (!keyOps || keyOps.some((operation) => typeof operation !== "string") || new Set(keyOps).size !== keyOps.length) throw new TypeError("\"key_ops\" (Key Operations) Parameter must be an array of unique strings");
		normalized.key_ops = keyOps;
	}
	return normalized;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/key.js
var tag = (key) => key[Symbol.toStringTag];
var jwkMatchesOp = (entry, key, usage) => {
	const { alg } = entry;
	if (key.use !== void 0) {
		const expected = usage === "sign" || usage === "verify" ? "sig" : "enc";
		if (key.use !== expected) throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
	}
	if (key.alg !== void 0 && key.alg !== alg) throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
	if (Array.isArray(key.key_ops)) {
		const expectedKeyOp = usage === "encrypt" || usage === "decrypt" ? entry.ops?.[usage === "encrypt" ? 0 : 1] : usage;
		if (expectedKeyOp && !key.key_ops.includes(expectedKeyOp)) throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
	}
};
function checkKeyType(entry, key, usage) {
	const { alg, secret } = entry;
	const privateKey = usage === "decrypt" || usage === "sign";
	if (secret && key instanceof Uint8Array) return [BYTES, key];
	if (isObject$1(key)) {
		const normalized = normalizeJwk(key);
		if (typeof normalized.kty !== "string") throw new TypeError(secret ? withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
		if (!(secret ? normalized.kty === "oct" && typeof normalized.k === "string" : normalized.kty !== "oct" && (privateKey ? normalized.kty === "AKP" && typeof normalized.priv === "string" || typeof normalized.d === "string" : normalized.d === void 0 && normalized.priv === void 0))) throw new TypeError(secret ? `JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present` : `JSON Web Key for this operation must be a ${privateKey ? "private" : "public"} JWK`);
		jwkMatchesOp(entry, normalized, usage);
		return [
			JWK,
			key,
			normalized
		];
	}
	if (!isKeyLike(key)) throw new TypeError(secret ? withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
	if (secret) {
		if (key.type !== "secret") throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
	} else {
		if (key.type === "secret") throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
		const expectedType = privateKey ? "private" : "public";
		if ((key.type === "public" || key.type === "private") && key.type !== expectedType) {
			const operation = usage === "sign" ? "signing" : usage === "verify" ? "verifying" : `${usage.slice(0, -1)}tion`;
			throw new TypeError(`${tag(key)} instances for asymmetric algorithm ${operation} must be of type "${expectedType}"`);
		}
	}
	return isCryptoKey(key) ? [CRYPTO, key] : [KEYOBJECT, key];
}
var BYTES = 0;
var CRYPTO = 1;
var KEYOBJECT = 2;
var JWK = 3;
var cache;
var nist = {
	__proto__: null,
	prime256v1: "P-256",
	secp384r1: "P-384",
	secp521r1: "P-521"
};
function cached$1(key, alg, value) {
	cache ||= /* @__PURE__ */ new WeakMap();
	const entry = cache.get(key);
	if (value) {
		if (entry) entry[alg] = value;
		else cache.set(key, { [alg]: value });
	}
	return value ?? entry?.[alg];
}
var handleJWK = async (key, jwk, entry) => cached$1(key, entry.alg) ?? cached$1(key, entry.alg, await jwkToKey(entry, {
	...jwk,
	alg: entry.alg
}));
var handleKeyObject = (keyObject, entry) => {
	const hit = cached$1(keyObject, entry.alg);
	if (hit) return hit;
	const isPublic = keyObject.type === "public";
	const usages = entry.usages[isPublic ? 0 : 1];
	const { asymmetricKeyType } = keyObject;
	const crv = nist[keyObject.asymmetricKeyDetails?.namedCurve];
	const params = entry.resolve?.({
		crv,
		asymmetricKeyType
	}) ?? entry.subtle;
	return cached$1(keyObject, entry.alg, keyObject.toCryptoKey(params, isPublic, usages));
};
async function prepareKey(entry, key, usage) {
	const tagged = checkKeyType(entry, key, usage);
	switch (tagged[0]) {
		case BYTES:
		case CRYPTO: return tagged[1];
		case JWK: {
			const key = tagged[1];
			const normalized = tagged[2];
			if (normalized.kty === "oct") return decode$1(normalized.k);
			if (!Object.isFrozen(key)) {
				const { key_ops } = key;
				if (Array.isArray(key_ops)) Object.freeze(key_ops);
				Object.freeze(key);
			}
			return handleJWK(key, normalized, entry);
		}
		case KEYOBJECT: {
			const keyObject = tagged[1];
			if (keyObject.type === "secret") return keyObject.export();
			if ("toCryptoKey" in keyObject && typeof keyObject.toCryptoKey === "function") return handleKeyObject(keyObject, entry);
			return handleJWK(keyObject, keyObject.export({ format: "jwk" }), entry);
		}
	}
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/key_descriptor.js
function table(entries) {
	const out = { __proto__: null };
	for (const alg in entries) out[alg] = {
		...entries[alg],
		alg
	};
	return out;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jwe_algorithms.js
var wrap = [["encrypt", "wrapKey"], ["decrypt", "unwrapKey"]];
var derive = [[], ["deriveBits"]];
var none = [[], []];
function rsaes(bits) {
	return {
		kty: ["RSA"],
		subtle: {
			name: "RSA-OAEP",
			hash: `SHA-${bits}`
		},
		usages: wrap,
		ops: ["wrapKey", "unwrapKey"]
	};
}
function ecdh() {
	return {
		kty: ["EC", "OKP"],
		subtle: { name: "ECDH" },
		resolve: ({ kty, crv, asymmetricKeyType }) => {
			if (crv === "X25519" || asymmetricKeyType === "x25519") return { name: "X25519" };
			if (kty === "OKP") throw new JOSENotSupported("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
			return {
				name: "ECDH",
				namedCurve: crv
			};
		},
		usages: derive,
		ops: [void 0, "deriveBits"]
	};
}
function aeskw(bits, gcm = false) {
	return {
		kty: ["oct"],
		secret: true,
		subtle: {
			name: gcm ? "AES-GCM" : "AES-KW",
			length: bits
		},
		usages: none,
		ops: gcm ? ["encrypt", "decrypt"] : ["wrapKey", "unwrapKey"]
	};
}
function pbes2() {
	return {
		kty: ["oct"],
		secret: true,
		subtle: { name: "PBKDF2" },
		usages: none,
		ops: ["deriveBits", "deriveBits"]
	};
}
var JWE = table({
	dir: {
		kty: ["oct"],
		secret: true,
		subtle: { name: "AES-GCM" },
		usages: none,
		ops: ["encrypt", "decrypt"]
	},
	"RSA-OAEP": rsaes(1),
	"RSA-OAEP-256": rsaes(256),
	"RSA-OAEP-384": rsaes(384),
	"RSA-OAEP-512": rsaes(512),
	"ECDH-ES": ecdh(),
	"ECDH-ES+A128KW": ecdh(),
	"ECDH-ES+A192KW": ecdh(),
	"ECDH-ES+A256KW": ecdh(),
	A128KW: aeskw(128),
	A192KW: aeskw(192),
	A256KW: aeskw(256),
	A128GCMKW: aeskw(128, true),
	A192GCMKW: aeskw(192, true),
	A256GCMKW: aeskw(256, true),
	"PBES2-HS256+A128KW": pbes2(),
	"PBES2-HS384+A192KW": pbes2(),
	"PBES2-HS512+A256KW": pbes2()
});
var contentOps = ["encrypt", "decrypt"];
function contentEncryption(bits, cbc = false) {
	return {
		kty: ["oct"],
		secret: true,
		subtle: {
			name: cbc ? "AES-CBC" : "AES-GCM",
			length: bits
		},
		usages: none,
		ops: contentOps,
		cekBits: bits,
		ivBits: cbc ? 128 : 96,
		cbc
	};
}
var ENC = table({
	A128GCM: contentEncryption(128),
	A192GCM: contentEncryption(192),
	A256GCM: contentEncryption(256),
	"A128CBC-HS256": contentEncryption(256, true),
	"A192CBC-HS384": contentEncryption(384, true),
	"A256CBC-HS512": contentEncryption(512, true)
});
function unsupported(parameter, name) {
	throw new JOSENotSupported(`Invalid or unsupported "${parameter}" (JWE ${name}) header value`);
}
function jweAlgorithm(alg) {
	return (typeof alg === "string" ? JWE[alg] : void 0) ?? unsupported("alg", "Algorithm");
}
function jweEncryption(enc) {
	return (typeof enc === "string" ? ENC[enc] : void 0) ?? unsupported("enc", "Encryption Algorithm");
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/options.js
var JWS_RECOGNIZED = {
	__proto__: null,
	b64: true
};
var JWE_RECOGNIZED = { __proto__: null };
function validateAlgorithms(option, algorithms) {
	if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) throw new TypeError(`"${option}" option must be an array of strings`);
	if (!algorithms) return;
	return new Set(algorithms);
}
function validateCritDuplicates(Err, protectedHeader) {
	const { crit } = protectedHeader ?? {};
	if (Array.isArray(crit) && new Set(crit).size !== crit.length) throw new Err("\"crit\" (Critical) Header Parameter MUST NOT contain duplicate values");
}
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
	if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) throw new Err("\"crit\" (Critical) Header Parameter MUST be integrity protected");
	if (!protectedHeader || protectedHeader.crit === void 0) return [];
	if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) throw new Err("\"crit\" (Critical) Header Parameter MUST be an array of non-empty strings when present");
	const recognized = recognizedOption === void 0 ? recognizedDefault : {
		__proto__: null,
		...recognizedOption,
		...recognizedDefault
	};
	for (const parameter of protectedHeader.crit) {
		if (!(parameter in recognized)) throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
		if (!Object.hasOwn(joseHeader, parameter) || joseHeader[parameter] === void 0) throw new Err(`Extension Header Parameter "${parameter}" is missing`);
		if (recognized[parameter] && (!Object.hasOwn(protectedHeader, parameter) || protectedHeader[parameter] === void 0)) throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
	}
	return protectedHeader.crit;
}
function validateB64(protectedHeader, extensions) {
	if (extensions.includes("b64")) {
		const b64 = protectedHeader.b64;
		if (typeof b64 !== "boolean") throw new JWSInvalid("The \"b64\" (base64url-encode payload) Header Parameter must be a boolean");
		return b64;
	}
	return true;
}
function serializeJoseHeader(Err, header) {
	let serialized;
	let parsed;
	try {
		serialized = JSON.stringify(header);
		parsed = JSON.parse(serialized);
	} catch (cause) {
		throw new Err("JOSE Header is not valid JSON", { cause });
	}
	if (!isObject$1(parsed)) throw new Err("JOSE Header is not a JSON object");
	return [parsed, serialized];
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/signing.js
async function getSigKey(entry, key, usage) {
	if (key instanceof Uint8Array) return crypto.subtle.importKey("raw", key, entry.subtle, false, [usage]);
	checkCryptoKey(key, entry.subtle, usage);
	if (entry.minRsaBits) checkModulusLength(entry.alg, key);
	return key;
}
async function sign(entry, key, data) {
	const cryptoKey = await getSigKey(entry, key, "sign");
	const signature = await crypto.subtle.sign(entry.signing, cryptoKey, data);
	return new Uint8Array(signature);
}
async function verify(entry, key, signature, data) {
	const cryptoKey = await getSigKey(entry, key, "verify");
	try {
		return await crypto.subtle.verify(entry.signing, cryptoKey, signature, data);
	} catch {
		return false;
	}
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jws_algorithms.js
var sig = [["verify"], ["sign"]];
function hmac(bits) {
	const subtle = {
		name: "HMAC",
		hash: `SHA-${bits}`
	};
	return {
		kty: ["oct"],
		secret: true,
		subtle,
		signing: subtle,
		usages: sig
	};
}
function rsa(bits, saltLength) {
	const subtle = {
		name: saltLength ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
		hash: `SHA-${bits}`
	};
	return {
		kty: ["RSA"],
		subtle,
		signing: saltLength ? {
			...subtle,
			saltLength
		} : subtle,
		usages: sig,
		minRsaBits: 2048
	};
}
function ecdsa(crv, bits) {
	return {
		kty: ["EC"],
		crv,
		subtle: {
			name: "ECDSA",
			namedCurve: crv
		},
		signing: {
			name: "ECDSA",
			hash: `SHA-${bits}`
		},
		usages: sig
	};
}
function eddsa() {
	const subtle = { name: "Ed25519" };
	return {
		kty: ["OKP"],
		crv: "Ed25519",
		subtle,
		signing: subtle,
		usages: sig
	};
}
function mldsa(bits) {
	const subtle = { name: `ML-DSA-${bits}` };
	return {
		kty: ["AKP"],
		subtle,
		signing: subtle,
		usages: sig
	};
}
var JWS = table({
	HS256: hmac(256),
	HS384: hmac(384),
	HS512: hmac(512),
	RS256: rsa(256),
	RS384: rsa(384),
	RS512: rsa(512),
	PS256: rsa(256, 32),
	PS384: rsa(384, 48),
	PS512: rsa(512, 64),
	ES256: ecdsa("P-256", 256),
	ES384: ecdsa("P-384", 384),
	ES512: ecdsa("P-521", 512),
	EdDSA: eddsa(),
	Ed25519: eddsa(),
	"ML-DSA-44": mldsa(44),
	"ML-DSA-65": mldsa(65),
	"ML-DSA-87": mldsa(87)
});
function jwsAlgorithm(alg) {
	const entry = typeof alg === "string" ? JWS[alg] : void 0;
	if (!entry) throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
	return entry;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jws_verify.js
function prepareVerify(options) {
	return [options && validateAlgorithms("algorithms", options.algorithms), options?.crit];
}
function parseProtectedHeader(encodedProtected, parsedProtected = encodedProtected === void 0 ? {} : parseJoseHeader(encodedProtected, JWSInvalid, "JWS Protected Header is invalid")) {
	return parsedProtected;
}
function validateJwsHeaders(parsedProt, joseHeader, shared) {
	const b64 = validateB64(parsedProt, validateCrit(JWSInvalid, JWS_RECOGNIZED, shared[1], parsedProt, joseHeader));
	const alg = joseHeader.alg;
	if (typeof alg !== "string" || !alg) throw new JWSInvalid("JWS \"alg\" (Algorithm) Header Parameter missing or invalid");
	if (shared[0] && !shared[0].has(alg)) throw new JOSEAlgNotAllowed("\"alg\" (Algorithm) Header Parameter value not allowed");
	return [b64, alg];
}
function encodeCompactUnencodedPayload(payload) {
	try {
		return encode$2(payload);
	} catch {
		throw new JWSInvalid("JWS Compact Serialization payload must use only ASCII characters");
	}
}
async function verifyPrepared(jws, shared, key, encodedProtected, parsedProt, alg, signingPayload) {
	let resolvedKey = false;
	if (typeof key === "function") {
		key = await key(parsedProt, jws);
		resolvedKey = true;
	}
	const b64 = typeof signingPayload === "string";
	const entry = jwsAlgorithm(alg);
	const data = concat(encodedProtected !== void 0 ? encode$2(encodedProtected) : /* @__PURE__ */ new Uint8Array(), encode$2("."), b64 ? shared[2] ??= encodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload);
	const signature = decodeBase64url(jws.signature, "signature", JWSInvalid);
	const k = await prepareKey(entry, key, "verify");
	if (!await verify(entry, k, signature, data)) throw new JWSSignatureVerificationFailed();
	return [
		b64 ? decodeBase64url(signingPayload, "payload", JWSInvalid) : signingPayload,
		parsedProt,
		b64,
		k,
		resolvedKey
	];
}
async function verifyCompact(jws, shared, key) {
	if (jws instanceof Uint8Array) jws = decoder.decode(jws);
	if (typeof jws !== "string") throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
	const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
	if (length !== 3) throw new JWSInvalid("Invalid Compact JWS");
	const compactJws = {
		payload,
		protected: protectedHeader,
		signature
	};
	const parsedProt = parseProtectedHeader(protectedHeader);
	const [b64, alg] = validateJwsHeaders(parsedProt, parsedProt, shared);
	return verifyPrepared(compactJws, shared, key, protectedHeader, parsedProt, alg, b64 ? payload : encodeCompactUnencodedPayload(payload));
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jwt_claims_set.js
var epoch = (date) => Math.floor(date.getTime() / 1e3);
var multipliers = {
	s: 1,
	m: 60,
	h: 3600,
	d: 86400,
	w: 604800,
	y: 31557600
};
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var checkFailed = "check_failed";
function invalidDuration() {
	throw new TypeError("Invalid time period format");
}
function secs(str) {
	if (typeof str !== "string") invalidDuration();
	const matched = REGEX.exec(str);
	if (!matched || matched[4] && matched[1]) invalidDuration();
	const value = parseFloat(matched[2]);
	const numericDate = Math.round(value * multipliers[matched[3][0].toLowerCase()]);
	if (!Number.isFinite(numericDate)) invalidDuration();
	if (matched[1] === "-" || matched[4] === "ago") return -numericDate;
	return numericDate;
}
function validateInput(label, input) {
	if (!Number.isFinite(input)) throw new TypeError(`Invalid ${label} input`);
	return input;
}
function validateStringClaim(claim, value) {
	if (typeof value !== "string") throw new TypeError(`"${claim}" claim must be a string`);
}
function validateAudienceClaim(value) {
	if (typeof value !== "string" && (!Array.isArray(value) || Array.from(value).some((member) => typeof member !== "string"))) throw new TypeError("\"aud\" claim must be a string or an array of strings");
}
function numericDate(value, label) {
	if (typeof value === "number") return validateInput(label, value);
	if (value instanceof Date) return validateInput(label, epoch(value));
	return epoch(/* @__PURE__ */ new Date()) + secs(value);
}
var normalizeTyp = (value) => {
	const normalized = value.toLowerCase();
	return value.includes("/") ? normalized : `application/${normalized}`;
};
var checkAudiencePresence = (audPayload, audOption) => {
	if (typeof audPayload === "string") return audOption.includes(audPayload);
	if (Array.isArray(audPayload)) return audOption.some((aud) => audPayload.includes(aud));
	return false;
};
function validateNumericDate(payload, claim, required = false) {
	const value = payload[claim];
	if (value === void 0 && !required) return void 0;
	if (typeof value !== "number") throw new JWTClaimValidationFailed(`"${claim}" claim must be a number`, payload, claim, "invalid");
	return value;
}
function unexpectedClaim(payload, claim) {
	throw new JWTClaimValidationFailed(`unexpected "${claim}" claim value`, payload, claim, checkFailed);
}
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
	let payload;
	try {
		payload = JSON.parse(strictDecoder.decode(encodedPayload));
	} catch {}
	if (!isObject$1(payload)) throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
	const { typ } = options;
	if (typ !== void 0 && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) throw new JWTClaimValidationFailed("unexpected \"typ\" JWT header value", payload, "typ", checkFailed);
	const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
	const presenceCheck = [...requiredClaims];
	if (maxTokenAge !== void 0) presenceCheck.push("iat");
	if (audience !== void 0) presenceCheck.push("aud");
	if (subject !== void 0) presenceCheck.push("sub");
	if (issuer !== void 0) presenceCheck.push("iss");
	for (const claim of new Set(presenceCheck.reverse())) if (!Object.hasOwn(payload, claim)) throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
	if (issuer !== void 0 && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) unexpectedClaim(payload, "iss");
	if (subject !== void 0 && payload.sub !== subject) unexpectedClaim(payload, "sub");
	if (audience !== void 0 && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) unexpectedClaim(payload, "aud");
	const { clockTolerance } = options;
	let tolerance = 0;
	if (typeof clockTolerance === "string") tolerance = secs(clockTolerance);
	else if (clockTolerance !== void 0) {
		if (typeof clockTolerance !== "number") throw new TypeError("Invalid clockTolerance option type");
		tolerance = clockTolerance;
	}
	validateInput("clockTolerance option", tolerance);
	const { currentDate } = options;
	const now = validateInput("currentDate option", epoch(currentDate === void 0 ? /* @__PURE__ */ new Date() : currentDate));
	const iat = validateNumericDate(payload, "iat", maxTokenAge !== void 0);
	const nbf = validateNumericDate(payload, "nbf");
	if (nbf !== void 0) {
		if (nbf > now + tolerance) throw new JWTClaimValidationFailed("\"nbf\" claim timestamp check failed", payload, "nbf", checkFailed);
	}
	const exp = validateNumericDate(payload, "exp");
	if (exp !== void 0) {
		if (exp <= now - tolerance) throw new JWTExpired("\"exp\" claim timestamp check failed", payload, "exp", checkFailed);
	}
	if (maxTokenAge !== void 0) {
		const age = now - iat;
		const max = validateInput("maxTokenAge option", typeof maxTokenAge === "number" ? maxTokenAge : secs(maxTokenAge));
		if (age - tolerance > max) throw new JWTExpired("\"iat\" claim timestamp check failed (too far in the past)", payload, "iat", checkFailed);
		if (age < -tolerance) throw new JWTClaimValidationFailed("\"iat\" claim timestamp check failed (it should be in the past)", payload, "iat", checkFailed);
	}
	return payload;
}
var producerPayloads;
function producerPayload(producer) {
	return producerPayloads.get(producer);
}
function jwtData(producer) {
	const payload = producerPayload(producer);
	for (const claim of [
		"iat",
		"nbf",
		"exp"
	]) {
		const value = payload[claim];
		if (typeof value === "number" && !Number.isFinite(value)) throw new TypeError(`"${claim}" claim must be a finite number`);
	}
	return encoder.encode(JSON.stringify(payload));
}
function jwtClaim(producer, claim) {
	return producerPayload(producer)[claim];
}
var JWTClaimsBuilder = class {
	constructor(payload = {}) {
		if (!isObject$1(payload)) throw new TypeError("JWT Claims Set MUST be an object");
		(producerPayloads ||= /* @__PURE__ */ new WeakMap()).set(this, structuredClone(payload));
	}
	setIssuer(value) {
		validateStringClaim("iss", value);
		producerPayload(this).iss = value;
		return this;
	}
	setSubject(value) {
		validateStringClaim("sub", value);
		producerPayload(this).sub = value;
		return this;
	}
	setAudience(value) {
		validateAudienceClaim(value);
		producerPayload(this).aud = value;
		return this;
	}
	setJti(value) {
		validateStringClaim("jti", value);
		producerPayload(this).jti = value;
		return this;
	}
	setNotBefore(value) {
		producerPayload(this).nbf = numericDate(value, "setNotBefore");
		return this;
	}
	setExpirationTime(value) {
		producerPayload(this).exp = numericDate(value, "setExpirationTime");
		return this;
	}
	setIssuedAt(value) {
		const payload = producerPayload(this);
		if (value === void 0) payload.iat = epoch(/* @__PURE__ */ new Date());
		else if (typeof value === "string") payload.iat = validateInput("setIssuedAt", epoch(/* @__PURE__ */ new Date()) + secs(value));
		else payload.iat = numericDate(value, "setIssuedAt");
		return this;
	}
};
//#endregion
//#region node_modules/jose/dist/webapi/jwt/verify.js
async function jwtVerify(jwt, key, options) {
	const verified = await verifyCompact(jwt, prepareVerify(options), key);
	if (!verified[2]) throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
	const result = {
		payload: validateClaimsSet(verified[1], verified[0], options),
		protectedHeader: verified[1]
	};
	if (typeof key === "function") return {
		...result,
		key: verified[3]
	};
	return result;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/key_algorithm.js
function unsupportedAlg(source = "JWK \"alg\" (Algorithm) Parameter") {
	throw new JOSENotSupported(`Invalid or unsupported ${source} value`);
}
function keyAlgorithm(alg, source) {
	return (typeof alg === "string" ? JWS[alg] ?? JWE[alg] : void 0) ?? unsupportedAlg(source);
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/key_options.js
function validateExtractableOption(extractable) {
	if (extractable !== void 0 && typeof extractable !== "boolean") throw new TypeError("\"extractable\" option must be a boolean");
	return extractable;
}
//#endregion
//#region node_modules/jose/dist/webapi/jwks/local.js
function isUsableJWK(jwk, entry, alg, kid) {
	const { kty, key_ops, ext, kid: jwkKid, alg: jwkAlg, use, crv } = snapshotJwk(jwk);
	const keyOps = Array.isArray(key_ops) ? [...key_ops] : key_ops;
	return (ext === void 0 || typeof ext === "boolean") && (keyOps === void 0 || Array.isArray(keyOps) && keyOps.every((operation, index) => typeof operation === "string" && keyOps.indexOf(operation) === index) && keyOps.includes("verify")) && entry.kty.includes(kty) && (kid === void 0 || typeof kid === "string" && kid === jwkKid) && (jwkAlg === void 0 ? kty !== "AKP" : alg === jwkAlg) && (use === void 0 || use === "sig") && (!entry.crv || crv === entry.crv);
}
async function importWithAlgCache(cache, jwk, entry) {
	const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk);
	const { alg } = entry;
	if (cached[alg] === void 0) {
		const key = await jwkToKey(entry, {
			...jwk,
			alg,
			ext: true
		});
		if (key.type !== "public") throw new JWKSInvalid("JSON Web Key Set members must be public keys");
		cached[alg] = key;
	}
	return cached[alg];
}
function createLocalJWKSet(jwks) {
	let snapshot;
	try {
		snapshot = structuredClone(jwks);
	} catch {}
	if (!isJwkSet(snapshot)) throw new JWKSInvalid("JSON Web Key Set malformed");
	const cached = /* @__PURE__ */ new WeakMap();
	const localJWKSet = async (protectedHeader, token) => {
		const { alg, kid } = {
			...protectedHeader,
			...token?.header
		};
		const entry = typeof alg === "string" ? JWS[alg] : void 0;
		if (!entry || entry.secret) throw new JOSENotSupported("Unsupported \"alg\" value for a JSON Web Key Set");
		const candidates = snapshot.keys.filter((jwk) => isUsableJWK(jwk, entry, alg, kid));
		const { 0: jwk, length } = candidates;
		if (!length) throw new JWKSNoMatchingKey();
		if (length !== 1) {
			const error = new JWKSMultipleMatchingKeys();
			error[Symbol.asyncIterator] = async function* () {
				for (const jwk of candidates) try {
					yield await importWithAlgCache(cached, jwk, entry);
				} catch {}
			};
			throw error;
		}
		return importWithAlgCache(cached, jwk, entry);
	};
	return Object.defineProperty(localJWKSet, "jwks", { value: () => structuredClone(snapshot) });
}
//#endregion
//#region node_modules/jose/dist/webapi/jwks/remote.js
function isCloudflareWorkers() {
	return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
}
var USER_AGENT;
if (typeof navigator === "undefined" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) USER_AGENT = `jose/v6.2.10`;
var customFetch = Symbol();
async function fetchJwks(url, headers, signal, fetchImpl = fetch) {
	const response = await fetchImpl(url, {
		method: "GET",
		signal,
		redirect: "manual",
		headers
	}).catch((err) => {
		if (err.name === "TimeoutError") throw new JWKSTimeout();
		throw err;
	});
	if (response.status !== 200) throw new JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
	try {
		return await response.json();
	} catch {
		throw new JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
	}
}
var jwksCache = Symbol();
function isFreshFor(timestamp, duration) {
	return Number.isFinite(timestamp) && Date.now() < timestamp + duration;
}
function validateDuration(value, fallback, option) {
	if (Number.isNaN(value)) throw new TypeError(`"${option}" option must not be NaN`);
	return typeof value === "number" ? value : fallback;
}
function createRemoteJWKSet(url, options) {
	if (!(url instanceof URL)) throw new TypeError("url must be an instance of URL");
	const href = new URL(url.href).href;
	const opts = options ?? {};
	const timeoutOption = opts.timeoutDuration;
	if (typeof timeoutOption === "number" && (!Number.isInteger(timeoutOption) || timeoutOption < 0)) throw new TypeError("\"timeoutDuration\" option must be a non-negative integer");
	const timeoutDuration = typeof timeoutOption === "number" ? timeoutOption : 5e3;
	const cooldownDuration = validateDuration(opts.cooldownDuration, 3e4, "cooldownDuration");
	const cacheMaxAge = validateDuration(opts.cacheMaxAge, 6e5, "cacheMaxAge");
	const headers = new Headers(opts.headers);
	if (USER_AGENT && !headers.has("User-Agent")) headers.set("User-Agent", USER_AGENT);
	if (!headers.has("accept")) headers.set("accept", "application/json, application/jwk-set+json");
	const fetchImpl = opts[customFetch];
	const cache = opts[jwksCache];
	let jwksTimestamp;
	let pendingFetch;
	let reloadSequence = 0;
	let appliedSequence = 0;
	let local;
	if (cache && typeof cache === "object") {
		const { uat, jwks } = cache;
		if (isFreshFor(uat, cacheMaxAge) && isJwkSet(jwks)) {
			jwksTimestamp = uat;
			local = createLocalJWKSet(jwks);
		}
	}
	const reload = async () => {
		if (pendingFetch && isCloudflareWorkers()) pendingFetch = void 0;
		if (!pendingFetch) {
			const sequence = ++reloadSequence;
			const current = pendingFetch = fetchJwks(href, headers, AbortSignal.timeout(timeoutDuration), fetchImpl).then((json) => {
				const next = createLocalJWKSet(json);
				if (sequence <= appliedSequence) return;
				local = next;
				const updatedAt = Date.now();
				if (cache) {
					cache.uat = updatedAt;
					cache.jwks = json;
				}
				jwksTimestamp = updatedAt;
				appliedSequence = sequence;
			}).finally(() => {
				if (pendingFetch === current) pendingFetch = void 0;
			});
		}
		await pendingFetch;
	};
	const remoteJWKSet = async (protectedHeader, token) => {
		if (!local || !isFreshFor(jwksTimestamp, cacheMaxAge)) await reload();
		try {
			return await local(protectedHeader, token);
		} catch (err) {
			if (err instanceof JWKSNoMatchingKey && !isFreshFor(jwksTimestamp, cooldownDuration)) {
				await reload();
				return local(protectedHeader, token);
			}
			throw err;
		}
	};
	return Object.defineProperties(remoteJWKSet, {
		coolingDown: {
			get: () => isFreshFor(jwksTimestamp, cooldownDuration),
			enumerable: true
		},
		fresh: {
			get: () => isFreshFor(jwksTimestamp, cacheMaxAge),
			enumerable: true
		},
		reload: {
			value: reload,
			enumerable: true
		},
		reloading: {
			get: () => !!pendingFetch,
			enumerable: true
		},
		jwks: {
			value: () => local?.jwks(),
			enumerable: true
		}
	});
}
//#endregion
//#region node_modules/jose/dist/webapi/key/import.js
async function importJWK(jwk, alg, options) {
	if (!isObject$1(jwk)) throw new TypeError("JWK must be an object");
	const normalized = normalizeJwk(jwk);
	const extractable = validateExtractableOption(options?.extractable);
	const { alg: jwkAlg } = normalized;
	alg ??= jwkAlg;
	const ext = extractable ?? normalized.ext;
	if (normalized.kty !== "oct" && !alg) throw new TypeError("\"alg\" argument is required when \"jwk.alg\" is not present");
	switch (normalized.kty) {
		case "oct":
			if (typeof normalized.k !== "string") throw new TypeError("missing \"k\" (Key Value) Parameter value");
			return decode$1(normalized.k);
		case "AKP":
			if (typeof jwkAlg !== "string" || !jwkAlg) throw new TypeError("missing \"alg\" (Algorithm) Parameter value");
			if (alg !== jwkAlg) throw new TypeError("JWK alg and alg option value mismatch");
			return jwkToKey(keyAlgorithm(alg), {
				...normalized,
				ext
			});
		case "RSA":
		case "EC":
		case "OKP": return jwkToKey(keyAlgorithm(alg), {
			...normalized,
			alg,
			ext
		});
		default: throw new JOSENotSupported("Unsupported \"kty\" (Key Type) Parameter value");
	}
}
//#endregion
//#region node_modules/jose/dist/webapi/util/decode_protected_header.js
function decodeProtectedHeader(token) {
	let protectedB64u;
	if (typeof token === "string") {
		const parts = token.split(".");
		if (parts.length === 3 || parts.length === 5) [protectedB64u] = parts;
	} else if (typeof token === "object" && token) {
		if ("protected" in token) protectedB64u = token.protected;
		else throw new TypeError("Token does not contain a Protected Header");
	}
	const invalid = "Invalid Token or Protected Header formatting";
	if (typeof protectedB64u !== "string" || !protectedB64u) throw new TypeError(invalid);
	return parseJoseHeader(protectedB64u, TypeError, invalid);
}
//#endregion
//#region node_modules/jose/dist/webapi/util/decode_jwt.js
function decodeJwt(jwt) {
	if (typeof jwt !== "string") throw new JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
	const { 1: payload, length } = jwt.split(".");
	if (length === 5) throw new JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
	if (length !== 3) throw new JWTInvalid("Invalid JWT");
	if (!payload) throw new JWTInvalid("JWTs must contain a payload");
	let decoded;
	try {
		decoded = decode$1(payload);
	} catch {
		throw new JWTInvalid("Failed to base64url decode the payload");
	}
	let result;
	try {
		result = JSON.parse(strictDecoder.decode(decoded));
	} catch {
		throw new JWTInvalid("Failed to parse the decoded payload as JSON");
	}
	if (!isObject$1(result)) throw new JWTInvalid("Invalid JWT Claims Set");
	return result;
}
//#endregion
//#region node_modules/@better-auth/utils/dist/base64.mjs
function getAlphabet(urlSafe) {
	return urlSafe ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
}
function base64Encode(data, alphabet, padding) {
	let result = "";
	let buffer = 0;
	let shift = 0;
	for (const byte of data) {
		buffer = buffer << 8 | byte;
		shift += 8;
		while (shift >= 6) {
			shift -= 6;
			result += alphabet[buffer >> shift & 63];
		}
	}
	if (shift > 0) result += alphabet[buffer << 6 - shift & 63];
	if (padding) {
		const padCount = (4 - result.length % 4) % 4;
		result += "=".repeat(padCount);
	}
	return result;
}
function base64Decode(data, alphabet) {
	const decodeMap = /* @__PURE__ */ new Map();
	for (let i = 0; i < alphabet.length; i++) decodeMap.set(alphabet[i], i);
	const result = [];
	let buffer = 0;
	let bitsCollected = 0;
	for (const char of data) {
		if (char === "=") break;
		const value = decodeMap.get(char);
		if (value === void 0) throw new Error(`Invalid Base64 character: ${char}`);
		buffer = buffer << 6 | value;
		bitsCollected += 6;
		if (bitsCollected >= 8) {
			bitsCollected -= 8;
			result.push(buffer >> bitsCollected & 255);
		}
	}
	return Uint8Array.from(result);
}
var base64$1 = {
	encode(data, options = {}) {
		const alphabet = getAlphabet(false);
		return base64Encode(typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data), alphabet, options.padding ?? true);
	},
	decode(data) {
		if (typeof data !== "string") data = new TextDecoder().decode(data);
		const alphabet = getAlphabet(data.includes("-") || data.includes("_"));
		return base64Decode(data, alphabet);
	}
};
var base64Url = {
	encode(data, options = {}) {
		const alphabet = getAlphabet(true);
		return base64Encode(typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data), alphabet, options.padding ?? true);
	},
	decode(data) {
		return base64Decode(data, getAlphabet(data.includes("-") || data.includes("_")));
	}
};
//#endregion
//#region node_modules/@better-auth/core/dist/db/database-index.mjs
var MAX_DATABASE_INDEX_NAME_BYTES = 63;
var MAX_DATABASE_INDEX_FIELDS = 16;
function getPortableDatabaseIdentifierKey(identifier) {
	return identifier.toLowerCase();
}
function getUtf8ByteLength(value) {
	return new TextEncoder().encode(value).length;
}
function truncateUtf8(value, maxBytes) {
	let result = "";
	let byteLength = 0;
	for (const character of value) {
		const characterByteLength = getUtf8ByteLength(character);
		if (byteLength + characterByteLength > maxBytes) break;
		result += character;
		byteLength += characterByteLength;
	}
	return result;
}
function getStableIndexNameHash(value) {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0).toString(16).padStart(8, "0");
}
/** Returns the stable database name for a table-level index. */
function getDatabaseIndexName(tableName, index) {
	if (index.name !== void 0) {
		if (index.name.trim().length === 0) throw new BetterAuthError("Database index names must contain at least one visible character.");
		if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(index.name)) throw new BetterAuthError("Database index names must start with a letter or underscore and contain only letters, numbers, and underscores.");
		if (getUtf8ByteLength(index.name) > MAX_DATABASE_INDEX_NAME_BYTES) throw new BetterAuthError(`Database index names must be at most ${MAX_DATABASE_INDEX_NAME_BYTES} UTF-8 bytes.`);
		return index.name;
	}
	const indexKind = index.unique ? "uidx" : "idx";
	const generatedName = `${tableName}_${index.fields.join("_")}_${indexKind}`;
	if (getUtf8ByteLength(generatedName) <= MAX_DATABASE_INDEX_NAME_BYTES) return generatedName;
	const suffix = `_${getStableIndexNameHash(generatedName)}_${indexKind}`;
	return `${truncateUtf8(generatedName.slice(0, -indexKind.length - 1), MAX_DATABASE_INDEX_NAME_BYTES - getUtf8ByteLength(suffix))}${suffix}`;
}
/** Returns the database name used by legacy field-level index metadata. */
function getDatabaseFieldIndexName(tableName, columnName, unique) {
	return getDatabaseIndexName(tableName, {
		fields: [columnName],
		unique
	});
}
/** Resolves logical index fields to their configured database column names. */
function resolveDatabaseTableIndexes({ fields, indexes, tableName }) {
	const resolvedIndexes = (indexes ?? []).map((index) => {
		if (index.fields.length === 0) throw new BetterAuthError(`Index on table "${tableName}" must include at least one field.`);
		if (index.fields.length > MAX_DATABASE_INDEX_FIELDS) throw new BetterAuthError(`Index on table "${tableName}" can include at most ${MAX_DATABASE_INDEX_FIELDS} fields so it works across supported databases.`);
		if (new Set(index.fields).size !== index.fields.length) throw new BetterAuthError(`Index on table "${tableName}" contains the same field more than once.`);
		if (index.unique && index.fields.some((fieldName) => fields[fieldName]?.required === false)) throw new BetterAuthError(`Unique index on table "${tableName}" can only include required fields so its behavior is consistent across databases.`);
		const unsupportedField = index.fields.find((fieldName) => {
			const fieldType = fields[fieldName]?.type;
			return fieldType === "json" || fieldType === "string[]" || fieldType === "number[]";
		});
		if (unsupportedField) throw new BetterAuthError(`Index on table "${tableName}" references field "${unsupportedField}", whose type is not portably indexable.`);
		const resolveFieldName = (fieldName) => {
			const field = fields[fieldName];
			if (!field) throw new BetterAuthError(`Index on table "${tableName}" references unknown field "${fieldName}".`);
			return field.fieldName || fieldName;
		};
		const [firstField, ...remainingFields] = index.fields;
		const columns = [resolveFieldName(firstField), ...remainingFields.map(resolveFieldName)];
		if (new Set(columns.map(getPortableDatabaseIdentifierKey)).size !== columns.length) throw new BetterAuthError(`Index on table "${tableName}" resolves more than one field to the same database column.`);
		return {
			columns,
			name: getDatabaseIndexName(tableName, {
				...index,
				fields: columns
			}),
			unique: index.unique
		};
	});
	const definitionsByName = /* @__PURE__ */ new Map();
	const deduplicatedIndexes = [];
	for (const index of resolvedIndexes) {
		const definition = JSON.stringify([index.columns, index.unique ?? false]);
		const identifierKey = getPortableDatabaseIdentifierKey(index.name);
		const existingDefinition = definitionsByName.get(identifierKey);
		if (existingDefinition && existingDefinition !== definition) throw new BetterAuthError(`Database index name "${index.name}" identifies more than one index on table "${tableName}".`);
		if (existingDefinition) continue;
		definitionsByName.set(identifierKey, definition);
		deduplicatedIndexes.push(index);
	}
	return deduplicatedIndexes;
}
/**
* Returns a safe generated string length for a column across all of its table
* indexes in byte-limited SQL dialects.
*/
function getDatabaseIndexStringLength({ columnName, dialect, fields, indexes }) {
	const fieldsByColumn = new Map(Object.entries(fields).map(([fieldName, field]) => [field.fieldName || fieldName, field]));
	const containingIndexes = indexes.filter((index) => index.columns.includes(columnName));
	if (containingIndexes.length === 0) return void 0;
	const byteBudget = dialect === "mysql" ? 3072 : 1700;
	const bytesPerCharacter = dialect === "mysql" ? 4 : 1;
	const defaultLength = dialect === "mysql" ? 191 : 255;
	return containingIndexes.reduce((length, index) => {
		const stringColumnCount = index.columns.filter((column) => {
			const type = fieldsByColumn.get(column)?.type;
			return type === "string" || Array.isArray(type);
		}).length;
		if (stringColumnCount === 0) return length;
		const nonStringColumnBytes = (index.columns.length - stringColumnCount) * 16;
		const safeLength = Math.floor(Math.max(1, byteBudget - nonStringColumnBytes) / bytesPerCharacter / stringColumnCount);
		return Math.min(length, safeLength);
	}, defaultLength);
}
/**
* Resolves and validates every table index as one portable database schema.
*
* Index names are schema-wide because SQLite and PostgreSQL do not scope them
* to an individual table.
*/
function resolveDatabaseSchemaIndexes(sources) {
	const mergedSourcesByTable = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const existingSource = mergedSourcesByTable.get(source.tableName);
		if (existingSource) {
			if (existingSource.indexes.length > 0 || (source.indexes?.length ?? 0) > 0) throw new BetterAuthError(`Database schema resolves more than one indexed logical table to "${source.tableName}". Define table-level indexes through one logical schema key instead of aliasing multiple keys to the same database table.`);
			Object.assign(existingSource.fields, source.fields);
			continue;
		}
		const mergedSource = {
			fields: {},
			indexes: [],
			tableName: source.tableName
		};
		Object.assign(mergedSource.fields, source.fields);
		mergedSource.indexes.push(...source.indexes ?? []);
		mergedSourcesByTable.set(source.tableName, mergedSource);
	}
	const indexesByTable = /* @__PURE__ */ new Map();
	const indexOwnerByName = /* @__PURE__ */ new Map();
	const tableNamesByIdentifier = new Map([...mergedSourcesByTable.keys()].map((tableName) => [getPortableDatabaseIdentifierKey(tableName), tableName]));
	const fieldIndexOwnerByName = /* @__PURE__ */ new Map();
	for (const source of mergedSourcesByTable.values()) for (const [fieldName, field] of Object.entries(source.fields)) {
		if (!field.index && !field.unique) continue;
		const indexName = getDatabaseFieldIndexName(source.tableName, field.fieldName || fieldName, field.unique ?? false);
		const identifierKey = getPortableDatabaseIdentifierKey(indexName);
		if (tableNamesByIdentifier.has(identifierKey)) throw new BetterAuthError(`Database index name "${indexName}" conflicts with a table name. Index and table names must be unique across the schema.`);
		const existingOwner = fieldIndexOwnerByName.get(identifierKey);
		if (existingOwner) throw new BetterAuthError(`Database field-level index name "${indexName}" is used by both table "${existingOwner}" and table "${source.tableName}".`);
		fieldIndexOwnerByName.set(identifierKey, source.tableName);
	}
	for (const source of mergedSourcesByTable.values()) {
		const resolvedIndexes = resolveDatabaseTableIndexes(source);
		indexesByTable.set(source.tableName, [...resolvedIndexes]);
		for (const index of resolvedIndexes) {
			const identifierKey = getPortableDatabaseIdentifierKey(index.name);
			if (tableNamesByIdentifier.has(identifierKey)) throw new BetterAuthError(`Database index name "${index.name}" conflicts with a table name. Index and table names must be unique across the schema.`);
			const fieldIndexOwner = fieldIndexOwnerByName.get(identifierKey);
			if (fieldIndexOwner) throw new BetterAuthError(`Database index name "${index.name}" is already reserved by field-level index metadata on table "${fieldIndexOwner}". Remove the duplicate table-level index or give it a distinct name.`);
			const indexOwner = indexOwnerByName.get(identifierKey);
			if (indexOwner && indexOwner !== source.tableName) throw new BetterAuthError(`Database index name "${index.name}" is used by both table "${indexOwner}" and table "${source.tableName}". Index names must be unique across the schema.`);
			indexOwnerByName.set(identifierKey, source.tableName);
		}
	}
	return indexesByTable;
}
//#endregion
//#region node_modules/@better-auth/core/dist/db/get-tables.mjs
function mergeTableIndexes(...indexCollections) {
	const indexes = [];
	const seenIndexDefinitions = /* @__PURE__ */ new Set();
	for (const index of indexCollections.flatMap((collection) => collection ?? [])) {
		const definition = JSON.stringify([
			index.name ?? null,
			index.fields,
			index.unique ?? false
		]);
		if (seenIndexDefinitions.has(definition)) continue;
		seenIndexDefinitions.add(definition);
		indexes.push(index);
	}
	return indexes;
}
var buildAuthTables = (options) => {
	const pluginSchema = (options.plugins ?? []).reduce((acc, plugin) => {
		const schema = plugin.schema;
		if (!schema) return acc;
		for (const [key, value] of Object.entries(schema)) acc[key] = {
			fields: {
				...acc[key]?.fields,
				...value.fields
			},
			indexes: mergeTableIndexes(acc[key]?.indexes, value.indexes),
			modelName: value.modelName || key,
			disableMigrations: value.disableMigration ?? acc[key]?.disableMigrations
		};
		return acc;
	}, {});
	const shouldAddRateLimitTable = options.rateLimit?.storage === "database";
	const rateLimitTable = { rateLimit: {
		modelName: options.rateLimit?.modelName || "rateLimit",
		fields: {
			key: {
				type: "string",
				unique: true,
				required: true,
				fieldName: options.rateLimit?.fields?.key || "key"
			},
			count: {
				type: "number",
				required: true,
				fieldName: options.rateLimit?.fields?.count || "count"
			},
			lastRequest: {
				type: "number",
				bigint: true,
				required: true,
				fieldName: options.rateLimit?.fields?.lastRequest || "lastRequest",
				defaultValue: () => Date.now()
			}
		}
	} };
	const { user, session, account, verification, ...pluginTables } = pluginSchema;
	const verificationTable = { verification: {
		modelName: options.verification?.modelName || "verification",
		indexes: verification?.indexes,
		fields: {
			identifier: {
				type: "string",
				required: true,
				fieldName: options.verification?.fields?.identifier || "identifier",
				index: true
			},
			value: {
				type: "string",
				required: true,
				fieldName: options.verification?.fields?.value || "value"
			},
			expiresAt: {
				type: "date",
				required: true,
				fieldName: options.verification?.fields?.expiresAt || "expiresAt"
			},
			createdAt: {
				type: "date",
				required: true,
				defaultValue: () => /* @__PURE__ */ new Date(),
				fieldName: options.verification?.fields?.createdAt || "createdAt"
			},
			updatedAt: {
				type: "date",
				required: true,
				defaultValue: () => /* @__PURE__ */ new Date(),
				onUpdate: () => /* @__PURE__ */ new Date(),
				fieldName: options.verification?.fields?.updatedAt || "updatedAt"
			},
			...verification?.fields,
			...options.verification?.additionalFields
		},
		order: 4
	} };
	const sessionTable = { session: {
		modelName: options.session?.modelName || "session",
		indexes: session?.indexes,
		fields: {
			expiresAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.expiresAt || "expiresAt"
			},
			token: {
				type: "string",
				required: true,
				fieldName: options.session?.fields?.token || "token",
				unique: true
			},
			createdAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.createdAt || "createdAt",
				defaultValue: () => /* @__PURE__ */ new Date()
			},
			updatedAt: {
				type: "date",
				required: true,
				fieldName: options.session?.fields?.updatedAt || "updatedAt",
				onUpdate: () => /* @__PURE__ */ new Date()
			},
			ipAddress: {
				type: "string",
				required: false,
				fieldName: options.session?.fields?.ipAddress || "ipAddress"
			},
			userAgent: {
				type: "string",
				required: false,
				fieldName: options.session?.fields?.userAgent || "userAgent"
			},
			userId: {
				type: "string",
				fieldName: options.session?.fields?.userId || "userId",
				references: {
					model: "user",
					field: "id",
					onDelete: "cascade"
				},
				required: true,
				index: true
			},
			...session?.fields,
			...options.session?.additionalFields
		},
		order: 2
	} };
	return {
		user: {
			modelName: options.user?.modelName || "user",
			indexes: user?.indexes,
			fields: {
				name: {
					type: "string",
					required: true,
					fieldName: options.user?.fields?.name || "name",
					sortable: true
				},
				email: {
					type: "string",
					unique: true,
					required: true,
					fieldName: options.user?.fields?.email || "email",
					sortable: true
				},
				emailVerified: {
					type: "boolean",
					defaultValue: false,
					required: true,
					fieldName: options.user?.fields?.emailVerified || "emailVerified",
					input: false
				},
				image: {
					type: "string",
					required: false,
					fieldName: options.user?.fields?.image || "image"
				},
				createdAt: {
					type: "date",
					defaultValue: () => /* @__PURE__ */ new Date(),
					required: true,
					fieldName: options.user?.fields?.createdAt || "createdAt"
				},
				updatedAt: {
					type: "date",
					defaultValue: () => /* @__PURE__ */ new Date(),
					onUpdate: () => /* @__PURE__ */ new Date(),
					required: true,
					fieldName: options.user?.fields?.updatedAt || "updatedAt"
				},
				...user?.fields,
				...options.user?.additionalFields
			},
			order: 1
		},
		...!options.secondaryStorage || options.session?.storeSessionInDatabase ? sessionTable : {},
		account: {
			modelName: options.account?.modelName || "account",
			indexes: mergeTableIndexes([{
				fields: ["issuer", "accountId"],
				unique: true
			}], account?.indexes),
			fields: {
				issuer: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.issuer || "issuer"
				},
				accountId: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.accountId || "accountId"
				},
				providerId: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.providerId || "providerId"
				},
				userId: {
					type: "string",
					references: {
						model: "user",
						field: "id",
						onDelete: "cascade"
					},
					required: true,
					fieldName: options.account?.fields?.userId || "userId",
					index: true
				},
				accessToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.accessToken || "accessToken"
				},
				refreshToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.refreshToken || "refreshToken"
				},
				idToken: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.idToken || "idToken"
				},
				accessTokenExpiresAt: {
					type: "date",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.accessTokenExpiresAt || "accessTokenExpiresAt"
				},
				refreshTokenExpiresAt: {
					type: "date",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.refreshTokenExpiresAt || "refreshTokenExpiresAt"
				},
				scope: {
					type: "string",
					required: false,
					fieldName: options.account?.fields?.scope || "scope"
				},
				password: {
					type: "string",
					required: false,
					returned: false,
					fieldName: options.account?.fields?.password || "password"
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: options.account?.fields?.createdAt || "createdAt",
					defaultValue: () => /* @__PURE__ */ new Date()
				},
				updatedAt: {
					type: "date",
					required: true,
					fieldName: options.account?.fields?.updatedAt || "updatedAt",
					onUpdate: () => /* @__PURE__ */ new Date()
				},
				...account?.fields,
				...options.account?.additionalFields
			},
			order: 3
		},
		...!options.secondaryStorage || options.verification?.storeInDatabase ? verificationTable : {},
		...pluginTables,
		...shouldAddRateLimitTable ? rateLimitTable : {}
	};
};
function getAuthTablesWithResolvedIndexes(options) {
	const tables = buildAuthTables(options);
	return {
		indexesByTable: resolveDatabaseSchemaIndexes(Object.values(tables).filter((table) => !("disableMigrations" in table) || !table.disableMigrations).map((table) => ({
			fields: table.fields,
			indexes: "indexes" in table ? table.indexes : void 0,
			tableName: table.modelName
		}))),
		tables
	};
}
var getAuthTables = (options) => getAuthTablesWithResolvedIndexes(options).tables;
//#endregion
//#region node_modules/zod/v4/core/core.js
var _a$1;
function $constructor(name, initializer, params) {
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a;
		const inst = params?.Parent ? new Definition() : this;
		init(inst, def);
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__*/ Symbol("evaluating");
function defineLazy(object, key, getter) {
	let value = void 0;
	Object.defineProperty(object, key, {
		get() {
			if (value === EVALUATING) return;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object, key, { value: v });
		},
		configurable: true
	});
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__*/ cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
var propertyKeyTypes = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
var NUMBER_FORMAT_RANGES = {
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				newShape[key] = currDef.shape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = { ...schema._zod.def.shape };
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = schema._zod.def.shape;
		for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function merge(a, b) {
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	return clone(a, mergeDefs(a._zod.def, {
		get shape() {
			const _shape = {
				...a._zod.def.shape,
				...b._zod.def.shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	}));
}
function partial(Class, schema, mask) {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key in mask) {
				if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key in oldShape) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	}));
}
function required(Class, schema, mask) {
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = { ...oldShape };
		if (mask) for (const key in mask) {
			if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key in oldShape) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
	rest.path ?? (rest.path = []);
	rest.message = message;
	if (ctx?.reportInput) rest.input = _input;
	return rest;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
//#endregion
//#region node_modules/zod/v4/core/errors.js
var initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	Object.defineProperty(inst, "_zod", {
		value: inst._zod,
		enumerable: false
	});
	Object.defineProperty(inst, "issues", {
		value: def,
		enumerable: false
	});
	inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	Object.defineProperty(inst, "toString", {
		value: () => inst.message,
		enumerable: false
	});
};
var $ZodError = $constructor("$ZodError", initializer$1);
var $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) {
		fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
		fieldErrors[sub.path[0]].push(mapper(sub));
	} else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error, path = []) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue));
					}
					curr = curr[el];
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}
//#endregion
//#region node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	if (result.issues.length) {
		const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, _params?.callee);
		throw e;
	}
	return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	if (result.issues.length) {
		const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, params?.callee);
		throw e;
	}
	return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
var safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
var safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
var _encode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parse(_Err)(schema, value, ctx);
};
var _decode = (_Err) => (schema, value, _ctx) => {
	return _parse(_Err)(schema, value, _ctx);
};
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parseAsync(_Err)(schema, value, ctx);
};
var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _parseAsync(_Err)(schema, value, _ctx);
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
//#endregion
//#region node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
var duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
var uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
var email$1 = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
var ipv4$1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date$2 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time$1(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
	const time = timeSource({ precision: args.precision });
	const opts = ["Z"];
	if (args.local) opts.push("");
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const timeRegex = `${time}(?:${opts.join("|")})`;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string$2 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
var integer = /^-?\d+$/;
var number$1 = /^-?\d+(?:\.\d+)?$/;
var boolean$2 = /^(?:true|false)$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;
//#endregion
//#region node_modules/zod/v4/core/checks.js
var $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
var numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
var $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) {
			if (def.inclusive) bag.maximum = def.value;
			else bag.exclusiveMaximum = def.value;
		}
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) {
			if (def.inclusive) bag.minimum = def.value;
			else bag.exclusiveMinimum = def.value;
		}
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		var _a;
		(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
	});
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		bag.minimum = minimum;
		bag.maximum = maximum;
		if (isInt) bag.pattern = integer;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.minimum = def.length;
		bag.maximum = def.length;
		bag.length = def.length;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
	def.pattern = pattern;
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
//#endregion
//#region node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = []) {
		this.content = [];
		this.indent = 0;
		if (this) this.args = args;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const args = this?.args;
		const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
		return new F(...args, lines.join("\n"));
	}
};
//#endregion
//#region node_modules/zod/v4/core/versions.js
var version = {
	major: 4,
	minor: 4,
	patch: 3
};
//#endregion
//#region node_modules/zod/v4/core/schemas.js
var $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const checks = [...inst._zod.def.checks ?? []];
	if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
	defineLazy(inst, "~standard", () => ({
		validate: (value) => {
			try {
				const r = safeParse$1(inst, value);
				return r.success ? { value: r.data } : { issues: r.error?.issues };
			} catch (_) {
				return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
});
var $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$2(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
var $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
var $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
var $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
var $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email$1);
	$ZodStringFormat.init(inst, def);
});
var $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			if (!def.normalize && def.protocol?.source === httpProtocol.source) {
				if (!/^https?:\/\//i.test(trimmed)) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid URL format",
						input: payload.value,
						inst,
						continue: !def.abort
					});
					return;
				}
			}
			const url = new URL(trimmed);
			if (def.hostname) {
				def.hostname.lastIndex = 0;
				if (!def.hostname.test(url.hostname)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid hostname",
					pattern: def.hostname.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.protocol) {
				def.protocol.lastIndex = 0;
				if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid protocol",
					pattern: def.protocol.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.normalize) payload.value = url.href;
			else payload.value = trimmed;
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
var $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
	def.pattern ?? (def.pattern = nanoid);
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
var $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
var $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime$1(def));
	$ZodStringFormat.init(inst, def);
});
var $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date$2);
	$ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time$1(def));
	$ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration$1);
	$ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4$1);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6$1);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv6`;
	inst._zod.check = (payload) => {
		try {
			new URL(`http://[${payload.value}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
var $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		const parts = payload.value.split("/");
		try {
			if (parts.length !== 2) throw new Error();
			const [address, prefix] = parts;
			if (!prefix) throw new Error();
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) throw new Error();
			if (prefixNum < 0 || prefixNum > 128) throw new Error();
			new URL(`http://[${address}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
var $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64";
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
var $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64url);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64url";
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
var $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
var $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
var $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$2;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
var $ZodAny = /*@__PURE__*/ $constructor("$ZodAny", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
var $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
var $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
var $ZodDate = /*@__PURE__*/ $constructor("$ZodDate", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = new Date(payload.value);
		} catch (_err) {}
		const input = payload.value;
		const isDate = input instanceof Date;
		if (isDate && !Number.isNaN(input.getTime())) return payload;
		payload.issues.push({
			expected: "date",
			code: "invalid_type",
			input,
			...isDate ? { received: "Invalid Date" } : {},
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
var $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
	const isPresent = key in input;
	if (result.issues.length) {
		if (isOptionalIn && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && !isOptionalIn) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalIn = _catchall.optin === "optional";
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (key === "__proto__") continue;
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
var $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
		const sh = def.shape;
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazy(inst._zod, "propValues", () => {
		const shape = def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
			}
		}
		return propValues;
	});
	const isObject$2 = isObject;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.keys) {
			const el = shape[key];
			const isOptionalIn = el._zod.optin === "optional";
			const isOptionalOut = el._zod.optout === "optional";
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
var $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const generateFastpass = (shape) => {
		const doc = new Doc([
			"shape",
			"payload",
			"ctx"
		]);
		const normalized = _normalized.value;
		const parseStr = (key) => {
			const k = esc(key);
			return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		};
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.keys) ids[key] = `key_${counter++}`;
		doc.write(`const newResult = {};`);
		for (const key of normalized.keys) {
			const id = ids[key];
			const k = esc(key);
			const schema = shape[key];
			const isOptionalIn = schema?._zod?.optin === "optional";
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(key)};`);
			if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		const fn = doc.compile();
		return (payload, ctx) => fn(shape, payload, ctx);
	};
	let fastpass;
	const isObject$3 = isObject;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$3(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
var $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "values", () => {
		if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazy(inst._zod, "pattern", () => {
		if (def.options.every((o) => o._zod.pattern)) {
			const patterns = def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
var $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
		unrecIssue ?? (unrecIssue = iss);
		for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).l = true;
		}
	} else result.issues.push(iss);
	for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
		if (!unrecKeys.has(k)) unrecKeys.set(k, {});
		unrecKeys.get(k).r = true;
	}
	else result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length && unrecIssue) result.issues.push({
		...unrecIssue,
		keys: bothKeys
	});
	if (aborted(result)) return result;
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	result.value = merged.data;
	return result;
}
var $ZodRecord = /*@__PURE__*/ $constructor("$ZodRecord", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isPlainObject(input)) {
			payload.issues.push({
				expected: "record",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		const proms = [];
		const values = def.keyType._zod.values;
		if (values) {
			payload.value = {};
			const recordKeys = /* @__PURE__ */ new Set();
			for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
				recordKeys.add(typeof key === "number" ? key.toString() : key);
				const keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
				if (keyResult.issues.length) {
					payload.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
						input: key,
						path: [key],
						inst
					});
					continue;
				}
				const outKey = keyResult.value;
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[outKey] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[outKey] = result.value;
				}
			}
			let unrecognized;
			for (const key in input) if (!recordKeys.has(key)) {
				unrecognized = unrecognized ?? [];
				unrecognized.push(key);
			}
			if (unrecognized && unrecognized.length > 0) payload.issues.push({
				code: "unrecognized_keys",
				input,
				inst,
				keys: unrecognized
			});
		} else {
			payload.value = {};
			for (const key of Reflect.ownKeys(input)) {
				if (key === "__proto__") continue;
				if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
				let keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
				if (typeof key === "string" && number$1.test(key) && keyResult.issues.length) {
					const retryResult = def.keyType._zod.run({
						value: Number(key),
						issues: []
					}, ctx);
					if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (retryResult.issues.length === 0) keyResult = retryResult;
				}
				if (keyResult.issues.length) {
					if (def.mode === "loose") payload.value[key] = input[key];
					else payload.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
						input: key,
						path: [key],
						inst
					});
					continue;
				}
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[keyResult.value] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[keyResult.value] = result.value;
				}
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
var $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
var $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
	const values = new Set(def.values);
	inst._zod.values = values;
	inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
var $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			payload.fallback = true;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		payload.fallback = true;
		return payload;
	};
});
function handleOptionalResult(result, input) {
	if (input === void 0 && (result.issues.length || result.fallback)) return {
		issues: [],
		value: void 0
	};
	return result;
}
var $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.optout = "optional";
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (def.innerType._zod.optin === "optional") {
			const input = payload.value;
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
			return handleOptionalResult(result, input);
		}
		if (payload.value === void 0) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
var $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => {
		const v = def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
var $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => {
			payload.value = result.value;
			if (result.issues.length) {
				payload.value = def.catchValue({
					...payload,
					error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
					input: payload.value
				});
				payload.issues = [];
				payload.fallback = true;
			}
			return payload;
		});
		payload.value = result.value;
		if (result.issues.length) {
			payload.value = def.catchValue({
				...payload,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			payload.issues = [];
			payload.fallback = true;
		}
		return payload;
	};
});
var $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => def.in._zod.values);
	defineLazy(inst._zod, "optin", () => def.in._zod.optin);
	defineLazy(inst._zod, "optout", () => def.out._zod.optout);
	defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues,
		fallback: left.fallback
	}, ctx);
}
var $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
	defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	payload.value = Object.freeze(payload.value);
	return payload;
}
var $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
//#endregion
//#region node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _coercedString(Class, params) {
	return new Class({
		type: "string",
		coerce: true,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _coercedBoolean(Class, params) {
	return new Class({
		type: "boolean",
		coerce: true,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _any(Class) {
	return new Class({ type: "any" });
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _date(Class, params) {
	return new Class({
		type: "date",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		external: params?.external ?? void 0
	};
}
function process$1(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process$1(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) Object.assign(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
			};
		}
		if (entry[1] === root) return { ref: "#" };
		const defUriPrefix = `#/${defsSegment}/`;
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + defId
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else Object.assign(schema, refSchema);
			Object.assign(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	Object.assign(result, root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			defs[seen.defId] = seen.def;
		}
	}
	if (ctx.external) {} else if (Object.keys(defs).length > 0) {
		if (ctx.target === "draft-2020-12") result.$defs = defs;
		else result.definitions = defs;
	}
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	process$1(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	process$1(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
//#endregion
//#region node_modules/zod/v4/core/json-schema-processors.js
var formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
var stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time") delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const regexes = [...patterns];
		if (regexes.length === 1) json.pattern = regexes[0].source;
		else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
var numberProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
	if (typeof format === "string" && format.includes("int")) json.type = "integer";
	else json.type = "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) {
		if (legacy) {
			json.minimum = exclusiveMinimum;
			json.exclusiveMinimum = true;
		} else json.exclusiveMinimum = exclusiveMinimum;
	} else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) {
		if (legacy) {
			json.maximum = exclusiveMaximum;
			json.exclusiveMaximum = true;
		} else json.exclusiveMaximum = exclusiveMaximum;
	} else if (typeof maximum === "number") json.maximum = maximum;
	if (typeof multipleOf === "number") json.multipleOf = multipleOf;
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
var neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
var dateProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Date cannot be represented in JSON Schema");
};
var enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
var literalProcessor = (schema, ctx, json, _params) => {
	const def = schema._zod.def;
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
	} else if (typeof val === "bigint") {
		if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
		else vals.push(Number(val));
	} else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
var customProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = process$1(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
var objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	json.properties = {};
	const shape = def.shape;
	for (const key in shape) json.properties[key] = process$1(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	});
	const allKeys = new Set(Object.keys(shape));
	const requiredKeys = new Set([...allKeys].filter((key) => {
		const v = def.shape[key]._zod;
		if (ctx.io === "input") return v.optin === void 0;
		else return v.optout === void 0;
	}));
	if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = process$1(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
var unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => process$1(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
var intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = process$1(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = process$1(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
};
var recordProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	const keyType = def.keyType;
	const patterns = keyType._zod.bag?.patterns;
	if (def.mode === "loose" && patterns && patterns.size > 0) {
		const valueSchema = process$1(def.valueType, ctx, {
			...params,
			path: [
				...params.path,
				"patternProperties",
				"*"
			]
		});
		json.patternProperties = {};
		for (const pattern of patterns) json.patternProperties[pattern.source] = valueSchema;
	} else {
		if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") json.propertyNames = process$1(def.keyType, ctx, {
			...params,
			path: [...params.path, "propertyNames"]
		});
		json.additionalProperties = process$1(def.valueType, ctx, {
			...params,
			path: [...params.path, "additionalProperties"]
		});
	}
	const keyValues = keyType._zod.values;
	if (keyValues) {
		const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
		if (validKeyValues.length > 0) json.required = validKeyValues;
	}
};
var nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
var defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
var prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
var catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		throw new Error("Dynamic catch values are not supported in JSON Schema");
	}
	json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	process$1(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
//#endregion
//#region node_modules/zod/v4/classic/iso.js
var ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function datetime(params) {
	return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function date$1(params) {
	return /* @__PURE__ */ _isoDate(ZodISODate, params);
}
var ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function time(params) {
	return /* @__PURE__ */ _isoTime(ZodISOTime, params);
}
var ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function duration(params) {
	return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
}
//#endregion
//#region node_modules/zod/v4/classic/errors.js
var initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	Object.defineProperties(inst, {
		format: { value: (mapper) => formatError(inst, mapper) },
		flatten: { value: (mapper) => flattenError(inst, mapper) },
		addIssue: { value: (issue) => {
			inst.issues.push(issue);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		addIssues: { value: (issues) => {
			inst.issues.push(...issues);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		isEmpty: { get() {
			return inst.issues.length === 0;
		} }
	});
};
var ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
//#endregion
//#region node_modules/zod/v4/classic/parse.js
var parse = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
//#endregion
//#region node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
	const proto = Object.getPrototypeOf(inst);
	let installed = _installedGroups.get(proto);
	if (!installed) {
		installed = /* @__PURE__ */ new Set();
		_installedGroups.set(proto, installed);
	}
	if (installed.has(group)) return;
	installed.add(group);
	for (const key in methods) {
		const fn = methods[key];
		Object.defineProperty(proto, key, {
			configurable: true,
			enumerable: false,
			get() {
				const bound = fn.bind(this);
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: bound
				});
				return bound;
			},
			set(v) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: v
				});
			}
		});
	}
}
var ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
	$ZodType.init(inst, def);
	Object.assign(inst["~standard"], { jsonSchema: {
		input: createStandardJSONSchemaMethod(inst, "input"),
		output: createStandardJSONSchemaMethod(inst, "output")
	} });
	inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
	inst.def = def;
	inst.type = def.type;
	Object.defineProperty(inst, "_def", { value: def });
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	inst.spa = inst.safeParseAsync;
	inst.encode = (data, params) => encode(inst, data, params);
	inst.decode = (data, params) => decode(inst, data, params);
	inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
	inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
	inst.safeEncode = (data, params) => safeEncode(inst, data, params);
	inst.safeDecode = (data, params) => safeDecode(inst, data, params);
	inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
	inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
	_installLazyMethods(inst, "ZodType", {
		check(...chks) {
			const def = this.def;
			return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)] }), { parent: true });
		},
		with(...chks) {
			return this.check(...chks);
		},
		clone(def, params) {
			return clone(this, def, params);
		},
		brand() {
			return this;
		},
		register(reg, meta) {
			reg.add(this, meta);
			return this;
		},
		refine(check, params) {
			return this.check(refine(check, params));
		},
		superRefine(refinement, params) {
			return this.check(superRefine(refinement, params));
		},
		overwrite(fn) {
			return this.check(/* @__PURE__ */ _overwrite(fn));
		},
		optional() {
			return optional(this);
		},
		exactOptional() {
			return exactOptional(this);
		},
		nullable() {
			return nullable(this);
		},
		nullish() {
			return optional(nullable(this));
		},
		nonoptional(params) {
			return nonoptional(this, params);
		},
		array() {
			return array(this);
		},
		or(arg) {
			return union([this, arg]);
		},
		and(arg) {
			return intersection(this, arg);
		},
		transform(tx) {
			return pipe(this, transform(tx));
		},
		default(d) {
			return _default(this, d);
		},
		prefault(d) {
			return prefault(this, d);
		},
		catch(params) {
			return _catch(this, params);
		},
		pipe(target) {
			return pipe(this, target);
		},
		readonly() {
			return readonly(this);
		},
		describe(description) {
			const cl = this.clone();
			globalRegistry.add(cl, { description });
			return cl;
		},
		meta(...args) {
			if (args.length === 0) return globalRegistry.get(this);
			const cl = this.clone();
			globalRegistry.add(cl, args[0]);
			return cl;
		},
		isOptional() {
			return this.safeParse(void 0).success;
		},
		isNullable() {
			return this.safeParse(null).success;
		},
		apply(fn) {
			return fn(this);
		}
	});
	Object.defineProperty(inst, "description", {
		get() {
			return globalRegistry.get(inst)?.description;
		},
		configurable: true
	});
	return inst;
});
/** @internal */
var _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
	const bag = inst._zod.bag;
	inst.format = bag.format ?? null;
	inst.minLength = bag.minimum ?? null;
	inst.maxLength = bag.maximum ?? null;
	_installLazyMethods(inst, "_ZodString", {
		regex(...args) {
			return this.check(/* @__PURE__ */ _regex(...args));
		},
		includes(...args) {
			return this.check(/* @__PURE__ */ _includes(...args));
		},
		startsWith(...args) {
			return this.check(/* @__PURE__ */ _startsWith(...args));
		},
		endsWith(...args) {
			return this.check(/* @__PURE__ */ _endsWith(...args));
		},
		min(...args) {
			return this.check(/* @__PURE__ */ _minLength(...args));
		},
		max(...args) {
			return this.check(/* @__PURE__ */ _maxLength(...args));
		},
		length(...args) {
			return this.check(/* @__PURE__ */ _length(...args));
		},
		nonempty(...args) {
			return this.check(/* @__PURE__ */ _minLength(1, ...args));
		},
		lowercase(params) {
			return this.check(/* @__PURE__ */ _lowercase(params));
		},
		uppercase(params) {
			return this.check(/* @__PURE__ */ _uppercase(params));
		},
		trim() {
			return this.check(/* @__PURE__ */ _trim());
		},
		normalize(...args) {
			return this.check(/* @__PURE__ */ _normalize(...args));
		},
		toLowerCase() {
			return this.check(/* @__PURE__ */ _toLowerCase());
		},
		toUpperCase() {
			return this.check(/* @__PURE__ */ _toUpperCase());
		},
		slugify() {
			return this.check(/* @__PURE__ */ _slugify());
		}
	});
});
var ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
	inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
	inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
	inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
	inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
	inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
	inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
	inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
	inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
	inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
	inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
	inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
	inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
	inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
	inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
	inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
	inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
	inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
	inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
	inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
	inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
	inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
	inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
	inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
	inst.datetime = (params) => inst.check(datetime(params));
	inst.date = (params) => inst.check(date$1(params));
	inst.time = (params) => inst.check(time(params));
	inst.duration = (params) => inst.check(duration(params));
});
function string$1(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
var ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
var ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function email(params) {
	return /* @__PURE__ */ _email(ZodEmail, params);
}
var ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function ipv4(params) {
	return /* @__PURE__ */ _ipv4(ZodIPv4, params);
}
var ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function ipv6(params) {
	return /* @__PURE__ */ _ipv6(ZodIPv6, params);
}
var ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	_installLazyMethods(inst, "ZodNumber", {
		gt(value, params) {
			return this.check(/* @__PURE__ */ _gt(value, params));
		},
		gte(value, params) {
			return this.check(/* @__PURE__ */ _gte(value, params));
		},
		min(value, params) {
			return this.check(/* @__PURE__ */ _gte(value, params));
		},
		lt(value, params) {
			return this.check(/* @__PURE__ */ _lt(value, params));
		},
		lte(value, params) {
			return this.check(/* @__PURE__ */ _lte(value, params));
		},
		max(value, params) {
			return this.check(/* @__PURE__ */ _lte(value, params));
		},
		int(params) {
			return this.check(int(params));
		},
		safe(params) {
			return this.check(int(params));
		},
		positive(params) {
			return this.check(/* @__PURE__ */ _gt(0, params));
		},
		nonnegative(params) {
			return this.check(/* @__PURE__ */ _gte(0, params));
		},
		negative(params) {
			return this.check(/* @__PURE__ */ _lt(0, params));
		},
		nonpositive(params) {
			return this.check(/* @__PURE__ */ _lte(0, params));
		},
		multipleOf(value, params) {
			return this.check(/* @__PURE__ */ _multipleOf(value, params));
		},
		step(value, params) {
			return this.check(/* @__PURE__ */ _multipleOf(value, params));
		},
		finite() {
			return this;
		}
	});
	const bag = inst._zod.bag;
	inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
	inst.isFinite = true;
	inst.format = bag.format ?? null;
});
function number(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
var ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
var ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean$1(params) {
	return /* @__PURE__ */ _boolean(ZodBoolean, params);
}
var ZodAny = /*@__PURE__*/ $constructor("ZodAny", (inst, def) => {
	$ZodAny.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function any() {
	return /* @__PURE__ */ _any(ZodAny);
}
var ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
var ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
var ZodDate = /*@__PURE__*/ $constructor("ZodDate", (inst, def) => {
	$ZodDate.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => dateProcessor(inst, ctx, json, params);
	inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
	inst.max = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
	const c = inst._zod.bag;
	inst.minDate = c.minimum ? new Date(c.minimum) : null;
	inst.maxDate = c.maximum ? new Date(c.maximum) : null;
});
function date(params) {
	return /* @__PURE__ */ _date(ZodDate, params);
}
var ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
	_installLazyMethods(inst, "ZodArray", {
		min(n, params) {
			return this.check(/* @__PURE__ */ _minLength(n, params));
		},
		nonempty(params) {
			return this.check(/* @__PURE__ */ _minLength(1, params));
		},
		max(n, params) {
			return this.check(/* @__PURE__ */ _maxLength(n, params));
		},
		length(n, params) {
			return this.check(/* @__PURE__ */ _length(n, params));
		},
		unwrap() {
			return this.element;
		}
	});
});
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
var ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	defineLazy(inst, "shape", () => {
		return def.shape;
	});
	_installLazyMethods(inst, "ZodObject", {
		keyof() {
			return _enum(Object.keys(this._zod.def.shape));
		},
		catchall(catchall) {
			return this.clone({
				...this._zod.def,
				catchall
			});
		},
		passthrough() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		loose() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		strict() {
			return this.clone({
				...this._zod.def,
				catchall: never()
			});
		},
		strip() {
			return this.clone({
				...this._zod.def,
				catchall: void 0
			});
		},
		extend(incoming) {
			return extend(this, incoming);
		},
		safeExtend(incoming) {
			return safeExtend(this, incoming);
		},
		merge(other) {
			return merge(this, other);
		},
		pick(mask) {
			return pick(this, mask);
		},
		omit(mask) {
			return omit(this, mask);
		},
		partial(...args) {
			return partial(ZodOptional, this, args[0]);
		},
		required(...args) {
			return required(ZodNonOptional, this, args[0]);
		}
	});
});
function object(shape, params) {
	return new ZodObject({
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	});
}
function strictObject(shape, params) {
	return new ZodObject({
		type: "object",
		shape,
		catchall: never(),
		...normalizeParams(params)
	});
}
function looseObject(shape, params) {
	return new ZodObject({
		type: "object",
		shape,
		catchall: unknown(),
		...normalizeParams(params)
	});
}
var ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
var ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
var ZodRecord = /*@__PURE__*/ $constructor("ZodRecord", (inst, def) => {
	$ZodRecord.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
	inst.keyType = def.keyType;
	inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
	if (!valueType || !valueType._zod) return new ZodRecord({
		type: "record",
		keyType: string$1(),
		valueType: keyType,
		...normalizeParams(valueType)
	});
	return new ZodRecord({
		type: "record",
		keyType,
		valueType,
		...normalizeParams(params)
	});
}
var ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = Object.values(def.entries);
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	return new ZodEnum({
		type: "enum",
		entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
		...normalizeParams(params)
	});
}
var ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
var ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			payload.fallback = true;
			return payload;
		});
		payload.value = output;
		payload.fallback = true;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
var ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
var ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
var ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
var ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
var ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
var ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
var ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
var ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
var ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
var ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return /* @__PURE__ */ _superRefine(fn, params);
}
//#endregion
//#region node_modules/zod/v4/classic/coerce.js
function string(params) {
	return /* @__PURE__ */ _coercedString(ZodString, params);
}
function boolean(params) {
	return /* @__PURE__ */ _coercedBoolean(ZodBoolean, params);
}
//#endregion
//#region node_modules/@better-auth/core/dist/db/schema/shared.mjs
var coreSchema = object({
	id: string$1(),
	createdAt: date().default(() => /* @__PURE__ */ new Date()),
	updatedAt: date().default(() => /* @__PURE__ */ new Date())
});
coreSchema.extend({
	providerId: string$1(),
	issuer: string$1(),
	accountId: string$1(),
	userId: string(),
	accessToken: string$1().nullish(),
	refreshToken: string$1().nullish(),
	idToken: string$1().nullish(),
	/**
	* Access token expires at
	*/
	accessTokenExpiresAt: date().nullish(),
	/**
	* Refresh token expires at
	*/
	refreshTokenExpiresAt: date().nullish(),
	/**
	* The set of OAuth scopes the user has granted to this account, stored
	* as a comma-separated list. Represents the accumulated grant rather
	* than the latest token's `scope` claim, since per RFC 6749 Section 1.5 a
	* token's scope may be narrower than the user's grant.
	*/
	scope: string$1().nullish(),
	/**
	* Password is only stored in the credential provider
	*/
	password: string$1().nullish()
});
function encodeAccountIssuerProviderId(providerId) {
	return encodeURIComponent(providerId);
}
/**
* Creates the synthetic issuer used by providers without an issuer of their own.
*/
function createLocalAccountIssuer(providerId) {
	return `local:${encodeAccountIssuerProviderId(providerId)}`;
}
/**
* Creates the synthetic issuer used by OAuth providers without an issuer of
* their own. OAuth identities use a distinct namespace so a provider ID
* cannot collide with an internal local authentication method.
*/
function createOAuthAccountIssuer(providerId) {
	return `local:oauth:${encodeAccountIssuerProviderId(providerId)}`;
}
//#endregion
//#region node_modules/@better-auth/core/dist/db/schema/session.mjs
var sessionSchema = coreSchema.extend({
	userId: string(),
	expiresAt: date(),
	token: string$1(),
	ipAddress: string$1().nullish(),
	userAgent: string$1().nullish()
});
//#endregion
//#region node_modules/@better-auth/core/dist/db/schema/user.mjs
var userSchema = coreSchema.extend({
	email: string$1().transform((val) => val.toLowerCase()),
	emailVerified: boolean$1().default(false),
	name: string$1(),
	image: string$1().nullish()
});
//#endregion
//#region node_modules/@better-auth/core/dist/utils/db.mjs
/**
* Filters output data by removing fields with the `returned: false` attribute.
* This ensures sensitive fields are not exposed in API responses.
*/
function filterOutputFields(data, additionalFields) {
	if (!data || !additionalFields) return data;
	const returnFiltered = Object.entries(additionalFields).filter(([, { returned }]) => returned === false).map(([key]) => key);
	return Object.entries(structuredClone(data)).filter(([key]) => !returnFiltered.includes(key)).reduce((acc, [key, value]) => ({
		...acc,
		[key]: value
	}), {});
}
//#endregion
//#region node_modules/@better-auth/core/dist/utils/json.mjs
var iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
function reviveDate(value) {
	if (typeof value === "string" && iso8601Regex.test(value)) {
		const date = new Date(value);
		if (!isNaN(date.getTime())) return date;
	}
	return value;
}
/**
* Recursively walk a pre-parsed object and convert ISO 8601 date strings
* to Date instances. This handles the case where a Redis client (or similar)
* returns already-parsed JSON objects whose date fields are still strings.
*/
function reviveDates(value) {
	if (value === null || value === void 0) return value;
	if (typeof value === "string") return reviveDate(value);
	if (value instanceof Date) return value;
	if (Array.isArray(value)) return value.map(reviveDates);
	if (typeof value === "object") {
		const result = {};
		for (const key of Object.keys(value)) result[key] = reviveDates(value[key]);
		return result;
	}
	return value;
}
function safeJSONParse(data) {
	try {
		if (typeof data !== "string") {
			if (data === null || data === void 0) return null;
			return reviveDates(data);
		}
		return JSON.parse(data, (_, value) => reviveDate(value));
	} catch (e) {
		logger.error("Error parsing JSON", { error: e });
		return null;
	}
}
//#endregion
//#region node_modules/better-call/node_modules/@better-auth/utils/dist/index.mjs
function getWebcryptoSubtle() {
	const cr = typeof globalThis !== "undefined" && globalThis.crypto;
	if (cr && typeof cr.subtle === "object" && cr.subtle != null) return cr.subtle;
	throw new Error("crypto.subtle must be defined");
}
//#endregion
//#region node_modules/better-call/dist/crypto.mjs
var algorithm = {
	name: "HMAC",
	hash: "SHA-256"
};
var getCryptoKey = async (secret) => {
	const secretBuf = typeof secret === "string" ? new TextEncoder().encode(secret) : secret;
	return await getWebcryptoSubtle().importKey("raw", secretBuf, algorithm, false, ["sign", "verify"]);
};
var verifySignature = async (base64Signature, value, secret) => {
	try {
		const signatureBinStr = atob(base64Signature);
		const signature = new Uint8Array(signatureBinStr.length);
		for (let i = 0, len = signatureBinStr.length; i < len; i++) signature[i] = signatureBinStr.charCodeAt(i);
		return await getWebcryptoSubtle().verify(algorithm, secret, signature, new TextEncoder().encode(value));
	} catch {
		return false;
	}
};
var makeSignature = async (value, secret) => {
	const key = await getCryptoKey(secret);
	const signature = await getWebcryptoSubtle().sign(algorithm.name, key, new TextEncoder().encode(value));
	return btoa(String.fromCharCode(...new Uint8Array(signature)));
};
var signCookieValue = async (value, secret) => {
	const signature = await makeSignature(value, secret);
	value = `${value}.${signature}`;
	value = encodeURIComponent(value);
	return value;
};
//#endregion
//#region node_modules/better-call/dist/utils.mjs
var jsonContentTypeRegex = /^application\/([a-z0-9.+-]*\+)?json/i;
async function getBody$1(request, allowedMediaTypes) {
	const contentType = request.headers.get("content-type") || "";
	const normalizedContentType = contentType.toLowerCase();
	if (!request.body) return;
	if (allowedMediaTypes && allowedMediaTypes.length > 0) {
		if (!allowedMediaTypes.some((allowed) => {
			const normalizedContentTypeBase = normalizedContentType.split(";")[0].trim();
			const normalizedAllowed = allowed.toLowerCase().trim();
			return normalizedContentTypeBase === normalizedAllowed || normalizedContentTypeBase.includes(normalizedAllowed);
		})) {
			if (!normalizedContentType) throw new APIError$1(415, {
				message: `Content-Type is required. Allowed types: ${allowedMediaTypes.join(", ")}`,
				code: "UNSUPPORTED_MEDIA_TYPE"
			});
			throw new APIError$1(415, {
				message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
				code: "UNSUPPORTED_MEDIA_TYPE"
			});
		}
	}
	if (jsonContentTypeRegex.test(normalizedContentType)) try {
		return await request.json();
	} catch (e) {
		if (e instanceof SyntaxError) throw new APIError$1(400, {
			message: "Invalid JSON in request body",
			code: "BAD_REQUEST"
		});
		throw e;
	}
	if (normalizedContentType.includes("application/x-www-form-urlencoded")) {
		const formData = await request.formData();
		const result = {};
		formData.forEach((value, key) => {
			result[key] = value.toString();
		});
		return result;
	}
	if (normalizedContentType.includes("multipart/form-data")) {
		const formData = await request.formData();
		const result = {};
		formData.forEach((value, key) => {
			result[key] = value;
		});
		return result;
	}
	if (normalizedContentType.includes("text/plain")) return await request.text();
	if (normalizedContentType.includes("application/octet-stream")) return await request.arrayBuffer();
	if (normalizedContentType.includes("application/pdf") || normalizedContentType.includes("image/") || normalizedContentType.includes("video/")) return await request.blob();
	if (normalizedContentType.includes("application/stream") || request.body instanceof ReadableStream) return request.body;
	return await request.text();
}
function isAPIError$1(error) {
	return error instanceof APIError$1 || error?.name === "APIError";
}
function tryDecode(str) {
	try {
		return str.includes("%") ? decodeURIComponent(str) : str;
	} catch {
		return str;
	}
}
async function tryCatch(promise) {
	try {
		return {
			data: await promise,
			error: null
		};
	} catch (error) {
		return {
			data: null,
			error
		};
	}
}
/**
* Check if an object is a `Request`
* - `instanceof`: works for native Request instances
* - `toString`: handles where instanceof check fails but the object is still a valid Request
*/
function isRequest(obj) {
	return obj instanceof Request || Object.prototype.toString.call(obj) === "[object Request]";
}
//#endregion
//#region node_modules/better-call/dist/cookies.mjs
var getCookieKey = (key, prefix) => {
	let finalKey = key;
	if (prefix) if (prefix === "secure") finalKey = "__Secure-" + key;
	else if (prefix === "host") finalKey = "__Host-" + key;
	else return;
	return finalKey;
};
/**
* Parse an HTTP Cookie header string and returning an object of all cookie
* name-value pairs.
*
* Inspired by https://github.com/unjs/cookie-es/blob/main/src/cookie/parse.ts
*
* @param str the string representing a `Cookie` header value
*/
function parseCookies(str) {
	if (typeof str !== "string") throw new TypeError("argument str must be a string");
	const cookies = /* @__PURE__ */ new Map();
	let index = 0;
	while (index < str.length) {
		const eqIdx = str.indexOf("=", index);
		if (eqIdx === -1) break;
		let endIdx = str.indexOf(";", index);
		if (endIdx === -1) endIdx = str.length;
		else if (endIdx < eqIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = str.slice(index, eqIdx).trim();
		if (!cookies.has(key)) {
			let val = str.slice(eqIdx + 1, endIdx).trim();
			if (val.codePointAt(0) === 34) val = val.slice(1, -1);
			cookies.set(key, tryDecode(val));
		}
		index = endIdx + 1;
	}
	return cookies;
}
var _serialize = (key, value, opt = {}) => {
	let cookie;
	if (opt?.prefix === "secure") cookie = `${`__Secure-${key}`}=${value}`;
	else if (opt?.prefix === "host") cookie = `${`__Host-${key}`}=${value}`;
	else cookie = `${key}=${value}`;
	if (key.startsWith("__Secure-") && !opt.secure) opt.secure = true;
	if (key.startsWith("__Host-")) {
		if (!opt.secure) opt.secure = true;
		if (opt.path !== "/") opt.path = "/";
		if (opt.domain) opt.domain = void 0;
	}
	if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
		if (opt.maxAge > 3456e4) throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
		cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
	}
	if (opt.domain && opt.prefix !== "host") cookie += `; Domain=${opt.domain}`;
	if (opt.path) cookie += `; Path=${opt.path}`;
	if (opt.expires) {
		if (opt.expires.getTime() - Date.now() > 3456e7) throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
		cookie += `; Expires=${opt.expires.toUTCString()}`;
	}
	if (opt.httpOnly) cookie += "; HttpOnly";
	if (opt.secure) cookie += "; Secure";
	if (opt.sameSite) cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
	if (opt.partitioned) {
		if (!opt.secure) opt.secure = true;
		cookie += "; Partitioned";
	}
	return cookie;
};
var serializeCookie = (key, value, opt) => {
	value = encodeURIComponent(value);
	return _serialize(key, value, opt);
};
var serializeSignedCookie = async (key, value, secret, opt) => {
	value = await signCookieValue(value, secret);
	return _serialize(key, value, opt);
};
//#endregion
//#region node_modules/better-call/dist/validator.mjs
/**
* Runs validation on body and query
* @returns error and data object
*/
async function runValidation(options, context = {}) {
	const request = {
		body: context.body,
		query: context.query
	};
	if (options.body) {
		const result = await options.body["~standard"].validate(context.body);
		if (result.issues) return {
			data: null,
			error: fromError(result.issues, "body")
		};
		request.body = result.value;
	}
	if (options.query) {
		const result = await options.query["~standard"].validate(context.query);
		if (result.issues) return {
			data: null,
			error: fromError(result.issues, "query")
		};
		request.query = result.value;
	}
	if (options.requireHeaders && !context.headers) return {
		data: null,
		error: {
			message: "Headers is required",
			issues: []
		}
	};
	if (options.requireRequest && !context.request) return {
		data: null,
		error: {
			message: "Request is required",
			issues: []
		}
	};
	return {
		data: request,
		error: null
	};
}
function fromError(error, validating) {
	return {
		message: error.map((e) => {
			return `[${e.path?.length ? `${validating}.` + e.path.map((x) => typeof x === "object" ? x.key : x).join(".") : validating}] ${e.message}`;
		}).join("; "),
		issues: error
	};
}
//#endregion
//#region node_modules/better-call/dist/context.mjs
var createInternalContext = async (context, { options, path }) => {
	const headers = new Headers();
	let responseStatus = void 0;
	const { data, error } = await runValidation(options, context);
	if (error) throw new ValidationError$1(error.message, error.issues);
	const requestHeaders = "headers" in context ? context.headers instanceof Headers ? context.headers : new Headers(context.headers) : "request" in context && isRequest(context.request) ? context.request.headers : null;
	const requestCookies = requestHeaders?.get("cookie");
	const parsedCookies = requestCookies ? parseCookies(requestCookies) : void 0;
	const internalContext = {
		...context,
		body: data.body,
		query: data.query,
		path: context.path || path || "virtual:",
		context: "context" in context && context.context ? context.context : {},
		returned: void 0,
		headers: context?.headers,
		request: context?.request,
		params: "params" in context ? context.params : void 0,
		method: context.method ?? (Array.isArray(options.method) ? options.method[0] : options.method === "*" ? "GET" : options.method),
		setHeader: (key, value) => {
			headers.set(key, value);
		},
		getHeader: (key) => {
			if (!requestHeaders) return null;
			return requestHeaders.get(key);
		},
		getCookie: (key, prefix) => {
			const finalKey = getCookieKey(key, prefix);
			if (!finalKey) return null;
			return parsedCookies?.get(finalKey) || null;
		},
		getSignedCookie: async (key, secret, prefix) => {
			const finalKey = getCookieKey(key, prefix);
			if (!finalKey) return null;
			const value = parsedCookies?.get(finalKey);
			if (!value) return null;
			const signatureStartPos = value.lastIndexOf(".");
			if (signatureStartPos < 1) return null;
			const signedValue = value.substring(0, signatureStartPos);
			const signature = value.substring(signatureStartPos + 1);
			if (signature.length !== 44 || !signature.endsWith("=")) return null;
			return await verifySignature(signature, signedValue, await getCryptoKey(secret)) ? signedValue : false;
		},
		setCookie: (key, value, options) => {
			const cookie = serializeCookie(key, value, options);
			headers.append("set-cookie", cookie);
			return cookie;
		},
		setSignedCookie: async (key, value, secret, options) => {
			const cookie = await serializeSignedCookie(key, value, secret, options);
			headers.append("set-cookie", cookie);
			return cookie;
		},
		redirect: (url) => {
			headers.set("location", url);
			return new APIError$1("FOUND", void 0, headers);
		},
		error: (status, body, headers) => {
			return new APIError$1(status, body, headers);
		},
		setStatus: (status) => {
			responseStatus = status;
		},
		json: (json, routerResponse) => {
			if (!context.asResponse) return json;
			return {
				body: routerResponse?.body || json,
				routerResponse,
				_flag: "json"
			};
		},
		responseHeaders: headers,
		get responseStatus() {
			return responseStatus;
		}
	};
	for (const middleware of options.use || []) {
		const response = await middleware({
			...internalContext,
			returnHeaders: true,
			asResponse: false
		});
		if (response.response) Object.assign(internalContext.context, response.response);
		/**
		* Apply headers from the middleware to the endpoint headers
		*/
		if (response.headers) response.headers.forEach((value, key) => {
			internalContext.responseHeaders.set(key, value);
		});
	}
	return internalContext;
};
//#endregion
//#region node_modules/better-call/dist/to-response.mjs
function isJSONSerializable$1(value) {
	if (value === void 0) return false;
	const t = typeof value;
	if (t === "string" || t === "number" || t === "boolean" || t === null) return true;
	if (t !== "object") return false;
	if (Array.isArray(value)) return true;
	if (value.buffer) return false;
	return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
function safeStringify(obj) {
	const parents = /* @__PURE__ */ new WeakMap();
	const ids = /* @__PURE__ */ new WeakMap();
	let id = 0;
	const isAncestor = (value, holder) => {
		let curr = holder;
		while (curr) {
			if (curr === value) return true;
			curr = parents.get(curr);
		}
		return false;
	};
	return JSON.stringify(obj, function(_key, value) {
		if (typeof value === "bigint") return value.toString();
		if (typeof value === "object" && value !== null) {
			if (isAncestor(value, this)) return `[Circular ref-${ids.get(value)}]`;
			parents.set(value, this);
			if (!ids.has(value)) ids.set(value, id++);
		}
		return value;
	});
}
function isJSONResponse(value) {
	if (!value || typeof value !== "object") return false;
	return "_flag" in value && value._flag === "json";
}
/**
* Headers that MUST be stripped when building an HTTP response from
* arbitrary header input. These are request-only, hop-by-hop, or
* transport-managed headers that cause protocol violations when present
* on responses (e.g. Content-Length mismatch → net::ERR_CONTENT_LENGTH_MISMATCH).
*
* Sources:
*   - RFC 9110 §10.1   (Request Context Fields)
*   - RFC 9110 §7.6.1  (Connection / hop-by-hop)
*   - RFC 9110 §11.6-7 (Authentication credentials)
*   - RFC 9110 §12.5   (Content negotiation)
*   - RFC 9110 §13.1   (Conditional request headers)
*   - RFC 9110 §14.2   (Range requests)
*   - RFC 6265 §5.4    (Cookie)
*   - RFC 6454         (Origin)
*/
var REQUEST_ONLY_HEADERS = /* @__PURE__ */ new Set([
	"host",
	"user-agent",
	"referer",
	"from",
	"expect",
	"authorization",
	"proxy-authorization",
	"cookie",
	"origin",
	"accept-charset",
	"accept-encoding",
	"accept-language",
	"if-match",
	"if-none-match",
	"if-modified-since",
	"if-unmodified-since",
	"if-range",
	"range",
	"max-forwards",
	"connection",
	"keep-alive",
	"transfer-encoding",
	"te",
	"upgrade",
	"trailer",
	"proxy-connection",
	"content-length"
]);
function stripRequestOnlyHeaders(headers) {
	for (const name of REQUEST_ONLY_HEADERS) headers.delete(name);
}
/**
* Copy headers from `source` into `target`. `Set-Cookie` is appended (one
* header per cookie) because RFC 9110 §5.3 notes it cannot be combined
* into a single comma-separated value; other headers are set (replace).
*/
function copyHeaders(target, source) {
	if (!source) return;
	for (const [key, value] of new Headers(source).entries()) if (key.toLowerCase() === "set-cookie") target.append(key, value);
	else target.set(key, value);
}
function toResponse(data, init) {
	if (data instanceof Response) {
		if (init?.headers) {
			const safeHeaders = new Headers(init.headers);
			stripRequestOnlyHeaders(safeHeaders);
			copyHeaders(data.headers, safeHeaders);
		}
		return data;
	}
	if (isJSONResponse(data)) {
		const body = data.body;
		const routerResponse = data.routerResponse;
		if (routerResponse instanceof Response) return routerResponse;
		const headers = new Headers();
		copyHeaders(headers, routerResponse?.headers);
		copyHeaders(headers, data.headers);
		if (init?.headers) {
			const safeHeaders = new Headers(init.headers);
			stripRequestOnlyHeaders(safeHeaders);
			copyHeaders(headers, safeHeaders);
		}
		headers.set("Content-Type", "application/json");
		return new Response(JSON.stringify(body), {
			...routerResponse,
			headers,
			status: data.status ?? init?.status ?? routerResponse?.status,
			statusText: init?.statusText ?? routerResponse?.statusText
		});
	}
	if (isAPIError$1(data)) return toResponse(data.body, {
		status: init?.status ?? data.statusCode,
		statusText: data.status.toString(),
		headers: init?.headers || data.headers
	});
	let body = data;
	const headers = new Headers(init?.headers);
	stripRequestOnlyHeaders(headers);
	if (!data) {
		if (data === null) body = JSON.stringify(null);
		headers.set("content-type", "application/json");
	} else if (typeof data === "string") {
		body = data;
		headers.set("Content-Type", "text/plain");
	} else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
		body = data;
		headers.set("Content-Type", "application/octet-stream");
	} else if (data instanceof Blob) {
		body = data;
		headers.set("Content-Type", data.type || "application/octet-stream");
	} else if (data instanceof FormData) body = data;
	else if (data instanceof URLSearchParams) {
		body = data;
		headers.set("Content-Type", "application/x-www-form-urlencoded");
	} else if (data instanceof ReadableStream) {
		body = data;
		headers.set("Content-Type", "application/octet-stream");
	} else if (isJSONSerializable$1(data)) {
		body = safeStringify(data);
		headers.set("Content-Type", "application/json");
	}
	return new Response(body, {
		...init,
		headers
	});
}
//#endregion
//#region node_modules/better-call/dist/endpoint.mjs
function createEndpoint(pathOrOptions, handlerOrOptions, handlerOrNever) {
	const path = typeof pathOrOptions === "string" ? pathOrOptions : void 0;
	const options = typeof handlerOrOptions === "object" ? handlerOrOptions : pathOrOptions;
	const handler = typeof handlerOrOptions === "function" ? handlerOrOptions : handlerOrNever;
	if ((options.method === "GET" || options.method === "HEAD") && options.body) throw new BetterCallError("Body is not allowed with GET or HEAD methods");
	if (path && /\/{2,}/.test(path)) throw new BetterCallError("Path cannot contain consecutive slashes");
	const internalHandler = async (...inputCtx) => {
		const context = inputCtx[0] || {};
		const { data: internalContext, error: validationError } = await tryCatch(createInternalContext(context, {
			options,
			path
		}));
		if (validationError) {
			if (!(validationError instanceof ValidationError$1)) throw validationError;
			if (options.onValidationError) await options.onValidationError({
				message: validationError.message,
				issues: validationError.issues
			});
			throw new APIError$1(400, {
				message: validationError.message,
				code: "VALIDATION_ERROR"
			});
		}
		const response = await handler(internalContext).catch(async (e) => {
			if (isAPIError$1(e)) {
				const onAPIError = options.onAPIError;
				if (onAPIError) await onAPIError(e);
				if (context.asResponse) return e;
			}
			throw e;
		});
		const headers = internalContext.responseHeaders;
		const status = internalContext.responseStatus;
		return context.asResponse ? toResponse(response, {
			headers,
			status
		}) : context.returnHeaders ? context.returnStatus ? {
			headers,
			response,
			status
		} : {
			headers,
			response
		} : context.returnStatus ? {
			response,
			status
		} : response;
	};
	internalHandler.options = options;
	internalHandler.path = path;
	return internalHandler;
}
function combineMiddleware(local, configured) {
	return [...local ?? [], ...configured ?? []];
}
createEndpoint.create = (opts) => {
	function createConfiguredEndpoint(...args) {
		if (args.length === 3) {
			const [path, options, handler] = args;
			return createEndpoint(path, {
				...options,
				use: combineMiddleware(options.use, opts?.use)
			}, handler);
		}
		const [options, handler] = args;
		return createEndpoint({
			...options,
			use: combineMiddleware(options.use, opts?.use)
		}, handler);
	}
	return createConfiguredEndpoint;
};
//#endregion
//#region node_modules/better-call/dist/middleware.mjs
function createMiddleware(optionsOrHandler, handler) {
	const internalHandler = async (inputCtx) => {
		const context = inputCtx;
		const _handler = typeof optionsOrHandler === "function" ? optionsOrHandler : handler;
		const internalContext = await createInternalContext(context, {
			options: typeof optionsOrHandler === "function" ? {} : optionsOrHandler,
			path: "/"
		});
		if (!_handler) throw new Error("handler must be defined");
		try {
			const response = await _handler(internalContext);
			const headers = internalContext.responseHeaders;
			return context.returnHeaders ? {
				headers,
				response
			} : response;
		} catch (e) {
			if (isAPIError$1(e)) Object.defineProperty(e, kAPIErrorHeaderSymbol, {
				enumerable: false,
				configurable: true,
				get() {
					return internalContext.responseHeaders;
				}
			});
			throw e;
		}
	};
	internalHandler.options = typeof optionsOrHandler === "function" ? {} : optionsOrHandler;
	return internalHandler;
}
createMiddleware.create = (opts) => {
	function fn(optionsOrHandler, handler) {
		if (typeof optionsOrHandler === "function") return createMiddleware({ use: opts?.use }, optionsOrHandler);
		if (!handler) throw new Error("Middleware handler is required");
		return createMiddleware({
			...optionsOrHandler,
			method: "*",
			use: [...opts?.use || [], ...optionsOrHandler.use || []]
		}, handler);
	}
	return fn;
};
//#endregion
//#region node_modules/better-call/dist/openapi.mjs
var paths = {};
function getTypeFromZodType(zodType) {
	switch (zodType.constructor.name) {
		case "ZodString": return "string";
		case "ZodNumber": return "number";
		case "ZodBoolean": return "boolean";
		case "ZodObject": return "object";
		case "ZodArray": return "array";
		default: return "string";
	}
}
function getParameters(options) {
	const parameters = [];
	if (options.metadata?.openapi?.parameters) {
		parameters.push(...options.metadata.openapi.parameters);
		return parameters;
	}
	if (options.query instanceof ZodObject) Object.entries(options.query.shape).forEach(([key, value]) => {
		if (value instanceof ZodObject) parameters.push({
			name: key,
			in: "query",
			schema: {
				type: getTypeFromZodType(value),
				..."minLength" in value && value.minLength ? { minLength: value.minLength } : {},
				description: value.description
			}
		});
	});
	return parameters;
}
function getRequestBody(options) {
	if (options.metadata?.openapi?.requestBody) return options.metadata.openapi.requestBody;
	if (!options.body) return void 0;
	if (options.body instanceof ZodObject || options.body instanceof ZodOptional) {
		const shape = options.body.shape;
		if (!shape) return void 0;
		const properties = {};
		const required = [];
		Object.entries(shape).forEach(([key, value]) => {
			if (value instanceof ZodObject) {
				properties[key] = {
					type: getTypeFromZodType(value),
					description: value.description
				};
				if (!(value instanceof ZodOptional)) required.push(key);
			}
		});
		return {
			required: options.body instanceof ZodOptional ? false : options.body ? true : false,
			content: { "application/json": { schema: {
				type: "object",
				properties,
				required
			} } }
		};
	}
}
function getResponse(responses) {
	return {
		"400": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } },
				required: ["message"]
			} } },
			description: "Bad Request. Usually due to missing parameters, or invalid parameters."
		},
		"401": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } },
				required: ["message"]
			} } },
			description: "Unauthorized. Due to missing or invalid authentication."
		},
		"403": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } }
			} } },
			description: "Forbidden. You do not have permission to access this resource or to perform this action."
		},
		"404": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } }
			} } },
			description: "Not Found. The requested resource was not found."
		},
		"429": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } }
			} } },
			description: "Too Many Requests. You have exceeded the rate limit. Try again later."
		},
		"500": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } }
			} } },
			description: "Internal Server Error. This is a problem with the server that you cannot fix."
		},
		...responses
	};
}
async function generator(endpoints, config) {
	const components = { schemas: {} };
	Object.entries(endpoints).forEach(([_, value]) => {
		const options = value.options;
		if (!value.path || options.metadata?.SERVER_ONLY) return;
		if (options.method === "GET") paths[value.path] = { get: {
			tags: ["Default", ...options.metadata?.openapi?.tags || []],
			description: options.metadata?.openapi?.description,
			operationId: options.metadata?.openapi?.operationId,
			security: [{ bearerAuth: [] }],
			parameters: getParameters(options),
			responses: getResponse(options.metadata?.openapi?.responses)
		} };
		if (options.method === "POST") {
			const body = getRequestBody(options);
			paths[value.path] = { post: {
				tags: ["Default", ...options.metadata?.openapi?.tags || []],
				description: options.metadata?.openapi?.description,
				operationId: options.metadata?.openapi?.operationId,
				security: [{ bearerAuth: [] }],
				parameters: getParameters(options),
				...body ? { requestBody: body } : { requestBody: { content: { "application/json": { schema: {
					type: "object",
					properties: {}
				} } } } },
				responses: getResponse(options.metadata?.openapi?.responses)
			} };
		}
	});
	return {
		openapi: "3.1.1",
		info: {
			title: "Better Auth",
			description: "API Reference for your Better Auth Instance",
			version: "1.1.0"
		},
		components,
		security: [{ apiKeyCookie: [] }],
		servers: [{ url: config?.url }],
		tags: [{
			name: "Default",
			description: "Default endpoints that are included with Better Auth by default. These endpoints are not part of any plugin."
		}],
		paths
	};
}
var getHTML = (apiReference, config) => `<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      type="application/json">
    ${JSON.stringify(apiReference)}
    <\/script>
	 <script>
      var configuration = {
	  	favicon: ${config?.logo ? `data:image/svg+xml;utf8,${encodeURIComponent(config.logo)}` : void 0} ,
	   	theme: ${config?.theme || "saturn"},
        metaData: {
			title: ${config?.title || "Open API Reference"},
			description: ${config?.description || "Better Call Open API"},
		}
      }
      document.getElementById('api-reference').dataset.configuration =
        JSON.stringify(configuration)
    <\/script>
	  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"><\/script>
  </body>
</html>`;
//#endregion
//#region node_modules/better-call/node_modules/rou3/dist/index.mjs
var NullProtoObj = /* @__PURE__ */ (() => {
	const e = function() {};
	return e.prototype = Object.create(null), Object.freeze(e.prototype), e;
})();
function createRouter() {
	return {
		root: { key: "" },
		static: new NullProtoObj()
	};
}
function scanFirstGroup(path) {
	let i = 0;
	let depth = 0;
	for (; i < path.length; i++) {
		const c = path.charCodeAt(i);
		if (c === 92) i++;
		else if (c === 40) depth++;
		else if (c === 41 && depth > 0) depth--;
		else if (c === 123 && depth === 0) break;
	}
	if (i >= path.length) return;
	let j = i + 1;
	depth = 0;
	for (; j < path.length; j++) {
		const c = path.charCodeAt(j);
		if (c === 92) j++;
		else if (c === 40) depth++;
		else if (c === 41 && depth > 0) depth--;
		else if (c === 125 && depth === 0) break;
	}
	if (j >= path.length) return;
	const mod = path[j + 1];
	const hasMod = mod === "?" || mod === "+" || mod === "*";
	return [
		path.slice(0, i),
		path.slice(i + 1, j),
		path.slice(j + (hasMod ? 2 : 1)),
		hasMod ? mod : void 0
	];
}
function expandGroupDelimiters(path) {
	if (!path.includes("{")) return;
	const group = scanFirstGroup(path);
	if (!group) return;
	const [pre, body, suf, mod] = group;
	if (!mod) return [pre + body + suf];
	if (mod === "?") return [pre + body + suf, pre + suf];
	if (body.includes("/")) throw new Error("unsupported group repetition across segments");
	return [`${pre}(?:${body})${mod}${suf}`];
}
var UNNAMED_GROUP_PREFIX = "__rou3_unnamed_";
var ESCAPED_GROUP_PREFIX = "__rou3_esc_";
function toUnnamedGroupKey(index) {
	return `${UNNAMED_GROUP_PREFIX}${index}`;
}
function toGroupName(name) {
	return /^(?!__rou3_|_\d)[A-Za-z_]\w*$/.test(name) ? name : ESCAPED_GROUP_PREFIX + name.replace(/[_-]/g, (c) => c === "_" ? "__" : "_h");
}
function fromGroupName(key) {
	if (key.charCodeAt(0) !== 95) return key;
	if (key.startsWith("__rou3_esc_")) return key.slice(11).replace(/__|_h/g, (c) => c === "__" ? "_" : "-");
	return key.startsWith("__rou3_unnamed_") ? key.slice(15) : key;
}
function hasSegmentWildcard(segment) {
	let depth = 0;
	for (let i = 0; i < segment.length; i++) {
		const ch = segment.charCodeAt(i);
		if (ch === 92) {
			i++;
			continue;
		}
		if (ch === 40) {
			depth++;
			continue;
		}
		if (ch === 41 && depth > 0) {
			depth--;
			continue;
		}
		if (ch === 42 && depth === 0) return true;
	}
	return false;
}
function replaceSegmentWildcards(segment, unnamedStart, toGroupKey = toUnnamedGroupKey) {
	let depth = 0;
	let nextIndex = unnamedStart;
	let replaced = "";
	for (let i = 0; i < segment.length; i++) {
		const ch = segment.charCodeAt(i);
		if (ch === 92) {
			replaced += segment[i];
			if (i + 1 < segment.length) replaced += segment[++i];
			continue;
		}
		if (ch === 40) {
			depth++;
			replaced += segment[i];
			continue;
		}
		if (ch === 41 && depth > 0) {
			depth--;
			replaced += segment[i];
			continue;
		}
		if (ch === 42 && depth === 0) {
			replaced += `(?<${toGroupKey(nextIndex++)}>[^/]*)`;
			continue;
		}
		replaced += segment[i];
	}
	return [replaced, nextIndex];
}
function encodeEscapes(path) {
	if (!path.includes("\\")) return path;
	return path.replace(/\\([:(){}])/g, (_, c) => "�" + "ABCDE"[":(){}".indexOf(c)]);
}
function segmentKey(segment) {
	if (segment.startsWith("**")) return 2;
	if (segment === "*" || segment.includes(":") || segment.includes("(") || hasSegmentWildcard(segment)) return 1;
	if (segment === "\\*") return "*";
	if (segment === "\\*\\*") return "**";
	if (!segment.includes("�")) return segment;
	return segment.replace(/\uFFFD([A-E])/g, (_, c) => c === "A" ? ":" : c === "B" ? "(" : c === "C" ? ")" : c === "D" ? "{" : "}");
}
function expandModifiers(segments) {
	for (let i = 0; i < segments.length; i++) {
		const last = segments[i].charCodeAt(segments[i].length - 1);
		if (last !== 63 && last !== 43 && last !== 42) continue;
		const m = segments[i].match(/^(.*:[\w-]+(?:\([^)]*\))?)([?+*])$/);
		if (!m) continue;
		const pre = segments.slice(0, i);
		const suf = segments.slice(i + 1);
		if (m[2] === "?") return ["/" + pre.concat(m[1]).concat(suf).join("/"), "/" + pre.concat(suf).join("/")];
		const name = m[1].match(/:([\w-]+)/)?.[1] || "_";
		const wc = "/" + [
			...pre,
			`**:${name}`,
			...suf
		].join("/");
		const without = "/" + [...pre, ...suf].join("/");
		return m[2] === "+" ? [wc] : [wc, without];
	}
}
function normalizePath(path) {
	if (!path.includes("/.")) return path;
	const r = [];
	for (const s of path.split("/")) if (s === ".") continue;
	else if (s === ".." && r.length > 1) r.pop();
	else r.push(s);
	return r.join("/") || "/";
}
function splitPath(path) {
	const s = path.split("/");
	s.shift();
	if (s[s.length - 1] === "") s.pop();
	return s;
}
function splitRoute(path) {
	const s = splitPath(path);
	while (s[s.length - 1] === "") s.pop();
	return s;
}
function getMatchParams(segments, paramsMap) {
	const params = new NullProtoObj();
	for (const [index, name] of paramsMap) {
		const segment = index < 0 ? segments.slice(-(index + 1)).join("/") : segments[index];
		if (typeof name === "string") params[name] = segment;
		else {
			const match = segment.match(name);
			if (match) for (const key in match.groups) params[fromGroupName(key)] = match.groups[key];
		}
	}
	return params;
}
function addRoute(ctx, method = "", path, data) {
	method = method.toUpperCase();
	if (path.charCodeAt(0) !== 47) path = `/${path}`;
	const groupExpanded = expandGroupDelimiters(path);
	if (groupExpanded) {
		for (const expandedPath of groupExpanded) addRoute(ctx, method, expandedPath, data);
		return;
	}
	path = encodeEscapes(path);
	const segments = splitRoute(path);
	const expanded = expandModifiers(segments);
	if (expanded) {
		for (const p of expanded) addRoute(ctx, method, p, data);
		return;
	}
	let node = ctx.root;
	let _unnamedParamIndex = 0;
	const paramsMap = [];
	const paramsRegexp = [];
	for (let i = 0; i < segments.length; i++) {
		let segment = segments[i];
		const key = segmentKey(segment);
		if (key === 2) {
			if (!node.wildcard) node.wildcard = { key: "**" };
			node = node.wildcard;
			paramsMap.push([
				-(i + 1),
				segment.split(":")[1] || "_",
				segment.length === 2
			]);
			break;
		}
		if (key === 1) {
			if (!node.param) node.param = { key: "*" };
			node = node.param;
			if (segment === "*") paramsMap.push([
				i,
				String(_unnamedParamIndex++),
				true
			]);
			else if (segment.includes("(") || segment.includes(":", 1) || !/^:[\w-]+$/.test(segment)) {
				const [regexp, nextIndex] = getParamRegexp(segment, _unnamedParamIndex);
				_unnamedParamIndex = nextIndex;
				paramsRegexp[i] = regexp;
				node.hasRegexParam = true;
				paramsMap.push([
					i,
					regexp,
					false
				]);
			} else paramsMap.push([
				i,
				segment.slice(1),
				false
			]);
			continue;
		}
		segment = segments[i] = key;
		const child = node.static?.[segment];
		if (child) node = child;
		else {
			const staticNode = { key: segment };
			if (!node.static) node.static = new NullProtoObj();
			node.static[segment] = staticNode;
			node = staticNode;
		}
	}
	const hasParams = paramsMap.length > 0;
	const methods = node.methods ??= new NullProtoObj();
	(methods[method] ??= []).push({
		data: data || null,
		paramsRegexp,
		paramsMap: hasParams ? paramsMap : void 0
	});
	if (!hasParams) ctx.static["/" + segments.join("/")] = node;
}
function getParamRegexp(segment, unnamedStart = 0) {
	let _i = unnamedStart;
	let _s = "", _d = 0;
	for (let j = 0; j < segment.length; j++) {
		const c = segment.charCodeAt(j);
		if (c === 40) _d++;
		else if (c === 41 && _d > 0) _d--;
		else if (c === 92 && _d === 0 && j + 1 < segment.length) {
			const n = segment[j + 1];
			if (n !== ":" && n !== "(" && n !== "*" && n !== "\\") {
				_s += "￾" + n;
				j++;
				continue;
			}
		} else if (c === 46 && _d === 0) {
			_s += "\\.";
			continue;
		}
		_s += segment[j];
	}
	[_s, _i] = replaceSegmentWildcards(_s, _i);
	const regex = _s.replace(/:([\w-]+)(?:\(([^)]*)\))?/g, (_, id, p) => `(?<${toGroupName(id)}>${p || "[^/]+"})`).replace(/\((?![?<])/g, () => `(?<${toUnnamedGroupKey(_i++)}>`).replace(/\uFFFE(.)/g, (_, c) => /[.*+?^${}()|[\]\\]/.test(c) ? `\\${c}` : c);
	return [new RegExp(`^${regex}$`), _i];
}
function findRoute(ctx, method = "", path, opts) {
	if (opts?.normalize) path = normalizePath(path);
	if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
	const staticNode = ctx.static[path];
	if (staticNode && staticNode.methods) {
		const staticMatch = staticNode.methods[method] || staticNode.methods[""];
		if (staticMatch !== void 0) return staticMatch[0];
	}
	const segments = splitPath(path);
	const match = _lookupTree(ctx.root, method, segments, 0);
	if (match === void 0) return;
	if (opts?.params === false) return match;
	return {
		data: match.data,
		params: match.paramsMap ? getMatchParams(segments, match.paramsMap) : void 0
	};
}
function _lookupTree(node, method, segments, index) {
	if (index === segments.length) {
		if (node.methods) {
			const match = _selectMatcher(node.methods, method, segments, node.key === "*", false);
			if (match) return match;
		}
		return node.param?.methods && _selectMatcher(node.param.methods, method, segments, true, true) || node.wildcard?.methods && _selectMatcher(node.wildcard.methods, method, segments, true, true) || void 0;
	}
	const segment = segments[index];
	if (node.static) {
		const staticChild = node.static[segment];
		if (staticChild) {
			const match = _lookupTree(staticChild, method, segments, index + 1);
			if (match) return match;
		}
	}
	if (node.param) {
		const match = _lookupTree(node.param, method, segments, index + 1);
		if (match) return match;
	}
	if (node.wildcard && node.wildcard.methods) return _selectMatcher(node.wildcard.methods, method, segments, true, false);
}
function _selectMatcher(methods, method, segments, dynamicTerminal, optionalOnly) {
	const match = methods[method] || methods[""];
	if (!match) return;
	const first = match[0];
	if (match.length === 1 && first.paramsRegexp.length === 0) {
		if (!optionalOnly) return first;
		const pMap = first.paramsMap;
		return pMap?.[pMap.length - 1]?.[2] ? first : void 0;
	}
	let best;
	let bestWeight = -1;
	for (const m of match) {
		const pMap = m.paramsMap;
		const lastOptional = pMap?.[pMap.length - 1]?.[2];
		if (optionalOnly && !lastOptional) continue;
		let weight = dynamicTerminal && pMap && !lastOptional ? 1 : 0;
		const regexps = m.paramsRegexp;
		for (let i = 0; i < regexps.length; i++) if (regexps[i]) {
			if (!regexps[i].test(segments[i])) {
				weight = -1;
				break;
			}
			weight++;
		}
		if (weight > bestWeight) {
			best = m;
			bestWeight = weight;
		}
	}
	return best;
}
function findAllRoutes(ctx, method = "", path, opts) {
	if (opts?.normalize) path = normalizePath(path);
	if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
	const segments = splitPath(path);
	const matches = _findAll(ctx.root, method, segments, 0);
	if (opts?.params === false) return matches;
	return matches.map((m) => {
		return {
			data: m.data,
			params: m.paramsMap ? getMatchParams(segments, m.paramsMap) : void 0
		};
	});
}
function _findAll(node, method, segments, index, matches = []) {
	const segment = segments[index];
	if (node.wildcard && node.wildcard.methods) {
		const match = node.wildcard.methods[method] || node.wildcard.methods[""];
		if (match) if (index < segments.length) pushSorted(matches, match, true);
		else {
			const optional = [];
			for (const m of match) {
				const pMap = m.paramsMap;
				if (pMap?.[pMap.length - 1]?.[2]) optional.push(m);
			}
			pushSorted(matches, optional, true);
		}
	}
	if (node.param) {
		if (index < segments.length) {
			const start = matches.length;
			_findAll(node.param, method, segments, index + 1, matches);
			if (node.param.hasRegexParam) {
				for (let r = matches.length - 1; r >= start; r--) if (matches[r].paramsRegexp[index]?.test(segment) === false) matches.splice(r, 1);
			}
		} else if (node.param.methods) {
			const match = node.param.methods[method] || node.param.methods[""];
			if (match) {
				const optional = [];
				for (const m of match) {
					const pMap = m.paramsMap;
					if (pMap?.[pMap.length - 1]?.[2]) optional.push(m);
				}
				pushSorted(matches, optional, true);
			}
		}
	}
	if (index < segments.length) {
		const staticChild = node.static?.[segment];
		if (staticChild) _findAll(staticChild, method, segments, index + 1, matches);
	}
	if (index === segments.length && node.methods) {
		const match = node.methods[method] || node.methods[""];
		if (match) pushSorted(matches, match, node.key === "*");
	}
	return matches;
}
function pushSorted(matches, match, dynamicTerminal) {
	if (match.length > 1) match = match.map((m) => {
		let w = 0;
		const { paramsRegexp: rx, paramsMap: pm } = m;
		for (let i = 0; i < rx.length; i++) if (rx[i]) w++;
		if (dynamicTerminal && pm && !pm[pm.length - 1][2]) w++;
		return [m, w];
	}).sort((a, b) => a[1] - b[1]).map((e) => e[0]);
	for (const m of match) matches.push(m);
}
//#endregion
//#region node_modules/better-call/dist/router.mjs
var createRouter$1 = (endpoints, config) => {
	if (!config?.openapi?.disabled) {
		const openapi = {
			path: "/api/reference",
			...config?.openapi
		};
		endpoints["openapi"] = createEndpoint(openapi.path, { method: "GET" }, async (c) => {
			const schema = await generator(endpoints);
			return new Response(getHTML(schema, openapi.scalar), { headers: { "Content-Type": "text/html" } });
		});
	}
	const router = createRouter();
	const middlewareRouter = createRouter();
	for (const endpoint of Object.values(endpoints)) {
		if (!endpoint.options || !endpoint.path) continue;
		if (endpoint.options?.metadata?.SERVER_ONLY) continue;
		const methods = Array.isArray(endpoint.options?.method) ? endpoint.options.method : [endpoint.options?.method];
		for (const method of methods) addRoute(router, method, endpoint.path, endpoint);
	}
	if (config?.routerMiddleware?.length) for (const { path, middleware } of config.routerMiddleware) addRoute(middlewareRouter, "*", path, middleware);
	const basePath = config?.basePath && config.basePath !== "/" ? config.basePath.replace(/\/+$/, "") : "";
	const processRequest = async (request) => {
		const url = new URL(request.url);
		const pathname = url.pathname;
		let path;
		if (basePath) {
			if (!pathname.startsWith(`${basePath}/`)) return new Response(null, {
				status: 404,
				statusText: "Not Found"
			});
			path = pathname.slice(basePath.length);
		} else path = pathname;
		if (path.length === 0 || /\/{2,}/.test(path)) return new Response(null, {
			status: 404,
			statusText: "Not Found"
		});
		const route = findRoute(router, request.method, path);
		if (path.endsWith("/") !== route?.data?.path?.endsWith("/") && !config?.skipTrailingSlashes) return new Response(null, {
			status: 404,
			statusText: "Not Found"
		});
		if (!route?.data) return new Response(null, {
			status: 404,
			statusText: "Not Found"
		});
		const query = {};
		url.searchParams.forEach((value, key) => {
			if (key in query) if (Array.isArray(query[key])) query[key].push(value);
			else query[key] = [query[key], value];
			else query[key] = value;
		});
		const handler = route.data;
		try {
			const allowedMediaTypes = handler.options.metadata?.allowedMediaTypes || config?.allowedMediaTypes;
			const context = {
				path,
				method: request.method,
				headers: request.headers,
				params: route.params ? { ...route.params } : {},
				request,
				body: handler.options.disableBody ? void 0 : await getBody$1(handler.options.cloneRequest ? request.clone() : request, allowedMediaTypes),
				query,
				_flag: "router",
				asResponse: true,
				context: config?.routerContext
			};
			const middlewareRoutes = findAllRoutes(middlewareRouter, "*", path);
			if (middlewareRoutes?.length) for (const { data: middleware, params } of middlewareRoutes) {
				const res = await middleware({
					...context,
					params: params ? { ...params } : {},
					asResponse: false
				});
				if (res instanceof Response) return res;
			}
			return await handler(context);
		} catch (error) {
			if (config?.onError) try {
				const errorResponse = await config.onError(error, request);
				if (errorResponse instanceof Response) return toResponse(errorResponse);
			} catch (error) {
				if (isAPIError$1(error)) return toResponse(error);
				throw error;
			}
			if (config?.throwError) throw error;
			if (isAPIError$1(error)) return toResponse(error);
			console.error(`# SERVER_ERROR: `, error);
			return new Response(null, {
				status: 500,
				statusText: "Internal Server Error"
			});
		}
	};
	return {
		handler: async (request) => {
			const onReq = await config?.onRequest?.(request);
			if (onReq instanceof Response) return onReq;
			const req = isRequest(onReq) ? onReq : request;
			const res = await processRequest(req);
			const onRes = await config?.onResponse?.(res, req);
			if (onRes instanceof Response) return onRes;
			return res;
		},
		endpoints
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/utils/url.mjs
/**
* Normalizes a request pathname by removing the basePath prefix and trailing slashes.
* This is useful for matching paths against configured path lists.
*
* @param requestUrl - The full request URL
* @param basePath - The base path of the auth API (e.g., "/api/auth")
* @returns The normalized path without basePath prefix or trailing slashes,
*          or "/" if URL parsing fails
*
* @example
* normalizePathname("http://localhost:3000/api/auth/sso/saml2/callback/provider1", "/api/auth")
* // Returns: "/sso/saml2/callback/provider1"
*
* normalizePathname("http://localhost:3000/sso/saml2/callback/provider1/", "/")
* // Returns: "/sso/saml2/callback/provider1"
*/
function normalizePathname(requestUrl, basePath) {
	let pathname;
	try {
		pathname = new URL(requestUrl).pathname.replace(/\/+$/, "") || "/";
	} catch {
		return "/";
	}
	const normalizedBasePath = basePath.replace(/\/+$/, "");
	if (normalizedBasePath === "") return pathname;
	if (pathname === normalizedBasePath) return "/";
	if (pathname.startsWith(normalizedBasePath + "/")) return pathname.slice(normalizedBasePath.length).replace(/\/+$/, "") || "/";
	return pathname;
}
var URL_REFERENCE_ORIGIN = "https://better-auth.invalid";
/**
* Appends query parameters before the fragment of an absolute or root-relative URL.
* Existing query text is retained without parsing it into name-value pairs.
*
* This function only composes URLs. Callers must validate untrusted input.
*
* @throws TypeError if parsing fails or a relative input changes authority.
*/
function appendQueryParams(input, params) {
	const relative = input.startsWith("/");
	if (input.startsWith("//") || input.startsWith("/\\")) throw new TypeError("Expected an absolute or root-relative URL");
	const parsedURL = relative ? new URL(input, URL_REFERENCE_ORIGIN) : new URL(input);
	if (relative && parsedURL.origin !== URL_REFERENCE_ORIGIN) throw new TypeError("Expected an absolute or root-relative URL");
	const query = params.toString();
	if (!query) return input;
	const separator = parsedURL.search.endsWith("&") ? "" : "&";
	parsedURL.search = parsedURL.search ? `${parsedURL.search}${separator}${query}` : query;
	return relative ? parsedURL.href.slice(parsedURL.origin.length) : parsedURL.href;
}
//#endregion
//#region node_modules/@better-auth/core/dist/async_hooks/index.mjs
var AsyncLocalStoragePromise = import(
	/* @vite-ignore */
	/* webpackIgnore: true */
	"node:async_hooks"
).then((mod) => mod.AsyncLocalStorage).catch((err) => {
	if ("AsyncLocalStorage" in globalThis) return globalThis.AsyncLocalStorage;
	if (typeof window !== "undefined") return null;
	console.warn("[better-auth] Warning: AsyncLocalStorage is not available in this environment. Some features may not work as expected.");
	console.warn("[better-auth] Please read more about this warning at https://better-auth.com/docs/installation#mount-handler");
	console.warn("[better-auth] If you are using Cloudflare Workers, please see: https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag");
	throw err;
});
async function getAsyncLocalStorage() {
	const mod = await AsyncLocalStoragePromise;
	if (mod === null) throw new Error("getAsyncLocalStorage is only available in server code");
	else return mod;
}
//#endregion
//#region node_modules/@better-auth/core/dist/context/endpoint-context.mjs
var getExistingEndpointContextStorage = () => {
	return __getBetterAuthGlobal().context.endpointContextAsyncStorage;
};
var getOrCreateEndpointContextStorage = async () => {
	const existing = getExistingEndpointContextStorage();
	if (existing) return existing;
	const AsyncLocalStorage = await getAsyncLocalStorage();
	const globalContext = __getBetterAuthGlobal().context;
	return globalContext.endpointContextAsyncStorage ??= new AsyncLocalStorage();
};
/**
* Returns the current auth endpoint context, or `undefined` when called outside
* of `runWithEndpointContext`.
*/
function tryGetCurrentAuthEndpointContext() {
	return __getCurrentEndpointContext();
}
/**
* Returns the current auth endpoint context.
*
* @throws When called outside of `runWithEndpointContext`.
*/
function getCurrentAuthEndpointContext() {
	const authEndpointContext = tryGetCurrentAuthEndpointContext();
	if (!authEndpointContext) throw new Error("No auth context found. Please make sure you are calling this function within a `runWithEndpointContext` callback.");
	return authEndpointContext;
}
async function runWithEndpointContext(authEndpointContext, fn) {
	return (await getOrCreateEndpointContextStorage()).run(authEndpointContext, fn);
}
//#endregion
//#region node_modules/@better-auth/core/dist/context/request-state.mjs
var ensureAsyncStorage$1 = async () => {
	const betterAuthGlobal = __getBetterAuthGlobal();
	const existing = betterAuthGlobal.context.requestStateAsyncStorage;
	if (existing) return existing;
	const AsyncLocalStorage = await getAsyncLocalStorage();
	betterAuthGlobal.context.requestStateAsyncStorage ??= new AsyncLocalStorage();
	return betterAuthGlobal.context.requestStateAsyncStorage;
};
async function hasRequestState() {
	return (await ensureAsyncStorage$1()).getStore() !== void 0;
}
async function getCurrentRequestState() {
	const store = (await ensureAsyncStorage$1()).getStore();
	if (!store) throw new Error("No request state found. Please make sure you are calling this function within a `runWithRequestState` callback.");
	return store;
}
async function runWithRequestState(store, fn) {
	return (await ensureAsyncStorage$1()).run(store, fn);
}
function defineRequestState(initFn) {
	const ref = Object.freeze({});
	return {
		get ref() {
			return ref;
		},
		async get() {
			const store = await getCurrentRequestState();
			if (!store.has(ref)) {
				const initialValue = await initFn();
				store.set(ref, initialValue);
				return initialValue;
			}
			return store.get(ref);
		},
		async set(value) {
			(await getCurrentRequestState()).set(ref, value);
		}
	};
}
//#endregion
//#region node_modules/@better-auth/core/dist/context/transaction.mjs
var ensureAsyncStorage = async () => {
	const betterAuthGlobal = __getBetterAuthGlobal();
	const existing = betterAuthGlobal.context.adapterAsyncStorage;
	if (existing) return existing;
	const AsyncLocalStorage = await getAsyncLocalStorage();
	betterAuthGlobal.context.adapterAsyncStorage ??= new AsyncLocalStorage();
	return betterAuthGlobal.context.adapterAsyncStorage;
};
var getCurrentAdapter = async (fallback) => {
	return ensureAsyncStorage().then((als) => {
		return als.getStore()?.adapter || fallback;
	}).catch(() => {
		return fallback;
	});
};
var runWithAdapter = async (adapter, fn) => {
	let called = false;
	return ensureAsyncStorage().then(async (als) => {
		called = true;
		const pendingHooks = [];
		let result;
		let error;
		let hasError = false;
		try {
			result = await als.run({
				adapter,
				pendingHooks,
				isTransactionActive: false
			}, fn);
		} catch (err) {
			error = err;
			hasError = true;
		}
		for (const hook of pendingHooks) await hook();
		if (hasError) throw error;
		return result;
	}).catch((err) => {
		if (!called) return fn();
		throw err;
	});
};
var runWithTransaction = async (adapter, fn, options) => {
	let called = false;
	return ensureAsyncStorage().then(async (als) => {
		called = true;
		if (als.getStore()?.isTransactionActive) return fn();
		const pendingHooks = [];
		let result;
		let error;
		let hasError = false;
		try {
			result = await adapter.transaction(async (trx) => {
				return als.run({
					adapter: trx,
					pendingHooks,
					isTransactionActive: true
				}, fn);
			});
		} catch (e) {
			hasError = true;
			error = e;
		}
		if (hasError) throw error;
		for (const hook of pendingHooks) try {
			await hook();
		} catch (error) {
			if (!options?.onAfterCommitHookError) throw error;
			try {
				await options.onAfterCommitHookError(error);
			} catch {}
		}
		return result;
	}).catch((err) => {
		if (!called) return fn();
		throw err;
	});
};
/**
* Queue a hook to be executed after the current transaction commits.
* If not in a transaction, the hook will execute immediately.
*/
var queueAfterTransactionHook = async (hook, options) => {
	const executeHook = async () => {
		try {
			await hook();
		} catch (error) {
			if (!options?.onError) throw error;
			await options.onError(error);
		}
	};
	let storage;
	try {
		storage = await ensureAsyncStorage();
	} catch {
		return executeHook();
	}
	const store = storage.getStore();
	if (!store?.isTransactionActive) return executeHook();
	store.pendingHooks.push(executeHook);
};
//#endregion
//#region node_modules/@better-auth/core/dist/utils/is-api-error.mjs
function isAPIError(error) {
	return error instanceof APIError$1 || error instanceof APIError || error?.name === "APIError";
}
//#endregion
//#region node_modules/@better-auth/core/dist/api/index.mjs
/**
* Response headers that forbid any intermediary (proxy, CDN, browser) from
* caching a response body. Credential-bearing responses (access/refresh tokens,
* ID tokens, client secrets, device codes) must carry them.
*
* Set `metadata: { noStore: true }` on an endpoint and {@link createAuthEndpoint}
* applies these to the responses its handler produces: the success body and any
* error the handler throws. A request rejected by schema or media-type
* validation before the handler runs is not covered, and carries no credentials
* to protect. Spread them into a hand-built `Response` or `APIError`'s headers
* for the rare endpoint that constructs its own response.
*
* @see https://datatracker.ietf.org/doc/html/rfc6749#section-5.1
*/
var NO_STORE_HEADERS = {
	"Cache-Control": "no-store",
	Pragma: "no-cache"
};
/**
* Better-call's createEndpoint re-throws APIError without exposing the headers
* accumulated on ctx.responseHeaders (e.g. Set-Cookie from deleteSessionCookie
* before throw). Attach them to the error via kAPIErrorHeaderSymbol — matching
* better-call's createMiddleware contract so the outer pipeline can merge them
* into the response.
*/
function attachResponseHeadersToAPIError(responseHeaders, e) {
	if (!isAPIError(e) || !responseHeaders) return;
	Object.defineProperty(e, kAPIErrorHeaderSymbol, {
		enumerable: false,
		configurable: true,
		value: responseHeaders,
		writable: false
	});
}
var optionsMiddleware = createMiddleware(async () => {
	/**
	* This will be passed on the instance of
	* the context. Used to infer the type
	* here.
	*/
	return {};
});
var createAuthMiddleware = createMiddleware.create({ use: [optionsMiddleware, createMiddleware(async () => {
	return {};
})] });
var createEndpointWithAuthContext = createEndpoint.create({ use: [optionsMiddleware] });
function wrapEndpointHandler(handler, options) {
	const noStore = options.metadata?.noStore === true;
	return async (context) => {
		if (noStore) for (const [name, value] of Object.entries(NO_STORE_HEADERS)) context.setHeader(name, value);
		try {
			return await runWithEndpointContext(context, () => handler(context));
		} catch (error) {
			attachResponseHeadersToAPIError(context.responseHeaders, error);
			throw error;
		}
	};
}
function createAuthEndpoint(...args) {
	if (args.length === 3) {
		const [path, options, handler] = args;
		return createEndpointWithAuthContext(path, options, wrapEndpointHandler(handler, options));
	}
	const [options, handler] = args;
	return createEndpointWithAuthContext(options, wrapEndpointHandler(handler, options));
}
/**
* Set `metadata.SERVER_ONLY` while preserving any existing metadata
* (`$Infer`, `openapi`, ...).
*/
function withServerOnly(options) {
	return {
		...options,
		metadata: {
			...options.metadata,
			SERVER_ONLY: true
		}
	};
}
/**
* Declare a **server-only** endpoint.
*
* The endpoint is callable through `auth.api.*` from trusted server code but is
* never registered on the HTTP router and never emitted into the OpenAPI
* schema. It takes no path because it has no URL to be reached at.
*
* Prefer this over the path-less `createAuthEndpoint({ ... }, handler)` form.
* Setting `metadata.SERVER_ONLY` makes the intent explicit at the call site and
* keeps the endpoint off the HTTP surface even if a path is later added by
* mistake: better-call's router skips an endpoint when its path is missing *or*
* when `SERVER_ONLY` is set, so the two together are defense in depth. Relying
* on path omission alone is invisible and one keystroke away from exposure.
*
* @example
* ```ts
* viewBackupCodes: createAuthEndpoint.serverOnly(
* 	{ method: "POST", body: schema },
* 	async (ctx) => { ... },
* )
* ```
*/
createAuthEndpoint.serverOnly = (options, handler) => createAuthEndpoint(withServerOnly(options), handler);
//#endregion
//#region node_modules/@better-auth/core/dist/utils/deprecate.mjs
/**
* Wraps a function to log a deprecation warning at once.
*/
function deprecate(fn, message, logger) {
	let warned = false;
	return function(...args) {
		if (!warned) {
			(logger?.warn ?? console.warn)(`[Deprecation] ${message}`);
			warned = true;
		}
		return fn.apply(this, args);
	};
}
//#endregion
//#region node_modules/@better-auth/core/dist/utils/ip.mjs
/**
* Checks if an IP is valid IPv4 or IPv6
*/
function isValidIP(ip) {
	return ipv4().safeParse(ip).success || ipv6().safeParse(ip).success;
}
/**
* Checks if an IP is IPv6
*/
function isIPv6(ip) {
	return ipv6().safeParse(ip).success;
}
/**
* Converts IPv4-mapped IPv6 address to IPv4
* e.g., "::ffff:192.0.2.1" -> "192.0.2.1"
*/
function extractIPv4FromMapped(ipv6) {
	const lower = ipv6.toLowerCase();
	if (lower.startsWith("::ffff:")) {
		const ipv4Part = lower.substring(7);
		if (ipv4().safeParse(ipv4Part).success) return ipv4Part;
	}
	const parts = ipv6.split(":");
	if (parts.length === 7 && parts[5]?.toLowerCase() === "ffff") {
		const ipv4Part = parts[6];
		if (ipv4Part && ipv4().safeParse(ipv4Part).success) return ipv4Part;
	}
	if (lower.includes("::ffff:") || lower.includes(":ffff:")) {
		const groups = expandIPv6(ipv6);
		if (groups.length === 8 && groups[0] === "0000" && groups[1] === "0000" && groups[2] === "0000" && groups[3] === "0000" && groups[4] === "0000" && groups[5] === "ffff" && groups[6] && groups[7]) return `${Number.parseInt(groups[6].substring(0, 2), 16)}.${Number.parseInt(groups[6].substring(2, 4), 16)}.${Number.parseInt(groups[7].substring(0, 2), 16)}.${Number.parseInt(groups[7].substring(2, 4), 16)}`;
	}
	return null;
}
/**
* Expands a compressed IPv6 address to full form
* e.g., "2001:db8::1" -> ["2001", "0db8", "0000", "0000", "0000", "0000", "0000", "0001"]
*/
function expandIPv6(ipv6) {
	if (ipv6.includes("::")) {
		const sides = ipv6.split("::");
		const left = sides[0] ? sides[0].split(":") : [];
		const right = sides[1] ? sides[1].split(":") : [];
		const missingGroups = 8 - left.length - right.length;
		const zeros = Array(missingGroups).fill("0000");
		const paddedLeft = left.map((g) => g.padStart(4, "0"));
		const paddedRight = right.map((g) => g.padStart(4, "0"));
		return [
			...paddedLeft,
			...zeros,
			...paddedRight
		];
	}
	return ipv6.split(":").map((g) => g.padStart(4, "0"));
}
/**
* Normalizes an IPv6 address to canonical form
* e.g., "2001:DB8::1" -> "2001:0db8:0000:0000:0000:0000:0000:0001"
*/
function normalizeIPv6(ipv6, subnetPrefix) {
	const groups = expandIPv6(ipv6);
	if (subnetPrefix !== void 0 && subnetPrefix < 128) {
		let bitsRemaining = Math.max(0, Math.floor(subnetPrefix));
		return groups.map((group) => {
			if (bitsRemaining <= 0) return "0000";
			if (bitsRemaining >= 16) {
				bitsRemaining -= 16;
				return group;
			}
			const masked = Number.parseInt(group, 16) & (65535 << 16 - bitsRemaining & 65535);
			bitsRemaining = 0;
			return masked.toString(16).padStart(4, "0");
		}).join(":").toLowerCase();
	}
	return groups.join(":").toLowerCase();
}
/**
* Normalizes an IP address (IPv4 or IPv6) for consistent rate limiting.
*
* @param ip - The IP address to normalize
* @param options - Normalization options
* @returns Normalized IP address
*
* @example
* normalizeIP("2001:DB8::1")
* // -> "2001:0db8:0000:0000:0000:0000:0000:0000"
*
* @example
* normalizeIP("::ffff:192.0.2.1")
* // -> "192.0.2.1" (converted to IPv4)
*
* @example
* normalizeIP("2001:db8::1", { ipv6Subnet: 64 })
* // -> "2001:0db8:0000:0000:0000:0000:0000:0000" (subnet /64)
*/
function normalizeIP(ip, options = {}) {
	if (ipv4().safeParse(ip).success) return ip.toLowerCase();
	if (!isIPv6(ip)) return ip.toLowerCase();
	const ipv4$2 = extractIPv4FromMapped(ip);
	if (ipv4$2) return ipv4$2.toLowerCase();
	return normalizeIPv6(ip, options.ipv6Subnet ?? 64);
}
/**
* Raw bytes of an IP for CIDR comparison. Returns `null` for an invalid IP.
*/
function ipToBytes(ip) {
	if (ipv4().safeParse(ip).success) return Uint8Array.from(ip.split(".").map((octet) => Number(octet)));
	if (!isIPv6(ip)) return null;
	const mapped = extractIPv4FromMapped(ip);
	if (mapped) return Uint8Array.from(mapped.split(".").map((octet) => Number(octet)));
	const groups = expandIPv6(ip);
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	for (let i = 0; i < 8; i++) {
		const group = Number.parseInt(groups[i] ?? "0", 16);
		bytes[i * 2] = group >> 8 & 255;
		bytes[i * 2 + 1] = group & 255;
	}
	return bytes;
}
var CIDR_PREFIX_PATTERN = /^\d+$/;
/**
* Parses an IP or `IP/prefix` string into network bytes and a prefix length.
* The prefix must be digits only and within the address family. `null` if the
* value is not a valid IP or CIDR range, which keeps a malformed entry from
* silently behaving like a non-match.
*/
function parseCIDR(value) {
	const slash = value.lastIndexOf("/");
	const bytes = ipToBytes(slash === -1 ? value : value.slice(0, slash));
	if (!bytes) return null;
	const maxBits = bytes.length * 8;
	if (slash === -1) return {
		bytes,
		prefix: maxBits
	};
	const prefixPart = value.slice(slash + 1);
	if (!CIDR_PREFIX_PATTERN.test(prefixPart)) return null;
	const prefix = Number(prefixPart);
	return prefix <= maxBits ? {
		bytes,
		prefix
	} : null;
}
/**
* Whether `ipBytes` falls inside an already-parsed CIDR network.
*/
function matchesCIDR(ipBytes, net) {
	if (ipBytes.length !== net.bytes.length) return false;
	let bitsRemaining = net.prefix;
	for (let i = 0; i < ipBytes.length && bitsRemaining > 0; i++) {
		const take = bitsRemaining >= 8 ? 8 : bitsRemaining;
		const mask = take === 8 ? 255 : 255 << 8 - take & 255;
		if (((ipBytes[i] ?? 0) & mask) !== ((net.bytes[i] ?? 0) & mask)) return false;
		bitsRemaining -= 8;
	}
	return true;
}
/**
* Trusted-proxy entries that are not a valid IP address or CIDR range.
*/
function findInvalidTrustedProxies(entries) {
	return entries.filter((entry) => parseCIDR(entry) === null);
}
/**
* Resolves the client IP from a forwarded header. The leftmost token is spoofable,
* so with `trustedProxies` the chain is stripped from the right to the first
* untrusted hop. Otherwise only a single-value header is trusted. Returns `null`
* when no trustworthy client IP can be resolved.
*/
function getIPFromHeader(value, options = {}) {
	const forwardedIps = value.split(",").map((ip) => ip.trim()).filter(Boolean);
	if (forwardedIps.length === 0) return null;
	const trustedProxies = (options.trustedProxies ?? []).map(parseCIDR).filter((proxy) => {
		return proxy !== null;
	});
	if (trustedProxies.length > 0) {
		for (let i = forwardedIps.length - 1; i >= 0; i--) {
			const ip = forwardedIps[i];
			const ipBytes = ip ? ipToBytes(ip) : null;
			if (!ip || !ipBytes) return null;
			if (trustedProxies.some((proxy) => matchesCIDR(ipBytes, proxy))) continue;
			return normalizeIP(ip, { ipv6Subnet: options.ipv6Subnet });
		}
		return null;
	}
	if (forwardedIps.length !== 1) return null;
	const selectedIp = forwardedIps[0];
	if (!selectedIp || !isValidIP(selectedIp)) return null;
	return normalizeIP(selectedIp, { ipv6Subnet: options.ipv6Subnet });
}
var LOCALHOST_IP = "127.0.0.1";
var DEFAULT_IP_HEADERS = ["x-forwarded-for"];
/**
* Resolves the client IP for a request from the configured IP headers.
* Honors `disableIpTracking`, walks `ipAddressHeaders` in order (default
* `x-forwarded-for`), and falls back to localhost in development and test.
* Returns `null` when tracking is disabled or no trustworthy IP can be resolved.
*/
function getIP(req, options) {
	if (options.advanced?.ipAddress?.disableIpTracking) return null;
	const headers = "headers" in req ? req.headers : req;
	const ipHeaders = options.advanced?.ipAddress?.ipAddressHeaders || DEFAULT_IP_HEADERS;
	for (const key of ipHeaders) {
		const value = "get" in headers ? headers.get(key) : headers[key];
		if (typeof value === "string") {
			const ip = getIPFromHeader(value, {
				ipv6Subnet: options.advanced?.ipAddress?.ipv6Subnet,
				trustedProxies: options.advanced?.ipAddress?.trustedProxies
			});
			if (ip) return ip;
		}
	}
	if (isTest() || isDevelopment()) return LOCALHOST_IP;
	return null;
}
/**
* Creates a rate limit key from IP and path
* Uses a separator to prevent collision attacks
*
* @param ip - The IP address (should be normalized)
* @param path - The request path
* @returns Rate limit key
*/
function createRateLimitKey(ip, path) {
	return `${ip}|${path}`;
}
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/src/internal/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createConstMap = void 0;
	/**
	* Creates a const map from the given values
	* @param values - An array of values to be used as keys and values in the map.
	* @returns A populated version of the map with the values and keys derived from the values.
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function createConstMap(values) {
		let res = {};
		const len = values.length;
		for (let lp = 0; lp < len; lp++) {
			const val = values[lp];
			if (val) res[String(val).toUpperCase().replace(/[-.]/g, "_")] = val;
		}
		return res;
	}
	exports.createConstMap = createConstMap;
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/src/trace/SemanticAttributes.js
var require_SemanticAttributes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SEMATTRS_NET_HOST_CARRIER_ICC = exports.SEMATTRS_NET_HOST_CARRIER_MNC = exports.SEMATTRS_NET_HOST_CARRIER_MCC = exports.SEMATTRS_NET_HOST_CARRIER_NAME = exports.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = exports.SEMATTRS_NET_HOST_CONNECTION_TYPE = exports.SEMATTRS_NET_HOST_NAME = exports.SEMATTRS_NET_HOST_PORT = exports.SEMATTRS_NET_HOST_IP = exports.SEMATTRS_NET_PEER_NAME = exports.SEMATTRS_NET_PEER_PORT = exports.SEMATTRS_NET_PEER_IP = exports.SEMATTRS_NET_TRANSPORT = exports.SEMATTRS_FAAS_INVOKED_REGION = exports.SEMATTRS_FAAS_INVOKED_PROVIDER = exports.SEMATTRS_FAAS_INVOKED_NAME = exports.SEMATTRS_FAAS_COLDSTART = exports.SEMATTRS_FAAS_CRON = exports.SEMATTRS_FAAS_TIME = exports.SEMATTRS_FAAS_DOCUMENT_NAME = exports.SEMATTRS_FAAS_DOCUMENT_TIME = exports.SEMATTRS_FAAS_DOCUMENT_OPERATION = exports.SEMATTRS_FAAS_DOCUMENT_COLLECTION = exports.SEMATTRS_FAAS_EXECUTION = exports.SEMATTRS_FAAS_TRIGGER = exports.SEMATTRS_EXCEPTION_ESCAPED = exports.SEMATTRS_EXCEPTION_STACKTRACE = exports.SEMATTRS_EXCEPTION_MESSAGE = exports.SEMATTRS_EXCEPTION_TYPE = exports.SEMATTRS_DB_SQL_TABLE = exports.SEMATTRS_DB_MONGODB_COLLECTION = exports.SEMATTRS_DB_REDIS_DATABASE_INDEX = exports.SEMATTRS_DB_HBASE_NAMESPACE = exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = exports.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = exports.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = exports.SEMATTRS_DB_CASSANDRA_TABLE = exports.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = exports.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = exports.SEMATTRS_DB_CASSANDRA_KEYSPACE = exports.SEMATTRS_DB_MSSQL_INSTANCE_NAME = exports.SEMATTRS_DB_OPERATION = exports.SEMATTRS_DB_STATEMENT = exports.SEMATTRS_DB_NAME = exports.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = exports.SEMATTRS_DB_USER = exports.SEMATTRS_DB_CONNECTION_STRING = exports.SEMATTRS_DB_SYSTEM = exports.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = void 0;
	exports.SEMATTRS_MESSAGING_DESTINATION_KIND = exports.SEMATTRS_MESSAGING_DESTINATION = exports.SEMATTRS_MESSAGING_SYSTEM = exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = exports.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = exports.SEMATTRS_AWS_DYNAMODB_COUNT = exports.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = exports.SEMATTRS_AWS_DYNAMODB_SEGMENT = exports.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = exports.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = exports.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = exports.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = exports.SEMATTRS_AWS_DYNAMODB_SELECT = exports.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = exports.SEMATTRS_AWS_DYNAMODB_LIMIT = exports.SEMATTRS_AWS_DYNAMODB_PROJECTION = exports.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = exports.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = exports.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = exports.SEMATTRS_HTTP_CLIENT_IP = exports.SEMATTRS_HTTP_ROUTE = exports.SEMATTRS_HTTP_SERVER_NAME = exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = exports.SEMATTRS_HTTP_USER_AGENT = exports.SEMATTRS_HTTP_FLAVOR = exports.SEMATTRS_HTTP_STATUS_CODE = exports.SEMATTRS_HTTP_SCHEME = exports.SEMATTRS_HTTP_HOST = exports.SEMATTRS_HTTP_TARGET = exports.SEMATTRS_HTTP_URL = exports.SEMATTRS_HTTP_METHOD = exports.SEMATTRS_CODE_LINENO = exports.SEMATTRS_CODE_FILEPATH = exports.SEMATTRS_CODE_NAMESPACE = exports.SEMATTRS_CODE_FUNCTION = exports.SEMATTRS_THREAD_NAME = exports.SEMATTRS_THREAD_ID = exports.SEMATTRS_ENDUSER_SCOPE = exports.SEMATTRS_ENDUSER_ROLE = exports.SEMATTRS_ENDUSER_ID = exports.SEMATTRS_PEER_SERVICE = void 0;
	exports.DBSYSTEMVALUES_FILEMAKER = exports.DBSYSTEMVALUES_DERBY = exports.DBSYSTEMVALUES_FIREBIRD = exports.DBSYSTEMVALUES_ADABAS = exports.DBSYSTEMVALUES_CACHE = exports.DBSYSTEMVALUES_EDB = exports.DBSYSTEMVALUES_FIRSTSQL = exports.DBSYSTEMVALUES_INGRES = exports.DBSYSTEMVALUES_HANADB = exports.DBSYSTEMVALUES_MAXDB = exports.DBSYSTEMVALUES_PROGRESS = exports.DBSYSTEMVALUES_HSQLDB = exports.DBSYSTEMVALUES_CLOUDSCAPE = exports.DBSYSTEMVALUES_HIVE = exports.DBSYSTEMVALUES_REDSHIFT = exports.DBSYSTEMVALUES_POSTGRESQL = exports.DBSYSTEMVALUES_DB2 = exports.DBSYSTEMVALUES_ORACLE = exports.DBSYSTEMVALUES_MYSQL = exports.DBSYSTEMVALUES_MSSQL = exports.DBSYSTEMVALUES_OTHER_SQL = exports.SemanticAttributes = exports.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = exports.SEMATTRS_MESSAGE_COMPRESSED_SIZE = exports.SEMATTRS_MESSAGE_ID = exports.SEMATTRS_MESSAGE_TYPE = exports.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = exports.SEMATTRS_RPC_JSONRPC_ERROR_CODE = exports.SEMATTRS_RPC_JSONRPC_REQUEST_ID = exports.SEMATTRS_RPC_JSONRPC_VERSION = exports.SEMATTRS_RPC_GRPC_STATUS_CODE = exports.SEMATTRS_RPC_METHOD = exports.SEMATTRS_RPC_SERVICE = exports.SEMATTRS_RPC_SYSTEM = exports.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = exports.SEMATTRS_MESSAGING_KAFKA_PARTITION = exports.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = exports.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = exports.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = exports.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = exports.SEMATTRS_MESSAGING_CONSUMER_ID = exports.SEMATTRS_MESSAGING_OPERATION = exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = exports.SEMATTRS_MESSAGING_CONVERSATION_ID = exports.SEMATTRS_MESSAGING_MESSAGE_ID = exports.SEMATTRS_MESSAGING_URL = exports.SEMATTRS_MESSAGING_PROTOCOL_VERSION = exports.SEMATTRS_MESSAGING_PROTOCOL = exports.SEMATTRS_MESSAGING_TEMP_DESTINATION = void 0;
	exports.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = exports.FaasDocumentOperationValues = exports.FAASDOCUMENTOPERATIONVALUES_DELETE = exports.FAASDOCUMENTOPERATIONVALUES_EDIT = exports.FAASDOCUMENTOPERATIONVALUES_INSERT = exports.FaasTriggerValues = exports.FAASTRIGGERVALUES_OTHER = exports.FAASTRIGGERVALUES_TIMER = exports.FAASTRIGGERVALUES_PUBSUB = exports.FAASTRIGGERVALUES_HTTP = exports.FAASTRIGGERVALUES_DATASOURCE = exports.DbCassandraConsistencyLevelValues = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = exports.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = exports.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = exports.DbSystemValues = exports.DBSYSTEMVALUES_COCKROACHDB = exports.DBSYSTEMVALUES_MEMCACHED = exports.DBSYSTEMVALUES_ELASTICSEARCH = exports.DBSYSTEMVALUES_GEODE = exports.DBSYSTEMVALUES_NEO4J = exports.DBSYSTEMVALUES_DYNAMODB = exports.DBSYSTEMVALUES_COSMOSDB = exports.DBSYSTEMVALUES_COUCHDB = exports.DBSYSTEMVALUES_COUCHBASE = exports.DBSYSTEMVALUES_REDIS = exports.DBSYSTEMVALUES_MONGODB = exports.DBSYSTEMVALUES_HBASE = exports.DBSYSTEMVALUES_CASSANDRA = exports.DBSYSTEMVALUES_COLDFUSION = exports.DBSYSTEMVALUES_H2 = exports.DBSYSTEMVALUES_VERTICA = exports.DBSYSTEMVALUES_TERADATA = exports.DBSYSTEMVALUES_SYBASE = exports.DBSYSTEMVALUES_SQLITE = exports.DBSYSTEMVALUES_POINTBASE = exports.DBSYSTEMVALUES_PERVASIVE = exports.DBSYSTEMVALUES_NETEZZA = exports.DBSYSTEMVALUES_MARIADB = exports.DBSYSTEMVALUES_INTERBASE = exports.DBSYSTEMVALUES_INSTANTDB = exports.DBSYSTEMVALUES_INFORMIX = void 0;
	exports.MESSAGINGOPERATIONVALUES_RECEIVE = exports.MessagingDestinationKindValues = exports.MESSAGINGDESTINATIONKINDVALUES_TOPIC = exports.MESSAGINGDESTINATIONKINDVALUES_QUEUE = exports.HttpFlavorValues = exports.HTTPFLAVORVALUES_QUIC = exports.HTTPFLAVORVALUES_SPDY = exports.HTTPFLAVORVALUES_HTTP_2_0 = exports.HTTPFLAVORVALUES_HTTP_1_1 = exports.HTTPFLAVORVALUES_HTTP_1_0 = exports.NetHostConnectionSubtypeValues = exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_NR = exports.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = exports.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = exports.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = exports.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = exports.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = exports.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = exports.NetHostConnectionTypeValues = exports.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = exports.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = exports.NETHOSTCONNECTIONTYPEVALUES_CELL = exports.NETHOSTCONNECTIONTYPEVALUES_WIRED = exports.NETHOSTCONNECTIONTYPEVALUES_WIFI = exports.NetTransportValues = exports.NETTRANSPORTVALUES_OTHER = exports.NETTRANSPORTVALUES_INPROC = exports.NETTRANSPORTVALUES_PIPE = exports.NETTRANSPORTVALUES_UNIX = exports.NETTRANSPORTVALUES_IP = exports.NETTRANSPORTVALUES_IP_UDP = exports.NETTRANSPORTVALUES_IP_TCP = exports.FaasInvokedProviderValues = exports.FAASINVOKEDPROVIDERVALUES_GCP = exports.FAASINVOKEDPROVIDERVALUES_AZURE = exports.FAASINVOKEDPROVIDERVALUES_AWS = void 0;
	exports.MessageTypeValues = exports.MESSAGETYPEVALUES_RECEIVED = exports.MESSAGETYPEVALUES_SENT = exports.RpcGrpcStatusCodeValues = exports.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = exports.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = exports.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = exports.RPCGRPCSTATUSCODEVALUES_INTERNAL = exports.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = exports.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = exports.RPCGRPCSTATUSCODEVALUES_ABORTED = exports.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = exports.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = exports.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = exports.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = exports.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = exports.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = exports.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = exports.RPCGRPCSTATUSCODEVALUES_UNKNOWN = exports.RPCGRPCSTATUSCODEVALUES_CANCELLED = exports.RPCGRPCSTATUSCODEVALUES_OK = exports.MessagingOperationValues = exports.MESSAGINGOPERATIONVALUES_PROCESS = void 0;
	var utils_1 = require_utils();
	var TMP_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
	var TMP_DB_SYSTEM = "db.system";
	var TMP_DB_CONNECTION_STRING = "db.connection_string";
	var TMP_DB_USER = "db.user";
	var TMP_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
	var TMP_DB_NAME = "db.name";
	var TMP_DB_STATEMENT = "db.statement";
	var TMP_DB_OPERATION = "db.operation";
	var TMP_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
	var TMP_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
	var TMP_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
	var TMP_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
	var TMP_DB_CASSANDRA_TABLE = "db.cassandra.table";
	var TMP_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
	var TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
	var TMP_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
	var TMP_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
	var TMP_DB_HBASE_NAMESPACE = "db.hbase.namespace";
	var TMP_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
	var TMP_DB_MONGODB_COLLECTION = "db.mongodb.collection";
	var TMP_DB_SQL_TABLE = "db.sql.table";
	var TMP_EXCEPTION_TYPE = "exception.type";
	var TMP_EXCEPTION_MESSAGE = "exception.message";
	var TMP_EXCEPTION_STACKTRACE = "exception.stacktrace";
	var TMP_EXCEPTION_ESCAPED = "exception.escaped";
	var TMP_FAAS_TRIGGER = "faas.trigger";
	var TMP_FAAS_EXECUTION = "faas.execution";
	var TMP_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
	var TMP_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
	var TMP_FAAS_DOCUMENT_TIME = "faas.document.time";
	var TMP_FAAS_DOCUMENT_NAME = "faas.document.name";
	var TMP_FAAS_TIME = "faas.time";
	var TMP_FAAS_CRON = "faas.cron";
	var TMP_FAAS_COLDSTART = "faas.coldstart";
	var TMP_FAAS_INVOKED_NAME = "faas.invoked_name";
	var TMP_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
	var TMP_FAAS_INVOKED_REGION = "faas.invoked_region";
	var TMP_NET_TRANSPORT = "net.transport";
	var TMP_NET_PEER_IP = "net.peer.ip";
	var TMP_NET_PEER_PORT = "net.peer.port";
	var TMP_NET_PEER_NAME = "net.peer.name";
	var TMP_NET_HOST_IP = "net.host.ip";
	var TMP_NET_HOST_PORT = "net.host.port";
	var TMP_NET_HOST_NAME = "net.host.name";
	var TMP_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
	var TMP_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
	var TMP_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
	var TMP_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
	var TMP_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
	var TMP_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
	var TMP_PEER_SERVICE = "peer.service";
	var TMP_ENDUSER_ID = "enduser.id";
	var TMP_ENDUSER_ROLE = "enduser.role";
	var TMP_ENDUSER_SCOPE = "enduser.scope";
	var TMP_THREAD_ID = "thread.id";
	var TMP_THREAD_NAME = "thread.name";
	var TMP_CODE_FUNCTION = "code.function";
	var TMP_CODE_NAMESPACE = "code.namespace";
	var TMP_CODE_FILEPATH = "code.filepath";
	var TMP_CODE_LINENO = "code.lineno";
	var TMP_HTTP_METHOD = "http.method";
	var TMP_HTTP_URL = "http.url";
	var TMP_HTTP_TARGET = "http.target";
	var TMP_HTTP_HOST = "http.host";
	var TMP_HTTP_SCHEME = "http.scheme";
	var TMP_HTTP_STATUS_CODE = "http.status_code";
	var TMP_HTTP_FLAVOR = "http.flavor";
	var TMP_HTTP_USER_AGENT = "http.user_agent";
	var TMP_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
	var TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
	var TMP_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
	var TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
	var TMP_HTTP_SERVER_NAME = "http.server_name";
	var TMP_HTTP_ROUTE = "http.route";
	var TMP_HTTP_CLIENT_IP = "http.client_ip";
	var TMP_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
	var TMP_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
	var TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
	var TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
	var TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
	var TMP_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
	var TMP_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
	var TMP_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
	var TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
	var TMP_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
	var TMP_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
	var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
	var TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
	var TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
	var TMP_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
	var TMP_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
	var TMP_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
	var TMP_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
	var TMP_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
	var TMP_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
	var TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
	var TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
	var TMP_MESSAGING_SYSTEM = "messaging.system";
	var TMP_MESSAGING_DESTINATION = "messaging.destination";
	var TMP_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
	var TMP_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
	var TMP_MESSAGING_PROTOCOL = "messaging.protocol";
	var TMP_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
	var TMP_MESSAGING_URL = "messaging.url";
	var TMP_MESSAGING_MESSAGE_ID = "messaging.message_id";
	var TMP_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
	var TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
	var TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
	var TMP_MESSAGING_OPERATION = "messaging.operation";
	var TMP_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
	var TMP_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
	var TMP_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
	var TMP_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
	var TMP_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
	var TMP_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
	var TMP_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
	var TMP_RPC_SYSTEM = "rpc.system";
	var TMP_RPC_SERVICE = "rpc.service";
	var TMP_RPC_METHOD = "rpc.method";
	var TMP_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
	var TMP_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
	var TMP_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
	var TMP_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
	var TMP_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
	var TMP_MESSAGE_TYPE = "message.type";
	var TMP_MESSAGE_ID = "message.id";
	var TMP_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
	var TMP_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
	/**
	* The full invoked ARN as provided on the `Context` passed to the function (`Lambda-Runtime-Invoked-Function-Arn` header on the `/runtime/invocation/next` applicable).
	*
	* Note: This may be different from `faas.id` if an alias is involved.
	*
	* @deprecated Use ATTR_AWS_LAMBDA_INVOKED_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = TMP_AWS_LAMBDA_INVOKED_ARN;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use ATTR_DB_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_SYSTEM = TMP_DB_SYSTEM;
	/**
	* The connection string used to connect to the database. It is recommended to remove embedded credentials.
	*
	* @deprecated Use ATTR_DB_CONNECTION_STRING in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CONNECTION_STRING = TMP_DB_CONNECTION_STRING;
	/**
	* Username for accessing the database.
	*
	* @deprecated Use ATTR_DB_USER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_USER = TMP_DB_USER;
	/**
	* The fully-qualified class name of the [Java Database Connectivity (JDBC)](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) driver used to connect.
	*
	* @deprecated Use ATTR_DB_JDBC_DRIVER_CLASSNAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = TMP_DB_JDBC_DRIVER_CLASSNAME;
	/**
	* If no [tech-specific attribute](#call-level-attributes-for-specific-technologies) is defined, this attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).
	*
	* Note: In some SQL databases, the database name to be used is called &#34;schema name&#34;.
	*
	* @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_NAME = TMP_DB_NAME;
	/**
	* The database statement being executed.
	*
	* Note: The value may be sanitized to exclude sensitive information.
	*
	* @deprecated Use ATTR_DB_STATEMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_STATEMENT = TMP_DB_STATEMENT;
	/**
	* The name of the operation being executed, e.g. the [MongoDB command name](https://docs.mongodb.com/manual/reference/command/#database-operations) such as `findAndModify`, or the SQL keyword.
	*
	* Note: When setting this to an SQL keyword, it is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if the operation name is provided by the library being instrumented. If the SQL statement has an ambiguous operation, or performs more than one operation, this value may be omitted.
	*
	* @deprecated Use ATTR_DB_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_OPERATION = TMP_DB_OPERATION;
	/**
	* The Microsoft SQL Server [instance name](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15) connecting to. This name is used to determine the port of a named instance.
	*
	* Note: If setting a `db.mssql.instance_name`, `net.peer.port` is no longer required (but still recommended if non-standard).
	*
	* @deprecated Use ATTR_DB_MSSQL_INSTANCE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_MSSQL_INSTANCE_NAME = TMP_DB_MSSQL_INSTANCE_NAME;
	/**
	* The name of the keyspace being accessed. To be used instead of the generic `db.name` attribute.
	*
	* @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_KEYSPACE = TMP_DB_CASSANDRA_KEYSPACE;
	/**
	* The fetch size used for paging, i.e. how many rows will be returned at once.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_PAGE_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = TMP_DB_CASSANDRA_PAGE_SIZE;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use ATTR_DB_CASSANDRA_CONSISTENCY_LEVEL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = TMP_DB_CASSANDRA_CONSISTENCY_LEVEL;
	/**
	* The name of the primary table that the operation is acting upon, including the schema name (if applicable).
	*
	* Note: This mirrors the db.sql.table attribute but references cassandra rather than sql. It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_TABLE = TMP_DB_CASSANDRA_TABLE;
	/**
	* Whether or not the query is idempotent.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_IDEMPOTENCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = TMP_DB_CASSANDRA_IDEMPOTENCE;
	/**
	* The number of times a query was speculatively executed. Not set or `0` if the query was not executed speculatively.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT;
	/**
	* The ID of the coordinating node for a query.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_COORDINATOR_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = TMP_DB_CASSANDRA_COORDINATOR_ID;
	/**
	* The data center of the coordinating node for a query.
	*
	* @deprecated Use ATTR_DB_CASSANDRA_COORDINATOR_DC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = TMP_DB_CASSANDRA_COORDINATOR_DC;
	/**
	* The [HBase namespace](https://hbase.apache.org/book.html#_namespace) being accessed. To be used instead of the generic `db.name` attribute.
	*
	* @deprecated Use ATTR_DB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_HBASE_NAMESPACE = TMP_DB_HBASE_NAMESPACE;
	/**
	* The index of the database being accessed as used in the [`SELECT` command](https://redis.io/commands/select), provided as an integer. To be used instead of the generic `db.name` attribute.
	*
	* @deprecated Use ATTR_DB_REDIS_DATABASE_INDEX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_REDIS_DATABASE_INDEX = TMP_DB_REDIS_DATABASE_INDEX;
	/**
	* The collection being accessed within the database stated in `db.name`.
	*
	* @deprecated Use ATTR_DB_MONGODB_COLLECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_MONGODB_COLLECTION = TMP_DB_MONGODB_COLLECTION;
	/**
	* The name of the primary table that the operation is acting upon, including the schema name (if applicable).
	*
	* Note: It is not recommended to attempt any client-side parsing of `db.statement` just to get this property, but it should be set if it is provided by the library being instrumented. If the operation is acting upon an anonymous table, or more than one table, this value MUST NOT be set.
	*
	* @deprecated Use ATTR_DB_SQL_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_DB_SQL_TABLE = TMP_DB_SQL_TABLE;
	/**
	* The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
	*
	* @deprecated Use ATTR_EXCEPTION_TYPE.
	*/
	exports.SEMATTRS_EXCEPTION_TYPE = TMP_EXCEPTION_TYPE;
	/**
	* The exception message.
	*
	* @deprecated Use ATTR_EXCEPTION_MESSAGE.
	*/
	exports.SEMATTRS_EXCEPTION_MESSAGE = TMP_EXCEPTION_MESSAGE;
	/**
	* A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
	*
	* @deprecated Use ATTR_EXCEPTION_STACKTRACE.
	*/
	exports.SEMATTRS_EXCEPTION_STACKTRACE = TMP_EXCEPTION_STACKTRACE;
	/**
	* SHOULD be set to true if the exception event is recorded at a point where it is known that the exception is escaping the scope of the span.
	*
	* Note: An exception is considered to have escaped (or left) the scope of a span,
	if that span is ended while the exception is still logically &#34;in flight&#34;.
	This may be actually &#34;in flight&#34; in some languages (e.g. if the exception
	is passed to a Context manager&#39;s `__exit__` method in Python) but will
	usually be caught at the point of recording the exception in most languages.
	
	It is usually not possible to determine at the point where an exception is thrown
	whether it will escape the scope of a span.
	However, it is trivial to know that an exception
	will escape, if one checks for an active exception just before ending the span,
	as done in the [example above](#exception-end-example).
	
	It follows that an exception may still escape the scope of the span
	even if the `exception.escaped` attribute was not set or set to false,
	since the event might have been recorded at a time where it was not
	clear whether the exception will escape.
	*
	* @deprecated Use ATTR_EXCEPTION_ESCAPED.
	*/
	exports.SEMATTRS_EXCEPTION_ESCAPED = TMP_EXCEPTION_ESCAPED;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use ATTR_FAAS_TRIGGER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_TRIGGER = TMP_FAAS_TRIGGER;
	/**
	* The execution ID of the current function execution.
	*
	* @deprecated Use ATTR_FAAS_INVOCATION_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_EXECUTION = TMP_FAAS_EXECUTION;
	/**
	* The name of the source on which the triggering operation was performed. For example, in Cloud Storage or S3 corresponds to the bucket name, and in Cosmos DB to the database name.
	*
	* @deprecated Use ATTR_FAAS_DOCUMENT_COLLECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_DOCUMENT_COLLECTION = TMP_FAAS_DOCUMENT_COLLECTION;
	/**
	* Describes the type of the operation that was performed on the data.
	*
	* @deprecated Use ATTR_FAAS_DOCUMENT_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_DOCUMENT_OPERATION = TMP_FAAS_DOCUMENT_OPERATION;
	/**
	* A string containing the time when the data was accessed in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
	*
	* @deprecated Use ATTR_FAAS_DOCUMENT_TIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_DOCUMENT_TIME = TMP_FAAS_DOCUMENT_TIME;
	/**
	* The document name/table subjected to the operation. For example, in Cloud Storage or S3 is the name of the file, and in Cosmos DB the table name.
	*
	* @deprecated Use ATTR_FAAS_DOCUMENT_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_DOCUMENT_NAME = TMP_FAAS_DOCUMENT_NAME;
	/**
	* A string containing the function invocation time in the [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format expressed in [UTC](https://www.w3.org/TR/NOTE-datetime).
	*
	* @deprecated Use ATTR_FAAS_TIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_TIME = TMP_FAAS_TIME;
	/**
	* A string containing the schedule period as [Cron Expression](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).
	*
	* @deprecated Use ATTR_FAAS_CRON in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_CRON = TMP_FAAS_CRON;
	/**
	* A boolean that is true if the serverless function is executed for the first time (aka cold-start).
	*
	* @deprecated Use ATTR_FAAS_COLDSTART in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_COLDSTART = TMP_FAAS_COLDSTART;
	/**
	* The name of the invoked function.
	*
	* Note: SHOULD be equal to the `faas.name` resource attribute of the invoked function.
	*
	* @deprecated Use ATTR_FAAS_INVOKED_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_INVOKED_NAME = TMP_FAAS_INVOKED_NAME;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use ATTR_FAAS_INVOKED_PROVIDER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_INVOKED_PROVIDER = TMP_FAAS_INVOKED_PROVIDER;
	/**
	* The cloud region of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.region` resource attribute of the invoked function.
	*
	* @deprecated Use ATTR_FAAS_INVOKED_REGION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_FAAS_INVOKED_REGION = TMP_FAAS_INVOKED_REGION;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use ATTR_NET_TRANSPORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_TRANSPORT = TMP_NET_TRANSPORT;
	/**
	* Remote address of the peer (dotted decimal for IPv4 or [RFC5952](https://tools.ietf.org/html/rfc5952) for IPv6).
	*
	* @deprecated Use ATTR_NET_PEER_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_PEER_IP = TMP_NET_PEER_IP;
	/**
	* Remote port number.
	*
	* @deprecated Use ATTR_NET_PEER_PORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_PEER_PORT = TMP_NET_PEER_PORT;
	/**
	* Remote hostname or similar, see note below.
	*
	* @deprecated Use ATTR_NET_PEER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_PEER_NAME = TMP_NET_PEER_NAME;
	/**
	* Like `net.peer.ip` but for the host IP. Useful in case of a multi-IP host.
	*
	* @deprecated Use ATTR_NET_HOST_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_IP = TMP_NET_HOST_IP;
	/**
	* Like `net.peer.port` but for the host port.
	*
	* @deprecated Use ATTR_NET_HOST_PORT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_PORT = TMP_NET_HOST_PORT;
	/**
	* Local hostname or similar, see note below.
	*
	* @deprecated Use ATTR_NET_HOST_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_NAME = TMP_NET_HOST_NAME;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use ATTR_NETWORK_CONNECTION_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CONNECTION_TYPE = TMP_NET_HOST_CONNECTION_TYPE;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use ATTR_NETWORK_CONNECTION_SUBTYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = TMP_NET_HOST_CONNECTION_SUBTYPE;
	/**
	* The name of the mobile carrier.
	*
	* @deprecated Use ATTR_NETWORK_CARRIER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CARRIER_NAME = TMP_NET_HOST_CARRIER_NAME;
	/**
	* The mobile carrier country code.
	*
	* @deprecated Use ATTR_NETWORK_CARRIER_MCC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CARRIER_MCC = TMP_NET_HOST_CARRIER_MCC;
	/**
	* The mobile carrier network code.
	*
	* @deprecated Use ATTR_NETWORK_CARRIER_MNC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CARRIER_MNC = TMP_NET_HOST_CARRIER_MNC;
	/**
	* The ISO 3166-1 alpha-2 2-character country code associated with the mobile carrier network.
	*
	* @deprecated Use ATTR_NETWORK_CARRIER_ICC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_NET_HOST_CARRIER_ICC = TMP_NET_HOST_CARRIER_ICC;
	/**
	* The [`service.name`](../../resource/semantic_conventions/README.md#service) of the remote service. SHOULD be equal to the actual `service.name` resource attribute of the remote service if any.
	*
	* @deprecated Use ATTR_PEER_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_PEER_SERVICE = TMP_PEER_SERVICE;
	/**
	* Username or client_id extracted from the access token or [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) header in the inbound request from outside the system.
	*
	* @deprecated Use ATTR_ENDUSER_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_ENDUSER_ID = TMP_ENDUSER_ID;
	/**
	* Actual/assumed role the client is making the request under extracted from token or application security context.
	*
	* @deprecated Use ATTR_ENDUSER_ROLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_ENDUSER_ROLE = TMP_ENDUSER_ROLE;
	/**
	* Scopes or granted authorities the client currently possesses extracted from token or application security context. The value would come from the scope associated with an [OAuth 2.0 Access Token](https://tools.ietf.org/html/rfc6749#section-3.3) or an attribute value in a [SAML 2.0 Assertion](http://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html).
	*
	* @deprecated Use ATTR_ENDUSER_SCOPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_ENDUSER_SCOPE = TMP_ENDUSER_SCOPE;
	/**
	* Current &#34;managed&#34; thread ID (as opposed to OS thread ID).
	*
	* @deprecated Use ATTR_THREAD_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_THREAD_ID = TMP_THREAD_ID;
	/**
	* Current thread name.
	*
	* @deprecated Use ATTR_THREAD_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_THREAD_NAME = TMP_THREAD_NAME;
	/**
	* The method or function name, or equivalent (usually rightmost part of the code unit&#39;s name).
	*
	* @deprecated Use ATTR_CODE_FUNCTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_CODE_FUNCTION = TMP_CODE_FUNCTION;
	/**
	* The &#34;namespace&#34; within which `code.function` is defined. Usually the qualified class or module name, such that `code.namespace` + some separator + `code.function` form a unique identifier for the code unit.
	*
	* @deprecated Use ATTR_CODE_NAMESPACE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_CODE_NAMESPACE = TMP_CODE_NAMESPACE;
	/**
	* The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path).
	*
	* @deprecated Use ATTR_CODE_FILEPATH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_CODE_FILEPATH = TMP_CODE_FILEPATH;
	/**
	* The line number in `code.filepath` best representing the operation. It SHOULD point within the code unit named in `code.function`.
	*
	* @deprecated Use ATTR_CODE_LINENO in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_CODE_LINENO = TMP_CODE_LINENO;
	/**
	* HTTP request method.
	*
	* @deprecated Use ATTR_HTTP_METHOD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_METHOD = TMP_HTTP_METHOD;
	/**
	* Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.
	*
	* Note: `http.url` MUST NOT contain credentials passed via URL in form of `https://username:password@www.example.com/`. In such case the attribute&#39;s value should be `https://www.example.com/`.
	*
	* @deprecated Use ATTR_HTTP_URL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_URL = TMP_HTTP_URL;
	/**
	* The full request target as passed in a HTTP request line or equivalent.
	*
	* @deprecated Use ATTR_HTTP_TARGET in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_TARGET = TMP_HTTP_TARGET;
	/**
	* The value of the [HTTP host header](https://tools.ietf.org/html/rfc7230#section-5.4). An empty Host header should also be reported, see note.
	*
	* Note: When the header is present but empty the attribute SHOULD be set to the empty string. Note that this is a valid situation that is expected in certain cases, according the aforementioned [section of RFC 7230](https://tools.ietf.org/html/rfc7230#section-5.4). When the header is not set the attribute MUST NOT be set.
	*
	* @deprecated Use ATTR_HTTP_HOST in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_HOST = TMP_HTTP_HOST;
	/**
	* The URI scheme identifying the used protocol.
	*
	* @deprecated Use ATTR_HTTP_SCHEME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_SCHEME = TMP_HTTP_SCHEME;
	/**
	* [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
	*
	* @deprecated Use ATTR_HTTP_STATUS_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_STATUS_CODE = TMP_HTTP_STATUS_CODE;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use ATTR_HTTP_FLAVOR in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_FLAVOR = TMP_HTTP_FLAVOR;
	/**
	* Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client.
	*
	* @deprecated Use ATTR_HTTP_USER_AGENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_USER_AGENT = TMP_HTTP_USER_AGENT;
	/**
	* The size of the request payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
	*
	* @deprecated Use ATTR_HTTP_REQUEST_CONTENT_LENGTH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = TMP_HTTP_REQUEST_CONTENT_LENGTH;
	/**
	* The size of the uncompressed request payload body after transport decoding. Not set if transport encoding not used.
	*
	* @deprecated Use ATTR_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED;
	/**
	* The size of the response payload body in bytes. This is the number of bytes transferred excluding headers and is often, but not always, present as the [Content-Length](https://tools.ietf.org/html/rfc7230#section-3.3.2) header. For requests using transport encoding, this should be the compressed size.
	*
	* @deprecated Use ATTR_HTTP_RESPONSE_CONTENT_LENGTH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = TMP_HTTP_RESPONSE_CONTENT_LENGTH;
	/**
	* The size of the uncompressed response payload body after transport decoding. Not set if transport encoding not used.
	*
	* @deprecated Use ATTR_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED;
	/**
	* The primary server name of the matched virtual host. This should be obtained via configuration. If no such configuration can be obtained, this attribute MUST NOT be set ( `net.host.name` should be used instead).
	*
	* Note: `http.url` is usually not readily available on the server side but would have to be assembled in a cumbersome and sometimes lossy process from other information (see e.g. open-telemetry/opentelemetry-python/pull/148). It is thus preferred to supply the raw data that is available.
	*
	* @deprecated Use ATTR_HTTP_SERVER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_SERVER_NAME = TMP_HTTP_SERVER_NAME;
	/**
	* The matched route (path template).
	*
	* @deprecated Use ATTR_HTTP_ROUTE.
	*/
	exports.SEMATTRS_HTTP_ROUTE = TMP_HTTP_ROUTE;
	/**
	* The IP address of the original client behind all proxies, if known (e.g. from [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For)).
	*
	* Note: This is not necessarily the same as `net.peer.ip`, which would
	identify the network-level peer, which may be a proxy.
	
	This attribute should be set when a source of information different
	from the one used for `net.peer.ip`, is available even if that other
	source just confirms the same value as `net.peer.ip`.
	Rationale: For `net.peer.ip`, one typically does not know if it
	comes from a proxy, reverse proxy, or the actual client. Setting
	`http.client_ip` when it&#39;s the same as `net.peer.ip` means that
	one is at least somewhat confident that the address is not that of
	the closest proxy.
	*
	* @deprecated Use ATTR_HTTP_CLIENT_IP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_HTTP_CLIENT_IP = TMP_HTTP_CLIENT_IP;
	/**
	* The keys in the `RequestItems` object field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_TABLE_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = TMP_AWS_DYNAMODB_TABLE_NAMES;
	/**
	* The JSON-serialized value of each item in the `ConsumedCapacity` response field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_CONSUMED_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = TMP_AWS_DYNAMODB_CONSUMED_CAPACITY;
	/**
	* The JSON-serialized value of the `ItemCollectionMetrics` response field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_ITEM_COLLECTION_METRICS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS;
	/**
	* The value of the `ProvisionedThroughput.ReadCapacityUnits` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY;
	/**
	* The value of the `ProvisionedThroughput.WriteCapacityUnits` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY;
	/**
	* The value of the `ConsistentRead` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_CONSISTENT_READ in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = TMP_AWS_DYNAMODB_CONSISTENT_READ;
	/**
	* The value of the `ProjectionExpression` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_PROJECTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_PROJECTION = TMP_AWS_DYNAMODB_PROJECTION;
	/**
	* The value of the `Limit` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_LIMIT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_LIMIT = TMP_AWS_DYNAMODB_LIMIT;
	/**
	* The value of the `AttributesToGet` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_ATTRIBUTES_TO_GET in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET;
	/**
	* The value of the `IndexName` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_INDEX_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = TMP_AWS_DYNAMODB_INDEX_NAME;
	/**
	* The value of the `Select` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_SELECT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_SELECT = TMP_AWS_DYNAMODB_SELECT;
	/**
	* The JSON-serialized value of each item of the `GlobalSecondaryIndexes` request field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES;
	/**
	* The JSON-serialized value of each item of the `LocalSecondaryIndexes` request field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES;
	/**
	* The value of the `ExclusiveStartTableName` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_EXCLUSIVE_START_TABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE;
	/**
	* The the number of items in the `TableNames` response parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_TABLE_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = TMP_AWS_DYNAMODB_TABLE_COUNT;
	/**
	* The value of the `ScanIndexForward` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_SCAN_FORWARD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = TMP_AWS_DYNAMODB_SCAN_FORWARD;
	/**
	* The value of the `Segment` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_SEGMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_SEGMENT = TMP_AWS_DYNAMODB_SEGMENT;
	/**
	* The value of the `TotalSegments` request parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_TOTAL_SEGMENTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = TMP_AWS_DYNAMODB_TOTAL_SEGMENTS;
	/**
	* The value of the `Count` response parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_COUNT = TMP_AWS_DYNAMODB_COUNT;
	/**
	* The value of the `ScannedCount` response parameter.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_SCANNED_COUNT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = TMP_AWS_DYNAMODB_SCANNED_COUNT;
	/**
	* The JSON-serialized value of each item in the `AttributeDefinitions` request field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS;
	/**
	* The JSON-serialized value of each item in the the `GlobalSecondaryIndexUpdates` request field.
	*
	* @deprecated Use ATTR_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES;
	/**
	* A string identifying the messaging system.
	*
	* @deprecated Use ATTR_MESSAGING_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_SYSTEM = TMP_MESSAGING_SYSTEM;
	/**
	* The message destination name. This might be equal to the span name but is required nevertheless.
	*
	* @deprecated Use ATTR_MESSAGING_DESTINATION_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_DESTINATION = TMP_MESSAGING_DESTINATION;
	/**
	* The kind of message destination.
	*
	* @deprecated Removed in semconv v1.20.0.
	*/
	exports.SEMATTRS_MESSAGING_DESTINATION_KIND = TMP_MESSAGING_DESTINATION_KIND;
	/**
	* A boolean that is true if the message destination is temporary.
	*
	* @deprecated Use ATTR_MESSAGING_DESTINATION_TEMPORARY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_TEMP_DESTINATION = TMP_MESSAGING_TEMP_DESTINATION;
	/**
	* The name of the transport protocol.
	*
	* @deprecated Use ATTR_NETWORK_PROTOCOL_NAME.
	*/
	exports.SEMATTRS_MESSAGING_PROTOCOL = TMP_MESSAGING_PROTOCOL;
	/**
	* The version of the transport protocol.
	*
	* @deprecated Use ATTR_NETWORK_PROTOCOL_VERSION.
	*/
	exports.SEMATTRS_MESSAGING_PROTOCOL_VERSION = TMP_MESSAGING_PROTOCOL_VERSION;
	/**
	* Connection string.
	*
	* @deprecated Removed in semconv v1.17.0.
	*/
	exports.SEMATTRS_MESSAGING_URL = TMP_MESSAGING_URL;
	/**
	* A value used by the messaging system as an identifier for the message, represented as a string.
	*
	* @deprecated Use ATTR_MESSAGING_MESSAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_MESSAGE_ID = TMP_MESSAGING_MESSAGE_ID;
	/**
	* The [conversation ID](#conversations) identifying the conversation to which the message belongs, represented as a string. Sometimes called &#34;Correlation ID&#34;.
	*
	* @deprecated Use ATTR_MESSAGING_MESSAGE_CONVERSATION_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_CONVERSATION_ID = TMP_MESSAGING_CONVERSATION_ID;
	/**
	* The (uncompressed) size of the message payload in bytes. Also use this attribute if it is unknown whether the compressed or uncompressed payload size is reported.
	*
	* @deprecated Use ATTR_MESSAGING_MESSAGE_BODY_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES;
	/**
	* The compressed size of the message payload in bytes.
	*
	* @deprecated Removed in semconv v1.22.0.
	*/
	exports.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES;
	/**
	* A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
	*
	* @deprecated Use ATTR_MESSAGING_OPERATION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_OPERATION = TMP_MESSAGING_OPERATION;
	/**
	* The identifier for the consumer receiving a message. For Kafka, set it to `{messaging.kafka.consumer_group} - {messaging.kafka.client_id}`, if both are present, or only `messaging.kafka.consumer_group`. For brokers, such as RabbitMQ and Artemis, set it to the `client_id` of the client consuming the message.
	*
	* @deprecated Removed in semconv v1.21.0.
	*/
	exports.SEMATTRS_MESSAGING_CONSUMER_ID = TMP_MESSAGING_CONSUMER_ID;
	/**
	* RabbitMQ message routing key.
	*
	* @deprecated Use ATTR_MESSAGING_RABBITMQ_DESTINATION_ROUTING_KEY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = TMP_MESSAGING_RABBITMQ_ROUTING_KEY;
	/**
	* Message keys in Kafka are used for grouping alike messages to ensure they&#39;re processed on the same partition. They differ from `messaging.message_id` in that they&#39;re not unique. If the key is `null`, the attribute MUST NOT be set.
	*
	* Note: If the key type is not string, it&#39;s string representation has to be supplied for the attribute. If the key has no unambiguous, canonical string form, don&#39;t include its value.
	*
	* @deprecated Use ATTR_MESSAGING_KAFKA_MESSAGE_KEY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = TMP_MESSAGING_KAFKA_MESSAGE_KEY;
	/**
	* Name of the Kafka Consumer Group that is handling the message. Only applies to consumers, not producers.
	*
	* @deprecated Use ATTR_MESSAGING_KAFKA_CONSUMER_GROUP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = TMP_MESSAGING_KAFKA_CONSUMER_GROUP;
	/**
	* Client Id for the Consumer or Producer that is handling the message.
	*
	* @deprecated Use ATTR_MESSAGING_CLIENT_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = TMP_MESSAGING_KAFKA_CLIENT_ID;
	/**
	* Partition the message is sent to.
	*
	* @deprecated Use ATTR_MESSAGING_KAFKA_DESTINATION_PARTITION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_PARTITION = TMP_MESSAGING_KAFKA_PARTITION;
	/**
	* A boolean that is true if the message is a tombstone.
	*
	* @deprecated Use ATTR_MESSAGING_KAFKA_MESSAGE_TOMBSTONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = TMP_MESSAGING_KAFKA_TOMBSTONE;
	/**
	* A string identifying the remoting system.
	*
	* @deprecated Use ATTR_RPC_SYSTEM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_SYSTEM = TMP_RPC_SYSTEM;
	/**
	* The full (logical) name of the service being called, including its package name, if applicable.
	*
	* Note: This is the logical name of the service from the RPC interface perspective, which can be different from the name of any implementing class. The `code.namespace` attribute may be used to store the latter (despite the attribute name, it may include a class name; e.g., class with method actually executing the call on the server side, RPC client stub class on the client side).
	*
	* @deprecated Use ATTR_RPC_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_SERVICE = TMP_RPC_SERVICE;
	/**
	* The name of the (logical) method being called, must be equal to the $method part in the span name.
	*
	* Note: This is the logical name of the method from the RPC interface perspective, which can be different from the name of any implementing method/function. The `code.function` attribute may be used to store the latter (e.g., method actually executing the call on the server side, RPC client stub method on the client side).
	*
	* @deprecated Use ATTR_RPC_METHOD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_METHOD = TMP_RPC_METHOD;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use ATTR_RPC_GRPC_STATUS_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_GRPC_STATUS_CODE = TMP_RPC_GRPC_STATUS_CODE;
	/**
	* Protocol version as in `jsonrpc` property of request/response. Since JSON-RPC 1.0 does not specify this, the value can be omitted.
	*
	* @deprecated Use ATTR_RPC_JSONRPC_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_JSONRPC_VERSION = TMP_RPC_JSONRPC_VERSION;
	/**
	* `id` property of request or response. Since protocol allows id to be int, string, `null` or missing (for notifications), value is expected to be cast to string for simplicity. Use empty string in case of `null` value. Omit entirely if this is a notification.
	*
	* @deprecated Use ATTR_RPC_JSONRPC_REQUEST_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_JSONRPC_REQUEST_ID = TMP_RPC_JSONRPC_REQUEST_ID;
	/**
	* `error.code` property of response if it is an error response.
	*
	* @deprecated Use ATTR_RPC_JSONRPC_ERROR_CODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_JSONRPC_ERROR_CODE = TMP_RPC_JSONRPC_ERROR_CODE;
	/**
	* `error.message` property of response if it is an error response.
	*
	* @deprecated Use ATTR_RPC_JSONRPC_ERROR_MESSAGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = TMP_RPC_JSONRPC_ERROR_MESSAGE;
	/**
	* Whether this is a received or sent message.
	*
	* @deprecated Use ATTR_MESSAGE_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGE_TYPE = TMP_MESSAGE_TYPE;
	/**
	* MUST be calculated as two different counters starting from `1` one for sent messages and one for received message.
	*
	* Note: This way we guarantee that the values will be consistent between different implementations.
	*
	* @deprecated Use ATTR_MESSAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGE_ID = TMP_MESSAGE_ID;
	/**
	* Compressed size of the message in bytes.
	*
	* @deprecated Use ATTR_MESSAGE_COMPRESSED_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGE_COMPRESSED_SIZE = TMP_MESSAGE_COMPRESSED_SIZE;
	/**
	* Uncompressed size of the message in bytes.
	*
	* @deprecated Use ATTR_MESSAGE_UNCOMPRESSED_SIZE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = TMP_MESSAGE_UNCOMPRESSED_SIZE;
	/**
	* Create exported Value Map for SemanticAttributes values
	* @deprecated Use the SEMATTRS_XXXXX constants rather than the SemanticAttributes.XXXXX for bundle minification
	*/
	exports.SemanticAttributes = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_AWS_LAMBDA_INVOKED_ARN,
		TMP_DB_SYSTEM,
		TMP_DB_CONNECTION_STRING,
		TMP_DB_USER,
		TMP_DB_JDBC_DRIVER_CLASSNAME,
		TMP_DB_NAME,
		TMP_DB_STATEMENT,
		TMP_DB_OPERATION,
		TMP_DB_MSSQL_INSTANCE_NAME,
		TMP_DB_CASSANDRA_KEYSPACE,
		TMP_DB_CASSANDRA_PAGE_SIZE,
		TMP_DB_CASSANDRA_CONSISTENCY_LEVEL,
		TMP_DB_CASSANDRA_TABLE,
		TMP_DB_CASSANDRA_IDEMPOTENCE,
		TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
		TMP_DB_CASSANDRA_COORDINATOR_ID,
		TMP_DB_CASSANDRA_COORDINATOR_DC,
		TMP_DB_HBASE_NAMESPACE,
		TMP_DB_REDIS_DATABASE_INDEX,
		TMP_DB_MONGODB_COLLECTION,
		TMP_DB_SQL_TABLE,
		TMP_EXCEPTION_TYPE,
		TMP_EXCEPTION_MESSAGE,
		TMP_EXCEPTION_STACKTRACE,
		TMP_EXCEPTION_ESCAPED,
		TMP_FAAS_TRIGGER,
		TMP_FAAS_EXECUTION,
		TMP_FAAS_DOCUMENT_COLLECTION,
		TMP_FAAS_DOCUMENT_OPERATION,
		TMP_FAAS_DOCUMENT_TIME,
		TMP_FAAS_DOCUMENT_NAME,
		TMP_FAAS_TIME,
		TMP_FAAS_CRON,
		TMP_FAAS_COLDSTART,
		TMP_FAAS_INVOKED_NAME,
		TMP_FAAS_INVOKED_PROVIDER,
		TMP_FAAS_INVOKED_REGION,
		TMP_NET_TRANSPORT,
		TMP_NET_PEER_IP,
		TMP_NET_PEER_PORT,
		TMP_NET_PEER_NAME,
		TMP_NET_HOST_IP,
		TMP_NET_HOST_PORT,
		TMP_NET_HOST_NAME,
		TMP_NET_HOST_CONNECTION_TYPE,
		TMP_NET_HOST_CONNECTION_SUBTYPE,
		TMP_NET_HOST_CARRIER_NAME,
		TMP_NET_HOST_CARRIER_MCC,
		TMP_NET_HOST_CARRIER_MNC,
		TMP_NET_HOST_CARRIER_ICC,
		TMP_PEER_SERVICE,
		TMP_ENDUSER_ID,
		TMP_ENDUSER_ROLE,
		TMP_ENDUSER_SCOPE,
		TMP_THREAD_ID,
		TMP_THREAD_NAME,
		TMP_CODE_FUNCTION,
		TMP_CODE_NAMESPACE,
		TMP_CODE_FILEPATH,
		TMP_CODE_LINENO,
		TMP_HTTP_METHOD,
		TMP_HTTP_URL,
		TMP_HTTP_TARGET,
		TMP_HTTP_HOST,
		TMP_HTTP_SCHEME,
		TMP_HTTP_STATUS_CODE,
		TMP_HTTP_FLAVOR,
		TMP_HTTP_USER_AGENT,
		TMP_HTTP_REQUEST_CONTENT_LENGTH,
		TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
		TMP_HTTP_RESPONSE_CONTENT_LENGTH,
		TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
		TMP_HTTP_SERVER_NAME,
		TMP_HTTP_ROUTE,
		TMP_HTTP_CLIENT_IP,
		TMP_AWS_DYNAMODB_TABLE_NAMES,
		TMP_AWS_DYNAMODB_CONSUMED_CAPACITY,
		TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
		TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
		TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
		TMP_AWS_DYNAMODB_CONSISTENT_READ,
		TMP_AWS_DYNAMODB_PROJECTION,
		TMP_AWS_DYNAMODB_LIMIT,
		TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
		TMP_AWS_DYNAMODB_INDEX_NAME,
		TMP_AWS_DYNAMODB_SELECT,
		TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
		TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
		TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
		TMP_AWS_DYNAMODB_TABLE_COUNT,
		TMP_AWS_DYNAMODB_SCAN_FORWARD,
		TMP_AWS_DYNAMODB_SEGMENT,
		TMP_AWS_DYNAMODB_TOTAL_SEGMENTS,
		TMP_AWS_DYNAMODB_COUNT,
		TMP_AWS_DYNAMODB_SCANNED_COUNT,
		TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
		TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
		TMP_MESSAGING_SYSTEM,
		TMP_MESSAGING_DESTINATION,
		TMP_MESSAGING_DESTINATION_KIND,
		TMP_MESSAGING_TEMP_DESTINATION,
		TMP_MESSAGING_PROTOCOL,
		TMP_MESSAGING_PROTOCOL_VERSION,
		TMP_MESSAGING_URL,
		TMP_MESSAGING_MESSAGE_ID,
		TMP_MESSAGING_CONVERSATION_ID,
		TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
		TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
		TMP_MESSAGING_OPERATION,
		TMP_MESSAGING_CONSUMER_ID,
		TMP_MESSAGING_RABBITMQ_ROUTING_KEY,
		TMP_MESSAGING_KAFKA_MESSAGE_KEY,
		TMP_MESSAGING_KAFKA_CONSUMER_GROUP,
		TMP_MESSAGING_KAFKA_CLIENT_ID,
		TMP_MESSAGING_KAFKA_PARTITION,
		TMP_MESSAGING_KAFKA_TOMBSTONE,
		TMP_RPC_SYSTEM,
		TMP_RPC_SERVICE,
		TMP_RPC_METHOD,
		TMP_RPC_GRPC_STATUS_CODE,
		TMP_RPC_JSONRPC_VERSION,
		TMP_RPC_JSONRPC_REQUEST_ID,
		TMP_RPC_JSONRPC_ERROR_CODE,
		TMP_RPC_JSONRPC_ERROR_MESSAGE,
		TMP_MESSAGE_TYPE,
		TMP_MESSAGE_ID,
		TMP_MESSAGE_COMPRESSED_SIZE,
		TMP_MESSAGE_UNCOMPRESSED_SIZE
	]);
	var TMP_DBSYSTEMVALUES_OTHER_SQL = "other_sql";
	var TMP_DBSYSTEMVALUES_MSSQL = "mssql";
	var TMP_DBSYSTEMVALUES_MYSQL = "mysql";
	var TMP_DBSYSTEMVALUES_ORACLE = "oracle";
	var TMP_DBSYSTEMVALUES_DB2 = "db2";
	var TMP_DBSYSTEMVALUES_POSTGRESQL = "postgresql";
	var TMP_DBSYSTEMVALUES_REDSHIFT = "redshift";
	var TMP_DBSYSTEMVALUES_HIVE = "hive";
	var TMP_DBSYSTEMVALUES_CLOUDSCAPE = "cloudscape";
	var TMP_DBSYSTEMVALUES_HSQLDB = "hsqldb";
	var TMP_DBSYSTEMVALUES_PROGRESS = "progress";
	var TMP_DBSYSTEMVALUES_MAXDB = "maxdb";
	var TMP_DBSYSTEMVALUES_HANADB = "hanadb";
	var TMP_DBSYSTEMVALUES_INGRES = "ingres";
	var TMP_DBSYSTEMVALUES_FIRSTSQL = "firstsql";
	var TMP_DBSYSTEMVALUES_EDB = "edb";
	var TMP_DBSYSTEMVALUES_CACHE = "cache";
	var TMP_DBSYSTEMVALUES_ADABAS = "adabas";
	var TMP_DBSYSTEMVALUES_FIREBIRD = "firebird";
	var TMP_DBSYSTEMVALUES_DERBY = "derby";
	var TMP_DBSYSTEMVALUES_FILEMAKER = "filemaker";
	var TMP_DBSYSTEMVALUES_INFORMIX = "informix";
	var TMP_DBSYSTEMVALUES_INSTANTDB = "instantdb";
	var TMP_DBSYSTEMVALUES_INTERBASE = "interbase";
	var TMP_DBSYSTEMVALUES_MARIADB = "mariadb";
	var TMP_DBSYSTEMVALUES_NETEZZA = "netezza";
	var TMP_DBSYSTEMVALUES_PERVASIVE = "pervasive";
	var TMP_DBSYSTEMVALUES_POINTBASE = "pointbase";
	var TMP_DBSYSTEMVALUES_SQLITE = "sqlite";
	var TMP_DBSYSTEMVALUES_SYBASE = "sybase";
	var TMP_DBSYSTEMVALUES_TERADATA = "teradata";
	var TMP_DBSYSTEMVALUES_VERTICA = "vertica";
	var TMP_DBSYSTEMVALUES_H2 = "h2";
	var TMP_DBSYSTEMVALUES_COLDFUSION = "coldfusion";
	var TMP_DBSYSTEMVALUES_CASSANDRA = "cassandra";
	var TMP_DBSYSTEMVALUES_HBASE = "hbase";
	var TMP_DBSYSTEMVALUES_MONGODB = "mongodb";
	var TMP_DBSYSTEMVALUES_REDIS = "redis";
	var TMP_DBSYSTEMVALUES_COUCHBASE = "couchbase";
	var TMP_DBSYSTEMVALUES_COUCHDB = "couchdb";
	var TMP_DBSYSTEMVALUES_COSMOSDB = "cosmosdb";
	var TMP_DBSYSTEMVALUES_DYNAMODB = "dynamodb";
	var TMP_DBSYSTEMVALUES_NEO4J = "neo4j";
	var TMP_DBSYSTEMVALUES_GEODE = "geode";
	var TMP_DBSYSTEMVALUES_ELASTICSEARCH = "elasticsearch";
	var TMP_DBSYSTEMVALUES_MEMCACHED = "memcached";
	var TMP_DBSYSTEMVALUES_COCKROACHDB = "cockroachdb";
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_OTHER_SQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_OTHER_SQL = TMP_DBSYSTEMVALUES_OTHER_SQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MSSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MSSQL = TMP_DBSYSTEMVALUES_MSSQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MYSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MYSQL = TMP_DBSYSTEMVALUES_MYSQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_ORACLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_ORACLE = TMP_DBSYSTEMVALUES_ORACLE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_DB2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_DB2 = TMP_DBSYSTEMVALUES_DB2;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_POSTGRESQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_POSTGRESQL = TMP_DBSYSTEMVALUES_POSTGRESQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_REDSHIFT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_REDSHIFT = TMP_DBSYSTEMVALUES_REDSHIFT;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_HIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_HIVE = TMP_DBSYSTEMVALUES_HIVE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_CLOUDSCAPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_CLOUDSCAPE = TMP_DBSYSTEMVALUES_CLOUDSCAPE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_HSQLDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_HSQLDB = TMP_DBSYSTEMVALUES_HSQLDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_PROGRESS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_PROGRESS = TMP_DBSYSTEMVALUES_PROGRESS;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MAXDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MAXDB = TMP_DBSYSTEMVALUES_MAXDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_HANADB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_HANADB = TMP_DBSYSTEMVALUES_HANADB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_INGRES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_INGRES = TMP_DBSYSTEMVALUES_INGRES;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_FIRSTSQL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_FIRSTSQL = TMP_DBSYSTEMVALUES_FIRSTSQL;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_EDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_EDB = TMP_DBSYSTEMVALUES_EDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_CACHE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_CACHE = TMP_DBSYSTEMVALUES_CACHE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_ADABAS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_ADABAS = TMP_DBSYSTEMVALUES_ADABAS;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_FIREBIRD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_FIREBIRD = TMP_DBSYSTEMVALUES_FIREBIRD;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_DERBY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_DERBY = TMP_DBSYSTEMVALUES_DERBY;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_FILEMAKER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_FILEMAKER = TMP_DBSYSTEMVALUES_FILEMAKER;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_INFORMIX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_INFORMIX = TMP_DBSYSTEMVALUES_INFORMIX;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_INSTANTDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_INSTANTDB = TMP_DBSYSTEMVALUES_INSTANTDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_INTERBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_INTERBASE = TMP_DBSYSTEMVALUES_INTERBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MARIADB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MARIADB = TMP_DBSYSTEMVALUES_MARIADB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_NETEZZA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_NETEZZA = TMP_DBSYSTEMVALUES_NETEZZA;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_PERVASIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_PERVASIVE = TMP_DBSYSTEMVALUES_PERVASIVE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_POINTBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_POINTBASE = TMP_DBSYSTEMVALUES_POINTBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_SQLITE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_SQLITE = TMP_DBSYSTEMVALUES_SQLITE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_SYBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_SYBASE = TMP_DBSYSTEMVALUES_SYBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_TERADATA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_TERADATA = TMP_DBSYSTEMVALUES_TERADATA;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_VERTICA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_VERTICA = TMP_DBSYSTEMVALUES_VERTICA;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_H2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_H2 = TMP_DBSYSTEMVALUES_H2;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COLDFUSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COLDFUSION = TMP_DBSYSTEMVALUES_COLDFUSION;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_CASSANDRA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_CASSANDRA = TMP_DBSYSTEMVALUES_CASSANDRA;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_HBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_HBASE = TMP_DBSYSTEMVALUES_HBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MONGODB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MONGODB = TMP_DBSYSTEMVALUES_MONGODB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_REDIS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_REDIS = TMP_DBSYSTEMVALUES_REDIS;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COUCHBASE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COUCHBASE = TMP_DBSYSTEMVALUES_COUCHBASE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COUCHDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COUCHDB = TMP_DBSYSTEMVALUES_COUCHDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COSMOSDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COSMOSDB = TMP_DBSYSTEMVALUES_COSMOSDB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_DYNAMODB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_DYNAMODB = TMP_DBSYSTEMVALUES_DYNAMODB;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_NEO4J in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_NEO4J = TMP_DBSYSTEMVALUES_NEO4J;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_GEODE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_GEODE = TMP_DBSYSTEMVALUES_GEODE;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_ELASTICSEARCH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_ELASTICSEARCH = TMP_DBSYSTEMVALUES_ELASTICSEARCH;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_MEMCACHED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_MEMCACHED = TMP_DBSYSTEMVALUES_MEMCACHED;
	/**
	* An identifier for the database management system (DBMS) product being used. See below for a list of well-known identifiers.
	*
	* @deprecated Use DB_SYSTEM_VALUE_COCKROACHDB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBSYSTEMVALUES_COCKROACHDB = TMP_DBSYSTEMVALUES_COCKROACHDB;
	/**
	* The constant map of values for DbSystemValues.
	* @deprecated Use the DBSYSTEMVALUES_XXXXX constants rather than the DbSystemValues.XXXXX for bundle minification.
	*/
	exports.DbSystemValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_DBSYSTEMVALUES_OTHER_SQL,
		TMP_DBSYSTEMVALUES_MSSQL,
		TMP_DBSYSTEMVALUES_MYSQL,
		TMP_DBSYSTEMVALUES_ORACLE,
		TMP_DBSYSTEMVALUES_DB2,
		TMP_DBSYSTEMVALUES_POSTGRESQL,
		TMP_DBSYSTEMVALUES_REDSHIFT,
		TMP_DBSYSTEMVALUES_HIVE,
		TMP_DBSYSTEMVALUES_CLOUDSCAPE,
		TMP_DBSYSTEMVALUES_HSQLDB,
		TMP_DBSYSTEMVALUES_PROGRESS,
		TMP_DBSYSTEMVALUES_MAXDB,
		TMP_DBSYSTEMVALUES_HANADB,
		TMP_DBSYSTEMVALUES_INGRES,
		TMP_DBSYSTEMVALUES_FIRSTSQL,
		TMP_DBSYSTEMVALUES_EDB,
		TMP_DBSYSTEMVALUES_CACHE,
		TMP_DBSYSTEMVALUES_ADABAS,
		TMP_DBSYSTEMVALUES_FIREBIRD,
		TMP_DBSYSTEMVALUES_DERBY,
		TMP_DBSYSTEMVALUES_FILEMAKER,
		TMP_DBSYSTEMVALUES_INFORMIX,
		TMP_DBSYSTEMVALUES_INSTANTDB,
		TMP_DBSYSTEMVALUES_INTERBASE,
		TMP_DBSYSTEMVALUES_MARIADB,
		TMP_DBSYSTEMVALUES_NETEZZA,
		TMP_DBSYSTEMVALUES_PERVASIVE,
		TMP_DBSYSTEMVALUES_POINTBASE,
		TMP_DBSYSTEMVALUES_SQLITE,
		TMP_DBSYSTEMVALUES_SYBASE,
		TMP_DBSYSTEMVALUES_TERADATA,
		TMP_DBSYSTEMVALUES_VERTICA,
		TMP_DBSYSTEMVALUES_H2,
		TMP_DBSYSTEMVALUES_COLDFUSION,
		TMP_DBSYSTEMVALUES_CASSANDRA,
		TMP_DBSYSTEMVALUES_HBASE,
		TMP_DBSYSTEMVALUES_MONGODB,
		TMP_DBSYSTEMVALUES_REDIS,
		TMP_DBSYSTEMVALUES_COUCHBASE,
		TMP_DBSYSTEMVALUES_COUCHDB,
		TMP_DBSYSTEMVALUES_COSMOSDB,
		TMP_DBSYSTEMVALUES_DYNAMODB,
		TMP_DBSYSTEMVALUES_NEO4J,
		TMP_DBSYSTEMVALUES_GEODE,
		TMP_DBSYSTEMVALUES_ELASTICSEARCH,
		TMP_DBSYSTEMVALUES_MEMCACHED,
		TMP_DBSYSTEMVALUES_COCKROACHDB
	]);
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL = "all";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = "each_quorum";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = "quorum";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = "local_quorum";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE = "one";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO = "two";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE = "three";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = "local_one";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY = "any";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = "serial";
	var TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = "local_serial";
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ALL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_EACH_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_QUORUM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_TWO in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_THREE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_ONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_ANY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_SERIAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL;
	/**
	* The consistency level of the query. Based on consistency values from [CQL](https://docs.datastax.com/en/cassandra-oss/3.0/cassandra/dml/dmlConfigConsistency.html).
	*
	* @deprecated Use DB_CASSANDRA_CONSISTENCY_LEVEL_VALUE_LOCAL_SERIAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL;
	/**
	* The constant map of values for DbCassandraConsistencyLevelValues.
	* @deprecated Use the DBCASSANDRACONSISTENCYLEVELVALUES_XXXXX constants rather than the DbCassandraConsistencyLevelValues.XXXXX for bundle minification.
	*/
	exports.DbCassandraConsistencyLevelValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL
	]);
	var TMP_FAASTRIGGERVALUES_DATASOURCE = "datasource";
	var TMP_FAASTRIGGERVALUES_HTTP = "http";
	var TMP_FAASTRIGGERVALUES_PUBSUB = "pubsub";
	var TMP_FAASTRIGGERVALUES_TIMER = "timer";
	var TMP_FAASTRIGGERVALUES_OTHER = "other";
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_DATASOURCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_DATASOURCE = TMP_FAASTRIGGERVALUES_DATASOURCE;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_HTTP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_HTTP = TMP_FAASTRIGGERVALUES_HTTP;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_PUBSUB in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_PUBSUB = TMP_FAASTRIGGERVALUES_PUBSUB;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_TIMER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_TIMER = TMP_FAASTRIGGERVALUES_TIMER;
	/**
	* Type of the trigger on which the function is executed.
	*
	* @deprecated Use FAAS_TRIGGER_VALUE_OTHER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASTRIGGERVALUES_OTHER = TMP_FAASTRIGGERVALUES_OTHER;
	/**
	* The constant map of values for FaasTriggerValues.
	* @deprecated Use the FAASTRIGGERVALUES_XXXXX constants rather than the FaasTriggerValues.XXXXX for bundle minification.
	*/
	exports.FaasTriggerValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_FAASTRIGGERVALUES_DATASOURCE,
		TMP_FAASTRIGGERVALUES_HTTP,
		TMP_FAASTRIGGERVALUES_PUBSUB,
		TMP_FAASTRIGGERVALUES_TIMER,
		TMP_FAASTRIGGERVALUES_OTHER
	]);
	var TMP_FAASDOCUMENTOPERATIONVALUES_INSERT = "insert";
	var TMP_FAASDOCUMENTOPERATIONVALUES_EDIT = "edit";
	var TMP_FAASDOCUMENTOPERATIONVALUES_DELETE = "delete";
	/**
	* Describes the type of the operation that was performed on the data.
	*
	* @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_INSERT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASDOCUMENTOPERATIONVALUES_INSERT = TMP_FAASDOCUMENTOPERATIONVALUES_INSERT;
	/**
	* Describes the type of the operation that was performed on the data.
	*
	* @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_EDIT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASDOCUMENTOPERATIONVALUES_EDIT = TMP_FAASDOCUMENTOPERATIONVALUES_EDIT;
	/**
	* Describes the type of the operation that was performed on the data.
	*
	* @deprecated Use FAAS_DOCUMENT_OPERATION_VALUE_DELETE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASDOCUMENTOPERATIONVALUES_DELETE = TMP_FAASDOCUMENTOPERATIONVALUES_DELETE;
	/**
	* The constant map of values for FaasDocumentOperationValues.
	* @deprecated Use the FAASDOCUMENTOPERATIONVALUES_XXXXX constants rather than the FaasDocumentOperationValues.XXXXX for bundle minification.
	*/
	exports.FaasDocumentOperationValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_FAASDOCUMENTOPERATIONVALUES_INSERT,
		TMP_FAASDOCUMENTOPERATIONVALUES_EDIT,
		TMP_FAASDOCUMENTOPERATIONVALUES_DELETE
	]);
	var TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
	var TMP_FAASINVOKEDPROVIDERVALUES_AWS = "aws";
	var TMP_FAASINVOKEDPROVIDERVALUES_AZURE = "azure";
	var TMP_FAASINVOKEDPROVIDERVALUES_GCP = "gcp";
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_ALIBABA_CLOUD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_AWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASINVOKEDPROVIDERVALUES_AWS = TMP_FAASINVOKEDPROVIDERVALUES_AWS;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_AZURE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASINVOKEDPROVIDERVALUES_AZURE = TMP_FAASINVOKEDPROVIDERVALUES_AZURE;
	/**
	* The cloud provider of the invoked function.
	*
	* Note: SHOULD be equal to the `cloud.provider` resource attribute of the invoked function.
	*
	* @deprecated Use FAAS_INVOKED_PROVIDER_VALUE_GCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.FAASINVOKEDPROVIDERVALUES_GCP = TMP_FAASINVOKEDPROVIDERVALUES_GCP;
	/**
	* The constant map of values for FaasInvokedProviderValues.
	* @deprecated Use the FAASINVOKEDPROVIDERVALUES_XXXXX constants rather than the FaasInvokedProviderValues.XXXXX for bundle minification.
	*/
	exports.FaasInvokedProviderValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD,
		TMP_FAASINVOKEDPROVIDERVALUES_AWS,
		TMP_FAASINVOKEDPROVIDERVALUES_AZURE,
		TMP_FAASINVOKEDPROVIDERVALUES_GCP
	]);
	var TMP_NETTRANSPORTVALUES_IP_TCP = "ip_tcp";
	var TMP_NETTRANSPORTVALUES_IP_UDP = "ip_udp";
	var TMP_NETTRANSPORTVALUES_IP = "ip";
	var TMP_NETTRANSPORTVALUES_UNIX = "unix";
	var TMP_NETTRANSPORTVALUES_PIPE = "pipe";
	var TMP_NETTRANSPORTVALUES_INPROC = "inproc";
	var TMP_NETTRANSPORTVALUES_OTHER = "other";
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_IP_TCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_IP_TCP = TMP_NETTRANSPORTVALUES_IP_TCP;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_IP_UDP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_IP_UDP = TMP_NETTRANSPORTVALUES_IP_UDP;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Removed in v1.21.0.
	*/
	exports.NETTRANSPORTVALUES_IP = TMP_NETTRANSPORTVALUES_IP;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Removed in v1.21.0.
	*/
	exports.NETTRANSPORTVALUES_UNIX = TMP_NETTRANSPORTVALUES_UNIX;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_PIPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_PIPE = TMP_NETTRANSPORTVALUES_PIPE;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_INPROC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_INPROC = TMP_NETTRANSPORTVALUES_INPROC;
	/**
	* Transport protocol used. See note below.
	*
	* @deprecated Use NET_TRANSPORT_VALUE_OTHER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETTRANSPORTVALUES_OTHER = TMP_NETTRANSPORTVALUES_OTHER;
	/**
	* The constant map of values for NetTransportValues.
	* @deprecated Use the NETTRANSPORTVALUES_XXXXX constants rather than the NetTransportValues.XXXXX for bundle minification.
	*/
	exports.NetTransportValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_NETTRANSPORTVALUES_IP_TCP,
		TMP_NETTRANSPORTVALUES_IP_UDP,
		TMP_NETTRANSPORTVALUES_IP,
		TMP_NETTRANSPORTVALUES_UNIX,
		TMP_NETTRANSPORTVALUES_PIPE,
		TMP_NETTRANSPORTVALUES_INPROC,
		TMP_NETTRANSPORTVALUES_OTHER
	]);
	var TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI = "wifi";
	var TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED = "wired";
	var TMP_NETHOSTCONNECTIONTYPEVALUES_CELL = "cell";
	var TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = "unavailable";
	var TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = "unknown";
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_WIFI in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_WIFI = TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_WIRED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_WIRED = TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_CELL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_CELL = TMP_NETHOSTCONNECTIONTYPEVALUES_CELL;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_UNAVAILABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE;
	/**
	* The internet connection type currently being used by the host.
	*
	* @deprecated Use NETWORK_CONNECTION_TYPE_VALUE_UNKNOWN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN;
	/**
	* The constant map of values for NetHostConnectionTypeValues.
	* @deprecated Use the NETHOSTCONNECTIONTYPEVALUES_XXXXX constants rather than the NetHostConnectionTypeValues.XXXXX for bundle minification.
	*/
	exports.NetHostConnectionTypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI,
		TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED,
		TMP_NETHOSTCONNECTIONTYPEVALUES_CELL,
		TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE,
		TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN
	]);
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = "gprs";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = "edge";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = "umts";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = "cdma";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = "evdo_0";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = "evdo_a";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = "cdma2000_1xrtt";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = "hsdpa";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = "hsupa";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = "hspa";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = "iden";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = "evdo_b";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE = "lte";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = "ehrpd";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = "hspap";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM = "gsm";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = "td_scdma";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = "iwlan";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR = "nr";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = "nrnsa";
	var TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = "lte_ca";
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_GPRS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EDGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_UMTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_A in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_CDMA2000_1XRTT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSDPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSUPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSPA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_IDEN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EVDO_B in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_LTE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_EHRPD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_HSPAP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_GSM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_TD_SCDMA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_IWLAN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_NR in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_NR = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_NRNSA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA;
	/**
	* This describes more details regarding the connection.type. It may be the type of cell technology connection, but it could be used for describing details about a wifi connection.
	*
	* @deprecated Use NETWORK_CONNECTION_SUBTYPE_VALUE_LTE_CA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA;
	/**
	* The constant map of values for NetHostConnectionSubtypeValues.
	* @deprecated Use the NETHOSTCONNECTIONSUBTYPEVALUES_XXXXX constants rather than the NetHostConnectionSubtypeValues.XXXXX for bundle minification.
	*/
	exports.NetHostConnectionSubtypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA
	]);
	var TMP_HTTPFLAVORVALUES_HTTP_1_0 = "1.0";
	var TMP_HTTPFLAVORVALUES_HTTP_1_1 = "1.1";
	var TMP_HTTPFLAVORVALUES_HTTP_2_0 = "2.0";
	var TMP_HTTPFLAVORVALUES_SPDY = "SPDY";
	var TMP_HTTPFLAVORVALUES_QUIC = "QUIC";
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_HTTP_1_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_HTTP_1_0 = TMP_HTTPFLAVORVALUES_HTTP_1_0;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_HTTP_1_1 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_HTTP_1_1 = TMP_HTTPFLAVORVALUES_HTTP_1_1;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_HTTP_2_0 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_HTTP_2_0 = TMP_HTTPFLAVORVALUES_HTTP_2_0;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_SPDY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_SPDY = TMP_HTTPFLAVORVALUES_SPDY;
	/**
	* Kind of HTTP protocol used.
	*
	* Note: If `net.transport` is not specified, it can be assumed to be `IP.TCP` except if `http.flavor` is `QUIC`, in which case `IP.UDP` is assumed.
	*
	* @deprecated Use HTTP_FLAVOR_VALUE_QUIC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HTTPFLAVORVALUES_QUIC = TMP_HTTPFLAVORVALUES_QUIC;
	/**
	* The constant map of values for HttpFlavorValues.
	* @deprecated Use the HTTPFLAVORVALUES_XXXXX constants rather than the HttpFlavorValues.XXXXX for bundle minification.
	*/
	exports.HttpFlavorValues = {
		HTTP_1_0: TMP_HTTPFLAVORVALUES_HTTP_1_0,
		HTTP_1_1: TMP_HTTPFLAVORVALUES_HTTP_1_1,
		HTTP_2_0: TMP_HTTPFLAVORVALUES_HTTP_2_0,
		SPDY: TMP_HTTPFLAVORVALUES_SPDY,
		QUIC: TMP_HTTPFLAVORVALUES_QUIC
	};
	var TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE = "queue";
	var TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC = "topic";
	/**
	* The kind of message destination.
	*
	* @deprecated Removed in semconv v1.20.0.
	*/
	exports.MESSAGINGDESTINATIONKINDVALUES_QUEUE = TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE;
	/**
	* The kind of message destination.
	*
	* @deprecated Removed in semconv v1.20.0.
	*/
	exports.MESSAGINGDESTINATIONKINDVALUES_TOPIC = TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC;
	/**
	* The constant map of values for MessagingDestinationKindValues.
	* @deprecated Use the MESSAGINGDESTINATIONKINDVALUES_XXXXX constants rather than the MessagingDestinationKindValues.XXXXX for bundle minification.
	*/
	exports.MessagingDestinationKindValues = /*#__PURE__*/ (0, utils_1.createConstMap)([TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE, TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC]);
	var TMP_MESSAGINGOPERATIONVALUES_RECEIVE = "receive";
	var TMP_MESSAGINGOPERATIONVALUES_PROCESS = "process";
	/**
	* A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
	*
	* @deprecated Use MESSAGING_OPERATION_TYPE_VALUE_RECEIVE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.MESSAGINGOPERATIONVALUES_RECEIVE = TMP_MESSAGINGOPERATIONVALUES_RECEIVE;
	/**
	* A string identifying the kind of message consumption as defined in the [Operation names](#operation-names) section above. If the operation is &#34;send&#34;, this attribute MUST NOT be set, since the operation can be inferred from the span kind in that case.
	*
	* @deprecated Use MESSAGING_OPERATION_TYPE_VALUE_PROCESS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.MESSAGINGOPERATIONVALUES_PROCESS = TMP_MESSAGINGOPERATIONVALUES_PROCESS;
	/**
	* The constant map of values for MessagingOperationValues.
	* @deprecated Use the MESSAGINGOPERATIONVALUES_XXXXX constants rather than the MessagingOperationValues.XXXXX for bundle minification.
	*/
	exports.MessagingOperationValues = /*#__PURE__*/ (0, utils_1.createConstMap)([TMP_MESSAGINGOPERATIONVALUES_RECEIVE, TMP_MESSAGINGOPERATIONVALUES_PROCESS]);
	var TMP_RPCGRPCSTATUSCODEVALUES_OK = 0;
	var TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED = 1;
	var TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN = 2;
	var TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = 3;
	var TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = 4;
	var TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND = 5;
	var TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = 6;
	var TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = 7;
	var TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = 8;
	var TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = 9;
	var TMP_RPCGRPCSTATUSCODEVALUES_ABORTED = 10;
	var TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = 11;
	var TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = 12;
	var TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL = 13;
	var TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = 14;
	var TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS = 15;
	var TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = 16;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_OK in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_OK = TMP_RPCGRPCSTATUSCODEVALUES_OK;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_CANCELLED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_CANCELLED = TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNKNOWN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_UNKNOWN = TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_INVALID_ARGUMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_DEADLINE_EXCEEDED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_NOT_FOUND in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_ALREADY_EXISTS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_PERMISSION_DENIED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_RESOURCE_EXHAUSTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_FAILED_PRECONDITION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_ABORTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_ABORTED = TMP_RPCGRPCSTATUSCODEVALUES_ABORTED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_OUT_OF_RANGE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNIMPLEMENTED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_INTERNAL in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_INTERNAL = TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNAVAILABLE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_DATA_LOSS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS;
	/**
	* The [numeric status code](https://github.com/grpc/grpc/blob/v1.33.2/doc/statuscodes.md) of the gRPC request.
	*
	* @deprecated Use RPC_GRPC_STATUS_CODE_VALUE_UNAUTHENTICATED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED;
	/**
	* The constant map of values for RpcGrpcStatusCodeValues.
	* @deprecated Use the RPCGRPCSTATUSCODEVALUES_XXXXX constants rather than the RpcGrpcStatusCodeValues.XXXXX for bundle minification.
	*/
	exports.RpcGrpcStatusCodeValues = {
		OK: TMP_RPCGRPCSTATUSCODEVALUES_OK,
		CANCELLED: TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED,
		UNKNOWN: TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN,
		INVALID_ARGUMENT: TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT,
		DEADLINE_EXCEEDED: TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED,
		NOT_FOUND: TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND,
		ALREADY_EXISTS: TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS,
		PERMISSION_DENIED: TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED,
		RESOURCE_EXHAUSTED: TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED,
		FAILED_PRECONDITION: TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION,
		ABORTED: TMP_RPCGRPCSTATUSCODEVALUES_ABORTED,
		OUT_OF_RANGE: TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE,
		UNIMPLEMENTED: TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED,
		INTERNAL: TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL,
		UNAVAILABLE: TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE,
		DATA_LOSS: TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS,
		UNAUTHENTICATED: TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED
	};
	var TMP_MESSAGETYPEVALUES_SENT = "SENT";
	var TMP_MESSAGETYPEVALUES_RECEIVED = "RECEIVED";
	/**
	* Whether this is a received or sent message.
	*
	* @deprecated Use MESSAGE_TYPE_VALUE_SENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.MESSAGETYPEVALUES_SENT = TMP_MESSAGETYPEVALUES_SENT;
	/**
	* Whether this is a received or sent message.
	*
	* @deprecated Use MESSAGE_TYPE_VALUE_RECEIVED in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.MESSAGETYPEVALUES_RECEIVED = TMP_MESSAGETYPEVALUES_RECEIVED;
	/**
	* The constant map of values for MessageTypeValues.
	* @deprecated Use the MESSAGETYPEVALUES_XXXXX constants rather than the MessageTypeValues.XXXXX for bundle minification.
	*/
	exports.MessageTypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([TMP_MESSAGETYPEVALUES_SENT, TMP_MESSAGETYPEVALUES_RECEIVED]);
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/src/trace/index.js
var require_trace = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$3) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$3, p)) __createBinding(exports$3, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_SemanticAttributes(), exports);
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/src/resource/SemanticResourceAttributes.js
var require_SemanticResourceAttributes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SEMRESATTRS_K8S_STATEFULSET_NAME = exports.SEMRESATTRS_K8S_STATEFULSET_UID = exports.SEMRESATTRS_K8S_DEPLOYMENT_NAME = exports.SEMRESATTRS_K8S_DEPLOYMENT_UID = exports.SEMRESATTRS_K8S_REPLICASET_NAME = exports.SEMRESATTRS_K8S_REPLICASET_UID = exports.SEMRESATTRS_K8S_CONTAINER_NAME = exports.SEMRESATTRS_K8S_POD_NAME = exports.SEMRESATTRS_K8S_POD_UID = exports.SEMRESATTRS_K8S_NAMESPACE_NAME = exports.SEMRESATTRS_K8S_NODE_UID = exports.SEMRESATTRS_K8S_NODE_NAME = exports.SEMRESATTRS_K8S_CLUSTER_NAME = exports.SEMRESATTRS_HOST_IMAGE_VERSION = exports.SEMRESATTRS_HOST_IMAGE_ID = exports.SEMRESATTRS_HOST_IMAGE_NAME = exports.SEMRESATTRS_HOST_ARCH = exports.SEMRESATTRS_HOST_TYPE = exports.SEMRESATTRS_HOST_NAME = exports.SEMRESATTRS_HOST_ID = exports.SEMRESATTRS_FAAS_MAX_MEMORY = exports.SEMRESATTRS_FAAS_INSTANCE = exports.SEMRESATTRS_FAAS_VERSION = exports.SEMRESATTRS_FAAS_ID = exports.SEMRESATTRS_FAAS_NAME = exports.SEMRESATTRS_DEVICE_MODEL_NAME = exports.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = exports.SEMRESATTRS_DEVICE_ID = exports.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = exports.SEMRESATTRS_CONTAINER_IMAGE_TAG = exports.SEMRESATTRS_CONTAINER_IMAGE_NAME = exports.SEMRESATTRS_CONTAINER_RUNTIME = exports.SEMRESATTRS_CONTAINER_ID = exports.SEMRESATTRS_CONTAINER_NAME = exports.SEMRESATTRS_AWS_LOG_STREAM_ARNS = exports.SEMRESATTRS_AWS_LOG_STREAM_NAMES = exports.SEMRESATTRS_AWS_LOG_GROUP_ARNS = exports.SEMRESATTRS_AWS_LOG_GROUP_NAMES = exports.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = exports.SEMRESATTRS_AWS_ECS_TASK_REVISION = exports.SEMRESATTRS_AWS_ECS_TASK_FAMILY = exports.SEMRESATTRS_AWS_ECS_TASK_ARN = exports.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = exports.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = exports.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = exports.SEMRESATTRS_CLOUD_PLATFORM = exports.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = exports.SEMRESATTRS_CLOUD_REGION = exports.SEMRESATTRS_CLOUD_ACCOUNT_ID = exports.SEMRESATTRS_CLOUD_PROVIDER = void 0;
	exports.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = exports.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = exports.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = exports.CLOUDPLATFORMVALUES_AZURE_AKS = exports.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = exports.CLOUDPLATFORMVALUES_AZURE_VM = exports.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = exports.CLOUDPLATFORMVALUES_AWS_LAMBDA = exports.CLOUDPLATFORMVALUES_AWS_EKS = exports.CLOUDPLATFORMVALUES_AWS_ECS = exports.CLOUDPLATFORMVALUES_AWS_EC2 = exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = exports.CloudProviderValues = exports.CLOUDPROVIDERVALUES_GCP = exports.CLOUDPROVIDERVALUES_AZURE = exports.CLOUDPROVIDERVALUES_AWS = exports.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = exports.SemanticResourceAttributes = exports.SEMRESATTRS_WEBENGINE_DESCRIPTION = exports.SEMRESATTRS_WEBENGINE_VERSION = exports.SEMRESATTRS_WEBENGINE_NAME = exports.SEMRESATTRS_TELEMETRY_AUTO_VERSION = exports.SEMRESATTRS_TELEMETRY_SDK_VERSION = exports.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = exports.SEMRESATTRS_TELEMETRY_SDK_NAME = exports.SEMRESATTRS_SERVICE_VERSION = exports.SEMRESATTRS_SERVICE_INSTANCE_ID = exports.SEMRESATTRS_SERVICE_NAMESPACE = exports.SEMRESATTRS_SERVICE_NAME = exports.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = exports.SEMRESATTRS_PROCESS_RUNTIME_VERSION = exports.SEMRESATTRS_PROCESS_RUNTIME_NAME = exports.SEMRESATTRS_PROCESS_OWNER = exports.SEMRESATTRS_PROCESS_COMMAND_ARGS = exports.SEMRESATTRS_PROCESS_COMMAND_LINE = exports.SEMRESATTRS_PROCESS_COMMAND = exports.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = exports.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = exports.SEMRESATTRS_PROCESS_PID = exports.SEMRESATTRS_OS_VERSION = exports.SEMRESATTRS_OS_NAME = exports.SEMRESATTRS_OS_DESCRIPTION = exports.SEMRESATTRS_OS_TYPE = exports.SEMRESATTRS_K8S_CRONJOB_NAME = exports.SEMRESATTRS_K8S_CRONJOB_UID = exports.SEMRESATTRS_K8S_JOB_NAME = exports.SEMRESATTRS_K8S_JOB_UID = exports.SEMRESATTRS_K8S_DAEMONSET_NAME = exports.SEMRESATTRS_K8S_DAEMONSET_UID = void 0;
	exports.TelemetrySdkLanguageValues = exports.TELEMETRYSDKLANGUAGEVALUES_WEBJS = exports.TELEMETRYSDKLANGUAGEVALUES_RUBY = exports.TELEMETRYSDKLANGUAGEVALUES_PYTHON = exports.TELEMETRYSDKLANGUAGEVALUES_PHP = exports.TELEMETRYSDKLANGUAGEVALUES_NODEJS = exports.TELEMETRYSDKLANGUAGEVALUES_JAVA = exports.TELEMETRYSDKLANGUAGEVALUES_GO = exports.TELEMETRYSDKLANGUAGEVALUES_ERLANG = exports.TELEMETRYSDKLANGUAGEVALUES_DOTNET = exports.TELEMETRYSDKLANGUAGEVALUES_CPP = exports.OsTypeValues = exports.OSTYPEVALUES_Z_OS = exports.OSTYPEVALUES_SOLARIS = exports.OSTYPEVALUES_AIX = exports.OSTYPEVALUES_HPUX = exports.OSTYPEVALUES_DRAGONFLYBSD = exports.OSTYPEVALUES_OPENBSD = exports.OSTYPEVALUES_NETBSD = exports.OSTYPEVALUES_FREEBSD = exports.OSTYPEVALUES_DARWIN = exports.OSTYPEVALUES_LINUX = exports.OSTYPEVALUES_WINDOWS = exports.HostArchValues = exports.HOSTARCHVALUES_X86 = exports.HOSTARCHVALUES_PPC64 = exports.HOSTARCHVALUES_PPC32 = exports.HOSTARCHVALUES_IA64 = exports.HOSTARCHVALUES_ARM64 = exports.HOSTARCHVALUES_ARM32 = exports.HOSTARCHVALUES_AMD64 = exports.AwsEcsLaunchtypeValues = exports.AWSECSLAUNCHTYPEVALUES_FARGATE = exports.AWSECSLAUNCHTYPEVALUES_EC2 = exports.CloudPlatformValues = exports.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = exports.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = exports.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = exports.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = void 0;
	var utils_1 = require_utils();
	var TMP_CLOUD_PROVIDER = "cloud.provider";
	var TMP_CLOUD_ACCOUNT_ID = "cloud.account.id";
	var TMP_CLOUD_REGION = "cloud.region";
	var TMP_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
	var TMP_CLOUD_PLATFORM = "cloud.platform";
	var TMP_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
	var TMP_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
	var TMP_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
	var TMP_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
	var TMP_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
	var TMP_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
	var TMP_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
	var TMP_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
	var TMP_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
	var TMP_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
	var TMP_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
	var TMP_CONTAINER_NAME = "container.name";
	var TMP_CONTAINER_ID = "container.id";
	var TMP_CONTAINER_RUNTIME = "container.runtime";
	var TMP_CONTAINER_IMAGE_NAME = "container.image.name";
	var TMP_CONTAINER_IMAGE_TAG = "container.image.tag";
	var TMP_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
	var TMP_DEVICE_ID = "device.id";
	var TMP_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
	var TMP_DEVICE_MODEL_NAME = "device.model.name";
	var TMP_FAAS_NAME = "faas.name";
	var TMP_FAAS_ID = "faas.id";
	var TMP_FAAS_VERSION = "faas.version";
	var TMP_FAAS_INSTANCE = "faas.instance";
	var TMP_FAAS_MAX_MEMORY = "faas.max_memory";
	var TMP_HOST_ID = "host.id";
	var TMP_HOST_NAME = "host.name";
	var TMP_HOST_TYPE = "host.type";
	var TMP_HOST_ARCH = "host.arch";
	var TMP_HOST_IMAGE_NAME = "host.image.name";
	var TMP_HOST_IMAGE_ID = "host.image.id";
	var TMP_HOST_IMAGE_VERSION = "host.image.version";
	var TMP_K8S_CLUSTER_NAME = "k8s.cluster.name";
	var TMP_K8S_NODE_NAME = "k8s.node.name";
	var TMP_K8S_NODE_UID = "k8s.node.uid";
	var TMP_K8S_NAMESPACE_NAME = "k8s.namespace.name";
	var TMP_K8S_POD_UID = "k8s.pod.uid";
	var TMP_K8S_POD_NAME = "k8s.pod.name";
	var TMP_K8S_CONTAINER_NAME = "k8s.container.name";
	var TMP_K8S_REPLICASET_UID = "k8s.replicaset.uid";
	var TMP_K8S_REPLICASET_NAME = "k8s.replicaset.name";
	var TMP_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
	var TMP_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
	var TMP_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
	var TMP_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
	var TMP_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
	var TMP_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
	var TMP_K8S_JOB_UID = "k8s.job.uid";
	var TMP_K8S_JOB_NAME = "k8s.job.name";
	var TMP_K8S_CRONJOB_UID = "k8s.cronjob.uid";
	var TMP_K8S_CRONJOB_NAME = "k8s.cronjob.name";
	var TMP_OS_TYPE = "os.type";
	var TMP_OS_DESCRIPTION = "os.description";
	var TMP_OS_NAME = "os.name";
	var TMP_OS_VERSION = "os.version";
	var TMP_PROCESS_PID = "process.pid";
	var TMP_PROCESS_EXECUTABLE_NAME = "process.executable.name";
	var TMP_PROCESS_EXECUTABLE_PATH = "process.executable.path";
	var TMP_PROCESS_COMMAND = "process.command";
	var TMP_PROCESS_COMMAND_LINE = "process.command_line";
	var TMP_PROCESS_COMMAND_ARGS = "process.command_args";
	var TMP_PROCESS_OWNER = "process.owner";
	var TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
	var TMP_PROCESS_RUNTIME_VERSION = "process.runtime.version";
	var TMP_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
	var TMP_SERVICE_NAME = "service.name";
	var TMP_SERVICE_NAMESPACE = "service.namespace";
	var TMP_SERVICE_INSTANCE_ID = "service.instance.id";
	var TMP_SERVICE_VERSION = "service.version";
	var TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
	var TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
	var TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
	var TMP_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
	var TMP_WEBENGINE_NAME = "webengine.name";
	var TMP_WEBENGINE_VERSION = "webengine.version";
	var TMP_WEBENGINE_DESCRIPTION = "webengine.description";
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use ATTR_CLOUD_PROVIDER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_PROVIDER = TMP_CLOUD_PROVIDER;
	/**
	* The cloud account ID the resource is assigned to.
	*
	* @deprecated Use ATTR_CLOUD_ACCOUNT_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_ACCOUNT_ID = TMP_CLOUD_ACCOUNT_ID;
	/**
	* The geographical region the resource is running. Refer to your provider&#39;s docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/en-us/global-infrastructure/geographies/), or [Google Cloud regions](https://cloud.google.com/about/locations).
	*
	* @deprecated Use ATTR_CLOUD_REGION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_REGION = TMP_CLOUD_REGION;
	/**
	* Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
	*
	* Note: Availability zones are called &#34;zones&#34; on Alibaba Cloud and Google Cloud.
	*
	* @deprecated Use ATTR_CLOUD_AVAILABILITY_ZONE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = TMP_CLOUD_AVAILABILITY_ZONE;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use ATTR_CLOUD_PLATFORM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CLOUD_PLATFORM = TMP_CLOUD_PLATFORM;
	/**
	* The Amazon Resource Name (ARN) of an [ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_instances.html).
	*
	* @deprecated Use ATTR_AWS_ECS_CONTAINER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = TMP_AWS_ECS_CONTAINER_ARN;
	/**
	* The ARN of an [ECS cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html).
	*
	* @deprecated Use ATTR_AWS_ECS_CLUSTER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = TMP_AWS_ECS_CLUSTER_ARN;
	/**
	* The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
	*
	* @deprecated Use ATTR_AWS_ECS_LAUNCHTYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = TMP_AWS_ECS_LAUNCHTYPE;
	/**
	* The ARN of an [ECS task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html).
	*
	* @deprecated Use ATTR_AWS_ECS_TASK_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_TASK_ARN = TMP_AWS_ECS_TASK_ARN;
	/**
	* The task definition family this task definition is a member of.
	*
	* @deprecated Use ATTR_AWS_ECS_TASK_FAMILY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_TASK_FAMILY = TMP_AWS_ECS_TASK_FAMILY;
	/**
	* The revision for this task definition.
	*
	* @deprecated Use ATTR_AWS_ECS_TASK_REVISION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_ECS_TASK_REVISION = TMP_AWS_ECS_TASK_REVISION;
	/**
	* The ARN of an EKS cluster.
	*
	* @deprecated Use ATTR_AWS_EKS_CLUSTER_ARN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = TMP_AWS_EKS_CLUSTER_ARN;
	/**
	* The name(s) of the AWS log group(s) an application is writing to.
	*
	* Note: Multiple log groups must be supported for cases like multi-container applications, where a single application has sidecar containers, and each write to their own log group.
	*
	* @deprecated Use ATTR_AWS_LOG_GROUP_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_LOG_GROUP_NAMES = TMP_AWS_LOG_GROUP_NAMES;
	/**
	* The Amazon Resource Name(s) (ARN) of the AWS log group(s).
	*
	* Note: See the [log group ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format).
	*
	* @deprecated Use ATTR_AWS_LOG_GROUP_ARNS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_LOG_GROUP_ARNS = TMP_AWS_LOG_GROUP_ARNS;
	/**
	* The name(s) of the AWS log stream(s) an application is writing to.
	*
	* @deprecated Use ATTR_AWS_LOG_STREAM_NAMES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_LOG_STREAM_NAMES = TMP_AWS_LOG_STREAM_NAMES;
	/**
	* The ARN(s) of the AWS log stream(s).
	*
	* Note: See the [log stream ARN format documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/iam-access-control-overview-cwl.html#CWL_ARN_Format). One log group can contain several log streams, so these ARNs necessarily identify both a log group and a log stream.
	*
	* @deprecated Use ATTR_AWS_LOG_STREAM_ARNS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_AWS_LOG_STREAM_ARNS = TMP_AWS_LOG_STREAM_ARNS;
	/**
	* Container name.
	*
	* @deprecated Use ATTR_CONTAINER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_NAME = TMP_CONTAINER_NAME;
	/**
	* Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/reference/run/#container-identification). The UUID might be abbreviated.
	*
	* @deprecated Use ATTR_CONTAINER_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_ID = TMP_CONTAINER_ID;
	/**
	* The container runtime managing this container.
	*
	* @deprecated Use ATTR_CONTAINER_RUNTIME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_RUNTIME = TMP_CONTAINER_RUNTIME;
	/**
	* Name of the image the container was built on.
	*
	* @deprecated Use ATTR_CONTAINER_IMAGE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_IMAGE_NAME = TMP_CONTAINER_IMAGE_NAME;
	/**
	* Container image tag.
	*
	* @deprecated Use ATTR_CONTAINER_IMAGE_TAGS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_CONTAINER_IMAGE_TAG = TMP_CONTAINER_IMAGE_TAG;
	/**
	* Name of the [deployment environment](https://en.wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
	*
	* @deprecated Use ATTR_DEPLOYMENT_ENVIRONMENT in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = TMP_DEPLOYMENT_ENVIRONMENT;
	/**
	* A unique identifier representing the device.
	*
	* Note: The device identifier MUST only be defined using the values outlined below. This value is not an advertising identifier and MUST NOT be used as such. On iOS (Swift or Objective-C), this value MUST be equal to the [vendor identifier](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor). On Android (Java or Kotlin), this value MUST be equal to the Firebase Installation ID or a globally unique UUID which is persisted across sessions in your application. More information can be found [here](https://developer.android.com/training/articles/user-data-ids) on best practices and exact implementation details. Caution should be taken when storing personal data or anything which can identify a user. GDPR and data protection laws may apply, ensure you do your own due diligence.
	*
	* @deprecated Use ATTR_DEVICE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_DEVICE_ID = TMP_DEVICE_ID;
	/**
	* The model identifier for the device.
	*
	* Note: It&#39;s recommended this value represents a machine readable version of the model identifier rather than the market or consumer-friendly name of the device.
	*
	* @deprecated Use ATTR_DEVICE_MODEL_IDENTIFIER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = TMP_DEVICE_MODEL_IDENTIFIER;
	/**
	* The marketing name for the device model.
	*
	* Note: It&#39;s recommended this value represents a human readable version of the device model rather than a machine readable alternative.
	*
	* @deprecated Use ATTR_DEVICE_MODEL_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_DEVICE_MODEL_NAME = TMP_DEVICE_MODEL_NAME;
	/**
	* The name of the single function that this runtime instance executes.
	*
	* Note: This is the name of the function as configured/deployed on the FaaS platform and is usually different from the name of the callback function (which may be stored in the [`code.namespace`/`code.function`](../../trace/semantic_conventions/span-general.md#source-code-attributes) span attributes).
	*
	* @deprecated Use ATTR_FAAS_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_NAME = TMP_FAAS_NAME;
	/**
	* The unique ID of the single function that this runtime instance executes.
	*
	* Note: Depending on the cloud provider, use:
	
	* **AWS Lambda:** The function [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html).
	Take care not to use the &#34;invoked ARN&#34; directly but replace any
	[alias suffix](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html) with the resolved function version, as the same runtime instance may be invokable with multiple
	different aliases.
	* **GCP:** The [URI of the resource](https://cloud.google.com/iam/docs/full-resource-names)
	* **Azure:** The [Fully Qualified Resource ID](https://docs.microsoft.com/en-us/rest/api/resources/resources/get-by-id).
	
	On some providers, it may not be possible to determine the full ID at startup,
	which is why this field cannot be made required. For example, on AWS the account ID
	part of the ARN is not available without calling another AWS API
	which may be deemed too slow for a short-running lambda function.
	As an alternative, consider setting `faas.id` as a span attribute instead.
	*
	* @deprecated Use ATTR_CLOUD_RESOURCE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_ID = TMP_FAAS_ID;
	/**
	* The immutable version of the function being executed.
	*
	* Note: Depending on the cloud provider and platform, use:
	
	* **AWS Lambda:** The [function version](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
	(an integer represented as a decimal string).
	* **Google Cloud Run:** The [revision](https://cloud.google.com/run/docs/managing/revisions)
	(i.e., the function name plus the revision suffix).
	* **Google Cloud Functions:** The value of the
	[`K_REVISION` environment variable](https://cloud.google.com/functions/docs/env-var#runtime_environment_variables_set_automatically).
	* **Azure Functions:** Not applicable. Do not set this attribute.
	*
	* @deprecated Use ATTR_FAAS_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_VERSION = TMP_FAAS_VERSION;
	/**
	* The execution environment ID as a string, that will be potentially reused for other invocations to the same function/function version.
	*
	* Note: * **AWS Lambda:** Use the (full) log stream name.
	*
	* @deprecated Use ATTR_FAAS_INSTANCE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_INSTANCE = TMP_FAAS_INSTANCE;
	/**
	* The amount of memory available to the serverless function in MiB.
	*
	* Note: It&#39;s recommended to set this attribute since e.g. too little memory can easily stop a Java AWS Lambda function from working correctly. On AWS Lambda, the environment variable `AWS_LAMBDA_FUNCTION_MEMORY_SIZE` provides this information.
	*
	* @deprecated Use ATTR_FAAS_MAX_MEMORY in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_FAAS_MAX_MEMORY = TMP_FAAS_MAX_MEMORY;
	/**
	* Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider.
	*
	* @deprecated Use ATTR_HOST_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_ID = TMP_HOST_ID;
	/**
	* Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
	*
	* @deprecated Use ATTR_HOST_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_NAME = TMP_HOST_NAME;
	/**
	* Type of host. For Cloud, this must be the machine type.
	*
	* @deprecated Use ATTR_HOST_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_TYPE = TMP_HOST_TYPE;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use ATTR_HOST_ARCH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_ARCH = TMP_HOST_ARCH;
	/**
	* Name of the VM image or OS install the host was instantiated from.
	*
	* @deprecated Use ATTR_HOST_IMAGE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_IMAGE_NAME = TMP_HOST_IMAGE_NAME;
	/**
	* VM image ID. For Cloud, this value is from the provider.
	*
	* @deprecated Use ATTR_HOST_IMAGE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_IMAGE_ID = TMP_HOST_IMAGE_ID;
	/**
	* The version string of the VM image as defined in [Version Attributes](README.md#version-attributes).
	*
	* @deprecated Use ATTR_HOST_IMAGE_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_HOST_IMAGE_VERSION = TMP_HOST_IMAGE_VERSION;
	/**
	* The name of the cluster.
	*
	* @deprecated Use ATTR_K8S_CLUSTER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_CLUSTER_NAME = TMP_K8S_CLUSTER_NAME;
	/**
	* The name of the Node.
	*
	* @deprecated Use ATTR_K8S_NODE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_NODE_NAME = TMP_K8S_NODE_NAME;
	/**
	* The UID of the Node.
	*
	* @deprecated Use ATTR_K8S_NODE_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_NODE_UID = TMP_K8S_NODE_UID;
	/**
	* The name of the namespace that the pod is running in.
	*
	* @deprecated Use ATTR_K8S_NAMESPACE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_NAMESPACE_NAME = TMP_K8S_NAMESPACE_NAME;
	/**
	* The UID of the Pod.
	*
	* @deprecated Use ATTR_K8S_POD_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_POD_UID = TMP_K8S_POD_UID;
	/**
	* The name of the Pod.
	*
	* @deprecated Use ATTR_K8S_POD_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_POD_NAME = TMP_K8S_POD_NAME;
	/**
	* The name of the Container in a Pod template.
	*
	* @deprecated Use ATTR_K8S_CONTAINER_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_CONTAINER_NAME = TMP_K8S_CONTAINER_NAME;
	/**
	* The UID of the ReplicaSet.
	*
	* @deprecated Use ATTR_K8S_REPLICASET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_REPLICASET_UID = TMP_K8S_REPLICASET_UID;
	/**
	* The name of the ReplicaSet.
	*
	* @deprecated Use ATTR_K8S_REPLICASET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_REPLICASET_NAME = TMP_K8S_REPLICASET_NAME;
	/**
	* The UID of the Deployment.
	*
	* @deprecated Use ATTR_K8S_DEPLOYMENT_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_DEPLOYMENT_UID = TMP_K8S_DEPLOYMENT_UID;
	/**
	* The name of the Deployment.
	*
	* @deprecated Use ATTR_K8S_DEPLOYMENT_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_DEPLOYMENT_NAME = TMP_K8S_DEPLOYMENT_NAME;
	/**
	* The UID of the StatefulSet.
	*
	* @deprecated Use ATTR_K8S_STATEFULSET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_STATEFULSET_UID = TMP_K8S_STATEFULSET_UID;
	/**
	* The name of the StatefulSet.
	*
	* @deprecated Use ATTR_K8S_STATEFULSET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_STATEFULSET_NAME = TMP_K8S_STATEFULSET_NAME;
	/**
	* The UID of the DaemonSet.
	*
	* @deprecated Use ATTR_K8S_DAEMONSET_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_DAEMONSET_UID = TMP_K8S_DAEMONSET_UID;
	/**
	* The name of the DaemonSet.
	*
	* @deprecated Use ATTR_K8S_DAEMONSET_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_DAEMONSET_NAME = TMP_K8S_DAEMONSET_NAME;
	/**
	* The UID of the Job.
	*
	* @deprecated Use ATTR_K8S_JOB_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_JOB_UID = TMP_K8S_JOB_UID;
	/**
	* The name of the Job.
	*
	* @deprecated Use ATTR_K8S_JOB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_JOB_NAME = TMP_K8S_JOB_NAME;
	/**
	* The UID of the CronJob.
	*
	* @deprecated Use ATTR_K8S_CRONJOB_UID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_CRONJOB_UID = TMP_K8S_CRONJOB_UID;
	/**
	* The name of the CronJob.
	*
	* @deprecated Use ATTR_K8S_CRONJOB_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_K8S_CRONJOB_NAME = TMP_K8S_CRONJOB_NAME;
	/**
	* The operating system type.
	*
	* @deprecated Use ATTR_OS_TYPE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_OS_TYPE = TMP_OS_TYPE;
	/**
	* Human readable (not intended to be parsed) OS version information, like e.g. reported by `ver` or `lsb_release -a` commands.
	*
	* @deprecated Use ATTR_OS_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_OS_DESCRIPTION = TMP_OS_DESCRIPTION;
	/**
	* Human readable operating system name.
	*
	* @deprecated Use ATTR_OS_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_OS_NAME = TMP_OS_NAME;
	/**
	* The version string of the operating system as defined in [Version Attributes](../../resource/semantic_conventions/README.md#version-attributes).
	*
	* @deprecated Use ATTR_OS_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_OS_VERSION = TMP_OS_VERSION;
	/**
	* Process identifier (PID).
	*
	* @deprecated Use ATTR_PROCESS_PID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_PID = TMP_PROCESS_PID;
	/**
	* The name of the process executable. On Linux based systems, can be set to the `Name` in `proc/[pid]/status`. On Windows, can be set to the base name of `GetProcessImageFileNameW`.
	*
	* @deprecated Use ATTR_PROCESS_EXECUTABLE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = TMP_PROCESS_EXECUTABLE_NAME;
	/**
	* The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
	*
	* @deprecated Use ATTR_PROCESS_EXECUTABLE_PATH in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = TMP_PROCESS_EXECUTABLE_PATH;
	/**
	* The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
	*
	* @deprecated Use ATTR_PROCESS_COMMAND in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_COMMAND = TMP_PROCESS_COMMAND;
	/**
	* The full command used to launch the process as a single string representing the full command. On Windows, can be set to the result of `GetCommandLineW`. Do not set this if you have to assemble it just for monitoring; use `process.command_args` instead.
	*
	* @deprecated Use ATTR_PROCESS_COMMAND_LINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_COMMAND_LINE = TMP_PROCESS_COMMAND_LINE;
	/**
	* All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
	*
	* @deprecated Use ATTR_PROCESS_COMMAND_ARGS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_COMMAND_ARGS = TMP_PROCESS_COMMAND_ARGS;
	/**
	* The username of the user that owns the process.
	*
	* @deprecated Use ATTR_PROCESS_OWNER in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_OWNER = TMP_PROCESS_OWNER;
	/**
	* The name of the runtime of this process. For compiled native binaries, this SHOULD be the name of the compiler.
	*
	* @deprecated Use ATTR_PROCESS_RUNTIME_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
	/**
	* The version of the runtime of this process, as returned by the runtime without modification.
	*
	* @deprecated Use ATTR_PROCESS_RUNTIME_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_RUNTIME_VERSION = TMP_PROCESS_RUNTIME_VERSION;
	/**
	* An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
	*
	* @deprecated Use ATTR_PROCESS_RUNTIME_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = TMP_PROCESS_RUNTIME_DESCRIPTION;
	/**
	* Logical name of the service.
	*
	* Note: MUST be the same for all instances of horizontally scaled services. If the value was not specified, SDKs MUST fallback to `unknown_service:` concatenated with [`process.executable.name`](process.md#process), e.g. `unknown_service:bash`. If `process.executable.name` is not available, the value MUST be set to `unknown_service`.
	*
	* @deprecated Use ATTR_SERVICE_NAME.
	*/
	exports.SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
	/**
	* A namespace for `service.name`.
	*
	* Note: A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
	*
	* @deprecated Use ATTR_SERVICE_NAMESPACE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_SERVICE_NAMESPACE = TMP_SERVICE_NAMESPACE;
	/**
	* The string ID of the service instance.
	*
	* Note: MUST be unique for each instance of the same `service.namespace,service.name` pair (in other words `service.namespace,service.name,service.instance.id` triplet MUST be globally unique). The ID helps to distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled service). It is preferable for the ID to be persistent and stay the same for the lifetime of the service instance, however it is acceptable that the ID is ephemeral and changes during important lifetime events for the service (e.g. service restarts). If the service has no inherent unique ID that can be used as the value of this attribute it is recommended to generate a random Version 1 or Version 4 RFC 4122 UUID (services aiming for reproducible UUIDs may also use Version 5, see RFC 4122 for more recommendations).
	*
	* @deprecated Use ATTR_SERVICE_INSTANCE_ID in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_SERVICE_INSTANCE_ID = TMP_SERVICE_INSTANCE_ID;
	/**
	* The version string of the service API or implementation.
	*
	* @deprecated Use ATTR_SERVICE_VERSION.
	*/
	exports.SEMRESATTRS_SERVICE_VERSION = TMP_SERVICE_VERSION;
	/**
	* The name of the telemetry SDK as defined above.
	*
	* @deprecated Use ATTR_TELEMETRY_SDK_NAME.
	*/
	exports.SEMRESATTRS_TELEMETRY_SDK_NAME = TMP_TELEMETRY_SDK_NAME;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use ATTR_TELEMETRY_SDK_LANGUAGE.
	*/
	exports.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = TMP_TELEMETRY_SDK_LANGUAGE;
	/**
	* The version string of the telemetry SDK.
	*
	* @deprecated Use ATTR_TELEMETRY_SDK_VERSION.
	*/
	exports.SEMRESATTRS_TELEMETRY_SDK_VERSION = TMP_TELEMETRY_SDK_VERSION;
	/**
	* The version string of the auto instrumentation agent, if used.
	*
	* @deprecated Use ATTR_TELEMETRY_DISTRO_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_TELEMETRY_AUTO_VERSION = TMP_TELEMETRY_AUTO_VERSION;
	/**
	* The name of the web engine.
	*
	* @deprecated Use ATTR_WEBENGINE_NAME in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_WEBENGINE_NAME = TMP_WEBENGINE_NAME;
	/**
	* The version of the web engine.
	*
	* @deprecated Use ATTR_WEBENGINE_VERSION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_WEBENGINE_VERSION = TMP_WEBENGINE_VERSION;
	/**
	* Additional description of the web engine (e.g. detailed version and edition information).
	*
	* @deprecated Use ATTR_WEBENGINE_DESCRIPTION in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.SEMRESATTRS_WEBENGINE_DESCRIPTION = TMP_WEBENGINE_DESCRIPTION;
	/**
	* Create exported Value Map for SemanticResourceAttributes values
	* @deprecated Use the SEMRESATTRS_XXXXX constants rather than the SemanticResourceAttributes.XXXXX for bundle minification
	*/
	exports.SemanticResourceAttributes = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_CLOUD_PROVIDER,
		TMP_CLOUD_ACCOUNT_ID,
		TMP_CLOUD_REGION,
		TMP_CLOUD_AVAILABILITY_ZONE,
		TMP_CLOUD_PLATFORM,
		TMP_AWS_ECS_CONTAINER_ARN,
		TMP_AWS_ECS_CLUSTER_ARN,
		TMP_AWS_ECS_LAUNCHTYPE,
		TMP_AWS_ECS_TASK_ARN,
		TMP_AWS_ECS_TASK_FAMILY,
		TMP_AWS_ECS_TASK_REVISION,
		TMP_AWS_EKS_CLUSTER_ARN,
		TMP_AWS_LOG_GROUP_NAMES,
		TMP_AWS_LOG_GROUP_ARNS,
		TMP_AWS_LOG_STREAM_NAMES,
		TMP_AWS_LOG_STREAM_ARNS,
		TMP_CONTAINER_NAME,
		TMP_CONTAINER_ID,
		TMP_CONTAINER_RUNTIME,
		TMP_CONTAINER_IMAGE_NAME,
		TMP_CONTAINER_IMAGE_TAG,
		TMP_DEPLOYMENT_ENVIRONMENT,
		TMP_DEVICE_ID,
		TMP_DEVICE_MODEL_IDENTIFIER,
		TMP_DEVICE_MODEL_NAME,
		TMP_FAAS_NAME,
		TMP_FAAS_ID,
		TMP_FAAS_VERSION,
		TMP_FAAS_INSTANCE,
		TMP_FAAS_MAX_MEMORY,
		TMP_HOST_ID,
		TMP_HOST_NAME,
		TMP_HOST_TYPE,
		TMP_HOST_ARCH,
		TMP_HOST_IMAGE_NAME,
		TMP_HOST_IMAGE_ID,
		TMP_HOST_IMAGE_VERSION,
		TMP_K8S_CLUSTER_NAME,
		TMP_K8S_NODE_NAME,
		TMP_K8S_NODE_UID,
		TMP_K8S_NAMESPACE_NAME,
		TMP_K8S_POD_UID,
		TMP_K8S_POD_NAME,
		TMP_K8S_CONTAINER_NAME,
		TMP_K8S_REPLICASET_UID,
		TMP_K8S_REPLICASET_NAME,
		TMP_K8S_DEPLOYMENT_UID,
		TMP_K8S_DEPLOYMENT_NAME,
		TMP_K8S_STATEFULSET_UID,
		TMP_K8S_STATEFULSET_NAME,
		TMP_K8S_DAEMONSET_UID,
		TMP_K8S_DAEMONSET_NAME,
		TMP_K8S_JOB_UID,
		TMP_K8S_JOB_NAME,
		TMP_K8S_CRONJOB_UID,
		TMP_K8S_CRONJOB_NAME,
		TMP_OS_TYPE,
		TMP_OS_DESCRIPTION,
		TMP_OS_NAME,
		TMP_OS_VERSION,
		TMP_PROCESS_PID,
		TMP_PROCESS_EXECUTABLE_NAME,
		TMP_PROCESS_EXECUTABLE_PATH,
		TMP_PROCESS_COMMAND,
		TMP_PROCESS_COMMAND_LINE,
		TMP_PROCESS_COMMAND_ARGS,
		TMP_PROCESS_OWNER,
		TMP_PROCESS_RUNTIME_NAME,
		TMP_PROCESS_RUNTIME_VERSION,
		TMP_PROCESS_RUNTIME_DESCRIPTION,
		TMP_SERVICE_NAME,
		TMP_SERVICE_NAMESPACE,
		TMP_SERVICE_INSTANCE_ID,
		TMP_SERVICE_VERSION,
		TMP_TELEMETRY_SDK_NAME,
		TMP_TELEMETRY_SDK_LANGUAGE,
		TMP_TELEMETRY_SDK_VERSION,
		TMP_TELEMETRY_AUTO_VERSION,
		TMP_WEBENGINE_NAME,
		TMP_WEBENGINE_VERSION,
		TMP_WEBENGINE_DESCRIPTION
	]);
	var TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
	var TMP_CLOUDPROVIDERVALUES_AWS = "aws";
	var TMP_CLOUDPROVIDERVALUES_AZURE = "azure";
	var TMP_CLOUDPROVIDERVALUES_GCP = "gcp";
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use CLOUD_PROVIDER_VALUE_ALIBABA_CLOUD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD;
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use CLOUD_PROVIDER_VALUE_AWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPROVIDERVALUES_AWS = TMP_CLOUDPROVIDERVALUES_AWS;
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use CLOUD_PROVIDER_VALUE_AZURE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPROVIDERVALUES_AZURE = TMP_CLOUDPROVIDERVALUES_AZURE;
	/**
	* Name of the cloud provider.
	*
	* @deprecated Use CLOUD_PROVIDER_VALUE_GCP in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPROVIDERVALUES_GCP = TMP_CLOUDPROVIDERVALUES_GCP;
	/**
	* The constant map of values for CloudProviderValues.
	* @deprecated Use the CLOUDPROVIDERVALUES_XXXXX constants rather than the CloudProviderValues.XXXXX for bundle minification.
	*/
	exports.CloudProviderValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD,
		TMP_CLOUDPROVIDERVALUES_AWS,
		TMP_CLOUDPROVIDERVALUES_AZURE,
		TMP_CLOUDPROVIDERVALUES_GCP
	]);
	var TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
	var TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
	var TMP_CLOUDPLATFORMVALUES_AWS_EC2 = "aws_ec2";
	var TMP_CLOUDPLATFORMVALUES_AWS_ECS = "aws_ecs";
	var TMP_CLOUDPLATFORMVALUES_AWS_EKS = "aws_eks";
	var TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA = "aws_lambda";
	var TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
	var TMP_CLOUDPLATFORMVALUES_AZURE_VM = "azure_vm";
	var TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = "azure_container_instances";
	var TMP_CLOUDPLATFORMVALUES_AZURE_AKS = "azure_aks";
	var TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = "azure_functions";
	var TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = "azure_app_service";
	var TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
	var TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = "gcp_cloud_run";
	var TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
	var TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
	var TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE = "gcp_app_engine";
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_ECS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_ALIBABA_CLOUD_FC in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_EC2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_EC2 = TMP_CLOUDPLATFORMVALUES_AWS_EC2;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_ECS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_ECS = TMP_CLOUDPLATFORMVALUES_AWS_ECS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_EKS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_EKS = TMP_CLOUDPLATFORMVALUES_AWS_EKS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_LAMBDA in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_LAMBDA = TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AWS_ELASTIC_BEANSTALK in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_VM in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_VM = TMP_CLOUDPLATFORMVALUES_AZURE_VM;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_CONTAINER_INSTANCES in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_AKS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_AKS = TMP_CLOUDPLATFORMVALUES_AZURE_AKS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_FUNCTIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_AZURE_APP_SERVICE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_COMPUTE_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_CLOUD_RUN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_KUBERNETES_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_CLOUD_FUNCTIONS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS;
	/**
	* The cloud platform in use.
	*
	* Note: The prefix of the service SHOULD match the one specified in `cloud.provider`.
	*
	* @deprecated Use CLOUD_PLATFORM_VALUE_GCP_APP_ENGINE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE;
	/**
	* The constant map of values for CloudPlatformValues.
	* @deprecated Use the CLOUDPLATFORMVALUES_XXXXX constants rather than the CloudPlatformValues.XXXXX for bundle minification.
	*/
	exports.CloudPlatformValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS,
		TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC,
		TMP_CLOUDPLATFORMVALUES_AWS_EC2,
		TMP_CLOUDPLATFORMVALUES_AWS_ECS,
		TMP_CLOUDPLATFORMVALUES_AWS_EKS,
		TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA,
		TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK,
		TMP_CLOUDPLATFORMVALUES_AZURE_VM,
		TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES,
		TMP_CLOUDPLATFORMVALUES_AZURE_AKS,
		TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS,
		TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE,
		TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE,
		TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN,
		TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE,
		TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS,
		TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE
	]);
	var TMP_AWSECSLAUNCHTYPEVALUES_EC2 = "ec2";
	var TMP_AWSECSLAUNCHTYPEVALUES_FARGATE = "fargate";
	/**
	* The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
	*
	* @deprecated Use AWS_ECS_LAUNCHTYPE_VALUE_EC2 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.AWSECSLAUNCHTYPEVALUES_EC2 = TMP_AWSECSLAUNCHTYPEVALUES_EC2;
	/**
	* The [launch type](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html) for an ECS task.
	*
	* @deprecated Use AWS_ECS_LAUNCHTYPE_VALUE_FARGATE in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.AWSECSLAUNCHTYPEVALUES_FARGATE = TMP_AWSECSLAUNCHTYPEVALUES_FARGATE;
	/**
	* The constant map of values for AwsEcsLaunchtypeValues.
	* @deprecated Use the AWSECSLAUNCHTYPEVALUES_XXXXX constants rather than the AwsEcsLaunchtypeValues.XXXXX for bundle minification.
	*/
	exports.AwsEcsLaunchtypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([TMP_AWSECSLAUNCHTYPEVALUES_EC2, TMP_AWSECSLAUNCHTYPEVALUES_FARGATE]);
	var TMP_HOSTARCHVALUES_AMD64 = "amd64";
	var TMP_HOSTARCHVALUES_ARM32 = "arm32";
	var TMP_HOSTARCHVALUES_ARM64 = "arm64";
	var TMP_HOSTARCHVALUES_IA64 = "ia64";
	var TMP_HOSTARCHVALUES_PPC32 = "ppc32";
	var TMP_HOSTARCHVALUES_PPC64 = "ppc64";
	var TMP_HOSTARCHVALUES_X86 = "x86";
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_AMD64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_AMD64 = TMP_HOSTARCHVALUES_AMD64;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_ARM32 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_ARM32 = TMP_HOSTARCHVALUES_ARM32;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_ARM64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_ARM64 = TMP_HOSTARCHVALUES_ARM64;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_IA64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_IA64 = TMP_HOSTARCHVALUES_IA64;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_PPC32 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_PPC32 = TMP_HOSTARCHVALUES_PPC32;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_PPC64 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_PPC64 = TMP_HOSTARCHVALUES_PPC64;
	/**
	* The CPU architecture the host system is running on.
	*
	* @deprecated Use HOST_ARCH_VALUE_X86 in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.HOSTARCHVALUES_X86 = TMP_HOSTARCHVALUES_X86;
	/**
	* The constant map of values for HostArchValues.
	* @deprecated Use the HOSTARCHVALUES_XXXXX constants rather than the HostArchValues.XXXXX for bundle minification.
	*/
	exports.HostArchValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_HOSTARCHVALUES_AMD64,
		TMP_HOSTARCHVALUES_ARM32,
		TMP_HOSTARCHVALUES_ARM64,
		TMP_HOSTARCHVALUES_IA64,
		TMP_HOSTARCHVALUES_PPC32,
		TMP_HOSTARCHVALUES_PPC64,
		TMP_HOSTARCHVALUES_X86
	]);
	var TMP_OSTYPEVALUES_WINDOWS = "windows";
	var TMP_OSTYPEVALUES_LINUX = "linux";
	var TMP_OSTYPEVALUES_DARWIN = "darwin";
	var TMP_OSTYPEVALUES_FREEBSD = "freebsd";
	var TMP_OSTYPEVALUES_NETBSD = "netbsd";
	var TMP_OSTYPEVALUES_OPENBSD = "openbsd";
	var TMP_OSTYPEVALUES_DRAGONFLYBSD = "dragonflybsd";
	var TMP_OSTYPEVALUES_HPUX = "hpux";
	var TMP_OSTYPEVALUES_AIX = "aix";
	var TMP_OSTYPEVALUES_SOLARIS = "solaris";
	var TMP_OSTYPEVALUES_Z_OS = "z_os";
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_WINDOWS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_WINDOWS = TMP_OSTYPEVALUES_WINDOWS;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_LINUX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_LINUX = TMP_OSTYPEVALUES_LINUX;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_DARWIN in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_DARWIN = TMP_OSTYPEVALUES_DARWIN;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_FREEBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_FREEBSD = TMP_OSTYPEVALUES_FREEBSD;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_NETBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_NETBSD = TMP_OSTYPEVALUES_NETBSD;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_OPENBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_OPENBSD = TMP_OSTYPEVALUES_OPENBSD;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_DRAGONFLYBSD in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_DRAGONFLYBSD = TMP_OSTYPEVALUES_DRAGONFLYBSD;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_HPUX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_HPUX = TMP_OSTYPEVALUES_HPUX;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_AIX in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_AIX = TMP_OSTYPEVALUES_AIX;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_SOLARIS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_SOLARIS = TMP_OSTYPEVALUES_SOLARIS;
	/**
	* The operating system type.
	*
	* @deprecated Use OS_TYPE_VALUE_Z_OS in [incubating entry-point]({@link https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv}).
	*/
	exports.OSTYPEVALUES_Z_OS = TMP_OSTYPEVALUES_Z_OS;
	/**
	* The constant map of values for OsTypeValues.
	* @deprecated Use the OSTYPEVALUES_XXXXX constants rather than the OsTypeValues.XXXXX for bundle minification.
	*/
	exports.OsTypeValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_OSTYPEVALUES_WINDOWS,
		TMP_OSTYPEVALUES_LINUX,
		TMP_OSTYPEVALUES_DARWIN,
		TMP_OSTYPEVALUES_FREEBSD,
		TMP_OSTYPEVALUES_NETBSD,
		TMP_OSTYPEVALUES_OPENBSD,
		TMP_OSTYPEVALUES_DRAGONFLYBSD,
		TMP_OSTYPEVALUES_HPUX,
		TMP_OSTYPEVALUES_AIX,
		TMP_OSTYPEVALUES_SOLARIS,
		TMP_OSTYPEVALUES_Z_OS
	]);
	var TMP_TELEMETRYSDKLANGUAGEVALUES_CPP = "cpp";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET = "dotnet";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG = "erlang";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_GO = "go";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA = "java";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS = "nodejs";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_PHP = "php";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON = "python";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY = "ruby";
	var TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_CPP.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_CPP = TMP_TELEMETRYSDKLANGUAGEVALUES_CPP;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_DOTNET = TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_ERLANG = TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_GO.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_GO = TMP_TELEMETRYSDKLANGUAGEVALUES_GO;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_JAVA.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_JAVA = TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_NODEJS = TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_PHP.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_PHP = TMP_TELEMETRYSDKLANGUAGEVALUES_PHP;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_PYTHON = TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_RUBY.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_RUBY = TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY;
	/**
	* The language of the telemetry SDK.
	*
	* @deprecated Use TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS.
	*/
	exports.TELEMETRYSDKLANGUAGEVALUES_WEBJS = TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS;
	/**
	* The constant map of values for TelemetrySdkLanguageValues.
	* @deprecated Use the TELEMETRYSDKLANGUAGEVALUES_XXXXX constants rather than the TelemetrySdkLanguageValues.XXXXX for bundle minification.
	*/
	exports.TelemetrySdkLanguageValues = /*#__PURE__*/ (0, utils_1.createConstMap)([
		TMP_TELEMETRYSDKLANGUAGEVALUES_CPP,
		TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET,
		TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG,
		TMP_TELEMETRYSDKLANGUAGEVALUES_GO,
		TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA,
		TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS,
		TMP_TELEMETRYSDKLANGUAGEVALUES_PHP,
		TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON,
		TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY,
		TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS
	]);
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/src/resource/index.js
var require_resource = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_SemanticResourceAttributes(), exports);
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/src/stable_attributes.js
var require_stable_attributes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = exports.ATTR_DOTNET_GC_HEAP_GENERATION = exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST = exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING = exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION = exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT = exports.ATTR_DEPLOYMENT_ENVIRONMENT_NAME = exports.DB_SYSTEM_NAME_VALUE_POSTGRESQL = exports.DB_SYSTEM_NAME_VALUE_MYSQL = exports.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = exports.DB_SYSTEM_NAME_VALUE_MARIADB = exports.ATTR_DB_SYSTEM_NAME = exports.ATTR_DB_STORED_PROCEDURE_NAME = exports.ATTR_DB_RESPONSE_STATUS_CODE = exports.ATTR_DB_QUERY_TEXT = exports.ATTR_DB_QUERY_SUMMARY = exports.ATTR_DB_OPERATION_NAME = exports.ATTR_DB_OPERATION_BATCH_SIZE = exports.ATTR_DB_NAMESPACE = exports.ATTR_DB_COLLECTION_NAME = exports.ATTR_CONTAINER_IMAGE_TAGS = exports.ATTR_CONTAINER_IMAGE_REPO_DIGESTS = exports.ATTR_CONTAINER_IMAGE_NAME = exports.ATTR_CONTAINER_ID = exports.ATTR_CODE_STACKTRACE = exports.ATTR_CODE_LINE_NUMBER = exports.ATTR_CODE_FUNCTION_NAME = exports.ATTR_CODE_FILE_PATH = exports.ATTR_CODE_COLUMN_NUMBER = exports.ATTR_CLIENT_PORT = exports.ATTR_CLIENT_ADDRESS = exports.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = exports.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = exports.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = exports.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = exports.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = exports.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = exports.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = exports.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = void 0;
	exports.ATTR_K8S_DAEMONSET_LABEL = exports.ATTR_K8S_DAEMONSET_ANNOTATION = exports.ATTR_K8S_CRONJOB_UID = exports.ATTR_K8S_CRONJOB_NAME = exports.ATTR_K8S_CRONJOB_LABEL = exports.ATTR_K8S_CRONJOB_ANNOTATION = exports.ATTR_K8S_CONTAINER_RESTART_COUNT = exports.ATTR_K8S_CONTAINER_NAME = exports.ATTR_K8S_CLUSTER_UID = exports.ATTR_K8S_CLUSTER_NAME = exports.JVM_THREAD_STATE_VALUE_WAITING = exports.JVM_THREAD_STATE_VALUE_TIMED_WAITING = exports.JVM_THREAD_STATE_VALUE_TERMINATED = exports.JVM_THREAD_STATE_VALUE_RUNNABLE = exports.JVM_THREAD_STATE_VALUE_NEW = exports.JVM_THREAD_STATE_VALUE_BLOCKED = exports.ATTR_JVM_THREAD_STATE = exports.ATTR_JVM_THREAD_DAEMON = exports.JVM_MEMORY_TYPE_VALUE_NON_HEAP = exports.JVM_MEMORY_TYPE_VALUE_HEAP = exports.ATTR_JVM_MEMORY_TYPE = exports.ATTR_JVM_MEMORY_POOL_NAME = exports.ATTR_JVM_GC_NAME = exports.ATTR_JVM_GC_ACTION = exports.ATTR_HTTP_ROUTE = exports.ATTR_HTTP_RESPONSE_STATUS_CODE = exports.ATTR_HTTP_RESPONSE_HEADER = exports.ATTR_HTTP_REQUEST_RESEND_COUNT = exports.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = exports.HTTP_REQUEST_METHOD_VALUE_TRACE = exports.HTTP_REQUEST_METHOD_VALUE_PUT = exports.HTTP_REQUEST_METHOD_VALUE_POST = exports.HTTP_REQUEST_METHOD_VALUE_PATCH = exports.HTTP_REQUEST_METHOD_VALUE_OPTIONS = exports.HTTP_REQUEST_METHOD_VALUE_HEAD = exports.HTTP_REQUEST_METHOD_VALUE_GET = exports.HTTP_REQUEST_METHOD_VALUE_DELETE = exports.HTTP_REQUEST_METHOD_VALUE_CONNECT = exports.HTTP_REQUEST_METHOD_VALUE_OTHER = exports.ATTR_HTTP_REQUEST_METHOD = exports.ATTR_HTTP_REQUEST_HEADER = exports.ATTR_EXCEPTION_TYPE = exports.ATTR_EXCEPTION_STACKTRACE = exports.ATTR_EXCEPTION_MESSAGE = exports.ATTR_EXCEPTION_ESCAPED = exports.ERROR_TYPE_VALUE_OTHER = exports.ATTR_ERROR_TYPE = exports.DOTNET_GC_HEAP_GENERATION_VALUE_POH = exports.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = void 0;
	exports.ATTR_OTEL_SCOPE_VERSION = exports.ATTR_OTEL_SCOPE_NAME = exports.ATTR_OTEL_EVENT_NAME = exports.NETWORK_TYPE_VALUE_IPV6 = exports.NETWORK_TYPE_VALUE_IPV4 = exports.ATTR_NETWORK_TYPE = exports.NETWORK_TRANSPORT_VALUE_UNIX = exports.NETWORK_TRANSPORT_VALUE_UDP = exports.NETWORK_TRANSPORT_VALUE_TCP = exports.NETWORK_TRANSPORT_VALUE_QUIC = exports.NETWORK_TRANSPORT_VALUE_PIPE = exports.ATTR_NETWORK_TRANSPORT = exports.ATTR_NETWORK_PROTOCOL_VERSION = exports.ATTR_NETWORK_PROTOCOL_NAME = exports.ATTR_NETWORK_PEER_PORT = exports.ATTR_NETWORK_PEER_ADDRESS = exports.ATTR_NETWORK_LOCAL_PORT = exports.ATTR_NETWORK_LOCAL_ADDRESS = exports.ATTR_K8S_STATEFULSET_UID = exports.ATTR_K8S_STATEFULSET_NAME = exports.ATTR_K8S_STATEFULSET_LABEL = exports.ATTR_K8S_STATEFULSET_ANNOTATION = exports.ATTR_K8S_REPLICASET_UID = exports.ATTR_K8S_REPLICASET_NAME = exports.ATTR_K8S_REPLICASET_LABEL = exports.ATTR_K8S_REPLICASET_ANNOTATION = exports.ATTR_K8S_POD_UID = exports.ATTR_K8S_POD_START_TIME = exports.ATTR_K8S_POD_NAME = exports.ATTR_K8S_POD_LABEL = exports.ATTR_K8S_POD_IP = exports.ATTR_K8S_POD_HOSTNAME = exports.ATTR_K8S_POD_ANNOTATION = exports.ATTR_K8S_NODE_UID = exports.ATTR_K8S_NODE_NAME = exports.ATTR_K8S_NODE_LABEL = exports.ATTR_K8S_NODE_ANNOTATION = exports.ATTR_K8S_NAMESPACE_NAME = exports.ATTR_K8S_NAMESPACE_LABEL = exports.ATTR_K8S_NAMESPACE_ANNOTATION = exports.ATTR_K8S_JOB_UID = exports.ATTR_K8S_JOB_NAME = exports.ATTR_K8S_JOB_LABEL = exports.ATTR_K8S_JOB_ANNOTATION = exports.ATTR_K8S_DEPLOYMENT_UID = exports.ATTR_K8S_DEPLOYMENT_NAME = exports.ATTR_K8S_DEPLOYMENT_LABEL = exports.ATTR_K8S_DEPLOYMENT_ANNOTATION = exports.ATTR_K8S_DAEMONSET_UID = exports.ATTR_K8S_DAEMONSET_NAME = void 0;
	exports.ATTR_USER_AGENT_ORIGINAL = exports.ATTR_URL_SCHEME = exports.ATTR_URL_QUERY = exports.ATTR_URL_PATH = exports.ATTR_URL_FULL = exports.ATTR_URL_FRAGMENT = exports.ATTR_TELEMETRY_SDK_VERSION = exports.ATTR_TELEMETRY_SDK_NAME = exports.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = exports.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = exports.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = exports.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = exports.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = exports.TELEMETRY_SDK_LANGUAGE_VALUE_KOTLIN = exports.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = exports.TELEMETRY_SDK_LANGUAGE_VALUE_GO = exports.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = exports.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = exports.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = exports.ATTR_TELEMETRY_SDK_LANGUAGE = exports.ATTR_TELEMETRY_DISTRO_VERSION = exports.ATTR_TELEMETRY_DISTRO_NAME = exports.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = exports.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = exports.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = exports.ATTR_SIGNALR_TRANSPORT = exports.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = exports.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = exports.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = exports.ATTR_SIGNALR_CONNECTION_STATUS = exports.ATTR_SERVICE_VERSION = exports.ATTR_SERVICE_NAMESPACE = exports.ATTR_SERVICE_NAME = exports.ATTR_SERVICE_INSTANCE_ID = exports.ATTR_SERVER_PORT = exports.ATTR_SERVER_ADDRESS = exports.ATTR_OTEL_STATUS_DESCRIPTION = exports.OTEL_STATUS_CODE_VALUE_OK = exports.OTEL_STATUS_CODE_VALUE_ERROR = exports.ATTR_OTEL_STATUS_CODE = void 0;
	/**
	* ASP.NET Core exception middleware handling result.
	*
	* @example handled
	* @example unhandled
	*/
	exports.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = "aspnetcore.diagnostics.exception.result";
	/**
	* Enum value "aborted" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
	*
	* Exception handling didn't run because the request was aborted.
	*/
	exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = "aborted";
	/**
	* Enum value "handled" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
	*
	* Exception was handled by the exception handling middleware.
	*/
	exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = "handled";
	/**
	* Enum value "skipped" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
	*
	* Exception handling was skipped because the response had started.
	*/
	exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = "skipped";
	/**
	* Enum value "unhandled" for attribute {@link ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT}.
	*
	* Exception was not handled by the exception handling middleware.
	*/
	exports.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = "unhandled";
	/**
	* Full type name of the [`IExceptionHandler`](https://learn.microsoft.com/dotnet/api/microsoft.aspnetcore.diagnostics.iexceptionhandler) implementation that handled the exception.
	*
	* @example Contoso.MyHandler
	*/
	exports.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = "aspnetcore.diagnostics.handler.type";
	/**
	* Rate limiting policy name.
	*
	* @example fixed
	* @example sliding
	* @example token
	*/
	exports.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = "aspnetcore.rate_limiting.policy";
	/**
	* Rate-limiting result, shows whether the lease was acquired or contains a rejection reason
	*
	* @example acquired
	* @example request_canceled
	*/
	exports.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = "aspnetcore.rate_limiting.result";
	/**
	* Enum value "acquired" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
	*
	* Lease was acquired
	*/
	exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = "acquired";
	/**
	* Enum value "endpoint_limiter" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
	*
	* Lease request was rejected by the endpoint limiter
	*/
	exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = "endpoint_limiter";
	/**
	* Enum value "global_limiter" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
	*
	* Lease request was rejected by the global limiter
	*/
	exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = "global_limiter";
	/**
	* Enum value "request_canceled" for attribute {@link ATTR_ASPNETCORE_RATE_LIMITING_RESULT}.
	*
	* Lease request was canceled
	*/
	exports.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = "request_canceled";
	/**
	* Flag indicating if request was handled by the application pipeline.
	*
	* @example true
	*/
	exports.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = "aspnetcore.request.is_unhandled";
	/**
	* A value that indicates whether the matched route is a fallback route.
	*
	* @example true
	*/
	exports.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = "aspnetcore.routing.is_fallback";
	/**
	* Match result - success or failure
	*
	* @example success
	* @example failure
	*/
	exports.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = "aspnetcore.routing.match_status";
	/**
	* Enum value "failure" for attribute {@link ATTR_ASPNETCORE_ROUTING_MATCH_STATUS}.
	*
	* Match failed
	*/
	exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = "failure";
	/**
	* Enum value "success" for attribute {@link ATTR_ASPNETCORE_ROUTING_MATCH_STATUS}.
	*
	* Match succeeded
	*/
	exports.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = "success";
	/**
	* A value that indicates whether the user is authenticated.
	*
	* @example true
	*/
	exports.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = "aspnetcore.user.is_authenticated";
	/**
	* Client address - domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name.
	*
	* @example client.example.com
	* @example 10.1.2.80
	* @example /tmp/my.sock
	*
	* @note When observed from the server side, and when communicating through an intermediary, `client.address` **SHOULD** represent the client address behind any intermediaries,  for example proxies, if it's available.
	*/
	exports.ATTR_CLIENT_ADDRESS = "client.address";
	/**
	* Client port number.
	*
	* @example 65123
	*
	* @note When observed from the server side, and when communicating through an intermediary, `client.port` **SHOULD** represent the client port behind any intermediaries,  for example proxies, if it's available.
	*/
	exports.ATTR_CLIENT_PORT = "client.port";
	/**
	* The column number in `code.file.path` best representing the operation. It **SHOULD** point within the code unit named in `code.function.name`. This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Line'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example 16
	*/
	exports.ATTR_CODE_COLUMN_NUMBER = "code.column.number";
	/**
	* The source code file name that identifies the code unit as uniquely as possible (preferably an absolute file path). This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Function'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example "/usr/local/MyApplication/content_root/app/index.php"
	*/
	exports.ATTR_CODE_FILE_PATH = "code.file.path";
	/**
	* The method or function fully-qualified name without arguments. The value should fit the natural representation of the language runtime, which is also likely the same used within `code.stacktrace` attribute value. This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Function'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example com.example.MyHttpService.serveRequest
	* @example GuzzleHttp\\Client::transfer
	* @example fopen
	*
	* @note Values and format depends on each language runtime, thus it is impossible to provide an exhaustive list of examples.
	* The values are usually the same (or prefixes of) the ones found in native stack trace representation stored in
	* `code.stacktrace` without information on arguments.
	*
	* Examples:
	*
	*   - Java method: `com.example.MyHttpService.serveRequest`
	*   - Java anonymous class method: `com.mycompany.Main$1.myMethod`
	*   - Java lambda method: `com.mycompany.Main$$Lambda/0x0000748ae4149c00.myMethod`
	*   - PHP function: `GuzzleHttp\Client::transfer`
	*   - Go function: `github.com/my/repo/pkg.foo.func5`
	*   - Elixir: `OpenTelemetry.Ctx.new`
	*   - Erlang: `opentelemetry_ctx:new`
	*   - Rust: `playground::my_module::my_cool_func`
	*   - C function: `fopen`
	*/
	exports.ATTR_CODE_FUNCTION_NAME = "code.function.name";
	/**
	* The line number in `code.file.path` best representing the operation. It **SHOULD** point within the code unit named in `code.function.name`. This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Line'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example 42
	*/
	exports.ATTR_CODE_LINE_NUMBER = "code.line.number";
	/**
	* A stacktrace as a string in the natural representation for the language runtime. The representation is identical to [`exception.stacktrace`](/docs/exceptions/exceptions-spans.md#stacktrace-representation). This attribute **MUST NOT** be used on the Profile signal since the data is already captured in 'message Location'. This constraint is imposed to prevent redundancy and maintain data integrity.
	*
	* @example "at com.example.GenerateTrace.methodB(GenerateTrace.java:13)\\n at com.example.GenerateTrace.methodA(GenerateTrace.java:9)\\n at com.example.GenerateTrace.main(GenerateTrace.java:5)\\n"
	*/
	exports.ATTR_CODE_STACKTRACE = "code.stacktrace";
	/**
	* Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/containers/run/#container-identification). The UUID might be abbreviated.
	*
	* @example a3bf90e006b2
	*/
	exports.ATTR_CONTAINER_ID = "container.id";
	/**
	* Name of the image the container was built on.
	*
	* @example gcr.io/opentelemetry/operator
	*/
	exports.ATTR_CONTAINER_IMAGE_NAME = "container.image.name";
	/**
	* Repo digests of the container image as provided by the container runtime.
	*
	* @example ["example@sha256:afcc7f1ac1b49db317a7196c902e61c6c3c4607d63599ee1a82d702d249a0ccb", "internal.registry.example.com:5000/example@sha256:b69959407d21e8a062e0416bf13405bb2b71ed7a84dde4158ebafacfa06f5578"]
	*
	* @note [Docker](https://docs.docker.com/reference/api/engine/version/v1.52/#tag/Image/operation/ImageInspect) and [CRI](https://github.com/kubernetes/cri-api/blob/c75ef5b473bbe2d0a4fc92f82235efd665ea8e9f/pkg/apis/runtime/v1/api.proto#L1237-L1238) report those under the `RepoDigests` field.
	*/
	exports.ATTR_CONTAINER_IMAGE_REPO_DIGESTS = "container.image.repo_digests";
	/**
	* Container image tags. An example can be found in [Docker Image Inspect](https://docs.docker.com/reference/api/engine/version/v1.52/#tag/Image/operation/ImageInspect). Should be only the `<tag>` section of the full name for example from `registry.example.com/my-org/my-image:<tag>`.
	*
	* @example ["v1.27.1", "3.5.7-0"]
	*/
	exports.ATTR_CONTAINER_IMAGE_TAGS = "container.image.tags";
	/**
	* The name of a collection (table, container) within the database.
	*
	* @example public.users
	* @example customers
	*
	* @note It is **RECOMMENDED** to capture the value as provided by the application
	* without attempting to do any case normalization.
	*
	* The collection name **SHOULD NOT** be extracted from `db.query.text`,
	* when the database system supports query text with multiple collections
	* in non-batch operations.
	*
	* For batch operations, if the individual operations are known to have the same
	* collection name then that collection name **SHOULD** be used.
	*/
	exports.ATTR_DB_COLLECTION_NAME = "db.collection.name";
	/**
	* The name of the database, fully qualified within the server address and port.
	*
	* @example customers
	* @example test.users
	*
	* @note If a database system has multiple namespace components, they **SHOULD** be concatenated from the most general to the most specific namespace component, using `|` as a separator between the components. Any missing components (and their associated separators) **SHOULD** be omitted.
	* Semantic conventions for individual database systems **SHOULD** document what `db.namespace` means in the context of that system.
	* It is **RECOMMENDED** to capture the value as provided by the application without attempting to do any case normalization.
	*/
	exports.ATTR_DB_NAMESPACE = "db.namespace";
	/**
	* The number of database operations included in a batch operation.
	*
	* @example 2
	* @example 3
	* @example 4
	*
	* @note Except for empty batch requests described below, a batch operation contains two
	* or more database operations explicitly submitted as separate operations in a single
	* client call, protocol message, or database command.
	*
	* Requests to batch APIs that contain only one operation **SHOULD** be modeled as single
	* operations, not as batch operations.
	*
	* A database call is not a batch operation solely because one operation accepts
	* multiple operands, such as keys, rows, documents, points, or other data elements,
	* including Redis [`MGET`](https://redis.io/docs/latest/commands/mget/) with
	* multiple keys.
	*
	* In batch APIs that execute the same parameterized operation with parameter sets,
	* each parameter set represents one database operation for determining whether the
	* request is a batch operation. Requests with only one parameter set **SHOULD** be modeled
	* as single operations, not as batch operations.
	*
	* `db.operation.batch.size` **SHOULD** be set to the number of operations in the batch.
	* It **SHOULD NOT** be set for non-batch operations.
	*
	* A request to execute a batch operation with no operations **SHOULD** also be treated
	* as a batch operation, and `db.operation.batch.size` **SHOULD** be set to `0`.
	*/
	exports.ATTR_DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
	/**
	* The name of the operation or command being executed.
	*
	* @example findAndModify
	* @example HMSET
	* @example SELECT
	*
	* @note It is **RECOMMENDED** to capture the value as provided by the application
	* without attempting to do any case normalization.
	*
	* The operation name **SHOULD NOT** be extracted from `db.query.text`,
	* when the database system supports query text with multiple operations
	* in non-batch operations.
	*
	* If spaces can occur in the operation name, multiple consecutive spaces
	* **SHOULD** be normalized to a single space.
	*
	* For batch operations, if the individual operations are known to have the same operation name
	* then that operation name **SHOULD** be used prepended by `BATCH `,
	* otherwise `db.operation.name` **SHOULD** be `BATCH` or some other database
	* system specific term if more applicable.
	*/
	exports.ATTR_DB_OPERATION_NAME = "db.operation.name";
	/**
	* Low cardinality summary of a database query.
	*
	* @example SELECT wuser_table
	* @example INSERT shipping_details SELECT orders
	* @example get user by id
	*
	* @note The query summary describes a class of database queries and is useful
	* as a grouping key, especially when analyzing telemetry for database
	* calls involving complex queries.
	*
	* Summary may be available to the instrumentation through
	* instrumentation hooks or other means. If it is not available, instrumentations
	* that support query parsing **SHOULD** generate a summary following
	* [Generating query summary](/docs/db/database-spans.md#generating-a-summary-of-the-query)
	* section.
	*
	* For batch operations, if the individual operations are known to have the same query summary
	* then that query summary **SHOULD** be used prepended by `BATCH `,
	* otherwise `db.query.summary` **SHOULD** be `BATCH` or some other database
	* system specific term if more applicable.
	*/
	exports.ATTR_DB_QUERY_SUMMARY = "db.query.summary";
	/**
	* The database query being executed.
	*
	* @example SELECT * FROM wuser_table where username = ?
	* @example SET mykey ?
	*
	* @note For sanitization see [Sanitization of `db.query.text`](/docs/db/database-spans.md#sanitization-of-dbquerytext).
	* For batch operations, if the individual operations are known to have the same query text then that query text **SHOULD** be used, otherwise all of the individual query texts **SHOULD** be concatenated with separator `; ` or some other database system specific separator if more applicable.
	* Parameterized query text **SHOULD NOT** be sanitized. Even though parameterized query text can potentially have sensitive data, by using a parameterized query the user is giving a strong signal that any sensitive data will be passed as parameter values, and the benefit to observability of capturing the static part of the query text by default outweighs the risk.
	*/
	exports.ATTR_DB_QUERY_TEXT = "db.query.text";
	/**
	* Database response status code.
	*
	* @example 102
	* @example ORA-17002
	* @example 08P01
	* @example 404
	*
	* @note The status code returned by the database. Usually it represents an error code, but may also represent partial success, warning, or differentiate between various types of successful outcomes.
	* Semantic conventions for individual database systems **SHOULD** document what `db.response.status_code` means in the context of that system.
	*/
	exports.ATTR_DB_RESPONSE_STATUS_CODE = "db.response.status_code";
	/**
	* The name of a stored procedure within the database.
	*
	* @example GetCustomer
	*
	* @note It is **RECOMMENDED** to capture the value as provided by the application
	* without attempting to do any case normalization.
	*
	* For batch operations, if the individual operations are known to have the same
	* stored procedure name then that stored procedure name **SHOULD** be used.
	*/
	exports.ATTR_DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
	/**
	* The database management system (DBMS) product as identified by the client instrumentation.
	*
	* @note The actual DBMS may differ from the one identified by the client. For example, when using PostgreSQL client libraries to connect to a CockroachDB, the `db.system.name` is set to `postgresql` based on the instrumentation's best knowledge.
	*/
	exports.ATTR_DB_SYSTEM_NAME = "db.system.name";
	/**
	* Enum value "mariadb" for attribute {@link ATTR_DB_SYSTEM_NAME}.
	*
	* [MariaDB](https://mariadb.org/)
	*/
	exports.DB_SYSTEM_NAME_VALUE_MARIADB = "mariadb";
	/**
	* Enum value "microsoft.sql_server" for attribute {@link ATTR_DB_SYSTEM_NAME}.
	*
	* [Microsoft SQL Server](https://www.microsoft.com/sql-server)
	*/
	exports.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = "microsoft.sql_server";
	/**
	* Enum value "mysql" for attribute {@link ATTR_DB_SYSTEM_NAME}.
	*
	* [MySQL](https://www.mysql.com/)
	*/
	exports.DB_SYSTEM_NAME_VALUE_MYSQL = "mysql";
	/**
	* Enum value "postgresql" for attribute {@link ATTR_DB_SYSTEM_NAME}.
	*
	* [PostgreSQL](https://www.postgresql.org/)
	*/
	exports.DB_SYSTEM_NAME_VALUE_POSTGRESQL = "postgresql";
	/**
	* Name of the [deployment environment](https://wikipedia.org/wiki/Deployment_environment) (aka deployment tier).
	*
	* @example staging
	* @example production
	*
	* @note `deployment.environment.name` does not affect the uniqueness constraints defined through
	* the `service.namespace`, `service.name` and `service.instance.id` resource attributes.
	* This implies that resources carrying the following attribute combinations **MUST** be
	* considered to be identifying the same service:
	*
	*   - `service.name=frontend`, `deployment.environment.name=production`
	*   - `service.name=frontend`, `deployment.environment.name=staging`.
	*/
	exports.ATTR_DEPLOYMENT_ENVIRONMENT_NAME = "deployment.environment.name";
	/**
	* Enum value "development" for attribute {@link ATTR_DEPLOYMENT_ENVIRONMENT_NAME}.
	*
	* Development environment
	*/
	exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT = "development";
	/**
	* Enum value "production" for attribute {@link ATTR_DEPLOYMENT_ENVIRONMENT_NAME}.
	*
	* Production environment
	*/
	exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION = "production";
	/**
	* Enum value "staging" for attribute {@link ATTR_DEPLOYMENT_ENVIRONMENT_NAME}.
	*
	* Staging environment
	*/
	exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING = "staging";
	/**
	* Enum value "test" for attribute {@link ATTR_DEPLOYMENT_ENVIRONMENT_NAME}.
	*
	* Testing environment
	*/
	exports.DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST = "test";
	/**
	* Name of the garbage collector managed heap generation.
	*
	* @example gen0
	* @example gen1
	* @example gen2
	*/
	exports.ATTR_DOTNET_GC_HEAP_GENERATION = "dotnet.gc.heap.generation";
	/**
	* Enum value "gen0" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Generation 0
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = "gen0";
	/**
	* Enum value "gen1" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Generation 1
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = "gen1";
	/**
	* Enum value "gen2" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Generation 2
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = "gen2";
	/**
	* Enum value "loh" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Large Object Heap
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = "loh";
	/**
	* Enum value "poh" for attribute {@link ATTR_DOTNET_GC_HEAP_GENERATION}.
	*
	* Pinned Object Heap
	*/
	exports.DOTNET_GC_HEAP_GENERATION_VALUE_POH = "poh";
	/**
	* Describes a class of error the operation ended with.
	*
	* @example timeout
	* @example java.net.UnknownHostException
	* @example server_certificate_invalid
	* @example 500
	*
	* @note The `error.type` **SHOULD** be predictable, and **SHOULD** have low cardinality.
	*
	* When `error.type` is set to a type (e.g., an exception type), its
	* canonical class name identifying the type within the artifact **SHOULD** be used.
	*
	* If the recorded error type is a wrapper that is not meaningful for
	* failure classification, instrumentation **MAY** use the type of the inner
	* error instead. For example, in Go, errors created with `fmt.Errorf`
	* using `%w` **MAY** be unwrapped when the wrapper type does not help
	* classify the failure.
	*
	* Instrumentations **SHOULD** document the list of errors they report.
	*
	* The cardinality of `error.type` within one instrumentation library **SHOULD** be low.
	* Telemetry consumers that aggregate data from multiple instrumentation libraries and applications
	* should be prepared for `error.type` to have high cardinality at query time when no
	* additional filters are applied.
	*
	* If the operation has completed successfully, instrumentations **SHOULD NOT** set `error.type`.
	*
	* If a specific domain defines its own set of error identifiers (such as HTTP or RPC status codes),
	* it's **RECOMMENDED** to:
	*
	*   - Use a domain-specific attribute
	*   - Set `error.type` to capture all errors, regardless of whether they are defined within the domain-specific set or not.
	*/
	exports.ATTR_ERROR_TYPE = "error.type";
	/**
	* Enum value "_OTHER" for attribute {@link ATTR_ERROR_TYPE}.
	*
	* A fallback error value to be used when the instrumentation doesn't define a custom value.
	*/
	exports.ERROR_TYPE_VALUE_OTHER = "_OTHER";
	/**
	* Indicates that the exception is escaping the scope of the span.
	*
	* @deprecated It's no longer recommended to record exceptions that are handled and do not escape the scope of a span.
	*/
	exports.ATTR_EXCEPTION_ESCAPED = "exception.escaped";
	/**
	* The exception message.
	*
	* @example Division by zero
	* @example Can't convert 'int' object to str implicitly
	*
	* @note > [!WARNING]
	*
	* > This attribute may contain sensitive information.
	*/
	exports.ATTR_EXCEPTION_MESSAGE = "exception.message";
	/**
	* A stacktrace as a string in the natural representation for the language runtime. The representation is to be determined and documented by each language SIG.
	*
	* @example "Exception in thread "main" java.lang.RuntimeException: Test exception\\n at com.example.GenerateTrace.methodB(GenerateTrace.java:13)\\n at com.example.GenerateTrace.methodA(GenerateTrace.java:9)\\n at com.example.GenerateTrace.main(GenerateTrace.java:5)\\n"
	*/
	exports.ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
	/**
	* The type of the exception (its fully-qualified class name, if applicable). The dynamic type of the exception should be preferred over the static type in languages that support it.
	*
	* @example java.net.ConnectException
	* @example OSError
	*
	* @note If the recorded exception type is a wrapper that is not meaningful for
	* failure classification, instrumentation **MAY** use the type of the inner
	* exception instead. For example, in Go, errors created with `fmt.Errorf`
	* using `%w` **MAY** be unwrapped when the wrapper type does not help
	* classify the failure.
	*/
	exports.ATTR_EXCEPTION_TYPE = "exception.type";
	/**
	* HTTP request headers, `<key>` being the normalized HTTP Header name (lowercase), the value being the header values.
	*
	* @example ["application/json"]
	* @example ["1.2.3.4", "1.2.3.5"]
	*
	* @note Instrumentations **SHOULD** require an explicit configuration of which headers are to be captured.
	* Including all request headers can be a security risk - explicit configuration helps avoid leaking sensitive information.
	*
	* The `User-Agent` header is already captured in the `user_agent.original` attribute.
	* Users **MAY** explicitly configure instrumentations to capture them even though it is not recommended.
	*
	* The attribute value **MUST** consist of either multiple header values as an array of strings
	* or a single-item array containing a possibly comma-concatenated string, depending on the way
	* the HTTP library provides access to headers.
	*
	* Examples:
	*
	*   - A header `Content-Type: application/json` **SHOULD** be recorded as the `http.request.header.content-type`
	*     attribute with value `["application/json"]`.
	*   - A header `X-Forwarded-For: 1.2.3.4, 1.2.3.5` **SHOULD** be recorded as the `http.request.header.x-forwarded-for`
	*     attribute with value `["1.2.3.4", "1.2.3.5"]` or `["1.2.3.4, 1.2.3.5"]` depending on the HTTP library.
	*/
	var ATTR_HTTP_REQUEST_HEADER = (key) => `http.request.header.${key}`;
	exports.ATTR_HTTP_REQUEST_HEADER = ATTR_HTTP_REQUEST_HEADER;
	/**
	* HTTP request method.
	*
	* @example GET
	* @example POST
	* @example HEAD
	*
	* @note HTTP request method value **SHOULD** be "known" to the instrumentation.
	* By default, this convention defines "known" methods as the ones listed in [RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-methods),
	* the PATCH method defined in [RFC5789](https://www.rfc-editor.org/rfc/rfc5789.html)
	* and the QUERY method defined in [httpbis-safe-method-w-body](https://datatracker.ietf.org/doc/draft-ietf-httpbis-safe-method-w-body/?include_text=1).
	*
	* If the HTTP request method is not known to instrumentation, it **MUST** set the `http.request.method` attribute to `_OTHER`.
	*
	* If the HTTP instrumentation could end up converting valid HTTP request methods to `_OTHER`, then it **MUST** provide a way to override
	* the list of known HTTP methods. If this override is done via environment variable, then the environment variable **MUST** be named
	* OTEL_INSTRUMENTATION_HTTP_KNOWN_METHODS and support a comma-separated list of case-sensitive known HTTP methods.
	*
	*
	* If this override is done via declarative configuration, then the list **MUST** be configurable via the `known_methods` property
	* (an array of case-sensitive strings with minimum items 0) under `.instrumentation/development.general.http.client` and/or
	* `.instrumentation/development.general.http.server`.
	*
	* In either case, this list **MUST** be a full override of the default known methods,
	* it is not a list of known methods in addition to the defaults.
	*
	* HTTP method names are case-sensitive and `http.request.method` attribute value **MUST** match a known HTTP method name exactly.
	* Instrumentations for specific web frameworks that consider HTTP methods to be case insensitive, **SHOULD** populate a canonical equivalent.
	* Tracing instrumentations that do so, **MUST** also set `http.request.method_original` to the original value.
	*/
	exports.ATTR_HTTP_REQUEST_METHOD = "http.request.method";
	/**
	* Enum value "_OTHER" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* Any HTTP method that the instrumentation has no prior knowledge of.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_OTHER = "_OTHER";
	/**
	* Enum value "CONNECT" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* CONNECT method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_CONNECT = "CONNECT";
	/**
	* Enum value "DELETE" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* DELETE method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_DELETE = "DELETE";
	/**
	* Enum value "GET" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* GET method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_GET = "GET";
	/**
	* Enum value "HEAD" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* HEAD method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_HEAD = "HEAD";
	/**
	* Enum value "OPTIONS" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* OPTIONS method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_OPTIONS = "OPTIONS";
	/**
	* Enum value "PATCH" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* PATCH method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_PATCH = "PATCH";
	/**
	* Enum value "POST" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* POST method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_POST = "POST";
	/**
	* Enum value "PUT" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* PUT method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_PUT = "PUT";
	/**
	* Enum value "TRACE" for attribute {@link ATTR_HTTP_REQUEST_METHOD}.
	*
	* TRACE method.
	*/
	exports.HTTP_REQUEST_METHOD_VALUE_TRACE = "TRACE";
	/**
	* Original HTTP method sent by the client in the request line.
	*
	* @example GeT
	* @example ACL
	* @example foo
	*/
	exports.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
	/**
	* The ordinal number of request resending attempt (for any reason, including redirects).
	*
	* @example 3
	*
	* @note The resend count **SHOULD** be updated each time an HTTP request gets resent by the client, regardless of what was the cause of the resending (e.g. redirection, authorization failure, 503 Server Unavailable, network issues, or any other).
	*/
	exports.ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
	/**
	* HTTP response headers, `<key>` being the normalized HTTP Header name (lowercase), the value being the header values.
	*
	* @example ["application/json"]
	* @example ["abc", "def"]
	*
	* @note Instrumentations **SHOULD** require an explicit configuration of which headers are to be captured.
	* Including all response headers can be a security risk - explicit configuration helps avoid leaking sensitive information.
	*
	* Users **MAY** explicitly configure instrumentations to capture them even though it is not recommended.
	*
	* The attribute value **MUST** consist of either multiple header values as an array of strings
	* or a single-item array containing a possibly comma-concatenated string, depending on the way
	* the HTTP library provides access to headers.
	*
	* Examples:
	*
	*   - A header `Content-Type: application/json` header **SHOULD** be recorded as the `http.request.response.content-type`
	*     attribute with value `["application/json"]`.
	*   - A header `My-custom-header: abc, def` header **SHOULD** be recorded as the `http.response.header.my-custom-header`
	*     attribute with value `["abc", "def"]` or `["abc, def"]` depending on the HTTP library.
	*/
	var ATTR_HTTP_RESPONSE_HEADER = (key) => `http.response.header.${key}`;
	exports.ATTR_HTTP_RESPONSE_HEADER = ATTR_HTTP_RESPONSE_HEADER;
	/**
	* [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).
	*
	* @example 200
	*/
	exports.ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
	/**
	* The matched route template for the request. This **MUST** be low-cardinality and include all static path segments, with dynamic path segments represented with placeholders.
	*
	* @example /users/:userID?
	* @example my-controller/my-action/{id?}
	*
	* @note **MUST NOT** be populated when this is not supported by the HTTP server framework as the route attribute should have low-cardinality and the URI path can NOT substitute it.
	* **SHOULD** include the [application root](/docs/http/http-spans.md#http-server-definitions) if there is one.
	*
	* A static path segment is a part of the route template with a fixed, low-cardinality value. This includes literal strings like `/users/` and placeholders that
	* are constrained to a finite, predefined set of values, e.g. `{controller}` or `{action}`.
	*
	* A dynamic path segment is a placeholder for a value that can have high cardinality and is not constrained to a predefined list like static path segments.
	*
	* Instrumentations **SHOULD** use routing information provided by the corresponding web framework. They **SHOULD** pick the most precise source of routing information and **MAY**
	* support custom route formatting. Instrumentations **SHOULD** document the format and the API used to obtain the route string.
	*/
	exports.ATTR_HTTP_ROUTE = "http.route";
	/**
	* Name of the garbage collector action.
	*
	* @example end of minor GC
	* @example end of major GC
	*
	* @note Garbage collector action is generally obtained via [GarbageCollectionNotificationInfo#getGcAction()](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.management/com/sun/management/GarbageCollectionNotificationInfo.html#getGcAction()).
	*/
	exports.ATTR_JVM_GC_ACTION = "jvm.gc.action";
	/**
	* Name of the garbage collector.
	*
	* @example G1 Young Generation
	* @example G1 Old Generation
	*
	* @note Garbage collector name is generally obtained via [GarbageCollectionNotificationInfo#getGcName()](https://docs.oracle.com/en/java/javase/11/docs/api/jdk.management/com/sun/management/GarbageCollectionNotificationInfo.html#getGcName()).
	*/
	exports.ATTR_JVM_GC_NAME = "jvm.gc.name";
	/**
	* Name of the memory pool.
	*
	* @example G1 Old Gen
	* @example G1 Eden space
	* @example G1 Survivor Space
	*
	* @note Pool names are generally obtained via [MemoryPoolMXBean#getName()](https://docs.oracle.com/en/java/javase/11/docs/api/java.management/java/lang/management/MemoryPoolMXBean.html#getName()).
	*/
	exports.ATTR_JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
	/**
	* The type of memory.
	*
	* @example heap
	* @example non_heap
	*/
	exports.ATTR_JVM_MEMORY_TYPE = "jvm.memory.type";
	/**
	* Enum value "heap" for attribute {@link ATTR_JVM_MEMORY_TYPE}.
	*
	* Heap memory.
	*/
	exports.JVM_MEMORY_TYPE_VALUE_HEAP = "heap";
	/**
	* Enum value "non_heap" for attribute {@link ATTR_JVM_MEMORY_TYPE}.
	*
	* Non-heap memory
	*/
	exports.JVM_MEMORY_TYPE_VALUE_NON_HEAP = "non_heap";
	/**
	* Whether the thread is daemon or not.
	*/
	exports.ATTR_JVM_THREAD_DAEMON = "jvm.thread.daemon";
	/**
	* State of the thread.
	*
	* @example runnable
	* @example blocked
	*/
	exports.ATTR_JVM_THREAD_STATE = "jvm.thread.state";
	/**
	* Enum value "blocked" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that is blocked waiting for a monitor lock is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_BLOCKED = "blocked";
	/**
	* Enum value "new" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that has not yet started is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_NEW = "new";
	/**
	* Enum value "runnable" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread executing in the Java virtual machine is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_RUNNABLE = "runnable";
	/**
	* Enum value "terminated" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that has exited is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_TERMINATED = "terminated";
	/**
	* Enum value "timed_waiting" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_TIMED_WAITING = "timed_waiting";
	/**
	* Enum value "waiting" for attribute {@link ATTR_JVM_THREAD_STATE}.
	*
	* A thread that is waiting indefinitely for another thread to perform a particular action is in this state.
	*/
	exports.JVM_THREAD_STATE_VALUE_WAITING = "waiting";
	/**
	* The name of the cluster.
	*
	* @example opentelemetry-cluster
	*/
	exports.ATTR_K8S_CLUSTER_NAME = "k8s.cluster.name";
	/**
	* A pseudo-ID for the cluster, set to the UID of the `kube-system` namespace.
	*
	* @example 218fc5a9-a5f1-4b54-aa05-46717d0ab26d
	*
	* @note K8s doesn't have support for obtaining a cluster ID. If this is ever
	* added, we will recommend collecting the `k8s.cluster.uid` through the
	* official APIs. In the meantime, we are able to use the `uid` of the
	* `kube-system` namespace as a proxy for cluster ID. Read on for the
	* rationale.
	*
	* Every object created in a K8s cluster is assigned a distinct UID. The
	* `kube-system` namespace is used by Kubernetes itself and will exist
	* for the lifetime of the cluster. Using the `uid` of the `kube-system`
	* namespace is a reasonable proxy for the K8s ClusterID as it will only
	* change if the cluster is rebuilt. Furthermore, Kubernetes UIDs are
	* UUIDs as standardized by
	* [ISO/IEC 9834-8 and ITU-T X.667](https://www.itu.int/ITU-T/studygroups/com17/oid.html).
	* Which states:
	*
	* > If generated according to one of the mechanisms defined in Rec.
	* > ITU-T X.667 | ISO/IEC 9834-8, a UUID is either guaranteed to be
	* > different from all other UUIDs generated before 3603 A.D., or is
	* > extremely likely to be different (depending on the mechanism chosen).
	*
	* Therefore, UIDs between clusters should be extremely unlikely to
	* conflict.
	*/
	exports.ATTR_K8S_CLUSTER_UID = "k8s.cluster.uid";
	/**
	* The name of the Container from Pod specification, must be unique within a Pod. Container runtime usually uses different globally unique name (`container.name`).
	*
	* @example redis
	*/
	exports.ATTR_K8S_CONTAINER_NAME = "k8s.container.name";
	/**
	* Number of times the container was restarted. This attribute can be used to identify a particular container (running or stopped) within a container spec.
	*/
	exports.ATTR_K8S_CONTAINER_RESTART_COUNT = "k8s.container.restart_count";
	/**
	* The cronjob annotation placed on the CronJob, the `<key>` being the annotation name, the value being the annotation value.
	*
	* @example 4
	* @example
	*
	* @note Examples:
	*
	*   - An annotation `retries` with value `4` **SHOULD** be recorded as the
	*     `k8s.cronjob.annotation.retries` attribute with value `"4"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.cronjob.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_CRONJOB_ANNOTATION = (key) => `k8s.cronjob.annotation.${key}`;
	exports.ATTR_K8S_CRONJOB_ANNOTATION = ATTR_K8S_CRONJOB_ANNOTATION;
	/**
	* The label placed on the CronJob, the `<key>` being the label name, the value being the label value.
	*
	* @example weekly
	* @example
	*
	* @note Examples:
	*
	*   - A label `type` with value `weekly` **SHOULD** be recorded as the
	*     `k8s.cronjob.label.type` attribute with value `"weekly"`.
	*   - A label `automated` with empty string value **SHOULD** be recorded as
	*     the `k8s.cronjob.label.automated` attribute with value `""`.
	*/
	var ATTR_K8S_CRONJOB_LABEL = (key) => `k8s.cronjob.label.${key}`;
	exports.ATTR_K8S_CRONJOB_LABEL = ATTR_K8S_CRONJOB_LABEL;
	/**
	* The name of the CronJob.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_CRONJOB_NAME = "k8s.cronjob.name";
	/**
	* The UID of the CronJob.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_CRONJOB_UID = "k8s.cronjob.uid";
	/**
	* The annotation placed on the DaemonSet, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 1
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `replicas` with value `1` **SHOULD** be recorded
	*     as the `k8s.daemonset.annotation.replicas` attribute with value `"1"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.daemonset.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_DAEMONSET_ANNOTATION = (key) => `k8s.daemonset.annotation.${key}`;
	exports.ATTR_K8S_DAEMONSET_ANNOTATION = ATTR_K8S_DAEMONSET_ANNOTATION;
	/**
	* The label placed on the DaemonSet, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example guestbook
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `app` with value `guestbook` **SHOULD** be recorded
	*     as the `k8s.daemonset.label.app` attribute with value `"guestbook"`.
	*   - A label `injected` with empty string value **SHOULD** be recorded as
	*     the `k8s.daemonset.label.injected` attribute with value `""`.
	*/
	var ATTR_K8S_DAEMONSET_LABEL = (key) => `k8s.daemonset.label.${key}`;
	exports.ATTR_K8S_DAEMONSET_LABEL = ATTR_K8S_DAEMONSET_LABEL;
	/**
	* The name of the DaemonSet.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
	/**
	* The UID of the DaemonSet.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
	/**
	* The annotation placed on the Deployment, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 1
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `replicas` with value `1` **SHOULD** be recorded
	*     as the `k8s.deployment.annotation.replicas` attribute with value `"1"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.deployment.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_DEPLOYMENT_ANNOTATION = (key) => `k8s.deployment.annotation.${key}`;
	exports.ATTR_K8S_DEPLOYMENT_ANNOTATION = ATTR_K8S_DEPLOYMENT_ANNOTATION;
	/**
	* The label placed on the Deployment, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example guestbook
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `app` with value `guestbook` **SHOULD** be recorded
	*     as the `k8s.deployment.label.app` attribute with value `"guestbook"`.
	*   - A label `injected` with empty string value **SHOULD** be recorded as
	*     the `k8s.deployment.label.injected` attribute with value `""`.
	*/
	var ATTR_K8S_DEPLOYMENT_LABEL = (key) => `k8s.deployment.label.${key}`;
	exports.ATTR_K8S_DEPLOYMENT_LABEL = ATTR_K8S_DEPLOYMENT_LABEL;
	/**
	* The name of the Deployment.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
	/**
	* The UID of the Deployment.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
	/**
	* The annotation placed on the Job, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 1
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `number` with value `1` **SHOULD** be recorded
	*     as the `k8s.job.annotation.number` attribute with value `"1"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.job.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_JOB_ANNOTATION = (key) => `k8s.job.annotation.${key}`;
	exports.ATTR_K8S_JOB_ANNOTATION = ATTR_K8S_JOB_ANNOTATION;
	/**
	* The label placed on the Job, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example ci
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `jobtype` with value `ci` **SHOULD** be recorded
	*     as the `k8s.job.label.jobtype` attribute with value `"ci"`.
	*   - A label `automated` with empty string value **SHOULD** be recorded as
	*     the `k8s.job.label.automated` attribute with value `""`.
	*/
	var ATTR_K8S_JOB_LABEL = (key) => `k8s.job.label.${key}`;
	exports.ATTR_K8S_JOB_LABEL = ATTR_K8S_JOB_LABEL;
	/**
	* The name of the Job.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_JOB_NAME = "k8s.job.name";
	/**
	* The UID of the Job.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_JOB_UID = "k8s.job.uid";
	/**
	* The annotation placed on the Namespace, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 0
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `ttl` with value `0` **SHOULD** be recorded
	*     as the `k8s.namespace.annotation.ttl` attribute with value `"0"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.namespace.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_NAMESPACE_ANNOTATION = (key) => `k8s.namespace.annotation.${key}`;
	exports.ATTR_K8S_NAMESPACE_ANNOTATION = ATTR_K8S_NAMESPACE_ANNOTATION;
	/**
	* The label placed on the Namespace, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example default
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `kubernetes.io/metadata.name` with value `default` **SHOULD** be recorded
	*     as the `k8s.namespace.label.kubernetes.io/metadata.name` attribute with value `"default"`.
	*   - A label `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.namespace.label.data` attribute with value `""`.
	*/
	var ATTR_K8S_NAMESPACE_LABEL = (key) => `k8s.namespace.label.${key}`;
	exports.ATTR_K8S_NAMESPACE_LABEL = ATTR_K8S_NAMESPACE_LABEL;
	/**
	* The name of the namespace that the pod is running in.
	*
	* @example default
	*/
	exports.ATTR_K8S_NAMESPACE_NAME = "k8s.namespace.name";
	/**
	* The annotation placed on the Node, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 0
	* @example
	*
	* @note Examples:
	*
	*   - An annotation `node.alpha.kubernetes.io/ttl` with value `0` **SHOULD** be recorded as
	*     the `k8s.node.annotation.node.alpha.kubernetes.io/ttl` attribute with value `"0"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.node.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_NODE_ANNOTATION = (key) => `k8s.node.annotation.${key}`;
	exports.ATTR_K8S_NODE_ANNOTATION = ATTR_K8S_NODE_ANNOTATION;
	/**
	* The label placed on the Node, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example arm64
	* @example
	*
	* @note Examples:
	*
	*   - A label `kubernetes.io/arch` with value `arm64` **SHOULD** be recorded
	*     as the `k8s.node.label.kubernetes.io/arch` attribute with value `"arm64"`.
	*   - A label `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.node.label.data` attribute with value `""`.
	*/
	var ATTR_K8S_NODE_LABEL = (key) => `k8s.node.label.${key}`;
	exports.ATTR_K8S_NODE_LABEL = ATTR_K8S_NODE_LABEL;
	/**
	* The name of the Node.
	*
	* @example node-1
	*/
	exports.ATTR_K8S_NODE_NAME = "k8s.node.name";
	/**
	* The UID of the Node.
	*
	* @example 1eb3a0c6-0477-4080-a9cb-0cb7db65c6a2
	*/
	exports.ATTR_K8S_NODE_UID = "k8s.node.uid";
	/**
	* The annotation placed on the Pod, the `<key>` being the annotation name, the value being the annotation value.
	*
	* @example true
	* @example x64
	* @example
	*
	* @note Examples:
	*
	*   - An annotation `kubernetes.io/enforce-mountable-secrets` with value `true` **SHOULD** be recorded as
	*     the `k8s.pod.annotation.kubernetes.io/enforce-mountable-secrets` attribute with value `"true"`.
	*   - An annotation `mycompany.io/arch` with value `x64` **SHOULD** be recorded as
	*     the `k8s.pod.annotation.mycompany.io/arch` attribute with value `"x64"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.pod.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_POD_ANNOTATION = (key) => `k8s.pod.annotation.${key}`;
	exports.ATTR_K8S_POD_ANNOTATION = ATTR_K8S_POD_ANNOTATION;
	/**
	* Specifies the hostname of the Pod.
	*
	* @example collector-gateway
	*
	* @note The K8s Pod spec has an optional hostname field, which can be used to specify a hostname.
	* Refer to [K8s docs](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field)
	* for more information about this field.
	*
	* This attribute aligns with the `hostname` field of the
	* [K8s PodSpec](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#podspec-v1-core).
	*/
	exports.ATTR_K8S_POD_HOSTNAME = "k8s.pod.hostname";
	/**
	* IP address allocated to the Pod.
	*
	* @example 172.18.0.2
	*
	* @note This attribute aligns with the `podIP` field of the
	* [K8s PodStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#podstatus-v1-core).
	*/
	exports.ATTR_K8S_POD_IP = "k8s.pod.ip";
	/**
	* The label placed on the Pod, the `<key>` being the label name, the value being the label value.
	*
	* @example my-app
	* @example x64
	* @example
	*
	* @note Examples:
	*
	*   - A label `app` with value `my-app` **SHOULD** be recorded as
	*     the `k8s.pod.label.app` attribute with value `"my-app"`.
	*   - A label `mycompany.io/arch` with value `x64` **SHOULD** be recorded as
	*     the `k8s.pod.label.mycompany.io/arch` attribute with value `"x64"`.
	*   - A label `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.pod.label.data` attribute with value `""`.
	*/
	var ATTR_K8S_POD_LABEL = (key) => `k8s.pod.label.${key}`;
	exports.ATTR_K8S_POD_LABEL = ATTR_K8S_POD_LABEL;
	/**
	* The name of the Pod.
	*
	* @example opentelemetry-pod-autoconf
	*/
	exports.ATTR_K8S_POD_NAME = "k8s.pod.name";
	/**
	* The start timestamp of the Pod.
	*
	* @example 2025-12-04T08:41:03Z
	*
	* @note Date and time at which the object was acknowledged by the Kubelet.
	* This is before the Kubelet pulled the container image(s) for the pod.
	*
	* This attribute aligns with the `startTime` field of the
	* [K8s PodStatus](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.34/#podstatus-v1-core),
	* in ISO 8601 (RFC 3339 compatible) format.
	*/
	exports.ATTR_K8S_POD_START_TIME = "k8s.pod.start_time";
	/**
	* The UID of the Pod.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_POD_UID = "k8s.pod.uid";
	/**
	* The annotation placed on the ReplicaSet, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 0
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `replicas` with value `0` **SHOULD** be recorded
	*     as the `k8s.replicaset.annotation.replicas` attribute with value `"0"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.replicaset.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_REPLICASET_ANNOTATION = (key) => `k8s.replicaset.annotation.${key}`;
	exports.ATTR_K8S_REPLICASET_ANNOTATION = ATTR_K8S_REPLICASET_ANNOTATION;
	/**
	* The label placed on the ReplicaSet, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example guestbook
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `app` with value `guestbook` **SHOULD** be recorded
	*     as the `k8s.replicaset.label.app` attribute with value `"guestbook"`.
	*   - A label `injected` with empty string value **SHOULD** be recorded as
	*     the `k8s.replicaset.label.injected` attribute with value `""`.
	*/
	var ATTR_K8S_REPLICASET_LABEL = (key) => `k8s.replicaset.label.${key}`;
	exports.ATTR_K8S_REPLICASET_LABEL = ATTR_K8S_REPLICASET_LABEL;
	/**
	* The name of the ReplicaSet.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_REPLICASET_NAME = "k8s.replicaset.name";
	/**
	* The UID of the ReplicaSet.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_REPLICASET_UID = "k8s.replicaset.uid";
	/**
	* The annotation placed on the StatefulSet, the `<key>` being the annotation name, the value being the annotation value, even if the value is empty.
	*
	* @example 1
	* @example
	*
	* @note
	* Examples:
	*
	*   - An annotation `replicas` with value `1` **SHOULD** be recorded
	*     as the `k8s.statefulset.annotation.replicas` attribute with value `"1"`.
	*   - An annotation `data` with empty string value **SHOULD** be recorded as
	*     the `k8s.statefulset.annotation.data` attribute with value `""`.
	*/
	var ATTR_K8S_STATEFULSET_ANNOTATION = (key) => `k8s.statefulset.annotation.${key}`;
	exports.ATTR_K8S_STATEFULSET_ANNOTATION = ATTR_K8S_STATEFULSET_ANNOTATION;
	/**
	* The label placed on the StatefulSet, the `<key>` being the label name, the value being the label value, even if the value is empty.
	*
	* @example guestbook
	* @example
	*
	* @note
	* Examples:
	*
	*   - A label `app` with value `guestbook` **SHOULD** be recorded
	*     as the `k8s.statefulset.label.app` attribute with value `"guestbook"`.
	*   - A label `injected` with empty string value **SHOULD** be recorded as
	*     the `k8s.statefulset.label.injected` attribute with value `""`.
	*/
	var ATTR_K8S_STATEFULSET_LABEL = (key) => `k8s.statefulset.label.${key}`;
	exports.ATTR_K8S_STATEFULSET_LABEL = ATTR_K8S_STATEFULSET_LABEL;
	/**
	* The name of the StatefulSet.
	*
	* @example opentelemetry
	*/
	exports.ATTR_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
	/**
	* The UID of the StatefulSet.
	*
	* @example 275ecb36-5aa8-4c2a-9c47-d8bb681b9aff
	*/
	exports.ATTR_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
	/**
	* Local address of the network connection - IP address or Unix domain socket name.
	*
	* @example 10.1.2.80
	* @example /tmp/my.sock
	*/
	exports.ATTR_NETWORK_LOCAL_ADDRESS = "network.local.address";
	/**
	* Local port number of the network connection.
	*
	* @example 65123
	*/
	exports.ATTR_NETWORK_LOCAL_PORT = "network.local.port";
	/**
	* Peer address of the network connection - IP address or Unix domain socket name.
	*
	* @example 10.1.2.80
	* @example /tmp/my.sock
	*/
	exports.ATTR_NETWORK_PEER_ADDRESS = "network.peer.address";
	/**
	* Peer port number of the network connection.
	*
	* @example 65123
	*/
	exports.ATTR_NETWORK_PEER_PORT = "network.peer.port";
	/**
	* [OSI application layer](https://wikipedia.org/wiki/Application_layer) or non-OSI equivalent.
	*
	* @example amqp
	* @example http
	* @example mqtt
	*
	* @note The value **SHOULD** be normalized to lowercase.
	*/
	exports.ATTR_NETWORK_PROTOCOL_NAME = "network.protocol.name";
	/**
	* The actual version of the protocol used for network communication.
	*
	* @example 1.1
	* @example 2
	*
	* @note If protocol version is subject to negotiation (for example using [ALPN](https://www.rfc-editor.org/rfc/rfc7301.html)), this attribute **SHOULD** be set to the negotiated version. If the actual protocol version is not known, this attribute **SHOULD NOT** be set.
	*/
	exports.ATTR_NETWORK_PROTOCOL_VERSION = "network.protocol.version";
	/**
	* [OSI transport layer](https://wikipedia.org/wiki/Transport_layer) or [inter-process communication method](https://wikipedia.org/wiki/Inter-process_communication).
	*
	* @example tcp
	* @example udp
	*
	* @note The value **SHOULD** be normalized to lowercase.
	*
	* Consider always setting the transport when setting a port number, since
	* a port number is ambiguous without knowing the transport. For example
	* different processes could be listening on TCP port 12345 and UDP port 12345.
	*/
	exports.ATTR_NETWORK_TRANSPORT = "network.transport";
	/**
	* Enum value "pipe" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* Named or anonymous pipe.
	*/
	exports.NETWORK_TRANSPORT_VALUE_PIPE = "pipe";
	/**
	* Enum value "quic" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* QUIC
	*/
	exports.NETWORK_TRANSPORT_VALUE_QUIC = "quic";
	/**
	* Enum value "tcp" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* TCP
	*/
	exports.NETWORK_TRANSPORT_VALUE_TCP = "tcp";
	/**
	* Enum value "udp" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* UDP
	*/
	exports.NETWORK_TRANSPORT_VALUE_UDP = "udp";
	/**
	* Enum value "unix" for attribute {@link ATTR_NETWORK_TRANSPORT}.
	*
	* Unix domain socket
	*/
	exports.NETWORK_TRANSPORT_VALUE_UNIX = "unix";
	/**
	* [OSI network layer](https://wikipedia.org/wiki/Network_layer) or non-OSI equivalent.
	*
	* @example ipv4
	* @example ipv6
	*
	* @note The value **SHOULD** be normalized to lowercase.
	*/
	exports.ATTR_NETWORK_TYPE = "network.type";
	/**
	* Enum value "ipv4" for attribute {@link ATTR_NETWORK_TYPE}.
	*
	* IPv4
	*/
	exports.NETWORK_TYPE_VALUE_IPV4 = "ipv4";
	/**
	* Enum value "ipv6" for attribute {@link ATTR_NETWORK_TYPE}.
	*
	* IPv6
	*/
	exports.NETWORK_TYPE_VALUE_IPV6 = "ipv6";
	/**
	* Identifies the class / type of event.
	*
	* @example browser.mouse.click
	* @example device.app.lifecycle
	*
	* @note This attribute **SHOULD** be used by non-OTLP exporters when destination does not support `EventName` or equivalent field. This attribute **MAY** be used by applications using existing logging libraries so that it can be used to set the `EventName` field by Collector or SDK components.
	*/
	exports.ATTR_OTEL_EVENT_NAME = "otel.event.name";
	/**
	* The name of the instrumentation scope - (`InstrumentationScope.Name` in OTLP).
	*
	* @example io.opentelemetry.contrib.mongodb
	*/
	exports.ATTR_OTEL_SCOPE_NAME = "otel.scope.name";
	/**
	* The version of the instrumentation scope - (`InstrumentationScope.Version` in OTLP).
	*
	* @example 1.0.0
	*/
	exports.ATTR_OTEL_SCOPE_VERSION = "otel.scope.version";
	/**
	* Name of the code, either "OK" or "ERROR". **MUST NOT** be set if the status code is UNSET.
	*/
	exports.ATTR_OTEL_STATUS_CODE = "otel.status_code";
	/**
	* Enum value "ERROR" for attribute {@link ATTR_OTEL_STATUS_CODE}.
	*
	* The operation contains an error.
	*/
	exports.OTEL_STATUS_CODE_VALUE_ERROR = "ERROR";
	/**
	* Enum value "OK" for attribute {@link ATTR_OTEL_STATUS_CODE}.
	*
	* The operation has been validated by an Application developer or Operator to have completed successfully.
	*/
	exports.OTEL_STATUS_CODE_VALUE_OK = "OK";
	/**
	* Description of the Status if it has a value, otherwise not set.
	*
	* @example resource not found
	*/
	exports.ATTR_OTEL_STATUS_DESCRIPTION = "otel.status_description";
	/**
	* Server domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name.
	*
	* @example example.com
	* @example 10.1.2.80
	* @example /tmp/my.sock
	*
	* @note When observed from the client side, and when communicating through an intermediary, `server.address` **SHOULD** represent the server address behind any intermediaries, for example proxies, if it's available.
	*/
	exports.ATTR_SERVER_ADDRESS = "server.address";
	/**
	* Server port number.
	*
	* @example 80
	* @example 8080
	* @example 443
	*
	* @note When observed from the client side, and when communicating through an intermediary, `server.port` **SHOULD** represent the server port behind any intermediaries, for example proxies, if it's available.
	*/
	exports.ATTR_SERVER_PORT = "server.port";
	/**
	* The string ID of the service instance.
	*
	* @example 627cc493-f310-47de-96bd-71410b7dec09
	*
	* @note **MUST** be unique for each instance of the same `service.namespace,service.name` pair (in other words
	* `service.namespace,service.name,service.instance.id` triplet **MUST** be globally unique). The ID helps to
	* distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled
	* service).
	*
	* Implementations, such as SDKs, are recommended to generate a random Version 1 or Version 4 [RFC
	* 4122](https://www.ietf.org/rfc/rfc4122.txt) UUID, but are free to use an inherent unique ID as the source of
	* this value if stability is desirable. In that case, the ID **SHOULD** be used as source of a UUID Version 5 and
	* **SHOULD** use the following UUID as the namespace: `4d63009a-8d0f-11ee-aad7-4c796ed8e320`.
	*
	* UUIDs are typically recommended, as only an opaque value for the purposes of identifying a service instance is
	* needed. Similar to what can be seen in the man page for the
	* [`/etc/machine-id`](https://www.freedesktop.org/software/systemd/man/latest/machine-id.html) file, the underlying
	* data, such as pod name and namespace should be treated as confidential, being the user's choice to expose it
	* or not via another resource attribute.
	*
	* For applications running behind an application server (like unicorn), we do not recommend using one identifier
	* for all processes participating in the application. Instead, it's recommended each division (e.g. a worker
	* thread in unicorn) to have its own instance.id.
	*
	* It's not recommended for a Collector to set `service.instance.id` if it can't unambiguously determine the
	* service instance that is generating that telemetry. For instance, creating an UUID based on `pod.name` will
	* likely be wrong, as the Collector might not know from which container within that pod the telemetry originated.
	* However, Collectors can set the `service.instance.id` if they can unambiguously determine the service instance
	* for that telemetry. This is typically the case for scraping receivers, as they know the target address and
	* port.
	*/
	exports.ATTR_SERVICE_INSTANCE_ID = "service.instance.id";
	/**
	* Logical name of the service.
	*
	* @example shoppingcart
	*
	* @note **MUST** be the same for all instances of horizontally scaled services. If the value was not specified, SDKs **MUST** fallback to `unknown_service:` concatenated with the process executable name, e.g. `unknown_service:bash`. If the process executable name is not available, the value **MUST** be set to `unknown_service`.
	* The process executable name is the name of the process executable, the same value as described by the [`process.executable.name`](process.md) resource attribute.
	*/
	exports.ATTR_SERVICE_NAME = "service.name";
	/**
	* A namespace for `service.name`.
	*
	* @example Shop
	*
	* @note A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
	*/
	exports.ATTR_SERVICE_NAMESPACE = "service.namespace";
	/**
	* The version string of the service component. The format is not defined by these conventions.
	*
	* @example 2.0.0
	* @example a01dbef8a
	*/
	exports.ATTR_SERVICE_VERSION = "service.version";
	/**
	* SignalR HTTP connection closure status.
	*
	* @example app_shutdown
	* @example timeout
	*/
	exports.ATTR_SIGNALR_CONNECTION_STATUS = "signalr.connection.status";
	/**
	* Enum value "app_shutdown" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
	*
	* The connection was closed because the app is shutting down.
	*/
	exports.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = "app_shutdown";
	/**
	* Enum value "normal_closure" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
	*
	* The connection was closed normally.
	*/
	exports.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = "normal_closure";
	/**
	* Enum value "timeout" for attribute {@link ATTR_SIGNALR_CONNECTION_STATUS}.
	*
	* The connection was closed due to a timeout.
	*/
	exports.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = "timeout";
	/**
	* [SignalR transport type](https://github.com/dotnet/aspnetcore/blob/main/src/SignalR/docs/specs/TransportProtocols.md)
	*
	* @example web_sockets
	* @example long_polling
	*/
	exports.ATTR_SIGNALR_TRANSPORT = "signalr.transport";
	/**
	* Enum value "long_polling" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
	*
	* LongPolling protocol
	*/
	exports.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = "long_polling";
	/**
	* Enum value "server_sent_events" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
	*
	* ServerSentEvents protocol
	*/
	exports.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = "server_sent_events";
	/**
	* Enum value "web_sockets" for attribute {@link ATTR_SIGNALR_TRANSPORT}.
	*
	* WebSockets protocol
	*/
	exports.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = "web_sockets";
	/**
	* The name of the auto instrumentation agent or distribution, if used.
	*
	* @example parts-unlimited-java
	*
	* @note Official auto instrumentation agents and distributions **SHOULD** set the `telemetry.distro.name` attribute to
	* a string starting with `opentelemetry-`, e.g. `opentelemetry-java-instrumentation`.
	*/
	exports.ATTR_TELEMETRY_DISTRO_NAME = "telemetry.distro.name";
	/**
	* The version string of the auto instrumentation agent or distribution, if used.
	*
	* @example 1.2.3
	*/
	exports.ATTR_TELEMETRY_DISTRO_VERSION = "telemetry.distro.version";
	/**
	* The language of the telemetry SDK.
	*/
	exports.ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
	/**
	* Enum value "cpp" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = "cpp";
	/**
	* Enum value "dotnet" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = "dotnet";
	/**
	* Enum value "erlang" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = "erlang";
	/**
	* Enum value "go" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_GO = "go";
	/**
	* Enum value "java" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = "java";
	/**
	* Enum value "kotlin" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_KOTLIN = "kotlin";
	/**
	* Enum value "nodejs" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = "nodejs";
	/**
	* Enum value "php" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = "php";
	/**
	* Enum value "python" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = "python";
	/**
	* Enum value "ruby" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = "ruby";
	/**
	* Enum value "rust" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = "rust";
	/**
	* Enum value "swift" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = "swift";
	/**
	* Enum value "webjs" for attribute {@link ATTR_TELEMETRY_SDK_LANGUAGE}.
	*/
	exports.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
	/**
	* The name of the telemetry SDK as defined above.
	*
	* @example opentelemetry
	*
	* @note The OpenTelemetry SDK **MUST** set the `telemetry.sdk.name` attribute to `opentelemetry`.
	* If another SDK, like a fork or a vendor-provided implementation, is used, this SDK **MUST** set the
	* `telemetry.sdk.name` attribute to the fully-qualified class or module name of this SDK's main entry point
	* or another suitable identifier depending on the language.
	* The identifier `opentelemetry` is reserved and **MUST NOT** be used in this case.
	* All custom identifiers **SHOULD** be stable across different versions of an implementation.
	*/
	exports.ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
	/**
	* The version string of the telemetry SDK.
	*
	* @example 1.2.3
	*/
	exports.ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
	/**
	* The [URI fragment](https://www.rfc-editor.org/rfc/rfc3986#section-3.5) component
	*
	* @example SemConv
	*/
	exports.ATTR_URL_FRAGMENT = "url.fragment";
	/**
	* Absolute URL describing a network resource according to [RFC3986](https://www.rfc-editor.org/rfc/rfc3986)
	*
	* @example https://www.foo.bar/search?q=OpenTelemetry#SemConv
	* @example //localhost
	*
	* @note For network calls, URL usually has `scheme://host[:port][path][?query][#fragment]` format, where the fragment
	* is not transmitted over HTTP, but if it is known, it **SHOULD** be included nevertheless.
	*
	* `url.full` **MUST NOT** contain credentials passed via URL in form of `https://username:password@www.example.com/`.
	* In such case username and password **SHOULD** be redacted and attribute's value **SHOULD** be `https://REDACTED:REDACTED@www.example.com/`.
	*
	* `url.full` **SHOULD** capture the absolute URL when it is available (or can be reconstructed).
	*
	* Sensitive content provided in `url.full` **SHOULD** be scrubbed when instrumentations can identify it.
	*
	*
	* Query string values for the following keys **SHOULD** be redacted by default and replaced by the
	* value `REDACTED`:
	*
	*   - [`X-Amz-Signature`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`X-Amz-Credential`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`X-Amz-Security-Token`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`sig`](https://learn.microsoft.com/azure/storage/common/storage-sas-overview#sas-token)
	*   - [`X-Goog-Signature`](https://cloud.google.com/storage/docs/access-control/signed-urls)
	*
	* This list is subject to change over time.
	*
	* Matching of query parameter keys against the sensitive list **SHOULD** be case-sensitive.
	*
	*
	* Instrumentation **MAY** provide a way to override this list via declarative configuration.
	* If so, it **SHOULD** use the `sensitive_query_parameters` property
	* (an array of case-sensitive strings with minimum items 0) under
	* `.instrumentation/development.general.sanitization.url`.
	* This list is a full override of the default sensitive query parameter keys,
	* it is not a list of keys in addition to the defaults.
	*
	* When a query string value is redacted, the query string key **SHOULD** still be preserved, e.g.
	* `https://www.example.com/path?color=blue&sig=REDACTED`.
	*/
	exports.ATTR_URL_FULL = "url.full";
	/**
	* The [URI path](https://www.rfc-editor.org/rfc/rfc3986#section-3.3) component
	*
	* @example /search
	*
	* @note Sensitive content provided in `url.path` **SHOULD** be scrubbed when instrumentations can identify it.
	*/
	exports.ATTR_URL_PATH = "url.path";
	/**
	* The [URI query](https://www.rfc-editor.org/rfc/rfc3986#section-3.4) component
	*
	* @example q=OpenTelemetry
	*
	* @note Sensitive content provided in `url.query` **SHOULD** be scrubbed when instrumentations can identify it.
	*
	*
	* Query string values for the following keys **SHOULD** be redacted by default and replaced by the value `REDACTED`:
	*
	*   - [`X-Amz-Signature`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`X-Amz-Credential`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`X-Amz-Security-Token`](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-authentication-methods.html)
	*   - [`sig`](https://learn.microsoft.com/azure/storage/common/storage-sas-overview#sas-token)
	*   - [`X-Goog-Signature`](https://cloud.google.com/storage/docs/access-control/signed-urls)
	*
	* This list is subject to change over time.
	*
	* Matching of query parameter keys against the sensitive list **SHOULD** be case-sensitive.
	*
	* Instrumentation **MAY** provide a way to override this list via declarative configuration.
	* If so, it **SHOULD** use the `sensitive_query_parameters` property
	* (an array of case-sensitive strings with minimum items 0) under
	* `.instrumentation/development.general.sanitization.url`.
	* This list is a full override of the default sensitive query parameter keys,
	* it is not a list of keys in addition to the defaults.
	*
	* When a query string value is redacted, the query string key **SHOULD** still be preserved, e.g.
	* `q=OpenTelemetry&sig=REDACTED`.
	*/
	exports.ATTR_URL_QUERY = "url.query";
	/**
	* The [URI scheme](https://www.rfc-editor.org/rfc/rfc3986#section-3.1) component identifying the used protocol.
	*
	* @example https
	* @example ftp
	* @example telnet
	*/
	exports.ATTR_URL_SCHEME = "url.scheme";
	/**
	* Value of the [HTTP User-Agent](https://www.rfc-editor.org/rfc/rfc9110.html#field.user-agent) header sent by the client.
	*
	* @example CERN-LineMode/2.15 libwww/2.17b3
	* @example Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1
	* @example YourApp/1.0.0 grpc-java-okhttp/1.27.2
	*/
	exports.ATTR_USER_AGENT_ORIGINAL = "user_agent.original";
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/src/stable_metrics.js
var require_stable_metrics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = exports.METRIC_KESTREL_UPGRADED_CONNECTIONS = exports.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = exports.METRIC_KESTREL_REJECTED_CONNECTIONS = exports.METRIC_KESTREL_QUEUED_REQUESTS = exports.METRIC_KESTREL_QUEUED_CONNECTIONS = exports.METRIC_KESTREL_CONNECTION_DURATION = exports.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = exports.METRIC_KESTREL_ACTIVE_CONNECTIONS = exports.METRIC_JVM_THREAD_COUNT = exports.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = exports.METRIC_JVM_MEMORY_USED = exports.METRIC_JVM_MEMORY_LIMIT = exports.METRIC_JVM_MEMORY_COMMITTED = exports.METRIC_JVM_GC_DURATION = exports.METRIC_JVM_CPU_TIME = exports.METRIC_JVM_CPU_RECENT_UTILIZATION = exports.METRIC_JVM_CPU_COUNT = exports.METRIC_JVM_CLASS_UNLOADED = exports.METRIC_JVM_CLASS_LOADED = exports.METRIC_JVM_CLASS_COUNT = exports.METRIC_HTTP_SERVER_REQUEST_DURATION = exports.METRIC_HTTP_CLIENT_REQUEST_DURATION = exports.METRIC_DOTNET_TIMER_COUNT = exports.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = exports.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = exports.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = exports.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = exports.METRIC_DOTNET_PROCESS_CPU_TIME = exports.METRIC_DOTNET_PROCESS_CPU_COUNT = exports.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = exports.METRIC_DOTNET_JIT_COMPILED_METHODS = exports.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = exports.METRIC_DOTNET_JIT_COMPILATION_TIME = exports.METRIC_DOTNET_GC_PAUSE_TIME = exports.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = exports.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = exports.METRIC_DOTNET_GC_COLLECTIONS = exports.METRIC_DOTNET_EXCEPTIONS = exports.METRIC_DOTNET_ASSEMBLY_COUNT = exports.METRIC_DB_CLIENT_OPERATION_DURATION = exports.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = exports.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = exports.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = exports.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = void 0;
	exports.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = void 0;
	/**
	* Number of exceptions caught by exception handling middleware.
	*
	* @note Meter name: `Microsoft.AspNetCore.Diagnostics`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = "aspnetcore.diagnostics.exceptions";
	/**
	* Number of requests that are currently active on the server that hold a rate limiting lease.
	*
	* @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = "aspnetcore.rate_limiting.active_request_leases";
	/**
	* Number of requests that are currently queued, waiting to acquire a rate limiting lease.
	*
	* @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = "aspnetcore.rate_limiting.queued_requests";
	/**
	* The time the request spent in a queue waiting to acquire a rate limiting lease.
	*
	* @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = "aspnetcore.rate_limiting.request.time_in_queue";
	/**
	* The duration of rate limiting lease held by requests on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = "aspnetcore.rate_limiting.request_lease.duration";
	/**
	* Number of requests that tried to acquire a rate limiting lease.
	*
	* @note Requests could be:
	*
	*   - Rejected by global or endpoint rate limiting policies
	*   - Canceled while waiting for the lease.
	*
	* Meter name: `Microsoft.AspNetCore.RateLimiting`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = "aspnetcore.rate_limiting.requests";
	/**
	* Number of requests that were attempted to be matched to an endpoint.
	*
	* @note Meter name: `Microsoft.AspNetCore.Routing`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = "aspnetcore.routing.match_attempts";
	/**
	* Duration of database client operations.
	*
	* @note Batch operations **SHOULD** be recorded as a single operation.
	*/
	exports.METRIC_DB_CLIENT_OPERATION_DURATION = "db.client.operation.duration";
	/**
	* The number of .NET assemblies that are currently loaded.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`AppDomain.CurrentDomain.GetAssemblies().Length`](https://learn.microsoft.com/dotnet/api/system.appdomain.getassemblies).
	*/
	exports.METRIC_DOTNET_ASSEMBLY_COUNT = "dotnet.assembly.count";
	/**
	* The number of exceptions that have been thrown in managed code.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as counting calls to [`AppDomain.CurrentDomain.FirstChanceException`](https://learn.microsoft.com/dotnet/api/system.appdomain.firstchanceexception).
	*/
	exports.METRIC_DOTNET_EXCEPTIONS = "dotnet.exceptions";
	/**
	* The number of garbage collections that have occurred since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric uses the [`GC.CollectionCount(int generation)`](https://learn.microsoft.com/dotnet/api/system.gc.collectioncount) API to calculate exclusive collections per generation.
	*/
	exports.METRIC_DOTNET_GC_COLLECTIONS = "dotnet.gc.collections";
	/**
	* The *approximate* number of bytes allocated on the managed GC heap since the process has started. The returned value does not include any native allocations.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetTotalAllocatedBytes()`](https://learn.microsoft.com/dotnet/api/system.gc.gettotalallocatedbytes).
	*/
	exports.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = "dotnet.gc.heap.total_allocated";
	/**
	* The heap fragmentation, as observed during the latest garbage collection.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetGCMemoryInfo().GenerationInfo.FragmentationAfterBytes`](https://learn.microsoft.com/dotnet/api/system.gcgenerationinfo.fragmentationafterbytes).
	*/
	exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = "dotnet.gc.last_collection.heap.fragmentation.size";
	/**
	* The managed GC heap size (including fragmentation), as observed during the latest garbage collection.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetGCMemoryInfo().GenerationInfo.SizeAfterBytes`](https://learn.microsoft.com/dotnet/api/system.gcgenerationinfo.sizeafterbytes).
	*/
	exports.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = "dotnet.gc.last_collection.heap.size";
	/**
	* The amount of committed virtual memory in use by the .NET GC, as observed during the latest garbage collection.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetGCMemoryInfo().TotalCommittedBytes`](https://learn.microsoft.com/dotnet/api/system.gcmemoryinfo.totalcommittedbytes). Committed virtual memory may be larger than the heap size because it includes both memory for storing existing objects (the heap size) and some extra memory that is ready to handle newly allocated objects in the future.
	*/
	exports.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = "dotnet.gc.last_collection.memory.committed_size";
	/**
	* The total amount of time paused in GC since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`GC.GetTotalPauseDuration()`](https://learn.microsoft.com/dotnet/api/system.gc.gettotalpauseduration).
	*/
	exports.METRIC_DOTNET_GC_PAUSE_TIME = "dotnet.gc.pause.time";
	/**
	* The amount of time the JIT compiler has spent compiling methods since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`JitInfo.GetCompilationTime()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompilationtime).
	*/
	exports.METRIC_DOTNET_JIT_COMPILATION_TIME = "dotnet.jit.compilation.time";
	/**
	* Count of bytes of intermediate language that have been compiled since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`JitInfo.GetCompiledILBytes()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompiledilbytes).
	*/
	exports.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = "dotnet.jit.compiled_il.size";
	/**
	* The number of times the JIT compiler (re)compiled methods since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`JitInfo.GetCompiledMethodCount()`](https://learn.microsoft.com/dotnet/api/system.runtime.jitinfo.getcompiledmethodcount).
	*/
	exports.METRIC_DOTNET_JIT_COMPILED_METHODS = "dotnet.jit.compiled_methods";
	/**
	* The number of times there was contention when trying to acquire a monitor lock since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`Monitor.LockContentionCount`](https://learn.microsoft.com/dotnet/api/system.threading.monitor.lockcontentioncount).
	*/
	exports.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = "dotnet.monitor.lock_contentions";
	/**
	* The number of processors available to the process.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as accessing [`Environment.ProcessorCount`](https://learn.microsoft.com/dotnet/api/system.environment.processorcount).
	*/
	exports.METRIC_DOTNET_PROCESS_CPU_COUNT = "dotnet.process.cpu.count";
	/**
	* CPU time used by the process.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as accessing the corresponding processor time properties on [`System.Diagnostics.Process`](https://learn.microsoft.com/dotnet/api/system.diagnostics.process).
	*/
	exports.METRIC_DOTNET_PROCESS_CPU_TIME = "dotnet.process.cpu.time";
	/**
	* The number of bytes of physical memory mapped to the process context.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`Environment.WorkingSet`](https://learn.microsoft.com/dotnet/api/system.environment.workingset).
	*/
	exports.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = "dotnet.process.memory.working_set";
	/**
	* The number of work items that are currently queued to be processed by the thread pool.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`ThreadPool.PendingWorkItemCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.pendingworkitemcount).
	*/
	exports.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = "dotnet.thread_pool.queue.length";
	/**
	* The number of thread pool threads that currently exist.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`ThreadPool.ThreadCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.threadcount).
	*/
	exports.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = "dotnet.thread_pool.thread.count";
	/**
	* The number of work items that the thread pool has completed since the process has started.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`ThreadPool.CompletedWorkItemCount`](https://learn.microsoft.com/dotnet/api/system.threading.threadpool.completedworkitemcount).
	*/
	exports.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = "dotnet.thread_pool.work_item.count";
	/**
	* The number of timer instances that are currently active.
	*
	* @note Meter name: `System.Runtime`; Added in: .NET 9.0.
	* This metric reports the same values as calling [`Timer.ActiveCount`](https://learn.microsoft.com/dotnet/api/system.threading.timer.activecount).
	*/
	exports.METRIC_DOTNET_TIMER_COUNT = "dotnet.timer.count";
	/**
	* Duration of HTTP client requests.
	*/
	exports.METRIC_HTTP_CLIENT_REQUEST_DURATION = "http.client.request.duration";
	/**
	* Duration of HTTP server requests.
	*/
	exports.METRIC_HTTP_SERVER_REQUEST_DURATION = "http.server.request.duration";
	/**
	* Number of classes currently loaded.
	*/
	exports.METRIC_JVM_CLASS_COUNT = "jvm.class.count";
	/**
	* Number of classes loaded since JVM start.
	*/
	exports.METRIC_JVM_CLASS_LOADED = "jvm.class.loaded";
	/**
	* Number of classes unloaded since JVM start.
	*/
	exports.METRIC_JVM_CLASS_UNLOADED = "jvm.class.unloaded";
	/**
	* Number of processors available to the Java virtual machine.
	*/
	exports.METRIC_JVM_CPU_COUNT = "jvm.cpu.count";
	/**
	* Recent CPU utilization for the process as reported by the JVM.
	*
	* @note The value range is [0.0,1.0]. This utilization is not defined as being for the specific interval since last measurement (unlike `system.cpu.utilization`). [Reference](https://docs.oracle.com/en/java/javase/17/docs/api/jdk.management/com/sun/management/OperatingSystemMXBean.html#getProcessCpuLoad()).
	*/
	exports.METRIC_JVM_CPU_RECENT_UTILIZATION = "jvm.cpu.recent_utilization";
	/**
	* CPU time used by the process as reported by the JVM.
	*/
	exports.METRIC_JVM_CPU_TIME = "jvm.cpu.time";
	/**
	* Duration of JVM garbage collection actions.
	*/
	exports.METRIC_JVM_GC_DURATION = "jvm.gc.duration";
	/**
	* Measure of memory committed.
	*/
	exports.METRIC_JVM_MEMORY_COMMITTED = "jvm.memory.committed";
	/**
	* Measure of max obtainable memory.
	*/
	exports.METRIC_JVM_MEMORY_LIMIT = "jvm.memory.limit";
	/**
	* Measure of memory used.
	*/
	exports.METRIC_JVM_MEMORY_USED = "jvm.memory.used";
	/**
	* Measure of memory used, as measured after the most recent garbage collection event on this pool.
	*/
	exports.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = "jvm.memory.used_after_last_gc";
	/**
	* Number of executing platform threads.
	*/
	exports.METRIC_JVM_THREAD_COUNT = "jvm.thread.count";
	/**
	* Number of connections that are currently active on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_ACTIVE_CONNECTIONS = "kestrel.active_connections";
	/**
	* Number of TLS handshakes that are currently in progress on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = "kestrel.active_tls_handshakes";
	/**
	* The duration of connections on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_CONNECTION_DURATION = "kestrel.connection.duration";
	/**
	* Number of connections that are currently queued and are waiting to start.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_QUEUED_CONNECTIONS = "kestrel.queued_connections";
	/**
	* Number of HTTP requests on multiplexed connections (HTTP/2 and HTTP/3) that are currently queued and are waiting to start.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_QUEUED_REQUESTS = "kestrel.queued_requests";
	/**
	* Number of connections rejected by the server.
	*
	* @note Connections are rejected when the currently active count exceeds the value configured with `MaxConcurrentConnections`.
	* Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_REJECTED_CONNECTIONS = "kestrel.rejected_connections";
	/**
	* The duration of TLS handshakes on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = "kestrel.tls_handshake.duration";
	/**
	* Number of connections that are currently upgraded (WebSockets). .
	*
	* @note The counter only tracks HTTP/1.1 connections.
	*
	* Meter name: `Microsoft.AspNetCore.Server.Kestrel`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_KESTREL_UPGRADED_CONNECTIONS = "kestrel.upgraded_connections";
	/**
	* Number of connections that are currently active on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Http.Connections`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = "signalr.server.active_connections";
	/**
	* The duration of connections on the server.
	*
	* @note Meter name: `Microsoft.AspNetCore.Http.Connections`; Added in: ASP.NET Core 8.0
	*/
	exports.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = "signalr.server.connection.duration";
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/src/stable_events.js
var require_stable_events = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EVENT_EXCEPTION = void 0;
	/**
	* This event describes a single exception.
	*/
	exports.EVENT_EXCEPTION = "exception";
}));
//#endregion
//#region node_modules/@better-auth/core/dist/instrumentation/attributes.mjs
var import_src = (/* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_trace(), exports);
	__exportStar(require_resource(), exports);
	__exportStar(require_stable_attributes(), exports);
	__exportStar(require_stable_metrics(), exports);
	__exportStar(require_stable_events(), exports);
})))();
/** Operation identifier (e.g. getSession, signUpWithEmailAndPassword). Uses endpoint operationId when set, otherwise the endpoint key. */
var ATTR_OPERATION_ID = "better_auth.operation_id";
/** Hook type (e.g. before, after, create.before). */
var ATTR_HOOK_TYPE = "better_auth.hook.type";
/** Execution context (e.g. user, plugin:id). */
var ATTR_CONTEXT = "better_auth.context";
//#endregion
//#region node_modules/@better-auth/core/dist/instrumentation/noop.mjs
function createNoopSpan() {
	const span = {
		end() {},
		setAttribute(_key, _value) {},
		setStatus(_status) {},
		recordException(_exception) {},
		updateName(_name) {
			return span;
		}
	};
	return span;
}
function createNoopTracer(noopSpan) {
	function startActiveSpan(_name, ...rest) {
		const fn = rest[rest.length - 1];
		return fn(noopSpan);
	}
	return { startActiveSpan };
}
function createNoopTraceAPI() {
	const noopTracer = createNoopTracer(createNoopSpan());
	return {
		getTracer(_name, _version) {
			return noopTracer;
		},
		getActiveSpan() {}
	};
}
function createNoopOpenTelemetryAPI() {
	return {
		SpanStatusCode: {
			UNSET: 0,
			OK: 1,
			ERROR: 2
		},
		trace: createNoopTraceAPI()
	};
}
var noopOpenTelemetryAPI = createNoopOpenTelemetryAPI();
//#endregion
//#region node_modules/@better-auth/core/dist/instrumentation/api.mjs
var openTelemetryAPIPromise;
var openTelemetryAPI;
function getOpenTelemetryAPI() {
	if (!openTelemetryAPIPromise) openTelemetryAPIPromise = import("../../_chunks/core.mjs").then((mod) => {
		openTelemetryAPI = mod;
	}).catch(() => void 0);
	return openTelemetryAPI ?? noopOpenTelemetryAPI;
}
//#endregion
//#region node_modules/@better-auth/core/dist/instrumentation/tracer.mjs
var INSTRUMENTATION_SCOPE = "better-auth";
var INSTRUMENTATION_VERSION = "1.7.2";
/**
* Better-auth uses `throw ctx.redirect(url)` for flow control (e.g. OAuth
* callbacks). These are APIErrors with 3xx status codes and should not be
* recorded as span errors.
*/
function isRedirectError(err) {
	if (err != null && typeof err === "object" && "name" in err && err.name === "APIError" && "statusCode" in err) {
		const status = err.statusCode;
		return status >= 300 && status < 400;
	}
	return false;
}
function endSpanWithError(span, err) {
	const { SpanStatusCode } = getOpenTelemetryAPI();
	if (isRedirectError(err)) {
		span.setAttribute(import_src.ATTR_HTTP_RESPONSE_STATUS_CODE, err.statusCode);
		span.setStatus({ code: SpanStatusCode.OK });
	} else {
		span.recordException(err);
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: String(err?.message ?? err)
		});
	}
	span.end();
}
function withSpan(name, attributes, fn) {
	const { trace } = getOpenTelemetryAPI();
	return trace.getTracer(INSTRUMENTATION_SCOPE, INSTRUMENTATION_VERSION).startActiveSpan(name, { attributes }, (span) => {
		try {
			const result = fn();
			if (result instanceof Promise) return result.then((value) => {
				span.end();
				return value;
			}).catch((err) => {
				endSpanWithError(span, err);
				throw err;
			});
			span.end();
			return result;
		} catch (err) {
			endSpanWithError(span, err);
			throw err;
		}
	});
}
//#endregion
//#region node_modules/@better-auth/core/dist/utils/id.mjs
var generateId = (size) => {
	return createRandomStringGenerator("a-z", "A-Z", "0-9")(size || 32);
};
//#endregion
//#region node_modules/@better-auth/core/dist/utils/host.mjs
/**
* Cloud provider instance metadata service FQDNs. These resolve to link-local
* IPs (usually `169.254.169.254`) inside their respective clouds and are
* prime SSRF targets.
*
* The IPs themselves are already caught by the `linkLocal` kind; this set
* only exists for the FQDN form that a naive server-side fetch might resolve
* via its own resolver.
*/
var CLOUD_METADATA_HOSTS = /* @__PURE__ */ new Set([
	"metadata.google.internal",
	"metadata.goog",
	"metadata",
	"instance-data",
	"instance-data.ec2.internal"
]);
/** Strip `[...]` if the entire input is bracketed (IPv6 literal form). */
function stripBrackets(host) {
	if (host.length >= 2 && host.startsWith("[") && host.endsWith("]")) return host.slice(1, -1);
	return host;
}
/**
* Strip trailing `:port` from host-with-port strings.
*
* - Bracketed IPv6 with port: `[::1]:8080` → `[::1]`
* - IPv4/FQDN with port: `127.0.0.1:3000` / `example.com:443` → base form
* - Bare IPv6: `::1` / `fe80::1` → unchanged (multiple colons means no port)
*/
function stripPort(host) {
	if (host.startsWith("[")) {
		const end = host.indexOf("]");
		if (end === -1) return host;
		return host.slice(0, end + 1);
	}
	const firstColon = host.indexOf(":");
	if (firstColon === -1) return host;
	if (host.indexOf(":", firstColon + 1) !== -1) return host;
	return host.slice(0, firstColon);
}
/** Strip IPv6 zone identifier: `fe80::1%eth0` → `fe80::1`. */
function stripZoneId(host) {
	const zone = host.indexOf("%");
	if (zone === -1) return host;
	return host.slice(0, zone);
}
/**
* Strip trailing dots (RFC 1034 absolute DNS form): `localhost.` → `localhost`.
* Without this, `metadata.google.internal.` would fall through to `public` and
* bypass the cloud-metadata / `.localhost` checks, since WHATWG URL parsing
* preserves the trailing dot in `url.hostname`.
*/
function stripTrailingDot(host) {
	return host.replace(/\.+$/, "");
}
/** Fast dotted-decimal shape check. Does NOT validate octet bounds. */
function looksLikeIPv4(host) {
	return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
}
/** Pack a validated dotted-decimal IPv4 into a 32-bit unsigned integer. */
function ipv4ToUint32(ip) {
	const parts = ip.split(".");
	return (Number(parts[0]) << 24 | Number(parts[1]) << 16 | Number(parts[2]) << 8 | Number(parts[3])) >>> 0;
}
/** Check whether a 32-bit value matches `prefix/length` (both unsigned). */
function inIPv4Range(value, prefix, length) {
	if (length === 0) return true;
	const mask = length === 32 ? 4294967295 : -1 << 32 - length >>> 0;
	return (value & mask) === (prefix & mask);
}
function classifyIPv4(ip) {
	if (ip === "0.0.0.0") return "unspecified";
	if (ip === "255.255.255.255") return "broadcast";
	const n = ipv4ToUint32(ip);
	if (inIPv4Range(n, ipv4ToUint32("127.0.0.0"), 8)) return "loopback";
	if (inIPv4Range(n, ipv4ToUint32("10.0.0.0"), 8)) return "private";
	if (inIPv4Range(n, ipv4ToUint32("172.16.0.0"), 12)) return "private";
	if (inIPv4Range(n, ipv4ToUint32("192.168.0.0"), 16)) return "private";
	if (inIPv4Range(n, ipv4ToUint32("169.254.0.0"), 16)) return "linkLocal";
	if (inIPv4Range(n, ipv4ToUint32("100.64.0.0"), 10)) return "sharedAddressSpace";
	if (inIPv4Range(n, ipv4ToUint32("192.0.2.0"), 24)) return "documentation";
	if (inIPv4Range(n, ipv4ToUint32("198.51.100.0"), 24)) return "documentation";
	if (inIPv4Range(n, ipv4ToUint32("203.0.113.0"), 24)) return "documentation";
	if (inIPv4Range(n, ipv4ToUint32("198.18.0.0"), 15)) return "benchmarking";
	if (inIPv4Range(n, ipv4ToUint32("224.0.0.0"), 4)) return "multicast";
	if (inIPv4Range(n, ipv4ToUint32("0.0.0.0"), 8)) return "reserved";
	if (inIPv4Range(n, ipv4ToUint32("192.0.0.0"), 24)) return "reserved";
	if (inIPv4Range(n, ipv4ToUint32("192.88.99.0"), 24)) return "reserved";
	if (inIPv4Range(n, ipv4ToUint32("240.0.0.0"), 4)) return "reserved";
	return "public";
}
/**
* Extract an IPv4 address embedded in an expanded IPv6 literal.
*
* Used to recurse into tunnel/translation forms (6to4, NAT64, Teredo) so a
* private destination cannot be smuggled behind a syntactically-public IPv6
* literal. `startGroup` is the index of the first of two 16-bit groups in the
* expanded form (`0000:0000:...`). With `xor: true`, the 32-bit value is XORed
* with `0xffffffff` before decoding (Teredo obfuscates the client IPv4 this
* way).
*/
function extractEmbeddedIPv4(expanded, startGroup, options = {}) {
	const offset = startGroup * 5;
	const g1 = Number.parseInt(expanded.slice(offset, offset + 4), 16);
	const g2 = Number.parseInt(expanded.slice(offset + 5, offset + 9), 16);
	if (!Number.isFinite(g1) || !Number.isFinite(g2)) return null;
	let combined = (g1 << 16 | g2) >>> 0;
	if (options.xor) combined = (combined ^ 4294967295) >>> 0;
	return `${combined >>> 24 & 255}.${combined >>> 16 & 255}.${combined >>> 8 & 255}.${combined & 255}`;
}
/**
* Classify an expanded, full-form, lowercase IPv6 address (no IPv4-mapped
* input — those are unmapped to IPv4 before reaching here).
*
* 6to4 (`2002::/16`), NAT64 (`64:ff9b::/96`) and Teredo (`2001:0000::/32`)
* embed an IPv4 that can route to private/loopback space. If the embedded
* IPv4 classifies as non-`public`, return `reserved` — blocks SSRF without
* advertising the address as a loopback literal for RFC 8252 §7.3 matching.
*/
function classifyIPv6(expanded) {
	if (expanded === "0000:0000:0000:0000:0000:0000:0000:0000") return "unspecified";
	if (expanded === "0000:0000:0000:0000:0000:0000:0000:0001") return "loopback";
	const firstByte = Number.parseInt(expanded.slice(0, 2), 16);
	const secondByte = Number.parseInt(expanded.slice(2, 4), 16);
	if (firstByte === 255) return "multicast";
	if (firstByte === 254 && (secondByte & 192) === 128) return "linkLocal";
	if (firstByte === 254 && (secondByte & 192) === 192) return "reserved";
	if ((firstByte & 254) === 252) return "private";
	if (expanded.startsWith("2001:0db8:")) return "documentation";
	if (expanded.startsWith("2001:0002:0000:")) return "benchmarking";
	if (expanded.startsWith("2002:")) {
		const embedded = extractEmbeddedIPv4(expanded, 1);
		if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
		return "public";
	}
	if (expanded.startsWith("0064:ff9b:0000:0000:0000:0000:")) {
		const embedded = extractEmbeddedIPv4(expanded, 6);
		if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
		return "reserved";
	}
	if (expanded.startsWith("0064:ff9b:0001:")) return "reserved";
	if (expanded.startsWith("2001:0000:")) {
		const embedded = extractEmbeddedIPv4(expanded, 6, { xor: true });
		if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
		return "reserved";
	}
	if (expanded.startsWith("0100:0000:0000:0000:")) return "reserved";
	if (expanded.startsWith("3fff:0")) return "documentation";
	if (expanded.startsWith("5f00:")) return "reserved";
	if (expanded.startsWith("0000:0000:0000:0000:0000:0000:")) return "reserved";
	return "public";
}
/**
* Classify a host string according to RFC 6890 / RFC 6761.
*
* Accepts inputs in any of these shapes and normalizes before classifying:
*
*   - Bare IPv4: `127.0.0.1`
*   - Bare IPv6: `::1`, `fe80::1%eth0`
*   - Bracketed IPv6: `[::1]`
*   - Host with port: `localhost:3000`, `127.0.0.1:443`, `[::1]:8080`
*   - FQDN: `example.com`, `tenant.localhost`
*   - IPv4-mapped IPv6: `::ffff:192.0.2.1` (reported as `literal: "ipv4"`)
*
* Invalid or non-resolvable FQDNs are returned as `{ kind: "public", literal: "fqdn" }`
* — this function never throws. Callers that need structural validation must
* combine this with a URL/hostname validator upstream.
*
* @example
* classifyHost("127.0.0.1")
* // { kind: "loopback", literal: "ipv4", canonical: "127.0.0.1" }
*
* @example
* classifyHost("[::1]:8080")
* // { kind: "loopback", literal: "ipv6", canonical: "0000:0000:...:0001" }
*
* @example
* classifyHost("::ffff:192.0.2.1")
* // { kind: "documentation", literal: "ipv4", canonical: "192.0.2.1" }
*
* @example
* classifyHost("tenant-a.localhost")
* // { kind: "localhost", literal: "fqdn", canonical: "tenant-a.localhost" }
*/
function classifyHost(host) {
	const lowered = stripTrailingDot(stripZoneId(stripBrackets(stripPort(host.trim())))).toLowerCase();
	if (lowered === "") return {
		kind: "reserved",
		literal: "fqdn",
		canonical: ""
	};
	if (!isValidIP(lowered)) {
		if (lowered === "localhost" || lowered.endsWith(".localhost")) return {
			kind: "localhost",
			literal: "fqdn",
			canonical: lowered
		};
		if (CLOUD_METADATA_HOSTS.has(lowered)) return {
			kind: "cloudMetadata",
			literal: "fqdn",
			canonical: lowered
		};
		return {
			kind: "public",
			literal: "fqdn",
			canonical: lowered
		};
	}
	if (looksLikeIPv4(lowered)) return {
		kind: classifyIPv4(lowered),
		literal: "ipv4",
		canonical: lowered
	};
	const canonical = normalizeIP(lowered, { ipv6Subnet: 128 });
	if (looksLikeIPv4(canonical)) return {
		kind: classifyIPv4(canonical),
		literal: "ipv4",
		canonical
	};
	return {
		kind: classifyIPv6(canonical),
		literal: "ipv6",
		canonical
	};
}
/**
* Permissive loopback check for developer-ergonomics code paths.
*
* Returns true for IPv4 `127.0.0.0/8`, IPv6 `::1`, the literal name `localhost`,
* and any RFC 6761 `.localhost` subdomain (`tenant.localhost`, `app.localhost`).
*
* Use this for things like: allowing HTTP for dev servers, skipping Secure
* cookie requirements, browser-trust heuristics. Do NOT use this for OAuth
* redirect URI matching — use {@link isLoopbackIP} there.
*
* @example
* isLoopbackHost("localhost")         // true
* isLoopbackHost("tenant.localhost")  // true  (RFC 6761)
* isLoopbackHost("127.0.0.1")         // true
* isLoopbackHost("0.0.0.0")           // false (unspecified, NOT loopback)
*/
function isLoopbackHost(host) {
	const kind = classifyHost(host).kind;
	return kind === "loopback" || kind === "localhost";
}
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/utils.mjs
/**
* Parse a provider's `scope` token-response field into a string array.
*
* RFC 6749 Section 3.3 defines `scope` as a space-delimited string, but
* providers vary: some return an already-split array. Accept both forms and
* drop empty or non-string entries.
*
* @see https://github.com/better-auth/better-auth/issues/9076
*/
function parseScopeField(scope) {
	if (Array.isArray(scope)) return scope.map((s) => typeof s === "string" ? s.trim() : "").filter(Boolean);
	if (typeof scope === "string") return scope.trim().split(/\s+/).filter(Boolean);
	return [];
}
function getOAuth2Tokens(data) {
	const getDate = (seconds) => {
		return new Date((/* @__PURE__ */ new Date()).getTime() + seconds * 1e3);
	};
	return {
		tokenType: data.token_type,
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		accessTokenExpiresAt: data.expires_in ? getDate(data.expires_in) : void 0,
		refreshTokenExpiresAt: data.refresh_token_expires_in ? getDate(data.refresh_token_expires_in) : void 0,
		scopes: parseScopeField(data.scope),
		idToken: data.id_token,
		raw: data
	};
}
/**
* Compute the union of stored and incoming OAuth scopes, preserving
* stored insertion order and dropping duplicates.
*/
function mergeScopes(stored, incoming) {
	const existing = stored ? stored.split(",").map((scope) => scope.trim()).filter(Boolean) : [];
	const next = (incoming ?? []).map((scope) => scope.trim()).filter(Boolean);
	return [.../* @__PURE__ */ new Set([...existing, ...next])].join(",");
}
/**
* Return the provider's primary Client ID: the single string, or the entry at
* array index 0 for the cross-platform form used by ID token audience
* verification. Index 0 is the designated primary and pairs with
* `clientSecret` for the authorization code flow; later array entries are
* only used as additional accepted audiences. Returns `undefined` when the
* primary value is missing or an empty string.
*/
function getPrimaryClientId(clientId) {
	const value = Array.isArray(clientId) ? clientId[0] : clientId;
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
async function generateCodeChallenge(codeVerifier) {
	const data = new TextEncoder().encode(codeVerifier);
	const hash = await crypto.subtle.digest("SHA-256", data);
	return base64Url.encode(new Uint8Array(hash), { padding: false });
}
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs
/**
* Query-parameter names that are populated by the framework as part of the
* authorization request and must not be overridden by caller-supplied
* `additionalParams`. Overriding `state`, PKCE, or `redirect_uri` would
* break the callback correlation and session pinning guarantees.
*/
var RESERVED_AUTHORIZATION_PARAMS = [
	"state",
	"client_id",
	"redirect_uri",
	"response_type",
	"code_challenge",
	"code_challenge_method",
	"nonce",
	"scope"
];
var RESERVED_AUTHORIZATION_PARAMS_SET = new Set(RESERVED_AUTHORIZATION_PARAMS);
async function createAuthorizationURL({ id, options, authorizationEndpoint, state, codeVerifier, scopes, claims, redirectURI, duration, prompt, accessType, responseType, display, loginHint, nonce, hd, responseMode, additionalParams, scopeJoiner }) {
	options = typeof options === "function" ? await options() : options;
	const url = new URL(options.authorizationEndpoint || authorizationEndpoint);
	url.searchParams.set("response_type", responseType || "code");
	const primaryClientId = getPrimaryClientId(options.clientId);
	if (!primaryClientId) throw new Error("OAuth provider requires clientId");
	url.searchParams.set("client_id", primaryClientId);
	url.searchParams.set("state", state);
	if (scopes?.length) url.searchParams.set("scope", scopes.join(scopeJoiner || " "));
	url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
	duration && url.searchParams.set("duration", duration);
	display && url.searchParams.set("display", display);
	loginHint && url.searchParams.set("login_hint", loginHint);
	nonce && url.searchParams.set("nonce", nonce);
	prompt && url.searchParams.set("prompt", prompt);
	hd && url.searchParams.set("hd", hd);
	accessType && url.searchParams.set("access_type", accessType);
	responseMode && url.searchParams.set("response_mode", responseMode);
	if (codeVerifier) {
		const codeChallenge = await generateCodeChallenge(codeVerifier);
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", codeChallenge);
	}
	if (claims) {
		const claimsObj = claims.reduce((acc, claim) => {
			acc[claim] = null;
			return acc;
		}, {});
		url.searchParams.set("claims", JSON.stringify({ id_token: {
			email: null,
			email_verified: null,
			...claimsObj
		} }));
	}
	if (additionalParams) for (const [key, value] of Object.entries(additionalParams)) {
		if (RESERVED_AUTHORIZATION_PARAMS_SET.has(key)) continue;
		url.searchParams.set(key, value);
	}
	return url;
}
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/authorization-params.mjs
/**
* Zod schema for the `additionalParams` field on social sign-in and
* account-linking request bodies. Rejects any key reserved by the
* authorization-URL builder (see `RESERVED_AUTHORIZATION_PARAMS`), so
* a caller cannot overwrite `state`, PKCE, `redirect_uri`, etc.
*/
var additionalAuthorizationParamsSchema = record(string$1(), string$1()).refine((value) => !Object.keys(value).some((key) => RESERVED_AUTHORIZATION_PARAMS_SET.has(key)), { message: `additionalParams cannot include reserved OAuth parameters: ${RESERVED_AUTHORIZATION_PARAMS.join(", ")}` }).meta({ description: "Extra query parameters to append to the provider authorization URL (e.g. Cognito identity_provider, Google hd)." }).optional();
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/basic-credentials.mjs
/**
* Encodes a value using `application/x-www-form-urlencoded` per the URL
* Living Standard. Differs from `encodeURIComponent` in two ways: it escapes
* `!`, `'`, `(`, and `)`, and it represents space as `+` rather than `%20`.
* `*` is left unescaped, matching the URL Standard's percent-encode set.
*/
function formUrlEncode(value) {
	return new URLSearchParams({ v: value }).toString().slice(2);
}
/**
* Encodes an OAuth client id and secret as an HTTP Basic credential string.
*
* Follows RFC 6749 §2.3.1: both values are `application/x-www-form-urlencoded`
* prior to base64 encoding. The returned string is the full value of the
* `Authorization` header, including the `Basic ` prefix.
*/
function encodeBasicCredentials(clientId, clientSecret) {
	const payload = `${formUrlEncode(clientId)}:${formUrlEncode(clientSecret)}`;
	return `Basic ${base64$1.encode(payload)}`;
}
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/client-assertion.mjs
var CLIENT_ASSERTION_TYPE = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
/**
* Resolves a client assertion getter into `client_assertion` + `client_assertion_type` params for injection into a token request body.
*/
async function resolveClientAssertionParams({ getClientAssertion, context }) {
	return {
		client_assertion: await getClientAssertion(context),
		client_assertion_type: CLIENT_ASSERTION_TYPE
	};
}
//#endregion
//#region node_modules/@better-fetch/fetch/dist/index.js
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __spreadValues = (a, b) => {
	for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
	if (__getOwnPropSymbols) {
		for (var prop of __getOwnPropSymbols(b)) if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
	}
	return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var BetterFetchError = class extends Error {
	constructor(status, statusText, error) {
		super(statusText || status.toString(), { cause: error });
		this.status = status;
		this.statusText = statusText;
		this.error = error;
		Error.captureStackTrace(this, this.constructor);
	}
};
var initializePlugins = async (url, options) => {
	var _a, _b, _c, _d, _e, _f;
	let opts = options || {};
	const hooks = {
		onRequest: [options == null ? void 0 : options.onRequest],
		onResponse: [options == null ? void 0 : options.onResponse],
		onSuccess: [options == null ? void 0 : options.onSuccess],
		onError: [options == null ? void 0 : options.onError],
		onRetry: [options == null ? void 0 : options.onRetry]
	};
	if (!options || !(options == null ? void 0 : options.plugins)) return {
		url,
		options: opts,
		hooks
	};
	for (const plugin of (options == null ? void 0 : options.plugins) || []) {
		if (plugin.init) {
			const pluginRes = await ((_a = plugin.init) == null ? void 0 : _a.call(plugin, url.toString(), options));
			opts = pluginRes.options || opts;
			url = pluginRes.url;
		}
		hooks.onRequest.push((_b = plugin.hooks) == null ? void 0 : _b.onRequest);
		hooks.onResponse.push((_c = plugin.hooks) == null ? void 0 : _c.onResponse);
		hooks.onSuccess.push((_d = plugin.hooks) == null ? void 0 : _d.onSuccess);
		hooks.onError.push((_e = plugin.hooks) == null ? void 0 : _e.onError);
		hooks.onRetry.push((_f = plugin.hooks) == null ? void 0 : _f.onRetry);
	}
	return {
		url,
		options: opts,
		hooks
	};
};
var LinearRetryStrategy = class {
	constructor(options) {
		this.options = options;
	}
	shouldAttemptRetry(attempt, response) {
		if (this.options.shouldRetry) return Promise.resolve(attempt < this.options.attempts && this.options.shouldRetry(response));
		return Promise.resolve(attempt < this.options.attempts);
	}
	getDelay() {
		return this.options.delay;
	}
};
var ExponentialRetryStrategy = class {
	constructor(options) {
		this.options = options;
	}
	shouldAttemptRetry(attempt, response) {
		if (this.options.shouldRetry) return Promise.resolve(attempt < this.options.attempts && this.options.shouldRetry(response));
		return Promise.resolve(attempt < this.options.attempts);
	}
	getDelay(attempt) {
		return Math.min(this.options.maxDelay, this.options.baseDelay * 2 ** attempt);
	}
};
function createRetryStrategy(options) {
	if (typeof options === "number") return new LinearRetryStrategy({
		type: "linear",
		attempts: options,
		delay: 1e3
	});
	switch (options.type) {
		case "linear": return new LinearRetryStrategy(options);
		case "exponential": return new ExponentialRetryStrategy(options);
		default: throw new Error("Invalid retry strategy");
	}
}
var getAuthHeader = async (options) => {
	const headers = {};
	const getValue = async (value) => typeof value === "function" ? await value() : value;
	if (options == null ? void 0 : options.auth) {
		if (options.auth.type === "Bearer") {
			const token = await getValue(options.auth.token);
			if (!token) return headers;
			headers["authorization"] = `Bearer ${token}`;
		} else if (options.auth.type === "Basic") {
			const [username, password] = await Promise.all([getValue(options.auth.username), getValue(options.auth.password)]);
			if (!username || !password) return headers;
			headers["authorization"] = `Basic ${btoa(`${username}:${password}`)}`;
		} else if (options.auth.type === "Custom") {
			const [prefix, value] = await Promise.all([getValue(options.auth.prefix), getValue(options.auth.value)]);
			if (!value) return headers;
			headers["authorization"] = `${prefix != null ? prefix : ""} ${value}`;
		}
	}
	return headers;
};
var JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(request) {
	const _contentType = request.headers.get("content-type");
	const textTypes = /* @__PURE__ */ new Set([
		"image/svg",
		"application/xml",
		"application/xhtml",
		"application/html"
	]);
	if (!_contentType) return "json";
	const contentType = _contentType.split(";").shift() || "";
	if (JSON_RE.test(contentType)) return "json";
	if (textTypes.has(contentType) || contentType.startsWith("text/")) return "text";
	return "blob";
}
function isJSONParsable(value) {
	try {
		JSON.parse(value);
		return true;
	} catch (error) {
		return false;
	}
}
function isJSONSerializable(value) {
	if (value === void 0) return false;
	const t = typeof value;
	if (t === "string" || t === "number" || t === "boolean" || t === null) return true;
	if (t !== "object") return false;
	if (Array.isArray(value)) return true;
	if (value.buffer) return false;
	return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
function jsonParse(text) {
	try {
		return JSON.parse(text);
	} catch (error) {
		return text;
	}
}
function isFunction(value) {
	return typeof value === "function";
}
function getFetch(options) {
	if (options == null ? void 0 : options.customFetchImpl) return options.customFetchImpl;
	if (typeof globalThis !== "undefined" && isFunction(globalThis.fetch)) return globalThis.fetch;
	if (typeof window !== "undefined" && isFunction(window.fetch)) return window.fetch;
	throw new Error("No fetch implementation found");
}
function mergeHeaders(...sources) {
	const merged = {};
	for (const source of sources) {
		if (!source) continue;
		if (source instanceof Headers) source.forEach((value, key) => {
			merged[key] = value;
		});
		else {
			const entries = Array.isArray(source) ? source : Object.entries(source);
			for (const [key, value] of entries) if (value !== null && value !== void 0) merged[key] = value;
		}
	}
	return merged;
}
async function getHeaders(opts) {
	const headers = new Headers(mergeHeaders(opts == null ? void 0 : opts.headers, await getAuthHeader(opts)));
	if (!headers.has("content-type")) {
		const contentType = detectContentType(opts == null ? void 0 : opts.body);
		if (contentType) headers.set("content-type", contentType);
	}
	return headers;
}
function detectContentType(body) {
	if (isJSONSerializable(body)) return "application/json";
	return null;
}
function getMediaType(headers) {
	const contentType = headers.get("content-type");
	return contentType ? contentType.split(";")[0].trim().toLowerCase() : null;
}
function getBody(options, headers) {
	const { body } = options;
	if (!body) return null;
	if (!isJSONSerializable(body)) return body;
	if (typeof body === "string") return body;
	if (getMediaType(headers) === "application/x-www-form-urlencoded") return new URLSearchParams(body).toString();
	return JSON.stringify(body);
}
function getMethod(url, options) {
	var _a;
	if (options == null ? void 0 : options.method) return options.method.toUpperCase();
	if (url.startsWith("@")) {
		const pMethod = (_a = url.split("@")[1]) == null ? void 0 : _a.split("/")[0];
		if (!methods.includes(pMethod)) return (options == null ? void 0 : options.body) ? "POST" : "GET";
		return pMethod.toUpperCase();
	}
	return (options == null ? void 0 : options.body) ? "POST" : "GET";
}
function getTimeout(options, controller) {
	let abortTimeout;
	if (!(options == null ? void 0 : options.signal) && (options == null ? void 0 : options.timeout)) abortTimeout = setTimeout(() => controller == null ? void 0 : controller.abort(), options == null ? void 0 : options.timeout);
	return {
		abortTimeout,
		clearTimeout: () => {
			if (abortTimeout) clearTimeout(abortTimeout);
		}
	};
}
var ValidationError = class _ValidationError extends Error {
	constructor(issues, message) {
		super(message || JSON.stringify(issues, null, 2));
		this.issues = issues;
		Object.setPrototypeOf(this, _ValidationError.prototype);
	}
};
async function parseStandardSchema(schema, input) {
	const result = await schema["~standard"].validate(input);
	if (result.issues) throw new ValidationError(result.issues);
	return result.value;
}
var methods = [
	"get",
	"post",
	"put",
	"patch",
	"delete"
];
var isReservedPathSegment = (value) => value === "." || value === "..";
function encodePathSegment(segment, pathParams) {
	let pathSegment = segment;
	for (const [key, value] of pathParams) pathSegment = pathSegment.replace(key, value);
	if (isReservedPathSegment(pathSegment)) throw new TypeError("Path parameters cannot be reserved path segments");
	return encodeURIComponent(pathSegment);
}
function getURL2(url, option) {
	const { baseURL, params, query } = option || {
		query: {},
		params: {},
		baseURL: ""
	};
	let basePath = url.startsWith("http") ? url.split("/").slice(0, 3).join("/") : baseURL || "";
	if (url.startsWith("@")) {
		const m = url.toString().split("@")[1].split("/")[0];
		if (methods.includes(m)) url = url.replace(`@${m}/`, "/");
	}
	if (!basePath.endsWith("/")) basePath += "/";
	let [path, urlQuery] = url.replace(basePath, "").split("?");
	const queryParams = new URLSearchParams(urlQuery);
	for (const [key, value] of Object.entries(query || {})) {
		if (value == null) continue;
		let serializedValue;
		if (typeof value === "string") serializedValue = value;
		else if (Array.isArray(value)) {
			for (const val of value) queryParams.append(key, val);
			continue;
		} else serializedValue = JSON.stringify(value);
		queryParams.set(key, serializedValue);
	}
	const pathParams = /* @__PURE__ */ new Map();
	if (params) {
		if (Array.isArray(params)) {
			const paramPaths = path.split("/").filter((p) => p.startsWith(":"));
			for (const [index, key] of paramPaths.entries()) {
				const value = params[index];
				pathParams.set(key, String(value));
			}
		} else for (const [key, value] of Object.entries(params)) pathParams.set(`:${key}`, String(value));
	}
	path = path.split("/").map((segment) => encodePathSegment(segment, pathParams)).join("/");
	path = path.replace(/^\/+/, "");
	let queryParamString = queryParams.toString();
	queryParamString = queryParamString.length > 0 ? `?${queryParamString}`.replace(/\+/g, "%20") : "";
	if (!basePath.startsWith("http")) return `${basePath}${path}${queryParamString}`;
	return new URL(`${path}${queryParamString}`, basePath);
}
var betterFetch = async (url, options) => {
	var _a, _b, _c, _d, _e, _f, _g, _h;
	const { hooks, url: __url, options: opts } = await initializePlugins(url, options);
	const fetch = getFetch(opts);
	const controller = new AbortController();
	const signal = (_a = opts.signal) != null ? _a : controller.signal;
	const _url = getURL2(__url, opts);
	const headers = await getHeaders(opts);
	const body = getBody(opts, headers);
	const method = getMethod(__url, opts);
	const context = __spreadProps(__spreadValues({}, opts), {
		url: _url,
		headers,
		body,
		method,
		signal
	});
	for (const onRequest of hooks.onRequest) if (onRequest) {
		const res = await onRequest(context);
		if (typeof res === "object" && res !== null) Object.assign(context, res);
	}
	if ("pipeTo" in context && typeof context.pipeTo === "function" || typeof ((_b = options == null ? void 0 : options.body) == null ? void 0 : _b.pipe) === "function") {
		if (!("duplex" in context)) context.duplex = "half";
	}
	const { clearTimeout: clearTimeout2 } = getTimeout(opts, controller);
	let response = await fetch(context.url, context);
	clearTimeout2();
	const responseContext = {
		response,
		request: context
	};
	for (const onResponse of hooks.onResponse) if (onResponse) {
		const r = await onResponse(__spreadProps(__spreadValues({}, responseContext), { response: ((_c = options == null ? void 0 : options.hookOptions) == null ? void 0 : _c.cloneResponse) ? response.clone() : response }));
		if (r instanceof Response) response = r;
		else if (typeof r === "object" && r !== null) response = r.response;
	}
	if (response.ok) {
		if (!(context.method !== "HEAD")) return {
			data: "",
			error: null
		};
		const responseType = detectResponseType(response);
		const successContext = {
			data: null,
			response,
			request: context
		};
		if (responseType === "json" || responseType === "text") {
			const text = await response.text();
			successContext.data = await ((_d = context.jsonParser) != null ? _d : jsonParse)(text);
		} else successContext.data = await response[responseType]();
		if (context == null ? void 0 : context.output) {
			if (context.output && !context.disableValidation) successContext.data = await parseStandardSchema(context.output, successContext.data);
		}
		for (const onSuccess of hooks.onSuccess) if (onSuccess) await onSuccess(__spreadProps(__spreadValues({}, successContext), { response: ((_e = options == null ? void 0 : options.hookOptions) == null ? void 0 : _e.cloneResponse) ? response.clone() : response }));
		if (options == null ? void 0 : options.throw) return successContext.data;
		return {
			data: successContext.data,
			error: null
		};
	}
	const parser = (_f = options == null ? void 0 : options.jsonParser) != null ? _f : jsonParse;
	const responseText = await response.text();
	const isJSONResponse = isJSONParsable(responseText);
	const errorObject = isJSONResponse ? await parser(responseText) : null;
	const errorContext = {
		response,
		responseText,
		request: context,
		error: __spreadProps(__spreadValues({}, errorObject), {
			status: response.status,
			statusText: response.statusText
		})
	};
	for (const onError of hooks.onError) if (onError) await onError(__spreadProps(__spreadValues({}, errorContext), { response: ((_g = options == null ? void 0 : options.hookOptions) == null ? void 0 : _g.cloneResponse) ? response.clone() : response }));
	if (options == null ? void 0 : options.retry) {
		const retryStrategy = createRetryStrategy(options.retry);
		const _retryAttempt = (_h = options.retryAttempt) != null ? _h : 0;
		if (await retryStrategy.shouldAttemptRetry(_retryAttempt, response)) {
			for (const onRetry of hooks.onRetry) if (onRetry) await onRetry(responseContext);
			const delay = retryStrategy.getDelay(_retryAttempt);
			await new Promise((resolve) => setTimeout(resolve, delay));
			return await betterFetch(url, __spreadProps(__spreadValues({}, options), { retryAttempt: _retryAttempt + 1 }));
		}
	}
	if (options == null ? void 0 : options.throw) throw new BetterFetchError(response.status, response.statusText, isJSONResponse ? errorObject : responseText);
	return {
		data: null,
		error: __spreadProps(__spreadValues({}, errorObject), {
			status: response.status,
			statusText: response.statusText
		})
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/reject-redirects.mjs
var httpRedirectStatuses = /* @__PURE__ */ new Set([
	301,
	302,
	303,
	307,
	308
]);
/**
* Whether a response from a `redirect: "manual"` fetch is a redirect.
*
* Node/undici exposes the real 3xx status. Spec-compliant runtimes (Cloudflare
* Workers, Deno, browsers) return an opaque-redirect filtered response with
* status 0 and type `"opaqueredirect"`, so the status alone is not enough.
*/
function isRedirectResponse(response) {
	return response.type === "opaqueredirect" || httpRedirectStatuses.has(response.status);
}
function redirectRefused(endpoint) {
	return new BetterAuthError(`The OAuth endpoint "${endpoint}" returned an HTTP redirect. Server-side OAuth fetches refuse redirects to prevent SSRF; configure the final endpoint URL.`);
}
/**
* Fetch option that refuses HTTP redirects portably.
*
* Cloudflare Workers (workerd) rejects `redirect: "error"`, so manual mode is
* used and the resolved response is checked with {@link assertResponseNotRedirect}
* (or, for betterFetch, with {@link fetchRefusingRedirects}).
*/
var noFollowRedirect = { redirect: "manual" };
/**
* betterFetch that refuses HTTP redirects on a server-side OAuth fetch.
*
* Returns the betterFetch result and throws if the endpoint redirected, on both
* undici (real 3xx status) and spec-compliant runtimes (opaque redirect, where
* the error status is 0). The redirect is never followed on any runtime.
*/
async function fetchRefusingRedirects(url, options) {
	let redirected = false;
	const onError = options?.onError;
	const result = await betterFetch(url, {
		...options,
		...noFollowRedirect,
		async onError(context) {
			if (isRedirectResponse(context.response)) redirected = true;
			await onError?.(context);
		}
	}).catch((error) => {
		if (redirected) throw redirectRefused(url);
		throw error;
	});
	if (redirected) throw redirectRefused(url);
	return result;
}
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/token-endpoint-auth.mjs
function getDefaultTokenEndpointAuth(options, authentication) {
	if (authentication === "basic") return { method: "client_secret_basic" };
	if (options.clientSecret) return { method: "client_secret_post" };
	return { method: "none" };
}
function assertNoClientSecret(method, options, body) {
	if (options.clientSecret || body.has("client_secret")) throw new Error(`${method} token endpoint authentication cannot be combined with clientSecret`);
}
function setClientId(body, clientId) {
	if (clientId) body.set("client_id", clientId);
}
function assertClientSecretConfigured(method, options) {
	if (!options.clientSecret) throw new Error(`${method} token endpoint authentication requires clientSecret`);
}
function assertClientIdConfigured(method, clientId) {
	if (!clientId) throw new Error(`${method} token endpoint authentication requires clientId`);
}
function setClientSecretPostAuth({ body, options, clientId, requireClientSecret }) {
	if (requireClientSecret) assertClientSecretConfigured("client_secret_post", options);
	if (options.clientSecret) {
		assertClientIdConfigured("client_secret_post", clientId);
		setClientId(body, clientId);
		body.set("client_secret", options.clientSecret);
	}
}
function setClientSecretBasicAuth({ headers, options, clientId, body }) {
	if (body.has("client_secret")) throw new Error("client_secret_basic token endpoint authentication cannot be combined with client_secret body parameters");
	assertClientSecretConfigured("client_secret_basic", options);
	assertClientIdConfigured("client_secret_basic", clientId);
	headers.authorization = encodeBasicCredentials(clientId, options.clientSecret);
}
function assertCompleteManualClientAssertion(body) {
	if (body.has("client_assertion") !== body.has("client_assertion_type")) throw new Error("client_assertion and client_assertion_type must both be provided");
}
async function applyTokenEndpointAuth({ body, headers, options, tokenEndpoint, grantType, tokenEndpointAuth, authentication }) {
	assertCompleteManualClientAssertion(body);
	const clientId = getPrimaryClientId(options.clientId);
	if (body.has("client_assertion")) {
		if (tokenEndpointAuth) throw new Error("client_assertion body parameters cannot be combined with tokenEndpointAuth");
		assertNoClientSecret("private_key_jwt", options, body);
		setClientId(body, clientId);
		return;
	}
	const auth = tokenEndpointAuth ?? getDefaultTokenEndpointAuth(options, authentication);
	if (auth.method === "private_key_jwt") {
		assertNoClientSecret(auth.method, options, body);
		assertClientIdConfigured(auth.method, clientId);
		if (!tokenEndpoint) throw new Error("private_key_jwt token endpoint authentication requires tokenEndpoint");
		const assertionParams = await resolveClientAssertionParams({
			getClientAssertion: auth.getClientAssertion,
			context: {
				clientId,
				tokenEndpoint,
				grantType
			}
		});
		setClientId(body, clientId);
		for (const [key, value] of Object.entries(assertionParams)) body.set(key, value);
		return;
	}
	if (auth.method === "none") {
		assertNoClientSecret(auth.method, options, body);
		if (grantType === "client_credentials") throw new Error("none token endpoint authentication cannot be used with client_credentials grant");
		assertClientIdConfigured(auth.method, clientId);
		setClientId(body, clientId);
		return;
	}
	if (auth.method === "client_secret_basic") {
		setClientSecretBasicAuth({
			headers,
			options,
			clientId,
			body
		});
		return;
	}
	setClientSecretPostAuth({
		body,
		options,
		clientId,
		requireClientSecret: tokenEndpointAuth?.method === "client_secret_post"
	});
}
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs
var BLOCKED_REFRESH_TOKEN_PARAMS_SET = /* @__PURE__ */ new Set([
	"grant_type",
	"refresh_token",
	"__proto__",
	"constructor",
	"prototype"
]);
async function refreshAccessTokenRequest({ refreshToken, options, authentication, tokenEndpointAuth, tokenEndpoint, extraParams, resource }) {
	options = typeof options === "function" ? await options() : options;
	const request = buildRefreshAccessTokenRequest({
		refreshToken,
		options,
		extraParams,
		resource
	});
	await applyTokenEndpointAuth({
		body: request.body,
		headers: request.headers,
		options,
		tokenEndpoint: tokenEndpoint ?? "",
		grantType: "refresh_token",
		tokenEndpointAuth,
		authentication
	});
	return request;
}
function applyRefreshExtraParams(body, extraParams) {
	if (!extraParams) return;
	for (const [key, value] of Object.entries(extraParams)) {
		if (BLOCKED_REFRESH_TOKEN_PARAMS_SET.has(key)) continue;
		body.set(key, value);
	}
}
function buildRefreshAccessTokenRequest({ refreshToken, options, extraParams, resource }) {
	const body = new URLSearchParams();
	const headers = {
		"content-type": "application/x-www-form-urlencoded",
		accept: "application/json"
	};
	body.set("grant_type", "refresh_token");
	body.set("refresh_token", refreshToken);
	if (resource) if (typeof resource === "string") body.append("resource", resource);
	else for (const _resource of resource) body.append("resource", _resource);
	if (extraParams) applyRefreshExtraParams(body, extraParams);
	return {
		body,
		headers
	};
}
async function refreshAccessToken({ refreshToken, options, tokenEndpoint, authentication, tokenEndpointAuth, extraParams, resource }) {
	const { body, headers } = await refreshAccessTokenRequest({
		refreshToken,
		options,
		authentication,
		tokenEndpointAuth,
		tokenEndpoint,
		extraParams,
		resource
	});
	const { data, error } = await fetchRefusingRedirects(tokenEndpoint, {
		method: "POST",
		body,
		headers
	});
	if (error) throw error;
	const tokens = {
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		tokenType: data.token_type,
		scopes: parseScopeField(data.scope),
		idToken: data.id_token
	};
	if (data.expires_in) tokens.accessTokenExpiresAt = new Date((/* @__PURE__ */ new Date()).getTime() + data.expires_in * 1e3);
	if (data.refresh_token_expires_in) tokens.refreshTokenExpiresAt = new Date((/* @__PURE__ */ new Date()).getTime() + data.refresh_token_expires_in * 1e3);
	return tokens;
}
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs
async function authorizationCodeRequest({ code, codeVerifier, redirectURI, options, authentication, tokenEndpointAuth, tokenEndpoint, deviceId, headers, additionalParams = {}, resource }) {
	options = typeof options === "function" ? await options() : options;
	const request = buildAuthorizationCodeRequest({
		code,
		codeVerifier,
		redirectURI,
		options,
		deviceId,
		headers,
		additionalParams,
		resource
	});
	await applyTokenEndpointAuth({
		body: request.body,
		headers: request.headers,
		options,
		tokenEndpoint: tokenEndpoint ?? "",
		grantType: "authorization_code",
		tokenEndpointAuth,
		authentication
	});
	return request;
}
function buildAuthorizationCodeRequest({ code, codeVerifier, redirectURI, options, deviceId, headers, additionalParams = {}, resource }) {
	const body = new URLSearchParams();
	const requestHeaders = {
		"content-type": "application/x-www-form-urlencoded",
		accept: "application/json",
		...headers
	};
	body.set("grant_type", "authorization_code");
	body.set("code", code);
	codeVerifier && body.set("code_verifier", codeVerifier);
	options.clientKey && body.set("client_key", options.clientKey);
	deviceId && body.set("device_id", deviceId);
	body.set("redirect_uri", options.redirectURI || redirectURI);
	if (resource) if (typeof resource === "string") body.append("resource", resource);
	else for (const _resource of resource) body.append("resource", _resource);
	for (const [key, value] of Object.entries(additionalParams)) if (!body.has(key)) body.append(key, value);
	return {
		body,
		headers: requestHeaders
	};
}
async function validateAuthorizationCode({ code, codeVerifier, redirectURI, options, tokenEndpoint, authentication, tokenEndpointAuth, deviceId, headers, additionalParams = {}, resource }) {
	const { body, headers: requestHeaders } = await authorizationCodeRequest({
		code,
		codeVerifier,
		redirectURI,
		options,
		authentication,
		tokenEndpointAuth,
		tokenEndpoint,
		deviceId,
		headers,
		additionalParams,
		resource
	});
	const { data, error } = await fetchRefusingRedirects(tokenEndpoint, {
		method: "POST",
		body,
		headers: requestHeaders
	});
	if (error) throw error;
	return getOAuth2Tokens(data);
}
//#endregion
//#region node_modules/@better-auth/core/dist/oauth2/verify-id-token.mjs
async function sha256Hex(value) {
	const data = new TextEncoder().encode(value);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function nonceMatches(claimNonce, nonce, comparison = "exact") {
	if (typeof claimNonce !== "string") return false;
	if (claimNonce === nonce) return true;
	if (comparison === "exact-or-sha256") return claimNonce === await sha256Hex(nonce);
	return false;
}
/**
* Whether a provider can verify a client-submitted id_token.
*
* A provider supports id_token sign-in when it declares an {@link OAuthProvider.idToken}
* verification config, or when the integrator supplies a `verifyIdToken` override on the
* provider options. A provider whose options set `disableIdTokenSignIn`, or that declares
* neither, rejects the client id_token sign-in path with `ID_TOKEN_NOT_SUPPORTED`.
*/
function supportsIdTokenSignIn(provider) {
	const options = provider.options ?? {};
	if (options.disableIdTokenSignIn) return false;
	return Boolean(provider.idToken || options.verifyIdToken);
}
/**
* Verify a client-submitted id_token against a provider's verification config.
*
* This is the single id_token verifier for every social provider. Providers no longer
* implement their own boolean `verifyIdToken`; they declare an {@link OAuthProvider.idToken}
* config and this function performs the cryptographic check. The contract is fail-closed: a
* provider without a config (and without an integrator `verifyIdToken` override) returns
* `false`, so a forged token can never be accepted by omission.
*
* @returns `true` only when the token is authentic for the provider.
*/
async function verifyProviderIdToken(provider, token, nonce, ctx) {
	const options = provider.options ?? {};
	if (options.disableIdTokenSignIn) return false;
	try {
		if (options.verifyIdToken) return await options.verifyIdToken(token, nonce, ctx);
		const config = provider.idToken;
		if (!config) return false;
		if ("verify" in config) return await config.verify(token, nonce, ctx);
		if (token.split(".").length !== 3) return config.allowOpaqueToken === true;
		const { alg } = decodeProtectedHeader(token);
		const { payload } = await jwtVerify(token, config.jwks, {
			issuer: config.issuer,
			audience: config.audience,
			algorithms: config.algorithms ?? (alg ? [alg] : void 0),
			maxTokenAge: config.maxTokenAge
		});
		if (nonce && !await nonceMatches(payload.nonce, nonce, config.nonceComparison)) return false;
		if (config.verifyClaims && !config.verifyClaims(payload)) return false;
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/apple.mjs
var apple = (options) => {
	const tokenEndpoint = "https://appleid.apple.com/auth/token";
	return {
		id: "apple",
		name: "Apple",
		accountSubject: ({ profile }) => profile.sub,
		accountIssuer: "https://appleid.apple.com",
		async createAuthorizationURL({ state, scopes, redirectURI, additionalParams, codeVerifier }) {
			if (!getPrimaryClientId(options.clientId) || !options.clientSecret) {
				logger.error("Client ID and client secret are required for Apple. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			const _scope = options.disableDefaultScope ? [] : ["email", "name"];
			if (options.scope) _scope.push(...options.scope);
			if (scopes) _scope.push(...scopes);
			return await createAuthorizationURL({
				id: "apple",
				options,
				authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
				scopes: _scope,
				state,
				redirectURI,
				codeVerifier,
				responseMode: "form_post",
				responseType: "code id_token",
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		idToken: {
			jwks: (header) => getApplePublicKey(header.kid),
			issuer: "https://appleid.apple.com",
			audience: options.audience && options.audience.length ? options.audience : options.appBundleIdentifier ? options.appBundleIdentifier : options.clientId,
			maxTokenAge: "1h",
			nonceComparison: "exact-or-sha256"
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options,
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.idToken) return null;
			const profile = decodeJwt(token.idToken);
			if (!profile) return null;
			let name;
			if (token.user?.name) name = `${token.user.name.firstName || ""} ${token.user.name.lastName || ""}`.trim();
			else name = profile.name || "";
			const emailVerified = typeof profile.email_verified === "boolean" ? profile.email_verified : profile.email_verified === "true";
			const enrichedProfile = {
				...profile,
				name
			};
			const userMap = await options.mapProfileToUser?.(enrichedProfile);
			return {
				user: {
					name: enrichedProfile.name,
					emailVerified,
					email: profile.email,
					...userMap
				},
				data: enrichedProfile
			};
		},
		options
	};
};
var getApplePublicKey = async (kid) => {
	const { data } = await betterFetch(`https://appleid.apple.com/auth/keys`);
	if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
	const jwk = data.keys.find((key) => key.kid === kid);
	if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
	return await importJWK(jwk, jwk.alg);
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/atlassian.mjs
var atlassian = (options) => {
	const tokenEndpoint = "https://auth.atlassian.com/oauth/token";
	return {
		id: "atlassian",
		name: "Atlassian",
		accountSubject: ({ profile }) => profile.account_id,
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Secret are required for Atlassian");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Atlassian");
			const _scopes = options.disableDefaultScope ? [] : ["read:jira-user", "offline_access"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "atlassian",
				options,
				authorizationEndpoint: "https://auth.atlassian.com/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				additionalParams: {
					...additionalParams ?? {},
					audience: "api.atlassian.com"
				},
				prompt: options.prompt
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.accessToken) return null;
			try {
				const { data: profile } = await betterFetch("https://api.atlassian.com/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
				if (!profile) return null;
				const userMap = await options.mapProfileToUser?.(profile);
				return {
					user: {
						name: profile.name,
						email: profile.email,
						image: profile.picture,
						emailVerified: false,
						...userMap
					},
					data: profile
				};
			} catch (error) {
				logger.error("Failed to fetch user info from Figma:", error);
				return null;
			}
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/cognito.mjs
var cognito = (options) => {
	if (!options.domain || !options.region || !options.userPoolId) {
		logger.error("Domain, region and userPoolId are required for Amazon Cognito. Make sure to provide them in the options.");
		throw new BetterAuthError("DOMAIN_AND_REGION_REQUIRED");
	}
	const cleanDomain = options.domain.replace(/^https?:\/\//, "");
	const authorizationEndpoint = `https://${cleanDomain}/oauth2/authorize`;
	const tokenEndpoint = `https://${cleanDomain}/oauth2/token`;
	const userInfoEndpoint = `https://${cleanDomain}/oauth2/userinfo`;
	return {
		id: "cognito",
		name: "Cognito",
		accountSubject: ({ profile }) => profile.sub,
		accountIssuer: `https://cognito-idp.${options.region}.amazonaws.com/${options.userPoolId}`,
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			if (!getPrimaryClientId(options.clientId)) {
				logger.error("ClientId is required for Amazon Cognito. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (options.requireClientSecret && !options.clientSecret) {
				logger.error("Client Secret is required when requireClientSecret is true. Make sure to provide it in the options.");
				throw new BetterAuthError("CLIENT_SECRET_REQUIRED");
			}
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			const url = await createAuthorizationURL({
				id: "cognito",
				options: { ...options },
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt,
				additionalParams: {
					...options.identityProvider ? { identity_provider: options.identityProvider } : {},
					...additionalParams ?? {}
				}
			});
			const scopeValue = url.searchParams.get("scope");
			if (scopeValue) {
				url.searchParams.delete("scope");
				const encodedScope = encodeURIComponent(scopeValue);
				const urlString = url.toString();
				const separator = urlString.includes("?") ? "&" : "?";
				return new URL(`${urlString}${separator}scope=${encodedScope}`);
			}
			return url;
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		idToken: {
			jwks: (header) => getCognitoPublicKey(header.kid, options.region, options.userPoolId),
			issuer: `https://cognito-idp.${options.region}.amazonaws.com/${options.userPoolId}`,
			audience: options.clientId,
			maxTokenAge: "1h"
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (token.idToken) try {
				const profile = decodeJwt(token.idToken);
				if (!profile) return null;
				const name = profile.name || profile.given_name || profile.username || "";
				const enrichedProfile = {
					...profile,
					name
				};
				const userMap = await options.mapProfileToUser?.(enrichedProfile);
				return {
					user: {
						name: enrichedProfile.name,
						email: profile.email,
						image: profile.picture,
						emailVerified: profile.email_verified,
						...userMap
					},
					data: enrichedProfile
				};
			} catch (error) {
				logger.error("Failed to decode ID token:", error);
			}
			if (token.accessToken) try {
				const { data: userInfo } = await betterFetch(userInfoEndpoint, { headers: { Authorization: `Bearer ${token.accessToken}` } });
				if (userInfo) {
					const userMap = await options.mapProfileToUser?.(userInfo);
					return {
						user: {
							name: userInfo.name || userInfo.given_name || userInfo.username || "",
							email: userInfo.email,
							image: userInfo.picture,
							emailVerified: userInfo.email_verified,
							...userMap
						},
						data: userInfo
					};
				}
			} catch (error) {
				logger.error("Failed to fetch user info from Cognito:", error);
			}
			return null;
		},
		options
	};
};
var getCognitoPublicKey = async (kid, region, userPoolId) => {
	const COGNITO_JWKS_URI = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
	try {
		const { data } = await betterFetch(COGNITO_JWKS_URI);
		if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
		const jwk = data.keys.find((key) => key.kid === kid);
		if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
		return await importJWK(jwk, jwk.alg);
	} catch (error) {
		logger.error("Failed to fetch Cognito public key:", error);
		throw error;
	}
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/discord.mjs
var discord = (options) => {
	const tokenEndpoint = "https://discord.com/api/oauth2/token";
	return {
		id: "discord",
		name: "Discord",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["identify", "email"];
			if (scopes) _scopes.push(...scopes);
			if (options.scope) _scopes.push(...options.scope);
			const hasBotScope = _scopes.includes("bot");
			return createAuthorizationURL({
				id: "discord",
				options,
				authorizationEndpoint: "https://discord.com/api/oauth2/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				prompt: options.prompt || "none",
				additionalParams: {
					...hasBotScope && options.permissions !== void 0 ? { permissions: String(options.permissions) } : {},
					...additionalParams ?? {}
				}
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://discord.com/api/users/@me", { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			if (profile.avatar === null) profile.image_url = `https://cdn.discordapp.com/embed/avatars/${profile.discriminator === "0" ? Number(BigInt(profile.id) >> BigInt(22)) % 6 : parseInt(profile.discriminator) % 5}.png`;
			else {
				const format = profile.avatar.startsWith("a_") ? "gif" : "png";
				profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
			}
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.global_name || profile.username || "",
					email: profile.email,
					emailVerified: profile.verified,
					image: profile.image_url,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/dropbox.mjs
var dropbox = (options) => {
	const tokenEndpoint = "https://api.dropboxapi.com/oauth2/token";
	return {
		id: "dropbox",
		name: "Dropbox",
		accountSubject: ({ profile }) => profile.account_id,
		createAuthorizationURL: async ({ state, scopes, codeVerifier, redirectURI, additionalParams }) => {
			const _scopes = options.disableDefaultScope ? [] : ["account_info.read"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "dropbox",
				options,
				authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				codeVerifier,
				additionalParams: {
					...options.accessType ? { token_access_type: options.accessType } : {},
					...additionalParams ?? {}
				}
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return await validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.dropboxapi.com/2/users/get_current_account", {
				method: "POST",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name?.display_name,
					email: profile.email,
					emailVerified: profile.email_verified || false,
					image: profile.profile_photo_url,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/facebook.mjs
/**
* Validate an opaque Facebook access token against the configured app.
*
* Facebook access tokens are not audience-bound at the Graph `/me` endpoint: a
* token minted for any Facebook app returns that app's profile. Without this
* check, a token issued to an unrelated app could be presented to this
* app's direct sign-in path and accepted as proof of identity. We call the
* `debug_token` endpoint and require the token to be valid, bound to one of the
* configured client ids, and tied to a user.
*
* @see https://developers.facebook.com/docs/facebook-login/guides/access-tokens/debugging
*
* @returns the inspected token's `user_id` when the token is valid and bound to
* the configured app, otherwise `null`.
*/
async function verifyFacebookAccessToken(accessToken, options) {
	const primaryClientId = getPrimaryClientId(options.clientId);
	if (!primaryClientId || !options.clientSecret) return null;
	const clientIds = Array.isArray(options.clientId) ? options.clientId : [options.clientId];
	const { data, error } = await betterFetch("https://graph.facebook.com/debug_token", { query: {
		input_token: accessToken,
		access_token: `${primaryClientId}|${options.clientSecret}`
	} });
	if (error || !data?.data) return null;
	const { is_valid, app_id, user_id } = data.data;
	if (is_valid !== true || !app_id || !clientIds.includes(app_id) || !user_id) return null;
	return user_id;
}
var facebook = (options) => {
	return {
		id: "facebook",
		name: "Facebook",
		accountSubject: ({ profile }) => "sub" in profile ? profile.sub : profile.id,
		accountIssuer: "https://www.facebook.com",
		async createAuthorizationURL({ state, scopes, redirectURI, loginHint, additionalParams }) {
			if (!getPrimaryClientId(options.clientId) || !options.clientSecret) {
				logger.error("Client ID and client secret are required for Facebook. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			const _scopes = options.disableDefaultScope ? [] : ["email", "public_profile"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "facebook",
				options,
				authorizationEndpoint: "https://www.facebook.com/v24.0/dialog/oauth",
				scopes: _scopes,
				state,
				redirectURI,
				loginHint,
				additionalParams: {
					...options.configId ? { config_id: options.configId } : {},
					...additionalParams ?? {}
				}
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint: "https://graph.facebook.com/v24.0/oauth/access_token"
			});
		},
		idToken: {
			jwks: createRemoteJWKSet(new URL("https://limited.facebook.com/.well-known/oauth/openid/jwks/")),
			issuer: "https://www.facebook.com",
			audience: options.clientId,
			algorithms: ["RS256"],
			allowOpaqueToken: true
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint: "https://graph.facebook.com/v24.0/oauth/access_token"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (token.idToken && token.idToken.split(".").length === 3) {
				const profile = decodeJwt(token.idToken);
				const userMap = await options.mapProfileToUser?.(profile);
				return {
					user: {
						name: profile.name,
						email: profile.email,
						image: profile.picture,
						emailVerified: false,
						...userMap
					},
					data: profile
				};
			}
			const accessToken = token.accessToken;
			if (!accessToken) return null;
			const tokenUserId = await verifyFacebookAccessToken(accessToken, options);
			if (!tokenUserId) return null;
			const { data: profile, error } = await betterFetch("https://graph.facebook.com/me?fields=" + [
				"id",
				"name",
				"email",
				"picture",
				...options?.fields || []
			].join(","), { auth: {
				type: "Bearer",
				token: accessToken
			} });
			if (error) return null;
			if (profile.id !== tokenUserId) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name,
					email: profile.email,
					image: profile.picture.data.url,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/figma.mjs
var figma = (options) => {
	const tokenEndpoint = "https://api.figma.com/v1/oauth/token";
	return {
		id: "figma",
		name: "Figma",
		accountSubject: ({ profile }) => profile.id,
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Client Secret are required for Figma. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Figma");
			const _scopes = options.disableDefaultScope ? [] : ["current_user:read"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "figma",
				options,
				authorizationEndpoint: "https://www.figma.com/oauth",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint,
				authentication: "basic"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint,
				authentication: "basic"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			try {
				const { data: profile } = await betterFetch("https://api.figma.com/v1/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
				if (!profile) {
					logger.error("Failed to fetch user from Figma");
					return null;
				}
				const userMap = await options.mapProfileToUser?.(profile);
				return {
					user: {
						name: profile.handle,
						email: profile.email,
						image: profile.img_url,
						emailVerified: false,
						...userMap
					},
					data: profile
				};
			} catch (error) {
				logger.error("Failed to fetch user info from Figma:", error);
				return null;
			}
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/github.mjs
var github = (options) => {
	const tokenEndpoint = "https://github.com/login/oauth/access_token";
	return {
		id: "github",
		name: "GitHub",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL({ state, scopes, loginHint, codeVerifier, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["read:user", "user:email"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "github",
				options,
				authorizationEndpoint: "https://github.com/login/oauth/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				loginHint,
				prompt: options.prompt,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			const { body, headers: requestHeaders } = await authorizationCodeRequest({
				code,
				codeVerifier,
				redirectURI,
				options
			});
			const { data, error } = await betterFetch(tokenEndpoint, {
				method: "POST",
				body,
				headers: requestHeaders
			});
			if (error) {
				logger.error("GitHub OAuth token exchange failed:", error);
				return null;
			}
			if ("error" in data) {
				logger.error("GitHub OAuth token exchange failed:", data);
				return null;
			}
			return getOAuth2Tokens(data);
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.github.com/user", { headers: {
				"User-Agent": "better-auth",
				authorization: `Bearer ${token.accessToken}`
			} });
			if (error) return null;
			const { data: emails } = await betterFetch("https://api.github.com/user/emails", { headers: {
				Authorization: `Bearer ${token.accessToken}`,
				"User-Agent": "better-auth"
			} });
			if (!profile.email && emails) profile.email = (emails.find((e) => e.primary) ?? emails[0])?.email;
			const emailVerified = emails?.find((e) => e.email === profile.email)?.verified ?? false;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name || profile.login || "",
					email: profile.email,
					image: profile.avatar_url,
					emailVerified,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/gitlab.mjs
var cleanDoubleSlashes = (input = "") => {
	return input.split("://").map((str) => str.replace(/\/{2,}/g, "/")).join("://");
};
var issuerToEndpoints = (issuer) => {
	const baseUrl = issuer || "https://gitlab.com";
	return {
		authorizationEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/authorize`),
		tokenEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/token`),
		userinfoEndpoint: cleanDoubleSlashes(`${baseUrl}/api/v4/user`)
	};
};
var gitlab = (options) => {
	const { authorizationEndpoint, tokenEndpoint, userinfoEndpoint } = issuerToEndpoints(options.issuer);
	const issuerId = "gitlab";
	return {
		id: issuerId,
		name: "Gitlab",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL: async ({ state, scopes, codeVerifier, loginHint, redirectURI, additionalParams }) => {
			const _scopes = options.disableDefaultScope ? [] : ["read_user"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: issuerId,
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				redirectURI,
				codeVerifier,
				loginHint,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI, codeVerifier }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				codeVerifier,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch(userinfoEndpoint, { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error || profile.state !== "active" || profile.locked) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name ?? profile.username ?? "",
					email: profile.email,
					image: profile.avatar_url,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/google.mjs
var GOOGLE_ID_TOKEN_MAX_AGE = "1h";
var GOOGLE_ID_TOKEN_ALGORITHM = "RS256";
/**
* Checks whether Google's verified `hd` claim satisfies the configured hosted
* domain restriction. `hd: "*"` accepts any Google Workspace hosted domain.
*/
var isGoogleHostedDomainAllowed = (configuredHostedDomain, tokenHostedDomain) => {
	if (!configuredHostedDomain) return true;
	if (typeof tokenHostedDomain !== "string" || !tokenHostedDomain) return false;
	if (configuredHostedDomain === "*") return true;
	return tokenHostedDomain === configuredHostedDomain;
};
var google = (options) => {
	return {
		id: "google",
		name: "Google",
		accountSubject: ({ profile }) => profile.sub,
		accountIssuer: "https://accounts.google.com",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint, display, additionalParams }) {
			if (!getPrimaryClientId(options.clientId) || !options.clientSecret) {
				logger.error("Client Id and Client Secret is required for Google. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Google");
			const _scopes = options.disableDefaultScope ? [] : [
				"email",
				"profile",
				"openid"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "google",
				options,
				authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt,
				accessType: options.accessType,
				display: display || options.display,
				loginHint,
				hd: options.hd,
				additionalParams: {
					...options.includeGrantedScopes === false ? {} : { include_granted_scopes: "true" },
					...additionalParams ?? {}
				}
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint: "https://oauth2.googleapis.com/token"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint: "https://oauth2.googleapis.com/token"
			});
		},
		idToken: {
			jwks: (header) => getGooglePublicKey(header.kid),
			issuer: ["https://accounts.google.com", "accounts.google.com"],
			audience: options.clientId,
			maxTokenAge: GOOGLE_ID_TOKEN_MAX_AGE,
			verifyClaims: options.hd ? (claims) => isGoogleHostedDomainAllowed(options.hd, claims.hd) : void 0
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.idToken) return null;
			const user = decodeJwt(token.idToken);
			if (!isGoogleHostedDomainAllowed(options.hd, user.hd)) {
				logger.error(`Google sign-in rejected: id token hosted domain (hd) "${user.hd ?? "<missing>"}" does not satisfy the configured "hd" option "${options.hd}".`);
				return null;
			}
			const userMap = await options.mapProfileToUser?.(user);
			return {
				user: {
					name: user.name,
					email: user.email,
					image: user.picture,
					emailVerified: user.email_verified,
					...userMap
				},
				data: user
			};
		},
		options
	};
};
var getGooglePublicKey = async (kid) => {
	const [publicKey] = await getGooglePublicKeys(kid);
	if (!publicKey) throw new Error(`JWK with kid ${kid} not found`);
	return publicKey;
};
var getGooglePublicKeys = async (kid) => {
	const { data } = await betterFetch("https://www.googleapis.com/oauth2/v3/certs");
	if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
	const jwks = kid ? data.keys.filter((key) => key.kid === kid) : data.keys;
	if (!jwks.length) throw new Error(`JWK with kid ${kid} not found`);
	return Promise.all(jwks.map((jwk) => importJWK(jwk, GOOGLE_ID_TOKEN_ALGORITHM)));
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/huggingface.mjs
var huggingface = (options) => {
	const tokenEndpoint = "https://huggingface.co/oauth/token";
	return {
		id: "huggingface",
		name: "Hugging Face",
		accountSubject: ({ profile }) => profile.sub,
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "huggingface",
				options,
				authorizationEndpoint: "https://huggingface.co/oauth/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://huggingface.co/oauth/userinfo", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name || profile.preferred_username || "",
					email: profile.email,
					image: profile.picture,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/kakao.mjs
var kakao = (options) => {
	const tokenEndpoint = "https://kauth.kakao.com/oauth/token";
	return {
		id: "kakao",
		name: "Kakao",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"account_email",
				"profile_image",
				"profile_nickname"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "kakao",
				options,
				authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://kapi.kakao.com/v2/user/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
			if (error || !profile) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			const account = profile.kakao_account || {};
			const kakaoProfile = account.profile || {};
			return {
				user: {
					name: kakaoProfile.nickname || account.name || "",
					email: account.email,
					image: kakaoProfile.profile_image_url || kakaoProfile.thumbnail_image_url,
					emailVerified: !!account.is_email_valid && !!account.is_email_verified,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/kick.mjs
var kick = (options) => {
	return {
		id: "kick",
		name: "Kick",
		accountSubject: ({ profile }) => profile.user_id,
		createAuthorizationURL({ state, scopes, redirectURI, codeVerifier, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["user:read"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "kick",
				redirectURI,
				options,
				authorizationEndpoint: "https://id.kick.com/oauth/authorize",
				scopes: _scopes,
				codeVerifier,
				state,
				additionalParams
			});
		},
		async validateAuthorizationCode({ code, redirectURI, codeVerifier }) {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint: "https://id.kick.com/oauth/token",
				codeVerifier
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				tokenEndpoint: "https://id.kick.com/oauth/token"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data, error } = await betterFetch("https://api.kick.com/public/v1/users", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const profile = data.data[0];
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name,
					email: profile.email,
					image: profile.profile_picture,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/line.mjs
/**
* LINE Login v2.1
* - Authorization endpoint: https://access.line.me/oauth2/v2.1/authorize
* - Token endpoint: https://api.line.me/oauth2/v2.1/token
* - UserInfo endpoint: https://api.line.me/oauth2/v2.1/userinfo
* - Verify ID token: https://api.line.me/oauth2/v2.1/verify
*
* Docs: https://developers.line.biz/en/reference/line-login/#issue-access-token
*/
var line = (options) => {
	const authorizationEndpoint = "https://access.line.me/oauth2/v2.1/authorize";
	const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";
	const userInfoEndpoint = "https://api.line.me/oauth2/v2.1/userinfo";
	const verifyIdTokenEndpoint = "https://api.line.me/oauth2/v2.1/verify";
	return {
		id: "line",
		name: "LINE",
		accountSubject: ({ profile }) => profile.sub,
		accountIssuer: "https://access.line.me",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "line",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				loginHint,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		idToken: { verify: async (token, nonce) => {
			const body = new URLSearchParams();
			body.set("id_token", token);
			body.set("client_id", options.clientId);
			if (nonce) body.set("nonce", nonce);
			const { data, error } = await betterFetch(verifyIdTokenEndpoint, {
				method: "POST",
				headers: { "content-type": "application/x-www-form-urlencoded" },
				body
			});
			if (error || !data) return false;
			if (data.aud !== options.clientId) return false;
			if (data.nonce && data.nonce !== nonce) return false;
			return true;
		} },
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			let profile = null;
			if (token.idToken) try {
				profile = decodeJwt(token.idToken);
			} catch {}
			if (!profile) {
				const { data } = await betterFetch(userInfoEndpoint, { headers: { authorization: `Bearer ${token.accessToken}` } });
				profile = data || null;
			}
			if (!profile) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name || "",
					email: profile.email,
					image: profile.picture,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/linear.mjs
var linear = (options) => {
	const tokenEndpoint = "https://api.linear.app/oauth/token";
	return {
		id: "linear",
		name: "Linear",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL({ state, scopes, loginHint, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["read"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "linear",
				options,
				authorizationEndpoint: "https://linear.app/oauth/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				loginHint,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.linear.app/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token.accessToken}`
				},
				body: JSON.stringify({ query: `
							query {
								viewer {
									id
									name
									email
									avatarUrl
									active
									createdAt
									updatedAt
								}
							}
						` })
			});
			if (error || !profile?.data?.viewer) return null;
			const userData = profile.data.viewer;
			const userMap = await options.mapProfileToUser?.(userData);
			return {
				user: {
					name: profile.data.viewer.name,
					email: profile.data.viewer.email,
					image: profile.data.viewer.avatarUrl,
					emailVerified: false,
					...userMap
				},
				data: userData
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/linkedin.mjs
var linkedin = (options) => {
	const authorizationEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
	const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
	return {
		id: "linkedin",
		name: "Linkedin",
		accountSubject: ({ profile }) => profile.sub,
		createAuthorizationURL: async ({ state, scopes, redirectURI, loginHint, additionalParams }) => {
			const _scopes = options.disableDefaultScope ? [] : [
				"profile",
				"email",
				"openid"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "linkedin",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				loginHint,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return await validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.linkedin.com/v2/userinfo", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name,
					email: profile.email,
					emailVerified: profile.email_verified ?? false,
					image: profile.picture,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/microsoft-entra-id.mjs
/**
* Microsoft's fixed tenant id for personal (consumer) Microsoft accounts. Every
* personal-account token carries it as the `tid` claim, so it distinguishes the
* consumer account class from work/school tenants.
* @see https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference
*/
var MICROSOFT_CONSUMER_TENANT_ID = "9188040d-6c67-4c5b-b112-36a304b66dad";
var microsoft = (options) => {
	const tenant = options.tenantId || "common";
	let authority = options.authority || "https://login.microsoftonline.com";
	while (authority.endsWith("/")) authority = authority.slice(0, -1);
	const authorizationEndpoint = `${authority}/${tenant}/oauth2/v2.0/authorize`;
	const tokenEndpoint = `${authority}/${tenant}/oauth2/v2.0/token`;
	if (options.clientSecret && options.clientAssertion) throw new BetterAuthError("Microsoft Entra ID clientAssertion cannot be combined with clientSecret");
	const tokenEndpointAuth = options.clientAssertion ? {
		method: "private_key_jwt",
		getClientAssertion: options.clientAssertion
	} : void 0;
	return {
		id: "microsoft",
		name: "Microsoft EntraID",
		accountSubject: ({ profile }) => profile.oid,
		accountIssuer: ({ profile }) => profile.iss,
		createAuthorizationURL(data) {
			if (!getPrimaryClientId(options.clientId)) {
				logger.error("Client Id is required for Microsoft Entra ID. Make sure to provide it in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			const scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email",
				"User.Read",
				"offline_access"
			];
			if (options.scope) scopes.push(...options.scope);
			if (data.scopes) scopes.push(...data.scopes);
			return createAuthorizationURL({
				id: "microsoft",
				options,
				authorizationEndpoint,
				state: data.state,
				codeVerifier: data.codeVerifier,
				scopes,
				redirectURI: data.redirectURI,
				prompt: options.prompt,
				loginHint: data.loginHint,
				additionalParams: data.additionalParams
			});
		},
		validateAuthorizationCode({ code, codeVerifier, redirectURI }) {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint,
				tokenEndpointAuth
			});
		},
		idToken: {
			jwks: (header) => getMicrosoftPublicKey(header.kid, tenant, authority),
			audience: options.clientId,
			maxTokenAge: "1h",
			/**
			* Issuer varies per tenant for multi-tenant endpoints, so only validate it for
			* specific tenants.
			* @see https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols#endpoints
			*/
			issuer: tenant !== "common" && tenant !== "organizations" && tenant !== "consumers" ? `${authority}/${tenant}/v2.0` : void 0,
			/**
			* The multi-tenant endpoints (common/organizations/consumers) skip the
			* issuer check above because the issuer varies per tenant, and the
			* organizations and consumers JWKS sets overlap. Enforce the tenant
			* binding explicitly so a token from a disallowed account class cannot
			* pass: the issuer must name the token's own tenant, and the account
			* class must match the configured restriction.
			* @see https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference
			*/
			verifyClaims: (claims) => {
				const tid = claims.tid;
				if (typeof tid !== "string" || claims.iss !== `${authority}/${tid}/v2.0`) return false;
				if (tenant === "organizations" && tid === MICROSOFT_CONSUMER_TENANT_ID) return false;
				if (tenant === "consumers" && tid !== MICROSOFT_CONSUMER_TENANT_ID) return false;
				return true;
			}
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.idToken) return null;
			const user = decodeJwt(token.idToken);
			if (typeof user.oid !== "string" || user.oid.trim().length === 0) {
				logger.error("Microsoft Entra ID token did not include a valid oid claim; unable to resolve a stable account identifier.");
				return null;
			}
			const profilePhotoSize = options.profilePhotoSize || 48;
			if (!options.disableProfilePhoto && token.accessToken) await betterFetch(`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`, {
				headers: { Authorization: `Bearer ${token.accessToken}` },
				async onResponse(context) {
					if (!context.response.ok) return;
					try {
						const pictureBuffer = await context.response.clone().arrayBuffer();
						user.picture = `data:image/jpeg;base64, ${base64$1.encode(pictureBuffer)}`;
					} catch (e) {
						logger.error(e && typeof e === "object" && "name" in e ? e.name : "", e);
					}
				}
			});
			const userMap = await options.mapProfileToUser?.(user);
			const emailVerified = user.email_verified !== void 0 ? user.email_verified : user.email && (user.verified_primary_email?.includes(user.email) || user.verified_secondary_email?.includes(user.email)) ? true : false;
			return {
				user: {
					name: user.name,
					email: user.email,
					image: user.picture,
					emailVerified,
					...userMap
				},
				data: user
			};
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			const scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email",
				"User.Read",
				"offline_access"
			];
			if (options.scope) scopes.push(...options.scope);
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				extraParams: { scope: scopes.join(" ") },
				tokenEndpoint,
				tokenEndpointAuth
			});
		},
		options
	};
};
var getMicrosoftPublicKey = async (kid, tenant, authority) => {
	const { data } = await betterFetch(`${authority}/${tenant}/discovery/v2.0/keys`);
	if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
	const jwk = data.keys.find((key) => key.kid === kid);
	if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
	return await importJWK(jwk, jwk.alg);
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/naver.mjs
var naver = (options) => {
	const tokenEndpoint = "https://nid.naver.com/oauth2.0/token";
	return {
		id: "naver",
		name: "Naver",
		accountSubject: ({ profile }) => profile.response.id,
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["profile", "email"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "naver",
				options,
				authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://openapi.naver.com/v1/nid/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
			if (error || !profile || profile.resultcode !== "00") return null;
			const userMap = await options.mapProfileToUser?.(profile);
			const res = profile.response || {};
			return {
				user: {
					name: res.name || res.nickname || "",
					email: res.email,
					image: res.profile_image,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/notion.mjs
var notion = (options) => {
	const tokenEndpoint = "https://api.notion.com/v1/oauth/token";
	return {
		id: "notion",
		name: "Notion",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL({ state, scopes, loginHint, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : [];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "notion",
				options,
				authorizationEndpoint: "https://api.notion.com/v1/oauth/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				loginHint,
				additionalParams: {
					...additionalParams ?? {},
					owner: "user"
				}
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint,
				authentication: "basic"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.notion.com/v1/users/me", { headers: {
				Authorization: `Bearer ${token.accessToken}`,
				"Notion-Version": "2022-06-28"
			} });
			if (error || !profile) return null;
			const userProfile = profile.bot?.owner?.user;
			if (!userProfile) return null;
			const userMap = await options.mapProfileToUser?.(userProfile);
			return {
				user: {
					name: userProfile.name || "",
					email: userProfile.person?.email || null,
					image: userProfile.avatar_url,
					emailVerified: false,
					...userMap
				},
				data: userProfile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/paybin.mjs
var paybin = (options) => {
	const issuer = options.issuer || "https://idp.paybin.io";
	const authorizationEndpoint = `${issuer}/oauth2/authorize`;
	const tokenEndpoint = `${issuer}/oauth2/token`;
	return {
		id: "paybin",
		name: "Paybin",
		accountSubject: ({ profile }) => profile.sub,
		accountIssuer: issuer,
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint, additionalParams }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Client Secret is required for Paybin. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Paybin");
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"email",
				"profile"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "paybin",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt,
				loginHint,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.idToken) return null;
			const user = decodeJwt(token.idToken);
			const userMap = await options.mapProfileToUser?.(user);
			return {
				user: {
					name: user.name || user.preferred_username || "",
					email: user.email,
					image: user.picture,
					emailVerified: user.email_verified || false,
					...userMap
				},
				data: user
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/paypal.mjs
var paypal = (options) => {
	const isSandbox = (options.environment || "sandbox") === "sandbox";
	const authorizationEndpoint = isSandbox ? "https://www.sandbox.paypal.com/signin/authorize" : "https://www.paypal.com/signin/authorize";
	const tokenEndpoint = isSandbox ? "https://api-m.sandbox.paypal.com/v1/oauth2/token" : "https://api-m.paypal.com/v1/oauth2/token";
	const userInfoEndpoint = isSandbox ? "https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo" : "https://api-m.paypal.com/v1/identity/oauth2/userinfo";
	return {
		id: "paypal",
		name: "PayPal",
		accountSubject: ({ profile }) => profile.user_id,
		async createAuthorizationURL({ state, codeVerifier, redirectURI, additionalParams }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Client Secret is required for PayPal. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			return await createAuthorizationURL({
				id: "paypal",
				options,
				authorizationEndpoint,
				scopes: [],
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			/**
			* PayPal requires Basic Auth for token exchange
			**/
			const credentials = base64$1.encode(`${options.clientId}:${options.clientSecret}`);
			try {
				const response = await betterFetch(tokenEndpoint, {
					method: "POST",
					headers: {
						Authorization: `Basic ${credentials}`,
						Accept: "application/json",
						"Accept-Language": "en_US",
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: new URLSearchParams({
						grant_type: "authorization_code",
						code,
						redirect_uri: redirectURI
					}).toString()
				});
				if (!response.data) throw new BetterAuthError("FAILED_TO_GET_ACCESS_TOKEN");
				const data = response.data;
				return {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					accessTokenExpiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1e3) : void 0,
					idToken: data.id_token
				};
			} catch (error) {
				logger.error("PayPal token exchange failed:", error);
				throw new BetterAuthError("FAILED_TO_GET_ACCESS_TOKEN");
			}
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			const credentials = base64$1.encode(`${options.clientId}:${options.clientSecret}`);
			try {
				const response = await betterFetch(tokenEndpoint, {
					method: "POST",
					headers: {
						Authorization: `Basic ${credentials}`,
						Accept: "application/json",
						"Accept-Language": "en_US",
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: new URLSearchParams({
						grant_type: "refresh_token",
						refresh_token: refreshToken
					}).toString()
				});
				if (!response.data) throw new BetterAuthError("FAILED_TO_REFRESH_ACCESS_TOKEN");
				const data = response.data;
				return {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					accessTokenExpiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1e3) : void 0
				};
			} catch (error) {
				logger.error("PayPal token refresh failed:", error);
				throw new BetterAuthError("FAILED_TO_REFRESH_ACCESS_TOKEN");
			}
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.accessToken) {
				logger.error("Access token is required to fetch PayPal user info");
				return null;
			}
			try {
				const response = await betterFetch(`${userInfoEndpoint}?schema=paypalv1.1`, { headers: {
					Authorization: `Bearer ${token.accessToken}`,
					Accept: "application/json"
				} });
				if (!response.data) {
					logger.error("Failed to fetch user info from PayPal");
					return null;
				}
				const userInfo = response.data;
				if (token.idToken) {
					let idTokenSubject;
					try {
						idTokenSubject = decodeJwt(token.idToken).sub;
					} catch (error) {
						logger.error("Failed to decode PayPal ID token:", error);
						return null;
					}
					const userInfoSubject = userInfo.sub ?? userInfo.user_id;
					if (!idTokenSubject || userInfoSubject !== idTokenSubject) {
						logger.error("PayPal user info subject does not match ID token subject");
						return null;
					}
				}
				const userMap = await options.mapProfileToUser?.(userInfo);
				return {
					user: {
						name: userInfo.name,
						email: userInfo.email,
						image: userInfo.picture,
						emailVerified: userInfo.email_verified,
						...userMap
					},
					data: userInfo
				};
			} catch (error) {
				logger.error("Failed to fetch user info from PayPal:", error);
				return null;
			}
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/polar.mjs
var polar = (options) => {
	const tokenEndpoint = "https://api.polar.sh/v1/oauth2/token";
	return {
		id: "polar",
		name: "Polar",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "polar",
				options,
				authorizationEndpoint: "https://polar.sh/oauth2/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.polar.sh/v1/oauth2/userinfo", { headers: { Authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.public_name || profile.username || "",
					email: profile.email,
					image: profile.avatar_url,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/railway.mjs
var authorizationEndpoint = "https://backboard.railway.com/oauth/auth";
var tokenEndpoint = "https://backboard.railway.com/oauth/token";
var userinfoEndpoint = "https://backboard.railway.com/oauth/me";
var railway = (options) => {
	return {
		id: "railway",
		name: "Railway",
		accountSubject: ({ profile }) => profile.sub,
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"email",
				"profile"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "railway",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint,
				authentication: "basic"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint,
				authentication: "basic"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch(userinfoEndpoint, { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error || !profile) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/utils/email.mjs
/**
* @see https://www.rfc-editor.org/rfc/rfc6761.html#section-6.4
*/
var PLACEHOLDER_EMAIL_DOMAIN = "placeholder.invalid";
/**
* Creates a stable, non-routable email address for an account without an email.
*
* @throws TypeError if the generated email is invalid.
*/
function createPlaceholderEmail({ identifier, namespace }) {
	const result = email().safeParse(`${identifier}@${namespace}.${PLACEHOLDER_EMAIL_DOMAIN}`);
	if (!result.success) throw new TypeError("Invalid placeholder email");
	return result.data;
}
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/reddit.mjs
var reddit = (options) => {
	return {
		id: "reddit",
		name: "Reddit",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["identity"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "reddit",
				options,
				authorizationEndpoint: "https://www.reddit.com/api/v1/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				duration: options.duration,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			const body = new URLSearchParams({
				grant_type: "authorization_code",
				code,
				redirect_uri: options.redirectURI || redirectURI
			});
			const { data, error } = await betterFetch("https://www.reddit.com/api/v1/access_token", {
				method: "POST",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					accept: "text/plain",
					"user-agent": "better-auth",
					Authorization: `Basic ${base64$1.encode(`${options.clientId}:${options.clientSecret}`)}`
				},
				body: body.toString()
			});
			if (error) throw error;
			return getOAuth2Tokens(data);
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				authentication: "basic",
				tokenEndpoint: "https://www.reddit.com/api/v1/access_token"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://oauth.reddit.com/api/v1/me", { headers: {
				Authorization: `Bearer ${token.accessToken}`,
				"User-Agent": "better-auth"
			} });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			const email = userMap?.email || createPlaceholderEmail({
				identifier: profile.id,
				namespace: "reddit"
			});
			return {
				user: {
					name: profile.name,
					image: profile.icon_img?.split("?")[0],
					...userMap,
					email,
					emailVerified: userMap?.emailVerified ?? false
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/roblox.mjs
var roblox = (options) => {
	const tokenEndpoint = "https://apis.roblox.com/oauth/v1/token";
	return {
		id: "roblox",
		name: "Roblox",
		accountSubject: ({ profile }) => profile.sub,
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["openid", "profile"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "roblox",
				options,
				authorizationEndpoint: "https://apis.roblox.com/oauth/v1/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				prompt: options.prompt || "select_account consent",
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI: options.redirectURI || redirectURI,
				options,
				tokenEndpoint,
				authentication: "post"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://apis.roblox.com/oauth/v1/userinfo", { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.nickname || profile.preferred_username || "",
					image: profile.picture,
					email: createPlaceholderEmail({
						identifier: profile.sub,
						namespace: "roblox"
					}),
					emailVerified: false,
					...userMap
				},
				data: { ...profile }
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/salesforce.mjs
var salesforce = (options) => {
	const isSandbox = (options.environment ?? "production") === "sandbox";
	const authorizationEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/authorize` : isSandbox ? "https://test.salesforce.com/services/oauth2/authorize" : "https://login.salesforce.com/services/oauth2/authorize";
	const tokenEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/token` : isSandbox ? "https://test.salesforce.com/services/oauth2/token" : "https://login.salesforce.com/services/oauth2/token";
	const userInfoEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/userinfo` : isSandbox ? "https://test.salesforce.com/services/oauth2/userinfo" : "https://login.salesforce.com/services/oauth2/userinfo";
	return {
		id: "salesforce",
		name: "Salesforce",
		accountSubject: ({ profile }) => profile.user_id,
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Client Secret are required for Salesforce. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Salesforce");
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"email",
				"profile"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "salesforce",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI: options.redirectURI || redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI: options.redirectURI || redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			try {
				const { data: user } = await betterFetch(userInfoEndpoint, { headers: { Authorization: `Bearer ${token.accessToken}` } });
				if (!user) {
					logger.error("Failed to fetch user info from Salesforce");
					return null;
				}
				const userMap = await options.mapProfileToUser?.(user);
				return {
					user: {
						name: user.name,
						email: user.email,
						image: user.photos?.picture || user.photos?.thumbnail,
						emailVerified: user.email_verified ?? false,
						...userMap
					},
					data: user
				};
			} catch (error) {
				logger.error("Failed to fetch user info from Salesforce:", error);
				return null;
			}
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/slack.mjs
var slack = (options) => {
	const tokenEndpoint = "https://slack.com/api/openid.connect.token";
	return {
		id: "slack",
		name: "Slack",
		accountSubject: ({ profile }) => profile["https://slack.com/user_id"],
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (scopes) _scopes.push(...scopes);
			if (options.scope) _scopes.push(...options.scope);
			return createAuthorizationURL({
				id: "slack",
				options,
				authorizationEndpoint: "https://slack.com/openid/connect/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://slack.com/api/openid.connect.userInfo", { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name || "",
					email: profile.email,
					emailVerified: profile.email_verified,
					image: profile.picture || profile["https://slack.com/user_image_512"],
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/spotify.mjs
var spotify = (options) => {
	const tokenEndpoint = "https://accounts.spotify.com/api/token";
	return {
		id: "spotify",
		name: "Spotify",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["user-read-email"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "spotify",
				options,
				authorizationEndpoint: "https://accounts.spotify.com/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.spotify.com/v1/me", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.display_name,
					email: profile.email,
					image: profile.images[0]?.url,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/tiktok.mjs
var tiktok = (options) => {
	const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
	return {
		id: "tiktok",
		name: "TikTok",
		accountSubject: ({ profile }) => profile.data.user.open_id,
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["user.info.profile"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			const url = new URL("https://www.tiktok.com/v2/auth/authorize");
			url.searchParams.set("scope", _scopes.join(","));
			url.searchParams.set("response_type", "code");
			url.searchParams.set("client_key", options.clientKey);
			url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
			url.searchParams.set("state", state);
			if (additionalParams) for (const [key, value] of Object.entries(additionalParams)) {
				if (RESERVED_AUTHORIZATION_PARAMS_SET.has(key)) continue;
				if (key === "client_key") continue;
				url.searchParams.set(key, value);
			}
			return url;
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI: options.redirectURI || redirectURI,
				options: {
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: { clientSecret: options.clientSecret },
				tokenEndpoint,
				authentication: "post",
				extraParams: { client_key: options.clientKey }
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch(`https://open.tiktokapis.com/v2/user/info/?fields=${[
				"open_id",
				"avatar_large_url",
				"display_name",
				"username"
			].join(",")}`, { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			return {
				user: {
					email: profile.data.user.email || createPlaceholderEmail({
						identifier: profile.data.user.open_id,
						namespace: "tiktok"
					}),
					name: profile.data.user.display_name || profile.data.user.username || "",
					image: profile.data.user.avatar_large_url,
					emailVerified: false
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/twitch.mjs
var twitch = (options) => {
	const tokenEndpoint = "https://id.twitch.tv/oauth2/token";
	return {
		id: "twitch",
		name: "Twitch",
		accountSubject: ({ profile }) => profile.sub,
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["user:read:email", "openid"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "twitch",
				redirectURI,
				options,
				authorizationEndpoint: "https://id.twitch.tv/oauth2/authorize",
				scopes: _scopes,
				state,
				claims: options.claims || [
					"email",
					"email_verified",
					"preferred_username",
					"picture"
				],
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const idToken = token.idToken;
			if (!idToken) {
				logger.error("No idToken found in token");
				return null;
			}
			const profile = decodeJwt(idToken);
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.preferred_username,
					email: profile.email,
					image: profile.picture,
					emailVerified: profile.email_verified,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/twitter.mjs
var twitter = (options) => {
	const tokenEndpoint = "https://api.x.com/2/oauth2/token";
	return {
		id: "twitter",
		name: "Twitter",
		accountSubject: ({ profile }) => profile.data.id,
		createAuthorizationURL(data) {
			const _scopes = options.disableDefaultScope ? [] : [
				"users.read",
				"tweet.read",
				"offline.access",
				"users.email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (data.scopes) _scopes.push(...data.scopes);
			return createAuthorizationURL({
				id: "twitter",
				options,
				authorizationEndpoint: "https://x.com/i/oauth2/authorize",
				scopes: _scopes,
				state: data.state,
				codeVerifier: data.codeVerifier,
				redirectURI: data.redirectURI,
				additionalParams: data.additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				authentication: "basic",
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				authentication: "basic",
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error: profileError } = await betterFetch("https://api.x.com/2/users/me?user.fields=profile_image_url", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (profileError) return null;
			const { data: emailData, error: emailError } = await betterFetch("https://api.x.com/2/users/me?user.fields=confirmed_email", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			let emailVerified = false;
			if (!emailError && emailData?.data?.confirmed_email) {
				profile.data.email = emailData.data.confirmed_email;
				emailVerified = true;
			}
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.data.name,
					email: profile.data.email || createPlaceholderEmail({
						identifier: profile.data.id,
						namespace: "twitter"
					}),
					image: profile.data.profile_image_url,
					emailVerified,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/vercel.mjs
var vercel = (options) => {
	return {
		id: "vercel",
		name: "Vercel",
		accountSubject: ({ profile }) => profile.sub,
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Vercel");
			let _scopes = void 0;
			if (options.scope !== void 0 || scopes !== void 0) {
				_scopes = [];
				if (options.scope) _scopes.push(...options.scope);
				if (scopes) _scopes.push(...scopes);
			}
			return createAuthorizationURL({
				id: "vercel",
				options,
				authorizationEndpoint: "https://vercel.com/oauth/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint: "https://api.vercel.com/login/oauth/token"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.vercel.com/login/oauth/userinfo", { headers: { Authorization: `Bearer ${token.accessToken}` } });
			if (error || !profile) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.name ?? profile.preferred_username ?? "",
					email: profile.email,
					image: profile.picture,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/vk.mjs
var vk = (options) => {
	const tokenEndpoint = "https://id.vk.com/oauth2/auth";
	return {
		id: "vk",
		name: "VK",
		accountSubject: ({ profile }) => profile.user.user_id,
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["email", "phone"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "vk",
				options,
				authorizationEndpoint: "https://id.vk.com/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				codeVerifier,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI, deviceId }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI: options.redirectURI || redirectURI,
				options,
				deviceId,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(data) {
			if (options.getUserInfo) return options.getUserInfo(data);
			if (!data.accessToken) return null;
			const { data: profile, error } = await betterFetch("https://id.vk.com/oauth2/user_info", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					access_token: data.accessToken,
					client_id: options.clientId
				}).toString()
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			if (!profile.user.email && !userMap?.email) return null;
			return {
				user: {
					first_name: profile.user.first_name,
					last_name: profile.user.last_name,
					email: profile.user.email,
					image: profile.user.avatar,
					emailVerified: false,
					birthday: profile.user.birthday,
					sex: profile.user.sex,
					name: `${profile.user.first_name} ${profile.user.last_name}`,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/wechat.mjs
var wechat = (options) => {
	return {
		id: "wechat",
		name: "WeChat",
		accountSubject: ({ profile }) => profile.unionid || profile.openid,
		createAuthorizationURL({ state, scopes, redirectURI, additionalParams }) {
			const _scopes = options.disableDefaultScope ? [] : ["snsapi_login"];
			options.scope && _scopes.push(...options.scope);
			scopes && _scopes.push(...scopes);
			const url = new URL("https://open.weixin.qq.com/connect/qrconnect");
			url.searchParams.set("scope", _scopes.join(","));
			url.searchParams.set("response_type", "code");
			url.searchParams.set("appid", options.clientId);
			url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
			url.searchParams.set("state", state);
			url.searchParams.set("lang", options.lang || "cn");
			if (additionalParams) for (const [key, value] of Object.entries(additionalParams)) {
				if (RESERVED_AUTHORIZATION_PARAMS_SET.has(key)) continue;
				if (key === "appid") continue;
				url.searchParams.set(key, value);
			}
			url.hash = "wechat_redirect";
			return url;
		},
		validateAuthorizationCode: async ({ code }) => {
			const { data: tokenData, error } = await betterFetch("https://api.weixin.qq.com/sns/oauth2/access_token?" + new URLSearchParams({
				appid: options.clientId,
				secret: options.clientSecret,
				code,
				grant_type: "authorization_code"
			}).toString(), { method: "GET" });
			if (error || !tokenData || tokenData.errcode) throw new Error(`Failed to validate authorization code: ${tokenData?.errmsg || error?.message || "Unknown error"}`);
			return {
				tokenType: "Bearer",
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1e3),
				scopes: tokenData.scope.split(","),
				openid: tokenData.openid,
				unionid: tokenData.unionid
			};
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			const { data: tokenData, error } = await betterFetch("https://api.weixin.qq.com/sns/oauth2/refresh_token?" + new URLSearchParams({
				appid: options.clientId,
				grant_type: "refresh_token",
				refresh_token: refreshToken
			}).toString(), { method: "GET" });
			if (error || !tokenData || tokenData.errcode) throw new Error(`Failed to refresh access token: ${tokenData?.errmsg || error?.message || "Unknown error"}`);
			return {
				tokenType: "Bearer",
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1e3),
				scopes: tokenData.scope.split(",")
			};
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const openid = token.openid;
			if (!openid) return null;
			const { data: profile, error } = await betterFetch("https://api.weixin.qq.com/sns/userinfo?" + new URLSearchParams({
				access_token: token.accessToken || "",
				openid,
				lang: "zh_CN"
			}).toString(), { method: "GET" });
			if (error || !profile || profile.errcode) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			const userId = profile.unionid || profile.openid || openid;
			return {
				user: {
					name: profile.nickname,
					email: profile.email || createPlaceholderEmail({
						identifier: userId,
						namespace: "wechat"
					}),
					image: profile.headimgurl,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/zoom.mjs
var zoom = (userOptions) => {
	const options = {
		pkce: true,
		...userOptions
	};
	return {
		id: "zoom",
		name: "Zoom",
		accountSubject: ({ profile }) => profile.id,
		createAuthorizationURL: async ({ state, redirectURI, codeVerifier, additionalParams }) => createAuthorizationURL({
			id: "zoom",
			options,
			authorizationEndpoint: "https://zoom.us/oauth/authorize",
			state,
			redirectURI,
			codeVerifier: options.pkce ? codeVerifier : void 0,
			additionalParams
		}),
		validateAuthorizationCode: async ({ code, redirectURI, codeVerifier }) => {
			return validateAuthorizationCode({
				code,
				redirectURI: options.redirectURI || redirectURI,
				codeVerifier,
				options,
				tokenEndpoint: "https://zoom.us/oauth/token",
				authentication: "post"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => refreshAccessToken({
			refreshToken,
			options: {
				clientId: options.clientId,
				clientKey: options.clientKey,
				clientSecret: options.clientSecret
			},
			tokenEndpoint: "https://zoom.us/oauth/token"
		}),
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.zoom.us/v2/users/me", { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					name: profile.display_name,
					image: profile.pic_url,
					email: profile.email,
					emailVerified: Boolean(profile.verified),
					...userMap
				},
				data: { ...profile }
			};
		}
	};
};
//#endregion
//#region node_modules/@better-auth/core/dist/social-providers/index.mjs
var socialProviders = {
	apple,
	atlassian,
	cognito,
	discord,
	facebook,
	figma,
	github,
	microsoft,
	google,
	huggingface,
	slack,
	spotify,
	twitch,
	twitter,
	dropbox,
	kick,
	linear,
	linkedin,
	gitlab,
	tiktok,
	reddit,
	roblox,
	salesforce,
	vk,
	zoom,
	notion,
	kakao,
	naver,
	line,
	paybin,
	paypal,
	polar,
	railway,
	vercel,
	wechat
};
var SocialProviderListEnum = _enum(Object.keys(socialProviders)).or(string$1());
//#endregion
//#region node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs
var initGetDefaultModelName = ({ usePlural, schema }) => {
	/**
	* This function helps us get the default model name from the schema defined by devs.
	* Often times, the user will be using the `modelName` which could had been customized by the users.
	* This function helps us get the actual model name useful to match against the schema. (eg: schema[model])
	*
	* If it's still unclear what this does:
	*
	* 1. User can define a custom modelName.
	* 2. When using a custom modelName, doing something like `schema[model]` will not work.
	* 3. Using this function helps us get the actual model name based on the user's defined custom modelName.
	*/
	const getDefaultModelName = (model) => {
		const resolve = (candidate) => {
			if (schema[candidate]) return candidate;
			return Object.entries(schema).find(([_, f]) => f.modelName === candidate)?.[0];
		};
		if (usePlural && model.charAt(model.length - 1) === "s") {
			const m = resolve(model.slice(0, -1));
			if (m) return m;
		}
		const m = resolve(model);
		if (!m) throw new BetterAuthError(`Model "${model}" not found in schema`);
		return m;
	};
	return getDefaultModelName;
};
//#endregion
//#region node_modules/@better-auth/core/dist/db/adapter/get-default-field-name.mjs
var initGetDefaultFieldName = ({ schema, usePlural }) => {
	const getDefaultModelName = initGetDefaultModelName({
		schema,
		usePlural
	});
	/**
	* This function helps us get the default field name from the schema defined by devs.
	* Often times, the user will be using the `fieldName` which could had been customized by the users.
	* This function helps us get the actual field name useful to match against the schema. (eg: schema[model].fields[field])
	*
	* If it's still unclear what this does:
	*
	* 1. User can define a custom fieldName.
	* 2. When using a custom fieldName, doing something like `schema[model].fields[field]` will not work.
	*/
	const getDefaultFieldName = ({ field, model: unsafeModel }) => {
		if (field === "id" || field === "_id") return "id";
		const model = getDefaultModelName(unsafeModel);
		let f = schema[model]?.fields[field];
		if (!f) {
			const result = Object.entries(schema[model].fields).find(([_, f]) => f.fieldName === field);
			if (result) {
				f = result[1];
				field = result[0];
			}
		}
		if (!f) throw new BetterAuthError(`Field ${field} not found in model ${model}`);
		return field;
	};
	return getDefaultFieldName;
};
//#endregion
//#region node_modules/@better-auth/core/dist/db/adapter/get-id-field.mjs
var initGetIdField = ({ usePlural, schema, disableIdGeneration, options, customIdGenerator, supportsUUIDs }) => {
	const getDefaultModelName = initGetDefaultModelName({
		usePlural,
		schema
	});
	const idField = ({ customModelName, forceAllowId }) => {
		const useNumberId = options.advanced?.database?.generateId === "serial";
		const useUUIDs = options.advanced?.database?.generateId === "uuid";
		const shouldGenerateId = (() => {
			if (disableIdGeneration) return false;
			else if (useNumberId && !forceAllowId) return false;
			else if (useUUIDs) return !supportsUUIDs;
			else return true;
		})();
		const model = getDefaultModelName(customModelName ?? "id");
		return {
			type: useNumberId ? "number" : "string",
			required: shouldGenerateId ? true : false,
			...shouldGenerateId ? { defaultValue() {
				if (disableIdGeneration) return void 0;
				const generateId$1 = options.advanced?.database?.generateId;
				if (generateId$1 === false || generateId$1 === "serial") return void 0;
				if (typeof generateId$1 === "function") return generateId$1({ model });
				if (generateId$1 === "uuid") return crypto.randomUUID();
				if (customIdGenerator) return customIdGenerator({ model });
				return generateId();
			} } : {},
			transform: {
				input: (value) => {
					if (!value) return void 0;
					if (useNumberId) {
						const numberValue = Number(value);
						if (isNaN(numberValue)) return;
						return numberValue;
					}
					if (useUUIDs) {
						if (shouldGenerateId && !forceAllowId) return value;
						if (disableIdGeneration) return void 0;
						if (forceAllowId && typeof value === "string") if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return value;
						else {
							const stack = (/* @__PURE__ */ new Error()).stack?.split("\n").filter((_, i) => i !== 1).join("\n").replace("Error:", "");
							logger.warn("[Adapter Factory] - Invalid UUID value for field `id` provided when `forceAllowId` is true. Generating a new UUID.", stack);
						}
						if (supportsUUIDs) return void 0;
						if (typeof value !== "string" && !supportsUUIDs) return crypto.randomUUID();
						return;
					}
					return value;
				},
				output: (value) => {
					if (!value) return void 0;
					return String(value);
				}
			}
		};
	};
	return idField;
};
//#endregion
//#region node_modules/@better-auth/core/dist/db/adapter/get-field-attributes.mjs
var initGetFieldAttributes = ({ usePlural, schema, options, customIdGenerator, disableIdGeneration }) => {
	const getDefaultModelName = initGetDefaultModelName({
		usePlural,
		schema
	});
	const getDefaultFieldName = initGetDefaultFieldName({
		usePlural,
		schema
	});
	const idField = initGetIdField({
		usePlural,
		schema,
		options,
		customIdGenerator,
		disableIdGeneration
	});
	const getFieldAttributes = ({ model, field }) => {
		const defaultModelName = getDefaultModelName(model);
		const defaultFieldName = getDefaultFieldName({
			field,
			model: defaultModelName
		});
		const fields = schema[defaultModelName].fields;
		fields.id = idField({ customModelName: defaultModelName });
		const fieldAttributes = fields[defaultFieldName];
		if (!fieldAttributes) throw new BetterAuthError(`Field ${field} not found in model ${model}`);
		return fieldAttributes;
	};
	return getFieldAttributes;
};
//#endregion
//#region node_modules/@better-auth/core/dist/db/adapter/get-field-name.mjs
var initGetFieldName = ({ schema, usePlural }) => {
	const getDefaultModelName = initGetDefaultModelName({
		schema,
		usePlural
	});
	const getDefaultFieldName = initGetDefaultFieldName({
		schema,
		usePlural
	});
	/**
	* Get the field name which is expected to be saved in the database based on the user's schema.
	*
	* This function is useful if you need to save the field name to the database.
	*
	* For example, if the user has defined a custom field name for the `user` model, then you can use this function to get the actual field name from the schema.
	*/
	function getFieldName({ model: modelName, field: fieldName }) {
		const model = getDefaultModelName(modelName);
		const field = getDefaultFieldName({
			model,
			field: fieldName
		});
		return schema[model]?.fields[field]?.fieldName || field;
	}
	return getFieldName;
};
//#endregion
//#region node_modules/@better-auth/core/dist/db/adapter/get-model-name.mjs
var initGetModelName = ({ usePlural, schema }) => {
	const getDefaultModelName = initGetDefaultModelName({
		schema,
		usePlural
	});
	/**
	* Users can overwrite the default model of some tables. This function helps find the correct model name.
	* Furthermore, if the user passes `usePlural` as true in their adapter config,
	* then we should return the model name ending with an `s`.
	*/
	const getModelName = (model) => {
		const defaultModelKey = getDefaultModelName(model);
		if (schema && schema[defaultModelKey] && schema[defaultModelKey].modelName !== model) return usePlural ? `${schema[defaultModelKey].modelName}s` : schema[defaultModelKey].modelName;
		return usePlural ? `${model}s` : model;
	};
	return getModelName;
};
//#endregion
//#region node_modules/@better-auth/core/dist/db/adapter/utils.mjs
function withApplyDefault(value, field, action) {
	if (action === "update") {
		if (value === void 0 && field.onUpdate !== void 0) {
			if (typeof field.onUpdate === "function") return field.onUpdate();
			return field.onUpdate;
		}
		return value;
	}
	if (action === "create") {
		if (value === void 0 || field.required === true && value === null) {
			if (field.defaultValue !== void 0) {
				if (typeof field.defaultValue === "function") return field.defaultValue();
				return field.defaultValue;
			}
		}
	}
	return value;
}
//#endregion
//#region node_modules/@better-auth/core/dist/db/adapter/factory.mjs
var debugLogs = [];
var transactionId = -1;
var createAsIsTransaction = (adapter) => (fn) => fn(adapter);
var createAdapterFactory = ({ adapter: customAdapter, config: cfg }) => (options) => {
	const uniqueAdapterFactoryInstanceId = Math.random().toString(36).substring(2, 15);
	const config = {
		...cfg,
		supportsBooleans: cfg.supportsBooleans ?? true,
		supportsDates: cfg.supportsDates ?? true,
		supportsJSON: cfg.supportsJSON ?? false,
		adapterName: cfg.adapterName ?? cfg.adapterId,
		supportsNumericIds: cfg.supportsNumericIds ?? true,
		supportsUUIDs: cfg.supportsUUIDs ?? false,
		supportsArrays: cfg.supportsArrays ?? false,
		transaction: cfg.transaction ?? false,
		disableTransformInput: cfg.disableTransformInput ?? false,
		disableTransformOutput: cfg.disableTransformOutput ?? false,
		disableTransformJoin: cfg.disableTransformJoin ?? false
	};
	if (options.advanced?.database?.generateId === "serial" && config.supportsNumericIds === false) throw new BetterAuthError(`[${config.adapterName}] Your database or database adapter does not support numeric ids. Please disable "useNumberId" in your config.`);
	const schema = getAuthTables(options);
	const debugLog = (...args) => {
		if (config.debugLogs === true || typeof config.debugLogs === "object") {
			const logger = createLogger({ level: "info" });
			if (typeof config.debugLogs === "object" && "isRunningAdapterTests" in config.debugLogs) {
				if (config.debugLogs.isRunningAdapterTests) {
					args.shift();
					debugLogs.push({
						instance: uniqueAdapterFactoryInstanceId,
						args
					});
				}
				return;
			}
			if (typeof config.debugLogs === "object" && config.debugLogs.logCondition && !config.debugLogs.logCondition?.()) return;
			if (typeof args[0] === "object" && "method" in args[0]) {
				const method = args.shift().method;
				if (typeof config.debugLogs === "object") {
					if (method === "create" && !config.debugLogs.create) return;
					else if (method === "update" && !config.debugLogs.update) return;
					else if (method === "updateMany" && !config.debugLogs.updateMany) return;
					else if (method === "findOne" && !config.debugLogs.findOne) return;
					else if (method === "findMany" && !config.debugLogs.findMany) return;
					else if (method === "delete" && !config.debugLogs.delete) return;
					else if (method === "deleteMany" && !config.debugLogs.deleteMany) return;
					else if (method === "consumeOne" && !config.debugLogs.consumeOne) return;
					else if (method === "incrementOne" && !config.debugLogs.incrementOne) return;
					else if (method === "count" && !config.debugLogs.count) return;
				}
				logger.info(`[${config.adapterName}]`, ...args);
			} else logger.info(`[${config.adapterName}]`, ...args);
		}
	};
	const logger = createLogger(options.logger);
	const getDefaultModelName = initGetDefaultModelName({
		usePlural: config.usePlural,
		schema
	});
	const getDefaultFieldName = initGetDefaultFieldName({
		usePlural: config.usePlural,
		schema
	});
	const getModelName = initGetModelName({
		usePlural: config.usePlural,
		schema
	});
	const getFieldName = initGetFieldName({
		schema,
		usePlural: config.usePlural
	});
	const idField = initGetIdField({
		schema,
		options,
		usePlural: config.usePlural,
		disableIdGeneration: config.disableIdGeneration,
		customIdGenerator: config.customIdGenerator,
		supportsUUIDs: config.supportsUUIDs
	});
	const getFieldAttributes = initGetFieldAttributes({
		schema,
		options,
		usePlural: config.usePlural,
		disableIdGeneration: config.disableIdGeneration,
		customIdGenerator: config.customIdGenerator
	});
	const transformInput = async (data, defaultModelName, action, forceAllowId) => {
		const transformedData = {};
		const fields = schema[defaultModelName].fields;
		const newMappedKeys = config.mapKeysTransformInput ?? {};
		const useNumberId = options.advanced?.database?.generateId === "serial";
		fields.id = idField({
			customModelName: defaultModelName,
			forceAllowId: forceAllowId && "id" in data
		});
		for (const field in fields) {
			let value = data[field];
			const fieldAttributes = fields[field];
			const newFieldName = newMappedKeys[field] || fields[field].fieldName || field;
			if (value === void 0 && (fieldAttributes.defaultValue === void 0 && !fieldAttributes.transform?.input && !(action === "update" && fieldAttributes.onUpdate) || action === "update" && !fieldAttributes.onUpdate)) continue;
			if (fieldAttributes && fieldAttributes.type === "date" && !(value instanceof Date) && typeof value === "string") try {
				value = new Date(value);
			} catch {
				logger.error("[Adapter Factory] Failed to convert string to date", {
					value,
					field
				});
			}
			let newValue = withApplyDefault(value, fieldAttributes, action);
			if (fieldAttributes.transform?.input) newValue = await fieldAttributes.transform.input(newValue);
			if (fieldAttributes.references?.field === "id" && useNumberId) if (Array.isArray(newValue)) newValue = newValue.map((x) => x !== null ? Number(x) : null);
			else newValue = newValue !== null ? Number(newValue) : null;
			else if (config.supportsJSON === false && typeof newValue === "object" && fieldAttributes.type === "json") newValue = JSON.stringify(newValue);
			else if (config.supportsArrays === false && Array.isArray(newValue) && (fieldAttributes.type === "string[]" || fieldAttributes.type === "number[]")) newValue = JSON.stringify(newValue);
			else if (config.supportsDates === false && newValue instanceof Date && fieldAttributes.type === "date") newValue = newValue.toISOString();
			else if (config.supportsBooleans === false && typeof newValue === "boolean") newValue = newValue ? 1 : 0;
			if (config.customTransformInput) newValue = config.customTransformInput({
				data: newValue,
				action,
				field: newFieldName,
				fieldAttributes,
				model: getModelName(defaultModelName),
				schema,
				options
			});
			if (newValue !== void 0) transformedData[newFieldName] = newValue;
		}
		return transformedData;
	};
	const transformOutput = async (data, unsafe_model, select = [], join) => {
		const transformSingleOutput = async (data, unsafe_model, select = []) => {
			if (!data) return null;
			const newMappedKeys = config.mapKeysTransformOutput ?? {};
			const transformedData = {};
			const tableSchema = schema[getDefaultModelName(unsafe_model)].fields;
			const idKey = Object.entries(newMappedKeys).find(([_, v]) => v === "id")?.[0];
			tableSchema[idKey ?? "id"] = { type: options.advanced?.database?.generateId === "serial" ? "number" : "string" };
			for (const key in tableSchema) {
				if (select.length && !select.includes(key)) continue;
				const field = tableSchema[key];
				if (field) {
					const originalKey = field.fieldName || key;
					let newValue = data[Object.entries(newMappedKeys).find(([_, v]) => v === originalKey)?.[0] || originalKey];
					if (field.transform?.output) newValue = await field.transform.output(newValue);
					const newFieldName = newMappedKeys[key] || key;
					if (originalKey === "id" || field.references?.field === "id") {
						if (typeof newValue !== "undefined" && newValue !== null) newValue = String(newValue);
					} else if (config.supportsJSON === false && typeof newValue === "string" && field.type === "json") newValue = safeJSONParse(newValue);
					else if (config.supportsArrays === false && typeof newValue === "string" && (field.type === "string[]" || field.type === "number[]")) newValue = safeJSONParse(newValue);
					else if (config.supportsDates === false && typeof newValue === "string" && field.type === "date") newValue = new Date(newValue);
					else if (config.supportsBooleans === false && typeof newValue === "number" && field.type === "boolean") newValue = newValue === 1;
					if (config.customTransformOutput) newValue = config.customTransformOutput({
						data: newValue,
						field: newFieldName,
						fieldAttributes: field,
						select,
						model: getModelName(unsafe_model),
						schema,
						options
					});
					transformedData[newFieldName] = newValue;
				}
			}
			return transformedData;
		};
		if (!join || Object.keys(join).length === 0) return await transformSingleOutput(data, unsafe_model, select);
		unsafe_model = getDefaultModelName(unsafe_model);
		const transformedData = await transformSingleOutput(data, unsafe_model, select);
		const requiredModels = Object.entries(join).map(([model, joinConfig]) => ({
			modelName: getModelName(model),
			defaultModelName: getDefaultModelName(model),
			joinConfig
		}));
		if (!data) return null;
		for (const { modelName, defaultModelName, joinConfig } of requiredModels) {
			let joinedData = await (async () => {
				if (options.advanced?.database?.joins) {
					if (modelName in data) return data[modelName];
				}
				return await handleFallbackJoin({
					baseModel: unsafe_model,
					baseData: transformedData,
					joinModel: modelName,
					specificJoinConfig: joinConfig
				});
			})();
			if (joinedData === void 0 || joinedData === null) joinedData = joinConfig.relation === "one-to-one" ? null : [];
			if (joinConfig.relation === "one-to-many" && !Array.isArray(joinedData)) joinedData = [joinedData];
			const transformed = [];
			if (Array.isArray(joinedData)) for (const item of joinedData) {
				const transformedItem = await transformSingleOutput(item, modelName, []);
				transformed.push(transformedItem);
			}
			else {
				const transformedItem = await transformSingleOutput(joinedData, modelName, []);
				transformed.push(transformedItem);
			}
			transformedData[defaultModelName] = (joinConfig.relation === "one-to-one" ? transformed[0] : transformed) ?? null;
		}
		return transformedData;
	};
	const transformWhereClause = ({ model, where, action }) => {
		if (!where) return void 0;
		const newMappedKeys = config.mapKeysTransformInput ?? {};
		return where.map((w) => {
			const { field: unsafe_field, value, operator = "eq", connector = "AND", mode = "sensitive" } = w;
			if (operator === "in") {
				if (!Array.isArray(value)) throw new BetterAuthError("Value must be an array");
			}
			let newValue = value;
			const defaultModelName = getDefaultModelName(model);
			const defaultFieldName = getDefaultFieldName({
				field: unsafe_field,
				model
			});
			const fieldName = newMappedKeys[defaultFieldName] || getFieldName({
				field: defaultFieldName,
				model: defaultModelName
			});
			const fieldAttr = getFieldAttributes({
				field: defaultFieldName,
				model: defaultModelName
			});
			const useNumberId = options.advanced?.database?.generateId === "serial";
			if (defaultFieldName === "id" || fieldAttr.references?.field === "id") {
				if (useNumberId) if (Array.isArray(value)) newValue = value.map(Number);
				else newValue = Number(value);
			}
			if (fieldAttr.type === "date" && value instanceof Date && !config.supportsDates) newValue = value.toISOString();
			if (fieldAttr.type === "boolean" && typeof newValue === "string") newValue = newValue === "true";
			if (fieldAttr.type === "number") {
				if (typeof newValue === "string" && newValue.trim() !== "") {
					const parsed = Number(newValue);
					if (!Number.isNaN(parsed)) newValue = parsed;
				} else if (Array.isArray(newValue)) {
					const parsed = newValue.map((v) => typeof v === "string" && v.trim() !== "" ? Number(v) : NaN);
					if (parsed.every((n) => !Number.isNaN(n))) newValue = parsed;
				}
			}
			if (fieldAttr.type === "boolean" && typeof newValue === "boolean" && !config.supportsBooleans) newValue = newValue ? 1 : 0;
			if (fieldAttr.type === "json" && typeof value === "object" && !config.supportsJSON) try {
				newValue = JSON.stringify(value);
			} catch (error) {
				throw new Error(`Failed to stringify JSON value for field ${fieldName}`, { cause: error });
			}
			if (config.customTransformInput) newValue = config.customTransformInput({
				data: newValue,
				fieldAttributes: fieldAttr,
				field: fieldName,
				model: getModelName(model),
				schema,
				options,
				action
			});
			return {
				operator,
				connector,
				field: fieldName,
				value: newValue,
				mode
			};
		});
	};
	const transformJoinClause = (baseModel, unsanitizedJoin, select) => {
		if (!unsanitizedJoin) return void 0;
		if (Object.keys(unsanitizedJoin).length === 0) return void 0;
		const transformedJoin = {};
		for (const [model, join] of Object.entries(unsanitizedJoin)) {
			if (!join) continue;
			const defaultModelName = getDefaultModelName(model);
			const defaultBaseModelName = getDefaultModelName(baseModel);
			let foreignKeys = Object.entries(schema[defaultModelName].fields).filter(([field, fieldAttributes]) => fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultBaseModelName);
			let isForwardJoin = true;
			if (!foreignKeys.length) {
				foreignKeys = Object.entries(schema[defaultBaseModelName].fields).filter(([field, fieldAttributes]) => fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultModelName);
				isForwardJoin = false;
			}
			if (!foreignKeys.length) throw new BetterAuthError(`No foreign key found for model ${model} and base model ${baseModel} while performing join operation.`);
			else if (foreignKeys.length > 1) throw new BetterAuthError(`Multiple foreign keys found for model ${model} and base model ${baseModel} while performing join operation. Only one foreign key is supported.`);
			const [foreignKey, foreignKeyAttributes] = foreignKeys[0];
			if (!foreignKeyAttributes.references) throw new BetterAuthError(`No references found for foreign key ${foreignKey} on model ${model} while performing join operation.`);
			let from;
			let to;
			let requiredSelectField;
			if (isForwardJoin) {
				requiredSelectField = foreignKeyAttributes.references.field;
				from = getFieldName({
					model: baseModel,
					field: requiredSelectField
				});
				to = getFieldName({
					model,
					field: foreignKey
				});
			} else {
				requiredSelectField = foreignKey;
				from = getFieldName({
					model: baseModel,
					field: requiredSelectField
				});
				to = getFieldName({
					model,
					field: foreignKeyAttributes.references.field
				});
			}
			if (select && !select.includes(requiredSelectField)) select.push(requiredSelectField);
			const isUnique = to === "id" ? true : foreignKeyAttributes.unique ?? false;
			let limit = options.advanced?.database?.defaultFindManyLimit ?? 100;
			if (isUnique) limit = 1;
			else if (typeof join === "object" && typeof join.limit === "number") limit = join.limit;
			transformedJoin[getModelName(model)] = {
				on: {
					from,
					to
				},
				limit,
				relation: isUnique ? "one-to-one" : "one-to-many"
			};
		}
		return {
			join: transformedJoin,
			select
		};
	};
	/**
	* Handle joins by making separate queries and combining results (fallback for adapters that don't support native joins).
	*/
	const handleFallbackJoin = async ({ baseModel, baseData, joinModel, specificJoinConfig: joinConfig }) => {
		if (!baseData) return baseData;
		const modelName = getModelName(joinModel);
		const field = joinConfig.on.to;
		const value = baseData[getDefaultFieldName({
			field: joinConfig.on.from,
			model: baseModel
		})];
		if (value === null || value === void 0) return joinConfig.relation === "one-to-one" ? null : [];
		let result;
		const where = transformWhereClause({
			model: modelName,
			where: [{
				field,
				value,
				operator: "eq",
				connector: "AND"
			}],
			action: "findOne"
		});
		try {
			if (joinConfig.relation === "one-to-one") result = await withSpan(`db findOne ${modelName}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "findOne",
				[import_src.ATTR_DB_COLLECTION_NAME]: modelName
			}, () => adapterInstance.findOne({
				model: modelName,
				where
			}));
			else {
				const limit = joinConfig.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
				result = await withSpan(`db findMany ${modelName}`, {
					[import_src.ATTR_DB_OPERATION_NAME]: "findMany",
					[import_src.ATTR_DB_COLLECTION_NAME]: modelName
				}, () => adapterInstance.findMany({
					model: modelName,
					where,
					limit
				}));
			}
		} catch (error) {
			logger.error(`Failed to query fallback join for model ${modelName}:`, {
				where,
				limit: joinConfig.limit
			});
			console.error(error);
			throw error;
		}
		return result;
	};
	const adapterInstance = customAdapter({
		options,
		schema,
		debugLog,
		getFieldName,
		getModelName,
		getDefaultModelName,
		getDefaultFieldName,
		getFieldAttributes,
		transformInput,
		transformOutput,
		transformWhereClause
	});
	let lazyLoadTransaction = null;
	const adapter = {
		transaction: async (cb) => {
			if (!lazyLoadTransaction) if (!config.transaction) lazyLoadTransaction = createAsIsTransaction(adapter);
			else {
				logger.debug(`[${config.adapterName}] - Using provided transaction implementation.`);
				lazyLoadTransaction = config.transaction;
			}
			return lazyLoadTransaction(cb);
		},
		create: async ({ data: unsafeData, model: unsafeModel, select, forceAllowId = false }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			unsafeModel = getDefaultModelName(unsafeModel);
			if ("id" in unsafeData && typeof unsafeData.id !== "undefined" && !forceAllowId) {
				logger.warn(`[${config.adapterName}] - You are trying to create a record with an id. This is not allowed as we handle id generation for you, unless you pass in the \`forceAllowId\` parameter. The id will be ignored.`);
				const stack = (/* @__PURE__ */ new Error()).stack?.split("\n").filter((_, i) => i !== 1).join("\n").replace("Error:", "Create method with `id` being called at:");
				console.log(stack);
				unsafeData.id = void 0;
			}
			debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("create")} ${formatAction("Unsafe Input")}:`, {
				model,
				data: unsafeData
			});
			let data = unsafeData;
			if (!config.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "create", forceAllowId);
			debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Input")}:`, {
				model,
				data
			});
			const res = await withSpan(`db create ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "create",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.create({
				data,
				model
			}));
			debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("create")} ${formatAction("DB Result")}:`, {
				model,
				res
			});
			let transformed = res;
			if (!config.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, select, void 0);
			debugLog({ method: "create" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		update: async ({ model: unsafeModel, where: unsafeWhere, update: unsafeData }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			unsafeModel = getDefaultModelName(unsafeModel);
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "update"
			});
			if (where.length === 0) return null;
			debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("update")} ${formatAction("Unsafe Input")}:`, {
				model,
				data: unsafeData
			});
			let data = unsafeData;
			if (!config.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "update");
			debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Input")}:`, {
				model,
				data
			});
			const res = await withSpan(`db update ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "update",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.update({
				model,
				where,
				update: data
			}));
			debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("update")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, void 0, void 0);
			debugLog({ method: "update" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		updateMany: async ({ model: unsafeModel, where: unsafeWhere, update: unsafeData }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "updateMany"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("updateMany")} ${formatAction("Unsafe Input")}:`, {
				model,
				data: unsafeData
			});
			let data = unsafeData;
			if (!config.disableTransformInput) data = await transformInput(unsafeData, unsafeModel, "update");
			debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Input")}:`, {
				model,
				data
			});
			const updatedCount = await withSpan(`db updateMany ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "updateMany",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.updateMany({
				model,
				where,
				update: data
			}));
			if (typeof updatedCount !== "number" || !Number.isFinite(updatedCount)) throw new BetterAuthError(`Adapter "${config.adapterId}" updateMany must return a finite number affected row count.`);
			debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("updateMany")} ${formatAction("DB Result")}:`, {
				model,
				data: updatedCount
			});
			debugLog({ method: "updateMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Result")}:`, {
				model,
				data: updatedCount
			});
			return updatedCount;
		},
		findOne: async ({ model: unsafeModel, where: unsafeWhere, select, join: unsafeJoin }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "findOne"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			let join;
			let passJoinToAdapter = true;
			if (!config.disableTransformJoin) {
				const result = transformJoinClause(unsafeModel, unsafeJoin, select);
				if (result) {
					join = result.join;
					select = result.select;
				}
				if (!options.advanced?.database?.joins && join && Object.keys(join).length > 0) passJoinToAdapter = false;
			} else join = unsafeJoin;
			debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findOne")}:`, {
				model,
				where,
				select,
				join
			});
			const res = await withSpan(`db findOne ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "findOne",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.findOne({
				model,
				where,
				select,
				join: passJoinToAdapter ? join : void 0
			}));
			debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findOne")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput) transformed = await transformOutput(res, unsafeModel, select, join);
			debugLog({ method: "findOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findOne")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		findMany: async ({ model: unsafeModel, where: unsafeWhere, limit: unsafeLimit, select, sortBy, offset, join: unsafeJoin }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const limit = unsafeLimit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "findMany"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			let join;
			let passJoinToAdapter = true;
			if (!config.disableTransformJoin) {
				const result = transformJoinClause(unsafeModel, unsafeJoin, select);
				if (result) {
					join = result.join;
					select = result.select;
				}
				if (!options.advanced?.database?.joins && join && Object.keys(join).length > 0) passJoinToAdapter = false;
			} else join = unsafeJoin;
			debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findMany")}:`, {
				model,
				where,
				limit,
				sortBy,
				offset,
				join
			});
			const res = await withSpan(`db findMany ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "findMany",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.findMany({
				model,
				where,
				limit,
				select,
				sortBy,
				offset,
				join: passJoinToAdapter ? join : void 0
			}));
			debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findMany")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput) transformed = await Promise.all(res.map(async (r) => {
				return await transformOutput(r, unsafeModel, void 0, join);
			}));
			debugLog({ method: "findMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findMany")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		delete: async ({ model: unsafeModel, where: unsafeWhere }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "delete"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "delete" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("delete")}:`, {
				model,
				where
			});
			await withSpan(`db delete ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "delete",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.delete({
				model,
				where
			}));
			debugLog({ method: "delete" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("delete")} ${formatAction("DB Result")}:`, { model });
		},
		deleteMany: async ({ model: unsafeModel, where: unsafeWhere }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "deleteMany"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "deleteMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DeleteMany")}:`, {
				model,
				where
			});
			const res = await withSpan(`db deleteMany ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "deleteMany",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.deleteMany({
				model,
				where
			}));
			debugLog({ method: "deleteMany" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			return res;
		},
		consumeOne: async ({ model: unsafeModel, where: unsafeWhere }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "consumeOne"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "consumeOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("consumeOne")} ${formatAction("ConsumeOne")}:`, {
				model,
				where
			});
			if (typeof adapterInstance.consumeOne !== "function") throw new BetterAuthError(`Adapter "${config.adapterId}" must implement consumeOne for atomic single-use credential consumption.`);
			const res = await withSpan(`db consumeOne ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "consumeOne",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.consumeOne({
				model,
				where
			}));
			debugLog({ method: "consumeOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("consumeOne")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput && res) transformed = await transformOutput(res, unsafeModel, void 0, void 0);
			debugLog({ method: "consumeOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("consumeOne")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		incrementOne: async ({ model: unsafeModel, where: unsafeWhere, increment: unsafeIncrement, set: unsafeSet }) => {
			const hasIncrement = Object.keys(unsafeIncrement).length > 0;
			const hasSet = !!unsafeSet && Object.keys(unsafeSet).length > 0;
			if (!hasIncrement && !hasSet) throw new BetterAuthError("incrementOne requires a non-empty `increment` or `set`; both were empty.");
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "incrementOne"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "incrementOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("incrementOne")} ${formatAction("IncrementOne")}:`, {
				model,
				where,
				increment: unsafeIncrement,
				set: unsafeSet
			});
			if (typeof adapterInstance.incrementOne !== "function") throw new BetterAuthError(`Adapter "${config.adapterId}" must implement incrementOne for atomic guarded counter updates.`);
			const mappedKeys = config.mapKeysTransformInput ?? {};
			const increment = {};
			for (const [field, delta] of Object.entries(unsafeIncrement)) increment[mappedKeys[field] || getFieldName({
				model: unsafeModel,
				field
			})] = delta;
			let set;
			if (unsafeSet && !config.disableTransformInput) set = await transformInput(unsafeSet, unsafeModel, "update");
			else set = unsafeSet;
			if (Object.keys(increment).length === 0 && (!set || Object.keys(set).length === 0)) throw new BetterAuthError("incrementOne resolved to an empty update: every increment/set field was unknown to the schema or transformed away.");
			const res = await withSpan(`db incrementOne ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "incrementOne",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.incrementOne({
				model,
				where,
				increment,
				set
			}));
			debugLog({ method: "incrementOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("incrementOne")} ${formatAction("DB Result")}:`, {
				model,
				data: res
			});
			let transformed = res;
			if (!config.disableTransformOutput && res) transformed = await transformOutput(res, unsafeModel, void 0, void 0);
			debugLog({ method: "incrementOne" }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("incrementOne")} ${formatAction("Parsed Result")}:`, {
				model,
				data: transformed
			});
			return transformed;
		},
		count: async ({ model: unsafeModel, where: unsafeWhere }) => {
			transactionId++;
			const thisTransactionId = transactionId;
			const model = getModelName(unsafeModel);
			const where = transformWhereClause({
				model: unsafeModel,
				where: unsafeWhere,
				action: "count"
			});
			unsafeModel = getDefaultModelName(unsafeModel);
			debugLog({ method: "count" }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("count")}:`, {
				model,
				where
			});
			const res = await withSpan(`db count ${model}`, {
				[import_src.ATTR_DB_OPERATION_NAME]: "count",
				[import_src.ATTR_DB_COLLECTION_NAME]: model
			}, () => adapterInstance.count({
				model,
				where
			}));
			debugLog({ method: "count" }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("count")}:`, {
				model,
				data: res
			});
			return res;
		},
		createSchema: adapterInstance.createSchema ? async (_, file) => {
			const tables = getAuthTables(options);
			if (options.secondaryStorage && !options.session?.storeSessionInDatabase) delete tables.session;
			return adapterInstance.createSchema({
				file,
				tables
			});
		} : void 0,
		options: {
			adapterConfig: config,
			...adapterInstance.options ?? {}
		},
		id: config.adapterId,
		...config.debugLogs?.isRunningAdapterTests ? { adapterTestDebugLogs: {
			resetDebugLogs() {
				debugLogs = debugLogs.filter((log) => log.instance !== uniqueAdapterFactoryInstanceId);
			},
			printDebugLogs() {
				const separator = `─`.repeat(80);
				const logs = debugLogs.filter((log) => log.instance === uniqueAdapterFactoryInstanceId);
				if (logs.length === 0) return;
				const log = logs.reverse().map((log) => {
					log.args[0] = `\n${log.args[0]}`;
					return [...log.args, "\n"];
				}).reduce((prev, curr) => {
					return [...curr, ...prev];
				}, [`\n${separator}`]);
				console.log(...log);
			}
		} } : {}
	};
	return adapter;
};
function formatTransactionId(transactionId) {
	if (getColorDepth() < 8) return `#${transactionId}`;
	return `${TTY_COLORS.fg.magenta}#${transactionId}${TTY_COLORS.reset}`;
}
function formatStep(step, total) {
	return `${TTY_COLORS.bg.black}${TTY_COLORS.fg.yellow}[${step}/${total}]${TTY_COLORS.reset}`;
}
function formatMethod(method) {
	return `${TTY_COLORS.bright}${method}${TTY_COLORS.reset}`;
}
function formatAction(action) {
	return `${TTY_COLORS.dim}(${action})${TTY_COLORS.reset}`;
}
//#endregion
//#region node_modules/@better-auth/core/dist/utils/string.mjs
function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
//#endregion
export { literal as $, JWKInvalid as $t, defineRequestState as A, validateCritDuplicates as At, serializeCookie as B, unprotected as Bt, createAuthEndpoint as C, env as Cn, sign as Ct, queueAfterTransactionHook as D, isProduction as Dn, validateAlgorithms as Dt, getCurrentAdapter as E, isDevelopment as En, serializeJoseHeader as Et, tryGetCurrentAuthEndpointContext as F, jwkToKey as Ft, createLocalAccountIssuer as G, assertCryptoKey as Gt, filterOutputFields as H, isDisjoint as Ht, appendQueryParams as I, assertNotSet as It, string as J, isKeyObject as Jt, createOAuthAccountIssuer as K, isCryptoKey as Kt, normalizePathname as L, decodeBase64url as Lt, runWithRequestState as M, jweEncryption as Mt, getCurrentAuthEndpointContext as N, prepareKey as Nt, runWithAdapter as O, isTest as On, validateB64 as Ot, runWithEndpointContext as P, snapshotJwk as Pt, email as Q, JWEInvalid as Qt, createRouter$1 as R, digest as Rt, deprecate as S, ENV as Sn, jwsAlgorithm as St, isAPIError as T, getEnvVar as Tn, JWS_RECOGNIZED as Tt, userSchema as U, isObject$1 as Ut, safeJSONParse as V, assertUint8Array as Vt, sessionSchema as W, encode$1 as Wt, array as X, JOSENotSupported as Xt, any as Y, JOSEAlgNotAllowed as Yt, boolean$1 as Z, JWEDecryptionFailed as Zt, ATTR_OPERATION_ID as _, BASE_ERROR_CODES as _n, jwtVerify as _t, SocialProviderListEnum as a, checkCryptoKey as an, strictObject as at, findInvalidTrustedProxies as b, shouldPublishLog as bn, jwtData as bt, verifyProviderIdToken as c, concat as cn, unknown as ct, mergeScopes as d, uint32be as dn, getDatabaseFieldIndexName as dt, JWSInvalid as en, looseObject as et, isLoopbackHost as f, uint64be as fn, getDatabaseIndexStringLength as ft, ATTR_HOOK_TYPE as g, kAPIErrorHeaderSymbol as gn, decodeProtectedHeader as gt, ATTR_CONTEXT as h, BetterAuthError as hn, base64Url as ht, initGetFieldName as i, invalidKeyInput as in, record as it, hasRequestState as j, jweAlgorithm as jt, runWithTransaction as k, validateCrit as kt, betterFetch as l, decoder as ln, getAuthTables as lt, withSpan as m, APIError as mn, base64$1 as mt, createAdapterFactory as n, JWTExpired as nn, object as nt, socialProviders as o, checkModulusLength as on, string$1 as ot, generateId as p, createRandomStringGenerator as pn, getPortableDatabaseIdentifierKey as pt, boolean as q, isKeyLike as qt, initGetModelName as r, JWTInvalid as rn, optional as rt, supportsIdTokenSignIn as s, checkUsage as sn, union as st, capitalizeFirstLetter as t, JWTClaimValidationFailed as tn, number as tt, additionalAuthorizationParamsSchema as u, encode$2 as un, getAuthTablesWithResolvedIndexes as ut, import_src as v, createLogger as vn, JWTClaimsBuilder as vt, createAuthMiddleware as w, getBooleanEnvVar as wn, JWE_RECOGNIZED as wt, getIP as x, getBetterAuthVersion as xn, validateClaimsSet as xt, createRateLimitKey as y, logger as yn, jwtClaim as yt, toResponse as z, parseJoseHeader as zt };
