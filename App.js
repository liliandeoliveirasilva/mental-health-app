import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';

// Import actual screen components
import HomeScreen from './screens/HomeScreen';
import DiaryScreen from './screens/DiaryScreen';
import MeditationScreen from './screens/MeditationScreen';
import RemindersScreen from './screens/RemindersScreen';
import CommunityScreen from './screens/CommunityScreen';
import ResourcesScreen from './screens/ResourcesScreen';

const Tab = createBottomTabNavigator();

// Custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    accent: '#64B5F6',
    background: '#F5F9FF',
  },
};

// Tab icons
const getTabIcon = (route, focused, color, size) => {
  let iconName;

  switch (route.name) {
    case 'Home':
      iconName = 'home';
      break;
    case 'Diário':
      iconName = 'book-open-variant';
      break;
    case 'Meditação':
      iconName = 'meditation';
      break;
    case 'Lembretes':
      iconName = 'bell';
      break;
    case 'Profissionais':
      iconName = 'doctor';
      break;
    case 'Comunidade':
      iconName = 'account-group';
      break;
    case 'Recursos':
      iconName = 'map-marker';
      break;
    default:
      iconName = 'help';
  }

  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => getTabIcon(route, focused, color, size),
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: '#9E9E9E',
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '500',
              paddingBottom: 2,
              marginTop: -4
            },
            tabBarStyle: {
              height: 80,
              paddingTop: 8,
              paddingBottom: 12,
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            headerShown: true,
            headerStyle: {
              backgroundColor: theme.colors.primary,
              height: 70,
            },
            headerTitleStyle: {
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '600'
            },
            headerTitleAlign: 'center',
            animation: 'fade',
            animationDuration: 300,
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                  extrapolate: 'clamp',
                }),
                transform: [
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.97, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            }),
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Diário" component={DiaryScreen} />
          <Tab.Screen name="Meditação" component={MeditationScreen} />
          <Tab.Screen name="Lembretes" component={RemindersScreen} />
          <Tab.Screen name="Comunidade" component={CommunityScreen} />
          <Tab.Screen name="Recursos" component={ResourcesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
