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
import { UserContext } from '../context/UserContext';
import { StyleSheet, View } from 'react-native';
const Main = ({ route, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  let activeColors = colors[theme.mode];

  const Tab = createBottomTabNavigator();

  return (
    <View style={styles.shadowContainer}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          animation: 'fade',
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

            return <Icon name={iconName} size={32} color={color} />;
          },
          tabBarLabelStyle: {
            fontSize: 14,
          },
          tabBarActiveTintColor: activeColors.accent,
          tabBarInactiveTintColor: activeColors.tertiary,
          tabBarStyle: {
            backgroundColor: activeColors.secondary,
            height: 70,
            borderTopWidth: 0,
            elevation: 10,
            paddingBottom:10
          },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            paddingLeft: 10,
            fontSize: 24,
          },
          headerStyle: {
            backgroundColor: activeColors.secondary,
            borderBottomWidth: 0, // Remove a borda inferior do cabeçalho
            elevation: 10, // Mantém a elevação máxima do Android
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
          options={{
            tabBarLabel: 'Contatos',
            title: 'Contatos',
          }}
          component={ContactsScreen}
        />
        <Tab.Screen
          name="Favored"
          options={{ tabBarLabel: 'Favoritos', title: 'Favoritos' }}
          component={FavoredScreen}
        />
        <Tab.Screen
          name="Settings"
          options={{ tabBarLabel: 'Ajustes', title: 'Configurações' }}
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  shadowStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.2)', // Cor da sombra
    borderRadius: 10, // Suaviza a sombra
    elevation: 10, // Mantém o máximo possível no Android
  },
});

export default Main;
