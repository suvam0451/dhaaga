class Util {
	private static toSnakeCase = (str: string) =>
		str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

	private static toCamelCase = (str: string) =>
		str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

	/**
	 * Recursively convert object keys to snake_case
	 * @param obj input object
	 */
	static snakeCaseKeys(obj: any): Object {
		if (!obj || typeof obj !== 'object') return obj;

		if (Array.isArray(obj)) return obj.map((item) => Util.snakeCaseKeys(item)); // Recursively handle each element in the array

		return Object.entries(obj)
			.filter(([k, v]) => v !== undefined)
			.reduce((acc: any, [key, value]) => {
				const newKey = Util.toSnakeCase(key);
				acc[newKey] =
					value && typeof value === 'object'
						? Util.snakeCaseKeys(value)
						: value;
				return acc;
			}, {});
	}

	static camelCaseKeys(obj: any): any {
		if (!obj || typeof obj !== 'object') return obj;

		if (Array.isArray(obj)) return obj.map((item) => Util.camelCaseKeys(item)); // Recursively handle each element in the array

		return Object.entries(obj)
			.filter(([k, v]) => v !== undefined)
			.reduce((acc: any, [key, value]) => {
				const newKey = Util.toCamelCase(key);
				acc[newKey] =
					value && typeof value === 'object'
						? Util.camelCaseKeys(value)
						: value;
				return acc;
			}, {});
	}
}

export { Util as CasingUtil };
