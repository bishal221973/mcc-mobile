import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../services/axios';

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddress = async () => {
    try {
      const response = await axios.get('/customer/addresses');
      setAddresses(response.data.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name={
              item.default_address
                ? 'radio-button-on'
                : 'radio-button-off'
            }
            size={20}
            color="#4CAF50"
          />
          <Text style={styles.name}>
            {item.first_name} {item.last_name}
          </Text>
        </View>

        {!!item.company_name && (
        <Text style={styles.company}>{item.company_name}</Text>
      )}
      </View>


      <View style={styles.row}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.info}>
          {Array.isArray(item.address)
            ? item.address.join(', ')
            : item.address}
          {', '}
          {item.city}, {item.state}
          {'\n'}
          {item.country} - {item.postcode}
        </Text>
      </View>

     
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <FlatList
      data={addresses}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="location-outline" size={70} color="#ccc" />
          <Text style={styles.emptyText}>No addresses found</Text>
        </View>
      }
    />
  );
};

export default AddressList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: '#F5F5F5',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },

  company: {
    color: '#666',
    marginBottom: 10,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  info: {
    marginLeft: 10,
    color: '#555',
    flex: 1,
    lineHeight: 22,
    fontSize: 14,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },

  edit: {
    marginLeft: 5,
    color: '#2196F3',
    fontWeight: '600',
  },

  delete: {
    marginLeft: 5,
    color: '#F44336',
    fontWeight: '600',
  },

  defaultBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  defaultText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 12,
  },

  empty: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
});