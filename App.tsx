import React, { useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import StackNavigation from './src/navigation/StackNavigation';
import Toast from 'react-native-toast-message';
import AuthMonitor from './src/services/AuthMonitor';

const App = () => {

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