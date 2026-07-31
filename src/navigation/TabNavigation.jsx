import React, { useEffect, useState, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Ionicons'
import { useFocusEffect } from '@react-navigation/native';


import Home from "../screen/auth/Home"
// import Wallet from "../screen/auth/Wallet"
import Category from "../screen/auth/Category"
import Cart from "../screen/auth/Cart"
import Account from "../screen/auth/Account"
import Search from "../screen/auth/Search"
import Orders from "../screen/auth/Orders"
import Wishlist from "../screen/auth/Wishlist"
import Address from "../screen/auth/Address"
import Notification from "../screen/auth/Notification"
import ChangePassword from "../screen/auth/ChangePassword"
import Profile from "../screen/auth/Profile"
// import Notification from "../screen/auth/Notification"
// import SOS from "../screen/auth/SOS"
// import Gigs from "../screen/auth/Gigs"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()


const Tabs = () => {
  const insets = useSafeAreaInsets()

  const [cartCount, setCartCount] = useState(0);

  const loadCart = async () => {
    //  Alert.alert('Success', 'Product added to cart');
    try {
      const cart = await AsyncStorage.getItem('cart');
      const items = cart ? JSON.parse(cart) : [];
      setCartCount(items.length);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

const navigation = useNavigation();

useEffect(() => {
  const unsubscribe = navigation.addListener('state', () => {
    loadCart();
  });

  return unsubscribe;
}, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline'
          else if (route.name === 'Category') iconName = focused ? 'grid' : 'grid-outline'
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline'
          else if (route.name === 'Account') iconName = focused ? 'person' : 'person-outline'
          //  else if (route.name === 'Gigs') iconName = focused ? 'fast-food' : 'fast-food-outline'
          //  else if (route.name === 'Update') iconName = focused ? 'notifications' : 'notifications-outline'
          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#0C3F80',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Category" component={Category} />
      {/* <Tab.Screen name="Cart" component={Cart} /> */}
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tab.Screen name="Account" component={Account} />
      {/* <Tab.Screen name="ProductShow" component={ProductShow} /> */}
      {/* <Tab.Screen name="Address" component={Address} /> */}
      {/* <Tab.Screen name="Wallet" component={Wallet} />
     <Tab.Screen name="Update" component={Notification} /> */}
      {/* Do NOT include SOS here */}
    </Tab.Navigator>
  )
}


const RootNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={Tabs} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  )
}


export default RootNavigation
