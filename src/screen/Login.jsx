import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import axios from "../services/axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from "../services/cart"
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  const syncCartItem = async () => {
    try {
      // Alert.alert('asd','asd')
      const cart = await CartService.syncCart();
    } catch (error) {
      console.log('Load cart error:', error);
    }
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post('/customer/login', {
        email,
        password,
        device_name: 'android',
      });

      console.log(response.data);

      const token = response.data.token;
      const customer = response.data.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('customer', JSON.stringify(customer));
      await syncCartItem();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Drawer' }], // Replace with your home screen name
      });


    } catch (error) {
      console.log(error.response?.data);

      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid email or password.'
      );
    }
  };

  return (
    // KeyboardAvoidingView prevents the keyboard from hiding input fields
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Top Branding Section */}
        <View style={styles.headerSection}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>Sign in to continue to MyApp</Text>
        </View>

        {/* Input Fields Form */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email / Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry // Hides password characters
              autoCapitalize="none"
            />
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotButton} >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Actions Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={() => handleLogin()}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.push('Signup')}>
              <Text style={styles.registerText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C3F80', // Deep Blue Background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50, // Perfect circle matching the previous 50% logic
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  formSection: {
    marginVertical: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle white overlay tint
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#fff', // High contrast white button
    paddingVertical: 16,
    borderRadius: 100, // Pill shaped button
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#0C3F80', // Deep Blue Text
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noAccountText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
})
