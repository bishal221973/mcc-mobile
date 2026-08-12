import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
import axios from "../../services/axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Amounts from "../../component/Amounts"
import AccountInfo from "../../component/AccountInfo"
const menus = [
  {
    id: 1,
    title: 'My Orders',
    icon: 'bag-handle-outline',
    screen: 'Orders'
  },
  {
    id: 2,
    title: 'Wishlist',
    icon: 'heart-outline',
    screen: 'Wishlist'
  },
  {
    id: 3,
    title: 'Saved Addresses',
    icon: 'location-outline',
    screen: 'Address'
  },
  {
    id: 4,
    title: 'Notifications',
    icon: 'notifications-outline',
    screen: 'Notification'
  },
  {
    id: 5,
    title: 'Change Password',
    icon: 'lock-closed-outline',
    screen: 'ChangePassword'
  }
];


const Account = ({ navigation }) => {

  const [customer, setCustomer] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishLists, setWishLists] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);


  const fetchProfile = async () => {
    const response = await axios.get('/customer/get');
    setCustomer(response?.data?.data);
  }

  const [total, setTotal] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)


  const fetchOrders = async () => {
    try {
      const res = await axios.get('/customer/orders');
      // console.log('Orders response:', res.data);
      // Alert.alert('success',"Hello");
      setOrders(res.data?.data || []);

      const data = res.data.data;

      const total = data.reduce((sum, item) => {
        return sum + Number(item?.grand_total || 0);
      }, 0);
      const totalPaid = data.reduce((sum, item) => {
        return sum + Number(item?.base_grand_total_invoiced || 0);
      }, 0);
      setTotal(total)
      setTotalRevenue(totalPaid)
    } catch (error) {
      console.log(
        'Failed to fetch order:',
        error?.response?.data || error.message
      );
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await axios.get('/customer/transactions');
      // console.log('Orders response:', res.data);
      // Alert.alert('success',"Hello");
      setTransactions(res.data.data || []);

      // const data = res.data.data;

      // const total = data.reduce((sum, item) => {
      //   return sum + Number(item?.grand_total || 0);
      // }, 0);
      // setTotal(total)
    } catch (error) {
      console.log(
        'Failed to fetch order:',
        error?.response?.data || error.message
      );
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/customer/wishlist');
      setWishLists(res.data?.data || []);
    } catch (error) {
      console.log(
        'Failed to fetch order:',
        error?.response?.data || error.message
      );
    }
  };

  const fetchAddress = async () => {
    try {
      const res = await axios.get('/customer/addresses');
      setAddresses(res.data?.data || []);
    } catch (error) {
      console.log(
        'Failed to fetch order:',
        error?.response?.data || error.message
      );
    }
  };


  // useEffect(() => {
  //   fetchProfile();
  //   fetchOrders();
  //   fetchWishlist();
  //   fetchAddress();
  // },[])
  const refreshData = async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        fetchProfile(),
        fetchOrders(),
        fetchWishlist(),
        fetchAddress(),
        // fetchRevenue(),
      ]);
    } catch (error) {
      console.log(
        'Refresh error:',
        error?.response?.data || error?.message || error
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  


  const logout = async () => {
    try {
      // Call Bagisto logout API
      await axios.post('/customer/logout');

      // Remove locally stored authentication data
      await AsyncStorage.multiRemove([
        'token',
        'customer',
      ]);

      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been logged out successfully.',
      });

      // Reset navigation so user cannot go back to Account
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error) {
      console.log(
        'Logout error:',
        error?.response?.data || error
      );

      // Even if API logout fails, clear local session
      await AsyncStorage.multiRemove([
        'token',
        'customer',
      ]);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <>
      <Header />

      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshData}
              colors={['#0C3F80']}
              tintColor="#0C3F80"
            />
          }
        >
          {/* Profile Card */}
          {/* <Text>{JSON.stringify(addresses)}</Text> */}
          <AccountInfo customer={customer}/>
          

          {/* <Text>{JSON.stringify(transactions)}</Text> */}



          {/* Stats */}

          <View style={styles.statsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')} style={styles.statCard}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={styles.statCard}>
              <Text style={styles.statValue}>{wishLists.length}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Address')} style={styles.statCard}>
              <Text style={styles.statValue}>{addresses.length}</Text>
              <Text style={styles.statLabel}>Addresses</Text>
            </TouchableOpacity>
          </View>

          <Amounts totalAmount={total} paidAmount={totalRevenue} />

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

          {/* <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#fff"

            />

            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity> */}

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

  
  

  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginHorizontal: 15,
    marginBottom: 8,
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
    marginHorizontal: 8,
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

  
});