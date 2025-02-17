import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ItemCon = ({
  leftElement,
  title,
  description,
  rightElement,
  rightText,
  onPress,
  onDelete,
  onLongPress,
  disabled,
}) => {
  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  const Component = onPress || onLongPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={styles.container}
      underlayColor="#f2f3f5"
    >
      <View style={styles.itemContainer}>
        {leftElement && (
          <View style={styles.leftElementContainer}>{leftElement}</View>
        )}
        <View style={styles.rightSectionContainer}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.titleStyle}>{title}</Text>
            {description && (
              <Text style={styles.descriptionStyle}>{description}</Text>
            )}
          </View>
          <View style={styles.rightTextContainer}>
            {rightText && <Text>{rightText}</Text>}
          </View>
          {rightElement && (
            <View style={styles.rightElementContainer}>{rightElement}</View>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    minHeight: 44,
    height: 63,
  },
  leftElementContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    paddingLeft: 13,
  },
  rightSectionContainer: {
    marginLeft: 18,
    flexDirection: 'row',
    flex: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#515151',
  },
  mainTitleContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  rightElementContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
  },
  rightTextContainer: {
    justifyContent: 'center',
    marginRight: 10,
  },
  titleStyle: {
    fontSize: 16,
  },
  descriptionStyle: {
    fontSize: 14,
    color: '#515151',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef5350',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ItemCon;
