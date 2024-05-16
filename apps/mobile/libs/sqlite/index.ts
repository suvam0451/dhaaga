import {Platform} from "react-native";
import * as SQLite from "expo-sqlite";

async function openDatabase(dbName = "db.db") {
	if (Platform.OS === "web") {
		return {
			transaction: () => {
				return {
					executeSql: () => {},
				};
			},
		};
	}

	return await SQLite.openDatabaseAsync(dbName);
}

const db = openDatabase();
