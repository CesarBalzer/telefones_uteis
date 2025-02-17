import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HeaderRightButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name="account-plus" size={24} color="white" />
      <Text style={{ marginLeft: 5, color: 'white' }}>Criar novo</Text>
    </View>
  </TouchableOpacity>
);

export default HeaderRightButton;
