import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import LocalComponent from '../Cards/LocalComponent';

const LocalContent = ({ data, handleEdit }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
    >
      {data.map((item, index) => (
        <LocalComponent key={index} data={item} onEdit={handleEdit} />
      ))}
    </ScrollView>
  );
};

export default LocalContent;
