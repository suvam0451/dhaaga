import * as snakecaseKeys from 'snakecase-keys';

/**
 * ESM, smh
 */
export function toSnakeCase(obj: any) {
	if (!obj) return obj;

	// kill undefined
	Object.keys(obj).forEach((key) => {
		if (obj[key] === undefined) {
			delete obj[key];
		}
	});
	return snakecaseKeys.default(obj, { deep: true }) as Record<string, any>;
}
