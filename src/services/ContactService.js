import { getDBConnection } from './db-service';

const db = getDBConnection();

export const getContacts = async () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM contacts ORDER BY given_name ASC',
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
        'SELECT * FROM contacts WHERE id = ?',
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

export const getCompleteContactById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getDBConnection();

      db.transaction((tx) => {
        tx.executeSql(
          `
          SELECT c.*, 
                 u.name as user_name, u.email as user_email, 
                 p.id as phone_id, p.title as phone_title, p.ddd, p.number, p.description as phone_description,
                 a.id as address_id, a.street, a.city, a.state, a.postal_code, a.country, a.label as address_label,
                 e.id as email_id, e.email as contact_email, e.label as email_label,
                 im.id as im_id, im.im_service, im.im_username,
                 f.id as favorite_id, f.user_id as favorite_user_id, f.phone_id as favorite_phone_id
          FROM contacts c
          LEFT JOIN users u ON c.user_id = u.id
          LEFT JOIN phones p ON c.id = p.contact_id
          LEFT JOIN contact_addresses a ON c.id = a.contact_id
          LEFT JOIN contact_emails e ON c.id = e.contact_id
          LEFT JOIN contact_ims im ON c.id = im.contact_id
          LEFT JOIN user_favorites f ON p.id = f.phone_id
          WHERE c.id = ?
          `,
          [id],
          (_, results) => {
            console.log(
              'Consulta executada com sucesso. Resultados:',
              results.rows.length
            );

            if (results.rows.length === 0) {
              console.log('Nenhum contato encontrado.');
              resolve(null);
              return;
            }

            let contact = null;

            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);

              if (!contact) {
                contact = {
                  id: row.id,
                  record_id: row.record_id,
                  given_name: row.given_name,
                  family_name: row.family_name,
                  middle_name: row.middle_name,
                  prefix: row.prefix,
                  suffix: row.suffix,
                  company: row.company,
                  job_title: row.job_title,
                  department: row.department,
                  birthday: row.birthday,
                  notes: row.notes,
                  thumbnail_path: row.thumbnail_path,
                  is_public: row.is_public,
                  created_at: row.created_at,
                  updated_at: row.updated_at,
                  user: {
                    name: row.user_name,
                    email: row.user_email,
                  },
                  phones: [],
                  addresses: [],
                  emails: [],
                  ims: [],
                  favorites: [], // Adicionando os favoritos aqui
                };
              }

              if (
                row.phone_id &&
                !contact.phones.some((p) => p.id === row.phone_id)
              ) {
                contact.phones.push({
                  id: row.phone_id,
                  title: row.phone_title,
                  ddd: row.ddd,
                  number: row.number,
                  description: row.phone_description,
                });
              }

              if (
                row.address_id &&
                !contact.addresses.some((a) => a.id === row.address_id)
              ) {
                contact.addresses.push({
                  id: row.address_id,
                  street: row.street,
                  city: row.city,
                  state: row.state,
                  postal_code: row.postal_code,
                  country: row.country,
                  label: row.address_label,
                });
              }

              if (
                row.email_id &&
                !contact.emails.some((e) => e.id === row.email_id)
              ) {
                contact.emails.push({
                  id: row.email_id,
                  email: row.contact_email,
                  label: row.email_label,
                });
              }

              if (row.im_id && !contact.ims.some((im) => im.id === row.im_id)) {
                contact.ims.push({
                  id: row.im_id,
                  im_service: row.im_service,
                  im_username: row.im_username,
                });
              }

              if (
                row.favorite_id &&
                !contact.favorites.some((f) => f.id === row.favorite_id)
              ) {
                contact.favorites.push({
                  id: row.favorite_id,
                  user_id: row.favorite_user_id,
                  phone_id: row.favorite_phone_id,
                });
              }
            }

            console.log('Contato estruturado com favoritos:', contact);
            resolve(contact);
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
        `INSERT INTO contacts (
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
  console.log('UPDATECONTACT => ', id, updatedContact);
  return new Promise(async (resolve, reject) => {
    const {
      given_name,
      family_name,
      thumbnail_path = '',
      birthday,
    } = updatedContact;
    // const phoneJson = JSON.stringify(phone_numbers || []);
    // const emailJson = JSON.stringify(email_addresses || []);

    (await db).transaction((tx) => {
      tx.executeSql(
        `UPDATE contacts SET 
          given_name = ?, family_name = ?, birthday=?, thumbnail_path = ?
        WHERE id = ?`,
        [given_name, family_name, birthday, thumbnail_path, id],
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
        'DELETE FROM contacts WHERE id = ?',
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
        `SELECT * FROM contacts WHERE given_name LIKE ? OR family_name LIKE ? ORDER BY given_name ASC`,
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
        'DELETE FROM contacts',
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
        'SELECT * FROM contacts WHERE record_id = ?',
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
