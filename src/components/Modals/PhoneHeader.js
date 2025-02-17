import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PhoneHeader = ({ phone, onRemove }) => {
  return (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Image
        source={{ uri: `asset:/icons/${phone.icon || 'default.png'}` }}
        style={{ height: 80, width: 80, borderRadius: 40 }}
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>
        {phone.title}
      </Text>
      <TouchableOpacity onPress={onRemove}>
        <Icon name="phone-remove" size={28} color="red" />
        <Text>Remover Contato</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhoneHeader;
