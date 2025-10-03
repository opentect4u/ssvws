// indexedDB.js
import { openDB } from "idb";

const DB_NAME = "MyAppDB";
const STORE_NAME = "reports";

// open DB with version and object store
export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

// set data
export async function setItem(key, value) {
  const db = await initDB();
  return db.put(STORE_NAME, value, key);
}

// get data
export async function getItem(key) {
  const db = await initDB();
  return db.get(STORE_NAME, key);
}

// delete data
export async function removeItem(key) {
  const db = await initDB();
  return db.delete(STORE_NAME, key);
}

// clear all
export async function clearAll() {
  const db = await initDB();
  return db.clear(STORE_NAME);
}
