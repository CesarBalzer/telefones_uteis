import { getDBConnection } from '../db/db-service';
import api from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const syncDatabase = async (setSyncStatus) => {
  try {
    setSyncStatus({ isSyncing: true, isSuccess: false, isError: false });

    const db = await getDBConnection();
    const lastSync = await getLastSyncTime(db);

    console.log(
      `🔄 Sincronizando dados com a API (Última sincronização: ${lastSync})...`
    );

    const response = await api.auth.fetchFromAPI({
      lastSync: lastSync,
      page: 1,
      perPage: 20,
    });

    if (!response.success) throw new Error('Erro na sincronização');

    const { data } = response;

    await updateLocalDatabase(db, data);

    await saveLastSyncTime(db);
    console.log('✅ Sincronização concluída com sucesso!');

    setSyncStatus({ isSyncing: false, isSuccess: true, isError: false });
  } catch (error) {
    console.log('❌ Erro na sincronização:', error);
    setSyncStatus({ isSyncing: false, isSuccess: false, isError: true });
  }
};

const getLastSyncTime = async (db) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT last_sync FROM sync_info WHERE id = 1;',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0).last_sync);
          } else {
            resolve('2024-01-01T00:00:00Z');
          }
        },
        (_, error) => {
          console.log('❌ Erro ao buscar last_sync:', error);
          resolve('2024-01-01T00:00:00Z');
        }
      );
    });
  });
};

const saveLastSyncTime = async (db) => {
  const now = new Date().toISOString();
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT OR REPLACE INTO sync_info (id, last_sync) VALUES (1, ?);',
      [now],
      () => console.log('✅ last_sync atualizado na tabela sync_info.'),
      (_, error) => console.log('❌ Erro ao atualizar last_sync:', error)
    );
  });
};

const chunkInsertPhones = async (
  db,
  phones,
  chunkSize = 200,
  delayMs = 500
) => {
  console.log(
    `🔄 Iniciando inserção em chunks (${chunkSize} registros por vez)...`
  );
  console.log(
    `🟢  Total de registros antes de inserir os phones => ${phones.length}`
  );

  for (let i = 0; i < phones.length; i += chunkSize) {
    const chunk = phones.slice(i, i + chunkSize);

    console.log(
      `📦 Inserindo chunk ${i / chunkSize + 1}... (${chunk.length} registros)`
    );

    await new Promise((resolve) => {
      db.transaction(
        (tx) => {
          chunk.forEach((item) => {
            tx.executeSql(
              `INSERT OR REPLACE INTO phones 
              (id, title, ddd, number, description, icon, active, category_id, contact_id, state_id, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              Object.values(item),
              () => {},
              (_, error) =>
                console.log(`❌ Erro ao inserir phone ID: ${item.id}`, error)
            );
          });
        },
        null,
        resolve
      );
    });

    console.log(`✅ Chunk ${i / chunkSize + 1} inserido com sucesso!`);

    if (i + chunkSize < phones.length) {
      await new Promise((res) => setTimeout(res, delayMs)); // 🔄 Aguarda antes de continuar
    }
  }

  console.log('🎉 Todos os chunks foram inseridos!');
};

const updateLocalDatabase = async (db, data) => {
  try {
    const tables = [
      { name: 'users', items: Array.isArray(data.users) ? data.users : [data.users], query: `INSERT OR REPLACE INTO users (id, name, email, email_verified_at, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)` },
      { name: 'states', items: data.states, query: `INSERT OR REPLACE INTO states (id, name, acronym, icon, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)` },
      { name: 'categories', items: data.categories, query: `INSERT OR REPLACE INTO categories (id, name, icon, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)` },
      { name: 'contacts', items: data.contacts, query: `INSERT OR REPLACE INTO contacts (id, record_id, given_name, family_name, middle_name, prefix, suffix, company, job_title, department, birthday, notes, thumbnail_path, is_public, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` },
      { name: 'contact_emails', items: data.contactEmails, query: `INSERT OR REPLACE INTO contact_emails (id, contact_id, email, label, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)` },
      { name: 'contact_addresses', items: data.contactAddresses, query: `INSERT OR REPLACE INTO contact_addresses (id, street, city, state, postal_code, country, label, contact_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` },
      { name: 'contact_ims', items: data.contactIMs, query: `INSERT OR REPLACE INTO contact_ims (id, im_service, im_username, contact_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)` },
      { name: 'user_favorites', items: data.userFavorites, query: `INSERT OR REPLACE INTO user_favorites (id, user_id, phone_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)` },
    ];

    for (const table of tables) {
      console.log(`🔄 Sincronizando tabela: ${table.name} (${table.items.length} registros)...`);

      for (const item of table.items) {
        try {
          await db.executeSql(table.query, Object.values(item));
        } catch (error) {
          console.log(`❌ Erro ao inserir em ${table.name}:`, error, '\nDADO:', JSON.stringify(item, null, 2));
        }
      }

      console.log(`✅ ${table.name} sincronizado com sucesso!`);
    }

    // 🛠 Executando inserção em chunks para evitar sobrecarga de memória
    if (data.phones && data.phones.length > 0) {
      await chunkInsertPhones(db, data.phones, 200, 500);
    }

    await db.transaction((tx) => {
      tx.executeSql('SELECT COUNT(*) AS total FROM phones;', [], (_, results) =>
        console.log(
          '📊 Total de registros em phones:',
          results.rows.item(0).total
        )
      );
    });

    console.log('🎉 Todos os dados foram sincronizados com o banco local!');

  } catch (error) {
    console.log('❌ Erro ao atualizar banco local:', error);
    throw error;
  }
};

