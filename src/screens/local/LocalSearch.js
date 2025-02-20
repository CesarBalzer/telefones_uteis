import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import ActionIconSearch from './ActionIconSearch';
import InputSearch from '../../components/Inputs/InputSearch';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

const LocalSearch = ({ value, setValue, onChange, loading, onReset }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  return (
    <View style={styles.container}>
      <InputSearch
        selectionColor={activeColors.tint}
        label={'Digite algo...'}
        icon={
          <ActionIconSearch
            value={value}
            loading={loading}
            setValue={setValue}
            onReset={onReset}
          />
        }
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
      marginTop: 15,
      paddingVertical: 15,
      paddingHorizontal: 10,
      marginHorizontal: 10,
      borderColor: '#666',
      borderWidth: 1,
      borderRadius: 10,
    },
    selectionColor: {},
  });

export default LocalSearch;
