import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const PRIMARY = '#0C3F80';

const CustomDrawer = ({ navigation }) => {
  // Mock data: Pull from your global state or Bagisto API context later
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://unsplash.com" 
  }

  // Bagisto core drawer navigation configurations
  const menuItems = [
    { label: 'Home', icon: 'home-outline', target: 'Drawer' },
    { label: 'Categories', icon: 'format-list-bulleted', target: 'Categories' },
    { label: 'My Orders', icon: 'package-variant-closed', target: 'Orders' },
    { label: 'Wishlist', icon: 'heart-outline', target: 'Wishlist' },
    { label: 'Addresses', icon: 'map-marker-outline', target: 'Addresses' }, // Valid MaterialCommunityIcons name
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        
        {/* 1. USER PROFILE CARD BLOCK */}
        <View style={styles.card}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
          </View>
        </View>

        {/* 2. DRAWER NAVIGATION MENUS */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem} 
              onPress={() => navigation?.navigate(item.target)}
            >
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={22} color="#4A5568" />
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* 3. FLUSH ACTION FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
          <View style={styles.iconContainer}>
            <Icon name="logout" size={22} color="#E53935" />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingLeft: 0,
    paddingRight: 0,
  },
  scrollContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  card: {
    backgroundColor: PRIMARY,
    width: '100%',
    paddingTop: 50,
    paddingBottom: 20,
    paddingLeft: 16, 
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  profileTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 2,
  },
  menuContainer: {
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 16,
  },
  iconContainer: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#1A202C',
    fontWeight: '500',
  },
  footer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  logoutText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#E53935',
    fontWeight: '600',
  },
})
