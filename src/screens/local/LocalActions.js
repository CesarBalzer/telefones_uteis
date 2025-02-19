import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LocalActions = ({ value, loading }) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size={30} color="#666" />
      ) : value === '' ? (
        <Icon
          name="magnify"
          size={30}
          color="#666"
          style={{ marginRight: 5 }}
        />
      ) : (
        <TouchableOpacity onPress={() => setSearchText('')}>
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

export default LocalActions;
