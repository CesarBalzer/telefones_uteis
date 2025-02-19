import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../components/Buttons/CustomButton';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

let pinch = require('../../assets/animations/pinch.json');
let swipe = require('../../assets/animations/swipe.json');

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const InstructionModal = ({ onConfirm, buttonEnabled, setButtonEnabled }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const animationProgress = useRef(new Animated.Value(0)).current;
  const [currentAnimation, setCurrentAnimation] = useState('pinch');

  useEffect(() => {
    startInstructionLoop();
  }, []);

  const startInstructionLoop = () => {
    let animationOrder = ['pinch', 'swipe'];
    let index = 0;

    const playAnimation = () => {
      setCurrentAnimation(animationOrder[index]);
      animationProgress.setValue(0);

      Animated.timing(animationProgress, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        if (animationOrder[index] === 'swipe' && !buttonEnabled) {
          setButtonEnabled(true);
        }
        index = (index + 1) % animationOrder.length;
        playAnimation();
      });
    };

    playAnimation();
  };

  return (
    <View style={styles.instructionsContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>No mapa ou na lista, veja as instruções:</Text>
      </View>
      <View style={styles.animationContainer}>
        {currentAnimation === 'pinch' ? (
          <>
            <Text style={styles.instructionText}>
              Use o gesto de pinça para ampliar e explorar o mapa e toque no
              estado padrão.
            </Text>
            <AnimatedLottieView
              source={pinch}
              progress={animationProgress}
              style={styles.lottie}
            />
          </>
        ) : (
          <>
            <Text style={styles.instructionText}>
              Ou deslize para os lados na lista abaixo para escolher o estado
              padrão.
            </Text>
            <AnimatedLottieView
              source={swipe}
              progress={animationProgress}
              style={[{ transform: [{ rotate: '180deg' }] }, styles.lottie]}
            />
          </>
        )}
      </View>
      <View style={styles.footer}>
        <CustomButton
          type="success"
          size="large"
          shape="rounded"
          disabled={!buttonEnabled}
          label={
            buttonEnabled
              ? 'Entendido, vamos continuar!'
              : 'Aguarde as instruções...'
          }
          onPress={onConfirm}
          iconPosition="right"
          icon={
            <Icon
              name="check"
              size={24}
              color={
                buttonEnabled ? activeColors.primary : activeColors.tertiary
              }
            />
          }
        />
      </View>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    instructionsContainer: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
    },
    header: {
      paddingTop: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    animationContainer: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    instructionText: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
    },
    lottie: {
      width: 250,
      height: 250,
    },
    footer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
  });

export default InstructionModal;
