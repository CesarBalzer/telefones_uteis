import { StyleSheet } from 'react-native';
import { colors } from '../../config/theme';


const createStyles = (theme) => {
  const activeColors = colors[theme.mode]; // Use o tema dinâmico aqui

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: activeColors.background,
      padding: 10,
    },
    header: {
      backgroundColor: activeColors.accent,
      borderRadius: 10,
      marginTop: 40,
      marginHorizontal: 20,
      shadowColor: activeColors.shadow,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
    },
    imageHeader: {
      alignItems: 'center',
    },
    image: {
      height: 80,
      width: 80,
      marginTop: -40,
      shadowColor: activeColors.shadow,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
    },
    titleHeader: {
      alignItems: 'center',
      padding: 20,
    },
    textHeader: {
      color: activeColors.secondary,
      fontSize: 18,
      fontWeight: '600',
    },
    actionsHeader: {
      width: 50,
      height: 50,
      backgroundColor: activeColors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
      elevation: 5,
      shadowColor: activeColors.text,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    body: {
      marginTop: 20,
      flex: 1,
      alignContent: 'flex-start',
    },
    section: {
      backgroundColor: 'transparent',
      marginHorizontal: 30,
      marginVertical: 10,
    },
    footer: {
      marginBottom: 40,
      marginHorizontal: 20,
      marginTop: 20,
    },
    modalContent: {
      backgroundColor: activeColors.primary,
      borderRadius: 10,
      padding: 20,
    },
    titleText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: activeColors.text,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    switchLabel: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    swithText: {
      fontSize: 18,
      color: activeColors.accent,
      paddingLeft: 9,
    },
  });
};

export default createStyles;
