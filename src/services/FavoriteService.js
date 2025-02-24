import { getDBConnection } from './db-service';
import api from '../../api';

export const db = getDBConnection();

export const getFavorites = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM user_favorites',
        [],
        (_, results) => {
          const data = [];
          for (let i = 0; i < results.rows.length; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// 🔥 Obtém os favoritos da API e sincroniza com o banco local
export const syncFavoritesFromAPI = async () => {
  try {
    const db = await getDBConnection();
    const response = await api.auth.favorites();

    // console.log('📥 RESPONSE SYNC FAVORITES FROM API => ', response);

    if (!response.success) throw new Error('Erro ao buscar favoritos');

    const favorites = response.data;

    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        // 1️⃣ Limpa a tabela antes de atualizar
        tx.executeSql('DELETE FROM user_favorites;', [], (_, deleteResults) => {
          console.log(`🗑️ ${deleteResults.rowsAffected} favoritos deletados.`);

          // 2️⃣ Insere os novos favoritos
          favorites.forEach((item) => {
            tx.executeSql(
              `INSERT INTO user_favorites (id, user_id, phone_id, created_at, updated_at) 
               VALUES (?, ?, ?, ?, ?)`,
              [
                item.id,
                item.user_id,
                item.phone_id,
                item.created_at,
                item.updated_at,
              ],
              () =>{
                // console.log(`🤟 Favorito sincronizado: ${item.phone_id}`)
              },
              (_, error) => console.log('❌ Erro ao inserir favorito:', error)
            );
          });

          // console.log('✅ Favoritos sincronizados com sucesso!');
          resolve(true);
        });
      });
    });
  } catch (error) {
    console.log('❌ Erro ao sincronizar favoritos:', error);
    return false;
  }
};

// 🔥 Alterna o status de favorito chamando a API e sincronizando localmente
export const toggleFavorite = async (phoneId) => {
  // console.log('🔄 Alternando favorito - PHONE ID:', phoneId);

  try {
    // 1️⃣ Faz a requisição para a API

    const response = await api.auth.toggleFavored(phoneId);

    // console.log('✅ API Response:', response);

    if (response.status === 200 || response.status === 201) {
      // 2️⃣ Atualiza o banco local após a mudança na API
      const syncSuccess = await syncFavoritesFromAPI();

      if (syncSuccess) {
        // console.log(
        //   '🔄 Sincronização bem-sucedida! Retornando novo status:',
        //   response.status
        // );
        return response;
      } else {
        console.log(
          '❌ Falha ao sincronizar favoritos após atualização na API.'
        );
        return null;
      }
    } else {
      console.log('❌ Resposta inesperada da API:', response);
      return null;
    }
  } catch (error) {
    console.log('❌ Erro ao alternar favorito:', error);
    return null;
  }
};

// 🔥 Obtém os telefones favoritados pelo usuário a partir do banco local
export const getFavoritesByUserId = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDBConnection();

      db.transaction((tx) => {
        tx.executeSql(
          `
          SELECT uf.id as favorite_id, uf.created_at as favorite_created_at, uf.updated_at as favorite_updated_at,
                 u.id as user_id, u.name as user_name, u.email as user_email,
                 p.id as phone_id, p.title as phone_title, p.ddd, p.number,p.state_id, 
                 p.description as phone_description, p.icon as phone_icon,
                 c.id as contact_id, c.given_name, c.family_name, c.company, c.thumbnail_path
          FROM user_favorites uf
          JOIN users u ON uf.user_id = u.id
          JOIN phones p ON uf.phone_id = p.id
          LEFT JOIN contacts c ON p.contact_id = c.id
          WHERE uf.user_id = ?
          ORDER BY p.title ASC
          `,
          [userId],
          (_, results) => {
            // console.log(
            //   'Consulta executada com sucesso. Resultados:',
            //   results.rows.length
            // );

            if (results.rows.length === 0) {
              console.log('Nenhum favorito encontrado.');
              resolve([]);
              return;
            }

            const favorites = [];

            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              favorites.push({
                favorite_id: row.favorite_id,
                favorite_created_at: row.favorite_created_at,
                favorite_updated_at: row.favorite_updated_at,
                user: {
                  id: row.user_id,
                  name: row.user_name,
                  email: row.user_email,
                },
                phone: {
                  id: row.phone_id,
                  title: row.phone_title,
                  ddd: row.ddd,
                  number: row.number,
                  description: row.phone_description,
                  icon: row.phone_icon,
                },
                contact: row.contact_id
                  ? {
                      id: row.contact_id,
                      given_name: row.given_name,
                      family_name: row.family_name,
                      company: row.company,
                      thumbnail_path: row.thumbnail_path,
                    }
                  : null,
              });
            }

            // console.log('Favoritos estruturados:', favorites);
            resolve(favorites);
          },
          (_, error) => {
            console.log('Erro na consulta SQL:', error);
            reject(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log('Erro ao acessar o banco de dados:', error);
      reject(error);
    }
  });
};

