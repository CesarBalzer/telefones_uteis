import React from 'react';
import { FlatList, View } from 'react-native';
import ContactCard from '../Cards/ContactCard';

const ContactContent = ({ data, handleEdit }) => {
  return (
    <FlatList
      vertical
      renderItem={({ item, index }) => (
        <ContactCard key={index} data={item} onEdit={handleEdit} />
      )}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={<View />}
    />
  );
};

export default ContactContent;
