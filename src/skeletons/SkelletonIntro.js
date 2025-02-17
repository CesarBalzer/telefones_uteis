import React, { useContext } from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';

// import { Container } from './styles';

const SkelletonIntro = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: activeColors.primary
      }}
    >
      <View>
        <SkeletonPlaceholder borderRadius={4} style={{ marginTop: 0 }} backgroundColor={activeColors.secondary} highlightColor={activeColors.primary}>
          <SkeletonPlaceholder.Item
            width={300}
            height={250}
            borderRadius={50}
            alignSelf="center"
            marginTop={140}
          />
        </SkeletonPlaceholder>
      </View>
      <View>
      <SkeletonPlaceholder borderRadius={4} style={{ marginTop: 0 }} backgroundColor={activeColors.secondary} highlightColor={activeColors.primary}>
          <SkeletonPlaceholder.Item
            width={320}
            height={40}
            alignSelf="center"
            marginTop={10}
          />
          <SkeletonPlaceholder.Item
            width={320}
            height={20}
            alignSelf="center"
            marginTop={20}
          />
          <SkeletonPlaceholder.Item
            width={320}
            height={20}
            alignSelf="center"
            marginTop={12}
          />
          <SkeletonPlaceholder.Item
            width={320}
            height={20}
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
          marginBottom: 40,
          paddingHorizontal: 20, // Adicionando padding horizontal para os círculos menores nos cantos
        }}
      >
        <View>
        <SkeletonPlaceholder borderRadius={4} style={{ marginTop: 0 }} backgroundColor={activeColors.secondary} highlightColor={activeColors.primary}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 30,
              }}
            >
              <View>
                <SkeletonPlaceholder.Item
                  width={60}
                  height={60}
                  borderRadius={35}
                  marginRight={10}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 50,
                }}
              >
                <SkeletonPlaceholder.Item
                  width={20}
                  height={20}
                  borderRadius={10}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={20}
                  height={20}
                  borderRadius={10}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={20}
                  height={20}
                  borderRadius={10}
                  marginRight={10}
                />
                <SkeletonPlaceholder.Item
                  width={20}
                  height={20}
                  borderRadius={10}
                  marginRight={10}
                />
              </View>
              <View>
                <SkeletonPlaceholder.Item
                  width={60}
                  height={60}
                  borderRadius={35}
                  marginRight={10}
                />
              </View>
            </View>
          </SkeletonPlaceholder>
        </View>
      </View>
    </View>
  );
};

export default SkelletonIntro;
