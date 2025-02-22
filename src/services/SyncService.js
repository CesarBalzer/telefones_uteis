import { getDBConnection } from '../db/db-service';
import api from '../../api';

const getLastSyncTimes = async (db) => {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT last_sync, previous_sync FROM sync_info WHERE id = 1;',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve({
              lastSync:
                results.rows.item(0).last_sync || '2024-01-01T00:00:00Z',
              previousSync:
                results.rows.item(0).previous_sync || '2024-01-01T00:00:00Z',
            });
          } else {
            resolve({
              lastSync: '2024-01-01T00:00:00Z',
              previousSync: '2024-01-01T00:00:00Z',
            });
          }
        },
        (_, error) => {
          console.log('❌ Erro ao buscar sincronizações:', error);
          resolve({
            lastSync: '2024-01-01T00:00:00Z',
            previousSync: '2024-01-01T00:00:00Z',
          });
        }
      );
    });
  });
};

const saveLastSyncTime = async (db, lastSync, previousSync) => {
  const newSyncTime = new Date().toISOString();

  console.log(`📅 Penúltima sincronização salva no banco: ${previousSync}`);
  console.log(`📅 Última sincronização salva no banco: ${lastSync}`);
  console.log(`📅 Nova sincronização agora sendo salva: ${newSyncTime}`);

  db.transaction((tx) => {
    tx.executeSql(
      'INSERT OR REPLACE INTO sync_info (id, last_sync, previous_sync) VALUES (1, ?, ?);',
      [newSyncTime, lastSync],
      () =>
        console.log(
          '✅ LAST_SYNC e PREVIOUS_SYNC atualizados na tabela sync_info.'
        ),
      (_, error) => console.log('❌ Erro ao atualizar LAST_SYNC:', error)
    );
  });
};

export const syncDatabase = async (setSyncStatus) => {
  try {
    setSyncStatus({ isSyncing: true, isSuccess: false, isError: false });

    const db = await getDBConnection();
    const { lastSync, previousSync } = await getLastSyncTimes(db);

    console.log(`🔄 Sincronizando dados com a API...`);
    console.log(`📅 Última sincronização: ${lastSync}`);
    console.log(`📅 Penúltima sincronização: ${previousSync}`);

    const response = await api.auth.fetchFromAPI({
      lastSync: lastSync,
      page: 1,
      perPage: 20,
    });

    if (!response.success) throw new Error('Erro na sincronização');

    const { data } = response;

    await updateLocalDatabase(db, data);
    await saveLastSyncTime(db, lastSync, previousSync); // Salva a última e a penúltima sincronização no banco

    console.log('✅ Sincronização concluída com sucesso!');
    setSyncStatus({ isSyncing: false, isSuccess: true, isError: false });
  } catch (error) {
    console.log('❌ Erro na sincronização:', error);
    setSyncStatus({ isSyncing: false, isSuccess: false, isError: true });
  }
};

