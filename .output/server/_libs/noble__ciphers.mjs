//#region node_modules/@noble/ciphers/utils.js
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
/**
* Checks if something is Uint8Array. Be careful: nodejs Buffer will return true.
* @param a - Value to inspect.
* @returns `true` when the value is a Uint8Array view, including Node's `Buffer`.
* @example
* Guards a value before treating it as raw key material.
*
* ```ts
* isBytes(new Uint8Array());
* ```
*/
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
var atitle = (title) => title ? `"${title}" ` : "";
/**
* Asserts something is boolean.
* @param value - Value to validate.
* @returns The validated boolean.
* @throws On wrong argument types. {@link TypeError}
* @example
* Validates a boolean option before branching on it.
*
* ```ts
* abool(true);
* ```
*/
function abool(value, title = "") {
	if (typeof value !== "boolean") throw new TypeError(atitle(title) + "expected boolean, got type=" + typeof value);
	return value;
}
/**
* Asserts something is a non-negative safe integer.
* @param n - Value to validate.
* @returns The validated number.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validates a non-negative length or counter.
*
* ```ts
* anumber(1);
* ```
*/
function anumber(n, title = "") {
	if (typeof n !== "number") throw new TypeError(atitle(title) + "expected number, got " + typeof n);
	if (!Number.isSafeInteger(n) || n < 0) throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
	return n;
}
/**
* Asserts something is Uint8Array.
* @param value - Value to validate.
* @param length - Expected byte length.
* @param title - Optional label used in error messages.
* @returns The validated byte array.
* On Node, `Buffer` is accepted too because it is a Uint8Array view.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument lengths. {@link RangeError}
* @example
* Validates a fixed-length nonce or key buffer.
*
* ```ts
* abytes(new Uint8Array([1, 2]), 2);
* ```
*/
function abytes(value, length, title = "") {
	if (isBytes(value) && (length === void 0 || value.length === length)) return value;
	if (length !== void 0) anumber(length, "length");
	const bytes = isBytes(value);
	const ofLen = length !== void 0 ? ` of length ${length}` : "";
	const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
	const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
	if (!bytes) throw new TypeError(message);
	throw new RangeError(message);
}
var aobject = (value, label) => {
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new TypeError(label === "object" ? "expected valid options object" : `"${label}" expected object, got type=${typeof value}`);
};
/**
* Asserts a hash- or MAC-like instance has not been destroyed or finished.
* @param instance - Stateful instance to validate.
* @param checkFinished - Whether to reject finished instances.
* When `false`, only `destroyed` is checked.
* @throws If the hash instance has already been destroyed or finalized. {@link Error}
* @example
* Guards against calling `update()` or `digest()` on a finished hash.
*
* ```ts
* aexists({ destroyed: false, finished: false });
* ```
*/
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("hash was destroyed");
	if (checkFinished && instance.finished) throw new Error("digest() was already called");
}
/**
* Asserts output is a sufficiently-sized byte array.
* @param out - Output buffer to validate.
* @param instance - Hash-like instance providing `outputLen`.
* This is the relaxed `digestInto()`-style contract: output must be at least `outputLen`,
* unlike one-shot cipher helpers elsewhere in the repo that often require exact lengths.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong output buffer lengths. {@link RangeError}
* @example
* Verifies that a caller-provided output buffer is large enough.
*
* ```ts
* aoutput(new Uint8Array(16), { outputLen: 16 });
* ```
*/
function aoutput(out, instance) {
	abytes(out, void 0, "output");
	const min = instance.outputLen;
	if (!(out.length >= min)) throw new RangeError("\"output\" expected length >= " + min);
}
/**
* Casts a typed-array view to Uint32Array.
* @param arr - Typed-array view to reinterpret.
* @returns Uint32Array view over the same bytes. Callers are expected to provide a
* 4-byte-aligned offset; trailing `1..3` bytes are silently dropped.
* @example
* Views a byte buffer as 32-bit words for block processing.
*
* ```ts
* u32(new Uint8Array(4));
* ```
*/
function u32(arr) {
	return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/**
* Zeroizes typed arrays in place.
* Warning: JS provides no guarantees.
* @param arrays - Arrays to wipe.
* @example
* Wipes a temporary key buffer after use.
*
* ```ts
* const bytes = new Uint8Array([1]);
* clean(bytes);
* ```
*/
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/**
* Creates a DataView for byte-level manipulation.
* @param arr - Typed-array view to wrap.
* @returns DataView over the same bytes.
* @example
* Creates an endian-aware view for length encoding.
*
* ```ts
* createView(new Uint8Array(4));
* ```
*/
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/**
* Whether the current platform is little-endian.
* Most are; some IBM systems are not.
*/
var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
/**
* Reverses byte order of one 32-bit word.
* @param word - Unsigned 32-bit word to swap.
* @returns The same word with bytes reversed.
* @example
* Swaps a big-endian word into little-endian byte order.
*
* ```ts
* byteSwap(0x11223344);
* ```
*/
function byteSwap(word) {
	return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
/**
* Byte-swaps every word of a Uint32Array in place.
* @param arr - Uint32Array whose words should be swapped.
* @returns The same array after in-place byte swapping.
* @example
* Swaps every 32-bit word in a word-view buffer.
*
* ```ts
* byteSwap32(new Uint32Array([0x11223344]));
* ```
*/
function byteSwap32(arr) {
	for (let i = 0; i < arr.length; i++) arr[i] = byteSwap(arr[i]);
	return arr;
}
/**
* Normalizes a Uint32Array view to the little-endian representation expected by cipher cores.
* @param u - Word view to normalize in place.
* @returns Little-endian normalized word view.
* @example
* Normalizes a word-view buffer before block processing.
*
* ```ts
* swap32IfBE(new Uint32Array([0x11223344]));
* ```
*/
var swap32IfBE = isLE ? (u) => u : byteSwap32;
var hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string. Uses built-in function, when available.
* @param bytes - Bytes to encode.
* @returns Lowercase hexadecimal string.
* @throws On wrong argument types. {@link TypeError}
* @example
* Formats ciphertext bytes for logs or test vectors.
*
* ```ts
* bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])); // 'cafe0123'
* ```
*/
function bytesToHex(bytes) {
	abytes(bytes);
	if (hasHexBuiltin) return bytes.toHex();
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
	return hex;
}
function asciiToBase16(ch) {
	return ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - 55 : ch >= 97 && ch <= 102 ? ch - 87 : void 0;
}
/**
* Convert hex string to byte array. Uses built-in function, when available.
* @param hex - hexadecimal string to decode
* @returns Decoded bytes.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Decode lowercase hexadecimal into bytes.
* ```ts
* hexToBytes('cafe0123'); // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
* ```
*/
function hexToBytes(hex) {
	if (typeof hex !== "string") throw new TypeError("hex string expected, got " + typeof hex);
	if (hasHexBuiltin) try {
		return Uint8Array.fromHex(hex);
	} catch (error) {
		if (error instanceof SyntaxError) throw new RangeError(error.message);
		throw error;
	}
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) throw new RangeError("hex string expected, got unpadded hex of length " + hl);
	const array = new Uint8Array(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = asciiToBase16(hex.charCodeAt(hi));
		const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) {
			const char = hex[hi] + hex[hi + 1];
			throw new RangeError("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
		}
		array[ai] = n1 * 16 + n2;
	}
	return array;
}
/**
* Converts string to bytes using UTF8 encoding.
* @param str - String to encode.
* @returns UTF-8 bytes in a detached fresh Uint8Array copy.
* @throws On wrong argument types. {@link TypeError}
* @example
* Encodes application text before encryption or MACing.
*
* ```ts
* utf8ToBytes('abc'); // new Uint8Array([97, 98, 99])
* ```
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new TypeError("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Checks if two U8A use same underlying buffer and overlaps.
* This is invalid and can corrupt data.
* @param a - First byte view.
* @param b - Second byte view.
* @returns `true` when the views overlap in memory.
* @example
* Detects whether two slices alias the same backing buffer.
*
* ```ts
* overlapBytes(new Uint8Array(4), new Uint8Array(4));
* ```
*/
function overlapBytes(a, b) {
	if (!a.byteLength || !b.byteLength) return false;
	return a.buffer === b.buffer && a.byteOffset < b.byteOffset + b.byteLength && b.byteOffset < a.byteOffset + a.byteLength;
}
/**
* If input and output overlap and input starts before output, we will overwrite end of input before
* we start processing it, so this is not supported by forward-processing ciphers.
* @param input - Input bytes.
* @param output - Output bytes.
* @throws If the output view would overwrite unread input bytes. {@link Error}
* @example
* Rejects an in-place layout that would overwrite unread input bytes.
*
* ```ts
* const buffer = new Uint8Array(8);
* complexOverlapBytes(buffer.subarray(0, 4), buffer.subarray(2, 6));
* ```
*/
function complexOverlapBytes(input, output) {
	if (overlapBytes(input, output) && input.byteOffset < output.byteOffset) throw new Error("complex overlap of input and output is not supported");
}
/**
* Copies several Uint8Arrays into one.
* @param arrays - Byte arrays to concatenate.
* @returns Combined byte array.
* @throws On wrong argument types inside the byte-array list. {@link TypeError}
* @example
* Builds a `nonce || ciphertext` style buffer.
*
* ```ts
* concatBytes(new Uint8Array([1]), new Uint8Array([2]));
* ```
*/
function concatBytes(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
/**
* Merges user options into defaults.
* @param defaults - Default option values.
* @param opts - User-provided overrides.
* @returns Combined options object.
* `defaults` is a library-owned mutable object; user-provided `opts` only need to be
* object-shaped, since "plain object" checks reject valid proxy/cross-realm containers.
* The merge mutates `defaults` in place and returns the same object, so direct callers
* should pass a fresh defaults object unless they intentionally want shared state updated.
* @throws If options are missing or not an object. {@link Error}
* @example
* Applies user overrides to the default cipher options.
*
* ```ts
* checkOpts({ rounds: 20 }, { rounds: 8 });
* ```
*/
function checkOpts(defaults, opts) {
	aobject(defaults, "defaults");
	aobject(opts, "opts");
	return Object.assign(defaults, opts);
}
/**
* Compares two byte arrays in kinda constant time once lengths already match.
* @param a - First byte array.
* @param b - Second byte array.
* @returns `true` when the arrays contain the same bytes. Different lengths still return early.
* @example
* Compares an expected authentication tag with the received one.
*
* ```ts
* equalBytes(new Uint8Array([1]), new Uint8Array([1]));
* ```
*/
function equalBytes(a, b) {
	a = abytes(a);
	b = abytes(b);
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}
/**
* Wraps a keyed MAC constructor into a one-shot helper with `.create()`.
* @param keyLen - Valid probe-key length used to read static metadata once.
* The probe key is only used for `outputLen` / `blockLen`, so callers with several valid key sizes
* can pass any representative size as long as those values stay fixed.
* @param macCons - Keyed MAC constructor or factory.
* @param fromMsg - Optional adapter that derives extra constructor args from the one-shot message.
* @returns Callable MAC helper with `.create()`.
*/
function wrapMacConstructor(keyLen, macCons, fromMsg) {
	const mac = macCons;
	const getArgs = fromMsg || (() => []);
	const macC = (msg, key) => mac(key, ...getArgs(msg)).update(msg).digest();
	const tmp = mac(new Uint8Array(keyLen), ...getArgs(/* @__PURE__ */ new Uint8Array(0)));
	macC.outputLen = tmp.outputLen;
	macC.blockLen = tmp.blockLen;
	macC.create = (key, ...args) => mac(key, ...args);
	return macC;
}
/**
* Wraps a cipher: validates args, ensures encrypt() can only be called once.
* Used internally by the exported cipher constructors.
* Output-buffer support is inferred from the wrapped `encrypt` / `decrypt`
* arity (`fn.length === 2`), so wrapped output-capable methods must use a normal
* second parameter, not a default/rest parameter. AAD support is explicit in
* `params.withAAD`; optional AAD starts after the nonce slot when one is present.
* @__NO_SIDE_EFFECTS__
* @param params - Static cipher metadata. See {@link CipherParams}.
* @param constructor - Cipher constructor.
* @returns Wrapped constructor with validation.
*/
var wrapCipher = (params, constructor) => {
	function wrappedCipher(key, ...args) {
		abytes(key, void 0, "key");
		if (params.nonceLength !== void 0) {
			const nonce = args[0];
			abytes(nonce, params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
		}
		const tagl = params.tagLength;
		const aadStart = params.nonceLength !== void 0 ? 1 : 0;
		if (!params.withAAD) {
			for (let i = aadStart; i < args.length; i++) if (isBytes(args[i])) throw new Error("AAD not supported");
		}
		if (params.withAAD && args[aadStart] !== void 0) abytes(args[aadStart], void 0, "AAD");
		const cipher = constructor(key, ...args);
		const checkOutput = (fnLength, output) => {
			if (output !== void 0) {
				if (fnLength !== 2) throw new Error("cipher output not supported");
				abytes(output, void 0, "output");
			}
		};
		let called = false;
		return {
			encrypt(data, output) {
				if (called) throw new Error("cannot encrypt() twice with same key + nonce");
				called = true;
				abytes(data, void 0, "data");
				checkOutput(cipher.encrypt.length, output);
				return cipher.encrypt(data, output);
			},
			decrypt(data, output) {
				abytes(data, void 0, "data");
				if (tagl && data.length < tagl) throw new Error("\"ciphertext\" expected length >= tagLength=" + tagl);
				checkOutput(cipher.decrypt.length, output);
				return cipher.decrypt(data, output);
			}
		};
	}
	Object.assign(wrappedCipher, params);
	return wrappedCipher;
};
/**
* By default, returns u8a of length.
* When out is available, it checks it for validity and uses it.
* @param expectedLength - Required output length.
* @param out - Optional destination buffer.
* @param onlyAligned - Whether `out` must be 4-byte aligned.
* @returns Output buffer ready for writing.
* @throws On wrong argument types. {@link TypeError}
* @throws If the provided output buffer has the wrong size. {@link RangeError}
* @throws If the provided output buffer has the wrong alignment. {@link Error}
* @example
* Reuses a caller-provided output buffer when lengths match.
*
* ```ts
* getOutput(16, new Uint8Array(16));
* ```
*/
function getOutput(expectedLength, out, onlyAligned = true) {
	if (out === void 0) return new Uint8Array(expectedLength);
	abytes(out, expectedLength, "output");
	if (onlyAligned && !isAligned32(out)) throw new Error("invalid output, must be aligned");
	return out;
}
/**
* Encodes data and AAD lengths into a 16-byte buffer.
* @param dataLength - Data length. Units are caller-defined: GCM passes bit
* lengths, ChaCha20-Poly1305 passes byte lengths — the helper writes the raw values.
* @param aadLength - AAD length, same unit convention as `dataLength`.
* The serialized block is still `aadLength || dataLength`, matching GCM/Poly1305
* conventions even though the helper parameter order is `(dataLength, aadLength)`.
* @param isLE - Whether to encode lengths as little-endian.
* @returns 16-byte length block.
* @throws On wrong argument types passed to the endian validator. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Builds the length block appended by GCM and Poly1305.
*
* ```ts
* u64Lengths(16, 8, true);
* ```
*/
function u64Lengths(dataLength, aadLength, isLE) {
	anumber(dataLength);
	anumber(aadLength);
	abool(isLE);
	const num = /* @__PURE__ */ new Uint8Array(16);
	const view = createView(num);
	view.setBigUint64(0, BigInt(aadLength), isLE);
	view.setBigUint64(8, BigInt(dataLength), isLE);
	return num;
}
/**
* Checks whether a byte array is aligned to a 4-byte offset.
* @param bytes - Byte array to inspect.
* @returns `true` when the view is 4-byte aligned.
* @example
* Checks whether a buffer can be safely viewed as Uint32Array.
*
* ```ts
* isAligned32(new Uint8Array(4));
* ```
*/
function isAligned32(bytes) {
	return bytes.byteOffset % 4 === 0;
}
/**
* Copies bytes into a new Uint8Array.
* @param bytes - Bytes to copy.
* @returns Copied byte array.
* @throws On wrong argument types. {@link TypeError}
* @example
* Copies input into an aligned Uint8Array before block processing.
*
* ```ts
* copyBytes(new Uint8Array([1, 2]));
* ```
*/
function copyBytes(bytes) {
	return Uint8Array.from(abytes(bytes));
}
/**
* Cryptographically secure PRNG backed by `crypto.getRandomValues`.
* @param bytesLength - number of random bytes to generate
* @returns Random bytes.
* The platform `getRandomValues()` implementation still defines any
* single-call length cap, and this helper rejects oversize requests
* with a stable library `RangeError` instead of host-specific errors.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @throws If the current runtime does not provide `crypto.getRandomValues`. {@link Error}
* @example
* Generate a fresh random key or nonce.
* ```ts
* const key = randomBytes(16);
* ```
*/
function randomBytes(bytesLength = 32) {
	anumber(bytesLength, "bytesLength");
	const cr = typeof globalThis === "object" ? globalThis.crypto : null;
	if (typeof cr?.getRandomValues !== "function") throw new Error("crypto.getRandomValues must be defined");
	if (bytesLength > 65536) throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
	return cr.getRandomValues(new Uint8Array(bytesLength));
}
/**
* Uses CSPRNG for nonce, nonce injected in ciphertext.
* For `encrypt`, a `nonceBytes`-length buffer is fetched from CSPRNG and
* prepended to encrypted ciphertext. For `decrypt`, first `nonceBytes` of ciphertext
* are treated as nonce. The wrapper always allocates a fresh `nonce || ciphertext`
* buffer on encrypt and intentionally does not support caller-provided destination buffers.
* Too-short decrypt inputs are split into short/empty nonce views and then delegated
* to the wrapped cipher instead of being rejected here first.
*
* NOTE: Under the same key, using random nonces (e.g. `managedNonce`) with AES-GCM and ChaCha
* should be limited to `2**23` (8M) messages to get a collision chance of
* `2**-50`. Stretching to `2**32` (4B) messages would raise that chance to
* `2**-33`, still negligible but creeping up.
* @param fn - Cipher constructor that expects a nonce.
* @param randomBytes_ - Random-byte source used for nonce generation.
* @returns Cipher constructor that prepends the nonce to ciphertext.
* @throws On wrong argument types. {@link TypeError}
* @throws On invalid nonce lengths observed at wrapper construction or use. {@link RangeError}
* @example
* Prepends a fresh random nonce to every ciphertext.
*
* ```ts
* import { gcm } from '@noble/ciphers/aes.js';
* import { managedNonce, randomBytes } from '@noble/ciphers/utils.js';
* const wrapped = managedNonce(gcm);
* const key = randomBytes(16);
* const ciphertext = wrapped(key).encrypt(new Uint8Array([1, 2, 3]));
* wrapped(key).decrypt(ciphertext);
* ```
*/
function managedNonce(fn, randomBytes_ = randomBytes) {
	if (typeof fn !== "function") throw new TypeError("\"fn\" expected cipher constructor, got type=" + typeof fn);
	if (typeof randomBytes_ !== "function") throw new TypeError("\"randomBytes_\" expected function, got type=" + typeof randomBytes_);
	const { nonceLength } = fn;
	anumber(nonceLength, "fn.nonceLength");
	const addNonce = (nonce, ciphertext, plaintext) => {
		const out = concatBytes(nonce, ciphertext);
		if (!overlapBytes(plaintext, ciphertext)) ciphertext.fill(0);
		return out;
	};
	const res = ((key, ...args) => ({
		encrypt(plaintext) {
			abytes(plaintext, void 0, "data");
			const nonce = randomBytes_(nonceLength);
			const encrypted = fn(key, nonce, ...args).encrypt(plaintext);
			if (encrypted instanceof Promise) return encrypted.then((ct) => addNonce(nonce, ct, plaintext));
			return addNonce(nonce, encrypted, plaintext);
		},
		decrypt(ciphertext) {
			abytes(ciphertext, void 0, "data");
			const nonce = ciphertext.subarray(0, nonceLength);
			const decrypted = ciphertext.subarray(nonceLength);
			return fn(key, nonce, ...args).decrypt(decrypted);
		}
	}));
	if ("blockSize" in fn) res.blockSize = fn.blockSize;
	if ("tagLength" in fn) res.tagLength = fn.tagLength;
	if ("withAAD" in fn) res.withAAD = fn.withAAD;
	return res;
}
//#endregion
//#region node_modules/@noble/ciphers/_arx.js
/**
* Basic utils for ARX (add-rotate-xor) salsa and chacha ciphers.

RFC8439 requires multi-step cipher stream, where
authKey starts with counter: 0, actual msg with counter: 1.

For this, we need a way to re-use nonce / counter:

const counter = new Uint8Array(4);
chacha(..., counter, ...); // counter is now 1
chacha(..., counter, ...); // counter is now 2

This is complicated:

- 32-bit counters are enough, no need for 64-bit: max ArrayBuffer size in JS is 4GB
- Original papers don't allow mutating counters
- Counter overflow is undefined [^1]
- Idea A: allow providing (nonce | counter) instead of just nonce, re-use it
- Caveat: Cannot be re-used through all cases:
- * chacha has (counter | nonce)
- * xchacha has (nonce16 | counter | nonce16)
- Idea B: separate nonce / counter and provide separate API for counter re-use
- Caveat: there are different counter sizes depending on an algorithm.
- salsa & chacha also differ in structures of key & sigma:
salsa20:      s[0] | k(4) | s[1] | nonce(2) | cnt(2) | s[2] | k(4) | s[3]
chacha:       s(4) | k(8) | cnt(1) | nonce(3)
chacha20orig: s(4) | k(8) | cnt(2) | nonce(2)
- Idea C: helper method such as `setSalsaState(key, nonce, sigma, data)`
- Caveat: we can't re-use counter array

xchacha uses the subkey and remaining 8 byte nonce with ChaCha20 as normal
(prefixed by 4 NUL bytes, since RFC8439 specifies a 12-byte nonce).
Counter overflow is undefined; see {@link https://mailarchive.ietf.org/arch/msg/cfrg/gsOnTJzcbgG6OqD8Sc0GO5aR_tU/ | the CFRG thread}.
Current noble policy is strict non-wrap for the shared 32-bit counter path:
exported ARX ciphers reject initial `0xffffffff` and stop before any implicit
wrap back to zero.
See {@link https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha#appendix-A.2 | the XChaCha appendix} for the extended-nonce construction.

* @module
*/
var encodeStr = (str) => Uint8Array.from(str.split(""), (c) => c.charCodeAt(0));
var sigma16_32 = /* @__PURE__ */ (() => swap32IfBE(u32(encodeStr("expand 16-byte k"))))();
var sigma32_32 = /* @__PURE__ */ (() => swap32IfBE(u32(encodeStr("expand 32-byte k"))))();
/**
* Rotates a 32-bit word left.
* @param a - Input word.
* @param b - Rotation count in bits.
* @returns Rotated 32-bit word.
* @example
* Moves the top byte of `0x12345678` into the low byte position.
* ```ts
* rotl(0x12345678, 8);
* ```
*/
function rotl(a, b) {
	return a << b | a >>> 32 - b;
}
var BLOCK_LEN = 64;
var BLOCK_LEN32 = 16;
var MAX_COUNTER = /* @__PURE__ */ (() => 2 ** 32 - 1)();
var U32_EMPTY = /* @__PURE__ */ Uint32Array.of();
function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
	const len = data.length;
	const block = new Uint8Array(BLOCK_LEN);
	const b32 = u32(block);
	const isAligned = isLE && isAligned32(data) && isAligned32(output);
	const d32 = isAligned ? u32(data) : U32_EMPTY;
	const o32 = isAligned ? u32(output) : U32_EMPTY;
	if (!isLE) {
		for (let pos = 0; pos < len; counter++) {
			core(sigma, key, nonce, b32, counter, rounds);
			swap32IfBE(b32);
			if (counter >= MAX_COUNTER) throw new Error("arx: counter overflow");
			const take = Math.min(BLOCK_LEN, len - pos);
			for (let j = 0, posj; j < take; j++) {
				posj = pos + j;
				output[posj] = data[posj] ^ block[j];
			}
			pos += take;
		}
		return;
	}
	for (let pos = 0; pos < len; counter++) {
		core(sigma, key, nonce, b32, counter, rounds);
		if (counter >= MAX_COUNTER) throw new Error("arx: counter overflow");
		const take = Math.min(BLOCK_LEN, len - pos);
		if (isAligned && take === BLOCK_LEN) {
			const pos32 = pos / 4;
			if (pos % 4 !== 0) throw new Error("arx: invalid block position");
			for (let j = 0, posj; j < BLOCK_LEN32; j++) {
				posj = pos32 + j;
				o32[posj] = d32[posj] ^ b32[j];
			}
			pos += BLOCK_LEN;
			continue;
		}
		for (let j = 0, posj; j < take; j++) {
			posj = pos + j;
			output[posj] = data[posj] ^ block[j];
		}
		pos += take;
	}
}
/**
* Creates an ARX stream cipher from a 32-bit core permutation.
* Used internally to build the exported Salsa and ChaCha stream ciphers.
* @param core - Core function that fills one keystream block.
* @param opts - Cipher layout and nonce-extension options. See {@link CipherOpts}.
* @returns Stream cipher function over byte arrays.
* @throws If the core callback, key size, counter, or output sizing is invalid. {@link Error}
*/
function createCipher(core, opts) {
	const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = checkOpts({
		allowShortKeys: false,
		counterLength: 8,
		counterRight: false,
		rounds: 20
	}, opts);
	if (typeof core !== "function") throw new Error("core must be a function");
	anumber(counterLength);
	anumber(rounds);
	abool(counterRight);
	abool(allowShortKeys);
	return (key, nonce, data, output, counter = 0) => {
		abytes(key, void 0, "key");
		abytes(nonce, void 0, "nonce");
		abytes(data, void 0, "data");
		const len = data.length;
		const hasOutput = output !== void 0;
		output = getOutput(len, output, false);
		if (hasOutput) complexOverlapBytes(data, output);
		anumber(counter);
		if (counter < 0 || counter >= MAX_COUNTER) throw new Error("arx: counter overflow");
		const toClean = [];
		let l = key.length;
		let k;
		let sigma;
		if (l === 32) {
			toClean.push(k = copyBytes(key));
			sigma = sigma32_32;
		} else if (l === 16 && allowShortKeys) {
			k = /* @__PURE__ */ new Uint8Array(32);
			k.set(key);
			k.set(key, 16);
			sigma = sigma16_32;
			toClean.push(k);
		} else {
			abytes(key, 32, "arx key");
			throw new Error("invalid key size");
		}
		if (!isLE || !isAligned32(nonce)) toClean.push(nonce = copyBytes(nonce));
		let k32 = u32(k);
		if (extendNonceFn) {
			if (nonce.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
			const n16 = nonce.subarray(0, 16);
			if (isLE) extendNonceFn(sigma, k32, u32(n16), k32);
			else {
				const sigmaRaw = swap32IfBE(Uint32Array.from(sigma));
				extendNonceFn(sigmaRaw, k32, u32(n16), k32);
				clean(sigmaRaw);
				swap32IfBE(k32);
			}
			nonce = nonce.subarray(16);
		} else if (!isLE) swap32IfBE(k32);
		const nonceNcLen = 16 - counterLength;
		if (nonceNcLen !== nonce.length) throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
		if (nonceNcLen !== 12) {
			const nc = /* @__PURE__ */ new Uint8Array(12);
			nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
			nonce = nc;
			toClean.push(nonce);
		}
		const n32 = swap32IfBE(u32(nonce));
		try {
			runCipher(core, sigma, k32, n32, data, output, counter, rounds);
			return output;
		} finally {
			clean(...toClean);
		}
	};
}
//#endregion
//#region node_modules/@noble/ciphers/_poly1305.js
/**
* Poly1305 ({@link https://cr.yp.to/mac/poly1305-20050329.pdf | PDF},
* {@link https://en.wikipedia.org/wiki/Poly1305 | wiki})
* is a fast and parallel secret-key message-authentication code suitable for
* a wide variety of applications. It was standardized in
* {@link https://www.rfc-editor.org/rfc/rfc8439 | RFC 8439} and is now used in TLS 1.3.
*
* Polynomial MACs are not perfect for every situation:
* they lack Random Key Robustness: the MAC can be forged, and can't be used in PAKE schemes.
* See {@link https://keymaterial.net/2020/09/07/invisible-salamanders-in-aes-gcm-siv/ | the invisible salamanders attack writeup}.
* To combat invisible salamanders, `hash(key)` can be included in ciphertext,
* however, this would violate ciphertext indistinguishability:
* an attacker would know which key was used - so `HKDF(key, i)`
* could be used instead.
*
* Check out the {@link https://cr.yp.to/mac.html | original website}.
* Based on public-domain {@link https://github.com/floodyberry/poly1305-donna | poly1305-donna}.
* @module
*/
function u8to16(a, i) {
	return a[i++] & 255 | (a[i++] & 255) << 8;
}
/**
* Incremental Poly1305 MAC state.
* Prefer `poly1305()` for one-shot use.
* @param key - 32-byte Poly1305 one-time key.
* @example
* Feeds one chunk into an incremental Poly1305 state with a fresh one-time key.
*
* ```ts
* import { Poly1305 } from '@noble/ciphers/_poly1305.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(32);
* const mac = new Poly1305(key);
* mac.update(new Uint8Array([1, 2, 3]));
* mac.digest();
* ```
*/
var Poly1305 = class {
	blockLen = 16;
	outputLen = 16;
	buffer = /* @__PURE__ */ new Uint8Array(16);
	r = /* @__PURE__ */ new Uint16Array(10);
	h = /* @__PURE__ */ new Uint16Array(10);
	pad = /* @__PURE__ */ new Uint16Array(8);
	pos = 0;
	finished = false;
	destroyed = false;
	constructor(key) {
		key = copyBytes(abytes(key, 32, "key"));
		const t0 = u8to16(key, 0);
		const t1 = u8to16(key, 2);
		const t2 = u8to16(key, 4);
		const t3 = u8to16(key, 6);
		const t4 = u8to16(key, 8);
		const t5 = u8to16(key, 10);
		const t6 = u8to16(key, 12);
		const t7 = u8to16(key, 14);
		this.r[0] = t0 & 8191;
		this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
		this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
		this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
		this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
		this.r[5] = t4 >>> 1 & 8190;
		this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
		this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
		this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
		this.r[9] = t7 >>> 5 & 127;
		for (let i = 0; i < 8; i++) this.pad[i] = u8to16(key, 16 + 2 * i);
	}
	process(data, offset, isLast = false) {
		const hibit = isLast ? 0 : 2048;
		const { h, r } = this;
		const r0 = r[0];
		const r1 = r[1];
		const r2 = r[2];
		const r3 = r[3];
		const r4 = r[4];
		const r5 = r[5];
		const r6 = r[6];
		const r7 = r[7];
		const r8 = r[8];
		const r9 = r[9];
		const t0 = u8to16(data, offset + 0);
		const t1 = u8to16(data, offset + 2);
		const t2 = u8to16(data, offset + 4);
		const t3 = u8to16(data, offset + 6);
		const t4 = u8to16(data, offset + 8);
		const t5 = u8to16(data, offset + 10);
		const t6 = u8to16(data, offset + 12);
		const t7 = u8to16(data, offset + 14);
		let h0 = h[0] + (t0 & 8191);
		let h1 = h[1] + ((t0 >>> 13 | t1 << 3) & 8191);
		let h2 = h[2] + ((t1 >>> 10 | t2 << 6) & 8191);
		let h3 = h[3] + ((t2 >>> 7 | t3 << 9) & 8191);
		let h4 = h[4] + ((t3 >>> 4 | t4 << 12) & 8191);
		let h5 = h[5] + (t4 >>> 1 & 8191);
		let h6 = h[6] + ((t4 >>> 14 | t5 << 2) & 8191);
		let h7 = h[7] + ((t5 >>> 11 | t6 << 5) & 8191);
		let h8 = h[8] + ((t6 >>> 8 | t7 << 8) & 8191);
		let h9 = h[9] + (t7 >>> 5 | hibit);
		let c = 0;
		let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
		c = d0 >>> 13;
		d0 &= 8191;
		d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
		c += d0 >>> 13;
		d0 &= 8191;
		let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
		c = d1 >>> 13;
		d1 &= 8191;
		d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
		c += d1 >>> 13;
		d1 &= 8191;
		let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
		c = d2 >>> 13;
		d2 &= 8191;
		d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
		c += d2 >>> 13;
		d2 &= 8191;
		let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
		c = d3 >>> 13;
		d3 &= 8191;
		d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
		c += d3 >>> 13;
		d3 &= 8191;
		let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
		c = d4 >>> 13;
		d4 &= 8191;
		d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
		c += d4 >>> 13;
		d4 &= 8191;
		let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
		c = d5 >>> 13;
		d5 &= 8191;
		d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
		c += d5 >>> 13;
		d5 &= 8191;
		let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
		c = d6 >>> 13;
		d6 &= 8191;
		d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
		c += d6 >>> 13;
		d6 &= 8191;
		let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
		c = d7 >>> 13;
		d7 &= 8191;
		d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
		c += d7 >>> 13;
		d7 &= 8191;
		let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
		c = d8 >>> 13;
		d8 &= 8191;
		d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
		c += d8 >>> 13;
		d8 &= 8191;
		let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
		c = d9 >>> 13;
		d9 &= 8191;
		d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
		c += d9 >>> 13;
		d9 &= 8191;
		c = (c << 2) + c | 0;
		c = c + d0 | 0;
		d0 = c & 8191;
		c = c >>> 13;
		d1 += c;
		h[0] = d0;
		h[1] = d1;
		h[2] = d2;
		h[3] = d3;
		h[4] = d4;
		h[5] = d5;
		h[6] = d6;
		h[7] = d7;
		h[8] = d8;
		h[9] = d9;
	}
	finalize() {
		const { h, pad } = this;
		const g = /* @__PURE__ */ new Uint16Array(10);
		let c = h[1] >>> 13;
		h[1] &= 8191;
		for (let i = 2; i < 10; i++) {
			h[i] += c;
			c = h[i] >>> 13;
			h[i] &= 8191;
		}
		h[0] += c * 5;
		c = h[0] >>> 13;
		h[0] &= 8191;
		h[1] += c;
		c = h[1] >>> 13;
		h[1] &= 8191;
		h[2] += c;
		g[0] = h[0] + 5;
		c = g[0] >>> 13;
		g[0] &= 8191;
		for (let i = 1; i < 10; i++) {
			g[i] = h[i] + c;
			c = g[i] >>> 13;
			g[i] &= 8191;
		}
		g[9] -= 8192;
		let mask = (c ^ 1) - 1;
		for (let i = 0; i < 10; i++) g[i] &= mask;
		mask = ~mask;
		for (let i = 0; i < 10; i++) h[i] = h[i] & mask | g[i];
		h[0] = (h[0] | h[1] << 13) & 65535;
		h[1] = (h[1] >>> 3 | h[2] << 10) & 65535;
		h[2] = (h[2] >>> 6 | h[3] << 7) & 65535;
		h[3] = (h[3] >>> 9 | h[4] << 4) & 65535;
		h[4] = (h[4] >>> 12 | h[5] << 1 | h[6] << 14) & 65535;
		h[5] = (h[6] >>> 2 | h[7] << 11) & 65535;
		h[6] = (h[7] >>> 5 | h[8] << 8) & 65535;
		h[7] = (h[8] >>> 8 | h[9] << 5) & 65535;
		let f = h[0] + pad[0];
		h[0] = f & 65535;
		for (let i = 1; i < 8; i++) {
			f = (h[i] + pad[i] | 0) + (f >>> 16) | 0;
			h[i] = f & 65535;
		}
		clean(g);
	}
	update(data) {
		aexists(this);
		abytes(data);
		data = copyBytes(data);
		const { buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				for (; blockLen <= len - pos; pos += blockLen) this.process(data, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(buffer, 0, false);
				this.pos = 0;
			}
		}
		return this;
	}
	destroy() {
		this.destroyed = true;
		clean(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, h } = this;
		let { pos } = this;
		if (pos) {
			buffer[pos++] = 1;
			for (; pos < 16; pos++) buffer[pos] = 0;
			this.process(buffer, 0, true);
		}
		this.finalize();
		let opos = 0;
		for (let i = 0; i < 8; i++) {
			out[opos++] = h[i] >>> 0;
			out[opos++] = h[i] >>> 8;
		}
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
};
/**
* Poly1305 MAC from RFC 8439.
* @param msg - Message bytes to authenticate.
* @param key - 32-byte Poly1305 one-time key.
* @returns 16-byte authentication tag.
* @example
* Authenticates one message with a one-shot Poly1305 call and a fresh key.
*
* ```ts
* import { poly1305 } from '@noble/ciphers/_poly1305.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(32);
* poly1305(new Uint8Array(), key);
* ```
*/
var poly1305 = /* @__PURE__ */ wrapMacConstructor(32, (key) => new Poly1305(key));
//#endregion
//#region node_modules/@noble/ciphers/chacha.js
/**
* ChaCha stream cipher, released
* in 2008. Developed after Salsa20, ChaCha aims to increase diffusion per round.
* It was standardized in
* {@link https://www.rfc-editor.org/rfc/rfc8439 | RFC 8439} and
* is now used in TLS 1.3.
*
* {@link https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha | XChaCha20}
* extended-nonce variant is also provided. Similar to XSalsa, it's safe to use with
* randomly-generated nonces.
*
* Check out
* {@link http://cr.yp.to/chacha/chacha-20080128.pdf | PDF},
* {@link https://en.wikipedia.org/wiki/Salsa20 | wiki}, and
* {@link https://cr.yp.to/chacha.html | website}.
*
* @module
*/
/**
* ChaCha core function. Uses an unrolled loop (chachaCore, hchacha) - 4x
* faster than a simple loop, but larger & harder to read. A simple-loop
* reference version lives in `test/misc/micro-ciphers.ts`;
* `test/arx.test.ts` keeps the two aligned.
* The specific implementation is selected in `createCipher` below.
*/
/** RFC 8439 §2.3 block core for `state = constants | key | counter | nonce`. */
function chachaCore(s, k, n, out, cnt, rounds = 20) {
	let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
	let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
	for (let r = 0; r < rounds; r += 2) {
		x00 = x00 + x04 | 0;
		x12 = rotl(x12 ^ x00, 16);
		x08 = x08 + x12 | 0;
		x04 = rotl(x04 ^ x08, 12);
		x00 = x00 + x04 | 0;
		x12 = rotl(x12 ^ x00, 8);
		x08 = x08 + x12 | 0;
		x04 = rotl(x04 ^ x08, 7);
		x01 = x01 + x05 | 0;
		x13 = rotl(x13 ^ x01, 16);
		x09 = x09 + x13 | 0;
		x05 = rotl(x05 ^ x09, 12);
		x01 = x01 + x05 | 0;
		x13 = rotl(x13 ^ x01, 8);
		x09 = x09 + x13 | 0;
		x05 = rotl(x05 ^ x09, 7);
		x02 = x02 + x06 | 0;
		x14 = rotl(x14 ^ x02, 16);
		x10 = x10 + x14 | 0;
		x06 = rotl(x06 ^ x10, 12);
		x02 = x02 + x06 | 0;
		x14 = rotl(x14 ^ x02, 8);
		x10 = x10 + x14 | 0;
		x06 = rotl(x06 ^ x10, 7);
		x03 = x03 + x07 | 0;
		x15 = rotl(x15 ^ x03, 16);
		x11 = x11 + x15 | 0;
		x07 = rotl(x07 ^ x11, 12);
		x03 = x03 + x07 | 0;
		x15 = rotl(x15 ^ x03, 8);
		x11 = x11 + x15 | 0;
		x07 = rotl(x07 ^ x11, 7);
		x00 = x00 + x05 | 0;
		x15 = rotl(x15 ^ x00, 16);
		x10 = x10 + x15 | 0;
		x05 = rotl(x05 ^ x10, 12);
		x00 = x00 + x05 | 0;
		x15 = rotl(x15 ^ x00, 8);
		x10 = x10 + x15 | 0;
		x05 = rotl(x05 ^ x10, 7);
		x01 = x01 + x06 | 0;
		x12 = rotl(x12 ^ x01, 16);
		x11 = x11 + x12 | 0;
		x06 = rotl(x06 ^ x11, 12);
		x01 = x01 + x06 | 0;
		x12 = rotl(x12 ^ x01, 8);
		x11 = x11 + x12 | 0;
		x06 = rotl(x06 ^ x11, 7);
		x02 = x02 + x07 | 0;
		x13 = rotl(x13 ^ x02, 16);
		x08 = x08 + x13 | 0;
		x07 = rotl(x07 ^ x08, 12);
		x02 = x02 + x07 | 0;
		x13 = rotl(x13 ^ x02, 8);
		x08 = x08 + x13 | 0;
		x07 = rotl(x07 ^ x08, 7);
		x03 = x03 + x04 | 0;
		x14 = rotl(x14 ^ x03, 16);
		x09 = x09 + x14 | 0;
		x04 = rotl(x04 ^ x09, 12);
		x03 = x03 + x04 | 0;
		x14 = rotl(x14 ^ x03, 8);
		x09 = x09 + x14 | 0;
		x04 = rotl(x04 ^ x09, 7);
	}
	let oi = 0;
	out[oi++] = y00 + x00 | 0;
	out[oi++] = y01 + x01 | 0;
	out[oi++] = y02 + x02 | 0;
	out[oi++] = y03 + x03 | 0;
	out[oi++] = y04 + x04 | 0;
	out[oi++] = y05 + x05 | 0;
	out[oi++] = y06 + x06 | 0;
	out[oi++] = y07 + x07 | 0;
	out[oi++] = y08 + x08 | 0;
	out[oi++] = y09 + x09 | 0;
	out[oi++] = y10 + x10 | 0;
	out[oi++] = y11 + x11 | 0;
	out[oi++] = y12 + x12 | 0;
	out[oi++] = y13 + x13 | 0;
	out[oi++] = y14 + x14 | 0;
	out[oi++] = y15 + x15 | 0;
}
/**
* hchacha hashes key and nonce into key' and nonce' for xchacha20.
* Algorithmically identical to `hchacha_small` from `test/misc/micro-ciphers.ts`,
* but this exported path normalizes word order on big-endian hosts.
* Reuses `chachaCore` and subtracts its feed-forward, keeping the hot per-block
* path untouched.
* @param s - Sigma constants as 32-bit words.
* @param k - Key words.
* @param i - Nonce-prefix words.
* @param out - Output buffer for the derived subkey.
* @example
* Derives the XChaCha subkey from sigma, key, and nonce-prefix words.
*
* ```ts
* const sigma = new Uint32Array(4);
* const key = new Uint32Array(8);
* const nonce = new Uint32Array(4);
* const out = new Uint32Array(8);
* hchacha(sigma, key, nonce, out);
* ```
*/
function hchacha(s, k, i, out) {
	const s2 = isLE ? s : swap32IfBE(s.slice(0, 4));
	const k2 = isLE ? k : swap32IfBE(k.slice(0, 8));
	const i2 = isLE ? i : swap32IfBE(i.slice(0, 4));
	const t = /* @__PURE__ */ new Uint32Array(16);
	chachaCore(s2, k2, i2.subarray(1), t, i2[0]);
	let oi = 0;
	out[oi++] = t[0] - s2[0] | 0;
	out[oi++] = t[1] - s2[1] | 0;
	out[oi++] = t[2] - s2[2] | 0;
	out[oi++] = t[3] - s2[3] | 0;
	out[oi++] = t[12] - i2[0] | 0;
	out[oi++] = t[13] - i2[1] | 0;
	out[oi++] = t[14] - i2[2] | 0;
	out[oi++] = t[15] - i2[3] | 0;
	swap32IfBE(out);
	if (!isLE) clean(s2, k2, i2);
	clean(t);
}
/**
* XChaCha eXtended-nonce ChaCha. With 24-byte nonce, it's safe to make it random (CSPRNG).
* See {@link https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha | the IRTF draft}.
* The nonce/counter layout still reserves 8 counter bytes internally, but the shared public
* `counter` argument follows noble's strict non-wrapping 32-bit policy. See `src/_arx.ts`
* near `MAX_COUNTER` for the full counter-policy rationale.
* @param key - 32-byte key.
* @param nonce - 24-byte extended nonce.
* @param data - Input bytes to xor with the keystream.
* @param output - Optional destination buffer.
* @param counter - Initial block counter.
* @returns Encrypted or decrypted bytes.
* @example
* Encrypts bytes with XChaCha20 using a fresh key and random 24-byte nonce.
*
* ```ts
* import { xchacha20 } from '@noble/ciphers/chacha.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(32);
* const nonce = randomBytes(24);
* xchacha20(key, nonce, new Uint8Array(4));
* ```
*/
var xchacha20 = /* @__PURE__ */ createCipher(chachaCore, {
	counterRight: false,
	counterLength: 8,
	extendNonceFn: hchacha,
	allowShortKeys: false
});
var ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
var updatePadded = (h, msg) => {
	h.update(msg);
	const leftover = msg.length % 16;
	if (leftover) h.update(ZEROS16.subarray(leftover));
};
var ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
function computeTag(fn, key, nonce, ciphertext, AAD) {
	if (AAD !== void 0) abytes(AAD, void 0, "AAD");
	const authKey = fn(key, nonce, ZEROS32);
	const lengths = u64Lengths(ciphertext.length, AAD ? AAD.length : 0, true);
	const h = poly1305.create(authKey);
	if (AAD) updatePadded(h, AAD);
	updatePadded(h, ciphertext);
	h.update(lengths);
	const res = h.digest();
	clean(authKey, lengths);
	return res;
}
/**
* AEAD algorithm from RFC 8439.
* Salsa20 and chacha (RFC 8439) use poly1305 differently.
* We could have composed them, but it's hard because of authKey:
* In salsa20, authKey changes position in salsa stream.
* In chacha, authKey can't be computed inside computeTag, it modifies the counter.
*/
var _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
	const tagLength = 16;
	return {
		encrypt(plaintext, output) {
			const plength = plaintext.length;
			output = getOutput(plength + tagLength, output, false);
			output.set(plaintext);
			const oPlain = output.subarray(0, -16);
			xorStream(key, nonce, oPlain, oPlain, 1);
			const tag = computeTag(xorStream, key, nonce, oPlain, AAD);
			output.set(tag, plength);
			clean(tag);
			return output;
		},
		decrypt(ciphertext, output) {
			output = getOutput(ciphertext.length - tagLength, output, false);
			const data = ciphertext.subarray(0, -16);
			const passedTag = ciphertext.subarray(-16);
			const tag = computeTag(xorStream, key, nonce, data, AAD);
			if (!equalBytes(passedTag, tag)) {
				clean(tag);
				throw new Error("invalid tag");
			}
			output.set(ciphertext.subarray(0, -16));
			xorStream(key, nonce, output, output, 1);
			clean(tag);
			return output;
		}
	};
};
/**
* XChaCha20-Poly1305 extended-nonce chacha.
*
* Can be safely used with random nonces (CSPRNG).
* See {@link https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha | the IRTF draft}.
* @param key - 32-byte key.
* @param nonce - 24-byte nonce.
* @param AAD - Additional authenticated data.
* @returns AEAD cipher instance.
* @example
* Encrypts and authenticates plaintext with a fresh key and random 24-byte nonce.
*
* ```ts
* import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(32);
* const nonce = randomBytes(24);
* const aad = new TextEncoder().encode('session metadata');
* const cipher = xchacha20poly1305(key, nonce, aad);
* cipher.encrypt(new Uint8Array([1, 2, 3]));
* ```
*/
var xchacha20poly1305 = /* @__PURE__ */ wrapCipher({
	blockSize: 64,
	nonceLength: 24,
	tagLength: 16,
	withAAD: true
}, /* @__PURE__ */ _poly1305_aead(xchacha20));
//#endregion
export { utf8ToBytes as a, managedNonce as i, bytesToHex as n, hexToBytes as r, xchacha20poly1305 as t };
