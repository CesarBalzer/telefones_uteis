import { getDBConnection } from './db-service';

const db = getDBConnection();

export const getCategories = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM category',
        [],
        (_, results) => {
          const categories = [];
          for (let i = 0; i < results.rows.length; i++) {
            categories.push(results.rows.item(i));
          }
          resolve(categories);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getCategoryById = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM category WHERE id = ?',
        [id],
        (_, results) => {
          if (results.rows.length > 0) {
            const category = results.rows.item(0);
            resolve(category);
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

export const addCategory = async (category) => {
  console.log('CATEGORY => ', category);
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'INSERT INTO category (title, description, icon) VALUES (?, ?, ?)',
        [category.title, category.description, category.icon],
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

export const editCategory = async (id, newCategory) => {
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

export const removeCategory = async (id) => {
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

const PhoneService = {
  getCategories,
  getCategoryById,
  addCategory,
  editCategory,
  removeCategory,
  getPhonesWithCategories,
};

export default PhoneService;
