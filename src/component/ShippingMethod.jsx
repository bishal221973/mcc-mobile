import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../services/axios';

const ShippingMethod = ({ onSelect }) => {
    const [flatRate, setFlatRate] = useState('0');
    const [selected, setSelected] = useState('free_shipping');

    const fetchConfig = async () => {
        try {
            const response = await axios.get('/core-config-fields', {
                params: {
                    limit: 500,
                },
            });

            const data = response.data.data || [];

            const rate = data.find(
                item => item.code === 'sales.carriers.flatrate.default_rate'
            );

            setFlatRate(rate?.value ?? '0');
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const selectMethod = method => {
        setSelected(method);
        onSelect?.({
            method,
            amount: method === 'free_shipping' ? 0 : Number(flatRate),
        });
    };

    const methods = [
        {
            code: 'free_shipping',
            title: 'Free Shipping',
            amount: 0,
        },
        {
            code: 'flat_rate',
            title: 'Flat Rate',
            amount: Number(flatRate),
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Shipping Method</Text>

            <View style={styles.row}>
                {methods.map(item => {
                    const active = selected === item.code;

                    return (
                        <TouchableOpacity
                            key={item.code}
                            style={[
                                styles.card,
                                active && styles.selectedCard,
                            ]}
                            onPress={() => selectMethod(item.code)}
                        >
                            <Ionicons
                                name={active ? 'radio-button-on' : 'radio-button-off'}
                                size={22}
                                color="#0C3F80"
                            />

                            <View style={styles.info}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.price}>
                                    Rs. {item.amount.toFixed(2)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default ShippingMethod;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    padding:15,
    backgroundColor:'#fff'
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },

  selectedCard: {
    borderColor: '#0C3F80',
    borderWidth: 2,
  },

  info: {
    marginLeft: 10,
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
  },

  price: {
    marginTop: 4,
    fontSize: 13,
    color: '#0C3F80',
    fontWeight: '700',
  },
});