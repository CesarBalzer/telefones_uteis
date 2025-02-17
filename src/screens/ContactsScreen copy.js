import React, { useState, useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
  Button,
} from 'react-native';
import Contacts from 'react-native-contacts';
import ItemContact from '../components/ListItems/ItemContact';
import SearchBar from '../components/Inputs/SearchBar';
import Avatar from '../components/Avatars/Avatar';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search');
  const [typeText, setTypeText] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Contacts',
              message: 'This app would like to view your contacts.',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            fetchContacts();
          } else {
            setLoading(false);
          }
        } catch (err) {
          console.error('Permission request error:', err);
          setLoading(false);
        }
      } else {
        fetchContacts();
      }
    };

    loadContacts();
  }, []);

  const fetchContacts = () => {
    Contacts.getAll()
      .then((allContacts) => {
        setContacts(allContacts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading contacts:', error);
        setLoading(false);
      });

    Contacts.getCount().then((count) => {
      setSearchPlaceholder(`Search ${count} contacts`);
    });

    Contacts.checkPermission();
  };

  const search = (text) => {
    const phoneNumberRegex =
      /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    const emailAddressRegex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (text === '' || text === null) {
      fetchContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then((contacts) => {
        setContacts(contacts);
      });
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text).then((contacts) => {
        setContacts(contacts);
      });
    } else {
      Contacts.getContactsMatchingString(text).then((contacts) => {
        setContacts(contacts);
      });
    }
  };

  const onPressContact = (contact) => {
    setTypeText(null);
    if (!typeText) {
      Contacts.openExistingContact(contact);
    } else {
      const newPerson = {
        recordID: contact.recordID,
        phoneNumbers: [{ label: 'mobile', number: typeText }],
      };
      Contacts.editExistingContact(newPerson).then((updatedContact) => {
        // Contact updated
      });
    }
  };

  const addNew = () => {
    Contacts.openContactForm({}).then((contact) => {
      setContacts([contact, ...contacts]);
      setLoading(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          paddingLeft: 100,
          paddingRight: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <Image
          source={require('../assets/logo.png')}
          style={{
            aspectRatio: 2,
            resizeMode: 'contain',
          }}
        /> */}
      </View>
      <Button title="Add new" onPress={addNew} />
      <SearchBar searchPlaceholder={searchPlaceholder} onChangeText={search} />

      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <TextInput
          keyboardType="number-pad"
          style={styles.inputStyle}
          placeholder="Enter number to add to contact"
          onChangeText={(text) => setTypeText(text)}
          value={typeText}
        />
      </View>

      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {contacts.map(
            (contact) =>
              contact && (
                <ItemContact
                  leftElement={
                    <Avatar
                      img={
                        contact.hasThumbnail
                          ? { uri: contact.thumbnailPath }
                          : undefined
                      }
                      placeholder={getAvatarInitials(
                        `${contact.givenName || ''} ${contact.familyName || ''}`
                      )}
                      width={40}
                      height={40}
                    />
                  }
                  key={contact.recordID}
                  title={`${contact.givenName || ''} ${contact.familyName || ''}`}
                  description={`${contact.company || ''}`}
                  onPress={() => onPressContact(contact)}
                  onLongPress={() => Contacts.viewExistingContact(contact)}
                  onDelete={() =>
                    Contacts.deleteContact(contact).then(() => {
                      fetchContacts();
                    })
                  }
                />
              )
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
  },
});

const getAvatarInitials = (textString) => {
  if (!textString) return '';

  const text = textString.trim();
  const textSplit = text.split(' ');

  if (textSplit.length <= 1) return text.charAt(0);

  return textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
};

export default App;
