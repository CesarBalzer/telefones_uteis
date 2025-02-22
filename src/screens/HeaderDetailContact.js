import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import Avatar from '../components/Avatars/Avatar';
import { getAvatarInitials } from '../utils/Helpers';

const HeaderDetailContact = ({ phone, onRemove, onEdit, onShortcut, onCall }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  return (
    <View style={styles.header}>
      <View style={styles.imageHeader}>
        <Avatar
          img={phone?.hasThumbnail ? { uri: phone.thumbnailPath } : undefined}
          placeholder={getAvatarInitials(`${phone?.givenName || ''} ${phone?.familyName || ''}`)}
          width={180}
          height={180}
          style={styles.image}
        />
      </View>
      <View style={styles.titleHeader}>
        <Text style={styles.textHeader}>{phone?.displayName}</Text>
      </View>
      <View style={styles.containerActions}>
        <ActionButton
          styles={styles}
          onPress={onShortcut}
          icon="phone-return-outline"
          text="Criar atalho"
          color={activeColors.info}
        />
        {/* <ActionButton
          styles={styles}
          onPress={onEdit}
          icon="pencil"
          text="Editar"
          color={activeColors.warning}
        /> */}
        {/* <ActionButton
          styles={styles}
          onPress={onRemove}
          icon="phone-remove"
          text="Excluir"
          color={activeColors.danger}
        /> */}
        <ActionButton
          styles={styles}
          onPress={() => onCall(phone?.phoneNumbers?.[0]?.number || null)}
          icon="phone"
          text="Ligar"
          color={activeColors.success}
        />
      </View>
    </View>
  );
};

const ActionButton = ({ styles, onPress, icon, text, color }) => (
  <View style={styles.containerButton}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.actionsHeader}>
        <Icon name={icon} size={28} color={color} />
      </View>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  </View>
);

const createStyles = (colors) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.accent,
      marginTop: 40,
    },
    imageHeader: {
      alignItems: 'center',
    },
    image: {
      height: 180,
      width: 180,
      marginTop: -40,
    },
    titleHeader: {
      alignItems: 'center',
      padding: 20,
    },
    textHeader: {
      color: colors.secondary,
      fontSize: 18,
      fontWeight: '600',
    },
    containerActions: {
      backgroundColor: 'transparent',
      padding: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    containerButton: {
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
      alignItems: 'center',
    },
    button: {
      alignItems: 'center',
    },
    actionsHeader: {
      width: 75,
      height: 75,
      backgroundColor: colors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    buttonText: {
      color: colors.secondary,
      fontSize: 14,
      textAlign: 'center',
    },
  });

export default HeaderDetailContact;
