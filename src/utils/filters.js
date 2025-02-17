import React from 'react';
import { alagoas } from './datasets';

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const removeSpecialCharacters = (str) => {
  return str.replace(/[^0-9]/g, '');
};

const capitalizeFirstLetter = (str) => {
  const prepositions = [
    'of',
    'the',
    'and',
    'with',
    'a',
    'ante',
    'após',
    'até',
    'com',
    'contra',
    'de',
    'desde',
    'em',
    'entre',
    'para',
    'per',
    'perante',
    'por',
    'sem',
    'sob',
    'sobre',
    'trás',
  ];

  const words = str.toLowerCase().split(' ');
  const result = words.map((word, index) => {
    if (index === 0 || !prepositions.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    } else {
      return word;
    }
  });

  return result.join(' ');
};

const cleanArray = (array, cleanTitle = true, cleanNumber = true) => {
  const cleaned = [];
  const duplicates = [];
  const seenTitles = new Set();

  array.forEach((item) => {
    const cleanedItem = { ...item };

    if (cleanTitle) {
      cleanedItem.title = removeAccents(
        capitalizeFirstLetter(cleanedItem.title)
      );
    }

    if (cleanNumber) {
      cleanedItem.number = removeSpecialCharacters(cleanedItem.number);
    }

    if (seenTitles.has(cleanedItem.title)) {
      duplicates.push(cleanedItem);
    } else {
      seenTitles.add(cleanedItem.title);
      cleaned.push(cleanedItem);
    }
  });

  return { cleaned, duplicates };
};

const Filters = () => {
  const { cleaned, duplicates } = cleanArray(alagoas, true, true);
  console.log('Cleaned Array:', cleaned);
  console.log('Duplicate Array:', duplicates);
  // Do whatever you want with the cleanedArray, such as rendering or using it in some way.

  return <div>{/* Render or use the cleanedArray */}</div>;
};

export default Filters;
