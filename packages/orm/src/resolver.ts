export class QueryResolver {
	private static serialize(value: any) {
		let val: string;
		if (typeof value === 'string') {
			val = `${value.replace("'", "''")}`;
		} else if (value === null || value === undefined) {
			val = 'NULL';
		} else {
			val = String(value);
		}
		return val;
	}

	/**
	 *	resolves eq/ne/gt/gte/le/lte
	 */
	private static serializeOperation(key: string, value: any) {
		if (value === null || value === undefined) {
			return [`${key} = ?`, 'NULL'];
		}
		if (value['operator']) {
			return [
				`${key} ${value['operator']} ?`,
				this.serialize(value['operand']),
			];
		}
		// booleans
		if (typeof value === 'boolean') {
			if (value) {
				return [`${key} = ?`, '1'];
			} else {
				return [`${key} = ?`, '0'];
			}
		}
		return [`${key} = ?`, this.serialize(value)];
	}

	static where(data: any) {
		const clauses: string[] = [];
		const params: string[] = [];
		if (!data)
			return {
				clauses,
				params,
			};

		for (const [key, value] of Object.entries(data)) {
			const [clause, param] = this.serializeOperation(key, value);
			params.push(param);
			clauses.push(clause);
		}
		return { clauses, params };
	}

	static findOne(dbName: string, whereQueries: string[]) {
		const whereSql =
			whereQueries.length > 0 ? `WHERE (${whereQueries.join(' AND ')})` : '';
		return `SELECT * FROM ${dbName} ${whereSql} LIMIT 1`;
	}

	static find(dbName: string, whereQueries: string[]) {
		const whereSql =
			whereQueries.length > 0 ? `WHERE (${whereQueries.join(' AND ')})` : '';
		return `SELECT * FROM ${dbName} ${whereSql}`;
	}

	static update(
		dbName: string,
		whereQueries: string[],
		updateQueries: string[],
	) {
		const whereSql =
			whereQueries.length > 0 ? `WHERE (${whereQueries.join(' AND ')})` : '';
		const setSql =
			updateQueries.length > 0 ? `SET ${updateQueries.join(', ')}` : '';
		return `UPDATE ${dbName} ${setSql} ${whereSql} `;
	}

	static updateById(dbName: string, updateQueries: string[]) {
		const setSql =
			updateQueries.length > 0 ? `SET ${updateQueries.join(', ')}` : '';
		return `UPDATE ${dbName} ${setSql} WHERE id = ? `;
	}
}
