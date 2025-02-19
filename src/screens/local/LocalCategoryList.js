import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CategoryLocalCard from '../../components/Cards/CategoryLocalCard';

const LocalCategoryList = ({ categories, selectedCategory, setSelectedCategory }) => {
  const handleCategoryPress = (category) => {
    if (selectedCategory?.id !== category.id) {
      setSelectedCategory(category);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryLocalCard
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
  container: { paddingVertical: 5, backgroundColor: '#ccc' },
});

export default LocalCategoryList;
