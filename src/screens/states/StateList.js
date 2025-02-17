import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import StateCard from '../../components/Cards/StateCard';

const StateList = ({ states, selectedState, onStateSelect, scrollRef }) => {
  const getItemLayout = (data, index) => ({
    length: 120,
    offset: 134 * index,
    index,
  });

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
      data={states}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <StateCard
          title={item.name}
          onPress={() => onStateSelect(item.id)}
          isActive={item.id === selectedState?.id}
        />
      )}
      getItemLayout={getItemLayout}
    />
  );
};

export default StateList;
