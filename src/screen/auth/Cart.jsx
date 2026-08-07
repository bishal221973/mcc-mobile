import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Alert,
} from 'react-native';
import Header from '../../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import CartService from "../../services/cart"
import axios from "../../services/axios"
import { useFocusEffect } from '@react-navigation/native';
const Cart = ({ navigation }) => {

    const [carts, setCarts] = useState([]);
    const [cartData, setCartData] = useState([]);
    const loadCart = async () => {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            try {
                const cart = await CartService.getServerCart();
                setCarts(cart?.items);
                setCartData(cart);
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const cart = await CartService.getLocalCart();
                // setCarts(cart);
            } catch (e) {
                console.log(e);
            }
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCart();

            return () => {
                // Optional cleanup when leaving the screen
            };
        }, [])
    );



    const decreaseQty = async (itemId, currentQty) => {
        try {
            const newQty = currentQty - 1;

            const response = await axios.put('/customer/cart/update', {
                qty: {
                    [itemId]: newQty
                }
            });

            loadCart();
            return response.data;
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };
    const increaseQty = async (itemId, currentQty) => {
        try {
            const newQty = currentQty + 1;

            const response = await axios.put('/customer/cart/update', {
                qty: {
                    [itemId]: newQty
                }
            });
            loadCart();
            return response.data;
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };






    useEffect(() => {

        const redirectLogin = async () => {
            console.log('Checking token...');

            const token = await AsyncStorage.getItem('token');
            console.log('Token:', token);

            if (!token) {
                console.log('Redirecting...');
                navigation.replace('Login'); // or navigate
            }
        };

        redirectLogin();
    }, []);

    const renderItem = ({ item }) => (
        <>
            {/* <Text>{JSON.stringify(item?.)}</Text> */}
            <View style={styles.card}>
                <Image source={{ uri: item?.product?.product?.images[0]?.small_image_url ?? item?.product?.images[0]?.small_image_url }} style={styles.image} />
                <View style={styles.info}>
                    <Text numberOfLines={2} style={styles.name}>
                        {item?.product?.product?.name ?? item?.product?.name}
                    </Text>

                    {/* <Text style={styles.variant}>{item.variant}</Text> */}

                    <Text style={styles.price}>{item?.product?.product?.formatted_price ?? item?.product?.formatted_price}</Text>

                    <View style={styles.bottomRow}>
                        <View style={styles.qtyContainer}>
                            <TouchableOpacity
                                onPress={() => decreaseQty(item.id, item.quantity)}
                                style={styles.qtyButton}>
                                <Text style={styles.qtyText}>−</Text>
                            </TouchableOpacity>

                            <Text style={styles.qty}>{item?.quantity}</Text>

                            <TouchableOpacity
                                onPress={() => increaseQty(item.id, item.quantity)}
                                style={styles.qtyButton}>
                                <Text style={styles.qtyText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                {/* <Text>{JSON.stringify(cartData?.formatted_sub_total)}</Text> */}
                <FlatList
                    data={carts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />

                {carts && (

                <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>

                    <View style={styles.row}>
                        <Text>Subtotal</Text>
                        <Text>{cartData?.formatted_sub_total}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text>TAX</Text>
                        <Text>{cartData?.formatted_tax_total}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.totalText}>{cartData?.formatted_base_grand_total}</Text>
                            <Text style={{ fontSize: 12, color: '#999' }}>Total amount to be paid</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => navigation.navigate('Checkout')}
                        >
                            <Text style={styles.checkoutText}>
                                Proceed
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                )}
            </SafeAreaView>
        </>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    header: {
        fontSize: 24,
        fontWeight: '700',
        padding: 20,
        backgroundColor: '#fff',
    },

    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 12,
        padding: 12,
        elevation: 2,
    },

    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#eee',
    },

    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },

    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },

    variant: {
        color: '#777',
        marginTop: 4,
        fontSize: 13,
    },

    price: {
        color: '#0C3F80',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 0,
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },

    qtyButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    qtyText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    qty: {
        width: 35,
        textAlign: 'center',
        fontWeight: '600',
    },

    remove: {
        color: '#E53935',
        fontWeight: '600',
    },

    summary: {
        backgroundColor: '#fff',
        marginTop: 20,
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },

    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginTop: 5,
    },

    totalText: {
        fontSize: 18,
        fontWeight: '700',
    },

    checkoutButton: {
        marginTop: 20,
        backgroundColor: '#0C3F80',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 30,
        alignItems: 'center',
    },

    checkoutText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});