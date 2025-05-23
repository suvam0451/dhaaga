export type ExpoSqliteColumnDefinition = {
	cid: number;
	name: string;
	notnull: boolean;
	pk: boolean;
	type: 'INTEGER' | 'TEXT';
	dflt_value: null;
};

export const APP_DB = 'app.db';
