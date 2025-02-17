import React, { useContext } from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';

// import { Container } from './styles';

const SkelletonPhoneItem = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <View style={{marginTop:5}}>
      <SkeletonPlaceholder borderRadius={4} flexDirection="row">
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={10}
          marginHorizontal={10}
          paddingVertical={8}
          borderColor={'#333'}
          borderWidth={0.6}
          borderRadius={10}
        >
          <SkeletonPlaceholder.Item
            width={50}
            height={50}
            borderRadius={50}
            marginLeft={10}
          />
          <SkeletonPlaceholder.Item marginLeft={15}>
            <SkeletonPlaceholder.Item width={150} height={15} />
            <SkeletonPlaceholder.Item marginTop={6} width={220} height={20} />
            <SkeletonPlaceholder.Item marginTop={6} width={220} height={5} />
            <SkeletonPlaceholder.Item marginTop={6} width={220} height={5} />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item marginLeft={20} flexDirection="row">
            <SkeletonPlaceholder.Item
              width={50}
              height={50}
              borderRadius={50}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default SkelletonPhoneItem;
