import React from 'react';
import { View } from 'react-native';
import InputField from '../Inputs/InputField';
import SelectDropdownModal from '../Selects/SelectDropdownModal';

const PhoneForm = ({ phone, onChange }) => (
  <View style={{ padding: 20 }}>
    <InputField
      label="Título"
      value={phone.title}
      onChange={(text) => onChange('title', text)}
    />
    <InputField
      label="Número"
      value={phone.number}
      keyboardType="numeric"
      onChange={(text) => onChange('number', text)}
    />
    <SelectDropdownModal
      data={phone.categories}
      selected={phone.selectedCategory}
      onSelect={(item) => onChange('category', item)}
      label="Categoria"
    />
  </View>
);

export default PhoneForm;
