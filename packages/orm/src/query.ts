/**
 * ---- Operator overrides ----
 */

function eq(value: any) {
	return { operator: '=', operand: value };
}

function ne(value: any) {
	return { operator: '<>', operand: value };
}

function lt(value: any) {
	return { operator: '<', operand: value };
}

function lte(value: any) {
	return { operator: '<=', operand: value };
}

function gt(value: any) {
	return { operator: '>', operand: value };
}

function gte(value: any) {
	return { operator: '>=', operand: value };
}

/**
 * ----
 */

export { eq, ne, lt, gt, lte, gte };
