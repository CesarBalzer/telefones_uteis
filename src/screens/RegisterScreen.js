import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';

import DatePicker from 'react-native-date-picker';

import InputField from '../components/Inputs/InputField';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomButton from '../components/Buttons/CustomButton';

const RegisterScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState('Date of Birth');

  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <SafeAreaView
      style={{
        backgroundColor: activeColors.primary,
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 50, marginTop: 5 }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../images/register.png')}
            style={{
              height: 180,
              width: 200,
              transform: [{ rotate: '-5deg' }],
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: activeColors.secondary,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <Icon name="google" size={24} color={activeColors.danger} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: activeColors.secondary,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
          >
            <Icon name="facebook" size={24} color={activeColors.info} />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            textAlign: 'center',
            color: activeColors.tint,
            marginBottom: 30,
          }}
        >
          Or, register with email ...
        </Text>

        <InputField
          label={'Nome completo'}
          icon={
            <Icon
              name="account-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
        />

        <InputField
          label={'E-mail'}
          icon={
            <Icon
              name="email-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          keyboardType="email-address"
        />

        <InputField
          label={'Senha'}
          icon={
            <Icon
              name="lock-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
        />

        <InputField
          label={'Repita a senha'}
          icon={
            <Icon
              name="lock-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          inputType="password"
        />

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}
        >
          <Icon
            name="calendar-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={{ color: '#666', marginLeft: 5, marginTop: 5 }}>
              {dobLabel}
            </Text>
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          open={open}
          date={date}
          mode={'date'}
          maximumDate={new Date('2015-01-01')}
          minimumDate={new Date('1980-01-01')}
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
            setDobLabel(date.toDateString());
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <CustomButton
          size="large"
          label={'Register'}
          type="primary"
          // onPress={handleSubmit}
          // disabled={loading}
          // loading={loading}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 30,
          }}
        >
          <Text style={{ color: activeColors.tint }}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: activeColors.accent, fontWeight: '700' }}>
              {' '}
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
