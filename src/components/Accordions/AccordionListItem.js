import React, { useContext, useState } from 'react';
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
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({ title, children, opened = false }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [expanded, setExpanded] = useState(opened);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Icon
          name={expanded ? 'close' : 'pencil'}
          size={24}
          color={activeColors.text}
        />
        <Text style={styles.title}>{!expanded ? title : 'Fechar'}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      // backgroundColor:colors.primary,
      marginBottom: 10,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 15,
      backgroundColor: colors.primary,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.accent,
      marginHorizontal:10
    },
    content: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      // backgroundColor: '#fff',
    },
  });

export default Accordion;
