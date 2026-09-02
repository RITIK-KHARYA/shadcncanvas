import { r as __exportAll } from "../_runtime.mjs";
import { n as createAdapterFactory, yn as logger } from "./@better-auth/core+[...].mjs";
//#region node_modules/@better-auth/memory-adapter/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({ memoryAdapter: () => memoryAdapter });
/**
* Case-insensitive in-memory comparison helpers.
* Used when evaluating where clauses in the memory adapter.
*/
function insensitiveCompare(a, b) {
	if (typeof a === "string" && typeof b === "string") return a.toLowerCase() === b.toLowerCase();
	return a === b;
}
function insensitiveIn(recordVal, values) {
	if (typeof recordVal !== "string") return values.includes(recordVal);
	return values.some((v) => typeof v === "string" && recordVal.toLowerCase() === v.toLowerCase());
}
function insensitiveNotIn(recordVal, values) {
	return !insensitiveIn(recordVal, values);
}
function insensitiveContains(recordVal, value) {
	if (typeof recordVal !== "string" || typeof value !== "string") return false;
	return recordVal.toLowerCase().includes(value.toLowerCase());
}
function insensitiveStartsWith(recordVal, value) {
	if (typeof recordVal !== "string" || typeof value !== "string") return false;
	return recordVal.toLowerCase().startsWith(value.toLowerCase());
}
function insensitiveEndsWith(recordVal, value) {
	if (typeof recordVal !== "string" || typeof value !== "string") return false;
	return recordVal.toLowerCase().endsWith(value.toLowerCase());
}
/**
* Index a table's rows by their `id` for row-level reconciliation. Every
* better-auth row carries an `id` (the adapter's join logic already keys on
* `record.id`), so the id is a stable identity for the three-way merge.
*/
function indexById(rows) {
	const byId = /* @__PURE__ */ new Map();
	for (const row of rows) byId.set(row.id, row);
	return byId;
}
/**
* Commit a transaction onto the live database with a three-way merge so a
* concurrent write that interleaved at an `await` point survives.
*
* `base` is the snapshot taken when the transaction started; `clone` is that
* snapshot after the transaction mutated it; `target` is the live database as
* it stands now (possibly carrying concurrent writes). Replaying only the
* `base -> clone` delta onto `target` applies the transaction's own creates,
* updates, and deletes without disturbing rows or tables the transaction never
* touched. A row the transaction did not change keeps the live version, so a
* concurrent edit to a different row is preserved. A row the transaction did
* change wins last-writer-wins over a concurrent edit to the same row, which is
* acceptable for an in-memory development adapter; isolation is guaranteed only
* at row/table granularity.
*
* `target` is mutated in place so any reference held elsewhere (for example the
* `db` object the caller passed to `memoryAdapter`) stays valid.
*/
function mergeTransactionInto(target, base, clone) {
	const models = /* @__PURE__ */ new Set([...Object.keys(base), ...Object.keys(clone)]);
	for (const model of models) {
		if (!(model in clone)) {
			delete target[model];
			continue;
		}
		const baseById = indexById(base[model] ?? []);
		const cloneRows = clone[model] ?? [];
		const cloneById = indexById(cloneRows);
		const liveRows = target[model] ?? [];
		const merged = [];
		const placed = /* @__PURE__ */ new Set();
		for (const liveRow of liveRows) {
			const id = liveRow.id;
			const baseRow = baseById.get(id);
			const cloneRow = cloneById.get(id);
			if (baseRow !== void 0 && cloneRow === void 0) continue;
			if (cloneRow !== void 0 && rowChanged(baseRow, cloneRow)) merged.push(cloneRow);
			else merged.push(liveRow);
			placed.add(id);
		}
		for (const cloneRow of cloneRows) if (!baseById.has(cloneRow.id) && !placed.has(cloneRow.id)) merged.push(cloneRow);
		target[model] = merged;
	}
}
/**
* Whether the transaction mutated a row, comparing its pre-transaction
* snapshot to its post-transaction state. Rows hold scalar columns and
* adapter-serializable values, so JSON equality reliably tells a
* transaction-made edit apart from an untouched row.
*/
function rowChanged(baseRow, cloneRow) {
	if (baseRow === void 0) return true;
	return JSON.stringify(baseRow) !== JSON.stringify(cloneRow);
}
var memoryAdapter = (db, config) => {
	let lazyOptions = null;
	/**
	* Build an adapter factory whose operations read and write `activeDb`.
	* The non-transactional adapter targets the live `db`. A transaction
	* targets an isolated clone so its uncommitted writes are invisible to
	* concurrent operations against the live `db`. A failed transaction leaves
	* the live `db` untouched, and a committed one replays only its own
	* row/table changes, so a concurrent write that interleaved at an `await`
	* point survives either outcome. Isolation is at row/table granularity:
	* the in-memory adapter does not serialize writes, so two operations that
	* edit the same row resolve last-writer-wins. It is built for development
	* and tests, not production concurrency control.
	*/
	const buildAdapterFactory = (activeDb) => createAdapterFactory({
		config: {
			adapterId: "memory",
			adapterName: "Memory Adapter",
			usePlural: false,
			debugLogs: config?.debugLogs || false,
			supportsArrays: true,
			customTransformInput(props) {
				if (props.options.advanced?.database?.generateId === "serial" && props.field === "id" && props.action === "create") return activeDb[props.model].length + 1;
				return props.data;
			},
			transaction: async (cb) => {
				const base = structuredClone(activeDb);
				const clone = structuredClone(activeDb);
				const result = await cb(buildAdapterFactory(clone)(lazyOptions));
				mergeTransactionInto(activeDb, base, clone);
				return result;
			}
		},
		adapter: ({ getFieldName, getDefaultFieldName, options, getModelName }) => {
			const applySortToRecords = (records, sortBy, model) => {
				if (!sortBy) return records;
				return records.sort((a, b) => {
					const field = getFieldName({
						model,
						field: sortBy.field
					});
					const aValue = a[field];
					const bValue = b[field];
					let comparison = 0;
					if (aValue == null && bValue == null) comparison = 0;
					else if (aValue == null) comparison = -1;
					else if (bValue == null) comparison = 1;
					else if (typeof aValue === "string" && typeof bValue === "string") comparison = aValue.localeCompare(bValue);
					else if (aValue instanceof Date && bValue instanceof Date) comparison = aValue.getTime() - bValue.getTime();
					else if (typeof aValue === "number" && typeof bValue === "number") comparison = aValue - bValue;
					else if (typeof aValue === "boolean" && typeof bValue === "boolean") comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
					else comparison = String(aValue).localeCompare(String(bValue));
					return sortBy.direction === "asc" ? comparison : -comparison;
				});
			};
			function convertWhereClause(where, model, join, select) {
				const baseRecords = (() => {
					const table = activeDb[model];
					if (!table) {
						logger.error(`[MemoryAdapter] Model ${model} not found in the DB`, Object.keys(activeDb));
						throw new Error(`Model ${model} not found`);
					}
					const evalClause = (record, clause) => {
						const { field, value, operator, mode = "sensitive" } = clause;
						const isInsensitive = mode === "insensitive" && (typeof value === "string" || Array.isArray(value) && value.every((v) => typeof v === "string"));
						switch (operator) {
							case "in":
								if (!Array.isArray(value)) throw new Error("Value must be an array");
								if (isInsensitive) return insensitiveIn(record[field], value);
								return value.includes(record[field]);
							case "not_in":
								if (!Array.isArray(value)) throw new Error("Value must be an array");
								if (isInsensitive) return insensitiveNotIn(record[field], value);
								return !value.includes(record[field]);
							case "contains":
								if (isInsensitive) return insensitiveContains(record[field], value);
								return record[field]?.includes(value);
							case "starts_with":
								if (isInsensitive) return insensitiveStartsWith(record[field], value);
								return record[field].startsWith(value);
							case "ends_with":
								if (isInsensitive) return insensitiveEndsWith(record[field], value);
								return record[field].endsWith(value);
							case "ne": return isInsensitive ? !insensitiveCompare(record[field], value) : record[field] !== value;
							case "gt": return value != null && Boolean(record[field] > value);
							case "gte": return value != null && Boolean(record[field] >= value);
							case "lt": return value != null && Boolean(record[field] < value);
							case "lte": return value != null && Boolean(record[field] <= value);
							default:
								if (isInsensitive) return insensitiveCompare(record[field], value);
								if (value === null) return record[field] == null;
								return record[field] === value;
						}
					};
					let records = table.filter((record) => {
						if (!where.length || where.length === 0) return true;
						let result = evalClause(record, where[0]);
						for (const clause of where) {
							const clauseResult = evalClause(record, clause);
							if (clause.connector === "OR") result = result || clauseResult;
							else result = result && clauseResult;
						}
						return result;
					});
					if (select?.length && select.length > 0) records = records.map((record) => Object.fromEntries(Object.entries(record).filter(([key]) => select.includes(getDefaultFieldName({
						model,
						field: key
					})))));
					return records;
				})();
				if (!join) return baseRecords;
				const grouped = /* @__PURE__ */ new Map();
				const seenIds = /* @__PURE__ */ new Map();
				for (const baseRecord of baseRecords) {
					const baseId = String(baseRecord.id);
					if (!grouped.has(baseId)) {
						const nested = { ...baseRecord };
						for (const [joinModel, joinAttr] of Object.entries(join)) {
							const joinModelName = getModelName(joinModel);
							if (joinAttr.relation === "one-to-one") nested[joinModelName] = null;
							else {
								nested[joinModelName] = [];
								seenIds.set(`${baseId}-${joinModel}`, /* @__PURE__ */ new Set());
							}
						}
						grouped.set(baseId, nested);
					}
					const nestedEntry = grouped.get(baseId);
					for (const [joinModel, joinAttr] of Object.entries(join)) {
						const joinModelName = getModelName(joinModel);
						const joinTable = activeDb[joinModelName];
						if (!joinTable) {
							logger.error(`[MemoryAdapter] JoinOption model ${joinModelName} not found in the DB`, Object.keys(activeDb));
							throw new Error(`JoinOption model ${joinModelName} not found`);
						}
						const matchingRecords = joinTable.filter((joinRecord) => joinRecord[joinAttr.on.to] === baseRecord[joinAttr.on.from]);
						if (joinAttr.relation === "one-to-one") nestedEntry[joinModelName] = matchingRecords[0] || null;
						else {
							const seenSet = seenIds.get(`${baseId}-${joinModel}`);
							const limit = joinAttr.limit ?? 100;
							let count = 0;
							for (const matchingRecord of matchingRecords) {
								if (count >= limit) break;
								if (!seenSet.has(matchingRecord.id)) {
									nestedEntry[joinModelName].push(matchingRecord);
									seenSet.add(matchingRecord.id);
									count++;
								}
							}
						}
					}
				}
				return Array.from(grouped.values());
			}
			return {
				create: async ({ model, data }) => {
					if (options.advanced?.database?.generateId === "serial") data.id = activeDb[getModelName(model)].length + 1;
					if (!activeDb[model]) activeDb[model] = [];
					activeDb[model].push(data);
					return data;
				},
				findOne: async ({ model, where, select, join }) => {
					const res = convertWhereClause(where, model, join, select);
					if (join) {
						const resArray = res;
						if (!resArray.length) return null;
						return resArray[0];
					}
					return res[0] || null;
				},
				findMany: async ({ model, where, sortBy, limit, select, offset, join }) => {
					const res = convertWhereClause(where || [], model, join, select);
					if (join) {
						const resArray = res;
						if (!resArray.length) return [];
						applySortToRecords(resArray, sortBy, model);
						let paginatedRecords = resArray;
						if (offset !== void 0) paginatedRecords = paginatedRecords.slice(offset);
						if (limit !== void 0) paginatedRecords = paginatedRecords.slice(0, limit);
						return paginatedRecords;
					}
					let table = applySortToRecords(res, sortBy, model);
					if (offset !== void 0) table = table.slice(offset);
					if (limit !== void 0) table = table.slice(0, limit);
					return table || [];
				},
				count: async ({ model, where }) => {
					if (where) return convertWhereClause(where, model).length;
					return activeDb[model].length;
				},
				update: async ({ model, where, update }) => {
					if (where.length === 0) return null;
					const res = convertWhereClause(where, model);
					res.forEach((record) => {
						Object.assign(record, update);
					});
					return res[0] || null;
				},
				delete: async ({ model, where }) => {
					if (where.length === 0) return;
					const table = activeDb[model];
					const res = convertWhereClause(where, model);
					activeDb[model] = table.filter((record) => !res.includes(record));
				},
				deleteMany: async ({ model, where }) => {
					const table = activeDb[model];
					const res = convertWhereClause(where, model);
					let count = 0;
					activeDb[model] = table.filter((record) => {
						if (res.includes(record)) {
							count++;
							return false;
						}
						return !res.includes(record);
					});
					return count;
				},
				consumeOne: async ({ model, where }) => {
					const table = activeDb[model];
					const target = convertWhereClause(where, model)[0];
					if (!target) return null;
					activeDb[model] = table.filter((record) => record !== target);
					return target;
				},
				incrementOne: async ({ model, where, increment, set }) => {
					const target = convertWhereClause(where, model)[0];
					if (!target) return null;
					for (const [field, delta] of Object.entries(increment)) target[field] = (typeof target[field] === "number" ? target[field] : 0) + delta;
					if (set) Object.assign(target, set);
					return target;
				},
				updateMany: async ({ model, where, update }) => {
					const res = convertWhereClause(where, model);
					res.forEach((record) => {
						Object.assign(record, update);
					});
					return res.length;
				}
			};
		}
	});
	const adapterCreator = buildAdapterFactory(db);
	return (options) => {
		lazyOptions = options;
		return adapterCreator(options);
	};
};
//#endregion
export { dist_exports as t };
