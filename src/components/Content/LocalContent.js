import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import LocalComponent from '../Cards/LocalComponent';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

const LocalContent = ({ data, handleEdit }) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  return (
    <ScrollView
      vertical
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
    >
      {data.map((item, index) => (
        <LocalComponent key={index} data={item} onEdit={handleEdit} />
      ))}
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: colors.primary,
    },
  });

export default LocalContent;
