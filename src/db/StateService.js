import { getDBConnection } from './db-service';

const db = getDBConnection();

export const getStates = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM state order by name asc',
        [],
        (_, results) => {
          const states = [];
          for (let i = 0; i < results.rows.length; i++) {
            states.push(results.rows.item(i));
          }
          resolve(states);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getStateById = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM state WHERE id = ?',
        [id],
        (_, results) => {
          if (results.rows.length > 0) {
            const states = results.rows.item(0);
            resolve(states);
          } else {
            resolve(null); // Retorna null se nenhuma categoria for encontrada com o ID fornecido
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

export const addState = async (states) => {
  console.log('states => ', states);
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'INSERT INTO states (title, description, icon) VALUES (?, ?, ?)',
        [states.title, states.description, states.icon],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Failed to add category'));
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

export const editState = async (id, newCategory) => {
  console.log('NEW CATEGORY => ', newCategory);
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      const { title, description, icon } = newCategory;

      tx.executeSql(
        'UPDATE category SET title = ?, description = ?, icon = ? WHERE id = ?',
        [title, description, icon, id],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(
              new Error(`Category with ID ${id} not found or no changes made.`)
            );
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

export const removeState = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'DELETE FROM category WHERE id = ?',
        [id],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error(`Category with ID ${id} not found.`));
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

export const getPhonesWithCategories = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT phone.*, category.name as category_name FROM phone LEFT JOIN category ON phone.category_id = category.id',
        [],
        (_, results) => {
          const phonesWithCategories = [];
          for (let i = 0; i < results.rows.length; i++) {
            phonesWithCategories.push(results.rows.item(i));
          }
          resolve(phonesWithCategories);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const StateService = {
  getStates,
  getStateById,
  addState,
  editState,
  removeState,
  getPhonesWithCategories,
};

export default StateService;
