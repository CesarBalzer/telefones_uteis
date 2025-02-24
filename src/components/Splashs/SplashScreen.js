import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../config/theme';

let animationJson = require('../../assets/animations/logo.json');

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const SplashScreen = ({ onFinish }) => {
  const { dark } = colors; // Pegando as cores diretamente do tema
  const styles = createStyles(dark);
  const animationProgress = useRef(new Animated.Value(0));
  const [displayedText, setDisplayedText] = useState('');
  const [textCompleted, setTextCompleted] = useState(false);
  const fullText = 'Telefones Úteis e Emergência';
  const typingInterval = 100;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + fullText[index]);
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => setTextCompleted(true), 500);
      }
    }, typingInterval);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textCompleted) {
      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => onFinish());
    }
  }, [textCompleted]);

  return (
    <LinearGradient
      colors={['#1E3A8A', '#2C3E50']} // 🔹 Gradiente atualizado para maior conforto visual
      start={{ x: 0.4, y: 1 }}
      end={{ x: 1, y: 0.5 }}
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle={'light-content'}
        translucent
        animated={true}
        backgroundColor={'#2C3E50'}
      />
      <View style={styles.container}>
        <Text style={styles.text}>{displayedText}</Text>
        <View style={styles.animationContainer}>
          <AnimatedLottieView
            source={animationJson}
            progress={animationProgress.current}
            style={styles.animation}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const createStyles = (colors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: colors.text,
      fontSize: 38,
      fontWeight: '700',
      textAlign: 'center',
      paddingHorizontal: 40,
      lineHeight: 45,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
    },
    animationContainer: {
      width: 350,
      height: 350,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    animation: {
      width: 320,
      height: 320,
    },
  });
};

export default SplashScreen;
