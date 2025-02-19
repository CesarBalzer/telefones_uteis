import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../../context/ThemeContext';
import { UserContext } from '../../context/UserContext';
import { colors } from '../../config/theme';
import Intro_2 from '../../assets/svgs/Intro_2';
import Intro_3 from '../../assets/svgs/Intro_3';
import Intro_4 from '../../assets/svgs/Intro_4';
import Intro_5 from '../../assets/svgs/Intro_5';

const Intro1 = require('../../assets/intro_1.png');
const WINDOW_DIMENSIONS = Dimensions.get('window');

const AppIntro = () => {
  const { theme } = useContext(ThemeContext);
  const { user, setUser } = useContext(UserContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors, WINDOW_DIMENSIONS);

  const ImageIntro_1 = () => (
    <Image
      source={Intro1}
      resizeMode={'contain'}
      style={{
        width: 500,
        height: 350,
        marginTop: 1,
        backgroundColor: 'transparent',
      }}
    />
  );

  const intro = [
    {
      key: '1',
      title: 'Bem-vindo(a)!',
      text: 'O Telefones Úteis Emergências é seu companheiro para situações importantes, oferecendo acesso rápido a contatos essenciais em todo o Brasil.',
      icon: <ImageIntro_1 />,
      colors: [activeColors.text, activeColors.accent],
    },
    {
      key: '2',
      title: 'Assistência Imediata',
      text: 'Encontre números de emergência com facilidade e faça chamadas em poucos toques.',
      icon: <Intro_2 />,
      colors: [activeColors.text, activeColors.accent],
    },
    {
      key: '3',
      title: 'Acesso Simples',
      text: 'Conecte-se diretamente a serviços de emergência e públicos sempre que precisar.',
      icon: <Intro_3 />,
      colors: [activeColors.text, activeColors.accent],
    },
    {
      key: '4',
      title: 'Atalhos Personalizados',
      text: 'Crie atalhos na tela inicial para ligar rapidamente para seus contatos de emergência.',
      icon: <Intro_4 />,
      colors: [activeColors.text, activeColors.accent],
    },
    {
      key: '5',
      title: 'Configuração Rápida',
      text: 'Escolha o estado brasileiro padrão para personalizar sua experiência. Toque no botão verde para começar!',
      icon: <Intro_5 />,
      colors: [activeColors.text, activeColors.accent],
    },
  ];

  const finish = async () => {
    setUser({ ...user, welcome: true });
  };

  const renderItem = (props) => {
    const { item, index } = props;

    return (
      <View style={styles.mainContent}>
        <View style={styles.containerImage}>{item.icon}</View>
        <View style={styles.containerText}>
          <Text style={styles.title}>{item.title.toUpperCase()}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon size={50} name={'chevron-left'} style={styles.icon} />
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon size={50} name={'chevron-right'} style={styles.icon} />
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonDone}>
        <Icon size={50} name={'check'} style={styles.iconSucess} />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={
        theme.mode !== 'dark'
          ? [activeColors.accent, activeColors.secondary]
          : [activeColors.secondary, activeColors.accent]
      }
      start={{ x: 0.4, y: 1 }}
      end={{ x: 1, y: 0.5 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <AppIntroSlider
          style={{ marginTop: 10 }}
          data={intro}
          renderItem={renderItem}
          showPrevButton={true}
          showNextButton={true}
          renderPrevButton={renderPrevButton}
          renderNextButton={renderNextButton}
          renderDoneButton={renderDoneButton}
          onDone={finish}
        />
      </View>
    </LinearGradient>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    mainContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
    },
    containerImage: {
      flex: 1,
      marginTop: 80,
    },
    image: {},
    containerText: {
      flex: 1,
    },
    title: {
      fontSize: 22,
      color: colors.text,
      backgroundColor: 'transparent',
      textAlign: 'center',
      fontWeight: '700',
    },
    text: {
      fontSize: 18,
      fontWeight: 400,
      lineHeight: 28,
      color: colors.text,
      backgroundColor: 'transparent',
      textAlign: 'center',
      paddingHorizontal: 20,
      marginTop: 20,
    },
    buttonCircle: {
      width: 50,
      height: 50,
      backgroundColor: `${colors.tertiary}10`,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonDone: {
      width: 60,
      height: 60,
      backgroundColor: `${colors.success}`,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    icon: {
      color: colors.accent,
    },
    iconSucess: {
      color: colors.secondary,
    },
  });
  return styles;
};

export default AppIntro;
