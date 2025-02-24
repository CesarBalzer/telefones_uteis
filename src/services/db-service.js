import { enablePromise, openDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase(
    'telefones_uteis.db',
    '2.0',
    'TelefonesUteis',
    200000,
    // { name: 'telefones_uteis.db', location: 'default' },
    () => {
      // console.log('✅ Banco de dados conectado!')
    },
    (error) => {
      console.log('❌ Erro ao conectar ao banco:', error);
      throw Error('Could not connect to database');
    }
  );
};

export const isDatabaseInitialized = async () => {
  try {
    const db = await getDBConnection();
    const [result] = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='user'"
    );
    return result.rows.length > 0;
  } catch (error) {
    console.log('Error checking database:', error);
    throw new Error('Failed to check database');
  }
};

export const createTables = async () => {
  const db = await getDBConnection();

  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      is_admin INTEGER DEFAULT 1,
      email_verified_at TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,

    `CREATE TABLE IF NOT EXISTS states (
      id INTEGER PRIMARY KEY,
      name TEXT,
      acronym TEXT UNIQUE,
      icon TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT,
      updated_at TEXT
    )`,

    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT,
      active INTEGER DEFAULT 1,
      icon TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,

    `CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY,
      record_id TEXT UNIQUE,
      given_name TEXT,
      family_name TEXT,
      middle_name TEXT,
      prefix TEXT,
      suffix TEXT,
      company TEXT,
      job_title TEXT,
      department TEXT,
      birthday TEXT,
      notes TEXT,
      thumbnail_path TEXT,
      is_public INTEGER DEFAULT 0, -- BOOLEANO (0 = false, 1 = true)
      user_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS phones (
      id INTEGER PRIMARY KEY,
      title TEXT,
      ddd TEXT,
      number TEXT,
      description TEXT,
      icon TEXT,
      active INTEGER DEFAULT 1,
      category_id INTEGER,
      contact_id INTEGER,
      state_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
      FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS contact_addresses (
      id INTEGER PRIMARY KEY,
      street TEXT,
      city TEXT,
      state TEXT,
      postal_code TEXT,
      country TEXT,
      label TEXT,
      contact_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS contact_emails (
      id INTEGER PRIMARY KEY,
      contact_id INTEGER,
      email TEXT UNIQUE,
      label TEXT,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS contact_ims (
      id INTEGER PRIMARY KEY,
      im_service TEXT,
      im_username TEXT,
      contact_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS user_favorites (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      phone_id INTEGER,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (phone_id) REFERENCES phones(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS sync_info (
      id INTEGER PRIMARY KEY DEFAULT 1,
      last_sync TEXT,
      previous_sync TEXT
    )`,
  ];

  try {
    await Promise.all(queries.map((query) => db.executeSql(query)));
    // console.log('✅ Tabelas criadas com sucesso!');
  } catch (error) {
    console.log('❌ Erro ao criar tabelas:', error);
  }
};
