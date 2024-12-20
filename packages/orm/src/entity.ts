import { SQLiteBindValue, SQLiteDatabase } from 'expo-sqlite';
import { QueryResolver } from './resolver.js';

type BaseType = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
};

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

type BaseEntityInternalPropList =
	| '_name'
	| 'db'
	| 'sql'
	| 'params'
	| 'debug'
	| 'whereClauses'
	| 'selectColumns';

const classNames = new Map<any, string>();

// Class decorator to store alternate name
export function Entity(name: string) {
	return function (target: Function) {
		classNames.set(target, name);
	};
}

export class BaseEntity<T extends BaseType> {
	_name: string;
	db: SQLiteDatabase;
	sql: string | null;
	params: SQLiteBindValue[];
	debug: boolean;
	whereClauses: string[];
	selectColumns: string[];

	id: number | undefined;
	createdAt: Date;
	updatedAt: Date;

	constructor(db: SQLiteDatabase, debug: boolean = false) {
		this.db = db;
		this._name = this.getEntityName()!;
		this.whereClauses = [];
		this.selectColumns = [];
		this.sql = null;
		this.params = [];
		this.debug = debug;

		this.id = undefined;
		this.createdAt = new Date();
		this.updatedAt = new Date();
		return this;
	}

	// Function to get the alternate name of the class (derived class)
	getEntityName(): string | undefined {
		return classNames.get(this.constructor);
	}

	static get<T extends BaseType>(
		db: SQLiteDatabase,
		debug: boolean = false,
	): BaseEntity<T> {
		return new BaseEntity<T>(db, debug);
	}

	/**
	 * Find multiple records matching query
	 */
	find(data?: OnlyClassProps<Partial<T>>): T[] {
		try {
			const { params, clauses } = QueryResolver.where(data);
			this.sql = QueryResolver.find(this._name, clauses);
			return this.db.getAllSync<T>(this.sql, params) as T[];
		} catch (e) {
			console.log('[ERROR]: db find query', this._name, e);
			return [];
		}
	}

	/**
	 * Find first record matching query
	 */
	findOne(data: OnlyClassProps<Partial<T>>): T | null {
		try {
			const { params, clauses } = QueryResolver.where(data);
			this.sql = QueryResolver.findOne(this._name, clauses);
			return this.db.getFirstSync<T>(this.sql, params) as T;
		} catch (e) {
			console.log('[ERROR]: db findOne query', this._name, e);
			return null;
		}
	}

	update(
		where: OnlyClassProps<Partial<T>>,
		update: OnlyClassProps<Partial<T>>,
	) {
		try {
			this.params.push();
			const { clauses: whereClauses, params: whereParams } =
				QueryResolver.where(where);
			const { clauses: setClauses, params: setParams } =
				QueryResolver.where(update);
			this.sql = QueryResolver.update(this._name, whereClauses, setClauses);
			return this.db.runSync(this.sql, [...setParams, ...whereParams]);
		} catch (e) {}
	}

	getOne() {
		const generated = [];

		// Start with SELECT statement
		generated.push(
			`SELECT ${this.selectColumns.length ? this.selectColumns.join(', ') : '*'} FROM ${this._name}`,
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
		data: Omit<
			OnlyClassProps<Partial<T>>,
			'id' | 'createdAt' | 'updatedAt' | BaseEntityInternalPropList
		>,
	) {
		try {
			const keys = Object.keys(data);
			const cols = keys.join(', ');
			const vals = keys.map(() => '?').join(', ');
			this.sql = `INSERT INTO ${this._name} (${cols}) VALUES (${vals});`;

			this.params = keys.map((o: any) => (data as any)[o]);

			this.db.runSync(this.sql, this.params);
		} catch (e) {
			console.log(`[ERROR]: inserting into ${this._name}`, e);
		}
	}

	/**
	 * Update an entity by id
	 * @param id numeric id, or entity instance
	 * @param update
	 */
	updateById(
		id: string | number | T,
		update: Omit<
			OnlyClassProps<Partial<T>>,
			'id' | 'createdAt' | 'updatedAt' | BaseEntityInternalPropList
		>,
	) {
		// @ts-ignore-next-line
		if (id instanceof BaseEntity) {
			id = (id as T).id;
		}

		try {
			this.params.push();
			const { clauses: setClauses, params: setParams } =
				QueryResolver.where(update);
			this.sql = QueryResolver.updateById(this._name, setClauses);
			return this.db.runSync(this.sql, [...setParams, id as number]);
		} catch (e) {
			console.log('[WARN]: failed to update by id', e);
		}
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
		const vals = keys.map((o: any) => (data as any)[o]);

		this.sql = `INSERT INTO ${this._name} (${cols}) VALUES (${placeholders});`;
		this.params = vals;

		this.db.runSync(this.sql, this.params);
		return this;
	}
}
