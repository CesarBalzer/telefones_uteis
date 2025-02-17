import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import MapScreen from './MapScreen';
import StateCard from '../components/Cards/StateCard';
import CustomButton from '../components/Buttons/CustomButton';
import { getStates } from '../db/StateService';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserContext } from '../context/UserContext';

let pinch = require('../assets/animations/pinch.json');
let swipe = require('../assets/animations/swipe.json');

const StatesScreen = () => {
  const { user, saveUser, getUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [showTip, setShowTip] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('pinch');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const animationProgress = useRef(new Animated.Value(0));
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const navigation = useNavigation();
  const statesScrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

  useEffect(() => {
    if (showTip) startInstructionLoop();
  }, [showTip]);

  const startInstructionLoop = () => {
    let animationOrder = ['pinch', 'swipe'];
    let index = 0;

    const playAnimation = () => {
      const current = animationOrder[index];
      setCurrentAnimation(current);
      animationProgress.current.setValue(0);

      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        if (current === 'swipe' && !buttonEnabled) {
          setButtonEnabled(true); 
        }
        index = (index + 1) % animationOrder.length;
        playAnimation();
      });
    };

    playAnimation();
  };

  const handleConfirmTip = () => {
    setShowTip(false);
  };

  const loadStates = async () => {
    const sts = await getStates();
    setStates(sts);

    if (user && user.state_id) {
      const foundState = await getStateById(user.state_id);
      setSelectedState(foundState);

      setTimeout(() => {
        const index = sts.findIndex((item) => item.id == user.state_id);
        handleScroll(index);
      }, 500);
    }
  };

  useEffect(() => {
    loadStates();
  }, []);

  const handleState = (id) => {
    const filter = states.filter((item) => item.id == id);
    setSelectedState(filter[0]);
    navigation.setOptions({ title: filter[0].name });
    const index = states.findIndex((item) => item.id == id);
    handleScroll(index);
  };

  const handleConfirm = async () => {
    setLoading(true);
    saveUser({ ...user, state_id: selectedState.id });
    await getUser();
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Main', {
        screen: 'Local',
      });
    }, 2000);
  };

  const handleScroll = (idx) => {
    setTimeout(() => {
      statesScrollViewRef.current.scrollToIndex({ animated: true, index: idx });
    }, 300);
  };

  const getItemLayout = (data, index) => ({
    length: 120,
    offset: 134 * index,
    index,
  });

  return (
    <View style={styles.container}>
      {showTip ? (
        <>
          <View style={styles.instructionsContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Selecionar um estado</Text>
            </View>
            <View style={styles.animationContainer}>
              {currentAnimation === 'pinch' ? (
                <>
                  <Text style={styles.instructionText}>
                    Use o gesto de pinça para ampliar e explorar o mapa e toque
                    no estado desejado.
                  </Text>
                  <AnimatedLottieView
                    source={pinch}
                    progress={animationProgress.current}
                    style={styles.lottie}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.instructionText}>
                    Ou deslize para os lados na lista abaixo para escolher o
                    estado desejado.
                  </Text>
                  <AnimatedLottieView
                    source={swipe}
                    progress={animationProgress.current}
                    style={[
                      { transform: [{ rotate: '180deg' }] },
                      styles.lottie,
                    ]}
                  />
                </>
              )}
            </View>
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
              onPress={handleConfirmTip}
              loading={loading}
              iconPosition="right"
              icon={
                <Icon
                  name="chevron-right"
                  size={24}
                  color={buttonEnabled ? activeColors.primary : '#ccc'}
                />
              }
            />
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <View style={styles.containerMap}>
            <MapScreen onPress={handleState} selected={selectedState?.id} />
          </View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>Selecione um estado</Text>
          </View>
          <View style={styles.containerCards}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={statesScrollViewRef}
              data={states}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <StateCard
                  title={item.name}
                  onPress={() => handleState(item.id)}
                  isActive={item.id === selectedState?.id}
                />
              )}
              getItemLayout={getItemLayout}
            />
          </View>
          <View style={styles.containerFooter}>
            <CustomButton
              type="success"
              size="large"
              shape="rounded"
              disabled={!selectedState?.id}
              label="Confirmar"
              onPress={handleConfirm}
              loading={loading}
              iconPosition="left"
              icon={
                <Icon
                  name="check"
                  size={24}
                  color={
                    selectedState?.id
                      ? activeColors.primary
                      : activeColors.tertiary
                  }
                />
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
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
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      marginVertical: 10,
    },
    animationContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    instructionText: {
      fontSize: 18,
      color: colors.text,
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
    confirmButton: {
      height: 80,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: colors.success,
      borderRadius: 10,
    },
    disabledButton: {
      backgroundColor: '#aaa',
    },
    confirmButtonText: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 5,
    },
    containerMap: {
      flex: 2,
      marginVertical: 10,
    },
    containerTitle: {
      backgroundColor: `${colors.accent}35`,
      paddingVertical: 10,
    },
    containerCards: {
      paddingVertical: 20,
      backgroundColor: `${colors.accent}35`,
    },
    containerFooter: {
      padding: 10,
    },
  });

export default StatesScreen;
