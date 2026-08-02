import React from 'react';
import { StyleSheet } from 'react-native';
import StackNavigation from './src/navigation/StackNavigation';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      <StackNavigation />
      <Toast />
    </>
  );
};

export default App;

const styles = StyleSheet.create({});