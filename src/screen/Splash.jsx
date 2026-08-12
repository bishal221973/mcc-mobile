import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const Splash = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Brand Title & Logo Area */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>MCC</Text>
        <Text style={styles.tagline}>WELCOME TO MOUNTAIN CONS CHEM PVT. LTD.</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.replace('Drawer')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Design and developed by <Text style={{fontWeight:'bold',color:'#f2f2f2'}}>GK IT Solution</Text></Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C3F80', // Deep Blue Background
    justifyContent: 'space-between', // Pushes button to bottom, logo to center
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centers logo and text horizontally
    width: '100%',
  },
  logo: {
    width: 120, // Explicit size needed for local images
    height: 120,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 60,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // White text
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    marginTop: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff', // White Button
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // Shadow for Android
  },
  buttonText: {
    color: '#0C3F80', // Deep Blue Text
    fontSize: 18,
    fontWeight: 'bold',
  },
})