const chunkInsertContacts = async (
  db,
  contacts,
  chunkSize = 100,
  delayMs = 300
) => {
  console.log(
    `🔄 Iniciando inserção de contatos em chunks (${chunkSize} registros por vez)...`
  );

  let totalContactsInserted = 0;
  let totalPhonesInserted = 0;
  let totalEmailsInserted = 0;
  let totalAddressesInserted = 0;
  let totalSocialsInserted = 0;
  let totalFavoritesInserted = 0;

  for (let i = 0; i < contacts.length; i += chunkSize) {
    const chunk = contacts.slice(i, i + chunkSize);
    console.log(
      `📦 Inserindo chunk ${i / chunkSize + 1}... (${chunk.length} contatos)`
    );

    await new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          chunk.forEach((contact) => {
            // Inserir Contato
            tx.executeSql(
              `INSERT OR REPLACE INTO contacts 
              (id, record_id, given_name, family_name, middle_name, prefix, suffix, company, job_title, department, birthday, notes, thumbnail_path, is_public, user_id, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                contact.id || null,
                contact.record_id || '',
                contact.given_name || '',
                contact.family_name || '',
                contact.middle_name || '',
                contact.prefix || '',
                contact.suffix || '',
                contact.company || '',
                contact.job_title || '',
                contact.department || '',
                contact.birthday || '',
                contact.notes || '',
                contact.thumbnail_path || '',
                contact.is_public ? 1 : 0,
                contact.user_id || null,
                contact.created_at || new Date().toISOString(),
                contact.updated_at || new Date().toISOString(),
              ],
              () => {
                totalContactsInserted++;
              },
              (_, error) => {
                console.log(
                  `❌ Erro ao inserir contato ID: ${contact.id}`,
                  error
                );
              }
            );

            // Inserir Telefones
            if (contact.phones) {
              contact.phones.forEach((phone) => {
                tx.executeSql(
                  `INSERT OR REPLACE INTO phones 
                  (id, title, ddd, number, description, icon, active, category_id, contact_id, state_id, created_at, updated_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    phone.id || null,
                    phone.title || '',
                    phone.ddd || '',
                    phone.number || '',
                    phone.description || '',
                    phone.icon || '',
                    phone.active ? 1 : 0,
                    phone.category_id || null,
                    contact.id || null,
                    phone.state_id || null,
                    phone.created_at || new Date().toISOString(),
                    phone.updated_at || new Date().toISOString(),
                  ],
                  () => {
                    totalPhonesInserted++;
                  },
                  (_, error) =>
                    console.log(
                      `❌ Erro ao inserir telefone ID: ${phone.id}`,
                      error
                    )
                );
              });
            }

            // Inserir E-mails
            if (contact.emails) {
              contact.emails.forEach((email) => {
                tx.executeSql(
                  `INSERT OR REPLACE INTO contact_emails (id, contact_id, email, label, created_at, updated_at) 
                   VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    email.id || null,
                    contact.id || null,
                    email.email || '',
                    email.label || '',
                    email.created_at || new Date().toISOString(),
                    email.updated_at || new Date().toISOString(),
                  ],
                  () => {
                    totalEmailsInserted++;
                  },
                  (_, error) =>
                    console.log(
                      `❌ Erro ao inserir email ID: ${email.id}`,
                      error
                    )
                );
              });
            }

            // Inserir Endereços
            if (contact.addresses) {
              contact.addresses.forEach((address) => {
                tx.executeSql(
                  `INSERT OR REPLACE INTO contact_addresses (id, street, city, state, postal_code, country, label, contact_id, created_at, updated_at) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    address.id || null,
                    address.street || '',
                    address.city || '',
                    address.state || '',
                    address.postal_code || '',
                    address.country || '',
                    address.label || '',
                    contact.id || null,
                    address.created_at || new Date().toISOString(),
                    address.updated_at || new Date().toISOString(),
                  ],
                  () => {
                    totalAddressesInserted++;
                  },
                  (_, error) =>
                    console.log(
                      `❌ Erro ao inserir endereço ID: ${address.id}`,
                      error
                    )
                );
              });
            }

            // Inserir Redes Sociais (IMs)
            if (contact.socials) {
              contact.socials.forEach((im) => {
                tx.executeSql(
                  `INSERT OR REPLACE INTO contact_ims (id, im_service, im_username, contact_id, created_at, updated_at) 
                   VALUES (?, ?, ?, ?, ?, ?)`,
                  [
                    im.id || null,
                    im.im_service || '',
                    im.im_username || '',
                    contact.id || null,
                    im.created_at || new Date().toISOString(),
                    im.updated_at || new Date().toISOString(),
                  ],
                  () => {
                    totalSocialsInserted++;
                  },
                  (_, error) =>
                    console.log(`❌ Erro ao inserir IM ID: ${im.id}`, error)
                );
              });
            }

            // Inserir Favoritos
            // if (contact.user_favorites) {
            //   contact.user_favorites.forEach((favorite) => {
            //     tx.executeSql(
            //       `INSERT OR REPLACE INTO user_favorites (id, user_id, phone_id, created_at, updated_at) 
            //        VALUES (?, ?, ?, ?, ?)`,
            //       [
            //         favorite.id || null,
            //         favorite.user_id || null,
            //         favorite.phone_id || null,
            //         favorite.created_at || new Date().toISOString(),
            //         favorite.updated_at || new Date().toISOString(),
            //       ],
            //       () => {
            //         totalFavoritesInserted++;
            //       },
            //       (_, error) =>
            //         console.log(
            //           `❌ Erro ao inserir favorito ID: ${favorite.id}`,
            //           error
            //         )
            //     );
            //   });
            // }
          });
        },
        (error) => {
          console.log(
            `❌ Erro na transação do chunk ${i / chunkSize + 1}:`,
            error
          );
          reject(error);
        },
        resolve
      );
    });

    console.log(`✅ Chunk ${i / chunkSize + 1} inserido com sucesso!`);

    if (i + chunkSize < contacts.length) {
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  console.log(`🎉 Inserção finalizada!`);
  console.log(`📊 Total de contatos inseridos: ${totalContactsInserted}`);
  console.log(`📊 Total de telefones inseridos: ${totalPhonesInserted}`);
  console.log(`📊 Total de emails inseridos: ${totalEmailsInserted}`);
  console.log(`📊 Total de endereços inseridos: ${totalAddressesInserted}`);
  console.log(`📊 Total de redes sociais inseridas: ${totalSocialsInserted}`);
  console.log(`📊 Total de favoritos inseridos: ${totalFavoritesInserted}`);
};

const updateLocalDatabase = async (db, data) => {
  try {
    const tables = [
      {
        name: 'users',
        items: Array.isArray(data.users) ? data.users : [data.users],
        query: `INSERT OR REPLACE INTO users (id, name, email, is_admin, email_verified_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      },
      {
        name: 'states',
        items: Array.isArray(data.states) ? data.states : [],
        query: `INSERT OR REPLACE INTO states (id, name, acronym, icon, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      },
      {
        name: 'categories',
        items: Array.isArray(data.categories) ? data.categories : [],
        query: `INSERT OR REPLACE INTO categories (id, name, active, icon, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
      },
      {
        name: 'user_favorites',
        items: Array.isArray(data.user_favorites) ? data.user_favorites : [],
        query: `INSERT OR REPLACE INTO user_favorites (id, user_id, phone_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      },
    ];

    for (const table of tables) {
      console.log(
        `🔄 Sincronizando tabela: ${table.name} (${table.items.length} registros)...`
      );

      for (const item of table.items) {
        try {
          await db.executeSql(table.query, Object.values(item));
        } catch (error) {
          console.log(
            `❌ Erro ao inserir em ${table.name}:`,
            error,
            '\nDADO:',
            JSON.stringify(item, null, 2)
          );
        }
      }

      console.log(`✅ ${table.name} sincronizado com sucesso!`);
    }

    if (
      data.contacts &&
      Array.isArray(data.contacts) &&
      data.contacts.length > 0
    ) {
      await chunkInsertContacts(db, data.contacts, 100, 300);
    } else {
      console.log('⚠️ Nenhum contato para sincronizar.');
    }

    console.log('🎉 Todos os dados foram sincronizados com o banco local!');
  } catch (error) {
    console.log('❌ Erro ao atualizar banco local:', error);
    throw error;
  }
};
