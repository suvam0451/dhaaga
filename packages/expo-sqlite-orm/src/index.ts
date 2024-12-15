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
	where?: IQueryWhere<{}>;
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

export class BaseEntity<T> {
	name: string;
	db: SQLiteDatabase;
	sql: string | null;
	params: SQLiteBindValue[];
	debug: boolean;
	whereClauses: string[];
	selectColumns: string[];

	constructor(db: SQLiteDatabase, debug: boolean = false) {
		this.db = db;
		this.name = this.getEntityName();
		this.params = [];
		this.sql = null;
		this.whereClauses = [];
		this.selectColumns = [];
		this.debug = debug;
		return this;
	}

	// Function to get the alternate name of the class (derived class)
	getEntityName(): string {
		return classNames.get(this.constructor)!;
	}

	static get<T>(db: SQLiteDatabase, debug: boolean = false): BaseEntity<T> {
		return new BaseEntity<T>(db, debug);
	}

	find() {}

	findOne() {}

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
		this.sql = null;
		this.params = [];
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
			id = (id as any)['id'];
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
		const vals = keys.map((o) => (data as any)[o]);

		this.sql = `INSERT INTO ${this.name} (${cols}) VALUES (${placeholders});`;
		this.params = vals;

		this.db.runSync(this.sql, this.params);
		return this;
	}
}
