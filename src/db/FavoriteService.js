import { getDBConnection } from './db-service';

export const db = getDBConnection();

// Obtém os telefones favoritados pelo usuário
export const getFavoritesByUserId = async (userId) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        `SELECT phones.* FROM user_favorites 
         JOIN phones ON user_favorites.phone_id = phones.id 
         WHERE user_favorites.user_id = ? 
         ORDER BY phones.title ASC`,
        [userId],
        (_, results) => {
          const favorites = [];
          for (let i = 0; i < results.rows.length; i++) {
            favorites.push(results.rows.item(i));
          }
          resolve(favorites);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Adiciona um telefone aos favoritos do usuário
export const addFavorite = async (userId, phoneId) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      const createdAt = new Date().toISOString();
      tx.executeSql(
        `INSERT INTO user_favorites (user_id, phone_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?)`,
        [userId, phoneId, createdAt, createdAt],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Falha ao adicionar favorito.'));
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Remove um telefone dos favoritos do usuário
export const removeFavorite = async (userId, phoneId) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        `DELETE FROM user_favorites WHERE user_id = ? AND phone_id = ?`,
        [userId, phoneId],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Favorito não encontrado ou já removido.'));
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Verifica se um telefone está nos favoritos do usuário
export const isFavorite = async (userId, phoneId) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM user_favorites WHERE user_id = ? AND phone_id = ?`,
        [userId, phoneId],
        (_, results) => {
          resolve(results.rows.length > 0);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Remove todos os favoritos de um usuário (útil para logout ou redefinição)
export const removeAllFavoritesByUserId = async (userId) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
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
  getFavoritesByUserId,
  addFavorite,
  removeFavorite,
  isFavorite,
  removeAllFavoritesByUserId,
};

export default FavoriteService;
