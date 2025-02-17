import { enablePromise, openDatabase } from 'react-native-sqlite-storage';
import CategoriesMock from '../data/CategoriesMock';
import StatesMock from '../data/StatesMock';
import PhonesMock from '../data/PhonesMock';
enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase(
    { name: 'telefones_uteis.db', location: 'default' },
    (res) => {},
    (error) => {
      console.error(error);
      throw Error('Could not connect to database');
    }
  );
};

export const isDatabaseInitialized = async () => {
  try {
    // console.log('Checking if database is initialized...');
    const db = await getDBConnection();
    // console.log('Database connection:', db);
    const [result] = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='user'"
    );
    // console.log('Query result:', result);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking database:', error);
    throw new Error('Failed to check database');
  }
};

const createTables = async (db, queries) => {
  for (const query of queries) {
    try {
      await db.executeSql(query);
    } catch (error) {
      console.error('Error executing query:', query, error);
      throw new Error(`Failed to execute query: ${query}`);
    }
  }
};

export const populateTables = async () => {
  const db = await getDBConnection();

  const queries = await createTablesQueries(db);
  await createTables(db, queries);

  try {
    await populateCategories(db, CategoriesMock);
    await populateStates(db, StatesMock);
    await populatePhones(db, PhonesMock);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to populate tables');
  }
};

const populateCategories = async (db, categories) => {
  for (const category of categories) {
    const { name, active, icon } = category;
    await db.executeSql(
      'INSERT INTO category (name, active, icon) VALUES (?, ?, ?)',
      [name, active, icon]
    );
  }
};

const populateStates = async (db, states) => {
  for (const state of states) {
    const { name, acronym, icon } = state;
    await db.executeSql(
      'INSERT INTO state (name, acronym, icon) VALUES (?, ?, ?)',
      [name, acronym, icon]
    );
  }
};

const populatePhones = async (db, phones) => {
  for (const phone of phones) {
    const {
      title,
      number,
      description,
      icon,
      active,
      favored,
      category_id,
      state_id,
    } = phone;
    await db.executeSql(
      'INSERT INTO phone (title, number, description, icon, active, favored, category_id, state_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, number, description, icon, active, favored, category_id, state_id]
    );
  }
};

export const createTablesQueries = async (db) => {
  const userTableQuery = `
    CREATE TABLE IF NOT EXISTS user(
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      birthday TEXT,
      password TEXT,
      state_id INTEGER,
      FOREIGN KEY (state_id) REFERENCES state(id)
    )
  `;

  const categoryTableQuery = `
    CREATE TABLE IF NOT EXISTS category(
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      active INTEGER DEFAULT 1,
      icon TEXT
    )
  `;

  const stateTableQuery = `
    CREATE TABLE IF NOT EXISTS state(
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      acronym TEXT,
      icon TEXT
    )
  `;

  const phoneTableQuery = `
    CREATE TABLE IF NOT EXISTS phone(
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      number TEXT,
      description TEXT,
      icon TEXT,
      active INTEGER DEFAULT 1,
      favored INTEGER DEFAULT 0,
      category_id INTEGER,
      state_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES category(id),
      FOREIGN KEY (state_id) REFERENCES state(id)
    )
  `;

  const contactTableQuery = `
    CREATE TABLE IF NOT EXISTS contact(
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      record_id TEXT,
      given_name TEXT,
      family_name TEXT,
      middle_name TEXT,
      prefix TEXT,
      suffix TEXT,
      company TEXT,
      job_title TEXT,
      department TEXT,
      email_addresses TEXT,
      phone_numbers TEXT,
      postal_addresses TEXT,
      birthday TEXT,
      im_addresses TEXT,
      is_starred INTEGER DEFAULT 0,
      thumbnail_path TEXT
    )
  `;

  return [
    userTableQuery,
    categoryTableQuery,
    stateTableQuery,
    phoneTableQuery,
    contactTableQuery,
  ];
};
