import React, { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const AccordionListItem = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={style.container}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(!expanded);
        }}
      >
        <Icon
          name={'arrow-down-drop-circle-outline'}
          size={30}
          color={'yellowgreen'}
        />
        {/* <Text>Press me to {expanded ? 'collapse' : 'expand'}!</Text> */}
      </TouchableOpacity>
      {expanded && (
        <View style={style.tile}>
          <Text>I disappear sometimes!</Text>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  tile: {
    backgroundColor: 'lightgrey',
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 20,
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // backgroundColor: 'red',
    flexDirection: 'column',
  },
});

export default AccordionListItem;
