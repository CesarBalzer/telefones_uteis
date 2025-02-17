import { getDBConnection } from './db-service';

const db = getDBConnection();

export const getContacts = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM contact ORDER BY given_name ASC',
        [],
        (_, results) => {
          const contacts = [];
          for (let i = 0; i < results.rows.length; i++) {
            contacts.push(results.rows.item(i));
          }
          resolve(contacts);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getContactById = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM contact WHERE id = ?',
        [id],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            resolve(null);
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

export const addContact = async (contact) => {
  return new Promise(async (resolve, reject) => {
    const {
      record_id,
      given_name,
      family_name,
      phone_numbers,
      email_addresses,
      thumbnail_path,
    } = contact;
    const phoneJson = JSON.stringify(phone_numbers || []);
    const emailJson = JSON.stringify(email_addresses || []);

    (await db).transaction((tx) => {
      tx.executeSql(
        `INSERT INTO contact (
          record_id, given_name, family_name, phone_numbers, email_addresses, thumbnail_path
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          record_id,
          given_name,
          family_name,
          phoneJson,
          emailJson,
          thumbnail_path,
        ],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Failed to add contact'));
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

export const updateContact = async (id, updatedContact) => {
  return new Promise(async (resolve, reject) => {
    const {
      given_name,
      family_name,
      phone_numbers,
      email_addresses,
      thumbnail_path,
    } = updatedContact;
    const phoneJson = JSON.stringify(phone_numbers || []);
    const emailJson = JSON.stringify(email_addresses || []);

    (await db).transaction((tx) => {
      tx.executeSql(
        `UPDATE contact SET 
          given_name = ?, family_name = ?, phone_numbers = ?, email_addresses = ?, thumbnail_path = ?
        WHERE id = ?`,
        [given_name, family_name, phoneJson, emailJson, thumbnail_path, id],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(
              new Error(`Contact with ID ${id} not found or no changes made.`)
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

export const removeContact = async (id) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'DELETE FROM contact WHERE id = ?',
        [id],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error(`Contact with ID ${id} not found.`));
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

export const searchContactsByName = async (name) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM contact WHERE given_name LIKE ? OR family_name LIKE ? ORDER BY given_name ASC`,
        [`%${name}%`, `%${name}%`],
        (_, results) => {
          const contacts = [];
          for (let i = 0; i < results.rows.length; i++) {
            contacts.push(results.rows.item(i));
          }
          resolve(contacts);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const removeAllContacts = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'DELETE FROM contact',
        [],
        (_, results) => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const getContactByRecordId = async (record_id) => {
    return new Promise(async (resolve, reject) => {
      (await db).transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM contact WHERE record_id = ?',
          [record_id],
          (_, results) => {
            if (results.rows.length > 0) resolve(results.rows.item(0));
            else resolve(null);
          },
          (_, error) => reject(error)
        );
      });
    });
  };
  

const ContactService = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  searchContactsByName,
};

export default ContactService;
