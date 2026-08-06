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

const AddressList = ({ onSelectAddress,refresh }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddress = async () => {
    try {
      const response = await axios.get('/customer/addresses');
      const data = response.data.data || [];

      setAddresses(data);

      const defaultAddress = data.find(item => item.default_address);

      if (defaultAddress) {
        setSelectedId(defaultAddress.id);
        onSelectAddress?.(defaultAddress);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const selectAddress = item => {
    setSelectedId(item.id);
    onSelectAddress?.(item?.id);
  };

  const renderItem = ({ item }) => {
    const selected = selectedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => selectAddress(item)}
        style={[
          styles.card,
          selected && styles.selectedCard,
        ]}>
        <View style={styles.header}>
          <View style={styles.left}>
            <Ionicons
              name={
                selected
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={22}
              color="#0C3F80"
            />

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.name}>
                {item.first_name} {item.last_name}
              </Text>

              {!!item.company_name && (
                <Text style={styles.company}>
                  {item.company_name}
                </Text>
              )}
            </View>
          </View>

         
        </View>

        <View style={styles.addressRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color="#666"
          />

          <Text style={styles.address}>
            {Array.isArray(item.address)
              ? item.address.join(', ')
              : item.address}
            {', '}
            {item.city}, {item.state}
            {', '}
            {item.country} - {item.postcode}
          </Text>
        </View>

        
      </TouchableOpacity>
    );
  };

  // if (loading) {
  //   return (
  //     <ActivityIndicator
  //       size="large"
  //       color="#0C3F80"
  //       style={{ marginTop: 30 }}
  //     />
  //   );
  // }

  return (
    <FlatList
      data={addresses}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 30 }}>
          No Address Found
        </Text>
      }
    />
  );
};

export default AddressList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 15,
  },

  selectedCard: {
    borderColor: '#0C3F80',
    borderWidth: 2,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  company: {
    color: '#777',
    marginTop: 3,
  },

  badge: {
    backgroundColor: '#E7F6EC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: 12,
  },

  addressRow: {
    flexDirection: 'row',
    marginTop: 15,
  },

  address: {
    marginLeft: 10,
    flex: 1,
    color: '#555',
    lineHeight: 22,
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  phone: {
    marginLeft: 10,
    color: '#555',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
  },

  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25,
  },

  edit: {
    marginLeft: 5,
    color: '#0C3F80',
    fontWeight: '600',
  },

  delete: {
    marginLeft: 5,
    color: '#e53935',
    fontWeight: '600',
  },
});