import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from '../Avatars/Avatar';
import PermissionService from '../../services/PermissionService';
import { formatPhoneNumber, validatePhoneNumber } from '../../utils/Helpers';

const ContactCard = ({ data, onEdit, onCall }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  useEffect(() => {
    PermissionService.requestPermissions();
  }, []);

  const handleEdit = (id) => {
    onEdit && onEdit(id);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{7,14}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleCall = async () => {
    const phoneNumber = validatePhoneNumber(data?.phoneNumbers?.[0]?.number);
    console.log('HANDLECALL => ', phoneNumber);
    // if (phoneNumber && isValidPhoneNumber(phoneNumber)) {
    //   onCall(phoneNumber);
    // } else {
    //   Alert.alert('Erro', 'O contato não possui um número de telefone válido.');
    // }
  };

  const FavoredIcon = () => {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: activeColors.info,
          width: 15,
          height: 15,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: 10,
          borderBottomEndRadius: 10,
        }}
      >
        <Icon size={10} name="star" color={activeColors.light} />
      </View>
    );
  };

  const getAvatarInitials = (textString) => {
    if (!textString) return '';

    const text = textString.trim();
    const textSplit = text.split(' ');

    if (textSplit.length <= 1) {
      return Array.from(text)[0];
    }

    const firstNameInitial = Array.from(textSplit[0])[0];
    const lastNameInitial = Array.from(textSplit[textSplit.length - 1])[0];

    return firstNameInitial + lastNameInitial;
  };

  return (
    <TouchableOpacity
      style={styles.containerItem}
      onPress={() => handleEdit(data)}
    >
      <View style={styles.container}>
        <>{data && data.favored === 1 ? <FavoredIcon /> : ''}</>
        <>{data && data.isStarred ? <FavoredIcon /> : ''}</>
        <View style={styles.containerImage}>
          <Avatar
            style={styles.image}
            img={data.hasThumbnail ? { uri: data.thumbnailPath } : undefined}
            placeholder={getAvatarInitials(
              `${data.givenName || ''} ${data.familyName || ''}`
            )}
            width={50}
            height={50}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text
            style={[styles.title, { color: activeColors.text }]}
            numberOfLines={1}
          >
            {data.value}
          </Text>
          {data.phoneNumbers.map((item, idx) => (
            <Text
              key={idx}
              style={[
                styles.number,
                {
                  color: idx === 0 ? activeColors.accent : activeColors.text,
                  fontSize: idx === 0 ? 18 : 14,
                },
              ]}
              numberOfLines={1}
            >
              {item.number}
            </Text>
          ))}

          <Text
            style={[styles.description, { color: activeColors.tertiary }]}
            numberOfLines={2}
          >
            {data.description}
          </Text>
        </View>
        <View style={styles.containerActions}>
          <TouchableOpacity onPress={handleCall}>
            <View style={styles.buttonCall}>
              <Icon name={'phone'} size={32} color={activeColors.success} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    containerItem: { backgroundColor: colors.primary },
    container: {
      backgroundColor: colors.secondary,
      borderRadius: 10,
      flexDirection: 'row',
      marginHorizontal: 10,
      marginVertical: 6,
    },
    containerImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      marginLeft: 10,
    },
    containerActions: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      padding: 10,
      justifyContent: 'center',
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    number: {
      fontWeight: '600',
      marginBottom: 5,
      color: colors,
    },
    description: {
      fontSize: 12,
      color: 'red',
      flexWrap: 'wrap',
      overflow: 'hidden',
      lineHeight: 12,
      maxHeight: 36,
    },
    buttonCall: {
      width: 50,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      padding: 6,
    },
  });
  return styles;
};

export default ContactCard;
