import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../config/theme';
import { ThemeContext } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AccordionListItem from '../Accordions/AccordionListItem';

const CardComponent = ({
  imageSource,
  title,
  number,
  description,
  categoryId,
  ddd,
}) => {
  // console.log('IMAGESOURCE => ', imageSource);
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  // return <AccordionListItem />;

  return (
    <View>
      <View
        style={[styles.container, { backgroundColor: activeColors.secondary }]}
      >
        {/* <Image style={styles.image} source={imageSource} /> */}
        <View
          style={{
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: activeColors.tertiary,
            borderRadius: 10,
          }}
        >
          <Icon name={imageSource} size={24} color={activeColors.accent} />
        </View>
        <View style={styles.contentContainer}>
          <Text
            style={[styles.title, { color: activeColors.text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={[styles.number, { color: activeColors.accent }]}
            numberOfLines={1}
          >
            {!!ddd ? `${ddd} ${number}` : number}
          </Text>
          <Text
            style={[styles.description, { color: activeColors.tertiary }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                backgroundColor: activeColors.primary,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 5,
                marginHorizontal: 5,
              }}
            >
              <Icon name={'phone'} size={24} color={activeColors.accent} />
            </View>
          </TouchableOpacity>
          {/* <AccordionListItem /> */}
          <TouchableOpacity>
            <View
              style={{
                width: 36,
                height: 36,
                backgroundColor: activeColors.primary,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 5,
                marginHorizontal: 5,
              }}
            >
              <Icon
                name={'pencil-plus-outline'}
                size={24}
                color={activeColors.info}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {/* <Text>
          The standard chunk of Lorem Ipsum used since the 1500s is reproduced
          below for those interested.
        </Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    margin: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
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
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    color: colors,
  },
  description: {
    fontSize: 12,
    color: '#777',
    flexWrap: 'wrap', // Add this line to wrap the text
    overflow: 'hidden', // Add this line to hide overflowing text
    lineHeight: 10, // Add this line to improve line spacing
    maxHeight: 36, // Add this line to limit the number of lines to 2
  },
});

export default CardComponent;
