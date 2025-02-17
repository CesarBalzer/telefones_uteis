import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

let animationJson = require('../../assets/animations/logo.json');
let background = require('../../assets/background-effect.png');

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const SplashScreen = ({ onFinish }) => {
  const styles = createStyles();
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
      colors={['#3b4253', '#5C6C92']}
      start={{ x: 0.4, y: 1 }}
      end={{ x: 1, y: 0.5 }}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.container}>
          <Text style={styles.text}>{displayedText}</Text>
          <View style={styles.animationContainer}>
            <AnimatedLottieView
              source={animationJson}
              progress={animationProgress.current}
              style={{ width: 500, height: 500 }}
            />
          </View>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
};

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      flex: 1,
      justifyContent: 'center',
      height: 1300,
    },
    text: {
      color: '#F9FAFB',
      fontSize: 42,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: 40,
      lineHeight: 50,
    },
    animationContainer: {
      width: 300,
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default SplashScreen;
