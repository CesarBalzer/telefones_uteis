import { getDBConnection } from './db-service';

export const db = getDBConnection();

export const getPhones = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM phone order by title asc',
        [],
        (_, results) => {
          const phones = [];
          for (let i = 0; i < results.rows.length; i++) {
            phones.push(results.rows.item(i));
          }
          resolve(phones);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getPhoneById = async(id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM phone WHERE id = ?',
        [id],
        (_, results) => {
          if (results.rows.length > 0) {
            const phone = results.rows.item(0);
            resolve(phone);
          } else {
            resolve(null); // Retorna null se nenhum telefone for encontrado com o ID fornecido
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

export const addPhone = async (phone) => {
  console.log('PHONE => ', phone);
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'INSERT INTO phone (title, number, description, icon) VALUES (?, ?, ?, ?)',
        [phone.title, phone.number, phone.description, phone.icon],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Failed to add phone'));
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

export const updatePhone = async (id, newPhone) => {
  console.log('UPDATE PHONE => ', newPhone);
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      const { title, number, description, icon, favored } = newPhone;

      tx.executeSql(
        'UPDATE phone SET title = ?, number = ?, description = ?, icon = ?, favored = ? WHERE id = ?',
        [title, number, description, icon, favored, id],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(
              new Error(`Phone with ID ${id} not found or no changes made.`)
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

export const removePhone = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'DELETE FROM phone WHERE id = ?',
        [id],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error(`Phone with ID ${id} not found.`));
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
        'SELECT phone.*, category.name as category_name FROM phone LEFT JOIN category ON phone.category_id = category.id order by phone.title asc',
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

export const getPhonesByStateId = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * from phone where state_id = ? order by title asc',
        [id],
        (_, results) => {
          const phones = [];
          for (let i = 0; i < results.rows.length; i++) {
            phones.push(results.rows.item(i));
          }
          resolve(phones);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getPhonesByCategoryId = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * from phone where category_id = ? order by title asc',
        [id],
        (_, results) => {
          const phones = [];
          for (let i = 0; i < results.rows.length; i++) {
            phones.push(results.rows.item(i));
          }
          resolve(phones);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getPhonesFavoreds = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * from phone where favored = 1 order by title asc',
        null,
        (_, results) => {
          const phones = [];
          for (let i = 0; i < results.rows.length; i++) {
            phones.push(results.rows.item(i));
          }
          resolve(phones);
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
  getPhones,
  getPhoneById,
  addPhone,
  updatePhone,
  removePhone,
  getPhonesByStateId,
  getPhonesByCategoryId,
  getPhonesFavoreds
};

export default PhoneService;
