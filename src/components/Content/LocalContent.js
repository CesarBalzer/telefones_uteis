import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import LocalComponent from '../Cards/LocalComponent';
import DataSets from '../../data/DataSets';

const LocalContent = ({ data, handleEdit }) => {
  return (
    <ScrollView
      vertical
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 10 }}
    >
      {data.map((item, index) => (
        <LocalComponent
          key={index}
          data={item}
          // id={item.id}
          // imageSource={item.icon ? item.icon : 'star'}
          // title={`${item.title}`}
          // number={`${item.number}`}
          // categoryId={`${item.category_id}`}
          // ddd={`${item.ddd}`}
          // description={` ${item.description} `}
          onEdit={handleEdit}
        />
      ))}
    </ScrollView>
  );
};

export default LocalContent;
