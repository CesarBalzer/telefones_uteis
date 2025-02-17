import React, { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { storeData, getData } from '../config/asyncStorage';
import { colors } from '../config/theme';

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({ mode: Appearance.getColorScheme() });
  let activeColors = colors[theme.mode];

  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === 'dark' ? 'light' : 'dark';
      newTheme = { mode };
    }
    setTheme(newTheme);
    storeData('homeTheme', newTheme);
  };

  const fetchStoredTheme = async () => {
    try {
      const themeData = await getData('homeTheme');
      if (themeData) {
        updateTheme(themeData);
      }
    } catch ({ message }) {
      alert(message);
    }
  };

  useEffect(() => {
    fetchStoredTheme();
    Appearance.addChangeListener(({ colorScheme }) => {
      updateTheme();
      setTheme({ mode: colorScheme });
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
