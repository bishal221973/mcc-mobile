import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import Login from '../screen/Login';
import Splash from '../screen/Splash';
import Signup from '../screen/Signup';

import DrawerNavigation from './DrawerNavigation';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductShow from '../screen/auth/ProductShow';
import FilteredProducts from '../screen/auth/FilteredProducts';
import AllProduct from '../screen/auth/AllProduct';
import Checkout from '../screen/auth/Checkout';
import OrderShow from '../screen/auth/OrderShow';

import {
  getMessaging,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

import { navigationRef } from '../services/navigationRef';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {

  const [initialNotification, setInitialNotification] = useState(null);
  const [checkingNotification, setCheckingNotification] = useState(true);

  // ==========================================
  // CHECK INITIAL NOTIFICATION
  // ==========================================

  useEffect(() => {

    const checkInitialNotification = async () => {

      try {

        const messagingInstance = getMessaging();

        const remoteMessage =
          await getInitialNotification(messagingInstance);

        console.log(
          'INITIAL NOTIFICATION:',
          remoteMessage
        );

        if (remoteMessage) {
          setInitialNotification(remoteMessage);
        }

      } catch (error) {

        console.log(
          'Initial notification error:',
          error
        );

      } finally {

        setCheckingNotification(false);

      }
    };

    checkInitialNotification();

  }, []);

  // ==========================================
  // BACKGROUND NOTIFICATION CLICK
  // ==========================================

  useEffect(() => {

    const messagingInstance = getMessaging();

    console.log(
      'Firebase messaging initialized'
    );

    const unsubscribe =
      onNotificationOpenedApp(
        messagingInstance,
        remoteMessage => {

          console.log(
            'NOTIFICATION CLICKED:',
            remoteMessage
          );

          if (!navigationRef.isReady()) {
            console.log(
              'Navigation is not ready'
            );
            return;
          }

          navigationRef.navigate(
            'Drawer',
            {
              screen: 'HomeTabs',

              params: {
                screen: 'Home',
              },
            }
          );

        }
      );

    return unsubscribe;

  }, []);

  // ==========================================
  // DON'T RENDER NAVIGATION UNTIL
  // INITIAL NOTIFICATION IS CHECKED
  // ==========================================

  if (checkingNotification) {

    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#0C3F80"
        />

      </View>
    );

  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  return (

    <NavigationContainer
      ref={navigationRef}

      onReady={() => {

        console.log(
          'NavigationContainer READY'
        );

        // --------------------------------------
        // App opened from notification
        // --------------------------------------

        if (initialNotification) {

          console.log(
            'Opening Home directly from notification'
          );

          navigationRef.reset({
            index: 0,

            routes: [
              {
                name: 'Drawer',

                state: {
                  routes: [
                    {
                      name: 'HomeTabs',

                      state: {
                        routes: [
                          {
                            name: 'Home',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          });

        }

      }}
    >

      <Stack.Navigator
        initialRouteName={
          initialNotification
            ? 'Drawer'
            : 'Splash'
        }
        screenOptions={{
          headerShown: false,
        }}
      >

        {/* SPLASH */}

        <Stack.Screen
          name="Splash"
          component={Splash}
        />

        {/* AUTH */}

        <Stack.Screen
          name="Login"
          component={Login}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
        />

        {/* DRAWER */}

        <Stack.Screen
          name="Drawer"
          component={DrawerNavigation}
        />

        {/* PRODUCTS */}

        <Stack.Screen
          name="ProductShow"
          component={ProductShow}
        />

        <Stack.Screen
          name="FilteredProducts"
          component={FilteredProducts}
        />

        <Stack.Screen
          name="AllProduct"
          component={AllProduct}
        />

        {/* CHECKOUT */}

        <Stack.Screen
          name="Checkout"
          component={Checkout}
        />

        {/* ORDER */}

        <Stack.Screen
          name="OrderShow"
          component={OrderShow}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );
};

export default StackNavigation;

const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

});