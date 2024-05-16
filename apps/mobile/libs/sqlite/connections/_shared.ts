import * as SQLite from "expo-sqlite";

export function openDatabase(dbName = "db.activitypub") {
  // What is the new way to do this?
  // if (Platform.OS === "web") {
  //   return {
  //     transaction: () => {
  //       return {
  //         executeSql: () => {
  //         },
  //       };
  //     },
  //   };
  // }

  const db = SQLite.openDatabaseSync(dbName);
  db.execSync("PRAGMA foreign_keys = ON;");
  return db;
}
