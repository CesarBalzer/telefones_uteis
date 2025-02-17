import React from 'react';
import { SectionList, View, Text } from 'react-native';
import ContactCard from '../../components/Cards/ContactCard';

const ContactsList = ({ contacts }) => {
  const formattedSections = contacts.reduce((sections, contact) => {
    const firstLetter = contact.given_name?.charAt(0).toUpperCase() || '#';
    let section = sections.find((sec) => sec.title === firstLetter);
    if (!section) {
      section = { title: firstLetter, data: [] };
      sections.push(section);
    }
    section.data.push(contact);
    return sections;
  }, []);

  return (
    <SectionList
      sections={formattedSections}
      keyExtractor={(item) => item.record_id}
      renderItem={({ item }) => <ContactCard data={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <View style={{ height: 40, justifyContent: 'center', paddingHorizontal: 15, backgroundColor: '#ddd' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
        </View>
      )}
    />
  );
};

export default ContactsList;
