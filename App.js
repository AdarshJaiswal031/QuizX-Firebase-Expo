import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Quiz from './app/Quiz';
import Nav from './app/Nav';
import Home from './app/Home';
import { React, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import LiveQuiz from './app/LiveQuiz';
import QuestionForm from './app/QuestionForm';
import ProfilePage from './app/ProfilePage';
import CoinRedeemPage from './app/CoinRedeemPage';
import Login from './app/Login';

// const navigation = useNavigation();
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer style={styles.navigationContainer}>

      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LiveQuiz" component={LiveQuiz} />
        <Stack.Screen name="CoinRedeemPage" component={CoinRedeemPage} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="QuestionForm" component={QuestionForm} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} />
      </Stack.Navigator>
      <Nav />
      <StatusBar style="light" />
      {/* </View> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16161e",

    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationCol: {
    flex: 1,
    backgroundColor: "white",

    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    flex: 1, // Make sure NavigationContainer takes up the full available space
    backgroundColor: 'red', // Background color for NavigationContainer
    // Add more custom styles here as needed
  },
});
