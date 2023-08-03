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
	// once per connection
	db.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () => {
		// console.log("Foreign keys turned on");
	});

	return db;
}

const db = openDatabase();
export default db;
