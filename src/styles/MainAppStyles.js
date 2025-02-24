import { StyleSheet } from 'react-native';

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    errorText: {
      marginBottom: 20,
      color: colors.danger,
    },
  });

export default createStyles;
