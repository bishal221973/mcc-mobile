import React, { useEffect } from 'react';
import { Alert, StyleSheet, PermissionsAndroid } from 'react-native';
import StackNavigation from './src/navigation/StackNavigation';
import Toast from 'react-native-toast-message';
import AuthMonitor from './src/services/AuthMonitor';
import {
  getMessaging,
  registerDeviceForRemoteMessages,
  getToken,
} from '@react-native-firebase/messaging';
const App = () => {

  const requestPermission = async () => {
    try {
      const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

      if (res == PermissionsAndroid.RESULTS.GRANTED) {
        // Reques for tokkken
        requestToken();
      } else {
        Alert.alert("Permission Denied");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const requestToken = async () => {
    try {
      const messaging = getMessaging();
      // Optional: not needed in most cases, and a no-op if already registered.
      await registerDeviceForRemoteMessages(messaging);
      const token = await getToken(messaging);

      console.log(token)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    // Alert.alert("ss",'ada')
    AuthMonitor.start();

    return () => {
      AuthMonitor.stop();
    };
  }, []);

  return (
    <>
      <StackNavigation />
      <Toast />
    </>
  );
};

export default App;

const styles = StyleSheet.create({});