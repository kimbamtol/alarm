import * as React from 'react';
import { useEffect } from 'react';
import { View, Text, Button, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Task from './components/Task';
import SignScreen from './components/Sign';
import LogScreen from './components/Log';
import messaging from '@react-native-firebase/messaging';

function HomeScreen({ navigation }) {
  return (
    <ImageBackground source={require('./assets/images/background1.jpg')} style={{ flex: 1, width: '100%', height: '100%' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button title="Login!" onPress={() => navigation.navigate('Log')} />
      </View>
    </ImageBackground>
  );
}

function MainScreen({ route, navigation }) {
  const { currentUser } = route.params;
  return (
    <Task name={currentUser} />
  );
}

const Stack = createNativeStackNavigator();

function App() {
  // 앱 시작시 Firebase 및 FCM 초기화
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await messaging().registerDeviceForRemoteMessages();
        console.log('Firebase 성공');
      } catch (error) {
        console.error('Firebase 오류:', error);
      }
    };

    initializeFirebase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Log" component={LogScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Sign" component={SignScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
