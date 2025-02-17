import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatars/Avatar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';
import { getAvatarInitials } from '../utils/Helpers';

const HeaderDetailContact = ({
  phone,
  onRemove,
  onEdit,
  onShortcut,
  onCall,
}) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  return (
    <View style={styles.header}>
      <View style={styles.imageHeader}>
        <Avatar
          img={phone?.hasThumbnail ? { uri: phone.thumbnailPath } : undefined}
          placeholder={getAvatarInitials(
            `${phone?.givenName || ''} ${phone?.familyName || ''}`
          )}
          width={150}
          height={150}
          style={styles.image}
        />
      </View>
      <View style={styles.titleHeader}>
        <Text style={styles.textHeader}>{phone?.displayName}</Text>
      </View>
      <View
        style={{
          backgroundColor: 'transparent',
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <View>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={onShortcut}
          >
            <View style={styles.actionsHeader}>
              <Icon
                name={'phone-return-outline'}
                size={28}
                color={activeColors.warning}
              />
            </View>
            <Text
              style={{
                color: activeColors.secondary,
                paddingTop: 5,
                fontSize: 18,
              }}
            >
              Criar atalho
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={onEdit}>
            <View style={styles.actionsHeader}>
              <Icon name={'pencil'} size={28} color={activeColors.info} />
            </View>
            <Text
              style={{
                color: activeColors.secondary,
                paddingTop: 5,
                fontSize: 18,
              }}
            >
              Editar
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={onRemove}>
            <View style={styles.actionsHeader}>
              <Icon
                name={'phone-remove'}
                size={28}
                color={activeColors.danger}
              />
            </View>
            <Text
              style={{
                color: activeColors.secondary,
                paddingTop: 5,
                fontSize: 18,
              }}
            >
              Excluir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: 20, paddingVertical: 0 }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: activeColors.success,
            padding: 10,
          }}
          onPress={() =>
            onCall(
              phone && phone.phoneNumbers ? phone.phoneNumbers[0].number : '#'
            )
          }
        >
          <View style={{}}>
            <Icon name={'phone'} size={50} color={activeColors.light} />
          </View>
          <Text
            style={{
              color: activeColors.secondary,
              paddingTop: 5,
              fontSize: 18,
            }}
          >
            Ligar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    header: {
      backgroundColor: colors.accent,
      marginBottom: 20,
    },
    imageHeader: {
      alignItems: 'center',
    },
    image: {
      height: 80,
      width: 80,
      marginTop: 0,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      // backgroundColor: 'transparent',
    },
    titleHeader: {
      alignItems: 'center',
      padding: 10,
    },
    textHeader: {
      color: colors.secondary,
      fontSize: 18,
      fontWeight: '600',
    },
    actionsHeader: {
      width: 50,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
      elevation: 5,
      shadowColor: colors.text,
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },

    body: { marginTop: 20, flex: 1, alignContent: 'flex-start' },
    sectionPhone: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: 30,
      marginVertical: 20,
    },
    phone: { flex: 1 },
    section: {
      backgroundColor: 'transparent',
      marginHorizontal: 30,
      marginVertical: 10,
    },
    footer: { marginBottom: 40, marginHorizontal: 20, marginTop: 20 },
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 20,
      width: '80%',
    },
    modalHeader: {
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondary,
      paddingBottom: 10,
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    modalBody: {
      marginBottom: 20,
    },
    subtitleText: {
      fontSize: 16,
      color: colors.text,
    },
    descriptionText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: 'bold',
    },
    descriptionTiny: {
      paddingVertical: 20,
      fontSize: 12,
      color: colors.danger,
      fontWeight: 'bold',
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    switchContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    switchLabel: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    swithText: {
      fontSize: 18,
      color: colors.accent,
      paddingLeft: 9,
    },
    swithTextOn: {
      fontWeight: 'bold',
    },
    swithToggle: {},
  });
  return styles;
};

export default HeaderDetailContact;
