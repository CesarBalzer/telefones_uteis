import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class ContactItem extends PureComponent {
  render() {
    const { contact, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
          }}
        >
          <Text>{contact.value}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ContactItem;
