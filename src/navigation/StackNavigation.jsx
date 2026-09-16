import { StyleSheet, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import Login from '../screen/Login'
import Splash from '../screen/Splash'
import Signup from '../screen/Signup'
import TabNavigation from './TabNavigation'
import DrawerNavigation from './DrawerNavigation';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProductShow from "../screen/auth/ProductShow"
import FilteredProducts from "../screen/auth/FilteredProducts"
import AllProduct from "../screen/auth/AllProduct"
import Checkout from "../screen/auth/Checkout"
import OrderShow from "../screen/auth/OrderShow"
import {
  getMessaging,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

import { navigationRef } from './../services/navigationRef';


const Stack = createNativeStackNavigator();


const StackNavigation = () => {

  useEffect(() => {
    const messagingInstance = getMessaging();

    console.log('Firebase messaging initialized');

    // App was in background and notification was clicked
    const unsubscribe = onNotificationOpenedApp(
      messagingInstance,
      remoteMessage => {
        console.log(
          'Notification clicked:',
          remoteMessage
        );

        if (navigationRef.isReady()) {
          navigationRef.navigate('Drawer');
        }
      }
    );

    // App was completely closed and opened from notification
    getInitialNotification(messagingInstance)
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'App opened from notification:',
            remoteMessage
          );

          if (navigationRef.isReady()) {
            navigationRef.navigate('Drawer');
          }
        }
      })
      .catch(error => {
        console.log(
          'Initial notification error:',
          error
        );
      });

    return unsubscribe;
  }, []);
  return (
<NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />


        <Stack.Screen name="Drawer" component={DrawerNavigation} />
        <Stack.Screen name="ProductShow" component={ProductShow} />
        <Stack.Screen name="OrderShow" component={OrderShow} />
        <Stack.Screen name="FilteredProducts" component={FilteredProducts} />
        <Stack.Screen name="AllProduct" component={AllProduct} />
        <Stack.Screen name="Checkout" component={Checkout} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


export default StackNavigation


const styles = StyleSheet.create({})
