import { getDBConnection } from './db-service';

export const db = getDBConnection();

export const getPhones = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM phones order by title asc',
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

export const getPhoneById = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM phones WHERE id = ?',
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
        'INSERT INTO phones (title, ddd, number, description, icon) VALUES (?, ?, ?, ?, ?)',
        [phone.title, phone.ddd, phone.number, phone.description, phone.icon],
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
      const { title, ddd, number, description, icon, favored } = newPhone;

      tx.executeSql(
        'UPDATE phones SET title = ?, ddd = ?, number = ?, description = ?, icon = ?, favored = ? WHERE id = ?',
        [title, ddd, number, description, icon, favored, id],
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
        'DELETE FROM phones WHERE id = ?',
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
        'SELECT phone.*, category.name as category_name FROM phones LEFT JOIN categories ON phone.category_id = category.id order by phone.title asc',
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
        'SELECT * from phones where state_id = ? order by title asc',
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

export const getContactsAndPhonesz = async (categoryId, stateId) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      let mergedData = [];

      tx.executeSql(
        `SELECT 
          contacts.id AS contact_id, contacts.given_name, contacts.family_name, contacts.middle_name, 
          contacts.user_id, contacts.created_at, contacts.updated_at,
          categories.id AS category_id,
          categories.name AS category_name,
          phones.id AS phone_id, phones.title, phones.ddd, phones.number, 
          phones.description, phones.icon, phones.active, phones.state_id
        FROM phones
        LEFT JOIN categories ON phones.category_id = categories.id
        LEFT JOIN phones ON contacts.id = phones.contact_id
        WHERE phones.category_id = ? 
        AND phones.state_id = ?
        ORDER BY contacts.given_name ASC, phones.title ASC;`,
        [categoryId, stateId],
        (_, results) => {
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);

            mergedData.push({
              id: row.contact_id,
              given_name: row.given_name,
              family_name: row.family_name,
              middle_name: row.middle_name,
              user_id: row.user_id,
              created_at: row.created_at,
              updated_at: row.updated_at,
              category_id: row.category_id,
              category_name: row.category_name,
              phone_id: row.phone_id,
              title: row.title,
              ddd: row.ddd,
              number: row.number,
              description: row.description,
              icon: row.icon,
              active: row.active,
              state_id: row.state_id,
            });
          }

          console.log('✅ Dados mesclados carregados com sucesso!');
          resolve(mergedData);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar dados mesclados:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getContactsAndPhones = async () => {
  // console.log('GET CONTACTS ANDPHONES => ', stateId, categoryId);
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql('SELECT COUNT(*) AS total FROM phones;', [], (_, results) =>
        console.log(
          '📊 Total de registros em phones:',
          results.rows.item(0).total
        )
      );
    });
  });
};

export const getPhonesByCategoryId = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * from phones where category_id = ? order by title asc',
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
        'SELECT * from phones where favored = 1 order by title asc',
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
  getPhonesFavoreds,
  getContactsAndPhones,
};

export default PhoneService;
