import React, { useContext } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';
import LottieView from 'lottie-react-native';

const LoadingIndicator = ({ isVisible, color, size }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        {Platform.OS === 'ios' ? (
          <BlurView style={styles.blur} blurType={theme.mode} blurAmount={10} />
        ) : (
          <View style={styles.blur} />
        )}
        <View style={[styles.indicatorContainer, { backgroundColor: color }]}>
          <LottieView
            source={require('../../assets/animations/loading.json')}
            // style={{ width: '30%', height: '30%' }}
            autoPlay
            loop
          />
          <ActivityIndicator size={size} color={activeColors.accent} />
        </View>
      </View>
    </Modal>
  );
};
const createStyles = (colors) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    blur: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    indicatorContainer: {
      padding: 20,
      borderRadius: 10,
    },
  });
  return styles;
};

export default LoadingIndicator;
