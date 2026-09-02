import { r as __exportAll } from "../../_runtime.mjs";
import { n as createAdapterFactory, t as capitalizeFirstLetter, yn as logger } from "./core+[...].mjs";
//#region node_modules/kysely/dist/util/object-utils.js
function isUndefined(obj) {
	return typeof obj === "undefined" || obj === void 0;
}
function isString(obj) {
	return typeof obj === "string";
}
function isNumber(obj) {
	return typeof obj === "number";
}
function isBoolean(obj) {
	return typeof obj === "boolean";
}
function isNull(obj) {
	return obj === null;
}
function isDate(obj) {
	return obj instanceof Date;
}
function isBigInt(obj) {
	return typeof obj === "bigint";
}
function isBuffer(obj) {
	return typeof Buffer !== "undefined" && Buffer.isBuffer(obj);
}
function isFunction(obj) {
	return typeof obj === "function";
}
function isObject(obj) {
	return typeof obj === "object" && obj !== null;
}
function freeze(obj) {
	return Object.freeze(obj);
}
function asArray(arg) {
	if (isReadonlyArray(arg)) return arg;
	else return [arg];
}
function isReadonlyArray(arg) {
	return Array.isArray(arg);
}
function noop(obj) {
	return obj;
}
function getMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/alter-table-node.js
/**
* @internal
*/
var AlterTableNode = freeze({
	is(node) {
		return node.kind === "AlterTableNode";
	},
	create(table) {
		return freeze({
			kind: "AlterTableNode",
			table
		});
	},
	cloneWithTableProps(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumnAlteration(node, columnAlteration) {
		return freeze({
			...node,
			columnAlterations: node.columnAlterations ? [...node.columnAlterations, columnAlteration] : [columnAlteration]
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/identifier-node.js
/**
* @internal
*/
var IdentifierNode = freeze({
	is(node) {
		return node.kind === "IdentifierNode";
	},
	create(name) {
		return freeze({
			kind: "IdentifierNode",
			name
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/create-index-node.js
/**
* @internal
*/
var CreateIndexNode = freeze({
	is(node) {
		return node.kind === "CreateIndexNode";
	},
	create(name) {
		return freeze({
			kind: "CreateIndexNode",
			name: IdentifierNode.create(name)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumns(node, columns) {
		return freeze({
			...node,
			columns: [...node.columns || [], ...columns]
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/create-schema-node.js
/**
* @internal
*/
var CreateSchemaNode = freeze({
	is(node) {
		return node.kind === "CreateSchemaNode";
	},
	create(schema, params) {
		return freeze({
			kind: "CreateSchemaNode",
			schema: IdentifierNode.create(schema),
			...params
		});
	},
	cloneWith(createSchema, params) {
		return freeze({
			...createSchema,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/create-table-node.js
var ON_COMMIT_ACTIONS = [
	"preserve rows",
	"delete rows",
	"drop"
];
/**
* @internal
*/
var CreateTableNode = freeze({
	is(node) {
		return node.kind === "CreateTableNode";
	},
	create(table) {
		return freeze({
			kind: "CreateTableNode",
			table,
			columns: freeze([])
		});
	},
	cloneWithColumn(node, column) {
		return freeze({
			...node,
			columns: freeze([...node.columns, column])
		});
	},
	cloneWithConstraint(node, constraint) {
		return freeze({
			...node,
			constraints: node.constraints ? freeze([...node.constraints, constraint]) : freeze([constraint])
		});
	},
	cloneWithIndex(node, index) {
		return freeze({
			...node,
			indexes: node.indexes ? freeze([...node.indexes, index]) : freeze([index])
		});
	},
	cloneWithFrontModifier(node, modifier) {
		return freeze({
			...node,
			frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : freeze([modifier])
		});
	},
	cloneWithEndModifier(node, modifier) {
		return freeze({
			...node,
			endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : freeze([modifier])
		});
	},
	cloneWith(node, params) {
		return freeze({
			...node,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/schemable-identifier-node.js
/**
* @internal
*/
var SchemableIdentifierNode = freeze({
	is(node) {
		return node.kind === "SchemableIdentifierNode";
	},
	create(identifier) {
		return freeze({
			kind: "SchemableIdentifierNode",
			identifier: IdentifierNode.create(identifier)
		});
	},
	createWithSchema(schema, identifier) {
		return freeze({
			kind: "SchemableIdentifierNode",
			schema: IdentifierNode.create(schema),
			identifier: IdentifierNode.create(identifier)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/drop-index-node.js
/**
* @internal
*/
var DropIndexNode = freeze({
	is(node) {
		return node.kind === "DropIndexNode";
	},
	create(name, params) {
		return freeze({
			kind: "DropIndexNode",
			name: SchemableIdentifierNode.create(name),
			...params
		});
	},
	cloneWith(dropIndex, props) {
		return freeze({
			...dropIndex,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/drop-schema-node.js
/**
* @internal
*/
var DropSchemaNode = freeze({
	is(node) {
		return node.kind === "DropSchemaNode";
	},
	create(schema, params) {
		return freeze({
			kind: "DropSchemaNode",
			schema: IdentifierNode.create(schema),
			...params
		});
	},
	cloneWith(dropSchema, params) {
		return freeze({
			...dropSchema,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/drop-table-node.js
/**
* @internal
*/
var DropTableNode = freeze({
	is(node) {
		return node.kind === "DropTableNode";
	},
	create(table, params) {
		return freeze({
			kind: "DropTableNode",
			table,
			...params
		});
	},
	cloneWith(dropIndex, params) {
		return freeze({
			...dropIndex,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/alias-node.js
/**
* @internal
*/
var AliasNode = freeze({
	is(node) {
		return node.kind === "AliasNode";
	},
	create(node, alias) {
		return freeze({
			kind: "AliasNode",
			node,
			alias
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/table-node.js
/**
* @internal
*/
var TableNode = freeze({
	is(node) {
		return node.kind === "TableNode";
	},
	create(table) {
		return freeze({
			kind: "TableNode",
			table: SchemableIdentifierNode.create(table)
		});
	},
	createWithSchema(schema, table) {
		return freeze({
			kind: "TableNode",
			table: SchemableIdentifierNode.createWithSchema(schema, table)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/operation-node-source.js
function isOperationNodeSource(obj) {
	return isObject(obj) && isFunction(obj.toOperationNode);
}
//#endregion
//#region node_modules/kysely/dist/expression/expression.js
function isExpression(obj) {
	return isObject(obj) && "expressionType" in obj && isOperationNodeSource(obj);
}
function isAliasedExpression(obj) {
	return isObject(obj) && "expression" in obj && isString(obj.alias) && isOperationNodeSource(obj);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/select-modifier-node.js
/**
* @internal
*/
var SelectModifierNode = freeze({
	is(node) {
		return node.kind === "SelectModifierNode";
	},
	create(modifier, of) {
		return freeze({
			kind: "SelectModifierNode",
			modifier,
			of
		});
	},
	createWithExpression(modifier) {
		return freeze({
			kind: "SelectModifierNode",
			rawModifier: modifier
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/and-node.js
/**
* @internal
*/
var AndNode = freeze({
	is(node) {
		return node.kind === "AndNode";
	},
	create(left, right) {
		return freeze({
			kind: "AndNode",
			left,
			right
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/or-node.js
/**
* @internal
*/
var OrNode = freeze({
	is(node) {
		return node.kind === "OrNode";
	},
	create(left, right) {
		return freeze({
			kind: "OrNode",
			left,
			right
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/on-node.js
/**
* @internal
*/
var OnNode = freeze({
	is(node) {
		return node.kind === "OnNode";
	},
	create(filter) {
		return freeze({
			kind: "OnNode",
			on: filter
		});
	},
	cloneWithOperation(onNode, operator, operation) {
		return freeze({
			...onNode,
			on: operator === "And" ? AndNode.create(onNode.on, operation) : OrNode.create(onNode.on, operation)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/join-node.js
/**
* @internal
*/
var JoinNode = freeze({
	is(node) {
		return node.kind === "JoinNode";
	},
	create(joinType, table) {
		return freeze({
			kind: "JoinNode",
			joinType,
			table,
			on: void 0
		});
	},
	createWithOn(joinType, table, on) {
		return freeze({
			kind: "JoinNode",
			joinType,
			table,
			on: OnNode.create(on)
		});
	},
	cloneWithOn(joinNode, operation) {
		return freeze({
			...joinNode,
			on: joinNode.on ? OnNode.cloneWithOperation(joinNode.on, "And", operation) : OnNode.create(operation)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/binary-operation-node.js
/**
* @internal
*/
var BinaryOperationNode = freeze({
	is(node) {
		return node.kind === "BinaryOperationNode";
	},
	create(leftOperand, operator, rightOperand) {
		return freeze({
			kind: "BinaryOperationNode",
			leftOperand,
			operator,
			rightOperand
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/operator-node.js
var COMPARISON_OPERATORS_DICTIONARY = freeze({
	"=": true,
	"==": true,
	"!=": true,
	"<>": true,
	">": true,
	">=": true,
	"<": true,
	"<=": true,
	in: true,
	"not in": true,
	is: true,
	"is not": true,
	like: true,
	"not like": true,
	match: true,
	ilike: true,
	"not ilike": true,
	"@>": true,
	"<@": true,
	"^@": true,
	"&&": true,
	"?": true,
	"?&": true,
	"?|": true,
	"!<": true,
	"!>": true,
	"<=>": true,
	"!~": true,
	"~": true,
	"~*": true,
	"!~*": true,
	"@@": true,
	"@@@": true,
	"!!": true,
	"<->": true,
	regexp: true,
	"is distinct from": true,
	"is not distinct from": true
});
Object.keys(COMPARISON_OPERATORS_DICTIONARY);
var ARITHMETIC_OPERATORS_DICTIONARY = freeze({
	"+": true,
	"-": true,
	"*": true,
	"/": true,
	"%": true,
	"^": true,
	"&": true,
	"|": true,
	"#": true,
	"<<": true,
	">>": true
});
Object.keys(ARITHMETIC_OPERATORS_DICTIONARY);
var JSON_OPERATORS_DICTIONARY = freeze({
	"->": true,
	"->>": true
});
/**
* @deprecated will be removed in version 0.30.x
*/
var JSON_OPERATORS = Object.keys(JSON_OPERATORS_DICTIONARY);
var BINARY_OPERATORS_DICTIONARY = freeze({
	...COMPARISON_OPERATORS_DICTIONARY,
	...ARITHMETIC_OPERATORS_DICTIONARY,
	"||": true
});
/**
* @deprecated will be removed in version 0.30.x
*/
var BINARY_OPERATORS = Object.keys(BINARY_OPERATORS_DICTIONARY);
var UNARY_FILTER_OPERATORS_DICTIONARY = freeze({
	exists: true,
	"not exists": true
});
Object.keys(UNARY_FILTER_OPERATORS_DICTIONARY);
var UNARY_OPERATORS_DICTIONARY = freeze({
	...UNARY_FILTER_OPERATORS_DICTIONARY,
	"-": true,
	not: true
});
/**
* @deprecated will be removed in version 0.30.x
*/
var UNARY_OPERATORS = Object.keys(UNARY_OPERATORS_DICTIONARY);
[
	...BINARY_OPERATORS,
	...JSON_OPERATORS,
	...UNARY_OPERATORS
];
/**
* @internal
*/
var OperatorNode = freeze({
	is(node) {
		return node.kind === "OperatorNode";
	},
	create(operator) {
		return freeze({
			kind: "OperatorNode",
			operator
		});
	}
});
function isBinaryOperator(op) {
	return isString(op) && BINARY_OPERATORS_DICTIONARY[op];
}
function isJSONOperator(op) {
	return isString(op) && JSON_OPERATORS_DICTIONARY[op];
}
function isUnaryOperator(op) {
	return isString(op) && UNARY_OPERATORS_DICTIONARY[op];
}
//#endregion
//#region node_modules/kysely/dist/operation-node/column-node.js
/**
* @internal
*/
var ColumnNode = freeze({
	is(node) {
		return node.kind === "ColumnNode";
	},
	create(column) {
		return freeze({
			kind: "ColumnNode",
			column: IdentifierNode.create(column)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/select-all-node.js
/**
* @internal
*/
var SelectAllNode = freeze({
	is(node) {
		return node.kind === "SelectAllNode";
	},
	create() {
		return freeze({ kind: "SelectAllNode" });
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/reference-node.js
/**
* @internal
*/
var ReferenceNode = freeze({
	is(node) {
		return node.kind === "ReferenceNode";
	},
	create(column, table) {
		return freeze({
			kind: "ReferenceNode",
			table,
			column
		});
	},
	createSelectAll(table) {
		return freeze({
			kind: "ReferenceNode",
			table,
			column: SelectAllNode.create()
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/dynamic/dynamic-reference-builder.js
var DynamicReferenceBuilder = class {
	#dynamicReference;
	get dynamicReference() {
		return this.#dynamicReference;
	}
	/**
	* @private
	*
	* This needs to be here just so that the typings work. Without this
	* the generated .d.ts file contains no reference to the type param R
	* which causes this type to be equal to DynamicReferenceBuilder with
	* any R.
	*/
	get refType() {}
	constructor(reference) {
		this.#dynamicReference = reference;
	}
	toOperationNode() {
		return parseSimpleReferenceExpression(this.#dynamicReference);
	}
};
function isDynamicReferenceBuilder(obj) {
	return isObject(obj) && isOperationNodeSource(obj) && isString(obj.dynamicReference);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/order-by-item-node.js
/**
* @internal
*/
var OrderByItemNode = freeze({
	is(node) {
		return node.kind === "OrderByItemNode";
	},
	create(orderBy, direction) {
		return freeze({
			kind: "OrderByItemNode",
			orderBy,
			direction
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/raw-node.js
/**
* @internal
*/
var RawNode = freeze({
	is(node) {
		return node.kind === "RawNode";
	},
	create(sqlFragments, parameters) {
		return freeze({
			kind: "RawNode",
			sqlFragments: freeze(sqlFragments),
			parameters: freeze(parameters)
		});
	},
	createWithSql(sql) {
		return RawNode.create([sql], []);
	},
	createWithChild(child) {
		return RawNode.create(["", ""], [child]);
	},
	createWithChildren(children) {
		return RawNode.create(new Array(children.length + 1).fill(""), children);
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/collate-node.js
/**
* @internal
*/
var CollateNode = freeze({
	is(node) {
		return node.kind === "CollateNode";
	},
	create(collation) {
		return freeze({
			kind: "CollateNode",
			collation: IdentifierNode.create(collation)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/order-by-item-builder.js
var OrderByItemBuilder = class OrderByItemBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds `desc` to the `order by` item.
	*
	* See {@link asc} for the opposite.
	*/
	desc() {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { direction: RawNode.createWithSql("desc") }) });
	}
	/**
	* Adds `asc` to the `order by` item.
	*
	* See {@link desc} for the opposite.
	*/
	asc() {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { direction: RawNode.createWithSql("asc") }) });
	}
	/**
	* Adds `nulls last` to the `order by` item.
	*
	* This is only supported by some dialects like PostgreSQL and SQLite.
	*
	* See {@link nullsFirst} for the opposite.
	*/
	nullsLast() {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { nulls: "last" }) });
	}
	/**
	* Adds `nulls first` to the `order by` item.
	*
	* This is only supported by some dialects like PostgreSQL and SQLite.
	*
	* See {@link nullsLast} for the opposite.
	*/
	nullsFirst() {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { nulls: "first" }) });
	}
	/**
	* Adds `collate <collationName>` to the `order by` item.
	*/
	collate(collation) {
		return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { collation: CollateNode.create(collation) }) });
	}
	toOperationNode() {
		return this.#props.node;
	}
};
//#endregion
//#region node_modules/kysely/dist/util/log-once.js
var LOGGED_MESSAGES = /* @__PURE__ */ new Set();
/**
* Use for system-level logging, such as deprecation messages.
* Logs a message and ensures it won't be logged again.
*/
function logOnce(message) {
	if (LOGGED_MESSAGES.has(message)) return;
	LOGGED_MESSAGES.add(message);
	console.log(message);
}
//#endregion
//#region node_modules/kysely/dist/parser/order-by-parser.js
function isOrderByDirection(thing) {
	return thing === "asc" || thing === "desc";
}
function parseOrderBy(args) {
	if (args.length === 2) return [parseOrderByItem(args[0], args[1])];
	if (args.length === 1) {
		const [orderBy] = args;
		if (Array.isArray(orderBy)) {
			logOnce("orderBy(array) is deprecated, use multiple orderBy calls instead.");
			return orderBy.map((item) => parseOrderByItem(item));
		}
		return [parseOrderByItem(orderBy)];
	}
	throw new Error(`Invalid number of arguments at order by! expected 1-2, received ${args.length}`);
}
function parseOrderByItem(expr, modifiers) {
	const parsedRef = parseOrderByExpression(expr);
	if (OrderByItemNode.is(parsedRef)) {
		if (modifiers) throw new Error("Cannot specify direction twice!");
		return parsedRef;
	}
	return parseOrderByWithModifiers(parsedRef, modifiers);
}
function parseOrderByExpression(expr) {
	if (isExpressionOrFactory(expr)) return parseExpression(expr);
	if (isDynamicReferenceBuilder(expr)) return expr.toOperationNode();
	const [ref, direction] = expr.split(" ");
	if (direction) {
		logOnce("`orderBy('column asc')` is deprecated. Use `orderBy('column', 'asc')` instead.");
		return parseOrderByWithModifiers(parseStringReference(ref), direction);
	}
	return parseStringReference(expr);
}
function parseOrderByWithModifiers(expr, modifiers) {
	if (typeof modifiers === "string") {
		if (!isOrderByDirection(modifiers)) throw new Error(`Invalid order by direction: ${modifiers}`);
		return OrderByItemNode.create(expr, RawNode.createWithSql(modifiers));
	}
	if (isExpression(modifiers)) {
		logOnce("`orderBy(..., expr)` is deprecated. Use `orderBy(..., 'asc')` or `orderBy(..., (ob) => ...)` instead.");
		return OrderByItemNode.create(expr, modifiers.toOperationNode());
	}
	const node = OrderByItemNode.create(expr);
	if (!modifiers) return node;
	return modifiers(new OrderByItemBuilder({ node })).toOperationNode();
}
//#endregion
//#region node_modules/kysely/dist/operation-node/json-reference-node.js
/**
* @internal
*/
var JSONReferenceNode = freeze({
	is(node) {
		return node.kind === "JSONReferenceNode";
	},
	create(reference, traversal) {
		return freeze({
			kind: "JSONReferenceNode",
			reference,
			traversal
		});
	},
	cloneWithTraversal(node, traversal) {
		return freeze({
			...node,
			traversal
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/json-operator-chain-node.js
/**
* @internal
*/
var JSONOperatorChainNode = freeze({
	is(node) {
		return node.kind === "JSONOperatorChainNode";
	},
	create(operator) {
		return freeze({
			kind: "JSONOperatorChainNode",
			operator,
			values: freeze([])
		});
	},
	cloneWithValue(node, value) {
		return freeze({
			...node,
			values: freeze([...node.values, value])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/json-path-node.js
/**
* @internal
*/
var JSONPathNode = freeze({
	is(node) {
		return node.kind === "JSONPathNode";
	},
	create(inOperator) {
		return freeze({
			kind: "JSONPathNode",
			inOperator,
			pathLegs: freeze([])
		});
	},
	cloneWithLeg(jsonPathNode, pathLeg) {
		return freeze({
			...jsonPathNode,
			pathLegs: freeze([...jsonPathNode.pathLegs, pathLeg])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/reference-parser.js
function parseSimpleReferenceExpression(exp) {
	if (isString(exp)) return parseStringReference(exp);
	return exp.toOperationNode();
}
function parseReferenceExpressionOrList(arg) {
	if (isReadonlyArray(arg)) return arg.map((it) => parseReferenceExpression(it));
	else return [parseReferenceExpression(arg)];
}
function parseReferenceExpression(exp) {
	if (isExpressionOrFactory(exp)) return parseExpression(exp);
	return parseSimpleReferenceExpression(exp);
}
function parseJSONReference(ref, op) {
	if (isJSONOperator(op)) return JSONReferenceNode.create(parseStringReference(ref), JSONOperatorChainNode.create(OperatorNode.create(op)));
	if (op === "->$" || op === "->>$") return JSONReferenceNode.create(parseStringReference(ref), JSONPathNode.create(OperatorNode.create(op.slice(0, -1))));
	throw new Error(`Invalid JSON operator: ${op}`);
}
function parseStringReference(ref) {
	const COLUMN_SEPARATOR = ".";
	if (!ref.includes(COLUMN_SEPARATOR)) return ReferenceNode.create(ColumnNode.create(ref));
	const parts = ref.split(COLUMN_SEPARATOR).map(trim$2);
	if (parts.length === 3) return parseStringReferenceWithTableAndSchema(parts);
	if (parts.length === 2) return parseStringReferenceWithTable(parts);
	throw new Error(`invalid column reference ${ref}`);
}
function parseAliasedStringReference(ref) {
	const ALIAS_SEPARATOR = " as ";
	if (ref.includes(ALIAS_SEPARATOR)) {
		const [columnRef, alias] = ref.split(ALIAS_SEPARATOR).map(trim$2);
		return AliasNode.create(parseStringReference(columnRef), IdentifierNode.create(alias));
	} else return parseStringReference(ref);
}
function parseColumnName(column) {
	return ColumnNode.create(column);
}
function parseOrderedColumnName(column) {
	const ORDER_SEPARATOR = " ";
	if (column.includes(ORDER_SEPARATOR)) {
		const [columnName, order] = column.split(ORDER_SEPARATOR).map(trim$2);
		if (!isOrderByDirection(order)) throw new Error(`invalid order direction "${order}" next to "${columnName}"`);
		return parseOrderBy([columnName, order])[0];
	} else return parseColumnName(column);
}
function parseStringReferenceWithTableAndSchema(parts) {
	const [schema, table, column] = parts;
	return ReferenceNode.create(ColumnNode.create(column), TableNode.createWithSchema(schema, table));
}
function parseStringReferenceWithTable(parts) {
	const [table, column] = parts;
	return ReferenceNode.create(ColumnNode.create(column), TableNode.create(table));
}
function trim$2(str) {
	return str.trim();
}
//#endregion
//#region node_modules/kysely/dist/operation-node/primitive-value-list-node.js
/**
* @internal
*/
var PrimitiveValueListNode = freeze({
	is(node) {
		return node.kind === "PrimitiveValueListNode";
	},
	create(values) {
		return freeze({
			kind: "PrimitiveValueListNode",
			values: freeze([...values])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/value-list-node.js
/**
* @internal
*/
var ValueListNode = freeze({
	is(node) {
		return node.kind === "ValueListNode";
	},
	create(values) {
		return freeze({
			kind: "ValueListNode",
			values: freeze(values)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/value-node.js
/**
* @internal
*/
var ValueNode = freeze({
	is(node) {
		return node.kind === "ValueNode";
	},
	create(value) {
		return freeze({
			kind: "ValueNode",
			value
		});
	},
	createImmediate(value) {
		return freeze({
			kind: "ValueNode",
			value,
			immediate: true
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/value-parser.js
function parseValueExpressionOrList(arg) {
	if (isReadonlyArray(arg)) return parseValueExpressionList(arg);
	return parseValueExpression(arg);
}
function parseValueExpression(exp) {
	if (isExpressionOrFactory(exp)) return parseExpression(exp);
	return ValueNode.create(exp);
}
function isSafeImmediateValue(value) {
	return isNumber(value) || isBoolean(value) || isNull(value);
}
function parseSafeImmediateValue(value) {
	if (!isSafeImmediateValue(value)) throw new Error(`unsafe immediate value ${JSON.stringify(value)}`);
	return ValueNode.createImmediate(value);
}
function parseValueExpressionList(arg) {
	if (arg.some(isExpressionOrFactory)) return ValueListNode.create(arg.map((it) => parseValueExpression(it)));
	return PrimitiveValueListNode.create(arg);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/parens-node.js
/**
* @internal
*/
var ParensNode = freeze({
	is(node) {
		return node.kind === "ParensNode";
	},
	create(node) {
		return freeze({
			kind: "ParensNode",
			node
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/binary-operation-parser.js
function parseValueBinaryOperationOrExpression(args) {
	if (args.length === 3) return parseValueBinaryOperation(args[0], args[1], args[2]);
	else if (args.length === 1) return parseValueExpression(args[0]);
	throw new Error(`invalid arguments: ${JSON.stringify(args)}`);
}
function parseValueBinaryOperation(left, operator, right) {
	if (isIsOperator(operator) && needsIsOperator(right)) return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), ValueNode.createImmediate(right));
	return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), parseValueExpressionOrList(right));
}
function parseReferentialBinaryOperation(left, operator, right) {
	return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), parseReferenceExpression(right));
}
function parseFilterObject(obj, combinator) {
	return parseFilterList(Object.entries(obj).filter(([, v]) => !isUndefined(v)).map(([k, v]) => parseValueBinaryOperation(k, needsIsOperator(v) ? "is" : "=", v)), combinator);
}
function parseFilterList(list, combinator, withParens = true) {
	const combine = combinator === "and" ? AndNode.create : OrNode.create;
	if (list.length === 0) return BinaryOperationNode.create(ValueNode.createImmediate(1), OperatorNode.create("="), ValueNode.createImmediate(combinator === "and" ? 1 : 0));
	let node = toOperationNode(list[0]);
	for (let i = 1; i < list.length; ++i) node = combine(node, toOperationNode(list[i]));
	if (list.length > 1 && withParens) return ParensNode.create(node);
	return node;
}
function isIsOperator(operator) {
	return operator === "is" || operator === "is not";
}
function needsIsOperator(value) {
	return isNull(value) || isBoolean(value);
}
function parseBinaryOperator(operator) {
	if (isBinaryOperator(operator)) return OperatorNode.create(operator);
	if (isOperationNodeSource(operator)) return operator.toOperationNode();
	throw new Error(`invalid operator ${JSON.stringify(operator)}`);
}
function toOperationNode(nodeOrSource) {
	return isOperationNodeSource(nodeOrSource) ? nodeOrSource.toOperationNode() : nodeOrSource;
}
//#endregion
//#region node_modules/kysely/dist/operation-node/order-by-node.js
/**
* @internal
*/
var OrderByNode = freeze({
	is(node) {
		return node.kind === "OrderByNode";
	},
	create(items) {
		return freeze({
			kind: "OrderByNode",
			items: freeze([...items])
		});
	},
	cloneWithItems(orderBy, items) {
		return freeze({
			...orderBy,
			items: freeze([...orderBy.items, ...items])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/partition-by-node.js
/**
* @internal
*/
var PartitionByNode = freeze({
	is(node) {
		return node.kind === "PartitionByNode";
	},
	create(items) {
		return freeze({
			kind: "PartitionByNode",
			items: freeze(items)
		});
	},
	cloneWithItems(partitionBy, items) {
		return freeze({
			...partitionBy,
			items: freeze([...partitionBy.items, ...items])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/over-node.js
/**
* @internal
*/
var OverNode = freeze({
	is(node) {
		return node.kind === "OverNode";
	},
	create() {
		return freeze({ kind: "OverNode" });
	},
	cloneWithOrderByItems(overNode, items) {
		return freeze({
			...overNode,
			orderBy: overNode.orderBy ? OrderByNode.cloneWithItems(overNode.orderBy, items) : OrderByNode.create(items)
		});
	},
	cloneWithPartitionByItems(overNode, items) {
		return freeze({
			...overNode,
			partitionBy: overNode.partitionBy ? PartitionByNode.cloneWithItems(overNode.partitionBy, items) : PartitionByNode.create(items)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/from-node.js
/**
* @internal
*/
var FromNode = freeze({
	is(node) {
		return node.kind === "FromNode";
	},
	create(froms) {
		return freeze({
			kind: "FromNode",
			froms: freeze(froms)
		});
	},
	cloneWithFroms(from, froms) {
		return freeze({
			...from,
			froms: freeze([...from.froms, ...froms])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/group-by-node.js
/**
* @internal
*/
var GroupByNode = freeze({
	is(node) {
		return node.kind === "GroupByNode";
	},
	create(items) {
		return freeze({
			kind: "GroupByNode",
			items: freeze(items)
		});
	},
	cloneWithItems(groupBy, items) {
		return freeze({
			...groupBy,
			items: freeze([...groupBy.items, ...items])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/having-node.js
/**
* @internal
*/
var HavingNode = freeze({
	is(node) {
		return node.kind === "HavingNode";
	},
	create(filter) {
		return freeze({
			kind: "HavingNode",
			having: filter
		});
	},
	cloneWithOperation(havingNode, operator, operation) {
		return freeze({
			...havingNode,
			having: operator === "And" ? AndNode.create(havingNode.having, operation) : OrNode.create(havingNode.having, operation)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/insert-query-node.js
/**
* @internal
*/
var InsertQueryNode = freeze({
	is(node) {
		return node.kind === "InsertQueryNode";
	},
	create(into, withNode, replace) {
		return freeze({
			kind: "InsertQueryNode",
			into,
			...withNode && { with: withNode },
			replace
		});
	},
	createWithoutInto() {
		return freeze({ kind: "InsertQueryNode" });
	},
	cloneWith(insertQuery, props) {
		return freeze({
			...insertQuery,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/list-node.js
/**
* @internal
*/
var ListNode = freeze({
	is(node) {
		return node.kind === "ListNode";
	},
	create(items) {
		return freeze({
			kind: "ListNode",
			items: freeze(items)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/update-query-node.js
/**
* @internal
*/
var UpdateQueryNode = freeze({
	is(node) {
		return node.kind === "UpdateQueryNode";
	},
	create(tables, withNode) {
		return freeze({
			kind: "UpdateQueryNode",
			table: tables.length === 1 ? tables[0] : ListNode.create(tables),
			...withNode && { with: withNode }
		});
	},
	createWithoutTable() {
		return freeze({ kind: "UpdateQueryNode" });
	},
	cloneWithFromItems(updateQuery, fromItems) {
		return freeze({
			...updateQuery,
			from: updateQuery.from ? FromNode.cloneWithFroms(updateQuery.from, fromItems) : FromNode.create(fromItems)
		});
	},
	cloneWithUpdates(updateQuery, updates) {
		return freeze({
			...updateQuery,
			updates: updateQuery.updates ? freeze([...updateQuery.updates, ...updates]) : updates
		});
	},
	cloneWithLimit(updateQuery, limit) {
		return freeze({
			...updateQuery,
			limit
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/using-node.js
/**
* @internal
*/
var UsingNode = freeze({
	is(node) {
		return node.kind === "UsingNode";
	},
	create(tables) {
		return freeze({
			kind: "UsingNode",
			tables: freeze(tables)
		});
	},
	cloneWithTables(using, tables) {
		return freeze({
			...using,
			tables: freeze([...using.tables, ...tables])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/delete-query-node.js
/**
* @internal
*/
var DeleteQueryNode = freeze({
	is(node) {
		return node.kind === "DeleteQueryNode";
	},
	create(fromItems, withNode) {
		return freeze({
			kind: "DeleteQueryNode",
			from: FromNode.create(fromItems),
			...withNode && { with: withNode }
		});
	},
	/**
	* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
	*/
	cloneWithOrderByItems: (node, items) => QueryNode.cloneWithOrderByItems(node, items),
	/**
	* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
	*/
	cloneWithoutOrderBy: (node) => QueryNode.cloneWithoutOrderBy(node),
	cloneWithLimit(deleteNode, limit) {
		return freeze({
			...deleteNode,
			limit
		});
	},
	cloneWithoutLimit(deleteNode) {
		return freeze({
			...deleteNode,
			limit: void 0
		});
	},
	cloneWithUsing(deleteNode, tables) {
		return freeze({
			...deleteNode,
			using: deleteNode.using !== void 0 ? UsingNode.cloneWithTables(deleteNode.using, tables) : UsingNode.create(tables)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/where-node.js
/**
* @internal
*/
var WhereNode = freeze({
	is(node) {
		return node.kind === "WhereNode";
	},
	create(filter) {
		return freeze({
			kind: "WhereNode",
			where: filter
		});
	},
	cloneWithOperation(whereNode, operator, operation) {
		return freeze({
			...whereNode,
			where: operator === "And" ? AndNode.create(whereNode.where, operation) : OrNode.create(whereNode.where, operation)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/returning-node.js
/**
* @internal
*/
var ReturningNode = freeze({
	is(node) {
		return node.kind === "ReturningNode";
	},
	create(selections) {
		return freeze({
			kind: "ReturningNode",
			selections: freeze(selections)
		});
	},
	cloneWithSelections(returning, selections) {
		return freeze({
			...returning,
			selections: returning.selections ? freeze([...returning.selections, ...selections]) : freeze(selections)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/explain-node.js
/**
* @internal
*/
var ExplainNode = freeze({
	is(node) {
		return node.kind === "ExplainNode";
	},
	create(format, options) {
		return freeze({
			kind: "ExplainNode",
			format,
			options
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/when-node.js
/**
* @internal
*/
var WhenNode = freeze({
	is(node) {
		return node.kind === "WhenNode";
	},
	create(condition) {
		return freeze({
			kind: "WhenNode",
			condition
		});
	},
	cloneWithResult(whenNode, result) {
		return freeze({
			...whenNode,
			result
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/merge-query-node.js
/**
* @internal
*/
var MergeQueryNode = freeze({
	is(node) {
		return node.kind === "MergeQueryNode";
	},
	create(into, withNode) {
		return freeze({
			kind: "MergeQueryNode",
			into,
			...withNode && { with: withNode }
		});
	},
	cloneWithUsing(mergeNode, using) {
		return freeze({
			...mergeNode,
			using
		});
	},
	cloneWithWhen(mergeNode, when) {
		return freeze({
			...mergeNode,
			whens: mergeNode.whens ? freeze([...mergeNode.whens, when]) : freeze([when])
		});
	},
	cloneWithThen(mergeNode, then) {
		return freeze({
			...mergeNode,
			whens: mergeNode.whens ? freeze([...mergeNode.whens.slice(0, -1), WhenNode.cloneWithResult(mergeNode.whens[mergeNode.whens.length - 1], then)]) : void 0
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/output-node.js
/**
* @internal
*/
var OutputNode = freeze({
	is(node) {
		return node.kind === "OutputNode";
	},
	create(selections) {
		return freeze({
			kind: "OutputNode",
			selections: freeze(selections)
		});
	},
	cloneWithSelections(output, selections) {
		return freeze({
			...output,
			selections: output.selections ? freeze([...output.selections, ...selections]) : freeze(selections)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/query-node.js
/**
* @internal
*/
var QueryNode = freeze({
	is(node) {
		return SelectQueryNode.is(node) || InsertQueryNode.is(node) || UpdateQueryNode.is(node) || DeleteQueryNode.is(node) || MergeQueryNode.is(node);
	},
	cloneWithEndModifier(node, modifier) {
		return freeze({
			...node,
			endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : freeze([modifier])
		});
	},
	cloneWithWhere(node, operation) {
		return freeze({
			...node,
			where: node.where ? WhereNode.cloneWithOperation(node.where, "And", operation) : WhereNode.create(operation)
		});
	},
	cloneWithJoin(node, join) {
		return freeze({
			...node,
			joins: node.joins ? freeze([...node.joins, join]) : freeze([join])
		});
	},
	cloneWithReturning(node, selections) {
		return freeze({
			...node,
			returning: node.returning ? ReturningNode.cloneWithSelections(node.returning, selections) : ReturningNode.create(selections)
		});
	},
	cloneWithoutReturning(node) {
		return freeze({
			...node,
			returning: void 0
		});
	},
	cloneWithoutWhere(node) {
		return freeze({
			...node,
			where: void 0
		});
	},
	cloneWithExplain(node, format, options) {
		return freeze({
			...node,
			explain: ExplainNode.create(format, options?.toOperationNode())
		});
	},
	cloneWithTop(node, top) {
		return freeze({
			...node,
			top
		});
	},
	cloneWithOutput(node, selections) {
		return freeze({
			...node,
			output: node.output ? OutputNode.cloneWithSelections(node.output, selections) : OutputNode.create(selections)
		});
	},
	cloneWithOrderByItems(node, items) {
		return freeze({
			...node,
			orderBy: node.orderBy ? OrderByNode.cloneWithItems(node.orderBy, items) : OrderByNode.create(items)
		});
	},
	cloneWithoutOrderBy(node) {
		return freeze({
			...node,
			orderBy: void 0
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/select-query-node.js
/**
* @internal
*/
var SelectQueryNode = freeze({
	is(node) {
		return node.kind === "SelectQueryNode";
	},
	create(withNode) {
		return freeze({
			kind: "SelectQueryNode",
			...withNode && { with: withNode }
		});
	},
	createFrom(fromItems, withNode) {
		return freeze({
			kind: "SelectQueryNode",
			from: FromNode.create(fromItems),
			...withNode && { with: withNode }
		});
	},
	cloneWithSelections(select, selections) {
		return freeze({
			...select,
			selections: select.selections ? freeze([...select.selections, ...selections]) : freeze(selections)
		});
	},
	cloneWithDistinctOn(select, expressions) {
		return freeze({
			...select,
			distinctOn: select.distinctOn ? freeze([...select.distinctOn, ...expressions]) : freeze(expressions)
		});
	},
	cloneWithFrontModifier(select, modifier) {
		return freeze({
			...select,
			frontModifiers: select.frontModifiers ? freeze([...select.frontModifiers, modifier]) : freeze([modifier])
		});
	},
	/**
	* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
	*/
	cloneWithOrderByItems: (node, items) => QueryNode.cloneWithOrderByItems(node, items),
	cloneWithGroupByItems(selectNode, items) {
		return freeze({
			...selectNode,
			groupBy: selectNode.groupBy ? GroupByNode.cloneWithItems(selectNode.groupBy, items) : GroupByNode.create(items)
		});
	},
	cloneWithLimit(selectNode, limit) {
		return freeze({
			...selectNode,
			limit
		});
	},
	cloneWithOffset(selectNode, offset) {
		return freeze({
			...selectNode,
			offset
		});
	},
	cloneWithFetch(selectNode, fetch) {
		return freeze({
			...selectNode,
			fetch
		});
	},
	cloneWithHaving(selectNode, operation) {
		return freeze({
			...selectNode,
			having: selectNode.having ? HavingNode.cloneWithOperation(selectNode.having, "And", operation) : HavingNode.create(operation)
		});
	},
	cloneWithSetOperations(selectNode, setOperations) {
		return freeze({
			...selectNode,
			setOperations: selectNode.setOperations ? freeze([...selectNode.setOperations, ...setOperations]) : freeze([...setOperations])
		});
	},
	cloneWithoutSelections(select) {
		return freeze({
			...select,
			selections: []
		});
	},
	cloneWithoutLimit(select) {
		return freeze({
			...select,
			limit: void 0
		});
	},
	cloneWithoutOffset(select) {
		return freeze({
			...select,
			offset: void 0
		});
	},
	/**
	* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
	*/
	cloneWithoutOrderBy: (node) => QueryNode.cloneWithoutOrderBy(node),
	cloneWithoutGroupBy(select) {
		return freeze({
			...select,
			groupBy: void 0
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/join-builder.js
var JoinBuilder = class JoinBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	on(...args) {
		return new JoinBuilder({
			...this.#props,
			joinNode: JoinNode.cloneWithOn(this.#props.joinNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	/**
	* Just like {@link WhereInterface.whereRef} but adds an item to the join's
	* `on` clause instead.
	*
	* See {@link WhereInterface.whereRef} for documentation and examples.
	*/
	onRef(lhs, op, rhs) {
		return new JoinBuilder({
			...this.#props,
			joinNode: JoinNode.cloneWithOn(this.#props.joinNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	/**
	* Adds `on true`.
	*/
	onTrue() {
		return new JoinBuilder({
			...this.#props,
			joinNode: JoinNode.cloneWithOn(this.#props.joinNode, RawNode.createWithSql("true"))
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.joinNode;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/partition-by-item-node.js
/**
* @internal
*/
var PartitionByItemNode = freeze({
	is(node) {
		return node.kind === "PartitionByItemNode";
	},
	create(partitionBy) {
		return freeze({
			kind: "PartitionByItemNode",
			partitionBy
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/partition-by-parser.js
function parsePartitionBy(partitionBy) {
	return parseReferenceExpressionOrList(partitionBy).map(PartitionByItemNode.create);
}
//#endregion
//#region node_modules/kysely/dist/query-builder/over-builder.js
var OverBuilder = class OverBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	orderBy(...args) {
		return new OverBuilder({ overNode: OverNode.cloneWithOrderByItems(this.#props.overNode, parseOrderBy(args)) });
	}
	clearOrderBy() {
		return new OverBuilder({ overNode: QueryNode.cloneWithoutOrderBy(this.#props.overNode) });
	}
	partitionBy(partitionBy) {
		return new OverBuilder({ overNode: OverNode.cloneWithPartitionByItems(this.#props.overNode, parsePartitionBy(partitionBy)) });
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.overNode;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/selection-node.js
/**
* @internal
*/
var SelectionNode = freeze({
	is(node) {
		return node.kind === "SelectionNode";
	},
	create(selection) {
		return freeze({
			kind: "SelectionNode",
			selection
		});
	},
	createSelectAll() {
		return freeze({
			kind: "SelectionNode",
			selection: SelectAllNode.create()
		});
	},
	createSelectAllFromTable(table) {
		return freeze({
			kind: "SelectionNode",
			selection: ReferenceNode.createSelectAll(table)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/select-parser.js
function parseSelectArg(selection) {
	if (isFunction(selection)) return parseSelectArg(selection(expressionBuilder()));
	else if (isReadonlyArray(selection)) return selection.map((it) => parseSelectExpression(it));
	else return [parseSelectExpression(selection)];
}
function parseSelectExpression(selection) {
	if (isString(selection)) return SelectionNode.create(parseAliasedStringReference(selection));
	else if (isDynamicReferenceBuilder(selection)) return SelectionNode.create(selection.toOperationNode());
	else return SelectionNode.create(parseAliasedExpression(selection));
}
function parseSelectAll(table) {
	if (!table) return [SelectionNode.createSelectAll()];
	else if (Array.isArray(table)) return table.map(parseSelectAllArg);
	else return [parseSelectAllArg(table)];
}
function parseSelectAllArg(table) {
	if (isString(table)) return SelectionNode.createSelectAllFromTable(parseTable(table));
	throw new Error(`invalid value selectAll expression: ${JSON.stringify(table)}`);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/values-node.js
/**
* @internal
*/
var ValuesNode = freeze({
	is(node) {
		return node.kind === "ValuesNode";
	},
	create(values) {
		return freeze({
			kind: "ValuesNode",
			values: freeze(values)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/default-insert-value-node.js
/**
* @internal
*/
var DefaultInsertValueNode = freeze({
	is(node) {
		return node.kind === "DefaultInsertValueNode";
	},
	create() {
		return freeze({ kind: "DefaultInsertValueNode" });
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/insert-values-parser.js
function parseInsertExpression(arg) {
	const objectOrList = isFunction(arg) ? arg(expressionBuilder()) : arg;
	return parseInsertColumnsAndValues(isReadonlyArray(objectOrList) ? objectOrList : freeze([objectOrList]));
}
function parseInsertColumnsAndValues(rows) {
	const columns = parseColumnNamesAndIndexes(rows);
	return [freeze([...columns.keys()].map(ColumnNode.create)), ValuesNode.create(rows.map((row) => parseRowValues(row, columns)))];
}
function parseColumnNamesAndIndexes(rows) {
	const columns = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const cols = Object.keys(row);
		for (const col of cols) if (!columns.has(col) && row[col] !== void 0) columns.set(col, columns.size);
	}
	return columns;
}
function parseRowValues(row, columns) {
	const rowColumns = Object.keys(row);
	const rowValues = Array.from({ length: columns.size });
	let hasUndefinedOrComplexColumns = false;
	let indexedRowColumns = rowColumns.length;
	for (const col of rowColumns) {
		const columnIdx = columns.get(col);
		if (isUndefined(columnIdx)) {
			indexedRowColumns--;
			continue;
		}
		const value = row[col];
		if (isUndefined(value) || isExpressionOrFactory(value)) hasUndefinedOrComplexColumns = true;
		rowValues[columnIdx] = value;
	}
	if (indexedRowColumns < columns.size || hasUndefinedOrComplexColumns) {
		const defaultValue = DefaultInsertValueNode.create();
		return ValueListNode.create(rowValues.map((it) => isUndefined(it) ? defaultValue : parseValueExpression(it)));
	}
	return PrimitiveValueListNode.create(rowValues);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/column-update-node.js
/**
* @internal
*/
var ColumnUpdateNode = freeze({
	is(node) {
		return node.kind === "ColumnUpdateNode";
	},
	create(column, value) {
		return freeze({
			kind: "ColumnUpdateNode",
			column,
			value
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/update-set-parser.js
function parseUpdate(...args) {
	if (args.length === 2) return [ColumnUpdateNode.create(parseReferenceExpression(args[0]), parseValueExpression(args[1]))];
	return parseUpdateObjectExpression(args[0]);
}
function parseUpdateObjectExpression(update) {
	const updateObj = isFunction(update) ? update(expressionBuilder()) : update;
	return Object.entries(updateObj).filter(([_, value]) => value !== void 0).map(([key, value]) => {
		return ColumnUpdateNode.create(ColumnNode.create(key), parseValueExpression(value));
	});
}
//#endregion
//#region node_modules/kysely/dist/operation-node/on-duplicate-key-node.js
/**
* @internal
*/
var OnDuplicateKeyNode = freeze({
	is(node) {
		return node.kind === "OnDuplicateKeyNode";
	},
	create(updates) {
		return freeze({
			kind: "OnDuplicateKeyNode",
			updates
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/insert-result.js
/**
* The result of an insert query.
*
* If the table has an auto incrementing primary key {@link insertId} will hold
* the generated id on dialects that support it. For example PostgreSQL doesn't
* return the id by default and {@link insertId} is undefined. On PostgreSQL you
* need to use {@link ReturningInterface.returning} or {@link ReturningInterface.returningAll}
* to get out the inserted id.
*
* {@link numInsertedOrUpdatedRows} holds the number of (actually) inserted rows.
* On MySQL, updated rows are counted twice when using `on duplicate key update`.
*
* ### Examples
*
* ```ts
* import type { NewPerson } from 'type-editor' // imaginary module
*
* async function insertPerson(person: NewPerson) {
*   const result = await db
*     .insertInto('person')
*     .values(person)
*     .executeTakeFirstOrThrow()
*
*   console.log(result.insertId) // relevant on MySQL
*   console.log(result.numInsertedOrUpdatedRows) // always relevant
* }
* ```
*/
var InsertResult = class {
	/**
	* The auto incrementing primary key of the inserted row.
	*
	* This property can be undefined when the query contains an `on conflict`
	* clause that makes the query succeed even when nothing gets inserted.
	*
	* This property is always undefined on dialects like PostgreSQL that
	* don't return the inserted id by default. On those dialects you need
	* to use the {@link ReturningInterface.returning | returning} method.
	*/
	insertId;
	/**
	* Affected rows count.
	*/
	numInsertedOrUpdatedRows;
	constructor(insertId, numInsertedOrUpdatedRows) {
		this.insertId = insertId;
		this.numInsertedOrUpdatedRows = numInsertedOrUpdatedRows;
	}
};
//#endregion
//#region node_modules/kysely/dist/query-builder/no-result-error.js
var NoResultError = class extends Error {
	/**
	* The operation node tree of the query that was executed.
	*/
	node;
	constructor(node) {
		super("no result");
		this.node = node;
	}
};
function isNoResultErrorConstructor(fn) {
	return Object.prototype.hasOwnProperty.call(fn, "prototype");
}
//#endregion
//#region node_modules/kysely/dist/operation-node/on-conflict-node.js
/**
* @internal
*/
var OnConflictNode = freeze({
	is(node) {
		return node.kind === "OnConflictNode";
	},
	create() {
		return freeze({ kind: "OnConflictNode" });
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithIndexWhere(node, operation) {
		return freeze({
			...node,
			indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "And", operation) : WhereNode.create(operation)
		});
	},
	cloneWithIndexOrWhere(node, operation) {
		return freeze({
			...node,
			indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "Or", operation) : WhereNode.create(operation)
		});
	},
	cloneWithUpdateWhere(node, operation) {
		return freeze({
			...node,
			updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "And", operation) : WhereNode.create(operation)
		});
	},
	cloneWithUpdateOrWhere(node, operation) {
		return freeze({
			...node,
			updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "Or", operation) : WhereNode.create(operation)
		});
	},
	cloneWithoutIndexWhere(node) {
		return freeze({
			...node,
			indexWhere: void 0
		});
	},
	cloneWithoutUpdateWhere(node) {
		return freeze({
			...node,
			updateWhere: void 0
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/on-conflict-builder.js
var OnConflictBuilder = class OnConflictBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Specify a single column as the conflict target.
	*
	* Also see the {@link columns}, {@link constraint} and {@link expression}
	* methods for alternative ways to specify the conflict target.
	*/
	column(column) {
		const columnNode = ColumnNode.create(column);
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { columns: this.#props.onConflictNode.columns ? freeze([...this.#props.onConflictNode.columns, columnNode]) : freeze([columnNode]) })
		});
	}
	/**
	* Specify a list of columns as the conflict target.
	*
	* Also see the {@link column}, {@link constraint} and {@link expression}
	* methods for alternative ways to specify the conflict target.
	*/
	columns(columns) {
		const columnNodes = columns.map(ColumnNode.create);
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { columns: this.#props.onConflictNode.columns ? freeze([...this.#props.onConflictNode.columns, ...columnNodes]) : freeze(columnNodes) })
		});
	}
	/**
	* Specify a specific constraint by name as the conflict target.
	*
	* Also see the {@link column}, {@link columns} and {@link expression}
	* methods for alternative ways to specify the conflict target.
	*/
	constraint(constraintName) {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { constraint: IdentifierNode.create(constraintName) })
		});
	}
	/**
	* Specify an expression as the conflict target.
	*
	* This can be used if the unique index is an expression index.
	*
	* Also see the {@link column}, {@link columns} and {@link constraint}
	* methods for alternative ways to specify the conflict target.
	*/
	expression(expression) {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { indexExpression: expression.toOperationNode() })
		});
	}
	where(...args) {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithIndexWhere(this.#props.onConflictNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	whereRef(lhs, op, rhs) {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithIndexWhere(this.#props.onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	clearWhere() {
		return new OnConflictBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithoutIndexWhere(this.#props.onConflictNode)
		});
	}
	/**
	* Adds the "do nothing" conflict action.
	*
	* ### Examples
	*
	* ```ts
	* const id = 1
	* const first_name = 'John'
	*
	* await db
	*   .insertInto('person')
	*   .values({ first_name, id })
	*   .onConflict((oc) => oc
	*     .column('id')
	*     .doNothing()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "id")
	* values ($1, $2)
	* on conflict ("id") do nothing
	* ```
	*/
	doNothing() {
		return new OnConflictDoNothingBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { doNothing: true })
		});
	}
	/**
	* Adds the "do update set" conflict action.
	*
	* ### Examples
	*
	* ```ts
	* const id = 1
	* const first_name = 'John'
	*
	* await db
	*   .insertInto('person')
	*   .values({ first_name, id })
	*   .onConflict((oc) => oc
	*     .column('id')
	*     .doUpdateSet({ first_name })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "id")
	* values ($1, $2)
	* on conflict ("id")
	* do update set "first_name" = $3
	* ```
	*
	* In the next example we use the `ref` method to reference
	* columns of the virtual table `excluded` in a type-safe way
	* to create an upsert operation:
	*
	* ```ts
	* import type { NewPerson } from 'type-editor' // imaginary module
	*
	* async function upsertPerson(person: NewPerson): Promise<void> {
	*   await db.insertInto('person')
	*     .values(person)
	*     .onConflict((oc) => oc
	*       .column('id')
	*       .doUpdateSet((eb) => ({
	*         first_name: eb.ref('excluded.first_name'),
	*         last_name: eb.ref('excluded.last_name')
	*       })
	*     )
	*   )
	*   .execute()
	* }
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name")
	* values ($1, $2)
	* on conflict ("id")
	* do update set
	*  "first_name" = excluded."first_name",
	*  "last_name" = excluded."last_name"
	* ```
	*/
	doUpdateSet(update) {
		return new OnConflictUpdateBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { updates: parseUpdateObjectExpression(update) })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
};
var OnConflictDoNothingBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.onConflictNode;
	}
};
var OnConflictUpdateBuilder = class OnConflictUpdateBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	where(...args) {
		return new OnConflictUpdateBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithUpdateWhere(this.#props.onConflictNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	/**
	* Specify a where condition for the update operation.
	*
	* See {@link WhereInterface.whereRef} for more info.
	*/
	whereRef(lhs, op, rhs) {
		return new OnConflictUpdateBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithUpdateWhere(this.#props.onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	clearWhere() {
		return new OnConflictUpdateBuilder({
			...this.#props,
			onConflictNode: OnConflictNode.cloneWithoutUpdateWhere(this.#props.onConflictNode)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.onConflictNode;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/top-node.js
/**
* @internal
*/
var TopNode = freeze({
	is(node) {
		return node.kind === "TopNode";
	},
	create(expression, modifiers) {
		return freeze({
			kind: "TopNode",
			expression,
			modifiers
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/top-parser.js
function parseTop(expression, modifiers) {
	if (!isNumber(expression) && !isBigInt(expression)) throw new Error(`Invalid top expression: ${expression}`);
	if (!isUndefined(modifiers) && !isTopModifiers(modifiers)) throw new Error(`Invalid top modifiers: ${modifiers}`);
	return TopNode.create(expression, modifiers);
}
function isTopModifiers(modifiers) {
	return modifiers === "percent" || modifiers === "with ties" || modifiers === "percent with ties";
}
//#endregion
//#region node_modules/kysely/dist/operation-node/or-action-node.js
/**
* @internal
*/
var OrActionNode = freeze({
	is(node) {
		return node.kind === "OrActionNode";
	},
	create(action) {
		return freeze({
			kind: "OrActionNode",
			action
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/insert-query-builder.js
var InsertQueryBuilder = class InsertQueryBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Sets the values to insert for an {@link Kysely.insertInto | insert} query.
	*
	* This method takes an object whose keys are column names and values are
	* values to insert. In addition to the column's type, the values can be
	* raw {@link sql} snippets or select queries.
	*
	* You must provide all fields you haven't explicitly marked as nullable
	* or optional using {@link Generated} or {@link ColumnType}.
	*
	* The return value of an `insert` query is an instance of {@link InsertResult}. The
	* {@link InsertResult.insertId | insertId} field holds the auto incremented primary
	* key if the database returned one.
	*
	* On PostgreSQL and some other dialects, you need to call `returning` to get
	* something out of the query.
	*
	* Also see the {@link expression} method for inserting the result of a select
	* query or any other expression.
	*
	* ### Examples
	*
	* <!-- siteExample("insert", "Single row", 10) -->
	*
	* Insert a single row:
	*
	* ```ts
	* const result = await db
	*   .insertInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston',
	*     age: 40
	*   })
	*   .executeTakeFirst()
	*
	* // `insertId` is only available on dialects that
	* // automatically return the id of the inserted row
	* // such as MySQL and SQLite. On PostgreSQL, for example,
	* // you need to add a `returning` clause to the query to
	* // get anything out. See the "returning data" example.
	* console.log(result.insertId)
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert into `person` (`first_name`, `last_name`, `age`) values (?, ?, ?)
	* ```
	*
	* <!-- siteExample("insert", "Multiple rows", 20) -->
	*
	* On dialects that support it (for example PostgreSQL) you can insert multiple
	* rows by providing an array. Note that the return value is once again very
	* dialect-specific. Some databases may only return the id of the *last* inserted
	* row and some return nothing at all unless you call `returning`.
	*
	* ```ts
	* await db
	*   .insertInto('person')
	*   .values([{
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston',
	*     age: 40,
	*   }, {
	*     first_name: 'Arnold',
	*     last_name: 'Schwarzenegger',
	*     age: 70,
	*   }])
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name", "age") values (($1, $2, $3), ($4, $5, $6))
	* ```
	*
	* <!-- siteExample("insert", "Returning data", 30) -->
	*
	* On supported dialects like PostgreSQL you need to chain `returning` to the query to get
	* the inserted row's columns (or any other expression) as the return value. `returning`
	* works just like `select`. Refer to `select` method's examples and documentation for
	* more info.
	*
	* ```ts
	* const result = await db
	*   .insertInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston',
	*     age: 40,
	*   })
	*   .returning(['id', 'first_name as name'])
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name", "age") values ($1, $2, $3) returning "id", "first_name" as "name"
	* ```
	*
	* <!-- siteExample("insert", "Complex values", 40) -->
	*
	* In addition to primitives, the values can also be arbitrary expressions.
	* You can build the expressions by using a callback and calling the methods
	* on the expression builder passed to it:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* const ani = "Ani"
	* const ston = "ston"
	*
	* const result = await db
	*   .insertInto('person')
	*   .values(({ ref, selectFrom, fn }) => ({
	*     first_name: 'Jennifer',
	*     last_name: sql<string>`concat(${ani}, ${ston})`,
	*     middle_name: ref('first_name'),
	*     age: selectFrom('person')
	*       .select(fn.avg<number>('age').as('avg_age')),
	*   }))
	*   .executeTakeFirst()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" (
	*   "first_name",
	*   "last_name",
	*   "middle_name",
	*   "age"
	* )
	* values (
	*   $1,
	*   concat($2, $3),
	*   "first_name",
	*   (select avg("age") as "avg_age" from "person")
	* )
	* ```
	*
	* You can also use the callback version of subqueries or raw expressions:
	*
	* ```ts
	* await db.with('jennifer', (db) => db
	*   .selectFrom('person')
	*   .where('first_name', '=', 'Jennifer')
	*   .select(['id', 'first_name', 'gender'])
	*   .limit(1)
	* ).insertInto('pet').values((eb) => ({
	*   owner_id: eb.selectFrom('jennifer').select('id'),
	*   name: eb.selectFrom('jennifer').select('first_name'),
	*   species: 'cat',
	* }))
	* .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* with "jennifer" as (
	*   select "id", "first_name", "gender"
	*   from "person"
	*   where "first_name" = $1
	*   limit $2
	* )
	* insert into "pet" ("owner_id", "name", "species")
	* values (
	*  (select "id" from "jennifer"),
	*  (select "first_name" from "jennifer"),
	*  $3
	* )
	* ```
	*/
	values(insert) {
		const [columns, values] = parseInsertExpression(insert);
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
				columns,
				values
			})
		});
	}
	/**
	* Sets the columns to insert.
	*
	* The {@link values} method sets both the columns and the values and this method
	* is not needed. But if you are using the {@link expression} method, you can use
	* this method to set the columns to insert.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .columns(['first_name'])
	*   .expression((eb) => eb.selectFrom('pet').select('pet.name'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name")
	* select "pet"."name" from "pet"
	* ```
	*/
	columns(columns) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { columns: freeze(columns.map(ColumnNode.create)) })
		});
	}
	/**
	* Insert an arbitrary expression. For example the result of a select query.
	*
	* ### Examples
	*
	* <!-- siteExample("insert", "Insert subquery", 50) -->
	*
	* You can create an `INSERT INTO SELECT FROM` query using the `expression` method.
	* This API doesn't follow our WYSIWYG principles and might be a bit difficult to
	* remember. The reasons for this design stem from implementation difficulties.
	*
	* ```ts
	* const result = await db.insertInto('person')
	*   .columns(['first_name', 'last_name', 'age'])
	*   .expression((eb) => eb
	*     .selectFrom('pet')
	*     .select((eb) => [
	*       'pet.name',
	*       eb.val('Petson').as('last_name'),
	*       eb.lit(7).as('age'),
	*     ])
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name", "age")
	* select "pet"."name", $1 as "last_name", 7 as "age from "pet"
	* ```
	*/
	expression(expression) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { values: parseExpression(expression) })
		});
	}
	/**
	* Creates an `insert into "person" default values` query.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .defaultValues()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" default values
	* ```
	*/
	defaultValues() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { defaultValues: true })
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.insertInto('person')
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*   })
	*   .modifyEnd(sql`-- This is a comment`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert into `person` ("first_name", "last_name", "gender")
	* values (?, ?, ?) -- This is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* Changes an `insert into` query to an `insert ignore into` query.
	*
	* This is only supported by some dialects like MySQL.
	*
	* To avoid a footgun, when invoked with the SQLite dialect, this method will
	* be handled like {@link orIgnore}. See also, {@link orAbort}, {@link orFail},
	* {@link orReplace}, and {@link orRollback}.
	*
	* If you use the ignore modifier, ignorable errors that occur while executing the
	* insert statement are ignored. For example, without ignore, a row that duplicates
	* an existing unique index or primary key value in the table causes a duplicate-key
	* error and the statement is aborted. With ignore, the row is discarded and no error
	* occurs.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .ignore()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert ignore into `person` (`first_name`, `last_name`, `gender`) values (?, ?, ?)
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or ignore into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	ignore() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("ignore") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or ignore into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* To avoid a footgun, when invoked with the MySQL dialect, this method will
	* be handled like {@link ignore}.
	*
	* See also, {@link orAbort}, {@link orFail}, {@link orReplace}, and {@link orRollback}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orIgnore()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or ignore into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert ignore into `person` (`first_name`, `last_name`, `gender`) values (?, ?, ?)
	* ```
	*/
	orIgnore() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("ignore") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or abort into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* See also, {@link orIgnore}, {@link orFail}, {@link orReplace}, and {@link orRollback}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orAbort()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or abort into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	orAbort() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("abort") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or fail into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* See also, {@link orIgnore}, {@link orAbort}, {@link orReplace}, and {@link orRollback}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orFail()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or fail into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	orFail() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("fail") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or replace into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* You can also use {@link Kysely.replaceInto} to achieve the same result.
	*
	* See also, {@link orIgnore}, {@link orAbort}, {@link orFail}, and {@link orRollback}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orReplace()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or replace into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	orReplace() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("replace") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert or rollback into` query.
	*
	* This is only supported by some dialects like SQLite.
	*
	* See also, {@link orIgnore}, {@link orAbort}, {@link orFail}, and {@link orReplace}.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .orRollback()
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'female',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* insert or rollback into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
	* ```
	*/
	orRollback() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("rollback") })
		});
	}
	/**
	* Changes an `insert into` query to an `insert top into` query.
	*
	* `top` clause is only supported by some dialects like MS SQL Server.
	*
	* ### Examples
	*
	* Insert the first 5 rows:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.insertInto('person')
	*   .top(5)
	*   .columns(['first_name', 'gender'])
	*   .expression(
	*     (eb) => eb.selectFrom('pet').select(['name', sql.lit('other').as('gender')])
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* insert top(5) into "person" ("first_name", "gender") select "name", 'other' as "gender" from "pet"
	* ```
	*
	* Insert the first 50 percent of rows:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.insertInto('person')
	*   .top(50, 'percent')
	*   .columns(['first_name', 'gender'])
	*   .expression(
	*     (eb) => eb.selectFrom('pet').select(['name', sql.lit('other').as('gender')])
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* insert top(50) percent into "person" ("first_name", "gender") select "name", 'other' as "gender" from "pet"
	* ```
	*/
	top(expression, modifiers) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	/**
	* Adds an `on conflict` clause to the query.
	*
	* `on conflict` is only supported by some dialects like PostgreSQL and SQLite. On MySQL
	* you can use {@link ignore} and {@link onDuplicateKeyUpdate} to achieve similar results.
	*
	* ### Examples
	*
	* ```ts
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .column('name')
	*     .doUpdateSet({ species: 'hamster' })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict ("name")
	* do update set "species" = $4
	* ```
	*
	* You can provide the name of the constraint instead of a column name:
	*
	* ```ts
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .constraint('pet_name_key')
	*     .doUpdateSet({ species: 'hamster' })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict on constraint "pet_name_key"
	* do update set "species" = $4
	* ```
	*
	* You can also specify an expression as the conflict target in case
	* the unique index is an expression index:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .expression(sql<string>`lower(name)`)
	*     .doUpdateSet({ species: 'hamster' })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict (lower(name))
	* do update set "species" = $4
	* ```
	*
	* You can add a filter for the update statement like this:
	*
	* ```ts
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .column('name')
	*     .doUpdateSet({ species: 'hamster' })
	*     .where('excluded.name', '!=', 'Catto')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict ("name")
	* do update set "species" = $4
	* where "excluded"."name" != $5
	* ```
	*
	* You can create an `on conflict do nothing` clauses like this:
	*
	* ```ts
	* await db
	*   .insertInto('pet')
	*   .values({
	*     name: 'Catto',
	*     species: 'cat',
	*     owner_id: 3,
	*   })
	*   .onConflict((oc) => oc
	*     .column('name')
	*     .doNothing()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "pet" ("name", "species", "owner_id")
	* values ($1, $2, $3)
	* on conflict ("name") do nothing
	* ```
	*
	* You can refer to the columns of the virtual `excluded` table
	* in a type-safe way using a callback and the `ref` method of
	* `ExpressionBuilder`:
	*
	* ```ts
	* await db.insertInto('person')
	*   .values({
	*     id: 1,
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*   })
	*   .onConflict(oc => oc
	*     .column('id')
	*     .doUpdateSet({
	*       first_name: (eb) => eb.ref('excluded.first_name'),
	*       last_name: (eb) => eb.ref('excluded.last_name')
	*     })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* insert into "person" ("id", "first_name", "last_name", "gender")
	* values ($1, $2, $3, $4)
	* on conflict ("id")
	* do update set
	*  "first_name" = "excluded"."first_name",
	*  "last_name" = "excluded"."last_name"
	* ```
	*/
	onConflict(callback) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { onConflict: callback(new OnConflictBuilder({ onConflictNode: OnConflictNode.create() })).toOperationNode() })
		});
	}
	/**
	* Adds `on duplicate key update` to the query.
	*
	* If you specify `on duplicate key update`, and a row is inserted that would cause
	* a duplicate value in a unique index or primary key, an update of the old row occurs.
	*
	* This is only implemented by some dialects like MySQL. On most dialects you should
	* use {@link onConflict} instead.
	*
	* ### Examples
	*
	* ```ts
	* await db
	*   .insertInto('person')
	*   .values({
	*     id: 1,
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*   })
	*   .onDuplicateKeyUpdate({ updated_at: new Date().toISOString() })
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* insert into `person` (`id`, `first_name`, `last_name`, `gender`)
	* values (?, ?, ?, ?)
	* on duplicate key update `updated_at` = ?
	* ```
	*/
	onDuplicateKeyUpdate(update) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { onDuplicateKey: OnDuplicateKeyNode.create(parseUpdateObjectExpression(update)) })
		});
	}
	returning(selection) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
		});
	}
	returningAll() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll())
		});
	}
	output(args) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
	/**
	* Clears all `returning` clauses from the query.
	*
	* ### Examples
	*
	* ```ts
	* await db.insertInto('person')
	*   .values({ first_name: 'James', last_name: 'Smith', gender: 'male' })
	*   .returning(['first_name'])
	*   .clearReturning()
	*   .execute()
	* ```
	*
	* The generated SQL(PostgreSQL):
	*
	* ```sql
	* insert into "person" ("first_name", "last_name", "gender") values ($1, $2, $3)
	* ```
	*/
	clearReturning() {
		return new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*
	* If you want to conditionally call a method on `this`, see
	* the {@link $if} method.
	*
	* ### Examples
	*
	* The next example uses a helper function `log` to log a query:
	*
	* ```ts
	* import type { Compilable } from 'kysely'
	*
	* function log<T extends Compilable>(qb: T): T {
	*   console.log(qb.compile())
	*   return qb
	* }
	*
	* await db.insertInto('person')
	*   .values({ first_name: 'John', last_name: 'Doe', gender: 'male' })
	*   .$call(log)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Call `func(this)` if `condition` is true.
	*
	* This method is especially handy with optional selects. Any `returning` or `returningAll`
	* method calls add columns as optional fields to the output type when called inside
	* the `func` callback. This is because we can't know if those selections were actually
	* made before running the code.
	*
	* You can also call any other methods inside the callback.
	*
	* ### Examples
	*
	* ```ts
	* import type { NewPerson } from 'type-editor' // imaginary module
	*
	* async function insertPerson(values: NewPerson, returnLastName: boolean) {
	*   return await db
	*     .insertInto('person')
	*     .values(values)
	*     .returning(['id', 'first_name'])
	*     .$if(returnLastName, (qb) => qb.returning('last_name'))
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*
	* Any selections added inside the `if` callback will be added as optional fields to the
	* output type since we can't know if the selections were actually made before running
	* the code. In the example above the return type of the `insertPerson` function is:
	*
	* ```ts
	* Promise<{
	*   id: number
	*   first_name: string
	*   last_name?: string
	* }>
	* ```
	*/
	$if(condition, func) {
		if (condition) return func(this);
		return new InsertQueryBuilder({ ...this.#props });
	}
	/**
	* Change the output type of the query.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `InsertQueryBuilder` with a new output type.
	*/
	$castTo() {
		return new InsertQueryBuilder(this.#props);
	}
	/**
	* Narrows (parts of) the output type of the query.
	*
	* Kysely tries to be as type-safe as possible, but in some cases we have to make
	* compromises for better maintainability and compilation performance. At present,
	* Kysely doesn't narrow the output type of the query based on {@link values} input
	* when using {@link returning} or {@link returningAll}.
	*
	* This utility method is very useful for these situations, as it removes unncessary
	* runtime assertion/guard code. Its input type is limited to the output type
	* of the query, so you can't add a column that doesn't exist, or change a column's
	* type to something that doesn't exist in its union type.
	*
	* ### Examples
	*
	* Turn this code:
	*
	* ```ts
	* import type { Person } from 'type-editor' // imaginary module
	*
	* const person = await db.insertInto('person')
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*     nullable_column: 'hell yeah!'
	*   })
	*   .returningAll()
	*   .executeTakeFirstOrThrow()
	*
	* if (isWithNoNullValue(person)) {
	*   functionThatExpectsPersonWithNonNullValue(person)
	* }
	*
	* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
	*   return person.nullable_column != null
	* }
	* ```
	*
	* Into this:
	*
	* ```ts
	* import type { NotNull } from 'kysely'
	*
	* const person = await db.insertInto('person')
	*   .values({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*     gender: 'male',
	*     nullable_column: 'hell yeah!'
	*   })
	*   .returningAll()
	*   .$narrowType<{ nullable_column: NotNull }>()
	*   .executeTakeFirstOrThrow()
	*
	* functionThatExpectsPersonWithNonNullValue(person)
	* ```
	*/
	$narrowType() {
		return new InsertQueryBuilder(this.#props);
	}
	/**
	* Asserts that query's output row type equals the given type `T`.
	*
	* This method can be used to simplify excessively complex types to make TypeScript happy
	* and much faster.
	*
	* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
	* for TypeScript and you get errors like this:
	*
	* ```
	* error TS2589: Type instantiation is excessively deep and possibly infinite.
	* ```
	*
	* In these case you can often use this method to help TypeScript a little bit. When you use this
	* method to assert the output type of a query, Kysely can drop the complex output type that
	* consists of multiple nested helper types and replace it with the simple asserted type.
	*
	* Using this method doesn't reduce type safety at all. You have to pass in a type that is
	* structurally equal to the current type.
	*
	* ### Examples
	*
	* ```ts
	* import type { NewPerson, NewPet, Species } from 'type-editor' // imaginary module
	*
	* async function insertPersonAndPet(person: NewPerson, pet: Omit<NewPet, 'owner_id'>) {
	*   return await db
	*     .with('new_person', (qb) => qb
	*       .insertInto('person')
	*       .values(person)
	*       .returning('id')
	*       .$assertType<{ id: number }>()
	*     )
	*     .with('new_pet', (qb) => qb
	*       .insertInto('pet')
	*       .values((eb) => ({
	*         owner_id: eb.selectFrom('new_person').select('id'),
	*         ...pet
	*       }))
	*       .returning(['name as pet_name', 'species'])
	*       .$assertType<{ pet_name: string, species: Species }>()
	*     )
	*     .selectFrom(['new_person', 'new_pet'])
	*     .selectAll()
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*/
	$assertType() {
		return new InsertQueryBuilder(this.#props);
	}
	/**
	* Returns a copy of this InsertQueryBuilder instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new InsertQueryBuilder({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		const result = await this.#props.executor.executeQuery(compiledQuery, options);
		const { adapter } = this.#props.executor;
		const query = compiledQuery.query;
		if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
		return [new InsertResult(result.insertId, result.numAffectedRows ?? BigInt(0))];
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
	async *stream(chunkSizeOrOptions) {
		if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
		const compiledQuery = this.compile();
		const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
		for await (const item of stream) yield* item.rows;
	}
	async explain(format, options) {
		return await new InsertQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
		}).execute();
	}
};
//#endregion
//#region node_modules/kysely/dist/query-builder/delete-result.js
var DeleteResult = class {
	numDeletedRows;
	constructor(numDeletedRows) {
		this.numDeletedRows = numDeletedRows;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/limit-node.js
/**
* @internal
*/
var LimitNode = freeze({
	is(node) {
		return node.kind === "LimitNode";
	},
	create(limit) {
		return freeze({
			kind: "LimitNode",
			limit
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/delete-query-builder.js
var _a$3;
var DeleteQueryBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	where(...args) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	whereRef(lhs, op, rhs) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	clearWhere() {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
		});
	}
	/**
	* Changes a `delete from` query into a `delete top from` query.
	*
	* `top` clause is only supported by some dialects like MS SQL Server.
	*
	* ### Examples
	*
	* Delete the first 5 rows:
	*
	* ```ts
	* await db
	*   .deleteFrom('person')
	*   .top(5)
	*   .where('age', '>', 18)
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* delete top(5) from "person" where "age" > @1
	* ```
	*
	* Delete the first 50% of rows:
	*
	* ```ts
	* await db
	*   .deleteFrom('person')
	*   .top(50, 'percent')
	*   .where('age', '>', 18)
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* delete top(50) percent from "person" where "age" > @1
	* ```
	*/
	top(expression, modifiers) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	using(tables) {
		return new _a$3({
			...this.#props,
			queryNode: DeleteQueryNode.cloneWithUsing(this.#props.queryNode, parseTableExpressionOrList(tables))
		});
	}
	innerJoin(...args) {
		return this.#join("InnerJoin", args);
	}
	leftJoin(...args) {
		return this.#join("LeftJoin", args);
	}
	rightJoin(...args) {
		return this.#join("RightJoin", args);
	}
	fullJoin(...args) {
		return this.#join("FullJoin", args);
	}
	#join(joinType, args) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
		});
	}
	returning(selection) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
		});
	}
	returningAll(table) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
		});
	}
	output(args) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
	/**
	* Clears all `returning` clauses from the query.
	*
	* ### Examples
	*
	* ```ts
	* await db.deleteFrom('pet')
	*   .returningAll()
	*   .where('name', '=', 'Max')
	*   .clearReturning()
	*   .execute()
	* ```
	*
	* The generated SQL(PostgreSQL):
	*
	* ```sql
	* delete from "pet" where "name" = "Max"
	* ```
	*/
	clearReturning() {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
		});
	}
	/**
	* Clears the `limit` clause from the query.
	*
	* ### Examples
	*
	* ```ts
	* await db.deleteFrom('pet')
	*   .returningAll()
	*   .where('name', '=', 'Max')
	*   .limit(5)
	*   .clearLimit()
	*   .execute()
	* ```
	*
	* The generated SQL(PostgreSQL):
	*
	* ```sql
	* delete from "pet" where "name" = "Max" returning *
	* ```
	*/
	clearLimit() {
		return new _a$3({
			...this.#props,
			queryNode: DeleteQueryNode.cloneWithoutLimit(this.#props.queryNode)
		});
	}
	orderBy(...args) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
		});
	}
	clearOrderBy() {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
		});
	}
	/**
	* Adds a limit clause to the query.
	*
	* A limit clause in a delete query is only supported by some dialects
	* like MySQL.
	*
	* ### Examples
	*
	* Delete 5 oldest items in a table:
	*
	* ```ts
	* await db
	*   .deleteFrom('pet')
	*   .orderBy('created_at')
	*   .limit(5)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* delete from `pet` order by `created_at` limit ?
	* ```
	*/
	limit(limit) {
		return new _a$3({
			...this.#props,
			queryNode: DeleteQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.deleteFrom('person')
	*   .where('first_name', '=', 'John')
	*   .modifyEnd(sql`-- This is a comment`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* delete from `person`
	* where `first_name` = "John" -- This is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*
	* If you want to conditionally call a method on `this`, see
	* the {@link $if} method.
	*
	* ### Examples
	*
	* The next example uses a helper function `log` to log a query:
	*
	* ```ts
	* import type { Compilable } from 'kysely'
	*
	* function log<T extends Compilable>(qb: T): T {
	*   console.log(qb.compile())
	*   return qb
	* }
	*
	* await db.deleteFrom('person')
	*   .$call(log)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Call `func(this)` if `condition` is true.
	*
	* This method is especially handy with optional selects. Any `returning` or `returningAll`
	* method calls add columns as optional fields to the output type when called inside
	* the `func` callback. This is because we can't know if those selections were actually
	* made before running the code.
	*
	* You can also call any other methods inside the callback.
	*
	* ### Examples
	*
	* ```ts
	* async function deletePerson(id: number, returnLastName: boolean) {
	*   return await db
	*     .deleteFrom('person')
	*     .where('id', '=', id)
	*     .returning(['id', 'first_name'])
	*     .$if(returnLastName, (qb) => qb.returning('last_name'))
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*
	* Any selections added inside the `if` callback will be added as optional fields to the
	* output type since we can't know if the selections were actually made before running
	* the code. In the example above the return type of the `deletePerson` function is:
	*
	* ```ts
	* Promise<{
	*   id: number
	*   first_name: string
	*   last_name?: string
	* }>
	* ```
	*/
	$if(condition, func) {
		if (condition) return func(this);
		return new _a$3({ ...this.#props });
	}
	/**
	* Change the output type of the query.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `DeleteQueryBuilder` with a new output type.
	*/
	$castTo() {
		return new _a$3(this.#props);
	}
	/**
	* Narrows (parts of) the output type of the query.
	*
	* Kysely tries to be as type-safe as possible, but in some cases we have to make
	* compromises for better maintainability and compilation performance. At present,
	* Kysely doesn't narrow the output type of the query when using {@link where} and {@link returning} or {@link returningAll}.
	*
	* This utility method is very useful for these situations, as it removes unncessary
	* runtime assertion/guard code. Its input type is limited to the output type
	* of the query, so you can't add a column that doesn't exist, or change a column's
	* type to something that doesn't exist in its union type.
	*
	* ### Examples
	*
	* Turn this code:
	*
	* ```ts
	* import type { Person } from 'type-editor' // imaginary module
	*
	* const person = await db.deleteFrom('person')
	*   .where('id', '=', 3)
	*   .where('nullable_column', 'is not', null)
	*   .returningAll()
	*   .executeTakeFirstOrThrow()
	*
	* if (isWithNoNullValue(person)) {
	*   functionThatExpectsPersonWithNonNullValue(person)
	* }
	*
	* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
	*   return person.nullable_column != null
	* }
	* ```
	*
	* Into this:
	*
	* ```ts
	* import type { NotNull } from 'kysely'
	*
	* const person = await db.deleteFrom('person')
	*   .where('id', '=', 3)
	*   .where('nullable_column', 'is not', null)
	*   .returningAll()
	*   .$narrowType<{ nullable_column: NotNull }>()
	*   .executeTakeFirstOrThrow()
	*
	* functionThatExpectsPersonWithNonNullValue(person)
	* ```
	*/
	$narrowType() {
		return new _a$3(this.#props);
	}
	/**
	* Asserts that query's output row type equals the given type `T`.
	*
	* This method can be used to simplify excessively complex types to make TypeScript happy
	* and much faster.
	*
	* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
	* for TypeScript and you get errors like this:
	*
	* ```
	* error TS2589: Type instantiation is excessively deep and possibly infinite.
	* ```
	*
	* In these case you can often use this method to help TypeScript a little bit. When you use this
	* method to assert the output type of a query, Kysely can drop the complex output type that
	* consists of multiple nested helper types and replace it with the simple asserted type.
	*
	* Using this method doesn't reduce type safety at all. You have to pass in a type that is
	* structurally equal to the current type.
	*
	* ### Examples
	*
	* ```ts
	* import type { Species } from 'type-editor' // imaginary module
	*
	* async function deletePersonAndPets(personId: number) {
	*   return await db
	*     .with('deleted_person', (qb) => qb
	*        .deleteFrom('person')
	*        .where('id', '=', personId)
	*        .returning('first_name')
	*        .$assertType<{ first_name: string }>()
	*     )
	*     .with('deleted_pets', (qb) => qb
	*       .deleteFrom('pet')
	*       .where('owner_id', '=', personId)
	*       .returning(['name as pet_name', 'species'])
	*       .$assertType<{ pet_name: string, species: Species }>()
	*     )
	*     .selectFrom(['deleted_person', 'deleted_pets'])
	*     .selectAll()
	*     .execute()
	* }
	* ```
	*/
	$assertType() {
		return new _a$3(this.#props);
	}
	/**
	* Returns a copy of this DeleteQueryBuilder instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new _a$3({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		const result = await this.#props.executor.executeQuery(compiledQuery, options);
		const { adapter } = this.#props.executor;
		const query = compiledQuery.query;
		if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
		return [new DeleteResult(result.numAffectedRows ?? BigInt(0))];
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
	async *stream(chunkSizeOrOptions) {
		if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
		const compiledQuery = this.compile();
		const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
		for await (const item of stream) yield* item.rows;
	}
	async explain(format, options) {
		return await new _a$3({
			...this.#props,
			queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
		}).execute();
	}
};
_a$3 = DeleteQueryBuilder;
//#endregion
//#region node_modules/kysely/dist/query-builder/update-result.js
var UpdateResult = class {
	/**
	* The number of rows the update query updated (even if not changed).
	*/
	numUpdatedRows;
	/**
	* The number of rows the update query changed.
	*
	* This is **optional** and only supported in dialects such as MySQL.
	* You would probably use {@link numUpdatedRows} in most cases.
	*/
	numChangedRows;
	constructor(numUpdatedRows, numChangedRows) {
		this.numUpdatedRows = numUpdatedRows;
		this.numChangedRows = numChangedRows;
	}
};
//#endregion
//#region node_modules/kysely/dist/query-builder/update-query-builder.js
var _a$2;
var UpdateQueryBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	where(...args) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	whereRef(lhs, op, rhs) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	clearWhere() {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
		});
	}
	/**
	* Changes an `update` query into a `update top` query.
	*
	* `top` clause is only supported by some dialects like MS SQL Server.
	*
	* ### Examples
	*
	* Update the first row:
	*
	* ```ts
	* await db.updateTable('person')
	*   .top(1)
	*   .set({ first_name: 'Foo' })
	*   .where('age', '>', 18)
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* update top(1) "person" set "first_name" = @1 where "age" > @2
	* ```
	*
	* Update the 50% first rows:
	*
	* ```ts
	* await db.updateTable('person')
	*   .top(50, 'percent')
	*   .set({ first_name: 'Foo' })
	*   .where('age', '>', 18)
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* update top(50) percent "person" set "first_name" = @1 where "age" > @2
	* ```
	*/
	top(expression, modifiers) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	from(from) {
		return new _a$2({
			...this.#props,
			queryNode: UpdateQueryNode.cloneWithFromItems(this.#props.queryNode, parseTableExpressionOrList(from))
		});
	}
	innerJoin(...args) {
		return this.#join("InnerJoin", args);
	}
	leftJoin(...args) {
		return this.#join("LeftJoin", args);
	}
	rightJoin(...args) {
		return this.#join("RightJoin", args);
	}
	fullJoin(...args) {
		return this.#join("FullJoin", args);
	}
	#join(joinType, args) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
		});
	}
	orderBy(...args) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
		});
	}
	clearOrderBy() {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
		});
	}
	/**
	* Adds a limit clause to the update query for supported databases, such as MySQL.
	*
	* ### Examples
	*
	* Update the first 2 rows in the 'person' table:
	*
	* ```ts
	* await db
	*   .updateTable('person')
	*   .set({ first_name: 'Foo' })
	*   .limit(2)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* update `person` set `first_name` = ? limit ?
	* ```
	*/
	limit(limit) {
		return new _a$2({
			...this.#props,
			queryNode: UpdateQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
		});
	}
	set(...args) {
		return new _a$2({
			...this.#props,
			queryNode: UpdateQueryNode.cloneWithUpdates(this.#props.queryNode, parseUpdate(...args))
		});
	}
	returning(selection) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
		});
	}
	returningAll(table) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
		});
	}
	output(args) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.updateTable('person')
	*   .set({ age: 39 })
	*   .where('first_name', '=', 'John')
	*   .modifyEnd(sql.raw('-- This is a comment'))
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* update `person`
	* set `age` = 39
	* where `first_name` = "John" -- This is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* Clears all `returning` clauses from the query.
	*
	* ### Examples
	*
	* ```ts
	* db.updateTable('person')
	*   .returningAll()
	*   .set({ age: 39 })
	*   .where('first_name', '=', 'John')
	*   .clearReturning()
	* ```
	*
	* The generated SQL(PostgreSQL):
	*
	* ```sql
	* update "person" set "age" = 39 where "first_name" = "John"
	* ```
	*/
	clearReturning() {
		return new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*
	* If you want to conditionally call a method on `this`, see
	* the {@link $if} method.
	*
	* ### Examples
	*
	* The next example uses a helper function `log` to log a query:
	*
	* ```ts
	* import type { Compilable } from 'kysely'
	* import type { PersonUpdate } from 'type-editor' // imaginary module
	*
	* function log<T extends Compilable>(qb: T): T {
	*   console.log(qb.compile())
	*   return qb
	* }
	*
	* const values = {
	*   first_name: 'John',
	* } satisfies PersonUpdate
	*
	* db.updateTable('person')
	*   .set(values)
	*   .$call(log)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Call `func(this)` if `condition` is true.
	*
	* This method is especially handy with optional selects. Any `returning` or `returningAll`
	* method calls add columns as optional fields to the output type when called inside
	* the `func` callback. This is because we can't know if those selections were actually
	* made before running the code.
	*
	* You can also call any other methods inside the callback.
	*
	* ### Examples
	*
	* ```ts
	* import type { PersonUpdate } from 'type-editor' // imaginary module
	*
	* async function updatePerson(id: number, updates: PersonUpdate, returnLastName: boolean) {
	*   return await db
	*     .updateTable('person')
	*     .set(updates)
	*     .where('id', '=', id)
	*     .returning(['id', 'first_name'])
	*     .$if(returnLastName, (qb) => qb.returning('last_name'))
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*
	* Any selections added inside the `if` callback will be added as optional fields to the
	* output type since we can't know if the selections were actually made before running
	* the code. In the example above the return type of the `updatePerson` function is:
	*
	* ```ts
	* Promise<{
	*   id: number
	*   first_name: string
	*   last_name?: string
	* }>
	* ```
	*/
	$if(condition, func) {
		if (condition) return func(this);
		return new _a$2({ ...this.#props });
	}
	/**
	* Change the output type of the query.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `UpdateQueryBuilder` with a new output type.
	*/
	$castTo() {
		return new _a$2(this.#props);
	}
	/**
	* Narrows (parts of) the output type of the query.
	*
	* Kysely tries to be as type-safe as possible, but in some cases we have to make
	* compromises for better maintainability and compilation performance. At present,
	* Kysely doesn't narrow the output type of the query based on {@link set} input
	* when using {@link where} and/or {@link returning} or {@link returningAll}.
	*
	* This utility method is very useful for these situations, as it removes unncessary
	* runtime assertion/guard code. Its input type is limited to the output type
	* of the query, so you can't add a column that doesn't exist, or change a column's
	* type to something that doesn't exist in its union type.
	*
	* ### Examples
	*
	* Turn this code:
	*
	* ```ts
	* import type { Person } from 'type-editor' // imaginary module
	*
	* const id = 1
	* const now = new Date().toISOString()
	*
	* const person = await db.updateTable('person')
	*   .set({ deleted_at: now })
	*   .where('id', '=', id)
	*   .where('nullable_column', 'is not', null)
	*   .returningAll()
	*   .executeTakeFirstOrThrow()
	*
	* if (isWithNoNullValue(person)) {
	*   functionThatExpectsPersonWithNonNullValue(person)
	* }
	*
	* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
	*   return person.nullable_column != null
	* }
	* ```
	*
	* Into this:
	*
	* ```ts
	* import type { NotNull } from 'kysely'
	*
	* const id = 1
	* const now = new Date().toISOString()
	*
	* const person = await db.updateTable('person')
	*   .set({ deleted_at: now })
	*   .where('id', '=', id)
	*   .where('nullable_column', 'is not', null)
	*   .returningAll()
	*   .$narrowType<{ deleted_at: Date; nullable_column: NotNull }>()
	*   .executeTakeFirstOrThrow()
	*
	* functionThatExpectsPersonWithNonNullValue(person)
	* ```
	*/
	$narrowType() {
		return new _a$2(this.#props);
	}
	/**
	* Asserts that query's output row type equals the given type `T`.
	*
	* This method can be used to simplify excessively complex types to make TypeScript happy
	* and much faster.
	*
	* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
	* for TypeScript and you get errors like this:
	*
	* ```
	* error TS2589: Type instantiation is excessively deep and possibly infinite.
	* ```
	*
	* In these case you can often use this method to help TypeScript a little bit. When you use this
	* method to assert the output type of a query, Kysely can drop the complex output type that
	* consists of multiple nested helper types and replace it with the simple asserted type.
	*
	* Using this method doesn't reduce type safety at all. You have to pass in a type that is
	* structurally equal to the current type.
	*
	* ### Examples
	*
	* ```ts
	* import type { PersonUpdate, PetUpdate, Species } from 'type-editor' // imaginary module
	*
	* const person = {
	*   id: 1,
	*   gender: 'other',
	* } satisfies PersonUpdate
	*
	* const pet = {
	*   name: 'Fluffy',
	* } satisfies PetUpdate
	*
	* const result = await db
	*   .with('updated_person', (qb) => qb
	*     .updateTable('person')
	*     .set(person)
	*     .where('id', '=', person.id)
	*     .returning('first_name')
	*     .$assertType<{ first_name: string }>()
	*   )
	*   .with('updated_pet', (qb) => qb
	*     .updateTable('pet')
	*     .set(pet)
	*     .where('owner_id', '=', person.id)
	*     .returning(['name as pet_name', 'species'])
	*     .$assertType<{ pet_name: string, species: Species }>()
	*   )
	*   .selectFrom(['updated_person', 'updated_pet'])
	*   .selectAll()
	*   .executeTakeFirstOrThrow()
	* ```
	*/
	$assertType() {
		return new _a$2(this.#props);
	}
	/**
	* Returns a copy of this UpdateQueryBuilder instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new _a$2({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		const result = await this.#props.executor.executeQuery(compiledQuery, options);
		const { adapter } = this.#props.executor;
		const query = compiledQuery.query;
		if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
		return [new UpdateResult(result.numAffectedRows ?? BigInt(0), result.numChangedRows)];
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
	async *stream(chunkSizeOrOptions) {
		if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
		const compiledQuery = this.compile();
		const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
		for await (const item of stream) yield* item.rows;
	}
	async explain(format, options) {
		return await new _a$2({
			...this.#props,
			queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
		}).execute();
	}
};
_a$2 = UpdateQueryBuilder;
//#endregion
//#region node_modules/kysely/dist/operation-node/common-table-expression-name-node.js
/**
* @internal
*/
var CommonTableExpressionNameNode = freeze({
	is(node) {
		return node.kind === "CommonTableExpressionNameNode";
	},
	create(tableName, columnNames) {
		return freeze({
			kind: "CommonTableExpressionNameNode",
			table: TableNode.create(tableName),
			columns: columnNames ? freeze(columnNames.map(ColumnNode.create)) : void 0
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/common-table-expression-node.js
/**
* @internal
*/
var CommonTableExpressionNode = freeze({
	is(node) {
		return node.kind === "CommonTableExpressionNode";
	},
	create(name, expression) {
		return freeze({
			kind: "CommonTableExpressionNode",
			name,
			expression
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/cte-builder.js
var CTEBuilder = class CTEBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Makes the common table expression materialized.
	*/
	materialized() {
		return new CTEBuilder({
			...this.#props,
			node: CommonTableExpressionNode.cloneWith(this.#props.node, { materialized: true })
		});
	}
	/**
	* Makes the common table expression not materialized.
	*/
	notMaterialized() {
		return new CTEBuilder({
			...this.#props,
			node: CommonTableExpressionNode.cloneWith(this.#props.node, { materialized: false })
		});
	}
	toOperationNode() {
		return this.#props.node;
	}
};
//#endregion
//#region node_modules/kysely/dist/parser/with-parser.js
function parseCommonTableExpression(nameOrBuilderCallback, expression) {
	const expressionNode = isOperationNodeSource(expression) ? expression.toOperationNode() : expression(createQueryCreator()).toOperationNode();
	if (isFunction(nameOrBuilderCallback)) return nameOrBuilderCallback(cteBuilderFactory(expressionNode)).toOperationNode();
	return CommonTableExpressionNode.create(parseCommonTableExpressionName(nameOrBuilderCallback), expressionNode);
}
function cteBuilderFactory(expressionNode) {
	return (name) => {
		return new CTEBuilder({ node: CommonTableExpressionNode.create(parseCommonTableExpressionName(name), expressionNode) });
	};
}
function parseCommonTableExpressionName(name) {
	if (name.includes("(")) {
		const parts = name.split(/[\(\)]/);
		const table = parts[0];
		const columns = parts[1].split(",").map((it) => it.trim());
		return CommonTableExpressionNameNode.create(table, columns);
	} else return CommonTableExpressionNameNode.create(name);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/with-node.js
/**
* @internal
*/
var WithNode = freeze({
	is(node) {
		return node.kind === "WithNode";
	},
	create(expression, params) {
		return freeze({
			kind: "WithNode",
			expressions: freeze([expression]),
			...params
		});
	},
	cloneWithExpression(withNode, expression) {
		return freeze({
			...withNode,
			expressions: freeze([...withNode.expressions, expression])
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/util/random-string.js
var CHARS = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
];
function randomString(length) {
	let chars = "";
	for (let i = 0; i < length; ++i) chars += randomChar();
	return chars;
}
function randomChar() {
	return CHARS[~~(Math.random() * CHARS.length)];
}
//#endregion
//#region node_modules/kysely/dist/util/query-id.js
function createQueryId() {
	return new LazyQueryId();
}
var LazyQueryId = class {
	#queryId;
	get queryId() {
		if (this.#queryId === void 0) this.#queryId = randomString(8);
		return this.#queryId;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/operation-node-transformer.js
/**
* Transforms an operation node tree into another one.
*
* Kysely queries are expressed internally as a tree of objects (operation nodes).
* `OperationNodeTransformer` takes such a tree as its input and returns a
* transformed deep copy of it. By default the `OperationNodeTransformer`
* does nothing. You need to override one or more methods to make it do
* something.
*
* There's a method for each node type. For example if you'd like to convert
* each identifier (table name, column name, alias etc.) from camelCase to
* snake_case, you'd do something like this:
*
* ```ts
* import { type IdentifierNode, OperationNodeTransformer } from 'kysely'
* import snakeCase from 'lodash/snakeCase'
*
* class CamelCaseTransformer extends OperationNodeTransformer {
*   override transformIdentifier(node: IdentifierNode): IdentifierNode {
*     node = super.transformIdentifier(node)
*
*     return {
*       ...node,
*       name: snakeCase(node.name),
*     }
*   }
* }
*
* const transformer = new CamelCaseTransformer()
*
* const query = db.selectFrom('person').select(['first_name', 'last_name'])
*
* const tree = transformer.transformNode(query.toOperationNode())
* ```
*/
var OperationNodeTransformer = class {
	nodeStack = [];
	#transformers = freeze({
		AliasNode: this.transformAlias.bind(this),
		ColumnNode: this.transformColumn.bind(this),
		IdentifierNode: this.transformIdentifier.bind(this),
		SchemableIdentifierNode: this.transformSchemableIdentifier.bind(this),
		RawNode: this.transformRaw.bind(this),
		ReferenceNode: this.transformReference.bind(this),
		SelectQueryNode: this.transformSelectQuery.bind(this),
		SelectionNode: this.transformSelection.bind(this),
		TableNode: this.transformTable.bind(this),
		FromNode: this.transformFrom.bind(this),
		SelectAllNode: this.transformSelectAll.bind(this),
		AndNode: this.transformAnd.bind(this),
		OrNode: this.transformOr.bind(this),
		ValueNode: this.transformValue.bind(this),
		ValueListNode: this.transformValueList.bind(this),
		PrimitiveValueListNode: this.transformPrimitiveValueList.bind(this),
		ParensNode: this.transformParens.bind(this),
		JoinNode: this.transformJoin.bind(this),
		OperatorNode: this.transformOperator.bind(this),
		WhereNode: this.transformWhere.bind(this),
		InsertQueryNode: this.transformInsertQuery.bind(this),
		DeleteQueryNode: this.transformDeleteQuery.bind(this),
		ReturningNode: this.transformReturning.bind(this),
		CreateTableNode: this.transformCreateTable.bind(this),
		AddColumnNode: this.transformAddColumn.bind(this),
		ColumnDefinitionNode: this.transformColumnDefinition.bind(this),
		DropTableNode: this.transformDropTable.bind(this),
		DataTypeNode: this.transformDataType.bind(this),
		OrderByNode: this.transformOrderBy.bind(this),
		OrderByItemNode: this.transformOrderByItem.bind(this),
		GroupByNode: this.transformGroupBy.bind(this),
		GroupByItemNode: this.transformGroupByItem.bind(this),
		UpdateQueryNode: this.transformUpdateQuery.bind(this),
		ColumnUpdateNode: this.transformColumnUpdate.bind(this),
		LimitNode: this.transformLimit.bind(this),
		OffsetNode: this.transformOffset.bind(this),
		OnConflictNode: this.transformOnConflict.bind(this),
		OnDuplicateKeyNode: this.transformOnDuplicateKey.bind(this),
		CreateIndexNode: this.transformCreateIndex.bind(this),
		DropIndexNode: this.transformDropIndex.bind(this),
		ListNode: this.transformList.bind(this),
		PrimaryKeyConstraintNode: this.transformPrimaryKeyConstraint.bind(this),
		UniqueConstraintNode: this.transformUniqueConstraint.bind(this),
		ReferencesNode: this.transformReferences.bind(this),
		CheckConstraintNode: this.transformCheckConstraint.bind(this),
		WithNode: this.transformWith.bind(this),
		CommonTableExpressionNode: this.transformCommonTableExpression.bind(this),
		CommonTableExpressionNameNode: this.transformCommonTableExpressionName.bind(this),
		HavingNode: this.transformHaving.bind(this),
		CreateSchemaNode: this.transformCreateSchema.bind(this),
		DropSchemaNode: this.transformDropSchema.bind(this),
		AlterTableNode: this.transformAlterTable.bind(this),
		DropColumnNode: this.transformDropColumn.bind(this),
		RenameColumnNode: this.transformRenameColumn.bind(this),
		AlterColumnNode: this.transformAlterColumn.bind(this),
		ModifyColumnNode: this.transformModifyColumn.bind(this),
		AddConstraintNode: this.transformAddConstraint.bind(this),
		DropConstraintNode: this.transformDropConstraint.bind(this),
		RenameConstraintNode: this.transformRenameConstraint.bind(this),
		ForeignKeyConstraintNode: this.transformForeignKeyConstraint.bind(this),
		CreateViewNode: this.transformCreateView.bind(this),
		RefreshMaterializedViewNode: this.transformRefreshMaterializedView.bind(this),
		DropViewNode: this.transformDropView.bind(this),
		GeneratedNode: this.transformGenerated.bind(this),
		DefaultValueNode: this.transformDefaultValue.bind(this),
		OnNode: this.transformOn.bind(this),
		ValuesNode: this.transformValues.bind(this),
		SelectModifierNode: this.transformSelectModifier.bind(this),
		CreateTypeNode: this.transformCreateType.bind(this),
		DropTypeNode: this.transformDropType.bind(this),
		ExplainNode: this.transformExplain.bind(this),
		DefaultInsertValueNode: this.transformDefaultInsertValue.bind(this),
		AggregateFunctionNode: this.transformAggregateFunction.bind(this),
		OverNode: this.transformOver.bind(this),
		PartitionByNode: this.transformPartitionBy.bind(this),
		PartitionByItemNode: this.transformPartitionByItem.bind(this),
		SetOperationNode: this.transformSetOperation.bind(this),
		BinaryOperationNode: this.transformBinaryOperation.bind(this),
		UnaryOperationNode: this.transformUnaryOperation.bind(this),
		UsingNode: this.transformUsing.bind(this),
		FunctionNode: this.transformFunction.bind(this),
		CaseNode: this.transformCase.bind(this),
		WhenNode: this.transformWhen.bind(this),
		JSONReferenceNode: this.transformJSONReference.bind(this),
		JSONPathNode: this.transformJSONPath.bind(this),
		JSONPathLegNode: this.transformJSONPathLeg.bind(this),
		JSONOperatorChainNode: this.transformJSONOperatorChain.bind(this),
		TupleNode: this.transformTuple.bind(this),
		MergeQueryNode: this.transformMergeQuery.bind(this),
		MatchedNode: this.transformMatched.bind(this),
		AddIndexNode: this.transformAddIndex.bind(this),
		CastNode: this.transformCast.bind(this),
		FetchNode: this.transformFetch.bind(this),
		TopNode: this.transformTop.bind(this),
		OutputNode: this.transformOutput.bind(this),
		OrActionNode: this.transformOrAction.bind(this),
		CollateNode: this.transformCollate.bind(this),
		AlterTypeNode: this.transformAlterType.bind(this),
		AddValueNode: this.transformAddValue.bind(this),
		RenameValueNode: this.transformRenameValue.bind(this)
	});
	transformNode(node, queryId) {
		if (!node) return node;
		this.nodeStack.push(node);
		const out = this.transformNodeImpl(node, queryId);
		this.nodeStack.pop();
		return freeze(out);
	}
	transformNodeImpl(node, queryId) {
		return this.#transformers[node.kind](node, queryId);
	}
	transformNodeList(list, queryId) {
		if (!list) return list;
		return freeze(list.map((node) => this.transformNode(node, queryId)));
	}
	transformSelectQuery(node, queryId) {
		return {
			kind: "SelectQueryNode",
			from: this.transformNode(node.from, queryId),
			selections: this.transformNodeList(node.selections, queryId),
			distinctOn: this.transformNodeList(node.distinctOn, queryId),
			joins: this.transformNodeList(node.joins, queryId),
			groupBy: this.transformNode(node.groupBy, queryId),
			orderBy: this.transformNode(node.orderBy, queryId),
			where: this.transformNode(node.where, queryId),
			frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			limit: this.transformNode(node.limit, queryId),
			offset: this.transformNode(node.offset, queryId),
			with: this.transformNode(node.with, queryId),
			having: this.transformNode(node.having, queryId),
			explain: this.transformNode(node.explain, queryId),
			setOperations: this.transformNodeList(node.setOperations, queryId),
			fetch: this.transformNode(node.fetch, queryId),
			top: this.transformNode(node.top, queryId)
		};
	}
	transformSelection(node, queryId) {
		return {
			kind: "SelectionNode",
			selection: this.transformNode(node.selection, queryId)
		};
	}
	transformColumn(node, queryId) {
		return {
			kind: "ColumnNode",
			column: this.transformNode(node.column, queryId)
		};
	}
	transformAlias(node, queryId) {
		return {
			kind: "AliasNode",
			node: this.transformNode(node.node, queryId),
			alias: this.transformNode(node.alias, queryId)
		};
	}
	transformTable(node, queryId) {
		return {
			kind: "TableNode",
			table: this.transformNode(node.table, queryId)
		};
	}
	transformFrom(node, queryId) {
		return {
			kind: "FromNode",
			froms: this.transformNodeList(node.froms, queryId)
		};
	}
	transformReference(node, queryId) {
		return {
			kind: "ReferenceNode",
			column: this.transformNode(node.column, queryId),
			table: this.transformNode(node.table, queryId)
		};
	}
	transformAnd(node, queryId) {
		return {
			kind: "AndNode",
			left: this.transformNode(node.left, queryId),
			right: this.transformNode(node.right, queryId)
		};
	}
	transformOr(node, queryId) {
		return {
			kind: "OrNode",
			left: this.transformNode(node.left, queryId),
			right: this.transformNode(node.right, queryId)
		};
	}
	transformValueList(node, queryId) {
		return {
			kind: "ValueListNode",
			values: this.transformNodeList(node.values, queryId)
		};
	}
	transformParens(node, queryId) {
		return {
			kind: "ParensNode",
			node: this.transformNode(node.node, queryId)
		};
	}
	transformJoin(node, queryId) {
		return {
			kind: "JoinNode",
			joinType: node.joinType,
			table: this.transformNode(node.table, queryId),
			on: this.transformNode(node.on, queryId)
		};
	}
	transformRaw(node, queryId) {
		return {
			kind: "RawNode",
			sqlFragments: freeze([...node.sqlFragments]),
			parameters: this.transformNodeList(node.parameters, queryId)
		};
	}
	transformWhere(node, queryId) {
		return {
			kind: "WhereNode",
			where: this.transformNode(node.where, queryId)
		};
	}
	transformInsertQuery(node, queryId) {
		return {
			kind: "InsertQueryNode",
			into: this.transformNode(node.into, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			values: this.transformNode(node.values, queryId),
			returning: this.transformNode(node.returning, queryId),
			onConflict: this.transformNode(node.onConflict, queryId),
			onDuplicateKey: this.transformNode(node.onDuplicateKey, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			with: this.transformNode(node.with, queryId),
			orAction: this.transformNode(node.orAction, queryId),
			replace: node.replace,
			explain: this.transformNode(node.explain, queryId),
			defaultValues: node.defaultValues,
			top: this.transformNode(node.top, queryId),
			output: this.transformNode(node.output, queryId)
		};
	}
	transformValues(node, queryId) {
		return {
			kind: "ValuesNode",
			values: this.transformNodeList(node.values, queryId)
		};
	}
	transformDeleteQuery(node, queryId) {
		return {
			kind: "DeleteQueryNode",
			from: this.transformNode(node.from, queryId),
			using: this.transformNode(node.using, queryId),
			joins: this.transformNodeList(node.joins, queryId),
			where: this.transformNode(node.where, queryId),
			returning: this.transformNode(node.returning, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			with: this.transformNode(node.with, queryId),
			orderBy: this.transformNode(node.orderBy, queryId),
			limit: this.transformNode(node.limit, queryId),
			explain: this.transformNode(node.explain, queryId),
			top: this.transformNode(node.top, queryId),
			output: this.transformNode(node.output, queryId)
		};
	}
	transformReturning(node, queryId) {
		return {
			kind: "ReturningNode",
			selections: this.transformNodeList(node.selections, queryId)
		};
	}
	transformCreateTable(node, queryId) {
		return {
			kind: "CreateTableNode",
			table: this.transformNode(node.table, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			constraints: this.transformNodeList(node.constraints, queryId),
			indexes: this.transformNodeList(node.indexes, queryId),
			temporary: node.temporary,
			ifNotExists: node.ifNotExists,
			onCommit: node.onCommit,
			frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			selectQuery: this.transformNode(node.selectQuery, queryId)
		};
	}
	transformColumnDefinition(node, queryId) {
		return {
			kind: "ColumnDefinitionNode",
			column: this.transformNode(node.column, queryId),
			dataType: this.transformNode(node.dataType, queryId),
			references: this.transformNode(node.references, queryId),
			primaryKey: node.primaryKey,
			autoIncrement: node.autoIncrement,
			unique: node.unique,
			notNull: node.notNull,
			unsigned: node.unsigned,
			defaultTo: this.transformNode(node.defaultTo, queryId),
			check: this.transformNode(node.check, queryId),
			generated: this.transformNode(node.generated, queryId),
			frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			nullsNotDistinct: node.nullsNotDistinct,
			identity: node.identity,
			ifNotExists: node.ifNotExists
		};
	}
	transformAddColumn(node, queryId) {
		return {
			kind: "AddColumnNode",
			column: this.transformNode(node.column, queryId)
		};
	}
	transformDropTable(node, queryId) {
		return {
			kind: "DropTableNode",
			table: this.transformNode(node.table, queryId),
			ifExists: node.ifExists,
			cascade: node.cascade,
			temporary: node.temporary
		};
	}
	transformOrderBy(node, queryId) {
		return {
			kind: "OrderByNode",
			items: this.transformNodeList(node.items, queryId)
		};
	}
	transformOrderByItem(node, queryId) {
		return {
			kind: "OrderByItemNode",
			orderBy: this.transformNode(node.orderBy, queryId),
			direction: this.transformNode(node.direction, queryId),
			collation: this.transformNode(node.collation, queryId),
			nulls: node.nulls
		};
	}
	transformGroupBy(node, queryId) {
		return {
			kind: "GroupByNode",
			items: this.transformNodeList(node.items, queryId)
		};
	}
	transformGroupByItem(node, queryId) {
		return {
			kind: "GroupByItemNode",
			groupBy: this.transformNode(node.groupBy, queryId)
		};
	}
	transformUpdateQuery(node, queryId) {
		return {
			kind: "UpdateQueryNode",
			table: this.transformNode(node.table, queryId),
			from: this.transformNode(node.from, queryId),
			joins: this.transformNodeList(node.joins, queryId),
			where: this.transformNode(node.where, queryId),
			updates: this.transformNodeList(node.updates, queryId),
			returning: this.transformNode(node.returning, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			with: this.transformNode(node.with, queryId),
			explain: this.transformNode(node.explain, queryId),
			limit: this.transformNode(node.limit, queryId),
			top: this.transformNode(node.top, queryId),
			output: this.transformNode(node.output, queryId),
			orderBy: this.transformNode(node.orderBy, queryId)
		};
	}
	transformColumnUpdate(node, queryId) {
		return {
			kind: "ColumnUpdateNode",
			column: this.transformNode(node.column, queryId),
			value: this.transformNode(node.value, queryId)
		};
	}
	transformLimit(node, queryId) {
		return {
			kind: "LimitNode",
			limit: this.transformNode(node.limit, queryId)
		};
	}
	transformOffset(node, queryId) {
		return {
			kind: "OffsetNode",
			offset: this.transformNode(node.offset, queryId)
		};
	}
	transformOnConflict(node, queryId) {
		return {
			kind: "OnConflictNode",
			columns: this.transformNodeList(node.columns, queryId),
			constraint: this.transformNode(node.constraint, queryId),
			indexExpression: this.transformNode(node.indexExpression, queryId),
			indexWhere: this.transformNode(node.indexWhere, queryId),
			updates: this.transformNodeList(node.updates, queryId),
			updateWhere: this.transformNode(node.updateWhere, queryId),
			doNothing: node.doNothing
		};
	}
	transformOnDuplicateKey(node, queryId) {
		return {
			kind: "OnDuplicateKeyNode",
			updates: this.transformNodeList(node.updates, queryId)
		};
	}
	transformCreateIndex(node, queryId) {
		return {
			kind: "CreateIndexNode",
			name: this.transformNode(node.name, queryId),
			table: this.transformNode(node.table, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			unique: node.unique,
			using: this.transformNode(node.using, queryId),
			ifNotExists: node.ifNotExists,
			where: this.transformNode(node.where, queryId),
			nullsNotDistinct: node.nullsNotDistinct
		};
	}
	transformList(node, queryId) {
		return {
			kind: "ListNode",
			items: this.transformNodeList(node.items, queryId)
		};
	}
	transformDropIndex(node, queryId) {
		return {
			kind: "DropIndexNode",
			name: this.transformNode(node.name, queryId),
			table: this.transformNode(node.table, queryId),
			ifExists: node.ifExists,
			cascade: node.cascade
		};
	}
	transformPrimaryKeyConstraint(node, queryId) {
		return {
			kind: "PrimaryKeyConstraintNode",
			columns: this.transformNodeList(node.columns, queryId),
			name: this.transformNode(node.name, queryId),
			deferrable: node.deferrable,
			initiallyDeferred: node.initiallyDeferred
		};
	}
	transformUniqueConstraint(node, queryId) {
		return {
			kind: "UniqueConstraintNode",
			columns: this.transformNodeList(node.columns, queryId),
			name: this.transformNode(node.name, queryId),
			nullsNotDistinct: node.nullsNotDistinct,
			deferrable: node.deferrable,
			initiallyDeferred: node.initiallyDeferred
		};
	}
	transformForeignKeyConstraint(node, queryId) {
		return {
			kind: "ForeignKeyConstraintNode",
			columns: this.transformNodeList(node.columns, queryId),
			references: this.transformNode(node.references, queryId),
			name: this.transformNode(node.name, queryId),
			onDelete: node.onDelete,
			onUpdate: node.onUpdate,
			deferrable: node.deferrable,
			initiallyDeferred: node.initiallyDeferred
		};
	}
	transformSetOperation(node, queryId) {
		return {
			kind: "SetOperationNode",
			operator: node.operator,
			expression: this.transformNode(node.expression, queryId),
			all: node.all
		};
	}
	transformReferences(node, queryId) {
		return {
			kind: "ReferencesNode",
			table: this.transformNode(node.table, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			onDelete: node.onDelete,
			onUpdate: node.onUpdate
		};
	}
	transformCheckConstraint(node, queryId) {
		return {
			kind: "CheckConstraintNode",
			expression: this.transformNode(node.expression, queryId),
			name: this.transformNode(node.name, queryId)
		};
	}
	transformWith(node, queryId) {
		return {
			kind: "WithNode",
			expressions: this.transformNodeList(node.expressions, queryId),
			recursive: node.recursive
		};
	}
	transformCommonTableExpression(node, queryId) {
		return {
			kind: "CommonTableExpressionNode",
			name: this.transformNode(node.name, queryId),
			materialized: node.materialized,
			expression: this.transformNode(node.expression, queryId)
		};
	}
	transformCommonTableExpressionName(node, queryId) {
		return {
			kind: "CommonTableExpressionNameNode",
			table: this.transformNode(node.table, queryId),
			columns: this.transformNodeList(node.columns, queryId)
		};
	}
	transformHaving(node, queryId) {
		return {
			kind: "HavingNode",
			having: this.transformNode(node.having, queryId)
		};
	}
	transformCreateSchema(node, queryId) {
		return {
			kind: "CreateSchemaNode",
			schema: this.transformNode(node.schema, queryId),
			ifNotExists: node.ifNotExists
		};
	}
	transformDropSchema(node, queryId) {
		return {
			kind: "DropSchemaNode",
			schema: this.transformNode(node.schema, queryId),
			ifExists: node.ifExists,
			cascade: node.cascade
		};
	}
	transformAlterTable(node, queryId) {
		return {
			kind: "AlterTableNode",
			table: this.transformNode(node.table, queryId),
			renameTo: this.transformNode(node.renameTo, queryId),
			setSchema: this.transformNode(node.setSchema, queryId),
			columnAlterations: this.transformNodeList(node.columnAlterations, queryId),
			addConstraint: this.transformNode(node.addConstraint, queryId),
			dropConstraint: this.transformNode(node.dropConstraint, queryId),
			renameConstraint: this.transformNode(node.renameConstraint, queryId),
			addIndex: this.transformNode(node.addIndex, queryId),
			dropIndex: this.transformNode(node.dropIndex, queryId)
		};
	}
	transformDropColumn(node, queryId) {
		return {
			kind: "DropColumnNode",
			column: this.transformNode(node.column, queryId),
			ifExists: node.ifExists
		};
	}
	transformRenameColumn(node, queryId) {
		return {
			kind: "RenameColumnNode",
			column: this.transformNode(node.column, queryId),
			renameTo: this.transformNode(node.renameTo, queryId)
		};
	}
	transformAlterColumn(node, queryId) {
		return {
			kind: "AlterColumnNode",
			column: this.transformNode(node.column, queryId),
			dataType: this.transformNode(node.dataType, queryId),
			dataTypeExpression: this.transformNode(node.dataTypeExpression, queryId),
			setDefault: this.transformNode(node.setDefault, queryId),
			dropDefault: node.dropDefault,
			setNotNull: node.setNotNull,
			dropNotNull: node.dropNotNull
		};
	}
	transformModifyColumn(node, queryId) {
		return {
			kind: "ModifyColumnNode",
			column: this.transformNode(node.column, queryId)
		};
	}
	transformAddConstraint(node, queryId) {
		return {
			kind: "AddConstraintNode",
			constraint: this.transformNode(node.constraint, queryId)
		};
	}
	transformDropConstraint(node, queryId) {
		return {
			kind: "DropConstraintNode",
			constraintName: this.transformNode(node.constraintName, queryId),
			ifExists: node.ifExists,
			modifier: node.modifier
		};
	}
	transformRenameConstraint(node, queryId) {
		return {
			kind: "RenameConstraintNode",
			oldName: this.transformNode(node.oldName, queryId),
			newName: this.transformNode(node.newName, queryId)
		};
	}
	transformCreateView(node, queryId) {
		return {
			kind: "CreateViewNode",
			name: this.transformNode(node.name, queryId),
			temporary: node.temporary,
			orReplace: node.orReplace,
			ifNotExists: node.ifNotExists,
			materialized: node.materialized,
			columns: this.transformNodeList(node.columns, queryId),
			as: this.transformNode(node.as, queryId)
		};
	}
	transformRefreshMaterializedView(node, queryId) {
		return {
			kind: "RefreshMaterializedViewNode",
			name: this.transformNode(node.name, queryId),
			concurrently: node.concurrently,
			withNoData: node.withNoData
		};
	}
	transformDropView(node, queryId) {
		return {
			kind: "DropViewNode",
			name: this.transformNode(node.name, queryId),
			ifExists: node.ifExists,
			materialized: node.materialized,
			cascade: node.cascade
		};
	}
	transformGenerated(node, queryId) {
		return {
			kind: "GeneratedNode",
			byDefault: node.byDefault,
			always: node.always,
			identity: node.identity,
			stored: node.stored,
			expression: this.transformNode(node.expression, queryId)
		};
	}
	transformDefaultValue(node, queryId) {
		return {
			kind: "DefaultValueNode",
			defaultValue: this.transformNode(node.defaultValue, queryId)
		};
	}
	transformOn(node, queryId) {
		return {
			kind: "OnNode",
			on: this.transformNode(node.on, queryId)
		};
	}
	transformSelectModifier(node, queryId) {
		return {
			kind: "SelectModifierNode",
			modifier: node.modifier,
			rawModifier: this.transformNode(node.rawModifier, queryId),
			of: this.transformNodeList(node.of, queryId)
		};
	}
	transformCreateType(node, queryId) {
		return {
			kind: "CreateTypeNode",
			name: this.transformNode(node.name, queryId),
			enum: this.transformNode(node.enum, queryId)
		};
	}
	transformDropType(node, queryId) {
		return {
			kind: "DropTypeNode",
			name: this.transformNode(node.name, queryId),
			additionalNames: this.transformNodeList(node.additionalNames, queryId),
			cascade: node.cascade,
			ifExists: node.ifExists
		};
	}
	transformExplain(node, queryId) {
		return {
			kind: "ExplainNode",
			format: node.format,
			options: this.transformNode(node.options, queryId)
		};
	}
	transformSchemableIdentifier(node, queryId) {
		return {
			kind: "SchemableIdentifierNode",
			schema: this.transformNode(node.schema, queryId),
			identifier: this.transformNode(node.identifier, queryId)
		};
	}
	transformAggregateFunction(node, queryId) {
		return {
			kind: "AggregateFunctionNode",
			func: node.func,
			aggregated: this.transformNodeList(node.aggregated, queryId),
			distinct: node.distinct,
			orderBy: this.transformNode(node.orderBy, queryId),
			withinGroup: this.transformNode(node.withinGroup, queryId),
			filter: this.transformNode(node.filter, queryId),
			over: this.transformNode(node.over, queryId)
		};
	}
	transformOver(node, queryId) {
		return {
			kind: "OverNode",
			orderBy: this.transformNode(node.orderBy, queryId),
			partitionBy: this.transformNode(node.partitionBy, queryId)
		};
	}
	transformPartitionBy(node, queryId) {
		return {
			kind: "PartitionByNode",
			items: this.transformNodeList(node.items, queryId)
		};
	}
	transformPartitionByItem(node, queryId) {
		return {
			kind: "PartitionByItemNode",
			partitionBy: this.transformNode(node.partitionBy, queryId)
		};
	}
	transformBinaryOperation(node, queryId) {
		return {
			kind: "BinaryOperationNode",
			leftOperand: this.transformNode(node.leftOperand, queryId),
			operator: this.transformNode(node.operator, queryId),
			rightOperand: this.transformNode(node.rightOperand, queryId)
		};
	}
	transformUnaryOperation(node, queryId) {
		return {
			kind: "UnaryOperationNode",
			operator: this.transformNode(node.operator, queryId),
			operand: this.transformNode(node.operand, queryId)
		};
	}
	transformUsing(node, queryId) {
		return {
			kind: "UsingNode",
			tables: this.transformNodeList(node.tables, queryId)
		};
	}
	transformFunction(node, queryId) {
		return {
			kind: "FunctionNode",
			func: node.func,
			arguments: this.transformNodeList(node.arguments, queryId)
		};
	}
	transformCase(node, queryId) {
		return {
			kind: "CaseNode",
			value: this.transformNode(node.value, queryId),
			when: this.transformNodeList(node.when, queryId),
			else: this.transformNode(node.else, queryId),
			isStatement: node.isStatement
		};
	}
	transformWhen(node, queryId) {
		return {
			kind: "WhenNode",
			condition: this.transformNode(node.condition, queryId),
			result: this.transformNode(node.result, queryId)
		};
	}
	transformJSONReference(node, queryId) {
		return {
			kind: "JSONReferenceNode",
			reference: this.transformNode(node.reference, queryId),
			traversal: this.transformNode(node.traversal, queryId)
		};
	}
	transformJSONPath(node, queryId) {
		return {
			kind: "JSONPathNode",
			inOperator: this.transformNode(node.inOperator, queryId),
			pathLegs: this.transformNodeList(node.pathLegs, queryId)
		};
	}
	transformJSONPathLeg(node, _queryId) {
		return {
			kind: "JSONPathLegNode",
			type: node.type,
			value: node.value
		};
	}
	transformJSONOperatorChain(node, queryId) {
		return {
			kind: "JSONOperatorChainNode",
			operator: this.transformNode(node.operator, queryId),
			values: this.transformNodeList(node.values, queryId)
		};
	}
	transformTuple(node, queryId) {
		return {
			kind: "TupleNode",
			values: this.transformNodeList(node.values, queryId)
		};
	}
	transformMergeQuery(node, queryId) {
		return {
			kind: "MergeQueryNode",
			into: this.transformNode(node.into, queryId),
			using: this.transformNode(node.using, queryId),
			whens: this.transformNodeList(node.whens, queryId),
			with: this.transformNode(node.with, queryId),
			top: this.transformNode(node.top, queryId),
			endModifiers: this.transformNodeList(node.endModifiers, queryId),
			output: this.transformNode(node.output, queryId),
			returning: this.transformNode(node.returning, queryId)
		};
	}
	transformMatched(node, _queryId) {
		return {
			kind: "MatchedNode",
			not: node.not,
			bySource: node.bySource
		};
	}
	transformAddIndex(node, queryId) {
		return {
			kind: "AddIndexNode",
			name: this.transformNode(node.name, queryId),
			columns: this.transformNodeList(node.columns, queryId),
			unique: node.unique,
			using: this.transformNode(node.using, queryId),
			ifNotExists: node.ifNotExists
		};
	}
	transformCast(node, queryId) {
		return {
			kind: "CastNode",
			expression: this.transformNode(node.expression, queryId),
			dataType: this.transformNode(node.dataType, queryId)
		};
	}
	transformFetch(node, queryId) {
		return {
			kind: "FetchNode",
			rowCount: this.transformNode(node.rowCount, queryId),
			modifier: node.modifier
		};
	}
	transformTop(node, _queryId) {
		return {
			kind: "TopNode",
			expression: node.expression,
			modifiers: node.modifiers
		};
	}
	transformOutput(node, queryId) {
		return {
			kind: "OutputNode",
			selections: this.transformNodeList(node.selections, queryId)
		};
	}
	transformAlterType(node, queryId) {
		return {
			kind: "AlterTypeNode",
			name: this.transformNode(node.name, queryId),
			addValue: this.transformNode(node.addValue, queryId),
			renameTo: this.transformNode(node.renameTo, queryId),
			renameValue: this.transformNode(node.renameValue, queryId),
			setSchema: this.transformNode(node.setSchema, queryId)
		};
	}
	transformAddValue(node, queryId) {
		return {
			kind: "AddValueNode",
			value: this.transformNode(node.value, queryId),
			ifNotExists: node.ifNotExists,
			isBefore: node.isBefore,
			neighborValue: this.transformNode(node.neighborValue, queryId)
		};
	}
	transformRenameValue(node, queryId) {
		return {
			kind: "RenameValueNode",
			oldValue: this.transformNode(node.oldValue, queryId),
			newValue: this.transformNode(node.newValue, queryId)
		};
	}
	transformDataType(node, _queryId) {
		return node;
	}
	transformSelectAll(node, _queryId) {
		return node;
	}
	transformIdentifier(node, _queryId) {
		return node;
	}
	transformValue(node, _queryId) {
		return node;
	}
	transformPrimitiveValueList(node, _queryId) {
		return node;
	}
	transformOperator(node, _queryId) {
		return node;
	}
	transformDefaultInsertValue(node, _queryId) {
		return node;
	}
	transformOrAction(node, _queryId) {
		return node;
	}
	transformCollate(node, _queryId) {
		return node;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/operation-node.js
function isOperationNode(thing) {
	return isObject(thing) && isString(thing.kind);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/root-operation-node.js
var ROOT_OPERATION_NODE_KINDS = {
	AlterTableNode: true,
	AlterTypeNode: true,
	CreateIndexNode: true,
	CreateSchemaNode: true,
	CreateTableNode: true,
	CreateTypeNode: true,
	CreateViewNode: true,
	DeleteQueryNode: true,
	DropIndexNode: true,
	DropSchemaNode: true,
	DropTableNode: true,
	DropTypeNode: true,
	RefreshMaterializedViewNode: true,
	DropViewNode: true,
	InsertQueryNode: true,
	RawNode: true,
	SelectQueryNode: true,
	UpdateQueryNode: true,
	MergeQueryNode: true
};
function isRootOperationNode(thing) {
	return isOperationNode(thing) && ROOT_OPERATION_NODE_KINDS[thing.kind] === true;
}
//#endregion
//#region node_modules/kysely/dist/plugin/with-schema/with-schema-transformer.js
var SCHEMALESS_FUNCTIONS = freeze({
	json_agg: true,
	to_json: true
});
var WithSchemaTransformer = class extends OperationNodeTransformer {
	#schema;
	#schemableIds = /* @__PURE__ */ new Set();
	#ctes = /* @__PURE__ */ new Set();
	constructor(schema) {
		super();
		this.#schema = schema;
	}
	transformNodeImpl(node, queryId) {
		if (!isRootOperationNode(node)) return super.transformNodeImpl(node, queryId);
		const ctes = this.#collectCTEs(node);
		for (const cte of ctes) this.#ctes.add(cte);
		const tables = this.#collectSchemableIds(node);
		for (const table of tables) this.#schemableIds.add(table);
		const transformed = super.transformNodeImpl(node, queryId);
		for (const table of tables) this.#schemableIds.delete(table);
		for (const cte of ctes) this.#ctes.delete(cte);
		return transformed;
	}
	transformSchemableIdentifier(node, queryId) {
		const transformed = super.transformSchemableIdentifier(node, queryId);
		if (transformed.schema || !this.#schemableIds.has(node.identifier.name)) return transformed;
		return {
			...transformed,
			schema: IdentifierNode.create(this.#schema)
		};
	}
	transformReferences(node, queryId) {
		const transformed = super.transformReferences(node, queryId);
		if (transformed.table.table.schema) return transformed;
		return {
			...transformed,
			table: TableNode.createWithSchema(this.#schema, transformed.table.table.identifier.name)
		};
	}
	transformAggregateFunction(node, queryId) {
		return {
			...super.transformAggregateFunction({
				...node,
				aggregated: []
			}, queryId),
			aggregated: this.#transformTableArgsWithoutSchemas(node, queryId, "aggregated")
		};
	}
	transformFunction(node, queryId) {
		return {
			...super.transformFunction({
				...node,
				arguments: []
			}, queryId),
			arguments: this.#transformTableArgsWithoutSchemas(node, queryId, "arguments")
		};
	}
	transformSelectModifier(node, queryId) {
		return {
			...super.transformSelectModifier({
				...node,
				of: void 0
			}, queryId),
			of: node.of?.map((item) => TableNode.is(item) && !item.table.schema ? {
				...item,
				table: this.transformIdentifier(item.table.identifier, queryId)
			} : this.transformNode(item, queryId))
		};
	}
	#transformTableArgsWithoutSchemas(node, queryId, argsKey) {
		return SCHEMALESS_FUNCTIONS[node.func] ? node[argsKey].map((arg) => !TableNode.is(arg) || arg.table.schema ? this.transformNode(arg, queryId) : {
			...arg,
			table: this.transformIdentifier(arg.table.identifier, queryId)
		}) : this.transformNodeList(node[argsKey], queryId);
	}
	#collectSchemableIds(node) {
		const schemableIds = /* @__PURE__ */ new Set();
		if ("name" in node && node.name && SchemableIdentifierNode.is(node.name)) this.#collectSchemableId(node.name, schemableIds);
		if ("from" in node && node.from) for (const from of node.from.froms) this.#collectSchemableIdsFromTableExpr(from, schemableIds);
		if ("into" in node && node.into) this.#collectSchemableIdsFromTableExpr(node.into, schemableIds);
		if ("table" in node && node.table) this.#collectSchemableIdsFromTableExpr(node.table, schemableIds);
		if ("joins" in node && node.joins) for (const join of node.joins) this.#collectSchemableIdsFromTableExpr(join.table, schemableIds);
		if ("using" in node && node.using) {
			if (JoinNode.is(node.using)) this.#collectSchemableIdsFromTableExpr(node.using.table, schemableIds);
			else this.#collectSchemableIdsFromTableExpr(node.using, schemableIds);
		}
		return schemableIds;
	}
	#collectCTEs(node) {
		const ctes = /* @__PURE__ */ new Set();
		if ("with" in node && node.with) this.#collectCTEIds(node.with, ctes);
		return ctes;
	}
	#collectSchemableIdsFromTableExpr(node, schemableIds) {
		if (TableNode.is(node)) return this.#collectSchemableId(node.table, schemableIds);
		if (AliasNode.is(node) && TableNode.is(node.node)) return this.#collectSchemableId(node.node.table, schemableIds);
		if (ListNode.is(node)) {
			for (const table of node.items) this.#collectSchemableIdsFromTableExpr(table, schemableIds);
			return;
		}
		if (UsingNode.is(node)) {
			for (const table of node.tables) this.#collectSchemableIdsFromTableExpr(table, schemableIds);
			return;
		}
	}
	#collectSchemableId(node, schemableIds) {
		const id = node.identifier.name;
		if (!this.#schemableIds.has(id) && !this.#ctes.has(id)) schemableIds.add(id);
	}
	#collectCTEIds(node, ctes) {
		for (const expr of node.expressions) {
			const cteId = expr.name.table.table.identifier.name;
			if (!this.#ctes.has(cteId)) ctes.add(cteId);
		}
	}
};
//#endregion
//#region node_modules/kysely/dist/plugin/with-schema/with-schema-plugin.js
var WithSchemaPlugin = class {
	#transformer;
	constructor(schema) {
		this.#transformer = new WithSchemaTransformer(schema);
	}
	transformQuery(args) {
		return this.#transformer.transformNode(args.node, args.queryId);
	}
	async transformResult(args) {
		return args.result;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/matched-node.js
/**
* @internal
*/
var MatchedNode = freeze({
	is(node) {
		return node.kind === "MatchedNode";
	},
	create(not, bySource = false) {
		return freeze({
			kind: "MatchedNode",
			not,
			bySource
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/merge-parser.js
function parseMergeWhen(type, args, refRight) {
	return WhenNode.create(parseFilterList([MatchedNode.create(!type.isMatched, type.bySource), ...args && args.length > 0 ? [args.length === 3 && refRight ? parseReferentialBinaryOperation(args[0], args[1], args[2]) : parseValueBinaryOperationOrExpression(args)] : []], "and", false));
}
function parseMergeThen(result) {
	if (isString(result)) return RawNode.create([result], []);
	if (isOperationNodeSource(result)) return result.toOperationNode();
	return result;
}
//#endregion
//#region node_modules/kysely/dist/util/deferred.js
var Deferred = class {
	#promise;
	#resolve;
	#reject;
	constructor() {
		this.#promise = new Promise((resolve, reject) => {
			this.#reject = reject;
			this.#resolve = resolve;
		});
	}
	get promise() {
		return this.#promise;
	}
	resolve = (value) => {
		this.#resolve?.(value);
		this.#resolve = this.#reject = void 0;
	};
	reject = (reason) => {
		this.#reject?.(reason);
		this.#reject = this.#resolve = void 0;
	};
};
//#endregion
//#region node_modules/kysely/dist/util/provide-controlled-connection.js
async function provideControlledConnection(connectionProvider, options) {
	const connectionDefer = new Deferred();
	const connectionReleaseDefer = new Deferred();
	connectionProvider.provideConnection(async (connection) => {
		connectionDefer.resolve(connection);
		return await connectionReleaseDefer.promise;
	}, options).catch((ex) => connectionDefer.reject(ex));
	return freeze({
		connection: await connectionDefer.promise,
		release: connectionReleaseDefer.resolve
	});
}
//#endregion
//#region node_modules/kysely/dist/util/abort.js
function getInflightQueryAbortHandler(abortStrategy = "ignore query", connection, beforeThrow) {
	if (abortStrategy === "ignore query") return;
	if (abortStrategy === "cancel query") {
		const handler = connection.cancelQuery;
		if (!handler) {
			beforeThrow();
			throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, connection.killSession ? "kill session" : void 0);
		}
		return handler.bind(connection);
	}
	if (abortStrategy === "kill session") {
		const handler = connection.killSession;
		if (!handler) {
			beforeThrow();
			throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, connection.cancelQuery ? "cancel query" : void 0);
		}
		return handler.bind(connection);
	}
	beforeThrow();
	throw new Error(`Unexpected \`inflightQueryAbortStrategy\`: "${abortStrategy}"`);
}
function throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, alt) {
	throw new Error(`This dialect doesn't support \`inflightQueryAbortStrategy\` "${abortStrategy}". Use "ignore query"${alt ? ` or "${alt}"` : ""} instead.`);
}
function assertNotAborted(signal, timing, beforeThrow) {
	if (signal?.aborted) {
		beforeThrow?.();
		throwReasonWithTiming(signal.reason, timing);
	}
}
function throwReasonWithTiming(reason, timing) {
	decorateWithTiming(reason, timing);
	throw reason;
}
var ABORTED = {};
async function waitOrAbort(promise, signal, name, onAbort) {
	if (!signal) return promise;
	assertNotAborted(signal, `before ${name}`, onAbort);
	const { promise: abortPromise, resolve } = new Deferred();
	const abortListener = () => resolve(ABORTED);
	signal.addEventListener("abort", abortListener);
	try {
		assertNotAborted(signal, `before ${name}`, onAbort);
		const result = await Promise.race([promise, abortPromise]);
		if (result !== ABORTED) return result;
		onAbort?.();
		throwReasonWithTiming(signal.reason, `during ${name}`);
	} finally {
		signal.removeEventListener("abort", abortListener);
		resolve(ABORTED);
	}
}
function printBackgroundFail(name) {
	return (reason) => console.error(`\`${name}\` failed in the background after abortion: ${getMessage(reason)}`);
}
function decorateWithTiming(reason, timing) {
	if (reason !== null && typeof reason === "object" && !Object.isFrozen(reason)) Object.defineProperty(reason, "__kysely_timing__", {
		configurable: true,
		enumerable: false,
		value: timing,
		writable: false
	});
}
//#endregion
//#region node_modules/kysely/dist/query-executor/query-executor-base.js
var NO_PLUGINS = freeze([]);
var QueryExecutorBase = class {
	#plugins;
	constructor(plugins = NO_PLUGINS) {
		this.#plugins = plugins;
	}
	get plugins() {
		return this.#plugins;
	}
	transformQuery(node, queryId) {
		for (const plugin of this.#plugins) {
			const transformedNode = plugin.transformQuery({
				node,
				queryId
			});
			if (transformedNode.kind === node.kind) node = transformedNode;
			else throw new Error([
				`KyselyPlugin.transformQuery must return a node`,
				`of the same kind that was given to it.`,
				`The plugin was given a ${node.kind}`,
				`but it returned a ${transformedNode.kind}`
			].join(" "));
		}
		return node;
	}
	async executeQuery(compiledQuery, options) {
		const { inflightQueryAbortStrategy = "ignore query", signal } = options || {};
		if (!signal) {
			const result = await this.provideConnection(async (connection) => {
				return await connection.executeQuery(compiledQuery);
			}, options);
			return await this.#transformResult(result, compiledQuery.queryId);
		}
		assertNotAborted(signal, "before query execution");
		options = freeze({ signal });
		const { connection, release } = await provideControlledConnection(this, options);
		const controlConnectionProvider = this.provideConnection.bind(this);
		const { promise: abortPromise, resolve } = new Deferred();
		const abortListener = () => resolve(ABORTED);
		signal.addEventListener("abort", abortListener, { once: true });
		try {
			assertNotAborted(signal, "before query execution", release);
			const inflightQueryAbortHandler = getInflightQueryAbortHandler(inflightQueryAbortStrategy, connection, release);
			if (inflightQueryAbortHandler && connection.collectSessionInfo) {
				assertNotAborted(signal, "before query execution", release);
				const collectPromise = connection.collectSessionInfo();
				if (await Promise.race([abortPromise, collectPromise]).catch((error) => {
					release();
					throw error;
				}) === ABORTED) {
					collectPromise.catch(printBackgroundFail("collectSessionInfo")).finally(release);
					throwReasonWithTiming(signal.reason, "before query execution");
				}
			}
			const queryPromise = connection.executeQuery(compiledQuery, options);
			const result = await Promise.race([abortPromise, queryPromise]).catch((error) => {
				release();
				throw error;
			});
			if (result === ABORTED) {
				Promise.allSettled([queryPromise.catch(printBackgroundFail("query")), inflightQueryAbortHandler?.(controlConnectionProvider).catch(printBackgroundFail("inflightQueryAbortHandler"))]).finally(release);
				throwReasonWithTiming(signal.reason, "during query execution");
			} else release();
			const transformPromise = this.#transformResult(result, compiledQuery.queryId, options);
			const transformedResult = await Promise.race([abortPromise, transformPromise]);
			if (transformedResult === ABORTED) {
				transformPromise.catch(printBackgroundFail("plugins.transformResult"));
				throwReasonWithTiming(signal.reason, "during result transformation");
			}
			return transformedResult;
		} finally {
			resolve(ABORTED);
			signal.removeEventListener("abort", abortListener);
		}
	}
	async *stream(compiledQuery, chunkSize, options) {
		const { signal } = options || {};
		if (!signal) {
			const { connection, release } = await provideControlledConnection(this);
			try {
				for await (const result of connection.streamQuery(compiledQuery, chunkSize)) yield await this.#transformResult(result, compiledQuery.queryId, options);
			} finally {
				release();
			}
			return;
		}
		options = freeze({ signal });
		assertNotAborted(signal, "before connection acquisition");
		const { connection, release } = await provideControlledConnection(this, options);
		const { promise: abortPromise, resolve } = new Deferred();
		const abortListener = () => resolve(ABORTED);
		signal.addEventListener("abort", abortListener, { once: true });
		let asyncIterator;
		let releasePrerequisite;
		assertNotAborted(signal, "before query streaming", release);
		const { queryId } = compiledQuery;
		try {
			asyncIterator = connection.streamQuery(compiledQuery, chunkSize, options);
			while (true) {
				assertNotAborted(signal, "during query streaming");
				const nextPromise = asyncIterator.next();
				const result = await Promise.race([abortPromise, nextPromise]);
				if (result === ABORTED) {
					releasePrerequisite = nextPromise.catch(printBackgroundFail("iterator.next"));
					throwReasonWithTiming(signal.reason, "during query streaming");
				}
				if (result.done) break;
				const transformPromise = this.#transformResult(result.value, queryId, options);
				const transformedResult = await Promise.race([abortPromise, transformPromise]);
				if (transformedResult === ABORTED) {
					releasePrerequisite = transformPromise.catch(printBackgroundFail("plugins.transformResult"));
					throwReasonWithTiming(signal.reason, "during result transformation");
				}
				yield transformedResult;
			}
		} finally {
			resolve(ABORTED);
			signal.removeEventListener("abort", abortListener);
			const cleanup = (asyncIterator?.return?.() || Promise.resolve()).finally(() => releasePrerequisite).finally(release);
			if (!releasePrerequisite) await cleanup;
		}
	}
	async #transformResult(result, queryId, options) {
		const { signal } = options || {};
		for (const plugin of this.#plugins) result = await plugin.transformResult(freeze({
			queryId,
			result,
			signal
		}));
		return result;
	}
};
var NOOP_QUERY_EXECUTOR = new class NoopQueryExecutor extends QueryExecutorBase {
	get adapter() {
		throw new Error("this query cannot be compiled to SQL");
	}
	compileQuery() {
		throw new Error("this query cannot be compiled to SQL");
	}
	provideConnection() {
		throw new Error("this query cannot be executed");
	}
	withConnectionProvider() {
		throw new Error("this query cannot have a connection provider");
	}
	withPlugin(plugin) {
		return new NoopQueryExecutor([...this.plugins, plugin]);
	}
	withPlugins(plugins) {
		return new NoopQueryExecutor([...this.plugins, ...plugins]);
	}
	withPluginAtFront(plugin) {
		return new NoopQueryExecutor([plugin, ...this.plugins]);
	}
	withoutPlugins() {
		return new NoopQueryExecutor([]);
	}
}();
//#endregion
//#region node_modules/kysely/dist/query-builder/merge-result.js
var MergeResult = class {
	numChangedRows;
	constructor(numChangedRows) {
		this.numChangedRows = numChangedRows;
	}
};
//#endregion
//#region node_modules/kysely/dist/query-builder/merge-query-builder.js
var MergeQueryBuilder = class MergeQueryBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db
	*   .mergeInto('person')
	*   .using('pet', 'pet.owner_id', 'person.id')
	*   .whenMatched()
	*   .thenDelete()
	*   .modifyEnd(sql.raw('-- this is a comment'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person" using "pet" on "pet"."owner_id" = "person"."id" when matched then delete -- this is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* Changes a `merge into` query to an `merge top into` query.
	*
	* `top` clause is only supported by some dialects like MS SQL Server.
	*
	* ### Examples
	*
	* Affect 5 matched rows at most:
	*
	* ```ts
	* await db.mergeInto('person')
	*   .top(5)
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDelete()
	*   .execute()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* merge top(5) into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   delete
	* ```
	*
	* Affect 50% of matched rows:
	*
	* ```ts
	* await db.mergeInto('person')
	*   .top(50, 'percent')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDelete()
	*   .execute()
	* ```
	*
	* The generated SQL (MS SQL Server):
	*
	* ```sql
	* merge top(50) percent into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   delete
	* ```
	*/
	top(expression, modifiers) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	using(...args) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithUsing(this.#props.queryNode, parseJoin("Using", args))
		});
	}
	returning(args) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(args))
		});
	}
	returningAll(table) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
		});
	}
	output(args) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new MergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
};
var WheneableMergeQueryBuilder = class WheneableMergeQueryBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db
	*   .mergeInto('person')
	*   .using('pet', 'pet.owner_id', 'person.id')
	*   .whenMatched()
	*   .thenDelete()
	*   .modifyEnd(sql.raw('-- this is a comment'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person" using "pet" on "pet"."owner_id" = "person"."id" when matched then delete -- this is a comment
	* ```
	*/
	modifyEnd(modifier) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
		});
	}
	/**
	* See {@link MergeQueryBuilder.top}.
	*/
	top(expression, modifiers) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	/**
	* Adds a simple `when matched` clause to the query.
	*
	* For a `when matched` clause with an `and` condition, see {@link whenMatchedAnd}.
	*
	* For a simple `when not matched` clause, see {@link whenNotMatched}.
	*
	* For a `when not matched` clause with an `and` condition, see {@link whenNotMatchedAnd}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDelete()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   delete
	* ```
	*/
	whenMatched() {
		return this.#whenMatched([]);
	}
	whenMatchedAnd(...args) {
		return this.#whenMatched(args);
	}
	/**
	* Adds the `when matched` clause to the query with an `and` condition. But unlike
	* {@link whenMatchedAnd}, this method accepts a column reference as the 3rd argument.
	*
	* This method is similar to {@link SelectQueryBuilder.whereRef}, so see the documentation
	* for that method for more examples.
	*/
	whenMatchedAndRef(lhs, op, rhs) {
		return this.#whenMatched([
			lhs,
			op,
			rhs
		], true);
	}
	#whenMatched(args, refRight) {
		return new MatchedThenableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithWhen(this.#props.queryNode, parseMergeWhen({ isMatched: true }, args, refRight))
		});
	}
	/**
	* Adds a simple `when not matched` clause to the query.
	*
	* For a `when not matched` clause with an `and` condition, see {@link whenNotMatchedAnd}.
	*
	* For a simple `when matched` clause, see {@link whenMatched}.
	*
	* For a `when matched` clause with an `and` condition, see {@link whenMatchedAnd}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenNotMatched()
	*   .thenInsertValues({
	*     first_name: 'John',
	*     last_name: 'Doe',
	*   })
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when not matched then
	*   insert ("first_name", "last_name") values ($1, $2)
	* ```
	*/
	whenNotMatched() {
		return this.#whenNotMatched([]);
	}
	whenNotMatchedAnd(...args) {
		return this.#whenNotMatched(args);
	}
	/**
	* Adds the `when not matched` clause to the query with an `and` condition. But unlike
	* {@link whenNotMatchedAnd}, this method accepts a column reference as the 3rd argument.
	*
	* Unlike {@link whenMatchedAndRef}, you cannot reference columns from the target table.
	*
	* This method is similar to {@link SelectQueryBuilder.whereRef}, so see the documentation
	* for that method for more examples.
	*/
	whenNotMatchedAndRef(lhs, op, rhs) {
		return this.#whenNotMatched([
			lhs,
			op,
			rhs
		], true);
	}
	/**
	* Adds a simple `when not matched by source` clause to the query.
	*
	* Supported in MS SQL Server.
	*
	* Similar to {@link whenNotMatched}, but returns a {@link MatchedThenableMergeQueryBuilder}.
	*/
	whenNotMatchedBySource() {
		return this.#whenNotMatched([], false, true);
	}
	whenNotMatchedBySourceAnd(...args) {
		return this.#whenNotMatched(args, false, true);
	}
	/**
	* Adds the `when not matched by source` clause to the query with an `and` condition.
	*
	* Similar to {@link whenNotMatchedAndRef}, but you can reference columns from
	* the target table, and not from source table and returns a {@link MatchedThenableMergeQueryBuilder}.
	*/
	whenNotMatchedBySourceAndRef(lhs, op, rhs) {
		return this.#whenNotMatched([
			lhs,
			op,
			rhs
		], true, true);
	}
	returning(args) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(args))
		});
	}
	returningAll(table) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
		});
	}
	output(args) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
		});
	}
	outputAll(table) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
		});
	}
	#whenNotMatched(args, refRight = false, bySource = false) {
		const props = {
			...this.#props,
			queryNode: MergeQueryNode.cloneWithWhen(this.#props.queryNode, parseMergeWhen({
				isMatched: false,
				bySource
			}, args, refRight))
		};
		return new (bySource ? MatchedThenableMergeQueryBuilder : NotMatchedThenableMergeQueryBuilder)(props);
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*
	* If you want to conditionally call a method on `this`, see
	* the {@link $if} method.
	*
	* ### Examples
	*
	* The next example uses a helper function `log` to log a query:
	*
	* ```ts
	* import type { Compilable } from 'kysely'
	*
	* function log<T extends Compilable>(qb: T): T {
	*   console.log(qb.compile())
	*   return qb
	* }
	*
	* await db.updateTable('person')
	*   .set({ first_name: 'John' })
	*   .$call(log)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Call `func(this)` if `condition` is true.
	*
	* This method is especially handy with optional selects. Any `returning` or `returningAll`
	* method calls add columns as optional fields to the output type when called inside
	* the `func` callback. This is because we can't know if those selections were actually
	* made before running the code.
	*
	* You can also call any other methods inside the callback.
	*
	* ### Examples
	*
	* ```ts
	* import type { PersonUpdate } from 'type-editor' // imaginary module
	*
	* async function updatePerson(id: number, updates: PersonUpdate, returnLastName: boolean) {
	*   return await db
	*     .updateTable('person')
	*     .set(updates)
	*     .where('id', '=', id)
	*     .returning(['id', 'first_name'])
	*     .$if(returnLastName, (qb) => qb.returning('last_name'))
	*     .executeTakeFirstOrThrow()
	* }
	* ```
	*
	* Any selections added inside the `if` callback will be added as optional fields to the
	* output type since we can't know if the selections were actually made before running
	* the code. In the example above the return type of the `updatePerson` function is:
	*
	* ```ts
	* Promise<{
	*   id: number
	*   first_name: string
	*   last_name?: string
	* }>
	* ```
	*/
	$if(condition, func) {
		if (condition) return func(this);
		return new WheneableMergeQueryBuilder({ ...this.#props });
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		const result = await this.#props.executor.executeQuery(compiledQuery, options);
		const { adapter } = this.#props.executor;
		const query = compiledQuery.query;
		if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
		return [new MergeResult(result.numAffectedRows)];
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
};
var MatchedThenableMergeQueryBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Performs the `delete` action.
	*
	* To perform the `do nothing` action, see {@link thenDoNothing}.
	*
	* To perform the `update` action, see {@link thenUpdate} or {@link thenUpdateSet}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDelete()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   delete
	* ```
	*/
	thenDelete() {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("delete"))
		});
	}
	/**
	* Performs the `do nothing` action.
	*
	* This is supported in PostgreSQL.
	*
	* To perform the `delete` action, see {@link thenDelete}.
	*
	* To perform the `update` action, see {@link thenUpdate} or {@link thenUpdateSet}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenDoNothing()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   do nothing
	* ```
	*/
	thenDoNothing() {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("do nothing"))
		});
	}
	/**
	* Perform an `update` operation with a full-fledged {@link UpdateQueryBuilder}.
	* This is handy when multiple `set` invocations are needed.
	*
	* For a shorthand version of this method, see {@link thenUpdateSet}.
	*
	* To perform the `delete` action, see {@link thenDelete}.
	*
	* To perform the `do nothing` action, see {@link thenDoNothing}.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenMatched()
	*   .thenUpdate((ub) => ub
	*     .set(sql`metadata['has_pets']`, 'Y')
	*     .set({
	*       updated_at: new Date().toISOString(),
	*     })
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when matched then
	*   update set metadata['has_pets'] = $1, "updated_at" = $2
	* ```
	*/
	thenUpdate(set) {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen(set(new UpdateQueryBuilder({
				queryId: this.#props.queryId,
				executor: NOOP_QUERY_EXECUTOR,
				queryNode: UpdateQueryNode.createWithoutTable()
			}))))
		});
	}
	thenUpdateSet(...args) {
		return this.thenUpdate((ub) => ub.set(...args));
	}
};
var NotMatchedThenableMergeQueryBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Performs the `do nothing` action.
	*
	* This is supported in PostgreSQL.
	*
	* To perform the `insert` action, see {@link thenInsertValues}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db.mergeInto('person')
	*   .using('pet', 'person.id', 'pet.owner_id')
	*   .whenNotMatched()
	*   .thenDoNothing()
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet" on "person"."id" = "pet"."owner_id"
	* when not matched then
	*   do nothing
	* ```
	*/
	thenDoNothing() {
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("do nothing"))
		});
	}
	thenInsertValues(insert) {
		const [columns, values] = parseInsertExpression(insert);
		return new WheneableMergeQueryBuilder({
			...this.#props,
			queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen(InsertQueryNode.cloneWith(InsertQueryNode.createWithoutInto(), {
				columns,
				values
			})))
		});
	}
};
//#endregion
//#region node_modules/kysely/dist/query-creator.js
var QueryCreator = class QueryCreator {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Creates a `select` query builder for the given table or tables.
	*
	* The tables passed to this method are built as the query's `from` clause.
	*
	* ### Examples
	*
	* Create a select query for one table:
	*
	* ```ts
	* db.selectFrom('person').selectAll()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select * from "person"
	* ```
	*
	* Create a select query for one table with an alias:
	*
	* ```ts
	* const persons = await db.selectFrom('person as p')
	*   .select(['p.id', 'first_name'])
	*   .execute()
	*
	* console.log(persons[0].id)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "p"."id", "first_name" from "person" as "p"
	* ```
	*
	* Create a select query from a subquery:
	*
	* ```ts
	* const persons = await db.selectFrom(
	*     (eb) => eb.selectFrom('person').select('person.id as identifier').as('p')
	*   )
	*   .select('p.identifier')
	*   .execute()
	*
	* console.log(persons[0].identifier)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "p"."identifier",
	* from (
	*   select "person"."id" as "identifier" from "person"
	* ) as p
	* ```
	*
	* Create a select query from raw sql:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* const items = await db
	*   .selectFrom(sql<{ one: number }>`(select 1 as one)`.as('q'))
	*   .select('q.one')
	*   .execute()
	*
	* console.log(items[0].one)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "q"."one",
	* from (
	*   select 1 as one
	* ) as q
	* ```
	*
	* When you use the `sql` tag you need to also provide the result type of the
	* raw snippet / query so that Kysely can figure out what columns are
	* available for the rest of the query.
	*
	* The `selectFrom` method also accepts an array for multiple tables. All
	* the above examples can also be used in an array.
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* const items = await db.selectFrom([
	*     'person as p',
	*     db.selectFrom('pet').select('pet.species').as('a'),
	*     sql<{ one: number }>`(select 1 as one)`.as('q')
	*   ])
	*   .select(['p.id', 'a.species', 'q.one'])
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "p".id, "a"."species", "q"."one"
	* from
	*   "person" as "p",
	*   (select "pet"."species" from "pet") as a,
	*   (select 1 as one) as "q"
	* ```
	*/
	selectFrom(from) {
		return createSelectQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(from), this.#props.withNode)
		});
	}
	selectNoFrom(selection) {
		return createSelectQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: SelectQueryNode.cloneWithSelections(SelectQueryNode.create(this.#props.withNode), parseSelectArg(selection))
		});
	}
	/**
	* Creates an insert query.
	*
	* The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
	* has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
	* the inserted row if the db returned one.
	*
	* See the {@link InsertQueryBuilder.values | values} method for more info and examples. Also see
	* the {@link ReturningInterface.returning | returning} method for a way to return columns
	* on supported databases like PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .insertInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston'
	*   })
	*   .executeTakeFirst()
	*
	* console.log(result.insertId)
	* ```
	*
	* Some databases like PostgreSQL support the `returning` method:
	*
	* ```ts
	* const { id } = await db
	*   .insertInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston'
	*   })
	*   .returning('id')
	*   .executeTakeFirstOrThrow()
	* ```
	*/
	insertInto(table) {
		return new InsertQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: InsertQueryNode.create(parseTable(table), this.#props.withNode)
		});
	}
	/**
	* Creates a "replace into" query.
	*
	* This is only supported by some dialects like MySQL or SQLite.
	*
	* Similar to MySQL's {@link InsertQueryBuilder.onDuplicateKeyUpdate} that deletes
	* and inserts values on collision instead of updating existing rows.
	*
	* An alias of SQLite's {@link InsertQueryBuilder.orReplace}.
	*
	* The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
	* has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
	* the inserted row if the db returned one.
	*
	* See the {@link InsertQueryBuilder.values | values} method for more info and examples.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .replaceInto('person')
	*   .values({
	*     first_name: 'Jennifer',
	*     last_name: 'Aniston'
	*   })
	*   .executeTakeFirstOrThrow()
	*
	* console.log(result.insertId)
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* replace into `person` (`first_name`, `last_name`) values (?, ?)
	* ```
	*/
	replaceInto(table) {
		return new InsertQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: InsertQueryNode.create(parseTable(table), this.#props.withNode, true)
		});
	}
	/**
	* Creates a delete query.
	*
	* See the {@link DeleteQueryBuilder.where} method for examples on how to specify
	* a where clause for the delete operation.
	*
	* The return value of the query is an instance of {@link DeleteResult}.
	*
	* ### Examples
	*
	* <!-- siteExample("delete", "Single row", 10) -->
	*
	* Delete a single row:
	*
	* ```ts
	* const result = await db
	*   .deleteFrom('person')
	*   .where('person.id', '=', 1)
	*   .executeTakeFirst()
	*
	* console.log(result.numDeletedRows)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* delete from "person" where "person"."id" = $1
	* ```
	*
	* Some databases such as MySQL support deleting from multiple tables:
	*
	* ```ts
	* const result = await db
	*   .deleteFrom(['person', 'pet'])
	*   .using('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .where('person.id', '=', 1)
	*   .executeTakeFirst()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* delete from `person`, `pet`
	* using `person`
	* inner join `pet` on `pet`.`owner_id` = `person`.`id`
	* where `person`.`id` = ?
	* ```
	*/
	deleteFrom(from) {
		return new DeleteQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: DeleteQueryNode.create(parseTableExpressionOrList(from), this.#props.withNode)
		});
	}
	/**
	* Creates an update query.
	*
	* See the {@link UpdateQueryBuilder.where} method for examples on how to specify
	* a where clause for the update operation.
	*
	* See the {@link UpdateQueryBuilder.set} method for examples on how to
	* specify the updates.
	*
	* The return value of the query is an {@link UpdateResult}.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .updateTable('person')
	*   .set({ first_name: 'Jennifer' })
	*   .where('person.id', '=', 1)
	*   .executeTakeFirst()
	*
	* console.log(result.numUpdatedRows)
	* ```
	*/
	updateTable(tables) {
		return new UpdateQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: UpdateQueryNode.create(parseTableExpressionOrList(tables), this.#props.withNode)
		});
	}
	/**
	* Creates a merge query.
	*
	* The return value of the query is a {@link MergeResult}.
	*
	* See the {@link MergeQueryBuilder.using} method for examples on how to specify
	* the other table.
	*
	* ### Examples
	*
	* <!-- siteExample("merge", "Source row existence", 10) -->
	*
	* Update a target column based on the existence of a source row:
	*
	* ```ts
	* const result = await db
	*   .mergeInto('person as target')
	*   .using('pet as source', 'source.owner_id', 'target.id')
	*   .whenMatchedAnd('target.has_pets', '!=', 'Y')
	*   .thenUpdateSet({ has_pets: 'Y' })
	*   .whenNotMatchedBySourceAnd('target.has_pets', '=', 'Y')
	*   .thenUpdateSet({ has_pets: 'N' })
	*   .executeTakeFirstOrThrow()
	*
	* console.log(result.numChangedRows)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "person"
	* using "pet"
	* on "pet"."owner_id" = "person"."id"
	* when matched and "has_pets" != $1
	* then update set "has_pets" = $2
	* when not matched by source and "has_pets" = $3
	* then update set "has_pets" = $4
	* ```
	*
	* <!-- siteExample("merge", "Temporary changes table", 20) -->
	*
	* Merge new entries from a temporary changes table:
	*
	* ```ts
	* const result = await db
	*   .mergeInto('wine as target')
	*   .using(
	*     'wine_stock_change as source',
	*     'source.wine_name',
	*     'target.name',
	*   )
	*   .whenNotMatchedAnd('source.stock_delta', '>', 0)
	*   .thenInsertValues(({ ref }) => ({
	*     name: ref('source.wine_name'),
	*     stock: ref('source.stock_delta'),
	*   }))
	*   .whenMatchedAnd(
	*     (eb) => eb('target.stock', '+', eb.ref('source.stock_delta')),
	*     '>',
	*     0,
	*   )
	*   .thenUpdateSet('stock', (eb) =>
	*     eb('target.stock', '+', eb.ref('source.stock_delta')),
	*   )
	*   .whenMatched()
	*   .thenDelete()
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* merge into "wine" as "target"
	* using "wine_stock_change" as "source"
	* on "source"."wine_name" = "target"."name"
	* when not matched and "source"."stock_delta" > $1
	* then insert ("name", "stock") values ("source"."wine_name", "source"."stock_delta")
	* when matched and "target"."stock" + "source"."stock_delta" > $2
	* then update set "stock" = "target"."stock" + "source"."stock_delta"
	* when matched
	* then delete
	* ```
	*/
	mergeInto(targetTable) {
		return new MergeQueryBuilder({
			queryId: createQueryId(),
			executor: this.#props.executor,
			queryNode: MergeQueryNode.create(parseAliasedTable(targetTable), this.#props.withNode)
		});
	}
	/**
	* Creates a `with` query (Common Table Expression).
	*
	* ### Examples
	*
	* <!-- siteExample("cte", "Simple selects", 10) -->
	*
	* Common table expressions (CTE) are a great way to modularize complex queries.
	* Essentially they allow you to run multiple separate queries within a
	* single roundtrip to the DB.
	*
	* Since CTEs are a part of the main query, query optimizers inside DB
	* engines are able to optimize the overall query. For example, postgres
	* is able to inline the CTEs inside the using queries if it decides it's
	* faster.
	*
	* ```ts
	* const result = await db
	*   // Create a CTE called `jennifers` that selects all
	*   // persons named 'Jennifer'.
	*   .with(
	*     'jennifers',
	*     db
	*       .selectFrom('person')
	*       .where('first_name', '=', 'Jennifer')
	*       .select(['id', 'age']),
	*   )
	*   // Select all rows from the `jennifers` CTE and
	*   // further filter it.
	*   // To refer to a CTE in another CTE, use the callback variant of `with`.
	*   .with('adult_jennifers', (db) =>
	*     db.selectFrom('jennifers').where('age', '>', 18).select(['id', 'age']),
	*   )
	*   // Finally select all adult jennifers that are
	*   // also younger than 60.
	*   .selectFrom('adult_jennifers')
	*   .where('age', '<', 60)
	*   .selectAll()
	*   .execute()
	* ```
	*
	* <!-- siteExample("cte", "Inserts, updates and deletions", 20) -->
	*
	* Some databases like postgres also allow you to run other queries than selects
	* in CTEs. On these databases CTEs are extremely powerful:
	*
	* ```ts
	* const result = await db
	*   .with('new_person', (db) => db
	*     .insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       age: 35,
	*     })
	*     .returning('id')
	*   )
	*   .with('new_pet', (db) => db
	*     .insertInto('pet')
	*     .values({
	*       name: 'Doggo',
	*       species: 'dog',
	*       is_favorite: true,
	*       // Use the id of the person we just inserted.
	*       owner_id: db
	*         .selectFrom('new_person')
	*         .select('id')
	*     })
	*     .returning('id')
	*   )
	*   .selectFrom(['new_person', 'new_pet'])
	*   .select([
	*     'new_person.id as person_id',
	*     'new_pet.id as pet_id'
	*   ])
	*   .execute()
	* ```
	*
	* The CTE name can optionally specify column names in addition to
	* a name. In that case Kysely requires the expression to retun
	* rows with the same columns.
	*
	* ```ts
	* await db
	*   .with('jennifers(id, age)', (db) => db
	*     .selectFrom('person')
	*     .where('first_name', '=', 'Jennifer')
	*     // This is ok since we return columns with the same
	*     // names as specified by `jennifers(id, age)`.
	*     .select(['id', 'age'])
	*   )
	*   .selectFrom('jennifers')
	*   .selectAll()
	*   .execute()
	* ```
	*
	* The first argument can also be a callback. The callback is passed
	* a `CTEBuilder` instance that can be used to configure the CTE:
	*
	* ```ts
	* await db
	*   .with(
	*     (cte) => cte('jennifers').materialized(),
	*     (db) => db
	*       .selectFrom('person')
	*       .where('first_name', '=', 'Jennifer')
	*       .select(['id', 'age'])
	*   )
	*   .selectFrom('jennifers')
	*   .selectAll()
	*   .execute()
	* ```
	*/
	with(nameOrBuilder, expression) {
		const cte = parseCommonTableExpression(nameOrBuilder, expression);
		return new QueryCreator({
			...this.#props,
			withNode: this.#props.withNode ? WithNode.cloneWithExpression(this.#props.withNode, cte) : WithNode.create(cte)
		});
	}
	/**
	* Creates a recursive `with` query (Common Table Expression).
	*
	* Note that recursiveness is a property of the whole `with` statement.
	* You cannot have recursive and non-recursive CTEs in a same `with` statement.
	* Therefore the recursiveness is determined by the **first** `with` or
	* `withRecusive` call you make.
	*
	* See the {@link with} method for examples and more documentation.
	*/
	withRecursive(nameOrBuilder, expression) {
		const cte = parseCommonTableExpression(nameOrBuilder, expression);
		return new QueryCreator({
			...this.#props,
			withNode: this.#props.withNode ? WithNode.cloneWithExpression(this.#props.withNode, cte) : WithNode.create(cte, { recursive: true })
		});
	}
	/**
	* Returns a copy of this query creator instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new QueryCreator({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	/**
	* Returns a copy of this query creator instance without any plugins.
	*/
	withoutPlugins() {
		return new QueryCreator({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	/**
	* Sets the schema to be used for all table references that don't explicitly
	* specify a schema.
	*
	* This only affects the query created through the builder returned from
	* this method and doesn't modify the `db` instance.
	*
	* See [this recipe](https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0007-schemas.md)
	* for a more detailed explanation.
	*
	* ### Examples
	*
	* ```
	* await db
	*   .withSchema('mammals')
	*   .selectFrom('pet')
	*   .selectAll()
	*   .innerJoin('public.person', 'public.person.id', 'pet.owner_id')
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select * from "mammals"."pet"
	* inner join "public"."person"
	* on "public"."person"."id" = "mammals"."pet"."owner_id"
	* ```
	*
	* `withSchema` is smart enough to not add schema for aliases,
	* common table expressions or other places where the schema
	* doesn't belong to:
	*
	* ```
	* await db
	*   .withSchema('mammals')
	*   .selectFrom('pet as p')
	*   .select('p.name')
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "p"."name" from "mammals"."pet" as "p"
	* ```
	*/
	withSchema(schema) {
		return new QueryCreator({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
};
//#endregion
//#region node_modules/kysely/dist/parser/parse-utils.js
function createQueryCreator() {
	return new QueryCreator({ executor: NOOP_QUERY_EXECUTOR });
}
function createJoinBuilder(joinType, table) {
	return new JoinBuilder({ joinNode: JoinNode.create(joinType, parseTableExpression(table)) });
}
function createOverBuilder() {
	return new OverBuilder({ overNode: OverNode.create() });
}
//#endregion
//#region node_modules/kysely/dist/parser/join-parser.js
function parseJoin(joinType, args) {
	if (args.length === 3) return parseSingleOnJoin(joinType, args[0], args[1], args[2]);
	else if (args.length === 2) return parseCallbackJoin(joinType, args[0], args[1]);
	else if (args.length === 1) return parseOnlessJoin(joinType, args[0]);
	else throw new Error("not implemented");
}
function parseCallbackJoin(joinType, from, callback) {
	return callback(createJoinBuilder(joinType, from)).toOperationNode();
}
function parseSingleOnJoin(joinType, from, lhsColumn, rhsColumn) {
	return JoinNode.createWithOn(joinType, parseTableExpression(from), parseReferentialBinaryOperation(lhsColumn, "=", rhsColumn));
}
function parseOnlessJoin(joinType, from) {
	return JoinNode.create(joinType, parseTableExpression(from));
}
//#endregion
//#region node_modules/kysely/dist/operation-node/offset-node.js
/**
* @internal
*/
var OffsetNode = freeze({
	is(node) {
		return node.kind === "OffsetNode";
	},
	create(offset) {
		return freeze({
			kind: "OffsetNode",
			offset
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/group-by-item-node.js
/**
* @internal
*/
var GroupByItemNode = freeze({
	is(node) {
		return node.kind === "GroupByItemNode";
	},
	create(groupBy) {
		return freeze({
			kind: "GroupByItemNode",
			groupBy
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/group-by-parser.js
function parseGroupBy(groupBy) {
	groupBy = isFunction(groupBy) ? groupBy(expressionBuilder()) : groupBy;
	return parseReferenceExpressionOrList(groupBy).map(GroupByItemNode.create);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/set-operation-node.js
/**
* @internal
*/
var SetOperationNode = freeze({
	is(node) {
		return node.kind === "SetOperationNode";
	},
	create(operator, expression, all) {
		return freeze({
			kind: "SetOperationNode",
			operator,
			expression,
			all
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/set-operation-parser.js
function parseSetOperations(operator, expression, all) {
	if (isFunction(expression)) expression = expression(createExpressionBuilder());
	if (!isReadonlyArray(expression)) expression = [expression];
	return expression.map((expr) => SetOperationNode.create(operator, parseExpression(expr), all));
}
//#endregion
//#region node_modules/kysely/dist/expression/expression-wrapper.js
var ExpressionWrapper = class ExpressionWrapper {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/** @private */
	get expressionType() {}
	as(alias) {
		return new AliasedExpressionWrapper(this, alias);
	}
	or(...args) {
		return new OrWrapper(OrNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
	}
	and(...args) {
		return new AndWrapper(AndNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
	}
	/**
	* Change the output type of the expression.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `ExpressionWrapper` with a new output type.
	*/
	$castTo() {
		return new ExpressionWrapper(this.#node);
	}
	/**
	* Omit null from the expression's type.
	*
	* This function can be useful in cases where you know an expression can't be
	* null, but Kysely is unable to infer it.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of `this` with a new output type.
	*/
	$notNull() {
		return new ExpressionWrapper(this.#node);
	}
	toOperationNode() {
		return this.#node;
	}
};
var AliasedExpressionWrapper = class {
	#expr;
	#alias;
	constructor(expr, alias) {
		this.#expr = expr;
		this.#alias = alias;
	}
	/** @private */
	get expression() {
		return this.#expr;
	}
	/** @private */
	get alias() {
		return this.#alias;
	}
	toOperationNode() {
		return AliasNode.create(this.#expr.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
	}
};
var OrWrapper = class OrWrapper {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/** @private */
	get expressionType() {}
	as(alias) {
		return new AliasedExpressionWrapper(this, alias);
	}
	or(...args) {
		return new OrWrapper(OrNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
	}
	/**
	* Change the output type of the expression.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `OrWrapper` with a new output type.
	*/
	$castTo() {
		return new OrWrapper(this.#node);
	}
	toOperationNode() {
		return ParensNode.create(this.#node);
	}
};
var AndWrapper = class AndWrapper {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/** @private */
	get expressionType() {}
	as(alias) {
		return new AliasedExpressionWrapper(this, alias);
	}
	and(...args) {
		return new AndWrapper(AndNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
	}
	/**
	* Change the output type of the expression.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `AndWrapper` with a new output type.
	*/
	$castTo() {
		return new AndWrapper(this.#node);
	}
	toOperationNode() {
		return ParensNode.create(this.#node);
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/fetch-node.js
/**
* @internal
*/
var FetchNode = freeze({
	is(node) {
		return node.kind === "FetchNode";
	},
	create(rowCount, modifier) {
		return {
			kind: "FetchNode",
			rowCount: ValueNode.create(rowCount),
			modifier
		};
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/fetch-parser.js
function parseFetch(rowCount, modifier) {
	if (!isNumber(rowCount) && !isBigInt(rowCount)) throw new Error(`Invalid fetch row count: ${rowCount}`);
	if (!isFetchModifier(modifier)) throw new Error(`Invalid fetch modifier: ${modifier}`);
	return FetchNode.create(rowCount, modifier);
}
function isFetchModifier(value) {
	return value === "only" || value === "with ties";
}
//#endregion
//#region node_modules/kysely/dist/query-builder/select-query-builder.js
var _a$1;
var SelectQueryBuilderImpl = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	get expressionType() {}
	get isSelectQueryBuilder() {
		return true;
	}
	where(...args) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	whereRef(lhs, op, rhs) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	having(...args) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithHaving(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	havingRef(lhs, op, rhs) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithHaving(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	select(selection) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSelections(this.#props.queryNode, parseSelectArg(selection))
		});
	}
	distinctOn(selection) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithDistinctOn(this.#props.queryNode, parseReferenceExpressionOrList(selection))
		});
	}
	modifyFront(modifier) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithFrontModifier(this.#props.queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
		});
	}
	modifyEnd(modifier) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
		});
	}
	distinct() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithFrontModifier(this.#props.queryNode, SelectModifierNode.create("Distinct"))
		});
	}
	forUpdate(of) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForUpdate", of ? asArray(of).map(parseTable) : void 0))
		});
	}
	forShare(of) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForShare", of ? asArray(of).map(parseTable) : void 0))
		});
	}
	forKeyShare(of) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForKeyShare", of ? asArray(of).map(parseTable) : void 0))
		});
	}
	forNoKeyUpdate(of) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForNoKeyUpdate", of ? asArray(of).map(parseTable) : void 0))
		});
	}
	skipLocked() {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("SkipLocked"))
		});
	}
	noWait() {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("NoWait"))
		});
	}
	selectAll(table) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSelections(this.#props.queryNode, parseSelectAll(table))
		});
	}
	innerJoin(...args) {
		return this.#join("InnerJoin", args);
	}
	leftJoin(...args) {
		return this.#join("LeftJoin", args);
	}
	rightJoin(...args) {
		return this.#join("RightJoin", args);
	}
	fullJoin(...args) {
		return this.#join("FullJoin", args);
	}
	crossJoin(...args) {
		return this.#join("CrossJoin", args);
	}
	innerJoinLateral(...args) {
		return this.#join("LateralInnerJoin", args);
	}
	leftJoinLateral(...args) {
		return this.#join("LateralLeftJoin", args);
	}
	crossJoinLateral(...args) {
		return this.#join("LateralCrossJoin", args);
	}
	crossApply(...args) {
		return this.#join("CrossApply", args);
	}
	outerApply(...args) {
		return this.#join("OuterApply", args);
	}
	#join(joinType, args) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
		});
	}
	orderBy(...args) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
		});
	}
	groupBy(groupBy) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithGroupByItems(this.#props.queryNode, parseGroupBy(groupBy))
		});
	}
	limit(limit) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
		});
	}
	offset(offset) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithOffset(this.#props.queryNode, OffsetNode.create(parseValueExpression(offset)))
		});
	}
	fetch(rowCount, modifier = "only") {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithFetch(this.#props.queryNode, parseFetch(rowCount, modifier))
		});
	}
	top(expression, modifiers) {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
		});
	}
	union(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("union", expression, false))
		});
	}
	unionAll(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("union", expression, true))
		});
	}
	intersect(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("intersect", expression, false))
		});
	}
	intersectAll(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("intersect", expression, true))
		});
	}
	except(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("except", expression, false))
		});
	}
	exceptAll(expression) {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("except", expression, true))
		});
	}
	as(alias) {
		return new AliasedSelectQueryBuilderImpl(this, alias);
	}
	clearSelect() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithoutSelections(this.#props.queryNode)
		});
	}
	clearWhere() {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
		});
	}
	clearLimit() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithoutLimit(this.#props.queryNode)
		});
	}
	clearOffset() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithoutOffset(this.#props.queryNode)
		});
	}
	clearOrderBy() {
		return new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
		});
	}
	clearGroupBy() {
		return new _a$1({
			...this.#props,
			queryNode: SelectQueryNode.cloneWithoutGroupBy(this.#props.queryNode)
		});
	}
	$call(func) {
		return func(this);
	}
	$if(condition, func) {
		if (condition) return func(this);
		return new _a$1({ ...this.#props });
	}
	$castTo() {
		return new _a$1(this.#props);
	}
	$narrowType() {
		return new _a$1(this.#props);
	}
	$assertType() {
		return new _a$1(this.#props);
	}
	$asTuple() {
		return new ExpressionWrapper(this.toOperationNode());
	}
	$asScalar() {
		return new ExpressionWrapper(this.toOperationNode());
	}
	withPlugin(plugin) {
		return new _a$1({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		const compiledQuery = this.compile();
		return (await this.#props.executor.executeQuery(compiledQuery, options)).rows;
	}
	async executeTakeFirst(options) {
		const [result] = await this.execute(options);
		return result;
	}
	async executeTakeFirstOrThrow(errorConstructorOrOptions) {
		if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
		const result = await this.executeTakeFirst(errorConstructorOrOptions);
		if (result === void 0) {
			const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
			throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
		}
		return result;
	}
	async *stream(chunkSizeOrOptions) {
		if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
		const compiledQuery = this.compile();
		const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
		for await (const item of stream) yield* item.rows;
	}
	async explain(format, options) {
		return await new _a$1({
			...this.#props,
			queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
		}).execute();
	}
};
_a$1 = SelectQueryBuilderImpl;
function createSelectQueryBuilder(props) {
	return new SelectQueryBuilderImpl(props);
}
/**
* {@link SelectQueryBuilder} with an alias. The result of calling {@link SelectQueryBuilder.as}.
*/
var AliasedSelectQueryBuilderImpl = class {
	#queryBuilder;
	#alias;
	constructor(queryBuilder, alias) {
		this.#queryBuilder = queryBuilder;
		this.#alias = alias;
	}
	get expression() {
		return this.#queryBuilder;
	}
	get alias() {
		return this.#alias;
	}
	get isAliasedSelectQueryBuilder() {
		return true;
	}
	toOperationNode() {
		return AliasNode.create(this.#queryBuilder.toOperationNode(), IdentifierNode.create(this.#alias));
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/aggregate-function-node.js
/**
* @internal
*/
var AggregateFunctionNode = freeze({
	is(node) {
		return node.kind === "AggregateFunctionNode";
	},
	create(aggregateFunction, aggregated = []) {
		return freeze({
			kind: "AggregateFunctionNode",
			func: aggregateFunction,
			aggregated
		});
	},
	cloneWithDistinct(aggregateFunctionNode) {
		return freeze({
			...aggregateFunctionNode,
			distinct: true
		});
	},
	cloneWithOrderBy(aggregateFunctionNode, orderItems, withinGroup = false) {
		const prop = withinGroup ? "withinGroup" : "orderBy";
		return freeze({
			...aggregateFunctionNode,
			[prop]: aggregateFunctionNode[prop] ? OrderByNode.cloneWithItems(aggregateFunctionNode[prop], orderItems) : OrderByNode.create(orderItems)
		});
	},
	cloneWithFilter(aggregateFunctionNode, filter) {
		return freeze({
			...aggregateFunctionNode,
			filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "And", filter) : WhereNode.create(filter)
		});
	},
	cloneWithOrFilter(aggregateFunctionNode, filter) {
		return freeze({
			...aggregateFunctionNode,
			filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "Or", filter) : WhereNode.create(filter)
		});
	},
	cloneWithOver(aggregateFunctionNode, over) {
		return freeze({
			...aggregateFunctionNode,
			over
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/function-node.js
/**
* @internal
*/
var FunctionNode = freeze({
	is(node) {
		return node.kind === "FunctionNode";
	},
	create(func, args) {
		return freeze({
			kind: "FunctionNode",
			func,
			arguments: args
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/aggregate-function-builder.js
var AggregateFunctionBuilder = class AggregateFunctionBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/** @private */
	get expressionType() {}
	/**
	* Returns an aliased version of the function.
	*
	* In addition to slapping `as "the_alias"` to the end of the SQL,
	* this method also provides strict typing:
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select(
	*     (eb) => eb.fn.count<number>('id').as('person_count')
	*   )
	*   .executeTakeFirstOrThrow()
	*
	* // `person_count: number` field exists in the result type.
	* console.log(result.person_count)
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select count("id") as "person_count"
	* from "person"
	* ```
	*/
	as(alias) {
		return new AliasedAggregateFunctionBuilder(this, alias);
	}
	/**
	* Adds a `distinct` clause inside the function.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select((eb) =>
	*     eb.fn.count<number>('first_name').distinct().as('first_name_count')
	*   )
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select count(distinct "first_name") as "first_name_count"
	* from "person"
	* ```
	*/
	distinct() {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithDistinct(this.#props.aggregateFunctionNode)
		});
	}
	orderBy(...args) {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: QueryNode.cloneWithOrderByItems(this.#props.aggregateFunctionNode, parseOrderBy(args))
		});
	}
	clearOrderBy() {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: QueryNode.cloneWithoutOrderBy(this.#props.aggregateFunctionNode)
		});
	}
	withinGroupOrderBy(...args) {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithOrderBy(this.#props.aggregateFunctionNode, parseOrderBy(args), true)
		});
	}
	filterWhere(...args) {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(this.#props.aggregateFunctionNode, parseValueBinaryOperationOrExpression(args))
		});
	}
	/**
	* Adds a `filter` clause with a nested `where` clause after the function, where
	* both sides of the operator are references to columns.
	*
	* Similar to {@link WhereInterface}'s `whereRef` method.
	*
	* ### Examples
	*
	* Count people with same first and last names versus general public:
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select((eb) => [
	*     eb.fn
	*       .count<number>('id')
	*       .filterWhereRef('first_name', '=', 'last_name')
	*       .as('repeat_name_count'),
	*     eb.fn.count<number>('id').as('total_count'),
	*   ])
	*   .executeTakeFirstOrThrow()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select
	*   count("id") filter(where "first_name" = "last_name") as "repeat_name_count",
	*   count("id") as "total_count"
	* from "person"
	* ```
	*/
	filterWhereRef(lhs, op, rhs) {
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(this.#props.aggregateFunctionNode, parseReferentialBinaryOperation(lhs, op, rhs))
		});
	}
	/**
	* Adds an `over` clause (window functions) after the function.
	*
	* ### Examples
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select(
	*     (eb) => eb.fn.avg<number>('age').over().as('average_age')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select avg("age") over() as "average_age"
	* from "person"
	* ```
	*
	* Also supports passing a callback that returns an over builder,
	* allowing to add partition by and sort by clauses inside over.
	*
	* ```ts
	* const result = await db
	*   .selectFrom('person')
	*   .select(
	*     (eb) => eb.fn.avg<number>('age').over(
	*       ob => ob.partitionBy('last_name').orderBy('first_name', 'asc')
	*     ).as('average_age')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select avg("age") over(partition by "last_name" order by "first_name" asc) as "average_age"
	* from "person"
	* ```
	*/
	over(over) {
		const builder = createOverBuilder();
		return new AggregateFunctionBuilder({
			...this.#props,
			aggregateFunctionNode: AggregateFunctionNode.cloneWithOver(this.#props.aggregateFunctionNode, (over ? over(builder) : builder).toOperationNode())
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	/**
	* Casts the expression to the given type.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `AggregateFunctionBuilder` with a new output type.
	*/
	$castTo() {
		return new AggregateFunctionBuilder(this.#props);
	}
	/**
	* Omit null from the expression's type.
	*
	* This function can be useful in cases where you know an expression can't be
	* null, but Kysely is unable to infer it.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of `this` with a new output type.
	*/
	$notNull() {
		return new AggregateFunctionBuilder(this.#props);
	}
	toOperationNode() {
		return this.#props.aggregateFunctionNode;
	}
};
/**
* {@link AggregateFunctionBuilder} with an alias. The result of calling {@link AggregateFunctionBuilder.as}.
*/
var AliasedAggregateFunctionBuilder = class {
	#aggregateFunctionBuilder;
	#alias;
	constructor(aggregateFunctionBuilder, alias) {
		this.#aggregateFunctionBuilder = aggregateFunctionBuilder;
		this.#alias = alias;
	}
	/** @private */
	get expression() {
		return this.#aggregateFunctionBuilder;
	}
	/** @private */
	get alias() {
		return this.#alias;
	}
	toOperationNode() {
		return AliasNode.create(this.#aggregateFunctionBuilder.toOperationNode(), IdentifierNode.create(this.#alias));
	}
};
//#endregion
//#region node_modules/kysely/dist/query-builder/function-module.js
function createFunctionModule() {
	const fn = (name, args) => {
		return new ExpressionWrapper(FunctionNode.create(name, parseReferenceExpressionOrList(args ?? [])));
	};
	const agg = (name, args) => {
		return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create(name, args ? parseReferenceExpressionOrList(args) : void 0) });
	};
	return Object.assign(fn, {
		agg,
		avg(column) {
			return agg("avg", [column]);
		},
		coalesce(...values) {
			return fn("coalesce", values);
		},
		count(column) {
			return agg("count", [column]);
		},
		countAll(table) {
			return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create("count", parseSelectAll(table)) });
		},
		max(column) {
			return agg("max", [column]);
		},
		min(column) {
			return agg("min", [column]);
		},
		sum(column) {
			return agg("sum", [column]);
		},
		any(column) {
			return fn("any", [column]);
		},
		jsonAgg(table) {
			return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create("json_agg", [isString(table) ? parseTable(table) : table.toOperationNode()]) });
		},
		toJson(table) {
			return new ExpressionWrapper(FunctionNode.create("to_json", [isString(table) ? parseTable(table) : table.toOperationNode()]));
		}
	});
}
//#endregion
//#region node_modules/kysely/dist/operation-node/unary-operation-node.js
/**
* @internal
*/
var UnaryOperationNode = freeze({
	is(node) {
		return node.kind === "UnaryOperationNode";
	},
	create(operator, operand) {
		return freeze({
			kind: "UnaryOperationNode",
			operator,
			operand
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/unary-operation-parser.js
function parseUnaryOperation(operator, operand) {
	if (isUnaryOperator(operator)) return UnaryOperationNode.create(OperatorNode.create(operator), parseReferenceExpression(operand));
	throw new Error(`invalid unary operator ${JSON.stringify(operator)}`);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/case-node.js
/**
* @internal
*/
var CaseNode = freeze({
	is(node) {
		return node.kind === "CaseNode";
	},
	create(value) {
		return freeze({
			kind: "CaseNode",
			value
		});
	},
	cloneWithWhen(caseNode, when) {
		return freeze({
			...caseNode,
			when: freeze(caseNode.when ? [...caseNode.when, when] : [when])
		});
	},
	cloneWithThen(caseNode, then) {
		return freeze({
			...caseNode,
			when: caseNode.when ? freeze([...caseNode.when.slice(0, -1), WhenNode.cloneWithResult(caseNode.when[caseNode.when.length - 1], then)]) : void 0
		});
	},
	cloneWith(caseNode, props) {
		return freeze({
			...caseNode,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/case-builder.js
var CaseBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	when(...args) {
		return new CaseThenBuilder({
			...this.#props,
			node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
		});
	}
	whenRef(lhs, op, rhs) {
		return new CaseThenBuilder({
			...this.#props,
			node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseReferentialBinaryOperation(lhs, op, rhs)))
		});
	}
};
var CaseThenBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	then(valueExpression) {
		return new CaseWhenBuilder({
			...this.#props,
			node: CaseNode.cloneWithThen(this.#props.node, isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression))
		});
	}
	/**
	* Adds a `then` clause to the `case` statement where the value is a reference to a column.
	*
	* See {@link then} for value-first variant.
	*
	* A `thenRef` call can be followed by {@link Whenable.when}, {@link Whenable.whenRef},
	* {@link CaseWhenBuilder.else}, {@link CaseWhenBuilder.elseRef},
	* {@link CaseWhenBuilder.end} or {@link CaseWhenBuilder.endCase} call.
	*/
	thenRef(expression) {
		return new CaseWhenBuilder({
			...this.#props,
			node: CaseNode.cloneWithThen(this.#props.node, parseReferenceExpression(expression))
		});
	}
};
var CaseWhenBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	when(...args) {
		return new CaseThenBuilder({
			...this.#props,
			node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
		});
	}
	whenRef(lhs, op, rhs) {
		return new CaseThenBuilder({
			...this.#props,
			node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseReferentialBinaryOperation(lhs, op, rhs)))
		});
	}
	else(valueExpression) {
		return new CaseEndBuilder({
			...this.#props,
			node: CaseNode.cloneWith(this.#props.node, { else: isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression) })
		});
	}
	/**
	* Adds an `else` clause to the `case` statement where the value is a reference to a column.
	*
	* See {@link else} for value-first variant.
	*
	* An `elseRef` call must be followed by an {@link Endable.end} or {@link Endable.endCase} call.
	*/
	elseRef(expression) {
		return new CaseEndBuilder({
			...this.#props,
			node: CaseNode.cloneWith(this.#props.node, { else: parseReferenceExpression(expression) })
		});
	}
	end() {
		return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: false }));
	}
	endCase() {
		return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: true }));
	}
};
var CaseEndBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	end() {
		return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: false }));
	}
	endCase() {
		return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: true }));
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/json-path-leg-node.js
/**
* @internal
*/
var JSONPathLegNode = freeze({
	is(node) {
		return node.kind === "JSONPathLegNode";
	},
	create(type, value) {
		return freeze({
			kind: "JSONPathLegNode",
			type,
			value
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-builder/json-path-builder.js
var HASH_NEGATIVE_INDEX_REGEX = /^#-\d+$/;
var JSONPathBuilder = class {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Access an element of a JSON array in a specific location.
	*
	* Since there's no guarantee an element exists in the given array location, the
	* resulting type is always nullable. If you're sure the element exists, you
	* should use {@link SelectQueryBuilder.$assertType} to narrow the type safely.
	*
	* See also {@link key} to access properties of JSON objects.
	*
	* ### Examples
	*
	* ```ts
	* await db.selectFrom('person')
	*   .select(eb =>
	*     eb.ref('nicknames', '->').at(0).as('primary_nickname')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "nicknames"->0 as "primary_nickname" from "person"
	*```
	*
	* Combined with {@link key}:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('experience', '->').at(0).key('role').as('first_role')
	* )
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "experience"->0->'role' as "first_role" from "person"
	* ```
	*
	* You can use `'last'` to access the last element of the array in MySQL:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('nicknames', '->$').at('last').as('last_nickname')
	* )
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* select `nicknames`->'$[last]' as `last_nickname` from `person`
	* ```
	*
	* Or `'#-1'` in SQLite:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('nicknames', '->>$').at('#-1').as('last_nickname')
	* )
	* ```
	*
	* The generated SQL (SQLite):
	*
	* ```sql
	* select "nicknames"->>'$[#-1]' as `last_nickname` from `person`
	* ```
	*/
	at(index) {
		if (typeof index !== "number" && typeof index !== "string" || typeof index === "number" && !Number.isInteger(index) || typeof index === "string" && index !== "last" && !HASH_NEGATIVE_INDEX_REGEX.test(index)) throw new Error(`Unexpected index value in .at(...): ${index}`);
		return this.#createBuilderWithPathLeg("ArrayLocation", index);
	}
	/**
	* Access a property of a JSON object.
	*
	* If a field is optional, the resulting type will be nullable.
	*
	* See also {@link at} to access elements of JSON arrays.
	*
	* ### Examples
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('address', '->').key('city').as('city')
	* )
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "address"->'city' as "city" from "person"
	* ```
	*
	* Going deeper:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('profile', '->$').key('website').key('url').as('website_url')
	* )
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* select `profile`->'$.website.url' as `website_url` from `person`
	* ```
	*
	* Combined with {@link at}:
	*
	* ```ts
	* db.selectFrom('person').select(eb =>
	*   eb.ref('profile', '->').key('addresses').at(0).key('city').as('city')
	* )
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "profile"->'addresses'->0->'city' as "city" from "person"
	* ```
	*/
	key(key) {
		return this.#createBuilderWithPathLeg("Member", key);
	}
	#createBuilderWithPathLeg(legType, value) {
		if (JSONReferenceNode.is(this.#node)) return new TraversedJSONPathBuilder(JSONReferenceNode.cloneWithTraversal(this.#node, JSONPathNode.is(this.#node.traversal) ? JSONPathNode.cloneWithLeg(this.#node.traversal, JSONPathLegNode.create(legType, value)) : JSONOperatorChainNode.cloneWithValue(this.#node.traversal, ValueNode.createImmediate(value))));
		return new TraversedJSONPathBuilder(JSONPathNode.cloneWithLeg(this.#node, JSONPathLegNode.create(legType, value)));
	}
};
var TraversedJSONPathBuilder = class TraversedJSONPathBuilder extends JSONPathBuilder {
	#node;
	constructor(node) {
		super(node);
		this.#node = node;
	}
	/** @private */
	get expressionType() {}
	as(alias) {
		return new AliasedJSONPathBuilder(this, alias);
	}
	/**
	* Change the output type of the json path.
	*
	* This method call doesn't change the SQL in any way. This methods simply
	* returns a copy of this `JSONPathBuilder` with a new output type.
	*/
	$castTo() {
		return new TraversedJSONPathBuilder(this.#node);
	}
	$notNull() {
		return new TraversedJSONPathBuilder(this.#node);
	}
	toOperationNode() {
		return this.#node;
	}
};
var AliasedJSONPathBuilder = class {
	#jsonPath;
	#alias;
	constructor(jsonPath, alias) {
		this.#jsonPath = jsonPath;
		this.#alias = alias;
	}
	/** @private */
	get expression() {
		return this.#jsonPath;
	}
	/** @private */
	get alias() {
		return this.#alias;
	}
	toOperationNode() {
		return AliasNode.create(this.#jsonPath.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/tuple-node.js
/**
* @internal
*/
var TupleNode = freeze({
	is(node) {
		return node.kind === "TupleNode";
	},
	create(values) {
		return freeze({
			kind: "TupleNode",
			values: freeze(values)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/data-type-node.js
var SIMPLE_COLUMN_DATA_TYPES = freeze({
	bigint: true,
	bigserial: true,
	binary: true,
	blob: true,
	boolean: true,
	bytea: true,
	char: true,
	date: true,
	datemultirange: true,
	daterange: true,
	datetime: true,
	datetime2: true,
	decimal: true,
	"double precision": true,
	float4: true,
	float8: true,
	int2: true,
	int4: true,
	int4multirange: true,
	int4range: true,
	int8: true,
	int8multirange: true,
	int8range: true,
	integer: true,
	json: true,
	jsonb: true,
	numeric: true,
	nummultirange: true,
	numrange: true,
	real: true,
	serial: true,
	smallint: true,
	text: true,
	time: true,
	timestamp: true,
	timestamptz: true,
	timetz: true,
	tsmultirange: true,
	tsrange: true,
	tstzmultirange: true,
	tstzrange: true,
	uuid: true,
	varbinary: true,
	varchar: true
});
var COLUMN_DATA_TYPE_REGEX = freeze([
	/^varchar\(\d+\)$/,
	/^char\(\d+\)$/,
	/^decimal\(\d+, \d+\)$/,
	/^numeric\(\d+, \d+\)$/,
	/^binary\(\d+\)$/,
	/^datetime\(\d+\)$/,
	/^time\(\d+\)$/,
	/^timetz\(\d+\)$/,
	/^timestamp\(\d+\)$/,
	/^timestamptz\(\d+\)$/,
	/^datetime2\(\d+\)$/,
	/^varbinary\(\d+\)$/
]);
/**
* @internal
*/
var DataTypeNode = freeze({
	is(node) {
		return node.kind === "DataTypeNode";
	},
	create(dataType) {
		return freeze({
			kind: "DataTypeNode",
			dataType
		});
	}
});
function isColumnDataType(dataType) {
	return SIMPLE_COLUMN_DATA_TYPES[dataType] || COLUMN_DATA_TYPE_REGEX.some((r) => r.test(dataType));
}
//#endregion
//#region node_modules/kysely/dist/parser/data-type-parser.js
function parseDataTypeExpression(dataType) {
	if (isOperationNodeSource(dataType)) return dataType.toOperationNode();
	if (isColumnDataType(dataType)) return DataTypeNode.create(dataType);
	throw new Error(`invalid column data type ${JSON.stringify(dataType)}`);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/cast-node.js
/**
* @internal
*/
var CastNode = freeze({
	is(node) {
		return node.kind === "CastNode";
	},
	create(expression, dataType) {
		return freeze({
			kind: "CastNode",
			expression,
			dataType
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/expression/expression-builder.js
function createExpressionBuilder(executor = NOOP_QUERY_EXECUTOR) {
	function binary(lhs, op, rhs) {
		return new ExpressionWrapper(parseValueBinaryOperation(lhs, op, rhs));
	}
	function unary(op, expr) {
		return new ExpressionWrapper(parseUnaryOperation(op, expr));
	}
	const eb = Object.assign(binary, {
		fn: void 0,
		eb: void 0,
		selectFrom(table) {
			return createSelectQueryBuilder({
				queryId: createQueryId(),
				executor,
				queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(table))
			});
		},
		case(reference) {
			return new CaseBuilder({ node: CaseNode.create(isUndefined(reference) ? void 0 : parseReferenceExpression(reference)) });
		},
		ref(reference, op) {
			if (isUndefined(op)) return new ExpressionWrapper(parseStringReference(reference));
			return new JSONPathBuilder(parseJSONReference(reference, op));
		},
		jsonPath() {
			return new JSONPathBuilder(JSONPathNode.create());
		},
		table(table) {
			return new ExpressionWrapper(parseTable(table));
		},
		val(value) {
			return new ExpressionWrapper(parseValueExpression(value));
		},
		refTuple(...values) {
			return new ExpressionWrapper(TupleNode.create(values.map(parseReferenceExpression)));
		},
		tuple(...values) {
			return new ExpressionWrapper(TupleNode.create(values.map(parseValueExpression)));
		},
		lit(value) {
			return new ExpressionWrapper(parseSafeImmediateValue(value));
		},
		unary,
		not(expr) {
			return unary("not", expr);
		},
		exists(expr) {
			return unary("exists", expr);
		},
		neg(expr) {
			return unary("-", expr);
		},
		between(expr, start, end) {
			return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
		},
		betweenSymmetric(expr, start, end) {
			return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between symmetric"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
		},
		and(exprs) {
			if (isReadonlyArray(exprs)) return new ExpressionWrapper(parseFilterList(exprs, "and"));
			return new ExpressionWrapper(parseFilterObject(exprs, "and"));
		},
		or(exprs) {
			if (isReadonlyArray(exprs)) return new ExpressionWrapper(parseFilterList(exprs, "or"));
			return new ExpressionWrapper(parseFilterObject(exprs, "or"));
		},
		parens(...args) {
			const node = parseValueBinaryOperationOrExpression(args);
			if (ParensNode.is(node)) return new ExpressionWrapper(node);
			else return new ExpressionWrapper(ParensNode.create(node));
		},
		cast(expr, dataType) {
			return new ExpressionWrapper(CastNode.create(parseReferenceExpression(expr), parseDataTypeExpression(dataType)));
		}
	});
	eb.fn = createFunctionModule();
	eb.eb = eb;
	return eb;
}
function expressionBuilder(_) {
	return createExpressionBuilder();
}
//#endregion
//#region node_modules/kysely/dist/parser/expression-parser.js
function parseExpression(exp) {
	if (isOperationNodeSource(exp)) return exp.toOperationNode();
	else if (isFunction(exp)) return exp(expressionBuilder()).toOperationNode();
	throw new Error(`invalid expression: ${JSON.stringify(exp)}`);
}
function parseAliasedExpression(exp) {
	if (isOperationNodeSource(exp)) return exp.toOperationNode();
	else if (isFunction(exp)) return exp(expressionBuilder()).toOperationNode();
	throw new Error(`invalid aliased expression: ${JSON.stringify(exp)}`);
}
function isExpressionOrFactory(obj) {
	return isExpression(obj) || isAliasedExpression(obj) || isFunction(obj);
}
//#endregion
//#region node_modules/kysely/dist/dynamic/dynamic-table-builder.js
var DynamicTableBuilder = class {
	#table;
	get table() {
		return this.#table;
	}
	constructor(table) {
		this.#table = table;
	}
	as(alias) {
		return new AliasedDynamicTableBuilder(this.#table, alias);
	}
};
var AliasedDynamicTableBuilder = class {
	#table;
	#alias;
	get table() {
		return this.#table;
	}
	get alias() {
		return this.#alias;
	}
	constructor(table, alias) {
		this.#table = table;
		this.#alias = alias;
	}
	toOperationNode() {
		return AliasNode.create(parseTable(this.#table), IdentifierNode.create(this.#alias));
	}
};
function isAliasedDynamicTableBuilder(obj) {
	return isObject(obj) && isOperationNodeSource(obj) && isString(obj.table) && isString(obj.alias);
}
//#endregion
//#region node_modules/kysely/dist/parser/table-parser.js
function parseTableExpressionOrList(table) {
	if (isReadonlyArray(table)) return table.map((it) => parseTableExpression(it));
	else return [parseTableExpression(table)];
}
function parseTableExpression(table) {
	if (isString(table)) return parseAliasedTable(table);
	else if (isAliasedDynamicTableBuilder(table)) return table.toOperationNode();
	else return parseAliasedExpression(table);
}
function parseAliasedTable(from) {
	const ALIAS_SEPARATOR = " as ";
	if (from.includes(ALIAS_SEPARATOR)) {
		const [table, alias] = from.split(ALIAS_SEPARATOR).map(trim$1);
		return AliasNode.create(parseTable(table), IdentifierNode.create(alias));
	} else return parseTable(from);
}
function parseTable(from) {
	const SCHEMA_SEPARATOR = ".";
	if (from.includes(SCHEMA_SEPARATOR)) {
		const [schema, table] = from.split(SCHEMA_SEPARATOR).map(trim$1);
		return TableNode.createWithSchema(schema, table);
	} else return TableNode.create(from);
}
function trim$1(str) {
	return str.trim();
}
//#endregion
//#region node_modules/kysely/dist/operation-node/add-column-node.js
/**
* @internal
*/
var AddColumnNode = freeze({
	is(node) {
		return node.kind === "AddColumnNode";
	},
	create(column) {
		return freeze({
			kind: "AddColumnNode",
			column
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/column-definition-node.js
/**
* @internal
*/
var ColumnDefinitionNode = freeze({
	is(node) {
		return node.kind === "ColumnDefinitionNode";
	},
	create(column, dataType) {
		return freeze({
			kind: "ColumnDefinitionNode",
			column: ColumnNode.create(column),
			dataType
		});
	},
	cloneWithFrontModifier(node, modifier) {
		return freeze({
			...node,
			frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : [modifier]
		});
	},
	cloneWithEndModifier(node, modifier) {
		return freeze({
			...node,
			endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : [modifier]
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/drop-column-node.js
/**
* @internal
*/
var DropColumnNode = freeze({
	is(node) {
		return node.kind === "DropColumnNode";
	},
	create(column) {
		return freeze({
			kind: "DropColumnNode",
			column: ColumnNode.create(column)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/rename-column-node.js
/**
* @internal
*/
var RenameColumnNode = freeze({
	is(node) {
		return node.kind === "RenameColumnNode";
	},
	create(column, newColumn) {
		return freeze({
			kind: "RenameColumnNode",
			column: ColumnNode.create(column),
			renameTo: ColumnNode.create(newColumn)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/check-constraint-node.js
/**
* @internal
*/
var CheckConstraintNode = freeze({
	is(node) {
		return node.kind === "CheckConstraintNode";
	},
	create(expression, constraintName) {
		return freeze({
			kind: "CheckConstraintNode",
			expression,
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/references-node.js
var ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY = freeze({
	cascade: true,
	"no action": true,
	restrict: true,
	"set default": true,
	"set null": true
});
Object.keys(ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY);
/**
* @internal
*/
var ReferencesNode = freeze({
	is(node) {
		return node.kind === "ReferencesNode";
	},
	create(table, columns) {
		return freeze({
			kind: "ReferencesNode",
			table,
			columns: freeze([...columns])
		});
	},
	cloneWithOnDelete(references, onDelete) {
		return freeze({
			...references,
			onDelete
		});
	},
	cloneWithOnUpdate(references, onUpdate) {
		return freeze({
			...references,
			onUpdate
		});
	}
});
function isOnModifyForeignAction(thing) {
	return isString(thing) && ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY[thing];
}
//#endregion
//#region node_modules/kysely/dist/parser/default-value-parser.js
function parseDefaultValueExpression(value) {
	return isOperationNodeSource(value) ? value.toOperationNode() : ValueNode.createImmediate(value);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/generated-node.js
/**
* @internal
*/
var GeneratedNode = freeze({
	is(node) {
		return node.kind === "GeneratedNode";
	},
	create(params) {
		return freeze({
			kind: "GeneratedNode",
			...params
		});
	},
	createWithExpression(expression) {
		return freeze({
			kind: "GeneratedNode",
			always: true,
			expression
		});
	},
	cloneWith(node, params) {
		return freeze({
			...node,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/default-value-node.js
/**
* @internal
*/
var DefaultValueNode = freeze({
	is(node) {
		return node.kind === "DefaultValueNode";
	},
	create(defaultValue) {
		return freeze({
			kind: "DefaultValueNode",
			defaultValue
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/parser/on-modify-action-parser.js
function parseOnModifyForeignAction(action) {
	if (isOnModifyForeignAction(action)) return action;
	throw new Error(`invalid OnModifyForeignAction ${action}`);
}
//#endregion
//#region node_modules/kysely/dist/schema/column-definition-builder.js
var ColumnDefinitionBuilder = class ColumnDefinitionBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Adds `auto_increment` or `autoincrement` to the column definition
	* depending on the dialect.
	*
	* Some dialects like PostgreSQL don't support this. On PostgreSQL
	* you can use the `serial` or `bigserial` data type instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key auto_increment
	* )
	* ```
	*/
	autoIncrement() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { autoIncrement: true }));
	}
	/**
	* Makes the column an identity column.
	*
	* This only works on some dialects like MS SQL Server (MSSQL).
	*
	* For PostgreSQL's `generated always as identity` use {@link generatedAlwaysAsIdentity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.identity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MSSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer identity primary key
	* )
	* ```
	*/
	identity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { identity: true }));
	}
	/**
	* Makes the column the primary key.
	*
	* If you want to specify a composite primary key use the
	* {@link CreateTableBuilder.addPrimaryKeyConstraint} method.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key
	* )
	*/
	primaryKey() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { primaryKey: true }));
	}
	/**
	* Adds a foreign key constraint for the column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id', 'integer', (col) => col.references('person.id'))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id")
	* )
	* ```
	*/
	references(ref) {
		const references = parseStringReference(ref);
		if (!references.table || SelectAllNode.is(references.column)) throw new Error(`invalid call references('${ref}'). The reference must have format table.column or schema.table.column`);
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.create(references.table, [references.column]) }));
	}
	/**
	* Adds an `on delete` constraint for the foreign key column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'owner_id',
	*     'integer',
	*     (col) => col.references('person.id').onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id") on delete cascade
	* )
	* ```
	*/
	onDelete(onDelete) {
		if (!this.#node.references) throw new Error("on delete constraint can only be added for foreign keys");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.cloneWithOnDelete(this.#node.references, parseOnModifyForeignAction(onDelete)) }));
	}
	/**
	* Adds an `on update` constraint for the foreign key column.
	*
	* If your database engine doesn't support foreign key constraints in the
	* column definition (like MySQL 5) you need to call the table level
	* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'owner_id',
	*     'integer',
	*     (col) => col.references('person.id').onUpdate('cascade')
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "pet" (
	*   "owner_id" integer references "person" ("id") on update cascade
	* )
	* ```
	*/
	onUpdate(onUpdate) {
		if (!this.#node.references) throw new Error("on update constraint can only be added for foreign keys");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.cloneWithOnUpdate(this.#node.references, parseOnModifyForeignAction(onUpdate)) }));
	}
	/**
	* Adds a unique constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('email', 'varchar(255)', col => col.unique())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `email` varchar(255) unique
	* )
	* ```
	*/
	unique() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unique: true }));
	}
	/**
	* Adds a `not null` constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(255)', col => col.notNull())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `first_name` varchar(255) not null
	* )
	* ```
	*/
	notNull() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { notNull: true }));
	}
	/**
	* Adds a `unsigned` modifier for the column.
	*
	* This only works on some dialects like MySQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('age', 'integer', col => col.unsigned())
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `age` integer unsigned
	* )
	* ```
	*/
	unsigned() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unsigned: true }));
	}
	/**
	* Adds a default value constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('number_of_legs', 'integer', (col) => col.defaultTo(4))
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `number_of_legs` integer default 4
	* )
	* ```
	*
	* Values passed to `defaultTo` are interpreted as value literals by default. You can define
	* an arbitrary SQL expression using the {@link sql} template tag:
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('pet')
	*   .addColumn(
	*     'created_at',
	*     'timestamp',
	*     (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `created_at` timestamp default CURRENT_TIMESTAMP
	* )
	* ```
	*/
	defaultTo(value) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { defaultTo: DefaultValueNode.create(parseDefaultValueExpression(value)) }));
	}
	/**
	* Adds a check constraint for the column.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('number_of_legs', 'integer', (col) =>
	*     col.check(sql`number_of_legs < 5`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `pet` (
	*   `number_of_legs` integer check (number_of_legs < 5)
	* )
	* ```
	*/
	check(expression) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { check: CheckConstraintNode.create(expression.toOperationNode()) }));
	}
	/**
	* Makes the column a generated column using a `generated always as` statement.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('full_name', 'varchar(255)',
	*     (col) => col.generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name))
	* )
	* ```
	*/
	generatedAlwaysAs(expression) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.createWithExpression(expression.toOperationNode()) }));
	}
	/**
	* Adds the `generated always as identity` specifier.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* For MS SQL Server (MSSQL)'s identity column use {@link identity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.generatedAlwaysAsIdentity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer generated always as identity primary key
	* )
	* ```
	*/
	generatedAlwaysAsIdentity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.create({
			identity: true,
			always: true
		}) }));
	}
	/**
	* Adds the `generated by default as identity` specifier on supported dialects.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* For MS SQL Server (MSSQL)'s identity column use {@link identity}.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.generatedByDefaultAsIdentity().primaryKey())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer generated by default as identity primary key
	* )
	* ```
	*/
	generatedByDefaultAsIdentity() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.create({
			identity: true,
			byDefault: true
		}) }));
	}
	/**
	* Makes a generated column stored instead of virtual. This method can only
	* be used with {@link generatedAlwaysAs}
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('full_name', 'varchar(255)', (col) => col
	*     .generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
	*     .stored()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name)) stored
	* )
	* ```
	*/
	stored() {
		if (!this.#node.generated) throw new Error("stored() can only be called after generatedAlwaysAs");
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.cloneWith(this.#node.generated, { stored: true }) }));
	}
	/**
	* This can be used to add any additional SQL right after the column's data type.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn(
	*     'first_name',
	*     'varchar(36)',
	*     (col) => col.modifyFront(sql`collate utf8mb4_general_ci`).notNull()
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(36) collate utf8mb4_general_ci not null
	* )
	* ```
	*/
	modifyFront(modifier) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithFrontModifier(this.#node, modifier.toOperationNode()));
	}
	/**
	* Adds `nulls not distinct` specifier.
	* Should be used with `unique` constraint.
	*
	* This only works on some dialects like PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(30)', col => col.unique().nullsNotDistinct())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create table "person" (
	*   "id" integer primary key,
	*   "first_name" varchar(30) unique nulls not distinct
	* )
	* ```
	*/
	nullsNotDistinct() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { nullsNotDistinct: true }));
	}
	/**
	* Adds `if not exists` specifier. This only works for PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .addColumn('email', 'varchar(255)', col => col.unique().ifNotExists())
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* alter table "person" add column if not exists "email" varchar(255) unique
	* ```
	*/
	ifNotExists() {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { ifNotExists: true }));
	}
	/**
	* This can be used to add any additional SQL to the end of the column definition.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn(
	*     'age',
	*     'integer',
	*     col => col.unsigned()
	*       .notNull()
	*       .modifyEnd(sql`comment ${sql.lit('it is not polite to ask a woman her age')}`)
	*   )
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `age` integer unsigned not null comment 'it is not polite to ask a woman her age'
	* )
	* ```
	*/
	modifyEnd(modifier) {
		return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithEndModifier(this.#node, modifier.toOperationNode()));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/modify-column-node.js
/**
* @internal
*/
var ModifyColumnNode = freeze({
	is(node) {
		return node.kind === "ModifyColumnNode";
	},
	create(column) {
		return freeze({
			kind: "ModifyColumnNode",
			column
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/foreign-key-constraint-node.js
/**
* @internal
*/
var ForeignKeyConstraintNode = freeze({
	is(node) {
		return node.kind === "ForeignKeyConstraintNode";
	},
	create(sourceColumns, targetTable, targetColumns, constraintName) {
		return freeze({
			kind: "ForeignKeyConstraintNode",
			columns: sourceColumns,
			references: ReferencesNode.create(targetTable, targetColumns),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/foreign-key-constraint-builder.js
var ForeignKeyConstraintBuilder = class ForeignKeyConstraintBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	onDelete(onDelete) {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { onDelete: parseOnModifyForeignAction(onDelete) }));
	}
	onUpdate(onUpdate) {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { onUpdate: parseOnModifyForeignAction(onUpdate) }));
	}
	deferrable() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/add-constraint-node.js
/**
* @internal
*/
var AddConstraintNode = freeze({
	is(node) {
		return node.kind === "AddConstraintNode";
	},
	create(constraint) {
		return freeze({
			kind: "AddConstraintNode",
			constraint
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/unique-constraint-node.js
/**
* @internal
*/
var UniqueConstraintNode = freeze({
	is(node) {
		return node.kind === "UniqueConstraintNode";
	},
	create(columns, constraintName, nullsNotDistinct) {
		if (isString(columns.at(0))) {
			logOnce("`UniqueConstraintNode.create(columns: string[], ...)` is deprecated - pass `ColumnNode[]` instead.");
			columns = columns.map(ColumnNode.create);
		}
		return freeze({
			kind: "UniqueConstraintNode",
			columns: freeze(columns),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0,
			nullsNotDistinct
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/drop-constraint-node.js
/**
* @internal
*/
var DropConstraintNode = freeze({
	is(node) {
		return node.kind === "DropConstraintNode";
	},
	create(constraintName) {
		return freeze({
			kind: "DropConstraintNode",
			constraintName: IdentifierNode.create(constraintName)
		});
	},
	cloneWith(dropConstraint, props) {
		return freeze({
			...dropConstraint,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/alter-column-node.js
/**
* @internal
*/
var AlterColumnNode = freeze({
	is(node) {
		return node.kind === "AlterColumnNode";
	},
	create(column, prop, value) {
		return freeze({
			kind: "AlterColumnNode",
			column: ColumnNode.create(column),
			[prop]: value
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/alter-column-builder.js
var AlterColumnBuilder = class {
	#column;
	constructor(column) {
		this.#column = column;
	}
	setDataType(dataType) {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dataType", parseDataTypeExpression(dataType)));
	}
	setDefault(value) {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setDefault", parseDefaultValueExpression(value)));
	}
	dropDefault() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropDefault", true));
	}
	setNotNull() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setNotNull", true));
	}
	dropNotNull() {
		return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropNotNull", true));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
};
/**
* Allows us to force consumers to do exactly one alteration to a column.
*
* One cannot do no alterations:
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .execute() // Property 'execute' does not exist on type 'AlteredColumnBuilder'.
* ```
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .alterColumn('age', (ac) => ac) // Type 'AlterColumnBuilder' is not assignable to type 'AlteredColumnBuilder'.
* //  .execute()
* ```
*
* One cannot do multiple alterations:
*
* ```ts
* await db.schema
*   .alterTable('person')
* //  .alterColumn('age', (ac) => ac.dropNotNull().setNotNull()) // Property 'setNotNull' does not exist on type 'AlteredColumnBuilder'.
* //  .execute()
* ```
*
* Which would now throw a compilation error, instead of a runtime error.
*/
var AlteredColumnBuilder = class {
	#alterColumnNode;
	constructor(alterColumnNode) {
		this.#alterColumnNode = alterColumnNode;
	}
	toOperationNode() {
		return this.#alterColumnNode;
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/alter-table-executor.js
var AlterTableExecutor = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/alter-table-add-foreign-key-constraint-builder.js
var AlterTableAddForeignKeyConstraintBuilder = class AlterTableAddForeignKeyConstraintBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	onDelete(onDelete) {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.onDelete(onDelete)
		});
	}
	onUpdate(onUpdate) {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.onUpdate(onUpdate)
		});
	}
	deferrable() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.deferrable()
		});
	}
	notDeferrable() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.notDeferrable()
		});
	}
	initiallyDeferred() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.initiallyDeferred()
		});
	}
	initiallyImmediate() {
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder: this.#props.constraintBuilder.initiallyImmediate()
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(this.#props.constraintBuilder.toOperationNode()) }), this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/alter-table-drop-constraint-builder.js
var AlterTableDropConstraintBuilder = class AlterTableDropConstraintBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifExists() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { ifExists: true }) })
		});
	}
	cascade() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { modifier: "cascade" }) })
		});
	}
	restrict() {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { modifier: "restrict" }) })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/primary-key-constraint-node.js
/**
* @internal
*/
var PrimaryKeyConstraintNode = freeze({
	is(node) {
		return node.kind === "PrimaryKeyConstraintNode";
	},
	create(columns, constraintName) {
		return freeze({
			kind: "PrimaryKeyConstraintNode",
			columns: freeze(columns.map(ColumnNode.create)),
			name: constraintName ? IdentifierNode.create(constraintName) : void 0
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/add-index-node.js
/**
* @internal
*/
var AddIndexNode = freeze({
	is(node) {
		return node.kind === "AddIndexNode";
	},
	create(name) {
		return freeze({
			kind: "AddIndexNode",
			name: IdentifierNode.create(name)
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	},
	cloneWithColumns(node, columns) {
		return freeze({
			...node,
			columns: [...node.columns || [], ...columns]
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/alter-table-add-index-builder.js
var AlterTableAddIndexBuilder = class AlterTableAddIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Makes the index unique.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_index')
	*   .unique()
	*   .column('email')
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add unique index `person_first_name_index` (`email`)
	* ```
	*/
	unique() {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWith(this.#props.node.addIndex, { unique: true }) })
		});
	}
	column(arg) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, [isString(arg) ? parseOrderedColumnName(arg) : arg.toOperationNode()]) })
		});
	}
	/**
	* Specifies a list of columns for the index.
	*
	* Also see {@link column} for adding a single column or {@link expression} for
	* specifying an arbitrary expression.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_and_age_index')
	*   .columns(['first_name', sql`(left(lower(last_name), 1))`, 'age desc'])
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person`
	* add index `person_first_name_and_age_index` (
	*   `first_name`,
	*   (left(lower(last_name), 1)),
	*   `age` desc
	* )
	* ```
	*/
	columns(columns) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, columns.map((item) => isString(item) ? parseOrderedColumnName(item) : item.toOperationNode())) })
		});
	}
	/**
	* Specifies an arbitrary expression for the index.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .alterTable('person')
	*   .addIndex('person_first_name_index')
	*   .expression(sql<boolean>`(first_name < 'Sami')`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add index `person_first_name_index` ((first_name < 'Sami'))
	* ```
	*
	* @deprecated Use {@link column} or {@link columns} with an {@link Expression} instead.
	*/
	expression(expression) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, [expression.toOperationNode()]) })
		});
	}
	using(indexType) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWith(this.#props.node.addIndex, { using: RawNode.createWithSql(indexType) }) })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/unique-constraint-builder.js
var UniqueConstraintNodeBuilder = class UniqueConstraintNodeBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Adds `nulls not distinct` to the unique constraint definition
	*
	* Supported by PostgreSQL dialect only
	*/
	nullsNotDistinct() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { nullsNotDistinct: true }));
	}
	deferrable() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/primary-key-constraint-builder.js
var PrimaryKeyConstraintBuilder = class PrimaryKeyConstraintBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	deferrable() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { deferrable: true }));
	}
	notDeferrable() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { deferrable: false }));
	}
	initiallyDeferred() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
	}
	initiallyImmediate() {
		return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/check-constraint-builder.js
var CheckConstraintBuilder = class {
	#node;
	constructor(node) {
		this.#node = node;
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/rename-constraint-node.js
/**
* @internal
*/
var RenameConstraintNode = freeze({
	is(node) {
		return node.kind === "RenameConstraintNode";
	},
	create(oldName, newName) {
		return freeze({
			kind: "RenameConstraintNode",
			oldName: IdentifierNode.create(oldName),
			newName: IdentifierNode.create(newName)
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/drop-column-builder.js
var DropColumnBuilder = class DropColumnBuilder {
	#props;
	constructor(props) {
		this.#props = freeze({ ...props });
	}
	ifExists() {
		return new DropColumnBuilder({
			...this.#props,
			node: DropColumnNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	toOperationNode() {
		return this.#props.node;
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/alter-table-builder.js
/**
* This builder can be used to create a `alter table` query.
*/
var AlterTableBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	renameTo(newTableName) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { renameTo: parseTable(newTableName) })
		});
	}
	setSchema(newSchema) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { setSchema: IdentifierNode.create(newSchema) })
		});
	}
	alterColumn(column, alteration) {
		const builder = alteration(new AlterColumnBuilder(column));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	dropColumn(column, build = noop) {
		const builder = build(new DropColumnBuilder({ node: DropColumnNode.create(column) }));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	renameColumn(column, newColumn) {
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
		});
	}
	addColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
		});
	}
	modifyColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
		});
	}
	/**
	* See {@link CreateTableBuilder.addUniqueConstraint}
	*/
	addUniqueConstraint(constraintName, columns, build = noop) {
		const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)), constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(uniqueConstraintBuilder.toOperationNode()) })
		});
	}
	/**
	* See {@link CreateTableBuilder.addCheckConstraint}
	*/
	addCheckConstraint(constraintName, checkExpression, build = noop) {
		const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode()) })
		});
	}
	/**
	* See {@link CreateTableBuilder.addForeignKeyConstraint}
	*
	* Unlike {@link CreateTableBuilder.addForeignKeyConstraint} this method returns
	* the constraint builder and doesn't take a callback as the last argument. This
	* is because you can only add one column per `ALTER TABLE` query.
	*/
	addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
		const constraintBuilder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
		return new AlterTableAddForeignKeyConstraintBuilder({
			...this.#props,
			constraintBuilder
		});
	}
	/**
	* See {@link CreateTableBuilder.addPrimaryKeyConstraint}
	*/
	addPrimaryKeyConstraint(constraintName, columns, build = noop) {
		const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode()) })
		});
	}
	dropConstraint(constraintName) {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.create(constraintName) })
		});
	}
	renameConstraint(oldName, newName) {
		return new AlterTableDropConstraintBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { renameConstraint: RenameConstraintNode.create(oldName, newName) })
		});
	}
	/**
	* This can be used to add index to table.
	*
	*  ### Examples
	*
	* ```ts
	* db.schema.alterTable('person')
	*   .addIndex('person_email_index')
	*   .column('email')
	*   .unique()
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` add unique index `person_email_index` (`email`)
	* ```
	*/
	addIndex(indexName) {
		return new AlterTableAddIndexBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.create(indexName) })
		});
	}
	/**
	* This can be used to drop index from table.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.alterTable('person')
	*   .dropIndex('person_email_index')
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* alter table `person` drop index `test_first_name_index`
	* ```
	*/
	dropIndex(indexName) {
		return new AlterTableExecutor({
			...this.#props,
			node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropIndex: DropIndexNode.create(indexName) })
		});
	}
	/**
	* Calls the given function passing `this` as the only argument.
	*
	* See {@link CreateTableBuilder.$call}
	*/
	$call(func) {
		return func(this);
	}
};
var AlterTableColumnAlteringBuilder = class AlterTableColumnAlteringBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	alterColumn(column, alteration) {
		const builder = alteration(new AlterColumnBuilder(column));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	dropColumn(column, build = noop) {
		const builder = build(new DropColumnBuilder({ node: DropColumnNode.create(column) }));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
		});
	}
	renameColumn(column, newColumn) {
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
		});
	}
	addColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
		});
	}
	modifyColumn(columnName, dataType, build = noop) {
		const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new AlterTableColumnAlteringBuilder({
			...this.#props,
			node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
		});
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/plugin/immediate-value/immediate-value-transformer.js
/**
* Transforms all ValueNodes to immediate.
*
* WARNING! This should never be part of the public API. Users should never use this.
* This is an internal helper.
*
* @internal
*/
var ImmediateValueTransformer = class extends OperationNodeTransformer {
	transformPrimitiveValueList(node) {
		return ValueListNode.create(node.values.map(ValueNode.createImmediate));
	}
	transformValue(node) {
		return ValueNode.createImmediate(node.value);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/create-index-builder.js
var CreateIndexBuilder = class CreateIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "if not exists" modifier.
	*
	* If the index already exists, no error is thrown if this method has been called.
	*/
	ifNotExists() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Makes the index unique.
	*/
	unique() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { unique: true })
		});
	}
	/**
	* Adds `nulls not distinct` specifier to index.
	* This only works on some dialects like PostgreSQL.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.createIndex('person_first_name_index')
	*  .on('person')
	*  .column('first_name')
	*  .nullsNotDistinct()
	*  .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_index"
	* on "test" ("first_name")
	* nulls not distinct;
	* ```
	*/
	nullsNotDistinct() {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { nullsNotDistinct: true })
		});
	}
	/**
	* Specifies the table for the index.
	*/
	on(table) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { table: parseTable(table) })
		});
	}
	column(arg) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, [isString(arg) ? parseOrderedColumnName(arg) : arg.toOperationNode()])
		});
	}
	/**
	* Adds a list of columns to the index.
	*
	* Also see {@link column} for adding a single column.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createIndex('person_first_name_and_age_index')
	*   .on('person')
	*   .columns(['first_name', sql`left(lower("last_name"), 1)`, 'age desc'])
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_and_age_index"
	* on "person" ("first_name", left(lower("last_name"), 1), "age" desc)
	* ```
	*/
	columns(columns) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, columns.map((item) => isString(item) ? parseOrderedColumnName(item) : item.toOperationNode()))
		});
	}
	/**
	* Adds an arbitrary expression as a column to the index.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createIndex('person_first_name_index')
	*   .on('person')
	*   .expression(sql`first_name COLLATE "fi_FI"`)
	*   .column('gender')
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create index "person_first_name_index"
	* on "person" (first_name COLLATE "fi_FI", "gender")
	* ```
	*
	* @deprecated Use {@link column} or {@link columns} with an {@link Expression} instead.
	*/
	expression(expression) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWithColumns(this.#props.node, [expression.toOperationNode()])
		});
	}
	using(indexType) {
		return new CreateIndexBuilder({
			...this.#props,
			node: CreateIndexNode.cloneWith(this.#props.node, { using: RawNode.createWithSql(indexType) })
		});
	}
	where(...args) {
		const transformer = new ImmediateValueTransformer();
		return new CreateIndexBuilder({
			...this.#props,
			node: QueryNode.cloneWithWhere(this.#props.node, transformer.transformNode(parseValueBinaryOperationOrExpression(args), this.#props.queryId))
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/create-schema-builder.js
var CreateSchemaBuilder = class CreateSchemaBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifNotExists() {
		return new CreateSchemaBuilder({
			...this.#props,
			node: CreateSchemaNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/parser/on-commit-action-parse.js
function parseOnCommitAction(action) {
	if (ON_COMMIT_ACTIONS.includes(action)) return action;
	throw new Error(`invalid OnCommitAction ${action}`);
}
//#endregion
//#region node_modules/kysely/dist/schema/create-table-add-index-builder.js
var CreateTableAddIndexBuilder = class CreateTableAddIndexBuilder {
	#node;
	constructor(node) {
		this.#node = node;
	}
	using(indexType) {
		return new CreateTableAddIndexBuilder(AddIndexNode.cloneWith(this.#node, { using: RawNode.createWithSql(indexType) }));
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#node;
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/create-table-builder.js
/**
* This builder can be used to create a `create table` query.
*/
var CreateTableBuilder = class CreateTableBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* Use this to create a temporary table.
	*/
	temporary() {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	/**
	* Adds an "on commit" statement.
	*
	* This can be used in conjunction with temporary tables on supported databases
	* like PostgreSQL.
	*/
	onCommit(onCommit) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { onCommit: parseOnCommitAction(onCommit) })
		});
	}
	/**
	* Adds the "if not exists" modifier.
	*
	* If the table already exists, no error is thrown if this method has been called.
	*/
	ifNotExists() {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	/**
	* Adds a column to the table.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
	*   .addColumn('first_name', 'varchar(50)', (col) => col.notNull())
	*   .addColumn('last_name', 'varchar(255)')
	*   .addColumn('bank_balance', 'numeric(8, 2)')
	*   // You can specify any data type using the `sql` tag if the types
	*   // don't include it.
	*   .addColumn('data', sql`any_type_here`)
	*   .addColumn('parent_id', 'integer', (col) =>
	*     col.references('person.id').onDelete('cascade')
	*   )
	* ```
	*
	* With this method, it's once again good to remember that Kysely just builds the
	* query and doesn't provide the same API for all databases. For example, some
	* databases like older MySQL don't support the `references` statement in the
	* column definition. Instead foreign key constraints need to be defined in the
	* `create table` query. See the next example:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', (col) => col.primaryKey())
	*   .addColumn('parent_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'person_parent_id_fk',
	*     ['parent_id'],
	*     'person',
	*     ['id'],
	*     (cb) => cb.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* Another good example is that PostgreSQL doesn't support the `auto_increment`
	* keyword and you need to define an autoincrementing column for example using
	* `serial`:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'serial', (col) => col.primaryKey())
	*   .execute()
	* ```
	*/
	addColumn(columnName, dataType, build = noop) {
		const columnBuilder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithColumn(this.#props.node, columnBuilder.toOperationNode())
		});
	}
	/**
	* Adds a primary key constraint for one or more columns.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addPrimaryKeyConstraint('primary_key', ['first_name', 'last_name'])
	*   .execute()
	* ```
	*/
	addPrimaryKeyConstraint(constraintName, columns, build = noop) {
		const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, constraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds a unique constraint for one or more columns.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     ['first_name', 'last_name']
	*   )
	*   .execute()
	* ```
	*
	* In dialects such as PostgreSQL you can specify `nulls not distinct` as follows:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     ['first_name', 'last_name'],
	*     (cb) => cb.nullsNotDistinct()
	*   )
	*   .execute()
	* ```
	*
	* In dialects such as MySQL you create unique constraints on expressions as follows:
	*
	* ```ts
	*
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addUniqueConstraint(
	*     'first_name_last_name_unique',
	*     [sql`(lower('first_name'))`, 'last_name']
	*   )
	*   .execute()
	* ```
	*/
	addUniqueConstraint(constraintName, columns, build = noop) {
		const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, uniqueConstraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds an index that includes one or more columns.
	*
	* This is only supported by some dialects like MySQL.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('first_name', 'varchar(64)')
	*   .addColumn('last_name', 'varchar(64)')
	*   .addIndex('last_name_key', ['last_name'])
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(64) not null,
	*   `last_name` varchar(64) not null,
	*   index `last_name_key` (`last_name`)
	* )
	* ```
	*/
	addIndex(indexName, columns, build = noop) {
		const addIndexBuilder = build(new CreateTableAddIndexBuilder(AddIndexNode.cloneWithColumns(AddIndexNode.create(indexName), columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)))));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithIndex(this.#props.node, addIndexBuilder.toOperationNode())
		});
	}
	/**
	* Adds a check constraint.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('animal')
	*   .addColumn('number_of_legs', 'integer')
	*   .addCheckConstraint('check_legs', sql`number_of_legs < 5`)
	*   .execute()
	* ```
	*/
	addCheckConstraint(constraintName, checkExpression, build = noop) {
		const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, constraintBuilder.toOperationNode())
		});
	}
	/**
	* Adds a foreign key constraint.
	*
	* The constraint name can be anything you want, but it must be unique
	* across the whole database.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'owner_id_foreign',
	*     ['owner_id'],
	*     'person',
	*     ['id'],
	*   )
	*   .execute()
	* ```
	*
	* Add constraint for multiple columns:
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('owner_id1', 'integer')
	*   .addColumn('owner_id2', 'integer')
	*   .addForeignKeyConstraint(
	*     'owner_id_foreign',
	*     ['owner_id1', 'owner_id2'],
	*     'person',
	*     ['id1', 'id2'],
	*     (cb) => cb.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*/
	addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
		const builder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithConstraint(this.#props.node, builder.toOperationNode())
		});
	}
	/**
	* This can be used to add any additional SQL to the front of the query __after__ the `create` keyword.
	*
	* Also see {@link temporary}.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .modifyFront(sql`global temporary`)
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(64)', col => col.notNull())
	*   .addColumn('last_name', 'varchar(64)', col => col.notNull())
	*   .execute()
	* ```
	*
	* The generated SQL (Postgres):
	*
	* ```sql
	* create global temporary table "person" (
	*   "id" integer primary key,
	*   "first_name" varchar(64) not null,
	*   "last_name" varchar(64) not null
	* )
	* ```
	*/
	modifyFront(modifier) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithFrontModifier(this.#props.node, modifier.toOperationNode())
		});
	}
	/**
	* This can be used to add any additional SQL to the end of the query.
	*
	* Also see {@link onCommit}.
	*
	* ### Examples
	*
	* ```ts
	* import { sql } from 'kysely'
	*
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey())
	*   .addColumn('first_name', 'varchar(64)', col => col.notNull())
	*   .addColumn('last_name', 'varchar(64)', col => col.notNull())
	*   .modifyEnd(sql`collate utf8_unicode_ci`)
	*   .execute()
	* ```
	*
	* The generated SQL (MySQL):
	*
	* ```sql
	* create table `person` (
	*   `id` integer primary key,
	*   `first_name` varchar(64) not null,
	*   `last_name` varchar(64) not null
	* ) collate utf8_unicode_ci
	* ```
	*/
	modifyEnd(modifier) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWithEndModifier(this.#props.node, modifier.toOperationNode())
		});
	}
	/**
	* Allows to create table from `select` query.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('copy')
	*   .temporary()
	*   .as(db.selectFrom('person').select(['first_name', 'last_name']))
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* create temporary table "copy" as
	* select "first_name", "last_name" from "person"
	* ```
	*/
	as(expression) {
		return new CreateTableBuilder({
			...this.#props,
			node: CreateTableNode.cloneWith(this.#props.node, { selectQuery: parseExpression(expression) })
		});
	}
	/**
	* Calls the given function passing `this` as the only argument.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createTable('test')
	*   .$call((builder) => builder.addColumn('id', 'integer'))
	*   .execute()
	* ```
	*
	* This is useful for creating reusable functions that can be called with a builder.
	*
	* ```ts
	* import { type CreateTableBuilder, sql } from 'kysely'
	*
	* const addDefaultColumns = (ctb: CreateTableBuilder<any, any>) => {
	*   return ctb
	*     .addColumn('id', 'integer', (col) => col.notNull())
	*     .addColumn('created_at', 'date', (col) =>
	*       col.notNull().defaultTo(sql`now()`)
	*     )
	*     .addColumn('updated_at', 'date', (col) =>
	*       col.notNull().defaultTo(sql`now()`)
	*     )
	* }
	*
	* await db.schema
	*   .createTable('test')
	*   .$call(addDefaultColumns)
	*   .execute()
	* ```
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/drop-index-builder.js
var DropIndexBuilder = class DropIndexBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Specifies the table the index was created for. This is not needed
	* in all dialects.
	*/
	on(table) {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { table: parseTable(table) })
		});
	}
	ifExists() {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropIndexBuilder({
			...this.#props,
			node: DropIndexNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/drop-schema-builder.js
var DropSchemaBuilder = class DropSchemaBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	ifExists() {
		return new DropSchemaBuilder({
			...this.#props,
			node: DropSchemaNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropSchemaBuilder({
			...this.#props,
			node: DropSchemaNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/drop-table-builder.js
var DropTableBuilder = class DropTableBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* This is only supported by some dialects like MySQL.
	*/
	temporary() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	ifExists() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropTableBuilder({
			...this.#props,
			node: DropTableNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/create-view-node.js
/**
* @internal
*/
var CreateViewNode = freeze({
	is(node) {
		return node.kind === "CreateViewNode";
	},
	create(name) {
		return freeze({
			kind: "CreateViewNode",
			name: SchemableIdentifierNode.create(name)
		});
	},
	cloneWith(createView, params) {
		return freeze({
			...createView,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/plugin/immediate-value/immediate-value-plugin.js
/**
* Transforms all ValueNodes to immediate.
*
* WARNING! This should never be part of the public API. Users should never use this.
* This is an internal helper.
*
* @internal
*/
var ImmediateValuePlugin = class {
	#transformer = new ImmediateValueTransformer();
	transformQuery(args) {
		return this.#transformer.transformNode(args.node, args.queryId);
	}
	transformResult(args) {
		return Promise.resolve(args.result);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/create-view-builder.js
var CreateViewBuilder = class CreateViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "temporary" modifier.
	*
	* Use this to create a temporary view.
	*/
	temporary() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { temporary: true })
		});
	}
	materialized() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { materialized: true })
		});
	}
	/**
	* Only implemented on some dialects like SQLite. On most dialects, use {@link orReplace}.
	*/
	ifNotExists() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { ifNotExists: true })
		});
	}
	orReplace() {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { orReplace: true })
		});
	}
	columns(columns) {
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { columns: columns.map(parseColumnName) })
		});
	}
	/**
	* Sets the select query or a `values` statement that creates the view.
	*
	* WARNING!
	* Some dialects don't support parameterized queries in DDL statements and therefore
	* the query or raw {@link sql } expression passed here is interpolated into a single
	* string opening an SQL injection vulnerability. DO NOT pass unchecked user input
	* into the query or raw expression passed to this method!
	*/
	as(query) {
		const queryNode = query.withPlugin(new ImmediateValuePlugin()).toOperationNode();
		return new CreateViewBuilder({
			...this.#props,
			node: CreateViewNode.cloneWith(this.#props.node, { as: queryNode })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/drop-view-node.js
/**
* @internal
*/
var DropViewNode = freeze({
	is(node) {
		return node.kind === "DropViewNode";
	},
	create(name) {
		return freeze({
			kind: "DropViewNode",
			name: SchemableIdentifierNode.create(name)
		});
	},
	cloneWith(dropView, params) {
		return freeze({
			...dropView,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/drop-view-builder.js
var DropViewBuilder = class DropViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	materialized() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { materialized: true })
		});
	}
	ifExists() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	cascade() {
		return new DropViewBuilder({
			...this.#props,
			node: DropViewNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/create-type-node.js
/**
* @internal
*/
var CreateTypeNode = freeze({
	is(node) {
		return node.kind === "CreateTypeNode";
	},
	create(name) {
		return freeze({
			kind: "CreateTypeNode",
			name
		});
	},
	cloneWithEnum(createType, values) {
		return freeze({
			...createType,
			enum: ValueListNode.create(values.map(ValueNode.createImmediate))
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/create-type-builder.js
var CreateTypeBuilder = class CreateTypeBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	/**
	* Creates an enum type.
	*
	* ### Examples
	*
	* ```ts
	* db.schema.createType('species').asEnum(['cat', 'dog', 'frog'])
	* ```
	*/
	asEnum(values) {
		return new CreateTypeBuilder({
			...this.#props,
			node: CreateTypeNode.cloneWithEnum(this.#props.node, values)
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/drop-type-node.js
/**
* @internal
*/
var DropTypeNode = freeze({
	is(node) {
		return node.kind === "DropTypeNode";
	},
	create(names) {
		if (!Array.isArray(names)) names = [names];
		return freeze({
			kind: "DropTypeNode",
			name: names[0],
			additionalNames: names.slice(1)
		});
	},
	cloneWith(dropType, params) {
		return freeze({
			...dropType,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/drop-type-builder.js
var DropTypeBuilder = class DropTypeBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds `if exists` to the query.
	*/
	ifExists() {
		return new DropTypeBuilder({
			...this.#props,
			node: DropTypeNode.cloneWith(this.#props.node, { ifExists: true })
		});
	}
	/**
	* Adds `cascade` to the query.
	*/
	cascade() {
		return new DropTypeBuilder({
			...this.#props,
			node: DropTypeNode.cloneWith(this.#props.node, { cascade: true })
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/parser/identifier-parser.js
function parseSchemableIdentifier(id) {
	const SCHEMA_SEPARATOR = ".";
	if (id.includes(SCHEMA_SEPARATOR)) {
		const parts = id.split(SCHEMA_SEPARATOR).map(trim);
		if (parts.length === 2) return SchemableIdentifierNode.createWithSchema(parts[0], parts[1]);
		else throw new Error(`invalid schemable identifier ${id}`);
	} else return SchemableIdentifierNode.create(id);
}
function parseSchemableIdentifierArray(id) {
	if (!Array.isArray(id)) id = [id];
	return id.map(parseSchemableIdentifier);
}
function trim(str) {
	return str.trim();
}
//#endregion
//#region node_modules/kysely/dist/operation-node/refresh-materialized-view-node.js
/**
* @internal
*/
var RefreshMaterializedViewNode = freeze({
	is(node) {
		return node.kind === "RefreshMaterializedViewNode";
	},
	create(name) {
		return freeze({
			kind: "RefreshMaterializedViewNode",
			name: SchemableIdentifierNode.create(name)
		});
	},
	cloneWith(createView, params) {
		return freeze({
			...createView,
			...params
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/refresh-materialized-view-builder.js
var RefreshMaterializedViewBuilder = class RefreshMaterializedViewBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds the "concurrently" modifier.
	*
	* Use this to refresh the view without locking out concurrent selects on the materialized view.
	*
	* WARNING!
	* This cannot be used with the "with no data" modifier.
	*/
	concurrently() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, {
				concurrently: true,
				withNoData: false
			})
		});
	}
	/**
	* Adds the "with data" modifier.
	*
	* If specified (or defaults) the backing query is executed to provide the new data, and the materialized view is left in a scannable state
	*/
	withData() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, { withNoData: false })
		});
	}
	/**
	* Adds the "with no data" modifier.
	*
	* If specified, no new data is generated and the materialized view is left in an unscannable state.
	*
	* WARNING!
	* This cannot be used with the "concurrently" modifier.
	*/
	withNoData() {
		return new RefreshMaterializedViewBuilder({
			...this.#props,
			node: RefreshMaterializedViewNode.cloneWith(this.#props.node, {
				withNoData: true,
				concurrently: false
			})
		});
	}
	/**
	* Simply calls the provided function passing `this` as the only argument. `$call` returns
	* what the provided function returns.
	*/
	$call(func) {
		return func(this);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	async execute(options) {
		await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/operation-node/alter-type-node.js
/**
* @internal
*/
var AlterTypeNode = freeze({
	is(node) {
		return node.kind === "AlterTypeNode";
	},
	create(name) {
		return freeze({
			kind: "AlterTypeNode",
			name
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/operation-node/add-value-node.js
/**
* @internal
*/
var AddValueNode = freeze({
	is(node) {
		return node.kind === "AddValueNode";
	},
	create(value) {
		return freeze({
			kind: "AddValueNode",
			value
		});
	},
	cloneWith(node, props) {
		return freeze({
			...node,
			...props
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/query-finalizer.js
var QueryFinalizer = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	toOperationNode() {
		return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
	}
	/**
	* Compiles the query.
	*/
	compile() {
		return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
	}
	/**
	* Executes the query.
	*/
	async execute(options) {
		return await this.#props.executor.executeQuery(this.compile(), options);
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/alter-type-add-value-builder.js
var _a;
var AlterTypeAddValueBuilder = class extends QueryFinalizer {
	#props;
	constructor(props) {
		super(props);
		this.#props = props;
	}
	/**
	* Adds an `if not exists` clause.
	*/
	ifNotExists() {
		return new _a({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.cloneWith(this.#props.node.addValue, { ifNotExists: true }) })
		});
	}
	/**
	* Sets a `before <value>` clause.
	*/
	before(neighborValue) {
		return this.#setNeighbor(neighborValue, true);
	}
	/**
	* Sets an `after <value>` clause.
	*/
	after(neighborValue) {
		return this.#setNeighbor(neighborValue, false);
	}
	#setNeighbor(neighborValue, isBefore) {
		return new _a({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.cloneWith(this.#props.node.addValue, {
				isBefore,
				neighborValue: ValueNode.createImmediate(neighborValue)
			}) })
		});
	}
};
_a = AlterTypeAddValueBuilder;
//#endregion
//#region node_modules/kysely/dist/operation-node/rename-value-node.js
var RenameValueNode = freeze({
	is(node) {
		return node.kind === "RenameValueNode";
	},
	create(oldValue, newValue) {
		return freeze({
			kind: "RenameValueNode",
			oldValue,
			newValue
		});
	}
});
//#endregion
//#region node_modules/kysely/dist/schema/alter-type-builder.js
/**
* This builder can be used to create `alter type` queries.
*/
var AlterTypeBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	/**
	* Adds a new value to an enum type.
	*/
	addValue(value) {
		return new AlterTypeAddValueBuilder({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.create(ValueNode.createImmediate(value)) })
		});
	}
	/**
	* Rename the type.
	*/
	renameTo(newName) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { renameTo: IdentifierNode.create(newName) })
		});
	}
	/**
	* Renames a value of an enum type.
	*/
	renameValue(oldValue, newValue) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { renameValue: RenameValueNode.create(ValueNode.createImmediate(oldValue), ValueNode.createImmediate(newValue)) })
		});
	}
	/**
	* Changes the type's schema.
	*/
	setSchema(schema) {
		return new QueryFinalizer({
			...this.#props,
			node: AlterTypeNode.cloneWith(this.#props.node, { setSchema: IdentifierNode.create(schema) })
		});
	}
};
//#endregion
//#region node_modules/kysely/dist/schema/schema-module.js
/**
* Provides methods for building database schema.
*/
var SchemaModule = class SchemaModule {
	#executor;
	constructor(executor) {
		this.#executor = executor;
	}
	/**
	* Create a new table.
	*
	* ### Examples
	*
	* This example creates a new table with columns `id`, `first_name`,
	* `last_name` and `gender`:
	*
	* ```ts
	* await db.schema
	*   .createTable('person')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('first_name', 'varchar', col => col.notNull())
	*   .addColumn('last_name', 'varchar', col => col.notNull())
	*   .addColumn('gender', 'varchar')
	*   .execute()
	* ```
	*
	* This example creates a table with a foreign key. Not all database
	* engines support column-level foreign key constraint definitions.
	* For example if you are using MySQL 5.X see the next example after
	* this one.
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('owner_id', 'integer', col => col
	*     .references('person.id')
	*     .onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*
	* This example adds a foreign key constraint for a columns just
	* like the previous example, but using a table-level statement.
	* On MySQL 5.X you need to define foreign key constraints like
	* this:
	*
	* ```ts
	* await db.schema
	*   .createTable('pet')
	*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
	*   .addColumn('owner_id', 'integer')
	*   .addForeignKeyConstraint(
	*     'pet_owner_id_foreign', ['owner_id'], 'person', ['id'],
	*     (constraint) => constraint.onDelete('cascade')
	*   )
	*   .execute()
	* ```
	*/
	createTable(table) {
		return new CreateTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateTableNode.create(parseTable(table))
		});
	}
	/**
	* Drop a table.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropTable('person')
	*   .execute()
	* ```
	*/
	dropTable(table) {
		return new DropTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropTableNode.create(parseTable(table))
		});
	}
	/**
	* Create a new index.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createIndex('person_full_name_unique_index')
	*   .on('person')
	*   .columns(['first_name', 'last_name'])
	*   .execute()
	* ```
	*/
	createIndex(indexName) {
		return new CreateIndexBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateIndexNode.create(indexName)
		});
	}
	/**
	* Drop an index.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropIndex('person_full_name_unique_index')
	*   .execute()
	* ```
	*/
	dropIndex(indexName) {
		return new DropIndexBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropIndexNode.create(indexName)
		});
	}
	/**
	* Create a new schema.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createSchema('some_schema')
	*   .execute()
	* ```
	*/
	createSchema(schema) {
		return new CreateSchemaBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateSchemaNode.create(schema)
		});
	}
	/**
	* Drop a schema.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropSchema('some_schema')
	*   .execute()
	* ```
	*/
	dropSchema(schema) {
		return new DropSchemaBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropSchemaNode.create(schema)
		});
	}
	/**
	* Alter a table.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .alterTable('person')
	*   .alterColumn('first_name', (ac) => ac.setDataType('text'))
	*   .execute()
	* ```
	*/
	alterTable(table) {
		return new AlterTableBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: AlterTableNode.create(parseTable(table))
		});
	}
	/**
	* Create a new view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createView('dogs')
	*   .orReplace()
	*   .as(db.selectFrom('pet').selectAll().where('species', '=', 'dog'))
	*   .execute()
	* ```
	*/
	createView(viewName) {
		return new CreateViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateViewNode.create(viewName)
		});
	}
	/**
	* Refresh a materialized view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .refreshMaterializedView('my_view')
	*   .concurrently()
	*   .execute()
	* ```
	*/
	refreshMaterializedView(viewName) {
		return new RefreshMaterializedViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: RefreshMaterializedViewNode.create(viewName)
		});
	}
	/**
	* Drop a view.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropView('dogs')
	*   .ifExists()
	*   .execute()
	* ```
	*/
	dropView(viewName) {
		return new DropViewBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropViewNode.create(viewName)
		});
	}
	/**
	* Create a new type.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .createType('species')
	*   .asEnum(['dog', 'cat', 'frog'])
	*   .execute()
	* ```
	*/
	createType(typeName) {
		return new CreateTypeBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: CreateTypeNode.create(parseSchemableIdentifier(typeName))
		});
	}
	/**
	* Alter a type. Rename it, change schema or add/rename enum type values.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ```ts
	* await db.schema
	*   .alterType('species')
	*   .addValue('capybara')
	*   .execute()
	* ```
	*/
	alterType(name) {
		return new AlterTypeBuilder({
			executor: this.#executor,
			node: AlterTypeNode.create(parseSchemableIdentifier(name)),
			queryId: createQueryId()
		});
	}
	/**
	* Drop a type.
	*
	* Only some dialects like PostgreSQL have user-defined types.
	*
	* ### Examples
	*
	* ```ts
	* await db.schema
	*   .dropType('species')
	*   .ifExists()
	*   .execute()
	* ```
	*
	* You can also provide multiple type names:
	*
	* ```ts
	* await db.schema
	*   .dropType(['species', 'colors'])
	*   .ifExists()
	*   .cascade()
	*   .execute()
	* ```
	*/
	dropType(typeName) {
		return new DropTypeBuilder({
			queryId: createQueryId(),
			executor: this.#executor,
			node: DropTypeNode.create(parseSchemableIdentifierArray(typeName))
		});
	}
	/**
	* Returns a copy of this schema module with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new SchemaModule(this.#executor.withPlugin(plugin));
	}
	/**
	* Returns a copy of this schema module  without any plugins.
	*/
	withoutPlugins() {
		return new SchemaModule(this.#executor.withoutPlugins());
	}
	/**
	* See {@link QueryCreator.withSchema}
	*/
	withSchema(schema) {
		return new SchemaModule(this.#executor.withPluginAtFront(new WithSchemaPlugin(schema)));
	}
};
//#endregion
//#region node_modules/kysely/dist/dynamic/dynamic.js
var DynamicModule = class {
	/**
	* Creates a dynamic reference to a column that is not know at compile time.
	*
	* Kysely is built in a way that by default you can't refer to tables or columns
	* that are not actually visible in the current query and context. This is all
	* done by TypeScript at compile time, which means that you need to know the
	* columns and tables at compile time. This is not always the case of course.
	*
	* This method is meant to be used in those cases where the column names
	* come from the user input or are not otherwise known at compile time.
	*
	* WARNING! Unlike values, column names are not escaped by the database engine
	* or Kysely and if you pass in unchecked column names using this method, you
	* create an SQL injection vulnerability. Always __always__ validate the user
	* input before passing it to this method.
	*
	* There are couple of examples below for some use cases, but you can pass
	* `ref` to other methods as well. If the types allow you to pass a `ref`
	* value to some place, it should work.
	*
	* ### Examples
	*
	* Filter by a column not know at compile time:
	*
	* ```ts
	* async function someQuery(filterColumn: string, filterValue: string) {
	*   const { ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom('person')
	*     .selectAll()
	*     .where(ref(filterColumn), '=', filterValue)
	*     .execute()
	* }
	*
	* someQuery('first_name', 'Arnold')
	* someQuery('person.last_name', 'Aniston')
	* ```
	*
	* Order by a column not know at compile time:
	*
	* ```ts
	* async function someQuery(orderBy: string) {
	*   const { ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom('person')
	*     .select('person.first_name as fn')
	*     .orderBy(ref(orderBy))
	*     .execute()
	* }
	*
	* someQuery('fn')
	* ```
	*
	* In this example we add selections dynamically:
	*
	* ```ts
	* const { ref } = db.dynamic
	*
	* // Some column name provided by the user. Value not known at compile time.
	* const columnFromUserInput: PossibleColumns = 'birthdate';
	*
	* // A type that lists all possible values `columnFromUserInput` can have.
	* // You can use `keyof Person` if any column of an interface is allowed.
	* type PossibleColumns = 'last_name' | 'first_name' | 'birthdate'
	*
	* const [person] = await db.selectFrom('person')
	*   .select([
	*     ref<PossibleColumns>(columnFromUserInput),
	*     'id'
	*   ])
	*   .execute()
	*
	* // The resulting type contains all `PossibleColumns` as optional fields
	* // because we cannot know which field was actually selected before
	* // running the code.
	* const lastName: string | null | undefined = person?.last_name
	* const firstName: string | undefined = person?.first_name
	* const birthDate: Date | null | undefined = person?.birthdate
	*
	* // The result type also contains the compile time selection `id`.
	* person?.id
	* ```
	*/
	ref(reference) {
		return new DynamicReferenceBuilder(reference);
	}
	/**
	* Creates a table reference to a table that's not fully known at compile time.
	*
	* The type `T` is allowed to be a union of multiple tables.
	*
	* <!-- siteExample("select", "Generic find query", 130) -->
	*
	* A generic type-safe helper function for finding a row by a column value:
	*
	* ```ts
	* import { SelectType } from 'kysely'
	* import { Database } from 'type-editor'
	*
	* async function getRowByColumn<
	*   T extends keyof Database,
	*   C extends keyof Database[T] & string,
	*   V extends SelectType<Database[T][C]>,
	* >(t: T, c: C, v: V) {
	*   // We need to use the dynamic module since the table name
	*   // is not known at compile time.
	*   const { table, ref } = db.dynamic
	*
	*   return await db
	*     .selectFrom(table(t).as('t'))
	*     .selectAll()
	*     .where(ref(c), '=', v)
	*     .orderBy('t.id')
	*     .executeTakeFirstOrThrow()
	* }
	*
	* const person = await getRowByColumn('person', 'first_name', 'Arnold')
	* ```
	*/
	table(table) {
		return new DynamicTableBuilder(table);
	}
};
//#endregion
//#region node_modules/kysely/dist/driver/default-connection-provider.js
var DefaultConnectionProvider = class {
	#driver;
	constructor(driver) {
		this.#driver = driver;
	}
	async provideConnection(consumer, options) {
		const connection = await this.#driver.acquireConnection(options);
		try {
			return await consumer(connection);
		} finally {
			await this.#driver.releaseConnection(connection, options);
		}
	}
};
//#endregion
//#region node_modules/kysely/dist/query-executor/default-query-executor.js
var DefaultQueryExecutor = class DefaultQueryExecutor extends QueryExecutorBase {
	#compiler;
	#adapter;
	#connectionProvider;
	constructor(compiler, adapter, connectionProvider, plugins = []) {
		super(plugins);
		this.#compiler = compiler;
		this.#adapter = adapter;
		this.#connectionProvider = connectionProvider;
	}
	get adapter() {
		return this.#adapter;
	}
	compileQuery(node, queryId) {
		return this.#compiler.compileQuery(node, queryId);
	}
	provideConnection(consumer, options) {
		return this.#connectionProvider.provideConnection(consumer, options);
	}
	withPlugins(plugins) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, ...plugins]);
	}
	withPlugin(plugin) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, plugin]);
	}
	withPluginAtFront(plugin) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [plugin, ...this.plugins]);
	}
	withConnectionProvider(connectionProvider) {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, connectionProvider, [...this.plugins]);
	}
	withoutPlugins() {
		return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, []);
	}
};
//#endregion
//#region node_modules/kysely/dist/util/performance-now.js
function performanceNow() {
	if (typeof performance !== "undefined" && isFunction(performance.now)) return performance.now();
	else return Date.now();
}
//#endregion
//#region node_modules/kysely/dist/driver/connection-mutex.js
/**
* This mutex is used to ensure that only one operation at a time can
* acquire a connection from the driver. This is necessary when the
* driver only has a single connection, like SQLite and PGlite.
*
* @internal
*/
var ConnectionMutex$2 = class {
	#promise;
	#resolve;
	async obtainLock() {
		while (this.#promise) await this.#promise;
		this.#promise = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}
	releaseLock() {
		const resolve = this.#resolve;
		this.#promise = void 0;
		this.#resolve = void 0;
		resolve?.();
	}
};
//#endregion
//#region node_modules/kysely/dist/driver/runtime-driver.js
/**
* A small wrapper around {@link Driver} that makes sure the driver is
* initialized before it is used, only initialized and destroyed
* once etc.
*/
var RuntimeDriver = class {
	#driver;
	#log;
	#initPromise;
	#initDone;
	#destroyPromise;
	#connections = /* @__PURE__ */ new WeakSet();
	#connectionMutex;
	constructor(driver, adapter, log) {
		this.#driver = driver;
		this.#initDone = false;
		this.#log = log;
		if (adapter.supportsMultipleConnections === false) this.#connectionMutex = new ConnectionMutex$2();
	}
	async init(options) {
		if (this.#destroyPromise) throw new Error("driver has already been destroyed");
		this.#initPromise ??= this.#driver.init(options).then(() => {
			this.#initDone = true;
		}).catch((reason) => {
			this.#initPromise = void 0;
			throw reason;
		});
		await waitOrAbort(this.#initPromise, options?.signal, "init");
	}
	async acquireConnection(options) {
		if (this.#destroyPromise) throw new Error("driver has already been destroyed");
		if (!this.#initDone) await this.init(options);
		if (this.#connectionMutex) {
			const lockPromise = this.#connectionMutex.obtainLock();
			await waitOrAbort(lockPromise, options?.signal, "acquireConnection:mutex", () => lockPromise.then(() => this.#connectionMutex?.releaseLock()));
		}
		const connectionPromise = this.#driver.acquireConnection(options);
		const connection = await waitOrAbort(connectionPromise, options?.signal, "acquireConnection:acquire", () => connectionPromise?.then((connection) => this.releaseConnection(connection).catch(printBackgroundFail("driver.releaseConnection"))).catch(printBackgroundFail("driver.acquireConnection")));
		if (!this.#connections.has(connection)) {
			if (this.#needsLogging()) this.#addLogging(connection);
			this.#connections.add(connection);
		}
		return connection;
	}
	async releaseConnection(connection, options) {
		await this.#driver.releaseConnection(connection, options);
		this.#connectionMutex?.releaseLock();
	}
	async beginTransaction(connection, settings) {
		return await this.#driver.beginTransaction(connection, settings);
	}
	async commitTransaction(connection) {
		return await this.#driver.commitTransaction(connection);
	}
	async rollbackTransaction(connection) {
		return await this.#driver.rollbackTransaction(connection);
	}
	async savepoint(connection, savepointName, compileQuery) {
		if (this.#driver.savepoint) return await this.#driver.savepoint(connection, savepointName, compileQuery);
		throw new Error("The `savepoint` method is not supported by this driver");
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		if (this.#driver.rollbackToSavepoint) return await this.#driver.rollbackToSavepoint(connection, savepointName, compileQuery);
		throw new Error("The `rollbackToSavepoint` method is not supported by this driver");
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		if (this.#driver.releaseSavepoint) return await this.#driver.releaseSavepoint(connection, savepointName, compileQuery);
		throw new Error("The `releaseSavepoint` method is not supported by this driver");
	}
	async destroy(options) {
		if (!this.#initPromise) return;
		await waitOrAbort(this.#initPromise, options?.signal, "destroy:initPromise");
		this.#destroyPromise ??= this.#driver.destroy(options).catch((reason) => {
			this.#destroyPromise = void 0;
			throw reason;
		});
		await waitOrAbort(this.#destroyPromise, options?.signal, "destroy");
	}
	#needsLogging() {
		return this.#log.isLevelEnabled("query") || this.#log.isLevelEnabled("error");
	}
	#addLogging(connection) {
		const executeQuery = connection.executeQuery;
		const streamQuery = connection.streamQuery;
		const dis = this;
		connection.executeQuery = async (compiledQuery, options) => {
			let caughtError;
			const startTime = performanceNow();
			try {
				return await executeQuery.call(connection, compiledQuery, options);
			} catch (error) {
				caughtError = error;
				await dis.#logError(error, compiledQuery, startTime);
				throw error;
			} finally {
				if (!caughtError) await dis.#logQuery(compiledQuery, startTime);
			}
		};
		connection.streamQuery = async function* (compiledQuery, chunkSize, options) {
			let caughtError;
			const startTime = performanceNow();
			try {
				for await (const result of streamQuery.call(connection, compiledQuery, chunkSize, options)) yield result;
			} catch (error) {
				caughtError = error;
				await dis.#logError(error, compiledQuery, startTime);
				throw error;
			} finally {
				if (!caughtError) await dis.#logQuery(compiledQuery, startTime, true);
			}
		};
	}
	async #logError(error, compiledQuery, startTime) {
		await this.#log.error(() => ({
			level: "error",
			error,
			query: compiledQuery,
			queryDurationMillis: this.#calculateDurationMillis(startTime)
		}));
	}
	async #logQuery(compiledQuery, startTime, isStream = false) {
		await this.#log.query(() => ({
			level: "query",
			isStream,
			query: compiledQuery,
			queryDurationMillis: this.#calculateDurationMillis(startTime)
		}));
	}
	#calculateDurationMillis(startTime) {
		return performanceNow() - startTime;
	}
};
//#endregion
//#region node_modules/kysely/dist/driver/single-connection-provider.js
var ignoreError = () => {};
var SingleConnectionProvider = class {
	#connection;
	#runningPromise;
	constructor(connection) {
		this.#connection = connection;
	}
	async provideConnection(consumer) {
		while (this.#runningPromise) await this.#runningPromise.catch(ignoreError);
		this.#runningPromise = this.#run(consumer).finally(() => {
			this.#runningPromise = void 0;
		});
		return this.#runningPromise;
	}
	async #run(runner) {
		return await runner(this.#connection);
	}
};
//#endregion
//#region node_modules/kysely/dist/driver/driver.js
var TRANSACTION_ACCESS_MODES = ["read only", "read write"];
var TRANSACTION_ISOLATION_LEVELS = [
	"read uncommitted",
	"read committed",
	"repeatable read",
	"serializable",
	"snapshot"
];
function validateTransactionSettings(settings) {
	if (settings.accessMode && !TRANSACTION_ACCESS_MODES.includes(settings.accessMode)) throw new Error(`invalid transaction access mode ${settings.accessMode}`);
	if (settings.isolationLevel && !TRANSACTION_ISOLATION_LEVELS.includes(settings.isolationLevel)) throw new Error(`invalid transaction isolation level ${settings.isolationLevel}`);
}
freeze(["query", "error"]);
var Log = class {
	#levels;
	#logger;
	constructor(config) {
		if (isFunction(config)) {
			this.#logger = config;
			this.#levels = freeze({
				query: true,
				error: true
			});
		} else {
			this.#logger = defaultLogger;
			this.#levels = freeze({
				query: config.includes("query"),
				error: config.includes("error")
			});
		}
	}
	isLevelEnabled(level) {
		return this.#levels[level];
	}
	async query(getEvent) {
		if (this.#levels.query) await this.#logger(getEvent());
	}
	async error(getEvent) {
		if (this.#levels.error) await this.#logger(getEvent());
	}
};
function defaultLogger(event) {
	if (event.level === "query") {
		const prefix = `kysely:query:${event.isStream ? "stream:" : ""}`;
		console.log(`${prefix} ${event.query.sql}`);
		console.log(`${prefix} duration: ${event.queryDurationMillis.toFixed(1)}ms`);
	} else if (event.level === "error") {
		if (event.error instanceof Error) console.error(`kysely:error: ${event.error.stack ?? event.error.message}`);
		else console.error(`kysely:error: ${JSON.stringify({
			error: event.error,
			query: event.query.sql,
			queryDurationMillis: event.queryDurationMillis
		})}`);
	}
}
//#endregion
//#region node_modules/kysely/dist/util/compilable.js
function isCompilable(value) {
	return isObject(value) && isFunction(value.compile);
}
//#endregion
//#region node_modules/kysely/dist/kysely.js
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
/**
* The main Kysely class.
*
* You should create one instance of `Kysely` per database using the {@link Kysely}
* constructor. Each `Kysely` instance maintains its own connection pool.
*
* ### Examples
*
* This example assumes your database has a "person" table:
*
* ```ts
* import * as Sqlite from 'better-sqlite3'
* import { type Generated, Kysely, SqliteDialect } from 'kysely'
*
* interface Database {
*   person: {
*     id: Generated<number>
*     first_name: string
*     last_name: string | null
*   }
* }
*
* const db = new Kysely<Database>({
*   dialect: new SqliteDialect({
*     database: new Sqlite(':memory:'),
*   })
* })
* ```
*
* @typeParam DB - The database interface type. Keys of this type must be table names
*    in the database and values must be interfaces that describe the rows in those
*    tables. See the examples above.
*/
var Kysely = class Kysely extends QueryCreator {
	#props;
	constructor(args) {
		let superProps;
		let props;
		if (isKyselyProps(args)) {
			superProps = { executor: args.executor };
			props = { ...args };
		} else {
			const dialect = args.dialect;
			const driver = dialect.createDriver();
			const compiler = dialect.createQueryCompiler();
			const adapter = dialect.createAdapter();
			const runtimeDriver = new RuntimeDriver(driver, adapter, new Log(args.log ?? []));
			const executor = new DefaultQueryExecutor(compiler, adapter, new DefaultConnectionProvider(runtimeDriver), args.plugins ?? []);
			superProps = { executor };
			props = {
				config: args,
				executor,
				dialect,
				driver: runtimeDriver
			};
		}
		super(superProps);
		this.#props = freeze(props);
	}
	/**
	* Returns the {@link SchemaModule} module for building database schema.
	*/
	get schema() {
		return new SchemaModule(this.#props.executor);
	}
	/**
	* Returns a the {@link DynamicModule} module.
	*
	* The {@link DynamicModule} module can be used to bypass strict typing and
	* passing in dynamic values for the queries.
	*/
	get dynamic() {
		return new DynamicModule();
	}
	/**
	* Returns a {@link DatabaseIntrospector | database introspector}.
	*/
	get introspection() {
		return this.#props.dialect.createIntrospector(this.withoutPlugins());
	}
	case(value) {
		return new CaseBuilder({ node: CaseNode.create(isUndefined(value) ? void 0 : parseExpression(value)) });
	}
	/**
	* Returns a {@link FunctionModule} that can be used to write somewhat type-safe function
	* calls.
	*
	* ```ts
	* const { count } = db.fn
	*
	* await db.selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .select([
	*     'id',
	*     count('pet.id').as('person_count'),
	*   ])
	*   .groupBy('person.id')
	*   .having(count('pet.id'), '>', 10)
	*   .execute()
	* ```
	*
	* The generated SQL (PostgreSQL):
	*
	* ```sql
	* select "person"."id", count("pet"."id") as "person_count"
	* from "person"
	* inner join "pet" on "pet"."owner_id" = "person"."id"
	* group by "person"."id"
	* having count("pet"."id") > $1
	* ```
	*
	* Why "somewhat" type-safe? Because the function calls are not bound to the
	* current query context. They allow you to reference columns and tables that
	* are not in the current query. E.g. remove the `innerJoin` from the previous
	* query and TypeScript won't even complain.
	*
	* If you want to make the function calls fully type-safe, you can use the
	* {@link ExpressionBuilder.fn} getter for a query context-aware, stricter {@link FunctionModule}.
	*
	* ```ts
	* await db.selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .select((eb) => [
	*     'person.id',
	*     eb.fn.count('pet.id').as('pet_count')
	*   ])
	*   .groupBy('person.id')
	*   .having((eb) => eb.fn.count('pet.id'), '>', 10)
	*   .execute()
	* ```
	*/
	get fn() {
		return createFunctionModule();
	}
	/**
	* Creates a {@link TransactionBuilder} that can be used to run queries inside a transaction.
	*
	* The returned {@link TransactionBuilder} can be used to configure the transaction. The
	* {@link TransactionBuilder.execute} method can then be called to run the transaction.
	* {@link TransactionBuilder.execute} takes a function that is run inside the
	* transaction. If the function throws an exception,
	* 1. the exception is caught,
	* 2. the transaction is rolled back, and
	* 3. the exception is thrown again.
	* Otherwise the transaction is committed.
	*
	* The callback function passed to the {@link TransactionBuilder.execute | execute}
	* method gets the transaction object as its only argument. The transaction is
	* of type {@link Transaction} which inherits {@link Kysely}. Any query
	* started through the transaction object is executed inside the transaction.
	*
	* To run a controlled transaction, allowing you to commit and rollback manually,
	* use {@link startTransaction} instead.
	*
	* ### Examples
	*
	* <!-- siteExample("transactions", "Simple transaction", 10) -->
	*
	* This example inserts two rows in a transaction. If an exception is thrown inside
	* the callback passed to the `execute` method,
	* 1. the exception is caught,
	* 2. the transaction is rolled back, and
	* 3. the exception is thrown again.
	* Otherwise the transaction is committed.
	*
	* ```ts
	* const catto = await db.transaction().execute(async (trx) => {
	*   const jennifer = await trx.insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   return await trx.insertInto('pet')
	*     .values({
	*       owner_id: jennifer.id,
	*       name: 'Catto',
	*       species: 'cat',
	*       is_favorite: false,
	*     })
	*     .returningAll()
	*     .executeTakeFirst()
	* })
	* ```
	*
	* Setting the isolation level:
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	*
	* await db
	*   .transaction()
	*   .setIsolationLevel('serializable')
	*   .execute(async (trx) => {
	*     await doStuff(trx)
	*   })
	*
	* async function doStuff(kysely: typeof db) {
	*   // ...
	* }
	* ```
	*/
	transaction() {
		return new TransactionBuilder({ ...this.#props });
	}
	/**
	* Creates a {@link ControlledTransactionBuilder} that can be used to run queries inside a controlled transaction.
	*
	* The returned {@link ControlledTransactionBuilder} can be used to configure the transaction.
	* The {@link ControlledTransactionBuilder.execute} method can then be called
	* to start the transaction and return a {@link ControlledTransaction}.
	*
	* A {@link ControlledTransaction} allows you to commit and rollback manually,
	* execute savepoint commands. It extends {@link Transaction} which extends {@link Kysely},
	* so you can run queries inside the transaction. Once the transaction is committed,
	* or rolled back, it can't be used anymore - all queries will throw an error.
	* This is to prevent accidentally running queries outside the transaction - where
	* atomicity is not guaranteed anymore.
	*
	* ### Examples
	*
	* <!-- siteExample("transactions", "Controlled transaction", 11) -->
	*
	* A controlled transaction allows you to commit and rollback manually, execute
	* savepoint commands, and queries in general.
	*
	* In this example we start a transaction, use it to insert two rows and then commit
	* the transaction. If an error is thrown, we catch it and rollback the transaction.
	*
	* ```ts
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   const jennifer = await trx.insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   const catto = await trx.insertInto('pet')
	*     .values({
	*       owner_id: jennifer.id,
	*       name: 'Catto',
	*       species: 'cat',
	*       is_favorite: false,
	*     })
	*     .returningAll()
	*     .executeTakeFirstOrThrow()
	*
	*   await trx.commit().execute()
	*
	*   // ...
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	* ```
	*
	* <!-- siteExample("transactions", "Controlled transaction /w savepoints", 12) -->
	*
	* A controlled transaction allows you to commit and rollback manually, execute
	* savepoint commands, and queries in general.
	*
	* In this example we start a transaction, insert a person, create a savepoint,
	* try inserting a toy and a pet, and if an error is thrown, we rollback to the
	* savepoint. Eventually we release the savepoint, insert an audit record and
	* commit the transaction. If an error is thrown, we catch it and rollback the
	* transaction.
	*
	* ```ts
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   const jennifer = await trx
	*     .insertInto('person')
	*     .values({
	*       first_name: 'Jennifer',
	*       last_name: 'Aniston',
	*       age: 40,
	*     })
	*     .returning('id')
	*     .executeTakeFirstOrThrow()
	*
	*   const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	*   try {
	*     const catto = await trxAfterJennifer
	*       .insertInto('pet')
	*       .values({
	*         owner_id: jennifer.id,
	*         name: 'Catto',
	*         species: 'cat',
	*       })
	*       .returning('id')
	*       .executeTakeFirstOrThrow()
	*
	*     await trxAfterJennifer
	*       .insertInto('toy')
	*       .values({ name: 'Bone', price: 1.99, pet_id: catto.id })
	*       .execute()
	*   } catch (error) {
	*     await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	*   }
	*
	*   await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
	*
	*   await trx.insertInto('audit').values({ action: 'added Jennifer' }).execute()
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	* ```
	*/
	startTransaction() {
		return new ControlledTransactionBuilder({ ...this.#props });
	}
	/**
	* Provides a kysely instance bound to a single database connection.
	*
	* ### Examples
	*
	* ```ts
	* await db
	*   .connection()
	*   .execute(async (db) => {
	*     // `db` is an instance of `Kysely` that's bound to a single
	*     // database connection. All queries executed through `db` use
	*     // the same connection.
	*     await doStuff(db)
	*   })
	*
	* async function doStuff(kysely: typeof db) {
	*   // ...
	* }
	* ```
	*/
	connection() {
		return new ConnectionBuilder({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance with the given plugin installed.
	*/
	withPlugin(plugin) {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	/**
	* Returns a copy of this Kysely instance without any plugins.
	*/
	withoutPlugins() {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	/**
	* @override
	*/
	withSchema(schema) {
		return new Kysely({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	/**
	* Returns a copy of this Kysely instance with tables added to its
	* database type.
	*
	* This method only modifies the types and doesn't affect any of the
	* executed queries in any way.
	*
	* ### Examples
	*
	* The following example adds and uses a temporary table:
	*
	* ```ts
	* await db.schema
	*   .createTable('temp_table')
	*   .temporary()
	*   .addColumn('some_column', 'integer')
	*   .execute()
	*
	* const tempDb = db.$extendTables<{
	*   temp_table: {
	*     some_column: number
	*   }
	* }>()
	*
	* await tempDb
	*   .insertInto('temp_table')
	*   .values({ some_column: 100 })
	*   .execute()
	* ```
	*/
	$extendTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance without the given tables (provided as
	* a union type of table names).
	*
	* This method only modifies the types and doesn't affect any of the executed
	* queries in any way.
	*
	* See also {@link $pickTables} and {@link $extendTables}.
	*
	* ### Examples
	*
	* The following example omits tables not used in the downstream query. This
	* can help with compile-time performance as downstream checks and calculations
	* work against a smaller scope of the database - less tables and columns.
	*
	* Don't optimize prematurely! Build your queries first, measure later. If you
	* realize the query has a noticeable impact on compilation - try the helper.
	*
	* ```ts
	* const results = await db
	*   .$omitTables<'toy'>()
	*   .selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .selectAll()
	*   .execute()
	* ```
	*
	* The query is arguably less readable now, and changing it is less obvious -
	* e.g. adding another table.
	*/
	$omitTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* Returns a copy of this Kysely instance with just the given tables (provided as
	* a union type of table names).
	*
	* This method only modifies the types and doesn't affect any of the executed
	* queries in any way.
	*
	* See also {@link $omitTables} and {@link $extendTables}.
	*
	* ### Examples
	*
	* The following example picks the tables used in the downstream query. This
	* can help with compile-time performance as downstream checks and calculations
	* work against a smaller scope of the database - less tables and columns.
	*
	* Don't optimize prematurely! Build your queries first, measure later. If you
	* realize the query has a noticeable impact on compilation - try the helper.
	*
	* ```ts
	* const results = await db
	*   .$pickTables<'person' | 'pet'>()
	*   .selectFrom('person')
	*   .innerJoin('pet', 'pet.owner_id', 'person.id')
	*   .selectAll()
	*   .execute()
	* ```
	*
	* The query is arguably less readable now, and changing it is less obvious -
	* e.g. adding another table.
	*/
	$pickTables() {
		return new Kysely({ ...this.#props });
	}
	/**
	* @deprecated use {@link $extendTables} instead.
	*/
	withTables() {
		return this.$extendTables();
	}
	/**
	* Releases all resources and disconnects from the database.
	*
	* You need to call this when you are done using the `Kysely` instance.
	*/
	async destroy() {
		await this.#props.driver.destroy();
	}
	/**
	* Returns true if this `Kysely` instance is a transaction.
	*
	* You can also use `db instanceof Transaction`.
	*/
	get isTransaction() {
		return false;
	}
	/**
	* @internal
	* @private
	*/
	getExecutor() {
		return this.#props.executor;
	}
	/**
	* Executes a given compiled query or query builder.
	*
	* See {@link https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0004-splitting-query-building-and-execution.md#execute-compiled-queries splitting build, compile and execute code recipe} for more information.
	*/
	async executeQuery(query, options) {
		const compiledQuery = isCompilable(query) ? query.compile() : query;
		return await this.#props.executor.executeQuery(compiledQuery, options);
	}
	async [Symbol.asyncDispose]() {
		await this.destroy();
	}
};
var Transaction = class Transaction extends Kysely {
	#props;
	constructor(props) {
		super(props);
		this.#props = props;
	}
	get isTransaction() {
		return true;
	}
	/**
	* @deprecated calling the transaction method for a Transaction is not supported
	*/
	transaction() {
		throw new Error("calling the transaction method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the controlled transaction method for a Transaction is not supported
	*/
	startTransaction() {
		throw new Error("calling the controlled transaction method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the connection method for a Transaction is not supported
	*/
	connection() {
		throw new Error("calling the connection method for a Transaction is not supported");
	}
	/**
	* @deprecated calling the destroy method for a Transaction is not supported
	*/
	destroy() {
		throw new Error("calling the destroy method for a Transaction is not supported");
	}
	/**
	* Similar to {@link Kysely.withPlugin} but returns the transaction.
	*/
	withPlugin(plugin) {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	/**
	* Similar to {@link Kysely.withoutPlugins} but returns the transaction.
	*/
	withoutPlugins() {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	/**
	* Similar to {@link Kysely.withSchema} but returns the transaction.
	*/
	withSchema(schema) {
		return new Transaction({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	/**
	* Similar to {@link Kysely.withTables} but returns the transaction.
	*
	* @deprecated use {@link $extendTables} instead.
	*/
	withTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$extendTables} but returns the transaction.
	*/
	$extendTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$omitTables} but returns the transaction.
	*/
	$omitTables() {
		return new Transaction({ ...this.#props });
	}
	/**
	* Similar to {@link Kysely.$pickTables} but returns the transaction.
	*/
	$pickTables() {
		return new Transaction({ ...this.#props });
	}
};
function isKyselyProps(obj) {
	return isObject(obj) && isObject(obj.config) && isObject(obj.driver) && isObject(obj.executor) && isObject(obj.dialect);
}
var ConnectionBuilder = class {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	async execute(callback, options) {
		return this.#props.executor.provideConnection(async (connection) => {
			const executor = this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection));
			return await callback(new Kysely({
				...this.#props,
				executor
			}));
		}, freeze({ signal: options?.signal }));
	}
};
var TransactionBuilder = class TransactionBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	setAccessMode(accessMode) {
		return new TransactionBuilder({
			...this.#props,
			accessMode
		});
	}
	setIsolationLevel(isolationLevel) {
		return new TransactionBuilder({
			...this.#props,
			isolationLevel
		});
	}
	async execute(callback) {
		const { isolationLevel, accessMode, ...kyselyProps } = this.#props;
		const settings = {
			isolationLevel,
			accessMode
		};
		validateTransactionSettings(settings);
		return this.#props.executor.provideConnection(async (connection) => {
			const state = {
				isCommitted: false,
				isRolledBack: false
			};
			const executor = new NotCommittedOrRolledBackAssertingExecutor(this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection)), state);
			const transaction = new Transaction({
				...kyselyProps,
				executor
			});
			let transactionBegun = false;
			try {
				await this.#props.driver.beginTransaction(connection, settings);
				transactionBegun = true;
				const result = await callback(transaction);
				await this.#props.driver.commitTransaction(connection);
				state.isCommitted = true;
				return result;
			} catch (error) {
				if (transactionBegun) {
					await this.#props.driver.rollbackTransaction(connection);
					state.isRolledBack = true;
				}
				throw error;
			}
		});
	}
};
var ControlledTransactionBuilder = class ControlledTransactionBuilder {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	setAccessMode(accessMode) {
		return new ControlledTransactionBuilder({
			...this.#props,
			accessMode
		});
	}
	setIsolationLevel(isolationLevel) {
		return new ControlledTransactionBuilder({
			...this.#props,
			isolationLevel
		});
	}
	async execute() {
		const { isolationLevel, accessMode, ...props } = this.#props;
		const settings = {
			isolationLevel,
			accessMode
		};
		validateTransactionSettings(settings);
		const connection = await provideControlledConnection(this.#props.executor);
		await this.#props.driver.beginTransaction(connection.connection, settings);
		return new ControlledTransaction({
			...props,
			connection,
			executor: this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection.connection))
		});
	}
};
var ControlledTransaction = class ControlledTransaction extends Transaction {
	#props;
	#compileQuery;
	#state;
	constructor(props) {
		const state = {
			isCommitted: false,
			isRolledBack: false
		};
		props = {
			...props,
			executor: new NotCommittedOrRolledBackAssertingExecutor(props.executor, state)
		};
		const { connection, ...transactionProps } = props;
		super(transactionProps);
		this.#props = freeze(props);
		this.#state = state;
		const queryId = createQueryId();
		this.#compileQuery = (node) => props.executor.compileQuery(node, queryId);
	}
	get isCommitted() {
		return this.#state.isCommitted;
	}
	get isRolledBack() {
		return this.#state.isRolledBack;
	}
	/**
	* Commits the transaction.
	*
	* See {@link rollback}.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   await doSomething(trx)
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	*
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	commit() {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.commitTransaction(this.#props.connection.connection);
			this.#state.isCommitted = true;
			this.#props.connection.release();
		});
	}
	/**
	* Rolls back the transaction.
	*
	* See {@link commit} and {@link rollbackToSavepoint}.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* try {
	*   await doSomething(trx)
	*
	*   await trx.commit().execute()
	* } catch (error) {
	*   await trx.rollback().execute()
	* }
	*
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	rollback() {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.rollbackTransaction(this.#props.connection.connection);
			this.#state.isRolledBack = true;
			this.#props.connection.release();
		});
	}
	/**
	* Creates a savepoint with a given name.
	*
	* See {@link rollbackToSavepoint} and {@link releaseSavepoint}.
	*
	* For a type-safe experience, you should use the returned instance from now on.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	savepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.savepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	/**
	* Rolls back to a savepoint with a given name.
	*
	* See {@link savepoint} and {@link releaseSavepoint}.
	*
	* You must use the same instance returned by {@link savepoint}, or
	* escape the type-check by using `as any`.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* ```
	*/
	rollbackToSavepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.rollbackToSavepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	/**
	* Releases a savepoint with a given name.
	*
	* See {@link savepoint} and {@link rollbackToSavepoint}.
	*
	* You must use the same instance returned by {@link savepoint}, or
	* escape the type-check by using `as any`.
	*
	* ### Examples
	*
	* ```ts
	* import type { Kysely } from 'kysely'
	* import type { Database } from 'type-editor' // imaginary module
	*
	* const trx = await db.startTransaction().execute()
	*
	* await insertJennifer(trx)
	*
	* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
	*
	* try {
	*   await doSomething(trxAfterJennifer)
	* } catch (error) {
	*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
	* }
	*
	* await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
	*
	* await doSomethingElse(trx)
	*
	* async function insertJennifer(kysely: Kysely<Database>) {}
	* async function doSomething(kysely: Kysely<Database>) {}
	* async function doSomethingElse(kysely: Kysely<Database>) {}
	* ```
	*/
	releaseSavepoint(savepointName) {
		assertNotCommittedOrRolledBack(this.#state);
		return new Command(async () => {
			await this.#props.driver.releaseSavepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
			return new ControlledTransaction({ ...this.#props });
		});
	}
	withPlugin(plugin) {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withPlugin(plugin)
		});
	}
	withoutPlugins() {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withoutPlugins()
		});
	}
	withSchema(schema) {
		return new ControlledTransaction({
			...this.#props,
			executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
		});
	}
	withTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$extendTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$omitTables() {
		return new ControlledTransaction({ ...this.#props });
	}
	$pickTables() {
		return new ControlledTransaction({ ...this.#props });
	}
};
var Command = class {
	#cb;
	constructor(cb) {
		this.#cb = cb;
	}
	/**
	* Executes the command.
	*/
	async execute() {
		return await this.#cb();
	}
};
function assertNotCommittedOrRolledBack(state) {
	if (state.isCommitted) throw new Error("Transaction is already committed");
	if (state.isRolledBack) throw new Error("Transaction is already rolled back");
}
/**
* An executor wrapper that asserts that the transaction state is not committed
* or rolled back when a query is executed.
*
* @internal
*/
var NotCommittedOrRolledBackAssertingExecutor = class NotCommittedOrRolledBackAssertingExecutor {
	#executor;
	#state;
	constructor(executor, state) {
		this.#executor = executor instanceof NotCommittedOrRolledBackAssertingExecutor ? executor.#executor : executor;
		this.#state = state;
	}
	get adapter() {
		return this.#executor.adapter;
	}
	get plugins() {
		return this.#executor.plugins;
	}
	transformQuery(node, queryId) {
		return this.#executor.transformQuery(node, queryId);
	}
	compileQuery(node, queryId) {
		return this.#executor.compileQuery(node, queryId);
	}
	provideConnection(consumer, options) {
		return this.#executor.provideConnection(consumer, options);
	}
	executeQuery(compiledQuery, options) {
		assertNotCommittedOrRolledBack(this.#state);
		return this.#executor.executeQuery(compiledQuery, options);
	}
	stream(compiledQuery, chunkSize, options) {
		assertNotCommittedOrRolledBack(this.#state);
		return this.#executor.stream(compiledQuery, chunkSize, options);
	}
	withConnectionProvider(connectionProvider) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withConnectionProvider(connectionProvider), this.#state);
	}
	withPlugin(plugin) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPlugin(plugin), this.#state);
	}
	withPlugins(plugins) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPlugins(plugins), this.#state);
	}
	withPluginAtFront(plugin) {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPluginAtFront(plugin), this.#state);
	}
	withoutPlugins() {
		return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withoutPlugins(), this.#state);
	}
};
//#endregion
//#region node_modules/kysely/dist/raw-builder/raw-builder.js
var RawBuilderImpl = class RawBuilderImpl {
	#props;
	constructor(props) {
		this.#props = freeze(props);
	}
	get expressionType() {}
	get isRawBuilder() {
		return true;
	}
	as(alias) {
		return new AliasedRawBuilderImpl(this, alias);
	}
	$castTo() {
		return new RawBuilderImpl({ ...this.#props });
	}
	$notNull() {
		return new RawBuilderImpl(this.#props);
	}
	withPlugin(plugin) {
		return new RawBuilderImpl({
			...this.#props,
			plugins: this.#props.plugins !== void 0 ? freeze([...this.#props.plugins, plugin]) : freeze([plugin])
		});
	}
	toOperationNode() {
		return this.#toOperationNode(this.#getExecutor());
	}
	compile(executorProvider) {
		return this.#compile(this.#getExecutor(executorProvider));
	}
	async execute(executorProvider, options) {
		const executor = this.#getExecutor(executorProvider);
		return executor.executeQuery(this.#compile(executor), options);
	}
	#getExecutor(executorProvider) {
		const executor = executorProvider !== void 0 ? executorProvider.getExecutor() : NOOP_QUERY_EXECUTOR;
		return this.#props.plugins !== void 0 ? executor.withPlugins(this.#props.plugins) : executor;
	}
	#toOperationNode(executor) {
		return executor.transformQuery(this.#props.rawNode, this.#props.queryId);
	}
	#compile(executor) {
		return executor.compileQuery(this.#toOperationNode(executor), this.#props.queryId);
	}
};
function createRawBuilder(props) {
	return new RawBuilderImpl(props);
}
var AliasedRawBuilderImpl = class {
	#rawBuilder;
	#alias;
	constructor(rawBuilder, alias) {
		this.#rawBuilder = rawBuilder;
		this.#alias = alias;
	}
	get expression() {
		return this.#rawBuilder;
	}
	get alias() {
		return this.#alias;
	}
	get rawBuilder() {
		return this.#rawBuilder;
	}
	toOperationNode() {
		return AliasNode.create(this.#rawBuilder.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
	}
};
//#endregion
//#region node_modules/kysely/dist/raw-builder/sql.js
var sql = Object.assign((sqlFragments, ...parameters) => {
	return createRawBuilder({
		queryId: createQueryId(),
		rawNode: RawNode.create(sqlFragments, parameters?.map(parseParameter) ?? [])
	});
}, {
	ref(columnReference) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChild(parseStringReference(columnReference))
		});
	},
	val(value) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChild(parseValueExpression(value))
		});
	},
	table(tableReference) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChild(parseTable(tableReference))
		});
	},
	id(...ids) {
		const fragments = new Array(ids.length + 1).fill(".");
		fragments[0] = "";
		fragments[fragments.length - 1] = "";
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.create(fragments, ids.map(IdentifierNode.create))
		});
	},
	lit(value) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChild(ValueNode.createImmediate(value))
		});
	},
	raw(sql) {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithSql(sql)
		});
	},
	join(array, separator = sql`, `) {
		const nodes = new Array(Math.max(2 * array.length - 1, 0));
		const sep = separator.toOperationNode();
		for (let i = 0; i < array.length; ++i) {
			nodes[2 * i] = parseParameter(array[i]);
			if (i !== array.length - 1) nodes[2 * i + 1] = sep;
		}
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.createWithChildren(nodes)
		});
	}
});
function parseParameter(param) {
	if (isOperationNodeSource(param)) return param.toOperationNode();
	return parseValueExpression(param);
}
//#endregion
//#region node_modules/kysely/dist/operation-node/operation-node-visitor.js
var OperationNodeVisitor = class {
	nodeStack = [];
	get parentNode() {
		return this.nodeStack[this.nodeStack.length - 2];
	}
	#visitors = freeze({
		AliasNode: this.visitAlias.bind(this),
		ColumnNode: this.visitColumn.bind(this),
		IdentifierNode: this.visitIdentifier.bind(this),
		SchemableIdentifierNode: this.visitSchemableIdentifier.bind(this),
		RawNode: this.visitRaw.bind(this),
		ReferenceNode: this.visitReference.bind(this),
		SelectQueryNode: this.visitSelectQuery.bind(this),
		SelectionNode: this.visitSelection.bind(this),
		TableNode: this.visitTable.bind(this),
		FromNode: this.visitFrom.bind(this),
		SelectAllNode: this.visitSelectAll.bind(this),
		AndNode: this.visitAnd.bind(this),
		OrNode: this.visitOr.bind(this),
		ValueNode: this.visitValue.bind(this),
		ValueListNode: this.visitValueList.bind(this),
		PrimitiveValueListNode: this.visitPrimitiveValueList.bind(this),
		ParensNode: this.visitParens.bind(this),
		JoinNode: this.visitJoin.bind(this),
		OperatorNode: this.visitOperator.bind(this),
		WhereNode: this.visitWhere.bind(this),
		InsertQueryNode: this.visitInsertQuery.bind(this),
		DeleteQueryNode: this.visitDeleteQuery.bind(this),
		ReturningNode: this.visitReturning.bind(this),
		CreateTableNode: this.visitCreateTable.bind(this),
		AddColumnNode: this.visitAddColumn.bind(this),
		ColumnDefinitionNode: this.visitColumnDefinition.bind(this),
		DropTableNode: this.visitDropTable.bind(this),
		DataTypeNode: this.visitDataType.bind(this),
		OrderByNode: this.visitOrderBy.bind(this),
		OrderByItemNode: this.visitOrderByItem.bind(this),
		GroupByNode: this.visitGroupBy.bind(this),
		GroupByItemNode: this.visitGroupByItem.bind(this),
		UpdateQueryNode: this.visitUpdateQuery.bind(this),
		ColumnUpdateNode: this.visitColumnUpdate.bind(this),
		LimitNode: this.visitLimit.bind(this),
		OffsetNode: this.visitOffset.bind(this),
		OnConflictNode: this.visitOnConflict.bind(this),
		OnDuplicateKeyNode: this.visitOnDuplicateKey.bind(this),
		CreateIndexNode: this.visitCreateIndex.bind(this),
		DropIndexNode: this.visitDropIndex.bind(this),
		ListNode: this.visitList.bind(this),
		PrimaryKeyConstraintNode: this.visitPrimaryKeyConstraint.bind(this),
		UniqueConstraintNode: this.visitUniqueConstraint.bind(this),
		ReferencesNode: this.visitReferences.bind(this),
		CheckConstraintNode: this.visitCheckConstraint.bind(this),
		WithNode: this.visitWith.bind(this),
		CommonTableExpressionNode: this.visitCommonTableExpression.bind(this),
		CommonTableExpressionNameNode: this.visitCommonTableExpressionName.bind(this),
		HavingNode: this.visitHaving.bind(this),
		CreateSchemaNode: this.visitCreateSchema.bind(this),
		DropSchemaNode: this.visitDropSchema.bind(this),
		AlterTableNode: this.visitAlterTable.bind(this),
		DropColumnNode: this.visitDropColumn.bind(this),
		RenameColumnNode: this.visitRenameColumn.bind(this),
		AlterColumnNode: this.visitAlterColumn.bind(this),
		ModifyColumnNode: this.visitModifyColumn.bind(this),
		AddConstraintNode: this.visitAddConstraint.bind(this),
		DropConstraintNode: this.visitDropConstraint.bind(this),
		RenameConstraintNode: this.visitRenameConstraint.bind(this),
		ForeignKeyConstraintNode: this.visitForeignKeyConstraint.bind(this),
		CreateViewNode: this.visitCreateView.bind(this),
		RefreshMaterializedViewNode: this.visitRefreshMaterializedView.bind(this),
		DropViewNode: this.visitDropView.bind(this),
		GeneratedNode: this.visitGenerated.bind(this),
		DefaultValueNode: this.visitDefaultValue.bind(this),
		OnNode: this.visitOn.bind(this),
		ValuesNode: this.visitValues.bind(this),
		SelectModifierNode: this.visitSelectModifier.bind(this),
		CreateTypeNode: this.visitCreateType.bind(this),
		DropTypeNode: this.visitDropType.bind(this),
		ExplainNode: this.visitExplain.bind(this),
		DefaultInsertValueNode: this.visitDefaultInsertValue.bind(this),
		AggregateFunctionNode: this.visitAggregateFunction.bind(this),
		OverNode: this.visitOver.bind(this),
		PartitionByNode: this.visitPartitionBy.bind(this),
		PartitionByItemNode: this.visitPartitionByItem.bind(this),
		SetOperationNode: this.visitSetOperation.bind(this),
		BinaryOperationNode: this.visitBinaryOperation.bind(this),
		UnaryOperationNode: this.visitUnaryOperation.bind(this),
		UsingNode: this.visitUsing.bind(this),
		FunctionNode: this.visitFunction.bind(this),
		CaseNode: this.visitCase.bind(this),
		WhenNode: this.visitWhen.bind(this),
		JSONReferenceNode: this.visitJSONReference.bind(this),
		JSONPathNode: this.visitJSONPath.bind(this),
		JSONPathLegNode: this.visitJSONPathLeg.bind(this),
		JSONOperatorChainNode: this.visitJSONOperatorChain.bind(this),
		TupleNode: this.visitTuple.bind(this),
		MergeQueryNode: this.visitMergeQuery.bind(this),
		MatchedNode: this.visitMatched.bind(this),
		AddIndexNode: this.visitAddIndex.bind(this),
		CastNode: this.visitCast.bind(this),
		FetchNode: this.visitFetch.bind(this),
		TopNode: this.visitTop.bind(this),
		OutputNode: this.visitOutput.bind(this),
		OrActionNode: this.visitOrAction.bind(this),
		CollateNode: this.visitCollate.bind(this),
		AlterTypeNode: this.visitAlterType.bind(this),
		AddValueNode: this.visitAddValue.bind(this),
		RenameValueNode: this.visitRenameValue.bind(this)
	});
	visitNode = (node) => {
		this.nodeStack.push(node);
		this.#visitors[node.kind](node);
		this.nodeStack.pop();
	};
};
//#endregion
//#region node_modules/kysely/dist/query-compiler/default-query-compiler.js
var LIT_WRAP_REGEX = /'/g;
var JSON_PATH_MEMBER_WRAP_REGEX = /['"]/g;
var DefaultQueryCompiler = class extends OperationNodeVisitor {
	#sql = "";
	#parameters = [];
	get numParameters() {
		return this.#parameters.length;
	}
	compileQuery(node, queryId) {
		this.#sql = "";
		this.#parameters = [];
		this.nodeStack.splice(0, this.nodeStack.length);
		this.visitNode(node);
		return freeze({
			query: node,
			queryId,
			sql: this.getSql(),
			parameters: [...this.#parameters]
		});
	}
	getSql() {
		return this.#sql;
	}
	visitSelectQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !InsertQueryNode.is(this.parentNode) && !CreateTableNode.is(this.parentNode) && !CreateViewNode.is(this.parentNode) && !SetOperationNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("select");
		if (node.distinctOn) {
			this.append(" ");
			this.compileDistinctOn(node.distinctOn);
		}
		if (node.frontModifiers?.length) {
			this.append(" ");
			this.compileList(node.frontModifiers, " ");
		}
		if (node.top) {
			this.append(" ");
			this.visitNode(node.top);
		}
		if (node.selections) {
			this.append(" ");
			this.compileList(node.selections);
		}
		if (node.from) {
			this.append(" ");
			this.visitNode(node.from);
		}
		if (node.joins) {
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.groupBy) {
			this.append(" ");
			this.visitNode(node.groupBy);
		}
		if (node.having) {
			this.append(" ");
			this.visitNode(node.having);
		}
		if (node.setOperations) {
			this.append(" ");
			this.compileList(node.setOperations, " ");
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (node.offset) {
			this.append(" ");
			this.visitNode(node.offset);
		}
		if (node.fetch) {
			this.append(" ");
			this.visitNode(node.fetch);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(this.sortSelectModifiers(node.endModifiers), " ");
		}
		if (wrapInParens) this.append(")");
	}
	visitFrom(node) {
		this.append("from ");
		this.compileList(node.froms);
	}
	visitSelection(node) {
		this.visitNode(node.selection);
	}
	visitColumn(node) {
		this.visitNode(node.column);
	}
	compileDistinctOn(expressions) {
		this.append("distinct on (");
		this.compileList(expressions);
		this.append(")");
	}
	compileList(nodes, separator = ", ") {
		const lastIndex = nodes.length - 1;
		for (let i = 0; i <= lastIndex; i++) {
			this.visitNode(nodes[i]);
			if (i < lastIndex) this.append(separator);
		}
	}
	visitWhere(node) {
		this.append("where ");
		this.visitNode(node.where);
	}
	visitHaving(node) {
		this.append("having ");
		this.visitNode(node.having);
	}
	visitInsertQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode) && !WhenNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append(node.replace ? "replace" : "insert");
		if (node.orAction) {
			this.append(" ");
			this.visitNode(node.orAction);
		}
		if (node.top) {
			this.append(" ");
			this.visitNode(node.top);
		}
		if (node.into) {
			this.append(" into ");
			this.visitNode(node.into);
		}
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.values) {
			this.append(" ");
			this.visitNode(node.values);
		}
		if (node.defaultValues) {
			this.append(" ");
			this.append("default values");
		}
		if (node.onConflict) {
			this.append(" ");
			this.visitNode(node.onConflict);
		}
		if (node.onDuplicateKey) {
			this.append(" ");
			this.visitNode(node.onDuplicateKey);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitValues(node) {
		this.append("values ");
		this.compileList(node.values);
	}
	visitDeleteQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("delete ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		this.visitNode(node.from);
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.using) {
			this.append(" ");
			this.visitNode(node.using);
		}
		if (node.joins) {
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitReturning(node) {
		this.append("returning ");
		this.compileList(node.selections);
	}
	visitAlias(node) {
		this.visitNode(node.node);
		this.append(" as ");
		this.visitNode(node.alias);
	}
	visitReference(node) {
		if (node.table) {
			this.visitNode(node.table);
			this.append(".");
		}
		this.visitNode(node.column);
	}
	visitSelectAll(_) {
		this.append("*");
	}
	visitIdentifier(node) {
		this.append(this.getLeftIdentifierWrapper());
		this.compileUnwrappedIdentifier(node);
		this.append(this.getRightIdentifierWrapper());
	}
	compileUnwrappedIdentifier(node) {
		if (!isString(node.name)) throw new Error("a non-string identifier was passed to compileUnwrappedIdentifier.");
		this.append(this.sanitizeIdentifier(node.name));
	}
	visitAnd(node) {
		this.visitNode(node.left);
		this.append(" and ");
		this.visitNode(node.right);
	}
	visitOr(node) {
		this.visitNode(node.left);
		this.append(" or ");
		this.visitNode(node.right);
	}
	visitValue(node) {
		if (node.immediate) this.appendImmediateValue(node.value);
		else this.appendValue(node.value);
	}
	visitValueList(node) {
		this.append("(");
		this.compileList(node.values);
		this.append(")");
	}
	visitTuple(node) {
		this.append("(");
		this.compileList(node.values);
		this.append(")");
	}
	visitPrimitiveValueList(node) {
		this.append("(");
		const { values } = node;
		for (let i = 0; i < values.length; ++i) {
			this.appendValue(values[i]);
			if (i !== values.length - 1) this.append(", ");
		}
		this.append(")");
	}
	visitParens(node) {
		this.append("(");
		this.visitNode(node.node);
		this.append(")");
	}
	visitJoin(node) {
		this.append(JOIN_TYPE_SQL[node.joinType]);
		this.append(" ");
		this.visitNode(node.table);
		if (node.on) {
			this.append(" ");
			this.visitNode(node.on);
		}
	}
	visitOn(node) {
		this.append("on ");
		this.visitNode(node.on);
	}
	visitRaw(node) {
		const { sqlFragments, parameters: params } = node;
		for (let i = 0; i < sqlFragments.length; ++i) {
			this.append(sqlFragments[i]);
			if (params.length > i) this.visitNode(params[i]);
		}
	}
	visitOperator(node) {
		this.append(node.operator);
	}
	visitTable(node) {
		this.visitNode(node.table);
	}
	visitSchemableIdentifier(node) {
		if (node.schema) {
			this.visitNode(node.schema);
			this.append(".");
		}
		this.visitNode(node.identifier);
	}
	visitCreateTable(node) {
		this.append("create ");
		if (node.frontModifiers?.length) {
			this.compileList(node.frontModifiers, " ");
			this.append(" ");
		}
		if (node.temporary) this.append("temporary ");
		this.append("table ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.table);
		if (!node.selectQuery) {
			this.append(" (");
			this.compileList([
				...node.columns,
				...node.constraints ?? [],
				...node.indexes ?? []
			]);
			this.append(")");
		}
		if (node.onCommit) {
			this.append(" on commit ");
			this.append(node.onCommit);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
		if (node.selectQuery) {
			this.append(" as ");
			this.visitNode(node.selectQuery);
		}
	}
	visitColumnDefinition(node) {
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.column);
		this.append(" ");
		this.visitNode(node.dataType);
		if (node.unsigned) this.append(" unsigned");
		if (node.frontModifiers && node.frontModifiers.length > 0) {
			this.append(" ");
			this.compileList(node.frontModifiers, " ");
		}
		if (node.generated) {
			this.append(" ");
			this.visitNode(node.generated);
		}
		if (node.identity) this.append(" identity");
		if (node.defaultTo) {
			this.append(" ");
			this.visitNode(node.defaultTo);
		}
		if (node.notNull) this.append(" not null");
		if (node.unique) this.append(" unique");
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		if (node.primaryKey) this.append(" primary key");
		if (node.autoIncrement) {
			this.append(" ");
			this.append(this.getAutoIncrement());
		}
		if (node.references) {
			this.append(" ");
			this.visitNode(node.references);
		}
		if (node.check) {
			this.append(" ");
			this.visitNode(node.check);
		}
		if (node.endModifiers && node.endModifiers.length > 0) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	getAutoIncrement() {
		return "auto_increment";
	}
	visitReferences(node) {
		this.append("references ");
		this.visitNode(node.table);
		this.append(" (");
		this.compileList(node.columns);
		this.append(")");
		if (node.onDelete) {
			this.append(" on delete ");
			this.append(node.onDelete);
		}
		if (node.onUpdate) {
			this.append(" on update ");
			this.append(node.onUpdate);
		}
	}
	visitDropTable(node) {
		this.append("drop ");
		if (node.temporary) this.append("temporary ");
		this.append("table ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.table);
		if (node.cascade) this.append(" cascade");
	}
	visitDataType(node) {
		this.append(node.dataType);
	}
	visitOrderBy(node) {
		this.append("order by ");
		this.compileList(node.items);
	}
	visitOrderByItem(node) {
		this.visitNode(node.orderBy);
		if (node.collation) {
			this.append(" ");
			this.visitNode(node.collation);
		}
		if (node.direction) {
			this.append(" ");
			this.visitNode(node.direction);
		}
		if (node.nulls) {
			this.append(" nulls ");
			this.append(node.nulls);
		}
	}
	visitGroupBy(node) {
		this.append("group by ");
		this.compileList(node.items);
	}
	visitGroupByItem(node) {
		this.visitNode(node.groupBy);
	}
	visitUpdateQuery(node) {
		const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode) && !WhenNode.is(this.parentNode);
		if (this.parentNode === void 0 && node.explain) {
			this.visitNode(node.explain);
			this.append(" ");
		}
		if (wrapInParens) this.append("(");
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("update ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		if (node.table) {
			this.visitNode(node.table);
			this.append(" ");
		}
		this.append("set ");
		if (node.updates) this.compileList(node.updates);
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.from) {
			this.append(" ");
			this.visitNode(node.from);
		}
		if (node.joins) {
			if (!node.from) throw new Error("Joins in an update query are only supported as a part of a PostgreSQL 'update set from join' query. If you want to create a MySQL 'update join set' query, see https://kysely.dev/docs/examples/update/my-sql-joins");
			this.append(" ");
			this.compileList(node.joins, " ");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		if (node.limit) {
			this.append(" ");
			this.visitNode(node.limit);
		}
		if (wrapInParens) this.append(")");
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitColumnUpdate(node) {
		this.visitNode(node.column);
		this.append(" = ");
		this.visitNode(node.value);
	}
	visitLimit(node) {
		this.append("limit ");
		this.visitNode(node.limit);
	}
	visitOffset(node) {
		this.append("offset ");
		this.visitNode(node.offset);
	}
	visitOnConflict(node) {
		this.append("on conflict");
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		} else if (node.constraint) {
			this.append(" on constraint ");
			this.visitNode(node.constraint);
		} else if (node.indexExpression) {
			this.append(" (");
			this.visitNode(node.indexExpression);
			this.append(")");
		}
		if (node.indexWhere) {
			this.append(" ");
			this.visitNode(node.indexWhere);
		}
		if (node.doNothing === true) this.append(" do nothing");
		else if (node.updates) {
			this.append(" do update set ");
			this.compileList(node.updates);
			if (node.updateWhere) {
				this.append(" ");
				this.visitNode(node.updateWhere);
			}
		}
	}
	visitOnDuplicateKey(node) {
		this.append("on duplicate key update ");
		this.compileList(node.updates);
	}
	visitCreateIndex(node) {
		this.append("create ");
		if (node.unique) this.append("unique ");
		this.append("index ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.name);
		if (node.table) {
			this.append(" on ");
			this.visitNode(node.table);
		}
		if (node.using) {
			this.append(" using ");
			this.visitNode(node.using);
		}
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
	}
	visitDropIndex(node) {
		this.append("drop index ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.table) {
			this.append(" on ");
			this.visitNode(node.table);
		}
		if (node.cascade) this.append(" cascade");
	}
	visitCreateSchema(node) {
		this.append("create schema ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.schema);
	}
	visitDropSchema(node) {
		this.append("drop schema ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.schema);
		if (node.cascade) this.append(" cascade");
	}
	visitPrimaryKeyConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("primary key (");
		this.compileList(node.columns);
		this.append(")");
		this.buildDeferrable(node);
	}
	buildDeferrable(node) {
		if (node.deferrable !== void 0) {
			if (node.deferrable) this.append(" deferrable");
			else this.append(" not deferrable");
		}
		if (node.initiallyDeferred !== void 0) {
			if (node.initiallyDeferred) this.append(" initially deferred");
			else this.append(" initially immediate");
		}
	}
	visitUniqueConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("unique");
		if (node.nullsNotDistinct) this.append(" nulls not distinct");
		this.append(" (");
		this.compileList(node.columns);
		this.append(")");
		this.buildDeferrable(node);
	}
	visitCheckConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("check (");
		this.visitNode(node.expression);
		this.append(")");
	}
	visitForeignKeyConstraint(node) {
		if (node.name) {
			this.append("constraint ");
			this.visitNode(node.name);
			this.append(" ");
		}
		this.append("foreign key (");
		this.compileList(node.columns);
		this.append(") ");
		this.visitNode(node.references);
		if (node.onDelete) {
			this.append(" on delete ");
			this.append(node.onDelete);
		}
		if (node.onUpdate) {
			this.append(" on update ");
			this.append(node.onUpdate);
		}
		this.buildDeferrable(node);
	}
	visitList(node) {
		this.compileList(node.items);
	}
	visitWith(node) {
		this.append("with ");
		if (node.recursive) this.append("recursive ");
		this.compileList(node.expressions);
	}
	visitCommonTableExpression(node) {
		this.visitNode(node.name);
		this.append(" as ");
		if (isBoolean(node.materialized)) {
			if (!node.materialized) this.append("not ");
			this.append("materialized ");
		}
		this.visitNode(node.expression);
	}
	visitCommonTableExpressionName(node) {
		this.visitNode(node.table);
		if (node.columns) {
			this.append("(");
			this.compileList(node.columns);
			this.append(")");
		}
	}
	visitAlterTable(node) {
		this.append("alter table ");
		this.visitNode(node.table);
		this.append(" ");
		if (node.renameTo) {
			this.append("rename to ");
			this.visitNode(node.renameTo);
		}
		if (node.setSchema) {
			this.append("set schema ");
			this.visitNode(node.setSchema);
		}
		if (node.addConstraint) this.visitNode(node.addConstraint);
		if (node.dropConstraint) this.visitNode(node.dropConstraint);
		if (node.renameConstraint) this.visitNode(node.renameConstraint);
		if (node.columnAlterations) this.compileColumnAlterations(node.columnAlterations);
		if (node.addIndex) this.visitNode(node.addIndex);
		if (node.dropIndex) this.visitNode(node.dropIndex);
	}
	visitAddColumn(node) {
		this.append("add column ");
		this.visitNode(node.column);
	}
	visitRenameColumn(node) {
		this.append("rename column ");
		this.visitNode(node.column);
		this.append(" to ");
		this.visitNode(node.renameTo);
	}
	visitDropColumn(node) {
		this.append("drop column ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.column);
	}
	visitAlterColumn(node) {
		this.append("alter column ");
		this.visitNode(node.column);
		this.append(" ");
		if (node.dataType) {
			if (this.announcesNewColumnDataType()) this.append("type ");
			this.visitNode(node.dataType);
			if (node.dataTypeExpression) {
				this.append("using ");
				this.visitNode(node.dataTypeExpression);
			}
		}
		if (node.setDefault) {
			this.append("set default ");
			this.visitNode(node.setDefault);
		}
		if (node.dropDefault) this.append("drop default");
		if (node.setNotNull) this.append("set not null");
		if (node.dropNotNull) this.append("drop not null");
	}
	visitModifyColumn(node) {
		this.append("modify column ");
		this.visitNode(node.column);
	}
	visitAddConstraint(node) {
		this.append("add ");
		this.visitNode(node.constraint);
	}
	visitDropConstraint(node) {
		this.append("drop constraint ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.constraintName);
		if (node.modifier === "cascade") this.append(" cascade");
		else if (node.modifier === "restrict") this.append(" restrict");
	}
	visitRenameConstraint(node) {
		this.append("rename constraint ");
		this.visitNode(node.oldName);
		this.append(" to ");
		this.visitNode(node.newName);
	}
	visitSetOperation(node) {
		this.append(node.operator);
		this.append(" ");
		if (node.all) this.append("all ");
		this.visitNode(node.expression);
	}
	visitCreateView(node) {
		this.append("create ");
		if (node.orReplace) this.append("or replace ");
		if (node.materialized) this.append("materialized ");
		if (node.temporary) this.append("temporary ");
		this.append("view ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.name);
		this.append(" ");
		if (node.columns) {
			this.append("(");
			this.compileList(node.columns);
			this.append(") ");
		}
		if (node.as) {
			this.append("as ");
			this.visitNode(node.as);
		}
	}
	visitRefreshMaterializedView(node) {
		this.append("refresh materialized view ");
		if (node.concurrently) this.append("concurrently ");
		this.visitNode(node.name);
		if (node.withNoData) this.append(" with no data");
		else this.append(" with data");
	}
	visitDropView(node) {
		this.append("drop ");
		if (node.materialized) this.append("materialized ");
		this.append("view ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.cascade) this.append(" cascade");
	}
	visitGenerated(node) {
		this.append("generated ");
		if (node.always) this.append("always ");
		if (node.byDefault) this.append("by default ");
		this.append("as ");
		if (node.identity) this.append("identity");
		if (node.expression) {
			this.append("(");
			this.visitNode(node.expression);
			this.append(")");
		}
		if (node.stored) this.append(" stored");
	}
	visitDefaultValue(node) {
		this.append("default ");
		this.visitNode(node.defaultValue);
	}
	visitSelectModifier(node) {
		if (node.rawModifier) this.visitNode(node.rawModifier);
		else this.append(SELECT_MODIFIER_SQL[node.modifier]);
		if (node.of) {
			this.append(" of ");
			this.compileList(node.of, ", ");
		}
	}
	visitCreateType(node) {
		this.append("create type ");
		this.visitNode(node.name);
		if (node.enum) {
			this.append(" as enum ");
			this.visitNode(node.enum);
		}
	}
	visitDropType(node) {
		this.append("drop type ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.name);
		if (node.additionalNames?.length) {
			this.append(", ");
			this.compileList(node.additionalNames);
		}
		if (node.cascade) this.append(" cascade");
	}
	visitAlterType(node) {
		this.append("alter type ");
		this.visitNode(node.name);
		this.append(" ");
		if (node.addValue) this.visitNode(node.addValue);
		else if (node.renameTo) {
			this.append("rename to ");
			this.visitNode(node.renameTo);
		} else if (node.renameValue) this.visitNode(node.renameValue);
		else if (node.setSchema) {
			this.append("set schema ");
			this.visitNode(node.setSchema);
		}
	}
	visitAddValue(node) {
		this.append("add value ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.value);
		if (node.neighborValue) {
			this.append(node.isBefore ? " before " : " after ");
			this.visitNode(node.neighborValue);
		}
	}
	visitRenameValue(node) {
		this.append("rename value ");
		this.visitNode(node.oldValue);
		this.append(" to ");
		this.visitNode(node.newValue);
	}
	visitExplain(node) {
		this.append("explain");
		if (node.options || node.format) {
			this.append(" ");
			this.append(this.getLeftExplainOptionsWrapper());
			if (node.options) {
				this.visitNode(node.options);
				if (node.format) this.append(this.getExplainOptionsDelimiter());
			}
			if (node.format) {
				this.append("format");
				this.append(this.getExplainOptionAssignment());
				this.append(node.format);
			}
			this.append(this.getRightExplainOptionsWrapper());
		}
	}
	visitDefaultInsertValue(_) {
		this.append("default");
	}
	visitAggregateFunction(node) {
		this.append(node.func);
		this.append("(");
		if (node.distinct) this.append("distinct ");
		this.compileList(node.aggregated);
		if (node.orderBy) {
			this.append(" ");
			this.visitNode(node.orderBy);
		}
		this.append(")");
		if (node.withinGroup) {
			this.append(" within group (");
			this.visitNode(node.withinGroup);
			this.append(")");
		}
		if (node.filter) {
			this.append(" filter(");
			this.visitNode(node.filter);
			this.append(")");
		}
		if (node.over) {
			this.append(" ");
			this.visitNode(node.over);
		}
	}
	visitOver(node) {
		this.append("over(");
		if (node.partitionBy) {
			this.visitNode(node.partitionBy);
			if (node.orderBy) this.append(" ");
		}
		if (node.orderBy) this.visitNode(node.orderBy);
		this.append(")");
	}
	visitPartitionBy(node) {
		this.append("partition by ");
		this.compileList(node.items);
	}
	visitPartitionByItem(node) {
		this.visitNode(node.partitionBy);
	}
	visitBinaryOperation(node) {
		this.visitNode(node.leftOperand);
		this.append(" ");
		this.visitNode(node.operator);
		this.append(" ");
		this.visitNode(node.rightOperand);
	}
	visitUnaryOperation(node) {
		this.visitNode(node.operator);
		if (!this.isMinusOperator(node.operator)) this.append(" ");
		this.visitNode(node.operand);
	}
	isMinusOperator(node) {
		return OperatorNode.is(node) && node.operator === "-";
	}
	visitUsing(node) {
		this.append("using ");
		this.compileList(node.tables);
	}
	visitFunction(node) {
		this.append(node.func);
		this.append("(");
		this.compileList(node.arguments);
		this.append(")");
	}
	visitCase(node) {
		this.append("case");
		if (node.value) {
			this.append(" ");
			this.visitNode(node.value);
		}
		if (node.when) {
			this.append(" ");
			this.compileList(node.when, " ");
		}
		if (node.else) {
			this.append(" else ");
			this.visitNode(node.else);
		}
		this.append(" end");
		if (node.isStatement) this.append(" case");
	}
	visitWhen(node) {
		this.append("when ");
		this.visitNode(node.condition);
		if (node.result) {
			this.append(" then ");
			this.visitNode(node.result);
		}
	}
	visitJSONReference(node) {
		this.visitNode(node.reference);
		this.visitNode(node.traversal);
	}
	visitJSONPath(node) {
		if (node.inOperator) this.visitNode(node.inOperator);
		this.append("'$");
		for (const pathLeg of node.pathLegs) this.visitNode(pathLeg);
		this.append("'");
	}
	visitJSONPathLeg(node) {
		const isArrayLocation = node.type === "ArrayLocation";
		const value = String(node.value);
		if (isArrayLocation) {
			this.append("[");
			this.append(this.sanitizeStringLiteral(value));
			this.append("]");
		} else {
			this.append(".\"");
			this.append(this.sanitizeJSONPathMemberValue(value));
			this.append("\"");
		}
	}
	visitJSONOperatorChain(node) {
		for (let i = 0, len = node.values.length; i < len; i++) {
			if (i === len - 1) this.visitNode(node.operator);
			else this.append("->");
			this.visitNode(node.values[i]);
		}
	}
	visitMergeQuery(node) {
		if (node.with) {
			this.visitNode(node.with);
			this.append(" ");
		}
		this.append("merge ");
		if (node.top) {
			this.visitNode(node.top);
			this.append(" ");
		}
		this.append("into ");
		this.visitNode(node.into);
		if (node.using) {
			this.append(" ");
			this.visitNode(node.using);
		}
		if (node.whens) {
			this.append(" ");
			this.compileList(node.whens, " ");
		}
		if (node.returning) {
			this.append(" ");
			this.visitNode(node.returning);
		}
		if (node.output) {
			this.append(" ");
			this.visitNode(node.output);
		}
		if (node.endModifiers?.length) {
			this.append(" ");
			this.compileList(node.endModifiers, " ");
		}
	}
	visitMatched(node) {
		if (node.not) this.append("not ");
		this.append("matched");
		if (node.bySource) this.append(" by source");
	}
	visitAddIndex(node) {
		if (!this.parentNode || !CreateTableNode.is(this.parentNode)) this.append("add ");
		if (node.unique) this.append("unique ");
		this.append("index ");
		this.visitNode(node.name);
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.using) {
			this.append(" using ");
			this.visitNode(node.using);
		}
	}
	visitCast(node) {
		this.append("cast(");
		this.visitNode(node.expression);
		this.append(" as ");
		this.visitNode(node.dataType);
		this.append(")");
	}
	visitFetch(node) {
		this.append("fetch next ");
		this.visitNode(node.rowCount);
		this.append(` rows ${node.modifier}`);
	}
	visitOutput(node) {
		this.append("output ");
		this.compileList(node.selections);
	}
	visitTop(node) {
		this.append(`top(${node.expression})`);
		if (node.modifiers) this.append(` ${node.modifiers}`);
	}
	visitOrAction(node) {
		this.append(node.action);
	}
	visitCollate(node) {
		this.append("collate ");
		this.visitNode(node.collation);
	}
	append(str) {
		this.#sql += str;
	}
	appendValue(parameter) {
		this.addParameter(parameter);
		this.append(this.getCurrentParameterPlaceholder());
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getCurrentParameterPlaceholder() {
		return "$" + this.numParameters;
	}
	getLeftExplainOptionsWrapper() {
		return "(";
	}
	getExplainOptionAssignment() {
		return " ";
	}
	getExplainOptionsDelimiter() {
		return ", ";
	}
	getRightExplainOptionsWrapper() {
		return ")";
	}
	sanitizeIdentifier(identifier) {
		const leftWrap = this.getLeftIdentifierWrapper();
		const rightWrap = this.getRightIdentifierWrapper();
		let sanitized = "";
		for (const c of identifier) {
			sanitized += c;
			if (c === leftWrap) sanitized += leftWrap;
			else if (c === rightWrap) sanitized += rightWrap;
		}
		return sanitized;
	}
	sanitizeStringLiteral(value) {
		return value.replace(LIT_WRAP_REGEX, "''");
	}
	sanitizeJSONPathMemberValue(value) {
		return value.replace(JSON_PATH_MEMBER_WRAP_REGEX, (char) => char === "'" ? "''" : "\\\"");
	}
	addParameter(parameter) {
		this.#parameters.push(parameter);
	}
	appendImmediateValue(value) {
		if (isString(value)) this.appendStringLiteral(value);
		else if (isNumber(value) || isBoolean(value) || isBigInt(value)) this.append(value.toString());
		else if (isNull(value)) this.append("null");
		else if (isDate(value)) this.appendImmediateValue(value.toISOString());
		else throw new Error(`invalid immediate value ${value}`);
	}
	appendStringLiteral(value) {
		this.append("'");
		this.append(this.sanitizeStringLiteral(value));
		this.append("'");
	}
	sortSelectModifiers(arr) {
		return freeze(arr.toSorted((left, right) => left.modifier && right.modifier ? SELECT_MODIFIER_PRIORITY[left.modifier] - SELECT_MODIFIER_PRIORITY[right.modifier] : 1));
	}
	compileColumnAlterations(columnAlterations) {
		this.compileList(columnAlterations);
	}
	/**
	* controls whether the dialect adds a "type" keyword before a column's new data
	* type in an ALTER TABLE statement.
	*/
	announcesNewColumnDataType() {
		return true;
	}
};
var SELECT_MODIFIER_SQL = freeze({
	ForKeyShare: "for key share",
	ForNoKeyUpdate: "for no key update",
	ForUpdate: "for update",
	ForShare: "for share",
	NoWait: "nowait",
	SkipLocked: "skip locked",
	Distinct: "distinct"
});
var SELECT_MODIFIER_PRIORITY = freeze({
	ForKeyShare: 1,
	ForNoKeyUpdate: 1,
	ForUpdate: 1,
	ForShare: 1,
	NoWait: 2,
	SkipLocked: 2,
	Distinct: 0
});
var JOIN_TYPE_SQL = freeze({
	InnerJoin: "inner join",
	LeftJoin: "left join",
	RightJoin: "right join",
	FullJoin: "full join",
	CrossJoin: "cross join",
	LateralInnerJoin: "inner join lateral",
	LateralLeftJoin: "left join lateral",
	LateralCrossJoin: "cross join lateral",
	OuterApply: "outer apply",
	CrossApply: "cross apply",
	Using: "using"
});
//#endregion
//#region node_modules/kysely/dist/query-compiler/compiled-query.js
var CompiledQuery = freeze({ raw(sql, parameters = []) {
	return freeze({
		sql,
		query: RawNode.createWithSql(sql),
		parameters: freeze(parameters),
		queryId: createQueryId()
	});
} });
//#endregion
//#region node_modules/kysely/dist/dialect/dialect-adapter-base.js
/**
* A basic implementation of `DialectAdapter` with sensible default values.
* Third-party dialects can extend this instead of implementing the `DialectAdapter`
* interface from scratch. That way all new settings will get default values when
* they are added and there will be less breaking changes.
*/
var DialectAdapterBase = class {
	get supportsCreateIfNotExists() {
		return true;
	}
	get supportsMultipleConnections() {
		return true;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return false;
	}
	get supportsOutput() {
		return false;
	}
};
//#endregion
//#region node_modules/kysely/dist/parser/savepoint-parser.js
function parseSavepointCommand(command, savepointName) {
	return RawNode.createWithChildren([RawNode.createWithSql(`${command} `), IdentifierNode.create(savepointName)]);
}
//#endregion
//#region node_modules/kysely/dist/dialect/sqlite/sqlite-driver.js
var SqliteDriver = class {
	#config;
	#db;
	#connection;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	async init(options) {
		this.#db = isFunction(this.#config.database) ? await this.#config.database(options) : this.#config.database;
		this.#connection = new SqliteConnection(this.#db);
		if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection, options);
	}
	async acquireConnection() {
		return this.#connection;
	}
	async beginTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async savepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("release", savepointName), createQueryId()));
	}
	async releaseConnection() {}
	async destroy() {
		this.#db?.close();
	}
};
var SqliteConnection = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async executeQuery(compiledQuery) {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		if (stmt.reader) return { rows: stmt.all(parameters) };
		const { changes, lastInsertRowid } = stmt.run(parameters);
		return {
			insertId: lastInsertRowid != null ? BigInt(lastInsertRowid) : void 0,
			numAffectedRows: changes != null ? BigInt(changes) : void 0,
			rows: []
		};
	}
	async *streamQuery(compiledQuery, _chunkSize) {
		const { sql, parameters, query } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		if (!SelectQueryNode.is(query)) throw new Error("Sqlite driver only supports streaming of select queries");
		const iter = stmt.iterate(parameters);
		for (const row of iter) yield { rows: [row] };
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/sqlite/sqlite-query-compiler.js
var ID_WRAP_REGEX$2 = /"/g;
var JSON_PATH_MEMBER_ESCAPE_REGEX$1 = /[\\'"]/g;
var SqliteQueryCompiler = class extends DefaultQueryCompiler {
	visitOrAction(node) {
		this.append("or ");
		this.append(node.action);
	}
	getCurrentParameterPlaceholder() {
		return "?";
	}
	getLeftExplainOptionsWrapper() {
		return "";
	}
	getRightExplainOptionsWrapper() {
		return "";
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getAutoIncrement() {
		return "autoincrement";
	}
	sanitizeIdentifier(identifier) {
		return identifier.replace(ID_WRAP_REGEX$2, "\"\"");
	}
	sanitizeJSONPathMemberValue(value) {
		return value.replace(JSON_PATH_MEMBER_ESCAPE_REGEX$1, (char) => char === "\\" ? "\\\\" : char === "'" ? "''" : "\\\"");
	}
	visitDefaultInsertValue(_) {
		this.append("null");
	}
};
//#endregion
//#region node_modules/kysely/dist/migration/migrator.js
var DEFAULT_MIGRATION_TABLE$1 = "kysely_migration";
var DEFAULT_MIGRATION_LOCK_TABLE$1 = "kysely_migration_lock";
freeze({ __noMigrations__: true });
//#endregion
//#region node_modules/kysely/dist/dialect/sqlite/sqlite-introspector.js
var SqliteIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return [];
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		return await this.#getTableMetadata(options);
	}
	#tablesQuery(qb, options) {
		let tablesQuery = qb.selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").select([
			"name",
			"sql",
			"type"
		]).orderBy("name");
		if (!options.withInternalKyselyTables) tablesQuery = tablesQuery.where("name", "!=", DEFAULT_MIGRATION_TABLE$1).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE$1);
		return tablesQuery;
	}
	async #getTableMetadata(options) {
		const tablesResult = await this.#tablesQuery(this.#db, options).execute();
		const tableMetadata = await this.#db.with("table_list", (qb) => this.#tablesQuery(qb, options)).selectFrom(["table_list as tl", sql`pragma_table_info(tl.name)`.as("p")]).select([
			"tl.name as table",
			"p.cid",
			"p.name",
			"p.type",
			"p.notnull",
			"p.dflt_value",
			"p.pk"
		]).orderBy("tl.name").orderBy("p.cid").execute();
		const columnsByTable = {};
		for (const row of tableMetadata) {
			columnsByTable[row.table] ??= [];
			columnsByTable[row.table].push(row);
		}
		return tablesResult.map(({ name, sql, type }) => {
			let autoIncrementCol = sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.trimStart()?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
			const columns = columnsByTable[name] ?? [];
			if (!autoIncrementCol) {
				const pkCols = columns.filter((r) => r.pk > 0);
				if (pkCols.length === 1 && pkCols[0].type.toLowerCase() === "integer") autoIncrementCol = pkCols[0].name;
			}
			return {
				name,
				isView: type === "view",
				isForeign: false,
				columns: columns.map((col) => ({
					name: col.name,
					dataType: col.type,
					isNullable: !col.notnull,
					isAutoIncrementing: col.name === autoIncrementCol,
					hasDefaultValue: col.dflt_value != null,
					comment: void 0
				}))
			};
		});
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/sqlite/sqlite-adapter.js
var SqliteAdapter = class extends DialectAdapterBase {
	get supportsMultipleConnections() {
		return false;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock(_db, _opt) {}
	async releaseMigrationLock(_db, _opt) {}
};
//#endregion
//#region node_modules/kysely/dist/dialect/sqlite/sqlite-dialect.js
/**
* SQLite dialect that uses the [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) library.
*
* The constructor takes an instance of {@link SqliteDialectConfig}.
*
* ```ts
* import Database from 'better-sqlite3'
*
* new SqliteDialect({
*   database: new Database('db.sqlite')
* })
* ```
*
* If you want the pool to only be created once it's first used, `database`
* can be a function:
*
* ```ts
* import Database from 'better-sqlite3'
*
* new SqliteDialect({
*   database: async () => new Database('db.sqlite')
* })
* ```
*/
var SqliteDialect = class {
	#config;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	createDriver() {
		return new SqliteDriver(this.#config);
	}
	createQueryCompiler() {
		return new SqliteQueryCompiler();
	}
	createAdapter() {
		return new SqliteAdapter();
	}
	createIntrospector(db) {
		return new SqliteIntrospector(db);
	}
};
//#endregion
//#region node_modules/kysely/dist/util/stack-trace-utils.js
function extendStackTrace(err, stackError) {
	if (isStackHolder(err) && stackError.stack) {
		const stackExtension = stackError.stack.split("\n").slice(1).join("\n");
		err.stack += `\n${stackExtension}`;
		return err;
	}
	return err;
}
function isStackHolder(obj) {
	return isObject(obj) && isString(obj.stack);
}
//#endregion
//#region node_modules/kysely/dist/dialect/mysql/mysql-driver.js
var PRIVATE_RELEASE_METHOD$1 = Symbol();
var MysqlDriver = class {
	#config;
	#connections = /* @__PURE__ */ new WeakMap();
	#pool;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	async init(options) {
		this.#pool = isFunction(this.#config.pool) ? await this.#config.pool(options) : this.#config.pool;
	}
	async acquireConnection(options) {
		const rawConnection = await this.#acquireConnection();
		let connection = this.#connections.get(rawConnection);
		if (!connection) {
			connection = new MysqlConnection(rawConnection, this.#config.controlConnection);
			this.#connections.set(rawConnection, connection);
			if (this.#config?.onCreateConnection) await this.#config.onCreateConnection(connection, options);
		}
		if (this.#config?.onReserveConnection) await this.#config.onReserveConnection(connection, options);
		return connection;
	}
	async beginTransaction(connection, settings) {
		if (settings.isolationLevel || settings.accessMode) {
			const parts = [];
			if (settings.isolationLevel) parts.push(`isolation level ${settings.isolationLevel}`);
			if (settings.accessMode) parts.push(settings.accessMode);
			const sql = `set transaction ${parts.join(", ")}`;
			await connection.executeQuery(CompiledQuery.raw(sql));
		}
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async savepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("release savepoint", savepointName), createQueryId()));
	}
	async releaseConnection(connection) {
		connection[PRIVATE_RELEASE_METHOD$1]();
	}
	async destroy() {
		return new Promise((resolve, reject) => {
			this.#pool.end((err) => {
				if (err) reject(err);
				else resolve();
			});
		});
	}
	async #acquireConnection() {
		return new Promise((resolve, reject) => {
			this.#pool.getConnection(async (err, rawConnection) => {
				if (err) reject(err);
				else resolve(rawConnection);
			});
		});
	}
};
function isOkPacket(obj) {
	return isObject(obj) && "insertId" in obj && "affectedRows" in obj;
}
var MysqlConnection = class {
	#connection;
	#controlConnection;
	#cid;
	#queryId;
	constructor(connection, controlConnection) {
		this.#connection = connection;
		this.#controlConnection = controlConnection;
	}
	async cancelQuery(controlConnectionProvider) {
		await this.#executeControlQuery(`kill query ${this.#cid}`, controlConnectionProvider);
	}
	async collectSessionInfo() {
		if (this.#cid) return;
		const { threadId } = this.#connection;
		if (threadId != null) this.#cid = threadId;
		else {
			const [{ cid }] = await this.#executeQuery(CompiledQuery.raw(`select connection_id() as cid`));
			this.#cid = Number(cid);
		}
	}
	async executeQuery(compiledQuery) {
		try {
			this.#queryId = compiledQuery.queryId;
			const result = await this.#executeQuery(compiledQuery);
			if (!isOkPacket(result)) return { rows: Array.isArray(result) ? result : [] };
			const { insertId, affectedRows, changedRows } = result;
			return {
				insertId: insertId != null && insertId.toString() !== "0" ? BigInt(insertId) : void 0,
				numAffectedRows: affectedRows != null ? BigInt(affectedRows) : void 0,
				numChangedRows: changedRows != null ? BigInt(changedRows) : void 0,
				rows: []
			};
		} catch (err) {
			throw extendStackTrace(err, /* @__PURE__ */ new Error());
		} finally {
			this.#queryId = void 0;
		}
	}
	async killSession(controlConnectionProvider) {
		try {
			this.#connection.destroy();
		} catch {}
		await this.#executeControlQuery(`kill connection ${this.#cid}`, controlConnectionProvider);
	}
	async *streamQuery(compiledQuery, _chunkSize) {
		this.#queryId = compiledQuery.queryId;
		const stream = this.#connection.query(compiledQuery.sql, compiledQuery.parameters).stream({ objectMode: true });
		try {
			for await (const row of stream) yield { rows: [row] };
		} catch (error) {
			if (isObject(error) && "code" in error && error.code === "ERR_STREAM_PREMATURE_CLOSE") return;
			throw error;
		} finally {
			this.#queryId = void 0;
		}
	}
	[PRIVATE_RELEASE_METHOD$1]() {
		this.#connection.release();
	}
	#executeQuery(compiledQuery) {
		return new Promise((resolve, reject) => {
			this.#connection.query(compiledQuery.sql, compiledQuery.parameters, (err, result) => {
				if (err) reject(err);
				else resolve(result);
			});
		});
	}
	async #executeControlQuery(query, controlConnectionProvider) {
		if (!this.#queryId) return;
		const { config } = this.#connection;
		const queryIdToCancel = this.#queryId;
		if (!this.#controlConnection || !config) return await controlConnectionProvider(async (controlConnection) => {
			if (queryIdToCancel.queryId === this.#queryId?.queryId) await controlConnection.executeQuery(CompiledQuery.raw(query, []));
		});
		const { clientFlags: _, maxPacketSize: __, ...cfg } = config;
		const controlConnection = this.#controlConnection(cfg);
		try {
			await new Promise((resolve, reject) => {
				controlConnection.connect((connectError) => {
					if (connectError) return reject(connectError);
					if (queryIdToCancel.queryId !== this.#queryId?.queryId) return resolve();
					controlConnection.query(query, [], (queryError) => {
						if (queryError) return reject(queryError);
						resolve();
					});
				});
			});
		} finally {
			controlConnection.destroy();
		}
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mysql/mysql-query-compiler.js
var LITERAL_ESCAPE_REGEX = /[\\']/g;
var ID_WRAP_REGEX$1 = /`/g;
var JSON_PATH_MEMBER_ESCAPE_REGEX = /[\\'"]/g;
var MysqlQueryCompiler = class extends DefaultQueryCompiler {
	getCurrentParameterPlaceholder() {
		return "?";
	}
	getLeftExplainOptionsWrapper() {
		return "";
	}
	getExplainOptionAssignment() {
		return "=";
	}
	getExplainOptionsDelimiter() {
		return " ";
	}
	getRightExplainOptionsWrapper() {
		return "";
	}
	getLeftIdentifierWrapper() {
		return ID_WRAP_REGEX$1.source;
	}
	getRightIdentifierWrapper() {
		return ID_WRAP_REGEX$1.source;
	}
	sanitizeIdentifier(identifier) {
		return identifier.replace(ID_WRAP_REGEX$1, "``");
	}
	/**
	* MySQL requires escaping backslashes in string literals when using the
	* default NO_BACKSLASH_ESCAPES=OFF mode. Without this, a backslash
	* followed by a quote (\') can break out of the string literal.
	*
	* @see https://dev.mysql.com/doc/refman/9.6/en/string-literals.html
	*/
	sanitizeStringLiteral(value) {
		return value.replace(LITERAL_ESCAPE_REGEX, (char) => char === "\\" ? "\\\\" : "''");
	}
	/**
	* Member values appear inside `"..."` in the JSON path, which itself sits
	* inside a SQL string literal. They must therefore be escaped twice — once
	* for the JSON path grammar, then again for MySQL's string literal parser.
	*/
	sanitizeJSONPathMemberValue(value) {
		return value.replace(JSON_PATH_MEMBER_ESCAPE_REGEX, (char) => char === "\\" ? "\\\\\\\\" : char === "'" ? "''" : "\\\\\"");
	}
	visitCreateIndex(node) {
		this.append("create ");
		if (node.unique) this.append("unique ");
		this.append("index ");
		if (node.ifNotExists) this.append("if not exists ");
		this.visitNode(node.name);
		if (node.using) {
			this.append(" using ");
			this.visitNode(node.using);
		}
		if (node.table) {
			this.append(" on ");
			this.visitNode(node.table);
		}
		if (node.columns) {
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
		}
		if (node.where) {
			this.append(" ");
			this.visitNode(node.where);
		}
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mysql/mysql-introspector.js
var MysqlIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return (await this.#db.selectFrom("information_schema.schemata").select("schema_name").$castTo().execute()).map((it) => ({ name: it.SCHEMA_NAME }));
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		let query = this.#db.selectFrom("information_schema.columns as columns").innerJoin("information_schema.tables as tables", (b) => b.onRef("columns.TABLE_CATALOG", "=", "tables.TABLE_CATALOG").onRef("columns.TABLE_SCHEMA", "=", "tables.TABLE_SCHEMA").onRef("columns.TABLE_NAME", "=", "tables.TABLE_NAME")).select([
			"columns.COLUMN_NAME",
			"columns.COLUMN_DEFAULT",
			"columns.TABLE_NAME",
			"columns.TABLE_SCHEMA",
			"tables.TABLE_TYPE",
			"tables.ENGINE",
			"columns.IS_NULLABLE",
			"columns.DATA_TYPE",
			"columns.EXTRA",
			"columns.COLUMN_COMMENT"
		]).where("columns.TABLE_SCHEMA", "=", sql`database()`).orderBy("columns.TABLE_NAME").orderBy("columns.ORDINAL_POSITION").$castTo();
		if (!options.withInternalKyselyTables) query = query.where("columns.TABLE_NAME", "!=", DEFAULT_MIGRATION_TABLE$1).where("columns.TABLE_NAME", "!=", DEFAULT_MIGRATION_LOCK_TABLE$1);
		const rawColumns = await query.execute();
		return this.#parseTableMetadata(rawColumns);
	}
	#parseTableMetadata(columns) {
		return columns.reduce((tables, it) => {
			let table = tables.find((tbl) => tbl.name === it.TABLE_NAME);
			if (!table) {
				table = freeze({
					name: it.TABLE_NAME,
					isView: it.TABLE_TYPE === "VIEW",
					isForeign: it.ENGINE === "FEDERATED",
					schema: it.TABLE_SCHEMA,
					columns: []
				});
				tables.push(table);
			}
			table.columns.push(freeze({
				name: it.COLUMN_NAME,
				dataType: it.DATA_TYPE,
				isNullable: it.IS_NULLABLE === "YES",
				isAutoIncrementing: it.EXTRA.toLowerCase().includes("auto_increment"),
				hasDefaultValue: it.COLUMN_DEFAULT !== null,
				comment: it.COLUMN_COMMENT === "" ? void 0 : it.COLUMN_COMMENT
			}));
			return tables;
		}, []);
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mysql/mysql-adapter.js
var LOCK_ID$1 = "ea586330-2c93-47c8-908d-981d9d270f9d";
var LOCK_TIMEOUT_SECONDS = 3600;
var MysqlAdapter = class extends DialectAdapterBase {
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return false;
	}
	async acquireMigrationLock(db, _opt) {
		await sql`select get_lock(${sql.lit(LOCK_ID$1)}, ${sql.lit(LOCK_TIMEOUT_SECONDS)})`.execute(db);
	}
	async releaseMigrationLock(db, _opt) {
		await sql`select release_lock(${sql.lit(LOCK_ID$1)})`.execute(db);
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mysql/mysql-dialect.js
/**
* MySQL dialect that uses the [mysql2](https://github.com/sidorares/node-mysql2#readme) library.
*
* The constructor takes an instance of {@link MysqlDialectConfig}.
*
* ```ts
* import { createPool } from 'mysql2'
*
* new MysqlDialect({
*   pool: createPool({
*     database: 'some_db',
*     host: 'localhost',
*   })
* })
* ```
*
* If you want the pool to only be created once it's first used, `pool`
* can be a function:
*
* ```ts
* import { createPool } from 'mysql2'
*
* new MysqlDialect({
*   pool: async () => createPool({
*     database: 'some_db',
*     host: 'localhost',
*   })
* })
* ```
*/
var MysqlDialect = class {
	#config;
	constructor(config) {
		this.#config = config;
	}
	createDriver() {
		return new MysqlDriver(this.#config);
	}
	createQueryCompiler() {
		return new MysqlQueryCompiler();
	}
	createAdapter() {
		return new MysqlAdapter();
	}
	createIntrospector(db) {
		return new MysqlIntrospector(db);
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/postgres/postgres-driver.js
var PRIVATE_RELEASE_METHOD = Symbol();
var PostgresDriver = class {
	#config;
	#connections = /* @__PURE__ */ new WeakMap();
	#pool;
	constructor(config) {
		this.#config = freeze({ ...config });
	}
	async init(options) {
		this.#pool = isFunction(this.#config.pool) ? await this.#config.pool(options) : this.#config.pool;
	}
	async acquireConnection(options) {
		const client = await this.#pool.connect();
		let connection = this.#connections.get(client);
		if (!connection) {
			connection = new PostgresConnection(client, {
				controlClient: this.#config.controlClient || this.#pool.Client,
				cursor: this.#config.cursor ?? null,
				poolOptions: this.#pool.options
			});
			this.#connections.set(client, connection);
			if (this.#config.onCreateConnection) await this.#config.onCreateConnection(connection, options);
		}
		if (this.#config.onReserveConnection) await this.#config.onReserveConnection(connection, options);
		return connection;
	}
	async beginTransaction(connection, settings) {
		let sql = "begin";
		if (settings.isolationLevel || settings.accessMode) {
			sql = "start transaction";
			if (settings.isolationLevel) sql += ` isolation level ${settings.isolationLevel}`;
			if (settings.accessMode) sql += ` ${settings.accessMode}`;
		}
		await connection.executeQuery(CompiledQuery.raw(sql));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async savepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
	}
	async rollbackToSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
	}
	async releaseSavepoint(connection, savepointName, compileQuery) {
		await connection.executeQuery(compileQuery(parseSavepointCommand("release", savepointName), createQueryId()));
	}
	async releaseConnection(connection) {
		connection[PRIVATE_RELEASE_METHOD]();
	}
	async destroy() {
		if (this.#pool) {
			const pool = this.#pool;
			this.#pool = void 0;
			await pool.end();
		}
	}
};
var PostgresConnection = class {
	#client;
	#options;
	#queryId;
	#pid;
	constructor(client, options) {
		this.#client = client;
		this.#options = options;
	}
	async cancelQuery(controlConnectionProvider) {
		return await this.#executeControlQuery(`select pg_cancel_backend(${this.#pid})`, controlConnectionProvider);
	}
	async collectSessionInfo() {
		if (this.#pid) return;
		const { processID } = this.#client;
		if (processID) this.#pid = processID;
		else {
			const { rows: [{ pid }] } = await this.#client.query("select pg_backend_pid() as pid", []);
			this.#pid = Number(pid);
		}
	}
	async executeQuery(compiledQuery) {
		try {
			this.#queryId = compiledQuery.queryId;
			const { command, rowCount, rows } = await this.#client.query(compiledQuery.sql, compiledQuery.parameters);
			return {
				numAffectedRows: command === "INSERT" || command === "UPDATE" || command === "DELETE" || command === "MERGE" ? BigInt(rowCount) : void 0,
				rows: rows ?? []
			};
		} catch (err) {
			throw extendStackTrace(err, /* @__PURE__ */ new Error());
		} finally {
			this.#queryId = void 0;
		}
	}
	async killSession(controlConnectionProvider) {
		return await this.#executeControlQuery(`select pg_terminate_backend(${this.#pid})`, controlConnectionProvider);
	}
	async *streamQuery(compiledQuery, chunkSize) {
		if (!this.#options.cursor) throw new Error("`cursor` is not present in your postgres dialect config. It's required to make streaming work in postgres.");
		this.#queryId = compiledQuery.queryId;
		const cursor = this.#client.query(new this.#options.cursor(compiledQuery.sql, compiledQuery.parameters.slice()));
		try {
			while (true) {
				const rows = await cursor.read(chunkSize);
				if (rows.length === 0) break;
				yield { rows };
			}
		} finally {
			await cursor.close();
			this.#queryId = void 0;
		}
	}
	[PRIVATE_RELEASE_METHOD]() {
		this.#client.release();
	}
	async #executeControlQuery(query, controlConnectionProvider) {
		if (!this.#queryId) return;
		const { controlClient: Client, poolOptions } = this.#options;
		const queryIdToCancel = this.#queryId;
		if (!Client) return await controlConnectionProvider(async (controlConnection) => {
			if (queryIdToCancel.queryId === this.#queryId?.queryId) await controlConnection.executeQuery(CompiledQuery.raw(query, []));
		});
		const controlClient = new Client({
			...poolOptions,
			password: "password" in poolOptions ? poolOptions.password : void 0
		});
		try {
			await controlClient.connect();
			if (queryIdToCancel.queryId !== this.#queryId.queryId) return;
			await controlClient.query(query, []);
		} finally {
			controlClient.end();
		}
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/postgres/postgres-introspector.js
var PostgresIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return (await this.#db.selectFrom("pg_catalog.pg_namespace").select("nspname").$castTo().execute()).map((it) => ({ name: it.nspname }));
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		let query = this.#db.selectFrom("pg_catalog.pg_attribute as a").innerJoin("pg_catalog.pg_class as c", "a.attrelid", "c.oid").innerJoin("pg_catalog.pg_namespace as ns", "c.relnamespace", "ns.oid").innerJoin("pg_catalog.pg_type as typ", "a.atttypid", "typ.oid").innerJoin("pg_catalog.pg_namespace as dtns", "typ.typnamespace", "dtns.oid").select([
			"a.attname as column",
			"a.attnotnull as not_null",
			"a.atthasdef as has_default",
			"c.relname as table",
			"c.relkind as table_type",
			"ns.nspname as schema",
			"typ.typname as type",
			"dtns.nspname as type_schema",
			sql`col_description(a.attrelid, a.attnum)`.as("column_description"),
			sql`pg_get_serial_sequence(quote_ident(ns.nspname) || '.' || quote_ident(c.relname), a.attname)`.as("auto_incrementing")
		]).where("c.relkind", "in", [
			"r",
			"v",
			"p",
			"f"
		]).where("ns.nspname", "!~", "^pg_").where("ns.nspname", "!=", "information_schema").where("ns.nspname", "!=", "crdb_internal").where(sql`has_schema_privilege(ns.nspname, 'USAGE')`).where("a.attnum", ">=", 0).where("a.attisdropped", "!=", true).orderBy("ns.nspname").orderBy("c.relname").orderBy("a.attnum").$castTo();
		if (!options.withInternalKyselyTables) query = query.where("c.relname", "!=", DEFAULT_MIGRATION_TABLE$1).where("c.relname", "!=", DEFAULT_MIGRATION_LOCK_TABLE$1);
		const rawColumns = await query.execute();
		return this.#parseTableMetadata(rawColumns);
	}
	#parseTableMetadata(columns) {
		const tables = [];
		const schemas = /* @__PURE__ */ new Map();
		for (const column of columns) {
			let schema = schemas.get(column.schema);
			if (!schema) {
				schema = /* @__PURE__ */ new Map();
				schemas.set(column.schema, schema);
			}
			let table = schema.get(column.table);
			if (!table) {
				table = freeze({
					columns: [],
					isForeign: column.table_type === "f",
					isView: column.table_type === "v",
					name: column.table,
					schema: column.schema
				});
				schema.set(column.table, table);
				tables.push(table);
			}
			table.columns.push(freeze({
				comment: column.column_description ?? void 0,
				dataType: column.type,
				dataTypeSchema: column.type_schema,
				hasDefaultValue: column.has_default,
				isAutoIncrementing: column.auto_incrementing !== null,
				isNullable: !column.not_null,
				name: column.column
			}));
		}
		return tables;
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/postgres/postgres-query-compiler.js
var ID_WRAP_REGEX = /"/g;
var PostgresQueryCompiler = class extends DefaultQueryCompiler {
	sanitizeIdentifier(identifier) {
		return identifier.replace(ID_WRAP_REGEX, "\"\"");
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/postgres/postgres-adapter.js
var LOCK_ID = BigInt("3853314791062309107");
var LOCK_TIMEOUT_MILLISECONDS = 36e5;
var PostgresAdapter = class extends DialectAdapterBase {
	get supportsTransactionalDdl() {
		return true;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock(db, _opt) {
		await sql`
    with set_timeout as (
      select set_config('lock_timeout', '${sql.lit(LOCK_TIMEOUT_MILLISECONDS)}', true) as config_val
    )
    select pg_advisory_lock(${sql.lit(LOCK_ID)})
    from set_timeout`.execute(db);
	}
	async releaseMigrationLock(db, _opt) {
		await sql`select pg_advisory_unlock(${sql.lit(LOCK_ID)})`.execute(db);
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/postgres/postgres-dialect.js
/**
* PostgreSQL dialect that uses the [pg](https://node-postgres.com/) library.
*
* The constructor takes an instance of {@link PostgresDialectConfig}.
*
* ```ts
* import { Pool } from 'pg'
*
* new PostgresDialect({
*   pool: new Pool({
*     database: 'some_db',
*     host: 'localhost',
*   })
* })
* ```
*
* If you want the pool to only be created once it's first used, `pool`
* can be a function:
*
* ```ts
* import { Pool } from 'pg'
*
* new PostgresDialect({
*   pool: async () => new Pool({
*     database: 'some_db',
*     host: 'localhost',
*   })
* })
* ```
*/
var PostgresDialect = class {
	#config;
	constructor(config) {
		this.#config = config;
	}
	createDriver() {
		return new PostgresDriver(this.#config);
	}
	createQueryCompiler() {
		return new PostgresQueryCompiler();
	}
	createAdapter() {
		return new PostgresAdapter();
	}
	createIntrospector(db) {
		return new PostgresIntrospector(db);
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mssql/mssql-adapter.js
var LOCK_PRINCIPAL = "dbo";
var MssqlAdapter = class extends DialectAdapterBase {
	get supportsCreateIfNotExists() {
		return false;
	}
	get supportsTransactionalDdl() {
		return true;
	}
	get supportsOutput() {
		return true;
	}
	async acquireMigrationLock(db, _opt) {
		await sql`exec sp_getapplock @DbPrincipal = ${sql.lit(LOCK_PRINCIPAL)}, @Resource = ${sql.lit(DEFAULT_MIGRATION_TABLE$1)}, @LockMode = ${sql.lit("Exclusive")}, @LockOwner = ${sql.lit("Session")}`.execute(db);
	}
	async releaseMigrationLock(db, _opt) {
		await sql`exec sp_releaseapplock @DbPrincipal = ${sql.lit(LOCK_PRINCIPAL)}, @Resource = ${sql.lit(DEFAULT_MIGRATION_TABLE$1)}, @LockOwner = ${sql.lit("Session")}`.execute(db);
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mssql/mssql-driver.js
var PRIVATE_RESET_METHOD = Symbol();
var PRIVATE_DESTROY_METHOD = Symbol();
var PRIVATE_VALIDATE_METHOD = Symbol();
var MssqlDriver = class {
	#config;
	#pool;
	constructor(config) {
		this.#config = freeze({ ...config });
		const { tarn, tedious, validateConnections } = this.#config;
		this.#pool = new tarn.Pool({
			...tarn.options,
			create: async () => {
				return await new MssqlConnection(await tedious.connectionFactory(), tedious).connect();
			},
			destroy: async (connection) => {
				await connection[PRIVATE_DESTROY_METHOD]();
			},
			validate: validateConnections === false ? void 0 : (connection) => connection[PRIVATE_VALIDATE_METHOD]()
		});
	}
	async init() {}
	async acquireConnection() {
		return await this.#pool.acquire().promise;
	}
	async beginTransaction(connection, settings) {
		await connection.beginTransaction(settings);
	}
	async commitTransaction(connection) {
		await connection.commitTransaction();
	}
	async rollbackTransaction(connection) {
		await connection.rollbackTransaction();
	}
	async savepoint(connection, savepointName) {
		await connection.savepoint(savepointName);
	}
	async rollbackToSavepoint(connection, savepointName) {
		await connection.rollbackTransaction(savepointName);
	}
	async releaseConnection(connection) {
		if (this.#config.resetConnectionsOnRelease) await connection[PRIVATE_RESET_METHOD]();
		this.#pool.release(connection);
	}
	async destroy() {
		await this.#pool.destroy();
	}
};
var MssqlConnection = class {
	#connection;
	#hasSocketError;
	#tedious;
	#inflightRequest;
	constructor(connection, tedious) {
		this.#connection = connection;
		this.#hasSocketError = false;
		this.#tedious = tedious;
	}
	async beginTransaction(settings) {
		const { isolationLevel } = settings;
		await new Promise((resolve, reject) => this.#connection.beginTransaction((error) => {
			if (error) reject(error);
			else resolve(void 0);
		}, isolationLevel ? randomString(8) : void 0, isolationLevel ? this.#getTediousIsolationLevel(isolationLevel) : void 0));
	}
	async cancelQuery() {
		if (!this.#inflightRequest) return;
		return new Promise((resolve) => {
			this.#inflightRequest?.request.once("requestCompleted", resolve);
			if (!this.#connection.cancel()) {
				this.#inflightRequest?.request.off("requestCompleted", resolve);
				resolve();
			}
		});
	}
	async commitTransaction() {
		await new Promise((resolve, reject) => this.#connection.commitTransaction((error) => {
			if (error) reject(error);
			else resolve(void 0);
		}));
	}
	async connect() {
		const { promise: waitForConnected, reject, resolve } = new Deferred();
		this.#connection.connect((error) => {
			if (error) return reject(error);
			resolve();
		});
		this.#connection.on("error", (error) => {
			if (error instanceof Error && "code" in error && error.code === "ESOCKET") this.#hasSocketError = true;
			console.error(error);
			reject(error);
		});
		function endListener() {
			reject(/* @__PURE__ */ new Error("The connection ended without ever completing the connection"));
		}
		this.#connection.once("end", endListener);
		await waitForConnected;
		this.#connection.off("end", endListener);
		return this;
	}
	async executeQuery(compiledQuery) {
		try {
			const deferred = new Deferred();
			this.#inflightRequest = new MssqlRequest({
				compiledQuery,
				tedious: this.#tedious,
				onDone: deferred
			});
			this.#connection.execSql(this.#inflightRequest.request);
			const { rowCount, rows } = await deferred.promise;
			return {
				numAffectedRows: rowCount !== void 0 ? BigInt(rowCount) : void 0,
				rows
			};
		} catch (err) {
			throw extendStackTrace(err, /* @__PURE__ */ new Error());
		} finally {
			this.#inflightRequest = void 0;
		}
	}
	async rollbackTransaction(savepointName) {
		await new Promise((resolve, reject) => this.#connection.rollbackTransaction((error) => {
			if (error) reject(error);
			else resolve(void 0);
		}, savepointName));
	}
	async savepoint(savepointName) {
		await new Promise((resolve, reject) => this.#connection.saveTransaction((error) => {
			if (error) reject(error);
			else resolve(void 0);
		}, savepointName));
	}
	async *streamQuery(compiledQuery, chunkSize) {
		this.#inflightRequest = new MssqlRequest({
			compiledQuery,
			streamChunkSize: chunkSize,
			tedious: this.#tedious
		});
		this.#connection.execSql(this.#inflightRequest.request);
		try {
			while (true) {
				const rows = await this.#inflightRequest.readChunk();
				if (rows.length === 0) break;
				yield { rows };
				if (rows.length < chunkSize) break;
			}
		} finally {
			await this.cancelQuery();
			this.#inflightRequest = void 0;
		}
	}
	#getTediousIsolationLevel(isolationLevel) {
		const { ISOLATION_LEVEL } = this.#tedious;
		const tediousIsolationLevel = {
			"read committed": ISOLATION_LEVEL.READ_COMMITTED,
			"read uncommitted": ISOLATION_LEVEL.READ_UNCOMMITTED,
			"repeatable read": ISOLATION_LEVEL.REPEATABLE_READ,
			serializable: ISOLATION_LEVEL.SERIALIZABLE,
			snapshot: ISOLATION_LEVEL.SNAPSHOT
		}[isolationLevel];
		if (tediousIsolationLevel === void 0) throw new Error(`Unknown isolation level: ${isolationLevel}`);
		return tediousIsolationLevel;
	}
	[PRIVATE_DESTROY_METHOD]() {
		if ("closed" in this.#connection && this.#connection.closed) return Promise.resolve();
		return new Promise((resolve) => {
			this.#connection.once("end", resolve);
			this.#connection.close();
		});
	}
	async [PRIVATE_RESET_METHOD]() {
		await new Promise((resolve, reject) => {
			this.#connection.reset((error) => {
				if (error) return reject(error);
				resolve();
			});
		});
	}
	async [PRIVATE_VALIDATE_METHOD]() {
		if (this.#hasSocketError || this.#isConnectionClosed()) return false;
		try {
			const deferred = new Deferred();
			const request = new MssqlRequest({
				compiledQuery: CompiledQuery.raw("select 1"),
				onDone: deferred,
				tedious: this.#tedious
			});
			this.#connection.execSql(request.request);
			await deferred.promise;
			return true;
		} catch {
			return false;
		}
	}
	#isConnectionClosed() {
		return "closed" in this.#connection && Boolean(this.#connection.closed);
	}
};
var MssqlRequest = class {
	#request;
	#rows;
	#streamChunkSize;
	#subscribers;
	#tedious;
	#rowCount;
	constructor(props) {
		const { compiledQuery, onDone, streamChunkSize, tedious } = props;
		this.#rows = [];
		this.#streamChunkSize = streamChunkSize;
		this.#subscribers = {};
		this.#tedious = tedious;
		if (onDone) {
			const subscriptionKey = "onDone";
			this.#subscribers[subscriptionKey] = (event, error) => {
				if (event === "chunkReady") return;
				delete this.#subscribers[subscriptionKey];
				if (event === "error") return onDone.reject(error);
				onDone.resolve({
					rowCount: this.#rowCount,
					rows: this.#rows
				});
			};
		}
		this.#request = new this.#tedious.Request(compiledQuery.sql, (err, rowCount) => {
			if (err) return Object.values(this.#subscribers).forEach((subscriber) => subscriber("error", err instanceof AggregateError ? err.errors : err));
			this.#rowCount = rowCount;
		});
		this.#addParametersToRequest(compiledQuery.parameters);
		this.#attachListeners();
	}
	get request() {
		return this.#request;
	}
	readChunk() {
		const subscriptionKey = this.readChunk.name;
		return new Promise((resolve, reject) => {
			this.#subscribers[subscriptionKey] = (event, error) => {
				delete this.#subscribers[subscriptionKey];
				if (event === "error") return reject(error);
				resolve(this.#rows.splice(0, this.#streamChunkSize));
			};
			this.#request.resume();
		});
	}
	#addParametersToRequest(parameters) {
		for (let i = 0; i < parameters.length; i++) {
			const parameter = parameters[i];
			this.#request.addParameter(String(i + 1), this.#getTediousDataType(parameter), parameter);
		}
	}
	#attachListeners() {
		const pauseAndEmitChunkReady = this.#streamChunkSize ? () => {
			if (this.#streamChunkSize <= this.#rows.length) {
				this.#request.pause();
				Object.values(this.#subscribers).forEach((subscriber) => subscriber("chunkReady"));
			}
		} : () => {};
		const rowListener = (columns) => {
			const row = {};
			for (const column of columns) row[column.metadata.colName] = column.value;
			this.#rows.push(row);
			pauseAndEmitChunkReady();
		};
		this.#request.on("row", rowListener);
		this.#request.once("requestCompleted", () => {
			Object.values(this.#subscribers).forEach((subscriber) => subscriber("completed"));
			this.#request.off("row", rowListener);
		});
	}
	#getTediousDataType(value) {
		if (isNull(value) || isUndefined(value) || isString(value)) return this.#tedious.TYPES.NVarChar;
		if (isBigInt(value) || isNumber(value) && value % 1 === 0) {
			if (value < -2147483648 || value > 2147483647) return this.#tedious.TYPES.BigInt;
			else return this.#tedious.TYPES.Int;
		}
		if (isNumber(value)) return this.#tedious.TYPES.Float;
		if (isBoolean(value)) return this.#tedious.TYPES.Bit;
		if (isDate(value)) return this.#tedious.TYPES.DateTime;
		if (isBuffer(value)) return this.#tedious.TYPES.VarBinary;
		return this.#tedious.TYPES.NVarChar;
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mssql/mssql-introspector.js
var MssqlIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return await this.#db.selectFrom("sys.schemas").select("name").execute();
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		const rawColumns = await this.#db.selectFrom("sys.tables as tables").leftJoin("sys.schemas as table_schemas", "table_schemas.schema_id", "tables.schema_id").innerJoin("sys.columns as columns", "columns.object_id", "tables.object_id").innerJoin("sys.types as types", "types.user_type_id", "columns.user_type_id").leftJoin("sys.schemas as type_schemas", "type_schemas.schema_id", "types.schema_id").leftJoin("sys.extended_properties as comments", (join) => join.onRef("comments.major_id", "=", "tables.object_id").onRef("comments.minor_id", "=", "columns.column_id").on("comments.name", "=", "MS_Description")).$if(!options.withInternalKyselyTables, (qb) => qb.where("tables.name", "!=", DEFAULT_MIGRATION_TABLE$1).where("tables.name", "!=", DEFAULT_MIGRATION_LOCK_TABLE$1)).select([
			"tables.name as table_name",
			(eb) => eb.ref("tables.type").$castTo().as("table_type"),
			"table_schemas.name as table_schema_name",
			"columns.default_object_id as column_default_object_id",
			"columns.generated_always_type_desc as column_generated_always_type",
			"columns.is_computed as column_is_computed",
			"columns.is_identity as column_is_identity",
			"columns.is_nullable as column_is_nullable",
			"columns.is_rowguidcol as column_is_rowguidcol",
			"columns.name as column_name",
			"types.is_nullable as type_is_nullable",
			"types.name as type_name",
			"type_schemas.name as type_schema_name",
			"comments.value as column_comment"
		]).unionAll(this.#db.selectFrom("sys.views as views").leftJoin("sys.schemas as view_schemas", "view_schemas.schema_id", "views.schema_id").innerJoin("sys.columns as columns", "columns.object_id", "views.object_id").innerJoin("sys.types as types", "types.user_type_id", "columns.user_type_id").leftJoin("sys.schemas as type_schemas", "type_schemas.schema_id", "types.schema_id").leftJoin("sys.extended_properties as comments", (join) => join.onRef("comments.major_id", "=", "views.object_id").onRef("comments.minor_id", "=", "columns.column_id").on("comments.name", "=", "MS_Description")).select([
			"views.name as table_name",
			"views.type as table_type",
			"view_schemas.name as table_schema_name",
			"columns.default_object_id as column_default_object_id",
			"columns.generated_always_type_desc as column_generated_always_type",
			"columns.is_computed as column_is_computed",
			"columns.is_identity as column_is_identity",
			"columns.is_nullable as column_is_nullable",
			"columns.is_rowguidcol as column_is_rowguidcol",
			"columns.name as column_name",
			"types.is_nullable as type_is_nullable",
			"types.name as type_name",
			"type_schemas.name as type_schema_name",
			"comments.value as column_comment"
		])).orderBy("table_schema_name").orderBy("table_name").orderBy("column_name").execute();
		const tableDictionary = {};
		for (const rawColumn of rawColumns) {
			const key = `${rawColumn.table_schema_name}.${rawColumn.table_name}`;
			(tableDictionary[key] = tableDictionary[key] || freeze({
				columns: [],
				isForeign: false,
				isView: rawColumn.table_type === "V ",
				name: rawColumn.table_name,
				schema: rawColumn.table_schema_name ?? void 0
			})).columns.push(freeze({
				dataType: rawColumn.type_name,
				dataTypeSchema: rawColumn.type_schema_name ?? void 0,
				hasDefaultValue: rawColumn.column_default_object_id > 0 || rawColumn.column_generated_always_type !== "NOT_APPLICABLE" || rawColumn.column_is_identity || rawColumn.column_is_computed || rawColumn.column_is_rowguidcol,
				isAutoIncrementing: rawColumn.column_is_identity,
				isNullable: rawColumn.column_is_nullable && rawColumn.type_is_nullable,
				name: rawColumn.column_name,
				comment: rawColumn.column_comment ?? void 0
			}));
		}
		return Object.values(tableDictionary);
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mssql/mssql-query-compiler.js
var COLLATION_CHAR_REGEX = /^[a-z0-9_]$/i;
var MssqlQueryCompiler = class extends DefaultQueryCompiler {
	getCurrentParameterPlaceholder() {
		return `@${this.numParameters}`;
	}
	visitOffset(node) {
		super.visitOffset(node);
		this.append(" rows");
	}
	compileColumnAlterations(columnAlterations) {
		const nodesByKind = {};
		for (const columnAlteration of columnAlterations) {
			if (!nodesByKind[columnAlteration.kind]) nodesByKind[columnAlteration.kind] = [];
			nodesByKind[columnAlteration.kind].push(columnAlteration);
		}
		let first = true;
		if (nodesByKind.AddColumnNode) {
			this.append("add ");
			this.compileList(nodesByKind.AddColumnNode);
			first = false;
		}
		if (nodesByKind.AlterColumnNode) {
			if (!first) this.append(", ");
			this.compileList(nodesByKind.AlterColumnNode);
		}
		if (nodesByKind.DropColumnNode) {
			if (!first) this.append(", ");
			this.append("drop ");
			this.compileList(nodesByKind.DropColumnNode);
			first = false;
		}
		if (nodesByKind.ModifyColumnNode) {
			if (!first) this.append(", ");
			this.compileList(nodesByKind.ModifyColumnNode);
		}
		if (nodesByKind.RenameColumnNode) {
			if (!first) this.append(", ");
			this.compileList(nodesByKind.RenameColumnNode);
		}
	}
	visitAddColumn(node) {
		this.visitNode(node.column);
	}
	visitDropColumn(node) {
		this.append("column ");
		if (node.ifExists) this.append("if exists ");
		this.visitNode(node.column);
	}
	visitMergeQuery(node) {
		super.visitMergeQuery(node);
		this.append(";");
	}
	visitCollate(node) {
		this.append("collate ");
		const { name } = node.collation;
		for (const char of name) if (!COLLATION_CHAR_REGEX.test(char)) throw new Error(`Invalid collation: ${name}`);
		this.append(name);
	}
	announcesNewColumnDataType() {
		return false;
	}
};
//#endregion
//#region node_modules/kysely/dist/dialect/mssql/mssql-dialect.js
/**
* MS SQL Server dialect that uses the [tedious](https://tediousjs.github.io/tedious)
* library.
*
* The constructor takes an instance of {@link MssqlDialectConfig}.
*
* ```ts
* import * as Tedious from 'tedious'
* import * as Tarn from 'tarn'
*
* const dialect = new MssqlDialect({
*   tarn: {
*     ...Tarn,
*     options: {
*       min: 0,
*       max: 10,
*     },
*   },
*   tedious: {
*     ...Tedious,
*     connectionFactory: () => new Tedious.Connection({
*       authentication: {
*         options: {
*           password: 'password',
*           userName: 'username',
*         },
*         type: 'default',
*       },
*       options: {
*         database: 'some_db',
*         port: 1433,
*         trustServerCertificate: true,
*       },
*       server: 'localhost',
*     }),
*   },
* })
* ```
*/
var MssqlDialect = class {
	#config;
	constructor(config) {
		this.#config = config;
	}
	createDriver() {
		return new MssqlDriver(this.#config);
	}
	createQueryCompiler() {
		return new MssqlQueryCompiler();
	}
	createAdapter() {
		return new MssqlAdapter();
	}
	createIntrospector(db) {
		return new MssqlIntrospector(db);
	}
};
//#endregion
//#region node_modules/@better-auth/kysely-adapter/dist/index.mjs
function getKyselyDatabaseType(db) {
	if (!db) return null;
	if ("dialect" in db) return getKyselyDatabaseType(db.dialect);
	if ("createDriver" in db) {
		if (db instanceof SqliteDialect) return "sqlite";
		if (db instanceof MysqlDialect) return "mysql";
		if (db instanceof PostgresDialect) return "postgres";
		if (db instanceof MssqlDialect) return "mssql";
	}
	if ("aggregate" in db) return "sqlite";
	if ("getConnection" in db) return "mysql";
	if ("connect" in db) return "postgres";
	if ("fileControl" in db) return "sqlite";
	if ("open" in db && "close" in db && "prepare" in db) return "sqlite";
	if ("batch" in db && "exec" in db && "prepare" in db) return "sqlite";
	return null;
}
var createKyselyAdapter = async (config) => {
	const db = config.database;
	if (!db) return {
		kysely: null,
		databaseType: null,
		introspectIndexes: void 0,
		transaction: void 0
	};
	if ("db" in db) return {
		kysely: db.db,
		databaseType: db.type,
		introspectIndexes: void 0,
		transaction: db.transaction
	};
	if ("dialect" in db) return {
		kysely: new Kysely({ dialect: db.dialect }),
		databaseType: db.type,
		introspectIndexes: void 0,
		transaction: db.transaction
	};
	let dialect = void 0;
	let introspectIndexes = void 0;
	let transaction = void 0;
	const databaseType = getKyselyDatabaseType(db);
	if ("createDriver" in db) dialect = db;
	if ("aggregate" in db && !("createSession" in db)) {
		dialect = new SqliteDialect({ database: db });
		transaction = true;
	}
	if ("getConnection" in db) {
		dialect = new MysqlDialect(db);
		transaction = true;
	}
	if ("connect" in db) {
		dialect = new PostgresDialect({ pool: db });
		transaction = true;
	}
	if ("fileControl" in db) {
		const { BunSqliteDialect } = await Promise.resolve().then(() => bun_sqlite_dialect_C7ftEUSI_exports);
		dialect = new BunSqliteDialect({ database: db });
		transaction = true;
	}
	if ("createSession" in db) {
		let DatabaseSync = void 0;
		try {
			const nodeSqlite = "node:sqlite";
			({DatabaseSync} = await import(
				/* @vite-ignore */
				/* webpackIgnore: true */
				nodeSqlite
));
		} catch (error) {
			if (error !== null && typeof error === "object" && "code" in error && error.code !== "ERR_UNKNOWN_BUILTIN_MODULE") throw error;
		}
		if (DatabaseSync && db instanceof DatabaseSync) {
			const { NodeSqliteDialect } = await Promise.resolve().then(() => node_sqlite_dialect_exports);
			dialect = new NodeSqliteDialect({ database: db });
			transaction = true;
		}
	}
	if ("batch" in db && "exec" in db && "prepare" in db) {
		const { createD1IndexIntrospector, D1SqliteDialect } = await Promise.resolve().then(() => d1_sqlite_dialect_D4qp4_wW_exports);
		dialect = new D1SqliteDialect({ database: db });
		introspectIndexes = createD1IndexIntrospector(db);
		transaction = false;
	}
	return {
		kysely: dialect ? new Kysely({ dialect }) : null,
		databaseType,
		introspectIndexes,
		transaction
	};
};
/**
* Case-insensitive ILIKE/LIKE for pattern matching.
* Uses ILIKE on PostgreSQL, LOWER()+LIKE on MySQL/SQLite/MSSQL.
*/
function insensitiveIlike(columnRef, pattern, dbType) {
	return dbType === "postgres" ? sql`${sql.ref(columnRef)} ILIKE ${pattern}` : sql`LOWER(${sql.ref(columnRef)}) LIKE LOWER(${pattern})`;
}
/**
* Case-insensitive IN for string arrays.
* Returns { lhs, values } for use with eb(lhs, "in", values).
*/
function insensitiveIn(columnRef, values) {
	return {
		lhs: sql`LOWER(${sql.ref(columnRef)})`,
		values: values.map((v) => v.toLowerCase())
	};
}
/**
* Case-insensitive NOT IN for string arrays.
*/
function insensitiveNotIn(columnRef, values) {
	return {
		lhs: sql`LOWER(${sql.ref(columnRef)})`,
		values: values.map((v) => v.toLowerCase())
	};
}
/**
* Case-insensitive equality for strings.
* Returns { lhs, value } for use with eb(lhs, "=", value).
*/
function insensitiveEq(columnRef, value) {
	return {
		lhs: sql`LOWER(${sql.ref(columnRef)})`,
		value: value.toLowerCase()
	};
}
/**
* Case-insensitive inequality for strings.
*/
function insensitiveNe(columnRef, value) {
	return {
		lhs: sql`LOWER(${sql.ref(columnRef)})`,
		value: value.toLowerCase()
	};
}
var kyselyAdapter = (db, config) => {
	let lazyOptions = null;
	let mysqlNoIdWarned = false;
	const createCustomAdapter = (db, inTransaction = false) => {
		return ({ getFieldName, schema, getDefaultFieldName, getDefaultModelName, getFieldAttributes, getModelName, options }) => {
			if (config?.type === "mysql" && options.advanced?.database?.generateId === false && !mysqlNoIdWarned) {
				mysqlNoIdWarned = true;
				logger.warn("[Kysely Adapter] MySQL does not support INSERT...RETURNING. With generateId set to false, the adapter uses best-effort fallback strategies (unique columns, full-field match) to retrieve inserted rows. For reliable behavior, use Better Auth's default ID generation, a custom generateId function, or generateId: \"serial\" for auto-increment.");
			}
			const selectAllJoins = (join) => {
				const allSelects = [];
				const allSelectsStr = [];
				if (join) for (const [joinModel, _] of Object.entries(join)) {
					const fields = schema[getDefaultModelName(joinModel)]?.fields;
					const [_joinModelSchema, joinModelName] = joinModel.includes(".") ? joinModel.split(".") : [void 0, joinModel];
					if (!fields) continue;
					fields.id = { type: "string" };
					for (const [field, fieldAttr] of Object.entries(fields)) {
						allSelects.push(sql`${sql.ref(`join_${joinModelName}`)}.${sql.ref(fieldAttr.fieldName || field)} as ${sql.ref(`_joined_${joinModelName}_${fieldAttr.fieldName || field}`)}`);
						allSelectsStr.push({
							joinModel,
							joinModelRef: joinModelName,
							fieldName: fieldAttr.fieldName || field
						});
					}
				}
				return {
					allSelectsStr,
					allSelects
				};
			};
			const withReturning = async (values, builder, model, where) => {
				if (config?.type === "mysql") {
					if (where.length > 0) {
						const updateResult = await builder.executeTakeFirst();
						if (!updateResult || Number(updateResult.numUpdatedRows ?? 0) === 0) return null;
						const idEqualityWhere = where.find((w) => w.field === "id" && (w.operator === void 0 || w.operator === "eq") && w.connector !== "OR" && w.value !== void 0 && w.value !== null);
						let reselectField;
						let reselectValue;
						if (values.id !== void 0 && values.id !== null) {
							reselectField = "id";
							reselectValue = values.id;
						} else if (idEqualityWhere) {
							reselectField = "id";
							reselectValue = idEqualityWhere.value;
						} else if (where[0]?.field) {
							reselectField = where[0].field;
							reselectValue = values[reselectField] !== void 0 ? values[reselectField] : where[0].value;
						} else return null;
						return await db.selectFrom(model).selectAll().where(getFieldName({
							model,
							field: reselectField
						}), reselectValue === null ? "is" : "=", reselectValue).limit(1).executeTakeFirst();
					}
					await builder.execute();
					const fetchInserted = async (trx) => {
						if (values.id) return await trx.selectFrom(model).selectAll().where(getFieldName({
							model,
							field: "id"
						}), "=", values.id).limit(1).executeTakeFirst();
						if (options.advanced?.database?.generateId === "serial") {
							const lastId = (await sql`SELECT LAST_INSERT_ID() as id`.execute(trx)).rows[0]?.id;
							if (lastId) return await trx.selectFrom(model).selectAll().where(getFieldName({
								model,
								field: "id"
							}), "=", lastId).limit(1).executeTakeFirst();
						}
						const modelSchema = schema[getDefaultModelName(model)]?.fields;
						if (modelSchema) for (const [fieldKey, fieldAttr] of Object.entries(modelSchema)) {
							if (!fieldAttr.unique) continue;
							const dbFieldName = getFieldName({
								model,
								field: fieldKey
							});
							const val = values[dbFieldName];
							if (val === void 0 || val === null) continue;
							const row = await trx.selectFrom(model).selectAll().where(dbFieldName, "=", val).limit(1).executeTakeFirst();
							if (row) return row;
						}
						let query = trx.selectFrom(model).selectAll();
						let hasConditions = false;
						for (const [key, val] of Object.entries(values)) {
							if (val === void 0) continue;
							query = query.where(key, val === null ? "is" : "=", val);
							hasConditions = true;
						}
						if (hasConditions) {
							const rows = await query.limit(2).execute();
							if (rows.length === 1) return rows[0];
						}
						logger.warn(`[Kysely Adapter] Unable to safely identify the inserted "${model}" row on MySQL. Enable Better Auth ID generation or use generateId: "serial" for reliable behavior.`);
						return null;
					};
					return inTransaction ? fetchInserted(db) : db.transaction().execute(fetchInserted);
				}
				if (config?.type === "mssql") return await builder.outputAll("inserted").executeTakeFirst();
				return await builder.returningAll().executeTakeFirst();
			};
			function convertWhereClause(model, w) {
				if (!w) return {
					and: null,
					or: null
				};
				const conditions = {
					and: [],
					or: []
				};
				w.forEach((condition) => {
					const { field: _field, value: _value, operator = "eq", connector = "AND", mode = "sensitive" } = condition;
					const value = _value;
					const field = getFieldName({
						model,
						field: _field
					});
					const isInsensitive = mode === "insensitive" && (typeof value === "string" || Array.isArray(value) && value.every((v) => typeof v === "string"));
					const expr = (eb) => {
						const f = `${model}.${field}`;
						if (operator.toLowerCase() === "in") {
							if (isInsensitive) {
								const { lhs, values } = insensitiveIn(f, Array.isArray(value) ? value : [value]);
								return eb(lhs, "in", values);
							}
							return eb(f, "in", Array.isArray(value) ? value : [value]);
						}
						if (operator.toLowerCase() === "not_in") {
							if (isInsensitive) {
								const { lhs, values } = insensitiveNotIn(f, Array.isArray(value) ? value : [value]);
								return eb(lhs, "not in", values);
							}
							return eb(f, "not in", Array.isArray(value) ? value : [value]);
						}
						if (operator === "contains") {
							if (isInsensitive && typeof value === "string") return insensitiveIlike(f, `%${value}%`, config?.type);
							return eb(f, "like", `%${value}%`);
						}
						if (operator === "starts_with") {
							if (isInsensitive && typeof value === "string") return insensitiveIlike(f, `${value}%`, config?.type);
							return eb(f, "like", `${value}%`);
						}
						if (operator === "ends_with") {
							if (isInsensitive && typeof value === "string") return insensitiveIlike(f, `%${value}`, config?.type);
							return eb(f, "like", `%${value}`);
						}
						if (operator === "eq") {
							if (value === null) return eb(f, "is", null);
							if (isInsensitive && typeof value === "string") {
								const { lhs, value: v } = insensitiveEq(f, value);
								return eb(lhs, "=", v);
							}
							return eb(f, "=", value);
						}
						if (operator === "ne") {
							if (value === null) return eb(f, "is not", null);
							if (isInsensitive && typeof value === "string") {
								const { lhs, value: v } = insensitiveNe(f, value);
								return eb(lhs, "<>", v);
							}
							return eb(f, "<>", value);
						}
						if (operator === "gt") return eb(f, ">", value);
						if (operator === "gte") return eb(f, ">=", value);
						if (operator === "lt") return eb(f, "<", value);
						if (operator === "lte") return eb(f, "<=", value);
						return eb(f, operator, value);
					};
					if (connector === "OR") conditions.or.push(expr);
					else conditions.and.push(expr);
				});
				return {
					and: conditions.and.length ? conditions.and : null,
					or: conditions.or.length ? conditions.or : null
				};
			}
			function processJoinedResults(rows, joinConfig, allSelectsStr) {
				if (!joinConfig || !rows.length) return rows;
				const groupedByMainId = /* @__PURE__ */ new Map();
				for (const currentRow of rows) {
					const mainModelFields = {};
					const joinedModelFields = {};
					for (const [joinModel] of Object.entries(joinConfig)) joinedModelFields[getModelName(joinModel)] = {};
					for (const [key, value] of Object.entries(currentRow)) {
						const keyStr = String(key);
						let assigned = false;
						for (const { joinModel, fieldName, joinModelRef } of allSelectsStr) if (keyStr === `_joined_${joinModelRef}_${fieldName}` || keyStr === `_Joined${capitalizeFirstLetter(joinModelRef)}${capitalizeFirstLetter(fieldName)}`) {
							joinedModelFields[getModelName(joinModel)][getFieldName({
								model: joinModel,
								field: fieldName
							})] = value;
							assigned = true;
							break;
						}
						if (!assigned) mainModelFields[key] = value;
					}
					const mainId = mainModelFields.id;
					if (!mainId) continue;
					if (!groupedByMainId.has(mainId)) {
						const entry = { ...mainModelFields };
						for (const [joinModel, joinAttr] of Object.entries(joinConfig)) entry[getModelName(joinModel)] = joinAttr.relation === "one-to-one" ? null : [];
						groupedByMainId.set(mainId, entry);
					}
					const entry = groupedByMainId.get(mainId);
					for (const [joinModel, joinAttr] of Object.entries(joinConfig)) {
						const isUnique = joinAttr.relation === "one-to-one";
						const limit = joinAttr.limit ?? 100;
						const joinedObj = joinedModelFields[getModelName(joinModel)];
						const hasData = joinedObj && Object.keys(joinedObj).length > 0 && Object.values(joinedObj).some((value) => value !== null && value !== void 0);
						if (isUnique) entry[getModelName(joinModel)] = hasData ? joinedObj : null;
						else {
							const joinModelName = getModelName(joinModel);
							if (Array.isArray(entry[joinModelName]) && hasData) {
								if (entry[joinModelName].length >= limit) continue;
								const idFieldName = getFieldName({
									model: joinModel,
									field: "id"
								});
								const joinedId = joinedObj[idFieldName];
								if (joinedId) {
									if (!entry[joinModelName].some((item) => item[idFieldName] === joinedId) && entry[joinModelName].length < limit) entry[joinModelName].push(joinedObj);
								} else if (entry[joinModelName].length < limit) entry[joinModelName].push(joinedObj);
							}
						}
					}
				}
				const result = Array.from(groupedByMainId.values());
				for (const entry of result) for (const [joinModel, joinAttr] of Object.entries(joinConfig)) if (joinAttr.relation !== "one-to-one") {
					const joinModelName = getModelName(joinModel);
					if (Array.isArray(entry[joinModelName])) {
						const limit = joinAttr.limit ?? 100;
						if (entry[joinModelName].length > limit) entry[joinModelName] = entry[joinModelName].slice(0, limit);
					}
				}
				return result;
			}
			return {
				async create({ data, model }) {
					return await withReturning(data, db.insertInto(model).values(data), model, []);
				},
				async findOne({ model, where, select, join }) {
					const { and, or } = convertWhereClause(model, where);
					let query = db.selectFrom((eb) => {
						let b = eb.selectFrom(model);
						if (and) b = b.where((eb) => eb.and(and.map((expr) => expr(eb))));
						if (or) b = b.where((eb) => eb.or(or.map((expr) => expr(eb))));
						if (select?.length && select.length > 0) b = b.select(select.map((field) => getFieldName({
							model,
							field
						})));
						else b = b.selectAll();
						return b.as("primary");
					}).selectAll("primary");
					if (join) for (const [joinModel, joinAttr] of Object.entries(join)) {
						const [_joinModelSchema, joinModelName] = joinModel.includes(".") ? joinModel.split(".") : [void 0, joinModel];
						query = query.leftJoin(`${joinModel} as join_${joinModelName}`, (join) => join.onRef(`join_${joinModelName}.${joinAttr.on.to}`, "=", `primary.${joinAttr.on.from}`));
					}
					const { allSelectsStr, allSelects } = selectAllJoins(join);
					query = query.select(allSelects);
					const res = await query.execute();
					if (!res || !Array.isArray(res) || res.length === 0) return null;
					const row = res[0];
					if (join) return processJoinedResults(res, join, allSelectsStr)[0];
					return row;
				},
				async findMany({ model, where, limit, select, offset, sortBy, join }) {
					const { and, or } = convertWhereClause(model, where);
					let query = db.selectFrom((eb) => {
						let b = eb.selectFrom(model);
						if (config?.type === "mssql") {
							if (offset !== void 0) {
								if (!sortBy) b = b.orderBy(getFieldName({
									model,
									field: "id"
								}));
								b = b.offset(offset).fetch(limit || 100);
							} else if (limit !== void 0) b = b.top(limit);
						} else {
							if (limit !== void 0) b = b.limit(limit);
							if (offset !== void 0) b = b.offset(offset);
						}
						if (sortBy?.field) b = b.orderBy(`${getFieldName({
							model,
							field: sortBy.field
						})}`, sortBy.direction);
						if (and) b = b.where((eb) => eb.and(and.map((expr) => expr(eb))));
						if (or) b = b.where((eb) => eb.or(or.map((expr) => expr(eb))));
						if (select?.length && select.length > 0) b = b.select(select.map((field) => getFieldName({
							model,
							field
						})));
						else b = b.selectAll();
						return b.as("primary");
					}).selectAll("primary");
					if (join) for (const [joinModel, joinAttr] of Object.entries(join)) {
						const [_joinModelSchema, joinModelName] = joinModel.includes(".") ? joinModel.split(".") : [void 0, joinModel];
						query = query.leftJoin(`${joinModel} as join_${joinModelName}`, (join) => join.onRef(`join_${joinModelName}.${joinAttr.on.to}`, "=", `primary.${joinAttr.on.from}`));
					}
					const { allSelectsStr, allSelects } = selectAllJoins(join);
					query = query.select(allSelects);
					if (sortBy?.field) query = query.orderBy(`${getFieldName({
						model,
						field: sortBy.field
					})}`, sortBy.direction);
					const res = await query.execute();
					if (!res) return [];
					if (join) return processJoinedResults(res, join, allSelectsStr);
					return res;
				},
				async update({ model, where, update: values }) {
					if (where.length === 0) return null;
					const { and, or } = convertWhereClause(model, where);
					let query = db.updateTable(model).set(values);
					if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
					if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
					return await withReturning(values, query, model, where);
				},
				async updateMany({ model, where, update: values }) {
					const { and, or } = convertWhereClause(model, where);
					let query = db.updateTable(model).set(values);
					if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
					if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
					const res = (await query.executeTakeFirst()).numUpdatedRows;
					return res > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : Number(res);
				},
				async count({ model, where }) {
					const { and, or } = convertWhereClause(model, where);
					let query = db.selectFrom(model).select(db.fn.count("id").as("count"));
					if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
					if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
					const res = await query.execute();
					if (typeof res[0].count === "number") return res[0].count;
					if (typeof res[0].count === "bigint") return Number(res[0].count);
					return parseInt(res[0].count);
				},
				async delete({ model, where }) {
					const { and, or } = convertWhereClause(model, where);
					let query = db.deleteFrom(model);
					if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
					if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
					await query.execute();
				},
				async deleteMany({ model, where }) {
					const { and, or } = convertWhereClause(model, where);
					let query = db.deleteFrom(model);
					if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
					if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
					const res = (await query.executeTakeFirst()).numDeletedRows;
					return res > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : Number(res);
				},
				async consumeOne({ model, where }) {
					const { and, or } = convertWhereClause(model, where);
					const applyWhere = (query) => {
						if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
						if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
						return query;
					};
					const idField = getFieldName({
						model,
						field: "id"
					});
					const deleteSelectedRow = async (db, row) => {
						const targetId = row[idField] ?? row.id;
						if (targetId === void 0 || targetId === null) return null;
						const query = db.deleteFrom(model).where(`${model}.${idField}`, "=", targetId);
						if (config?.type === "mysql") {
							const result = await query.executeTakeFirst();
							return Number(result.numDeletedRows) > 0 ? row : null;
						}
						if (config?.type === "mssql") return await query.outputAll("deleted").executeTakeFirst() ?? null;
						return await query.returningAll().executeTakeFirst() ?? null;
					};
					const deleteWithReturning = async (query) => {
						if (config?.type === "mssql") return await query.outputAll("deleted").executeTakeFirst() ?? null;
						return await query.returningAll().executeTakeFirst() ?? null;
					};
					if (config?.type === "mysql") {
						const claimFromTransaction = async (trx) => {
							const row = await applyWhere(trx.selectFrom(model).selectAll().forUpdate()).limit(1).executeTakeFirst();
							if (!row) return null;
							return deleteSelectedRow(trx, row);
						};
						return inTransaction ? claimFromTransaction(db) : db.transaction().execute(claimFromTransaction);
					}
					const selectIds = applyWhere(db.selectFrom(model).select(`${model}.${idField}`));
					const targetIds = config?.type === "mssql" ? selectIds.top(1) : selectIds.limit(1);
					return deleteWithReturning(db.deleteFrom(model).where(`${model}.${idField}`, "in", targetIds));
				},
				async incrementOne({ model, where, increment, set }) {
					const { and, or } = convertWhereClause(model, where);
					const applyWhere = (query) => {
						if (and) query = query.where((eb) => eb.and(and.map((expr) => expr(eb))));
						if (or) query = query.where((eb) => eb.or(or.map((expr) => expr(eb))));
						return query;
					};
					const assignments = { ...set ?? {} };
					for (const [field, delta] of Object.entries(increment)) assignments[field] = sql`${sql.ref(field)} + ${delta}`;
					const idField = getFieldName({
						model,
						field: "id"
					});
					if (config?.type === "mysql") {
						const incrementInTransaction = async (trx) => {
							const target = await applyWhere(trx.selectFrom(model).select(`${model}.${idField}`).forUpdate()).limit(1).executeTakeFirst();
							if (!target) return null;
							const targetId = target[idField] ?? target.id;
							if (targetId === void 0 || targetId === null) return null;
							const updated = await applyWhere(trx.updateTable(model).set(assignments)).where(`${model}.${idField}`, "=", targetId).executeTakeFirst();
							if (Number(updated.numUpdatedRows) === 0) return null;
							return await trx.selectFrom(model).selectAll().where(`${model}.${idField}`, "=", targetId).limit(1).executeTakeFirst() ?? null;
						};
						return inTransaction ? incrementInTransaction(db) : db.transaction().execute(incrementInTransaction);
					}
					const selectIds = applyWhere(db.selectFrom(model).select(`${model}.${idField}`));
					const targetIds = config?.type === "mssql" ? selectIds.top(1) : selectIds.limit(1);
					const updateQuery = applyWhere(db.updateTable(model).set(assignments)).where(`${model}.${idField}`, "in", targetIds);
					if (config?.type === "mssql") return await updateQuery.outputAll("inserted").executeTakeFirst() ?? null;
					return await updateQuery.returningAll().executeTakeFirst() ?? null;
				},
				options: config
			};
		};
	};
	let adapterOptions = null;
	adapterOptions = {
		config: {
			adapterId: "kysely",
			adapterName: "Kysely Adapter",
			usePlural: config?.usePlural,
			debugLogs: config?.debugLogs,
			supportsBooleans: config?.type === "sqlite" || config?.type === "mssql" || config?.type === "mysql" || !config?.type ? false : true,
			supportsDates: config?.type === "sqlite" || config?.type === "mssql" || !config?.type ? false : true,
			supportsJSON: config?.type === "postgres" ? true : false,
			supportsArrays: false,
			supportsUUIDs: config?.type === "postgres" ? true : false,
			transaction: config?.transaction ? (cb) => db.transaction().execute((trx) => {
				return cb(createAdapterFactory({
					config: {
						...adapterOptions.config,
						transaction: false
					},
					adapter: createCustomAdapter(trx, true)
				})(lazyOptions));
			}) : false
		},
		adapter: createCustomAdapter(db)
	};
	const adapter = createAdapterFactory(adapterOptions);
	return (options) => {
		lazyOptions = options;
		return adapter(options);
	};
};
//#endregion
//#region node_modules/@better-auth/kysely-adapter/dist/kysely-migration-tables-DFfmKhq-.mjs
/**
* Kysely's internal migration table names, mirrored as local constants.
*
* Kysely 0.29 moved these from its main entry to the `kysely/migration`
* subpath (which 0.28 lacks), and the main entry now exports only type stubs
* with no runtime value, which breaks strict ESM bundlers.
*
* The values are stable parts of Kysely's public migration contract. Mirroring
* them allows the SQLite dialects to support both Kysely 0.28 and 0.29.
*
* TODO: Import these from `kysely/migration` after dropping Kysely 0.28.
*/
var DEFAULT_MIGRATION_TABLE = "kysely_migration";
var DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
//#endregion
//#region node_modules/@better-auth/kysely-adapter/dist/bun-sqlite-dialect-C7ftEUSI.mjs
var bun_sqlite_dialect_C7ftEUSI_exports = /* @__PURE__ */ __exportAll({ BunSqliteDialect: () => BunSqliteDialect });
var BunSqliteAdapter = class {
	get supportsCreateIfNotExists() {
		return true;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock() {}
	async releaseMigrationLock() {}
	get supportsOutput() {
		return true;
	}
};
var BunSqliteDriver = class {
	#config;
	#connectionMutex = new ConnectionMutex$1();
	#db;
	#connection;
	constructor(config) {
		this.#config = { ...config };
	}
	async init() {
		this.#db = this.#config.database;
		this.#connection = new BunSqliteConnection(this.#db);
		if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
	}
	async acquireConnection() {
		await this.#connectionMutex.lock();
		return this.#connection;
	}
	async beginTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async releaseConnection() {
		this.#connectionMutex.unlock();
	}
	async destroy() {
		this.#db?.close();
	}
};
var BunSqliteConnection = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	executeQuery(compiledQuery) {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		const params = parameters;
		if (stmt.columnNames.length > 0) return Promise.resolve({ rows: stmt.all(...params) });
		const { changes, lastInsertRowid } = stmt.run(...params);
		return Promise.resolve({
			rows: [],
			numAffectedRows: BigInt(changes),
			insertId: typeof lastInsertRowid === "bigint" ? lastInsertRowid : BigInt(lastInsertRowid)
		});
	}
	async *streamQuery() {
		throw new Error("Streaming query is not supported by SQLite driver.");
	}
};
var ConnectionMutex$1 = class {
	#promise;
	#resolve;
	async lock() {
		while (this.#promise !== void 0) await this.#promise;
		this.#promise = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}
	unlock() {
		const resolve = this.#resolve;
		this.#promise = void 0;
		this.#resolve = void 0;
		resolve?.();
	}
};
var BunSqliteIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return [];
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		let query = this.#db.selectFrom("sqlite_schema").where("type", "=", "table").where("name", "not like", "sqlite_%").select("name").$castTo();
		if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
		const tables = await query.execute();
		return Promise.all(tables.map(({ name }) => this.#getTableMetadata(name)));
	}
	async getMetadata(options) {
		return { tables: await this.getTables(options) };
	}
	async #getTableMetadata(table) {
		const db = this.#db;
		const autoIncrementCol = (await db.selectFrom("sqlite_master").where("name", "=", table).select("sql").$castTo().execute())[0]?.sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
		return {
			name: table,
			columns: (await db.selectFrom(sql`pragma_table_info(${table})`.as("table_info")).select([
				"name",
				"type",
				"notnull",
				"dflt_value"
			]).execute()).map((col) => ({
				name: col.name,
				dataType: col.type,
				isNullable: !col.notnull,
				isAutoIncrementing: col.name === autoIncrementCol,
				hasDefaultValue: col.dflt_value != null
			})),
			isView: false
		};
	}
};
var BunSqliteQueryCompiler = class extends DefaultQueryCompiler {
	getCurrentParameterPlaceholder() {
		return "?";
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getAutoIncrement() {
		return "autoincrement";
	}
};
var BunSqliteDialect = class {
	#config;
	constructor(config) {
		this.#config = { ...config };
	}
	createDriver() {
		return new BunSqliteDriver(this.#config);
	}
	createQueryCompiler() {
		return new BunSqliteQueryCompiler();
	}
	createAdapter() {
		return new BunSqliteAdapter();
	}
	createIntrospector(db) {
		return new BunSqliteIntrospector(db);
	}
};
//#endregion
//#region node_modules/@better-auth/kysely-adapter/dist/d1-sqlite-dialect-D4qp4-wW.mjs
var d1_sqlite_dialect_D4qp4_wW_exports = /* @__PURE__ */ __exportAll({
	D1SqliteDialect: () => D1SqliteDialect,
	createD1IndexIntrospector: () => createD1IndexIntrospector
});
function quoteSqliteStringLiteral(value) {
	return `'${value.replaceAll("'", "''")}'`;
}
function createD1IndexIntrospector(database) {
	return async (tableNames) => {
		if (tableNames.length === 0) return [];
		const indexes = (await database.batch(tableNames.map((tableName) => database.prepare(`PRAGMA index_list(${quoteSqliteStringLiteral(tableName)})`)))).flatMap((indexList, tablePosition) => {
			const tableName = tableNames[tablePosition];
			if (!tableName) return [];
			return indexList.results.map((index) => ({
				...index,
				tableName
			}));
		});
		if (indexes.length === 0) return [];
		const indexColumns = await database.batch(indexes.map((index) => database.prepare(`PRAGMA index_info(${quoteSqliteStringLiteral(index.name)})`)));
		return indexes.map((index, indexPosition) => ({
			columns: (indexColumns[indexPosition]?.results ?? []).map((column) => ({
				fullLength: column.name !== null,
				name: column.name,
				position: column.seqno
			})),
			name: index.name,
			partial: index.partial !== 0,
			table: index.tableName,
			unique: index.unique !== 0,
			valid: true
		}));
	};
}
var D1SqliteAdapter = class extends SqliteAdapter {};
var D1SqliteDriver = class {
	#config;
	#connection;
	constructor(config) {
		this.#config = { ...config };
	}
	async init() {
		this.#connection = new D1SqliteConnection(this.#config.database);
		if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
	}
	async acquireConnection() {
		return this.#connection;
	}
	async beginTransaction() {
		throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
	}
	async commitTransaction() {
		throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
	}
	async rollbackTransaction() {
		throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
	}
	async releaseConnection() {}
	async destroy() {}
};
var D1SqliteConnection = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async executeQuery(compiledQuery) {
		const results = await this.#db.prepare(compiledQuery.sql).bind(...compiledQuery.parameters).all();
		const numAffectedRows = results.meta.changes != null ? BigInt(results.meta.changes) : void 0;
		return {
			insertId: results.meta.last_row_id === void 0 || results.meta.last_row_id === null ? void 0 : BigInt(results.meta.last_row_id),
			rows: results?.results || [],
			numAffectedRows
		};
	}
	async *streamQuery() {
		throw new Error("D1 does not support streaming queries.");
	}
};
var D1SqliteIntrospector = class {
	#db;
	#d1;
	constructor(db, d1) {
		this.#db = db;
		this.#d1 = d1;
	}
	async getSchemas() {
		return [];
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		let query = this.#db.selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").where("name", "not like", "_cf_%").select([
			"name",
			"type",
			"sql"
		]).$castTo();
		if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
		const tables = await query.execute();
		if (tables.length === 0) return [];
		const statements = tables.map((table) => this.#d1.prepare("SELECT * FROM pragma_table_info(?)").bind(table.name));
		const batchResults = await this.#d1.batch(statements);
		return tables.map((table, index) => {
			const columnInfo = batchResults[index]?.results ?? [];
			let autoIncrementCol = table.sql?.split(/[(),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.filter(Boolean)?.[0]?.replace(/["`]/g, "");
			if (!autoIncrementCol) {
				const pkCols = columnInfo.filter((r) => r.pk > 0);
				const singlePk = pkCols.length === 1 ? pkCols[0] : void 0;
				if (singlePk && singlePk.type.toLowerCase() === "integer") autoIncrementCol = singlePk.name;
			}
			return {
				name: table.name,
				isView: table.type === "view",
				columns: columnInfo.map((col) => ({
					name: col.name,
					dataType: col.type,
					isNullable: !col.notnull,
					isAutoIncrementing: col.name === autoIncrementCol,
					hasDefaultValue: col.dflt_value != null
				}))
			};
		});
	}
	async getMetadata(options) {
		return { tables: await this.getTables(options) };
	}
};
var D1SqliteQueryCompiler = class extends SqliteQueryCompiler {};
var D1SqliteDialect = class {
	#config;
	constructor(config) {
		this.#config = { ...config };
	}
	createDriver() {
		return new D1SqliteDriver(this.#config);
	}
	createQueryCompiler() {
		return new D1SqliteQueryCompiler();
	}
	createAdapter() {
		return new D1SqliteAdapter();
	}
	createIntrospector(db) {
		return new D1SqliteIntrospector(db, this.#config.database);
	}
};
//#endregion
//#region node_modules/@better-auth/kysely-adapter/dist/node-sqlite-dialect.mjs
var node_sqlite_dialect_exports = /* @__PURE__ */ __exportAll({ NodeSqliteDialect: () => NodeSqliteDialect });
var NodeSqliteAdapter = class {
	get supportsCreateIfNotExists() {
		return true;
	}
	get supportsTransactionalDdl() {
		return false;
	}
	get supportsReturning() {
		return true;
	}
	async acquireMigrationLock() {}
	async releaseMigrationLock() {}
	get supportsOutput() {
		return true;
	}
};
var NodeSqliteDriver = class {
	#config;
	#connectionMutex = new ConnectionMutex();
	#db;
	#connection;
	constructor(config) {
		this.#config = { ...config };
	}
	async init() {
		this.#db = this.#config.database;
		this.#connection = new NodeSqliteConnection(this.#db);
		if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
	}
	async acquireConnection() {
		await this.#connectionMutex.lock();
		return this.#connection;
	}
	async beginTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}
	async commitTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}
	async rollbackTransaction(connection) {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}
	async releaseConnection() {
		this.#connectionMutex.unlock();
	}
	async destroy() {
		this.#db?.close();
	}
};
var NodeSqliteConnection = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	executeQuery(compiledQuery) {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);
		const params = parameters;
		if (stmt.columns().length > 0) return Promise.resolve({ rows: stmt.all(...params) });
		const { changes, lastInsertRowid } = stmt.run(...params);
		return Promise.resolve({
			rows: [],
			numAffectedRows: BigInt(changes),
			insertId: typeof lastInsertRowid === "bigint" ? lastInsertRowid : BigInt(lastInsertRowid)
		});
	}
	async *streamQuery() {
		throw new Error("Streaming query is not supported by SQLite driver.");
	}
};
var ConnectionMutex = class {
	#promise;
	#resolve;
	async lock() {
		while (this.#promise !== void 0) await this.#promise;
		this.#promise = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}
	unlock() {
		const resolve = this.#resolve;
		this.#promise = void 0;
		this.#resolve = void 0;
		resolve?.();
	}
};
var NodeSqliteIntrospector = class {
	#db;
	constructor(db) {
		this.#db = db;
	}
	async getSchemas() {
		return [];
	}
	async getTables(options = { withInternalKyselyTables: false }) {
		let query = this.#db.selectFrom("sqlite_schema").where("type", "=", "table").where("name", "not like", "sqlite_%").select("name").$castTo();
		if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
		const tables = await query.execute();
		return Promise.all(tables.map(({ name }) => this.#getTableMetadata(name)));
	}
	async getMetadata(options) {
		return { tables: await this.getTables(options) };
	}
	async #getTableMetadata(table) {
		const db = this.#db;
		const autoIncrementCol = (await db.selectFrom("sqlite_master").where("name", "=", table).select("sql").$castTo().execute())[0]?.sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
		return {
			name: table,
			columns: (await db.selectFrom(sql`pragma_table_info(${table})`.as("table_info")).select([
				"name",
				"type",
				"notnull",
				"dflt_value"
			]).execute()).map((col) => ({
				name: col.name,
				dataType: col.type,
				isNullable: !col.notnull,
				isAutoIncrementing: col.name === autoIncrementCol,
				hasDefaultValue: col.dflt_value != null
			})),
			isView: false
		};
	}
};
var NodeSqliteQueryCompiler = class extends DefaultQueryCompiler {
	getCurrentParameterPlaceholder() {
		return "?";
	}
	getLeftIdentifierWrapper() {
		return "\"";
	}
	getRightIdentifierWrapper() {
		return "\"";
	}
	getAutoIncrement() {
		return "autoincrement";
	}
};
var NodeSqliteDialect = class {
	#config;
	constructor(config) {
		this.#config = { ...config };
	}
	createDriver() {
		return new NodeSqliteDriver(this.#config);
	}
	createQueryCompiler() {
		return new NodeSqliteQueryCompiler();
	}
	createAdapter() {
		return new NodeSqliteAdapter();
	}
	createIntrospector(db) {
		return new NodeSqliteIntrospector(db);
	}
};
//#endregion
export { sql as a, PostgresDialect as i, getKyselyDatabaseType as n, Kysely as o, kyselyAdapter as r, createKyselyAdapter as t };
