import { deleteDatabaseSync, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import {
	account,
	account_Relations,
	accountHashtag_Relations,
	accountHashtags,
	accountMetadata,
	accountMetadata_Relations,
	accountSettings,
	appSettings,
} from './schema';

export const DATABASE_NAME = 'app.db';

export const schema = {
	account,
	account_Relations,
	accountHashtags,
	accountHashtag_Relations,
	accountMetadata,
	accountMetadata_Relations,
	accountSettings,
	appSettings,
};

/**
 * Returns the db client
 */
export function getStaticClient() {
	// return null;
	const expoDb = openDatabaseSync(DATABASE_NAME);

	return drizzle(expoDb, {
		schema,
	});
}

export function getLiveClient() {
	// return null;
	const expoDb = openDatabaseSync(DATABASE_NAME, {
		enableChangeListener: true,
	});

	return drizzle(expoDb, {
		schema,
	});
}

/**
 * Use this to reset the database
 *
 * Mke the above two functions
 * for this to work
 */
export function deleteDatabase() {
	deleteDatabaseSync(DATABASE_NAME);
}
