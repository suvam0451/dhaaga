import * as snakecaseKeys from 'snakecase-keys';

export function toSnakeCase(obj: any) {
	return snakecaseKeys.default(obj, { deep: true }) as Record<string, any>;
}
