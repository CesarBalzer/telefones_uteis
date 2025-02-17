import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  LayoutAnimation,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
} from 'react-native';

const SearchBar = ({
  searchPlaceholder,
  onClear,
  onFocus,
  onBlur,
  onChangeText,
}) => {
  const inputRef = useRef(null);
  const [hasFocus, setHasFocus] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const focus = () => {
    inputRef.current.focus();
  };

  const blur = () => {
    inputRef.current.blur();
  };

  const clear = () => {
    inputRef.current.clear();
    onChangeText('');
    onClear();
  };

  const cancel = () => {
    blur();
  };

  const showLoaderFunc = () => {
    setShowLoader(true);
  };

  const hideLoader = () => {
    setShowLoader(false);
  };

  const handleFocus = () => {
    onFocus();
    LayoutAnimation.easeInEaseOut();
    setHasFocus(true);
  };

  const handleBlur = () => {
    onBlur();
    LayoutAnimation.easeInEaseOut();
    setHasFocus(false);
  };

  const handleTextChange = (text) => {
    onChangeText(text);
    setIsEmpty(text === '');
  };

  const {
    container,
    inputStyle,
    leftIconStyle,
    rightContainer,
    rightIconStyle,
    activityIndicator,
  } = styles;

  const inputStyleCollection = [inputStyle];

  if (hasFocus) inputStyleCollection.push({ flex: 1 });

  return (
    <TouchableWithoutFeedback onPress={focus}>
      <Animated.View style={container}>
        <View style={leftIconStyle}>
          <Text>🔍</Text>
        </View>
        <TextInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleTextChange}
          placeholder={searchPlaceholder}
          style={inputStyleCollection}
          placeholderTextColor="#515151"
          autoCorrect={false}
          ref={inputRef}
        />
        <View style={rightContainer}>
          {hasFocus && showLoader ? (
            <ActivityIndicator
              key="loading"
              style={activityIndicator}
              color="#515151"
            />
          ) : (
            <View />
          )}
          {hasFocus && !isEmpty ? (
            <TouchableOpacity onPress={clear}>
              <View style={rightIconStyle}>
                <Text>ⅹ</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    alignSelf: 'center',
    marginLeft: 5,
    height: 40,
    fontSize: 14,
  },
  leftIconStyle: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  rightContainer: {
    flexDirection: 'row',
  },
  rightIconStyle: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  activityIndicator: {
    marginRight: 5,
  },
});

export default SearchBar;
