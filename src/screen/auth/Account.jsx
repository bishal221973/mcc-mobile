import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';

const menus = [
  {
    id: 1,
    title: 'My Orders',
    icon: 'bag-handle-outline',
    screen:'Orders'
  },
  {
    id: 2,
    title: 'Wishlist',
    icon: 'heart-outline',
    screen:'Wishlist'
  },
  {
    id: 3,
    title: 'Saved Addresses',
    icon: 'location-outline',
    screen:'Address'
  },
  {
    id: 4,
    title: 'Notifications',
    icon: 'notifications-outline',
    screen:'Notification'
  },
  {
    id: 5,
    title: 'Change Password',
    icon: 'lock-closed-outline',
    screen:'ChangePassword'
  }
];

const Account = ({navigation}) => {
  return (
    <>
      <Header />

      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Card */}

          <View style={styles.profileCard}>
            <Image
              source={{
                uri: 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Bishal Chaudhary</Text>

              <Text style={styles.email}>
                bishal@example.com
              </Text>

              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editText}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats */}

          <View style={styles.statsContainer}>
            <TouchableOpacity  onPress={() => navigation.navigate('Orders')} style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={styles.statCard}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </TouchableOpacity>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Addresses</Text>
            </View>
          </View>

          {/* Menu */}

          <View style={styles.menuContainer}>
            {menus.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen)}>
                <View style={styles.left}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color="#0C3F80"
                  />

                  <Text style={styles.menuText}>
                    {item.title}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}

          <TouchableOpacity style={styles.logoutBtn}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#fff"
            />

            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },

  profileCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    marginRight: 15,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  email: {
    color: '#777',
    marginTop: 5,
  },

  editBtn: {
    marginTop: 10,
    backgroundColor: '#0C3F80',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  editText: {
    color: '#fff',
    fontWeight: '600',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 15,
  },

  statCard: {
    backgroundColor: '#fff',
    width: '30%',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    elevation: 2,
  },

  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0C3F80',
  },

  statLabel: {
    color: '#666',
    marginTop: 5,
  },

  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  logoutBtn: {
    margin: 20,
    backgroundColor: '#E53935',
    padding: 16,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  logoutText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 16,
  },
});