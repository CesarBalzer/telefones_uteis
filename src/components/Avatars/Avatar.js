import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

const Avatar = ({
  img,
  placeholder,
  width,
  height,
  roundedImage = true,
  roundedPlaceholder = true,
  style,
}) => {
  const renderImage = () => {
    const { imageContainer, image } = styles;

    const viewStyle = [imageContainer];
    if (roundedImage)
      viewStyle.push({ borderRadius: Math.round(width + height) / 2 });
    return (
      <View style={viewStyle}>
        <Image style={image} source={img} />
      </View>
    );
  };

  const renderPlaceholder = () => {
    const { placeholderContainer, placeholderText } = styles;

    const viewStyle = [placeholderContainer];
    if (roundedPlaceholder)
      viewStyle.push({ borderRadius: Math.round(width + height) / 2 });

    return (
      <View style={viewStyle}>
        <View style={viewStyle}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            minimumFontScale={0.01}
            style={[{ fontSize: Math.round(width) / 2 }, placeholderText]}
          >
            {placeholder}
          </Text>
        </View>
      </View>
    );
  };

  const { container } = styles;
  return (
    <View style={[container, style, { width, height }]}>
      {img ? renderImage() : renderPlaceholder()}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    height: '100%',
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dddddd',
    height: '100%',
  },
  placeholderText: {
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default Avatar;
