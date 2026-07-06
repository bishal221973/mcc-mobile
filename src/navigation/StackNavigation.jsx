import { StyleSheet,StatusBar } from 'react-native'
import React from 'react'
import Login from '../screen/Login'
import Splash from '../screen/Splash'
import Signup from '../screen/Signup'
import TabNavigation from './TabNavigation'
import DrawerNavigation from './DrawerNavigation';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


const Stack = createNativeStackNavigator();


const StackNavigation = () => {
 return (
   <NavigationContainer >
    
     <Stack.Navigator  screenOptions={{ headerShown: false }}>
       <Stack.Screen name="Splash" component={Splash} />
       <Stack.Screen name="Login" component={Login} />
       <Stack.Screen name="Signup" component={Signup} />


       <Stack.Screen name="Home" component={DrawerNavigation} />
     </Stack.Navigator>
   </NavigationContainer>
 )
}


export default StackNavigation


const styles = StyleSheet.create({})
