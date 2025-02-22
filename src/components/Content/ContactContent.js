import React from 'react';
import { FlatList, View } from 'react-native';
import ContactCard from '../Cards/ContactCard';

const ContactContent = ({ data, handleEdit, user }) => {
  return (
    <FlatList
      vertical
      renderItem={({ item, index }) => (
        <ContactCard key={index} data={item} onEdit={handleEdit} user={user} />
      )}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={<View />}
    />
  );
};

export default ContactContent;
