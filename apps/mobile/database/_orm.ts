import { SQLiteBindValue, SQLiteDatabase } from 'expo-sqlite';

export function insert<T = {}>(
	entity: string,
	body: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
) {
	const keys = Object.keys(body);
	const columns = keys.join(', ');
	const values = keys.map(() => '?').join(', ');

	return `INSERT INTO ${entity} (${columns}) VALUES (${values});`;
}

export type IQueryOperationSingleValue =
	| 'eq'
	| 'ne'
	| 'lt'
	| 'lte'
	| 'gt'
	| 'gte'
	| 'contains';
export type IQueryOperationMultipleValue = 'in' | 'notIn';
export type IQueryOperation = IQueryOperationSingleValue &
	IQueryOperationMultipleValue;

export type IQueryWhere<T extends {} = {}> = {
	[P in keyof T]?:
		| T[P]
		| (Partial<Record<IQueryOperationSingleValue, T[P]>> &
				Partial<Record<IQueryOperationMultipleValue, T[P][]>>);
};

export type IQueryOrderBy<T = {}> = {
	[P in keyof T]?: 'asc' | 'desc';
};

export interface QueryType<T> {
	columns?: (keyof T | '*')[];
	page?: number;
	limit?: number;
	where?: IQueryWhere<T>;
	order?: IQueryOrderBy<T>;
}

/**
 * ------ Typescript Sorcery ------
 */

type ClassPropList<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type OnlyClassProps<T> = Pick<T, ClassPropList<T>>;

/**
 * --------------------------------
 */

/**
 * ------ Decorator Sorcery ------
 */

const classNames = new Map<any, string>();

// Class decorator to store alternate name
export function Entity(name: string) {
	return function (target: Function) {
		classNames.set(target, name);
	};
}

type BaseEntityInternalPropList =
	| 'db'
	| 'sql'
	| 'params'
	| 'debug'
	| 'whereClauses'
	| 'selectColumns';

class QueryStringBuilder {
	private static serialize(value: any) {
		let val: string;
		if (typeof value === 'string') {
			// Escape single quotes in strings for safety
			val = `'${value.replace("'", "''")}'`;
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
		if (value['operator']) {
			return [
				`${key} ${value['operator']} ?`,
				this.serialize(value['operand']),
			];
		}
		return [`${key} = ${this.serialize(value)}`];
	}

	static where(data: any) {
		const clauses = [];
		const params = [];
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
}

/**
 * ---- Operator overrides ----
 */

export function eq(value: any) {
	return { operator: '=', operand: value };
}

export function ne(value: any) {
	return { operator: '<>', operand: value };
}

export function lt(value: any) {
	return { operator: '<', operand: value };
}

export function lte(value: any) {
	return { operator: '<=', operand: value };
}

export function gt(value: any) {
	return { operator: '>', operand: value };
}

export function gte(value: any) {
	return { operator: '>=', operand: value };
}

/**
 * ----
 */

export class BaseEntity<T> {
	name: string;
	db: SQLiteDatabase;
	sql: string;
	params: SQLiteBindValue[];
	debug: boolean;
	whereClauses: string[];
	selectColumns: string[];

	constructor(db: SQLiteDatabase, debug: boolean = false) {
		this.db = db;
		this.name = this.getEntityName();
		this.debug = debug;
		return this;
	}

	// Function to get the alternate name of the class (derived class)
	getEntityName(): string | undefined {
		return classNames.get(this.constructor);
	}

	static get<T>(db: SQLiteDatabase, debug: boolean = false): BaseEntity<T> {
		return new BaseEntity<T>(db, debug);
	}

	/**
	 * Find multiple records matching query
	 */
	find(data?: OnlyClassProps<Partial<T>>): T[] {
		try {
			const { params, clauses } = QueryStringBuilder.where(data);
			this.sql = QueryStringBuilder.find(this.name, clauses);
			return this.db.getAllSync<T>(this.sql, params) as T[];
		} catch (e) {
			console.log('[ERROR]: db find query', this.name, e);
		}
	}

	/**
	 * Find first record matching query
	 */
	findOne(data: OnlyClassProps<Partial<T>>): T | null {
		try {
			const { params, clauses } = QueryStringBuilder.where(data);
			this.sql = QueryStringBuilder.findOne(this.name, clauses);
			return this.db.getFirstSync<T>(this.sql, params) as T;
		} catch (e) {
			console.log('[ERROR]: db findOne query', this.name, e);
		}
	}

	update(
		where: OnlyClassProps<Partial<T>>,
		update: OnlyClassProps<Partial<T>>,
	) {
		try {
			this.params.push();
			const { clauses: whereClauses, params: whereParams } =
				QueryStringBuilder.where(where);
			const { clauses: setClauses, params: setParams } =
				QueryStringBuilder.where(update);
			this.sql = QueryStringBuilder.update(this.name, whereClauses, setClauses);
			return this.db.runSync(this.sql, [...setParams, ...whereParams]);
		} catch (e) {}
	}

	getOne() {
		const generated = [];

		// Start with SELECT statement
		generated.push(
			`SELECT ${this.selectColumns.length ? this.selectColumns.join(', ') : '*'} FROM ${this.name}`,
		);

		// Add WHERE clause if present
		if (this.whereClauses.length) {
			generated.push(`WHERE ${this.whereClauses.join(' AND ')}`);
		}
		this.sql = generated.join(' ');
		this.db.getFirstSync(this.sql, this.params);
	}

	clearPreviousQuery() {
		this.sql = undefined;
		this.params = undefined;
	}

	getMany() {}

	// Add WHERE clause
	where(clause: string): this {
		this.whereClauses.push(clause);
		return this;
	}

	// Add WHERE clause
	andWhere(clause: string): this {
		this.whereClauses.push(clause);
		return this;
	}

	/**
	 *	add a new database record
	 */
	insert(
		data: Omit<OnlyClassProps<Partial<T>>, 'id' | 'createdAt' | 'updatedAt'>,
	) {
		const keys = Object.keys(data);
		const cols = keys.join(', ');
		const vals = keys.map(() => '?').join(', ');
		return `INSERT INTO ${this.name} (${cols}) VALUES (${vals});`;
	}

	/**
	 *
	 * @param id numeric id, or entity instance
	 * @param data
	 */
	updateById(
		id: string | number | T,
		data: Omit<
			OnlyClassProps<Partial<T>>,
			'id' | 'createdAt' | 'updatedAt' | BaseEntityInternalPropList
		>,
	) {
		if (id instanceof BaseEntity) {
			id = (id as T)['id'];
		}

		this.save({
			id: id as number,
			...data,
		} as any);
	}

	/**
	 * 	updates a record (when id provided)
	 *
	 *	inserts a record (when id not provided)
	 */
	save(
		data: Omit<
			OnlyClassProps<Partial<T>>,
			'createdAt' | 'updatedAt' | BaseEntityInternalPropList
		>,
	) {
		const keys = Object.keys(data);
		const cols = keys.join(', ');
		const placeholders = keys.map(() => '?').join(', ');
		const vals = keys.map((o) => data[o]);

		this.sql = `INSERT INTO ${this.name} (${cols}) VALUES (${placeholders});`;
		this.params = vals;

		this.db.runSync(this.sql, this.params);
		return this;
	}
}

@Entity('account')
export class Account extends BaseEntity<Account> {
	id: number;
	identifier: string;
	driver: string;
	server: string;
	username: string;
	selected: boolean;
	displayName?: string;
	avatarUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

const x = new Account({} as any);

const statement = insert<Account>('account', {});
