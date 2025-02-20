import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActionIconSearch = ({ value, setValue, onReset }) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {value === '' ? (
        <Icon
          name="magnify"
          size={30}
          color="#666"
          style={{ marginRight: 5 }}
        />
      ) : (
        <TouchableOpacity onPress={onReset}>
          <Icon
            name="close"
            size={30}
            color="#666"
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ActionIconSearch;
