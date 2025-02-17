import React, { useContext } from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';

// import { Container } from './styles';

const SkelletonState = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: activeColors.primary,
      }}
    >
      <View>
        <SkeletonPlaceholder
          borderRadius={4}
          style={{ marginTop: 0 }}
          backgroundColor={activeColors.secondary}
          highlightColor={activeColors.primary}
        >
          <SkeletonPlaceholder.Item
            width={150}
            height={40}
            alignSelf="center"
            marginTop={60}
          />
          <SkeletonPlaceholder.Item
            width={300}
            height={400}
            borderRadius={50}
            alignSelf="center"
            marginTop={50}
          />
        </SkeletonPlaceholder>
      </View>
      <View>
        <SkeletonPlaceholder
          borderRadius={4}
          style={{ marginTop: 20 }}
          backgroundColor={activeColors.secondary}
          highlightColor={activeColors.primary}
        >
          <SkeletonPlaceholder.Item
            width={320}
            height={40}
            alignSelf="center"
            marginTop={40}
          />

          <SkeletonPlaceholder.Item
            width={320}
            height={100}
            alignSelf="center"
            marginTop={12}
          />
        </SkeletonPlaceholder>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          paddingHorizontal: 20, // Adicionando padding horizontal para os círculos menores nos cantos
        }}
      >
        <View>
          <SkeletonPlaceholder
            borderRadius={4}
            style={{ marginTop: 10 }}
            backgroundColor={activeColors.secondary}
            highlightColor={activeColors.primary}
          >
            <SkeletonPlaceholder.Item
              width={320}
              height={50}
              alignSelf="center"
              marginTop={10}
            />
          </SkeletonPlaceholder>
        </View>
      </View>
    </View>
  );
};

export default SkelletonState;
