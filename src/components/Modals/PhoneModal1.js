import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import createStyles from './styles';
import usePhoneState from '../../hooks/usePhoneState';
import PhoneHeader from './PhoneHeader';
import PhoneForm from './PhoneForm';
import ConfirmationModal from './ConfirmationModal';

const PhoneModal = ({ data, onConfirm }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const {
    phone,
    handleChange,
    handleConfirm,
    handleRemove,
    isModalVisible,
    toggleModal,
  } = usePhoneState(data);

  return (
    <ScrollView>
      <View style={styles.container}>
        <PhoneHeader phone={phone} onRemove={toggleModal} />
        <PhoneForm phone={phone} onChange={handleChange} />
        <ConfirmationModal
          isVisible={isModalVisible}
          onCancel={toggleModal}
          onConfirm={handleRemove}
          phone={phone}
        />
      </View>
    </ScrollView>
  );
};

export default PhoneModal;
