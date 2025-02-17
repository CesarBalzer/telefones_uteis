import { Text } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';
import { version } from '../../../package.json';
import { View } from 'react-native';

const VersionText = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <View>
      <Text
        style={{
          textAlign: 'center',
          color: activeColors.tertiary,
          fontSize: 11,
        }}
      >
        v{version}
      </Text>
    </View>
  );
};

export default VersionText;
