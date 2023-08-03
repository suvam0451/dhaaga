import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

function openDatabase(dbName = "db.db") {
	if (Platform.OS === "web") {
		return {
			transaction: () => {
				return {
					executeSql: () => {},
				};
			},
		};
	}

	const db = SQLite.openDatabase(dbName);
	return db;
}

const db = openDatabase();
export default db;
