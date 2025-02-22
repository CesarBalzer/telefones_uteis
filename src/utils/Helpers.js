

// console.log(Helpers.validatePhoneNumber('(11) 91234-5678')); // Returns "11912345678"
// console.log(Helpers.validatePhoneNumber('21987654321', { onlyMobile: true })); // Returns "21987654321"
// console.log(Helpers.validatePhoneNumber('1134567890', { onlyLandline: true })); // Returns "1134567890"
// console.log(Helpers.validatePhoneNumber('99987654321')); // Returns false (invalid DDD)
// console.log(Helpers.validatePhoneNumber('08001234567')); // Returns "08001234567" (valid toll-free number)
// console.log(Helpers.validatePhoneNumber('40041234')); // Returns "40041234" (valid special number)



const areaCodes = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 64, 63,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
];

const landlinePrefixes = ['2', '3', '4', '5'];

export const clearString = (str) => {
  if (!str) return '';

  return str
    .replace(/[^\p{L}\p{N}\s.,]/gu, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export const getAvatarInitials = (text) => {
  if (!text) return '';

  const words = text.trim().split(' ');

  if (words.length <= 1) return words[0].charAt(0);

  return words[0].charAt(0) + words[words.length - 1].charAt(0);
};

// Removes emojis and non-alphabetic characters, keeping only letters and spaces
export const cleanName = (name) => {
  return name.replace(/[^a-zA-Z\s]/g, '').trim();
};

export const normalizeText = (text) => {
  if (typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const validatePhoneNumber = (phone, options = {}) => {
  if (!phone || typeof phone !== 'string') return false;

  let cleanNumber = phone.replace(/\D/g, '');

  // Check if it's a special number (190, 192, 193, 0800, 3003, 4004)
  if (
    /^(190|192|193|197|198|199|0800\d{6,7}|3003\d{4}|4004\d{4})$/.test(
      cleanNumber
    )
  ) {
    return cleanNumber;
  }

  if (cleanNumber.length === 12 || cleanNumber.length === 13) {
    if (cleanNumber.startsWith('55')) {
      cleanNumber = cleanNumber.substring(2);
    } else {
      return false;
    }
  }

  if (cleanNumber.length < 10 || cleanNumber.length > 11) return false;

  if (options.onlyMobile && cleanNumber.length === 10) return false; 
  if (options.onlyLandline && cleanNumber.length === 11) return false;

  if (cleanNumber.length === 11) {
    if (cleanNumber[2] !== '9') return false;
    if (cleanNumber[3] === '0') return false;
  } else if (!landlinePrefixes.includes(cleanNumber[2])) {
    return false;
  }

  const ddd = parseInt(cleanNumber.substring(0, 2), 10);
  if (!areaCodes.includes(ddd)) return false;

  if (options.onlyAreaCodes && !options.onlyAreaCodes.includes(String(ddd)))
    return false;

  return cleanNumber;
};

const Helpers = {
  clearString,
  getAvatarInitials,
  cleanName,
  normalizeText,
  validatePhoneNumber,
};

export default Helpers;
