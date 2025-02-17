import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';
import MapScreen from './MapScreen';
import StateCard from '../components/Cards/StateCard';
import CustomButton from '../components/Buttons/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';
import { getStateById, getStates } from '../db/StateService';
import LottieView from 'lottie-react-native';

let pinch = require('../assets/animations/pinch.json');
let swipe = require('../assets/animations/swipe.json');

const StatesScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { user, saveUser, getUser } = useContext(UserContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [loading, setLoading] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const navigation = useNavigation();

  const [states, setStates] = useState([]);
  const statesScrollViewRef = useRef(null);
  const [selectedState, setSelectedState] = useState({});

  const animationProgress = useRef(new Animated.Value(0));

  const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

  useEffect(() => {
    const loopAnimation = () => {
      animationProgress.current.setValue(0);
      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => loopAnimation());
    };

    loopAnimation();
  }, []);

  const onFinishAnimation = () => {
    console.log('ON FINISH ANIMATION => ');
    // onFinish();
  };

  useEffect(() => {
    (async () => {
      await loadStates();
    })();
  }, []);

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

  const handleState = (id) => {
    const filter = states.filter((item) => item.id == id);
    setSelectedState(filter[0]);
    navigation.setOptions({ title: filter[0].name });
    const index = states.findIndex((item) => item.id == id);
    handleScroll(index);
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

  return (
    <View style={styles.container}>
      {!showTip ? (
        <View style={styles.container}>
          <View style={styles.containerMap}>
            <MapScreen onPress={handleState} selected={selectedState?.id} />
          </View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>Selecione um estado</Text>
          </View>
        </View>
      ) : (
        <View style={styles.lottie}>
          <Text style={styles.lottieTitle}>Selecione um estado</Text>
          <Text style={styles.lottieText}>
            Use o gesto de pinça para dar zoom no mapa.
          </Text>
          <View style={styles.containerPinch}>
            <AnimatedLottieView
              source={pinch}
              progress={animationProgress.current}
              style={{ width: 250, height: 250 }}
            />
          </View>
          <Text style={styles.lottieText}>
            Ou deslize os estados abaixo para escolher
          </Text>
          <View style={[{ rotate: 90 }, styles.containerSwipe]}>
            <AnimatedLottieView
              source={swipe}
              progress={animationProgress.current}
              style={{
                width: 250,
                height: 250,
                transform: [{ rotate: '180deg' }],
              }}
            />
          </View>
        </View>
      )}
      <View style={styles.containerCards}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={statesScrollViewRef}
          renderItem={({ item, index }) => (
            <StateCard
              key={item.id}
              title={item.name}
              onPress={() => handleState(item.id)}
              isActive={item.id === selectedState?.id}
            />
          )}
          data={states}
          keyExtractor={(item, index) => item.id.toString()}
          getItemLayout={getItemLayout}
        />
      </View>
      <View style={styles.containerFooter}>
        <CustomButton
          disabled={!selectedState?.id}
          label="Confirmar"
          onPress={handleConfirm}
          type={'success'}
          loading={loading}
          style={styles.buttonConfirm}
        />
      </View>
    </View>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    containerMap: {
      flex: 2,
      marginTop: 50,
    },
    lottie: {
      flex: 1,
      // marginTop: 50,
    },
    lottieTitle: {
      fontSize: 24,
      color: '#333',
      textAlign: 'center',
      marginTop: 16,
    },
    lottieText: {
      fontSize: 20,
      color: '#333',
      textAlign: 'center',
      marginTop: 16,
    },
    containerPinch: {},
    containerSwipe: { zIndex: 99 },
    containerTitle: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
    },
    title: {
      color: colors.text,
      fontSize: 22,
      textAlign: 'center',
    },
    containerCards: {
      paddingVertical: 20,
      backgroundColor: `${colors.accent}35`,
    },
    containerFooter: {
      paddingTop: 10,
      paddingBottom: 30,
    },
    buttonConfirm: {
      height: 50,
      marginHorizontal: 10,
    },
  });
  return styles;
};

export default StatesScreen;
