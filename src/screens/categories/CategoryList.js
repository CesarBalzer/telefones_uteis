import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CardItem from '../../components/Cards/CardItem';

const CategoryList = ({
  categories,
  selectedCategory,
  handleCategoryPress,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CardItem
            title={item.name}
            onPress={() => handleCategoryPress(item)}
            isActive={item.id === selectedCategory?.id}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
});

export default CategoryList;
