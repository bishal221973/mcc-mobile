import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../services/axios';

// Images
const esewaIcon = require('../../assets/images/esewa.png');
const codIcon = require('../../assets/images/cod.png');
const creditIcon = require('../../assets/images/credit.png');
const connectIpsIcon = require('../../assets/images/connect.png');

const PaymentMethod = ({ onSelect }) => {
    const [selected, setSelected] = useState('');

    const [enableEsewa, setEnableEsewa] = useState(false);
    const [enableCreditPayment, setEnableCreditPayment] = useState(false);
    const [enableConnectIps, setEnableConnectIps] = useState(false);
    const [enableCashOnDelivery, setEnableCashOnDelivery] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await axios.get('/core-config-fields', {
                params: {
                    limit: 500,
                },
            });

            const data = response.data.data || [];

            const esewa = data.find(
                item =>
                    item.code ===
                    'sales.payment_methods.esewapayment.active',
            );

            const creditPayment = data.find(
                item =>
                    item.code ===
                    'sales.payment_methods.creditpayment.active',
            );

            const connectIps = data.find(
                item =>
                    item.code ===
                    'sales.payment_methods.connectips.active',
            );

            const cashOnDelivery = data.find(
                item =>
                    item.code ===
                    'sales.payment_methods.cashondelivery.active',
            );

            const isEsewaEnabled = esewa?.value == 1;
            const isCreditEnabled = creditPayment?.value == 1;
            const isConnectIpsEnabled = connectIps?.value == 1;
            const isCodEnabled = cashOnDelivery?.value == 1;

            setEnableEsewa(isEsewaEnabled);
            setEnableCreditPayment(isCreditEnabled);
            setEnableConnectIps(isConnectIpsEnabled);
            setEnableCashOnDelivery(isCodEnabled);

            // Select first enabled payment method
            let defaultMethod = '';

            if (isEsewaEnabled) {
                defaultMethod = 'esewapayment';
            } else if (isCreditEnabled) {
                defaultMethod = 'creditpayment';
            } else if (isConnectIpsEnabled) {
                defaultMethod = 'connectips';
            } else if (isCodEnabled) {
                defaultMethod = 'cashondelivery';
            }

            if (defaultMethod) {
                setSelected(defaultMethod);
                onSelect?.(defaultMethod);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const paymentMethods = [
        ...(enableEsewa
            ? [
                  {
                      code: 'esewapayment',
                      title: 'eSewa',
                      subtitle: 'Pay securely using eSewa',
                      image: esewaIcon,
                  },
              ]
            : []),

        ...(enableCreditPayment
            ? [
                  {
                      code: 'creditpayment',
                      title: 'Credit Payment',
                      subtitle: 'Pay using your credit balance',
                      image: creditIcon,
                  },
              ]
            : []),

        ...(enableConnectIps
            ? [
                  {
                      code: 'connectips',
                      title: 'ConnectIPS',
                      subtitle: 'Pay securely using ConnectIPS',
                      image: connectIpsIcon,
                  },
              ]
            : []),

        ...(enableCashOnDelivery
            ? [
                  {
                      code: 'cashondelivery',
                      title: 'Cash on Delivery',
                      subtitle: 'Pay when your order arrives',
                      image: codIcon,
                  },
              ]
            : []),
    ];

    const selectMethod = method => {
        setSelected(method.code);
        onSelect?.(method.code);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => selectMethod(item)}
            style={[
                styles.card,
                selected === item.code && styles.selectedCard,
            ]}>
            <Ionicons
                name={
                    selected === item.code
                        ? 'radio-button-on'
                        : 'radio-button-off'
                }
                size={22}
                color="#0C3F80"
                style={styles.radio}
            />

            <Image
                source={item.image}
                style={styles.icon}
                resizeMode="contain"
            />

            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Payment Method</Text>

            <FlatList
                data={paymentMethods}
                keyExtractor={item => item.code}
                renderItem={renderItem}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: 5 }}
            />
        </View>
    );
};

export default PaymentMethod;

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
    },

    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginBottom: 15,
    },

    row: {
        justifyContent: 'space-between',
    },

    card: {
        width: '48%',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: 150,
    },

    selectedCard: {
        borderWidth: 2,
        borderColor: '#0C3F80',
        backgroundColor: '#F5F9FF',
    },

    radio: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

    icon: {
        width: 150,
        height: 65,
        marginBottom: 12,
    },

    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
    },

    subtitle: {
        marginTop: 6,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});