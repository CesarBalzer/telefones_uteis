import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { colors } from '../../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const CustomModal = forwardRef(({ children }, ref) => {
  console.log('CUSTOM MODAL => ', isVisible, children);

  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);
  const [isVisible, setIsVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    toggleModal: () => {
      setIsVisible(!isVisible);
    },
  }));

  return (
    <Modal
      isVisible={isVisible}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        {children}
        <View style={styles.modalFooter}>
          <Button title="Hide modal" onPress={() => setIsVisible(false)} />
        </View>
      </View>
    </Modal>
  );
});
const createStyles = (colors) => {
  const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 20,
      width: '80%',
    },
    modalFooter: {
      alignItems: 'flex-end',
    },
  });
  return styles;
};
export default CustomModal;
