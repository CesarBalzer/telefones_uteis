import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';

let animationJson = require('../assets/animations/swipe.json');

const ModalSheetLottie = ({ visible, onClose }) => {
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['40%']}
      enablePanDownToClose
      onClose={onClose}
    >
      <View style={styles.container}>
        <LottieView
          source={animationJson}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.text}>
          Use o gesto de pinça para dar zoom no mapa.
        </Text>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  animation: {
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ModalSheetLottie;