export const getFavoritesByContactAndUserId = async (contactId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDBConnection();

      db.transaction((tx) => {
        tx.executeSql(
          `
          SELECT uf.id as favorite_id, uf.created_at as favorite_created_at, uf.updated_at as favorite_updated_at,
                 u.id as user_id, u.name as user_name, u.email as user_email,
                 p.id as phone_id, p.title as phone_title, p.ddd, p.number, 
                 p.description as phone_description, p.icon as phone_icon,
                 c.id as contact_id, c.given_name, c.family_name, c.company, c.thumbnail_path
          FROM user_favorites uf
          JOIN users u ON uf.user_id = u.id
          JOIN phones p ON uf.phone_id = p.id
          LEFT JOIN contacts c ON p.contact_id = c.id
          WHERE uf.user_id = ? AND p.contact_id = ?
          ORDER BY p.title ASC
          `,
          [userId, contactId],
          (_, results) => {
            // console.log(
            //   'Consulta executada com sucesso. Resultados:',
            //   results.rows.length
            // );

            if (results.rows.length === 0) {
              // console.log('Nenhum favorito encontrado.');
              resolve([]);
              return;
            }

            const favorites = [];

            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              favorites.push({
                favorite_id: row.favorite_id,
                favorite_created_at: row.favorite_created_at,
                favorite_updated_at: row.favorite_updated_at,
                user: {
                  id: row.user_id,
                  name: row.user_name,
                  email: row.user_email,
                },
                phone: {
                  id: row.phone_id,
                  title: row.phone_title,
                  ddd: row.ddd,
                  number: row.number,
                  description: row.phone_description,
                  icon: row.phone_icon,
                },
                contact: row.contact_id
                  ? {
                      id: row.contact_id,
                      given_name: row.given_name,
                      family_name: row.family_name,
                      company: row.company,
                      thumbnail_path: row.thumbnail_path,
                    }
                  : null,
              });
            }

            // console.log('Favoritos estruturados:', favorites);
            resolve(favorites);
          },
          (_, error) => {
            console.log('Erro na consulta SQL:', error);
            reject(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log('Erro ao acessar o banco de dados:', error);
      reject(error);
    }
  });
};

// 🔥 Verifica se um telefone está favoritado no banco local
export const isFavorite = async (userId, phoneId) => {
  // console.log('Verificando favorito - USER ID:', userId, 'PHONE ID:', phoneId);

  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDBConnection();

      db.transaction((tx) => {
        tx.executeSql(
          `SELECT id FROM user_favorites WHERE user_id = ? AND phone_id = ? LIMIT 1`,
          [userId, phoneId],
          (_, results) => {
            console.log('Resultados da consulta:', results.rows.length);
            if (results.rows.length > 0) {
              // console.log('✅ Telefone é favorito!');
              resolve(true);
            } else {
              // console.log('❌ Telefone NÃO é favorito.');
              resolve(false);
            }
          },
          (_, error) => {
            console.log('Erro na consulta SQL:', error);
            reject(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log('Erro ao acessar o banco de dados:', error);
      reject(error);
    }
  });
};

// 🔥 Remove todos os favoritos de um usuário no banco local (para logout ou reset)
export const removeAllFavoritesByUserId = async (userId) => {
  return new Promise(async (resolve, reject) => {
    const db = await getDBConnection();
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM user_favorites WHERE user_id = ?`,
        [userId],
        (_, results) => {
          resolve(results.rowsAffected);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const FavoriteService = {
  getFavorites,
  syncFavoritesFromAPI,
  getFavoritesByUserId,
  toggleFavorite,
  isFavorite,
  removeAllFavoritesByUserId,
};

export default FavoriteService;
