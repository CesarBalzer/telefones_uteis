import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import CardComponent from '../Cards/CardComponent';
import DataSets from '../../data/DataSets';

const CategoryContent = ({ selectedCategory }) => {
  const cities = DataSets.abrevs[selectedCategory] || [];
  // console.log('cities => ', cities);

  const filterCategory = (categories, categoryId) => {
    return categories.filter((item) => categoryId == item.category_id);
  };

  const cat1 = filterCategory(cities, 1);
  const cat2 = filterCategory(cities, 2);
  // console.log('FILTERCATEGORY 1=> ', cat1);
  // console.log('FILTERCATEGORY 2=> ', cat2);
  return (
    <ScrollView
      // contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      vertical
      //try horizontal instead of vertical
      showsHorizontalScrollIndicator={false}
    >
      {cities.map((item, index) => (
        <CardComponent
          key={index}
          imageSource={item.icon ? item.icon : 'star'}
          title={`${item.title}`}
          number={`${item.number}`}
          categoryId={`${item.category_id}`}
          ddd={`${item.ddd}`}
          description={` ${item.description} `}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default CategoryContent;
