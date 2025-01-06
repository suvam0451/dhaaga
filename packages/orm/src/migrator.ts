/**
 * Helper functions to help write and run migrations
 *
 * Key design decisions:
 *
 * - all table names and column names will use camelCase
 * - all tables are strict, by default
 * - column PK will always be "id"
 * - all FK will always reference other tables via "id"
 * - there will always be createdAt/updatedAt
 * - FK constraints are always "ON DELETE CASCADE"
 */
import { BaseEntity } from './entity.js';

type SqliteTypes = 'text' | 'int' | 'float' | 'blob';
type SchemaValue = {
	pk: boolean;

	notNull: boolean;
	default?: string;
	type: SqliteTypes;

	fk: boolean;
	fkTo: string | null;
};

class ColumnInterface {
	ref: SchemaValue;

	constructor(type: SqliteTypes) {
		this.ref = {
			pk: false,
			fk: false,
			fkTo: null,
			notNull: false,
			default: undefined,
			type,
		};
	}

	notNull() {
		this.ref.notNull = true;
		return this;
	}

	pk() {
		this.ref.pk = true;
		return this;
	}

	fk(to: string) {
		this.ref.fk = true;
		this.ref.fkTo = to;
		return this;
	}

	default(val: string | number) {
		this.ref.default = val.toString();
		return this;
	}
}

export type SchemaType = Record<string, ColumnInterface>;

/**
 * helper function to generate sql for "CREATE TABLE"
 *
 * NOTE: please read design assumptions in _migrator.ts
 * @param name of the table
 * @param schema of the table
 */
function createTable(
	name: string | typeof BaseEntity,
	schema: SchemaType,
): string {
	let sql = `CREATE TABLE IF NOT EXISTS ${name} (`;

	let pkList: { key: string; type: SqliteTypes }[] = [];

	let fKList: { key: string; to: string }[] = [];

	for (const [key, val] of Object.entries(schema)) {
		if (val.ref.pk) {
			pkList.push({
				key,
				type: val.ref.type,
			});
		}
		if (val.ref.fk) {
			fKList.push({ key: key, to: val.ref.fkTo! });
		}
	}

	// handle primary keys
	for (const pk of pkList) {
		sql += `${pk.key} INTEGER PRIMARY KEY, `;
	}

	for (const [key, val] of Object.entries(schema)) {
		if (val.ref.pk || val.ref.fk) continue;

		switch (val.ref.type) {
			case 'text': {
				sql += `${key} TEXT`;
				break;
			}
			case 'int': {
				sql += `${key} INTEGER`;
				break;
			}
			case 'float': {
				sql += `${key} REAL`;
				break;
			}
			case 'blob': {
				sql += `${key} BLOB`;
				break;
			}
		}

		if (val.ref.notNull) {
			sql += ` NOT NULL`;
		}

		if (val.ref.default !== undefined) {
			sql += ` DEFAULT ${val.ref.default}`;
		}
		sql += ', ';
	}

	// handle foreign keys
	for (const fk of fKList) {
		sql += `${fk.key} INTEGER, `;
	}

	sql += `createdAt TEXT DEFAULT CURRENT_TIMESTAMP, `;
	sql += `updatedAt TEXT DEFAULT CURRENT_TIMESTAMP, `;

	for (const fk of fKList) {
		sql += `FOREIGN KEY (${fk.key}) REFERENCES ${fk.to} (id) ON DELETE CASCADE, `;
	}

	sql = sql.trimEnd().replace(/,$/, ''); // Trim spaces and remove trailing comma

	sql += `) STRICT;`;

	return sql;
}

function addColumn(
	tableName: string,
	columnName: string,
	dataType: SqliteTypes,
	notNull = false,
	defaultValue: string | number | null = null,
) {
	let type = dataType.toUpperCase();
	let q = `ALTER TABLE \'${tableName}\' ADD COLUMN \`${columnName}\` ${type}`;
	if (notNull) q += ` NOT NULL`;
	if (defaultValue) q += ` DEFAULT ${defaultValue.toString()}`;
	return q + ';';
}

function removeColumn(tableName: string, columnName: string) {
	return `ALTER TABLE \'${tableName}\' DROP COLUMN \'${columnName}\';`;
}

function dropTable(name: string): string {
	return `DROP TABLE IF EXISTS ${name};`;
}

const migrator = {
	text: () => new ColumnInterface('text'),
	int: () => new ColumnInterface('int'),
	float: () => new ColumnInterface('float'),
	blob: () => new ColumnInterface('blob'),
};

export { migrator, createTable, dropTable, addColumn, removeColumn };
