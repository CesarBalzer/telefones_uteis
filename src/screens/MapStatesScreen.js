import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStateById, getStates } from '../services/StateService';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserContext } from '../context/UserContext';
import StateList from './states/StateList';
import InstructionModal from './states/InstructionModal';
import CustomButton from '../components/Buttons/CustomButton';
import { syncDatabase } from '../services/SyncService';
import { useSync } from '../context/SyncContext';
import MapScreen from './states/MapScreen';

const MapStatesScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const { syncStatus, setSyncStatus } = useSync();
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [showTip, setShowTip] = useState(true);
  const [, setCurrentAnimation] = useState('pinch');
  const animationProgress = useRef(new Animated.Value(0));
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState({});
  const navigation = useNavigation();
  const statesScrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState(false);

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
        index = (index + 1) % animationOrder.length;
        playAnimation();
      });
    };

    playAnimation();
  };

  const loadStates = async () => {
    if (syncStatus.isSyncing) {
      console.log('🔄 Aguardando sincronização...');
      return;
    }

    if (syncStatus.isError) {
      setSyncError(true);
      Alert.alert(
        'Erro na sincronização',
        'Os dados não foram carregados corretamente. Deseja tentar novamente?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Tentar novamente',
            onPress: () => syncDatabase(setSyncStatus),
          },
        ]
      );
      return;
    }

    setSyncError(false);
    const sts = await getStates();
    setStates(sts);

    if (user?.state_id && sts.length > 0) {
      const foundState = await getStateById(user.state_id);
      setSelectedState(foundState);

      setTimeout(() => {
        const index = sts.findIndex((item) => item.id == user.state_id);
        if (index >= 0) handleScroll(index);
      }, 500);
    }
  };

  useEffect(() => {
    loadStates();
  }, [syncStatus]);

  const handleState = (id) => {
    const filter = states.filter((item) => item.id == id);
    setSelectedState(filter[0]);
    navigation.setOptions({ title: filter[0].name });
    const index = states.findIndex((item) => item.id == id);
    handleScroll(index);
  };

  const handleConfirm = async () => {
    if (syncError || syncStatus.isSyncing) return;

    setLoading(true);
    setUser({ ...user, state_id: selectedState.id });
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Main', { screen: 'Local' });
    }, 2000);
  };

  const handleScroll = (idx) => {
    if (!statesScrollViewRef.current || states.length === 0) return;

    setTimeout(() => {
      statesScrollViewRef.current?.scrollToIndex({
        animated: true,
        index: idx,
      });
    }, 300);
  };

  return (
    <View style={styles.container}>
      {showTip ? (
        <InstructionModal
          onConfirm={() => setShowTip(false)}
          buttonEnabled={!syncError && !syncStatus.isSyncing}
        />
      ) : syncStatus.isSyncing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={activeColors.accent} />
          <Text style={styles.loadingText}>Sincronizando dados...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.containerMap}>
            <MapScreen onPress={handleState} selected={selectedState?.id} />
          </View>
          <View style={styles.containerCards}>
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
              disabled={syncError || syncStatus.isSyncing || !selectedState?.id}
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
    container: { flex: 1, backgroundColor: colors.primary },
    containerMap: { flex: 2, marginVertical: 10 },
    containerCards: {
      paddingVertical: 20,
      backgroundColor: `${colors.accent}35`,
    },
    containerFooter: { padding: 10 },
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: { marginTop: 10, fontSize: 16, color: colors.text },
  });

export default MapStatesScreen;
