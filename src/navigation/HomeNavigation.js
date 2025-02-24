import React, { useContext } from 'react';
import SettingsScreen from '../screens/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import FavoredScreen from '../screens/FavoredScreen';
import HomeScreen from '../screens/CountryScreen';
import ContactsScreen from '../screens/ContactsScreen';
import LocalScreen from '../screens/LocalScreen';

const HomeNavigation = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: activeColors.secondary,
        },
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = {
            Brasil: focused ? 'earth' : 'earth',
            Settings: focused ? 'tune' : 'tune',
            Contacts: focused ? 'contacts' : 'contacts-outline',
            Favored: focused ? 'heart' : 'heart-outline',
            Local: focused ? 'home' : 'home-outline',
          };

          const iconName =
            route && route.name && iconMap[route.name]
              ? iconMap[route.name]
              : 'star';

          return <Icon name={iconName} size={24} color={color} />;
        },

        tabBarActiveTintColor: activeColors.accent,
        tabBarInactiveTintColor: activeColors.tertiary,
        tabBarStyle: {
          backgroundColor: activeColors.secondary,
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {
          paddingLeft: 10,
          fontSize: 24,
        },
        headerStyle: {
          backgroundColor: activeColors.secondary,
        },
        headerTintColor: activeColors.tint,
      })}
    >
      <Tab.Screen
        name="Local"
        options={{ tabBarLabel: 'Local', title: 'Local' }}
        component={LocalScreen}
      />
      <Tab.Screen
        name="Brasil"
        options={{ tabBarLabel: 'Brasil' }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Contacts"
        options={{ tabBarLabel: 'Contatos' }}
        component={ContactsScreen}
      />
      <Tab.Screen
        name="Favored"
        options={{ tabBarLabel: 'Favoritos' }}
        component={FavoredScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{ tabBarLabel: 'Ajustes', title: 'Configurações' }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigation;
