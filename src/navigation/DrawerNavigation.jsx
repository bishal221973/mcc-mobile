import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigation from './TabNavigation';
import CustomDrawer from './CustomDrawer';

// import Wallet from '../screen/auth/Wallet';


const Drawer = createDrawerNavigator();


export default function DrawerNavigation() {
 return (
    <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={props=><CustomDrawer {...props}/>}>
    
     {/* Main Tabs inside Drawer */}
     <Drawer.Screen name="HomeTabs" component={TabNavigation} />


     {/* Extra screens */}
     {/* <Drawer.Screen name="Wallet" component={Wallet} /> */}


   </Drawer.Navigator>
 );
}
