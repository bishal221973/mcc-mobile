import React, { useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import StackNavigation from './src/navigation/StackNavigation';
import Toast from 'react-native-toast-message';
import AuthMonitor from './src/services/AuthMonitor';
import {
  getMessaging,
  registerDeviceForRemoteMessages,
  getToken,
  onMessage,
} from '@react-native-firebase/messaging';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';import notifee, {
  AndroidImportance,
} from '@notifee/react-native';

const App = () => {

  /**
   * Create notification channel
   */
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  };

  /**
   * Request notification permission
   */
  const requestPermission = async () => {
    try {

      if (
        Platform.OS === 'android' &&
        Platform.Version >= 33
      ) {
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (res !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Notification Permission Denied');
          return;
        }
      }

      await requestToken();

    } catch (error) {
      console.log('Permission error:', error);
    }
  };

  /**
   * Get FCM token
   */
  const requestToken = async () => {
    try {
      const messaging = getMessaging();

      await registerDeviceForRemoteMessages(messaging);

      const token = await getToken(messaging);

      console.log('FCM TOKEN:', token);

      updateDeviceToken(token)
      // Send token to your Laravel backend here
      // await axios.post('/save-fcm-token', { token });

    } catch (error) {
      console.log('FCM Token Error:', error);
    }
  };


  const updateDeviceToken = async (fcmToken1) => {
    try {
      // Get FCM token
     
      console.log('FCM Token:', fcmToken1);

      // Get Bagisto customer auth token
      const authToken = await AsyncStorage.getItem('token');

      if (!authToken) {
        console.log('Customer auth token not found');
        return;
      }

      const response = await axios.post(
        `https://mccnp.com/api/v1/customer/device-token`,
        {
          device_token: fcmToken1,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Device token response:', response.data);

    } catch (error) {
      console.log(
        'FCM Token Error:',
        error.response?.status,
        error.response?.data || error.message
      );
    }
  };
  /**
   * Show notification when app is foreground
   */
  const showForegroundNotification = async (remoteMessage) => {
    try {

      const title =
        remoteMessage?.notification?.title ||
        remoteMessage?.data?.title ||
        'New Notification';

      const body =
        remoteMessage?.notification?.body ||
        remoteMessage?.data?.body ||
        'You have a new notification';

      await notifee.displayNotification({
        title: title,
        body: body,

        android: {
          channelId: 'default',

          importance: AndroidImportance.HIGH,

          sound: 'default',

          pressAction: {
            id: 'default',
          },

          smallIcon: 'ic_launcher',
        },
      });

    } catch (error) {
      console.log(
        'Foreground notification error:',
        error
      );
    }
  };

  /**
   * Initialize notification
   */
  useEffect(() => {

    const initNotifications = async () => {
      await createNotificationChannel();
      await requestPermission();
    };

    initNotifications();

  }, []);

  /**
   * Foreground FCM message
   */
  useEffect(() => {

    const messaging = getMessaging();

    const unsubscribe = onMessage(
      messaging,
      async remoteMessage => {

        console.log(
          'Foreground message:',
          JSON.stringify(remoteMessage, null, 2)
        );

        await showForegroundNotification(
          remoteMessage
        );
      }
    );

    return unsubscribe;

  }, []);

  /**
   * Auth monitor
   */
  useEffect(() => {

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