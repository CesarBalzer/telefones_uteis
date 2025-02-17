import React, { useRef, useState, useContext } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
} from 'react-native';
import CategoryCard from '../Cards/CategoryTabCard';
import CategoryContent from '../Content/CategoryContent';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import DataSets from '../../data/DataSets';

const CategoryTabSection = ({ route, navigation }) => {
  // console.log('ROUTE CATEGORY TAB SECTION=> ', route);
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const categoriesScrollViewRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('PR');
  const [selectedNameCategory, setSelectedNameCategory] = useState('Paraná');

  const handleCategoryPress = (item, index) => {
    setSelectedCategory(item.acronym);
    setSelectedNameCategory(item.name);
    const screenWidth = Dimensions.get('window').width;
    const scrollToX = (screenWidth / 5) * index;
    categoriesScrollViewRef.current.scrollTo({
      x: scrollToX,
      animated: true,
    });
  };

  return (
    <View>
      <ScrollView
        style={{ marginTop: 10 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={categoriesScrollViewRef}
      >
        {DataSets.states.map((item, index) => (
          <CategoryCard
            key={index}
            title={item.acronym}
            onPress={() => handleCategoryPress(item, index)}
            isActive={item.acronym === selectedCategory}
          />
        ))}
      </ScrollView>
      <View
        style={{
          marginTop: 15,
          paddingVertical: 20,
          paddingHorizontal: 10,
          marginHorizontal: 10,
          backgroundColor: `${activeColors.accent}`,
          borderColor: activeColors.category,
          borderWidth: 1,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            color: activeColors.secondary,
            fontWeight: 600,
          }}
        >
          {selectedNameCategory}
        </Text>
      </View>
      <CategoryContent selectedCategory={selectedCategory} />
    </View>
  );
};

export default CategoryTabSection;
