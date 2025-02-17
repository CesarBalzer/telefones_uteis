import React, { useContext } from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';

// import { Container } from './styles';

const SkelletonInputSearch = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      flexDirection="row"
      backgroundColor={activeColors.secondary}
      highlightColor={activeColors.primary}
    >
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        marginTop={2}
        marginLeft={10}
      >
        <SkeletonPlaceholder.Item
          width={'100%'}
          height={10}
          borderRadius={10}
          marginTop={15}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default SkelletonInputSearch;
