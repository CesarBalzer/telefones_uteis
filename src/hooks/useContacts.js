import { useState } from 'react';
import Contacts from 'react-native-contacts';
import {
  getContacts,
  addContact,
  updateContact,
  removeAllContacts,
  getContactByRecordId,
} from '../services/ContactService';

const PAGE_SIZE = 50;

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [paginatedContacts, setPaginatedContacts] = useState([]);
  const [showOptions, setShowOptions] = useState(true);

  const fetchContacts = async () => {
    try {
      const contactsFromDB = await getContacts();
      // console.log('CONTACTS FROM DB => ', contactsFromDB && contactsFromDB[0]);

      setContacts(contactsFromDB || []);

      if (contactsFromDB && contactsFromDB.length > 0) {
        paginateContacts(0, contactsFromDB);
      } else {
        setPaginatedContacts([]);
      }
    } catch (error) {
      console.log('Erro ao buscar contatos:', error);
      setContacts([]);
      setPaginatedContacts([]);
    }
  };

  const importContacts = async (overwrite = false) => {
    try {
      const allContacts = await Contacts.getAll();
      if (overwrite) await removeAllContacts();

      for (const contact of allContacts) {
        const newContact = transformContact(contact);
        if (!overwrite) {
          const existingContact = await getContactByRecordId(newContact.record_id);
          if (existingContact && hasChanges(existingContact, newContact)) {
            await updateContact(existingContact.id, newContact);
          } else {
            await addContact(newContact);
          }
        } else {
          await addContact(newContact);
        }
      }

      await fetchContacts(); 
    } catch (error) {
      console.log('Erro ao importar contatos:', error);
    }
  };

  const transformContact = (contact) => {
    return {
      record_id: contact.recordID,
      given_name: contact.givenName,
      family_name: contact.familyName,
      phone_numbers: JSON.stringify(contact.phoneNumbers || []),
      email_addresses: JSON.stringify(contact.emailAddresses || []),
      thumbnail_path: contact.thumbnailPath,
    };
  };

  const hasChanges = (existingContact, newContact) => {
    return (
      existingContact.given_name !== newContact.given_name ||
      existingContact.family_name !== newContact.family_name ||
      existingContact.phone_numbers !== newContact.phone_numbers ||
      existingContact.email_addresses !== newContact.email_addresses
    );
  };

  const paginateContacts = (page, contactsList = contacts) => {
    if (!contactsList || contactsList.length === 0) {
      setPaginatedContacts([]);
      return;
    }

    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    
    setPaginatedContacts(contactsList.slice(start, end));
  };

  return {
    contacts,
    paginatedContacts,
    fetchContacts,
    importContacts,
    showOptions,
    setShowOptions,
  };
};

export default useContacts;
