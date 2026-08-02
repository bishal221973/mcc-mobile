import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
} from 'react-native';
import Header from '../../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import CartService from "../../services/cart"
import axios from "../../services/axios"
import AddressForm from "../../component/AddressForm"

// FIXED: Destructured navigation from props to prevent crash during redirect
const Checkout = ({ navigation }) => {

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
                setCarts(cart);
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const decreaseQty = async (itemId, currentQty) => {
        if (currentQty <= 1) return; // Prevent quantities lower than 1
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
                navigation.replace('Login'); 
            }
        };
        redirectLogin();
    }, [navigation]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={{ uri: item?.product?.product?.images[0]?.small_image_url ?? item?.product?.images[0]?.small_image_url }} 
                style={styles.image} 
            />
            <View style={styles.info}>
                <Text numberOfLines={2} style={styles.name}>
                    {item?.product?.product?.name ?? item?.product?.name}
                </Text>

                <View style={styles.bottomRow}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <Text style={styles.price}>{item?.product?.product?.formatted_price ?? item?.product?.formatted_price} </Text>
                        <Text style={[styles.price, { color: '#000', fontSize: 13 }]}>X</Text>
                        <Text style={[styles.price, { color: '#000', fontSize: 13 }]}>{item.quantity}</Text>
                    </View>

                   
                </View>
            </View>
        </View>
    );

    // FIXED: Wrapped non-list items into a single function component to safely handle screen scrolling behaviors
    const renderFooter = () => (
        <View style={{marginTop:5,elevation:10}}>
            <View style={styles.summary}>
                <View style={styles.row}>
                    <Text style={[styles.totalText,{color:'#303030'}]}>Subtotal</Text>
                    <Text>{cartData?.formatted_sub_total}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.totalText,{color:'#303030'}]}>TAX</Text>
                    <Text>{cartData?.formatted_tax_total}</Text>
                </View>

                <View style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.totalText}>Grand Total</Text>
                    <Text style={styles.totalText}>{cartData?.formatted_base_grand_total}</Text>
                </View>
            </View>

            <View style={[styles.summary, { marginTop: 10, marginBottom: 20 }]}>
                <AddressForm />
            </View>
        </View>
    );

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={carts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={{ padding: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cart Summary</Text>
                        </View>
                    }
                    ListFooterComponent={renderFooter}
                />
            </SafeAreaView>
        </>
    );
};

export default Checkout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        // marginHorizontal: 15,
        // marginVertical: 6,
        padding: 12,
        // borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    image: {
        width: 60,
        height: 60,
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
    price: {
        color: '#0C3F80',
        fontWeight: 'bold',
        fontSize: 15,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    qtyButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0C3F80',
    },
    qty: {
        width: 25,
        textAlign: 'center',
        fontWeight: '600',
    },
    summary: {
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
});
