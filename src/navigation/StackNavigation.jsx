import { StyleSheet,StatusBar } from 'react-native'
import React from 'react'
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
const Stack = createNativeStackNavigator();


const StackNavigation = () => {
 return (
   <NavigationContainer >
    
     <Stack.Navigator  screenOptions={{ headerShown: false }}>
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
