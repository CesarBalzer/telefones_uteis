import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import InputSearch from '../../components/Search/InputSearch';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';
import IconSearch from '../../components/Search/IconSearch';

const LocalSearch = ({ value, onChange, loading, onReset }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  return (
    <View style={styles.container}>
      <InputSearch
        selectionColor={activeColors.tint}
        label={'Digite algo...'}
        icon={<IconSearch value={value} loading={loading} onPress={onReset} />}
        keyboardType={'name-phone-pad'}
        onChangeText={onChange}
        value={value}
      />
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.secondary,
      // marginTop: 10,
      paddingVertical: 15,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      borderColor: colors.accent,
      borderWidth: 1,
      borderRadius: 10,
    },
    selectionColor: {},
  });

export default LocalSearch;
