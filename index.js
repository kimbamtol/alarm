import { registerRootComponent } from 'expo';
import App from './App';
import PushNotification from 'react-native-push-notification';

// 앱이 시작될 때 실행되는 함수
const onAppStart = () => {
    PushNotification.localNotification({
        message: '앱이 시작되었습니다!',
    });
};

// 앱이 시작될 때 실행되는 함수 호출
onAppStart();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
