import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import CustomButton from '../Buttons/CustomButton';

const ConfirmationModal = ({ isVisible, onCancel, onConfirm, phone }) => (
  <Modal isVisible={isVisible}>
    <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Remover contato
      </Text>
      <Text>{`Tem certeza que deseja remover o contato ${phone.number}?`}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <CustomButton label="Cancelar" onPress={onCancel} />
        <CustomButton label="Confirmar" onPress={onConfirm} />
      </View>
    </View>
  </Modal>
);

export default ConfirmationModal;
