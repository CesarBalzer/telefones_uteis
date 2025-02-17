import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { getStates, getStateById } from '../db/StateService';
import { colors } from '../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StateList from './states/StateList';
import CustomMap from './states/CustomMap';
import InstructionModal from './states/InstructionModal';
import CustomButton from '../components/Buttons/CustomButton';

const StatesScreen = () => {
  const { user, saveUser, getUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const navigation = useNavigation();

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const [showTip, setShowTip] = useState(false);
  const [loading, setLoading] = useState(false);

  const statesScrollViewRef = useRef(null);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    const sts = await getStates();
    setStates(sts);
    if (user && user.state_id) {
      const foundState = await getStateById(user.state_id);
      setSelectedState(foundState);
      scrollToState(sts, user.state_id);
    }
  };

  const scrollToState = (states, stateId) => {
    const index = states.findIndex((item) => item.id === stateId);
    if (index >= 0) {
      setTimeout(() => {
        statesScrollViewRef.current?.scrollToIndex({ animated: true, index });
      }, 300);
    }
  };

  const handleState = (id) => {
    const filter = states.filter((item) => item.id === id);
    setSelectedState(filter[0]);
    navigation.setOptions({ title: filter[0]?.name });
  };

  const handleConfirm = async () => {
    setLoading(true);
    saveUser({ ...user, state_id: selectedState.id });
    await getUser();
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Main', { screen: 'Local' });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {showTip ? (
        <InstructionModal onConfirm={() => setShowTip(false)} />
      ) : (
        <>
          <View style={styles.mapWrapper}>
            <CustomMap selected={selectedState?.id} onPress={handleState} />
          </View>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>Selecione um estado</Text>
          </View>
          <View style={styles.listWrapper}>
            <StateList
              states={states}
              selectedState={selectedState}
              onStateSelect={handleState}
              scrollRef={statesScrollViewRef}
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
                <Icon name="check" size={24} color={activeColors.primary} />
              }
            />
          </View>
        </>
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
    mapWrapper: {
      flex: 3,  // Deixe o mapa ocupar mais espaço
      width: '100%',
      justifyContent: 'center',
      alignItems: 'stretch',
    },
    containerTitle: {
      backgroundColor: `${colors.accent}35`,
      paddingVertical: 15,
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
    },
    listWrapper: {
      // flex: 1,
      paddingVertical: 15,
      backgroundColor: `${colors.accent}35`,
    },
    containerFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: `${colors.accent}35`,
    },
  });

export default StatesScreen;
