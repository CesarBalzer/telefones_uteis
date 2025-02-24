import AsyncStorage from '@react-native-async-storage/async-storage';
import { name } from '../../app.json';

const PREFIX = `@${name}_storage`;

export const store = async (key, value) => {
  try {
    await AsyncStorage.setItem(generateKey(key), serialize(value));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const get = async (key) => {
  try {
    let raw = await AsyncStorage.getItem(generateKey(key));
    return unserialize(raw);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const remove = async (key) => {
  try {
    return await AsyncStorage.removeItem(generateKey(key));
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
};

export const generateKey = (key) => {
  return `${PREFIX}:${key}`;
};

export const serialize = (value) => {
  return JSON.stringify(value);
};

export const unserialize = (value) => {
  try {
    return JSON.parse(value || (value == 0 && value) || '');
  } catch (e) {
    return '';
  }
};

export const storeJson = async (key, value) => {
  try {
    await AsyncStorage.setItem(generateKey(key), JSON.stringify(value));
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getJson = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(generateKey(key));
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const StorageService = {
  store,
  get,
  remove,
  clear,
  storeJson,
  getJson,
  getAllKeys,
};

export default StorageService;
