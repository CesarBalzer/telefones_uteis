export const clearString = (str) => {
  if (!str) return;

  return str
    .replace(/[^\p{L}\p{N}\s.,]/gu, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export const getAvatarInitials = (textString) => {
  if (!textString) return '';

  const text = textString.trim();
  const textSplit = text.split(' ');

  if (textSplit.length <= 1) return text.charAt(0);

  return textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
};

// Remove emojis e caracteres não alfabéticos, mantendo apenas letras e espaços
export const cleanName = (name) => {
  return name.replace(/[^a-zA-Z\s]/g, '').trim();
};

export const normalizeText = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  console.log('TEXT => ', text);
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const Helpers = {
  clearString,
  getAvatarInitials,
  cleanName,
  normalizeText,
};

export default Helpers;
