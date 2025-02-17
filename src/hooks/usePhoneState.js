import { useState, useEffect } from 'react';

const usePhoneState = (initialData, onConfirm) => {
  const [phone, setPhone] = useState(initialData);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleChange = (field, value) => {
    setPhone((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemove = () => {
    toggleModal();
    console.log('Contato removido:', phone);
  };

  const handleConfirm = () => {
    onConfirm(phone);
  };

  useEffect(() => {
    console.log('Estado inicial do telefone carregado.');
  }, []);

  return {
    phone,
    isModalVisible,
    toggleModal,
    handleChange,
    handleRemove,
    handleConfirm,
  };
};

export default usePhoneState;
