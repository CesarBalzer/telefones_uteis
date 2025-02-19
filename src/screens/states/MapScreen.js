import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';
import Controls from '../map/Controls';
import States from '../map/States';

const MapScreen = ({ onPress, selected }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      let newScale = event.scale;
      newScale = Math.max(0.7, Math.min(newScale, 2.5));
      scale.value = newScale;
    })
    .onEnd(() => {
      scale.value = withSpring(scale.value, { damping: 10, stiffness: 100 });
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const maxTranslateX = 100;
      const maxTranslateY = 50;

      translateX.value = Math.max(
        -maxTranslateX,
        Math.min(maxTranslateX, event.translationX)
      );

      translateY.value = Math.max(
        -maxTranslateY,
        Math.min(maxTranslateY, event.translationY)
      );
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value, {
        damping: 15,
        stiffness: 100,
      });
      translateY.value = withSpring(translateY.value, {
        damping: 15,
        stiffness: 100,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const adjustZoom = (factor) => {
    scale.value = withSpring(
      Math.max(0.7, Math.min(scale.value + factor, 2.5)),
      { damping: 15, stiffness: 100 }
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={styles.mapContainer}>
          <Animated.View style={[animatedStyle]}>
            <States
              selected={selected}
              colors={activeColors}
              onPress={onPress}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <Controls adjustZoom={adjustZoom} />
    </GestureHandlerRootView>
  );
};

const createStyles = (colors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    mapContainer: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
  });
};

export default MapScreen;
