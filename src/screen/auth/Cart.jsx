import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Alert,
    RefreshControl
} from 'react-native';
import Header from '../../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import CartService from "../../services/cart"
import axios from "../../services/axios"
import { useFocusEffect } from '@react-navigation/native';
import CartSkeleton from '../../component/Loading/CartSkeleton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PleaseLogin from '../../component/PleaseLogin'
const Cart = ({ navigation }) => {

    const [carts, setCarts] = useState([]);
    const [cartData, setCartData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [customer, setCustomer] = useState([]);
    const fetchProfile = async () => {
        const response = await axios.get('/customer/get');
        setCustomer(response?.data?.data);
    }
    const loadCart = async (showLoading = false) => {
        if (showLoading) {
            setLoading(true);
        }

        const token = await AsyncStorage.getItem('token');

        try {
            if (token) {
                const cart = await CartService.getServerCart();

                setCarts(cart?.items || []);
                setCartData(cart || {});
            } else {
                const cart = await CartService.getLocalCart();

                setCarts(cart || []);
            }
        } catch (error) {
            console.log('Cart error:', error);
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };
    const firstLoad = useRef(true);
    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await loadCart(false);
        } catch (error) {
            console.log('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (firstLoad.current) {
                firstLoad.current = false;
                loadCart(true);
            } else {
                loadCart(false);
            }
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

    const removeFromCart = (itemId) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from your cart?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(
                                `/customer/cart/remove/${itemId}`
                            );

                            Toast.show({
                                type: 'success',
                                text1: 'Item Removed',
                                text2: 'Item has been removed from your cart.',
                            });

                            await loadCart(false);
                        } catch (error) {
                            console.error(
                                'Remove cart item error:',
                                error.response?.data || error.message
                            );

                            Toast.show({
                                type: 'error',
                                text1: 'Remove Failed',
                                text2:
                                    error.response?.data?.message ||
                                    'Unable to remove item from cart.',
                            });
                        }
                    },
                },
            ]
        );
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
        fetchProfile();
    }, []);

    // const renderItem = ({ item }) => (
    //     <>
    //         {/* <Text>{JSON.stringify(item?.)}</Text> */}
    //         <View style={styles.card}>
    //             <Image source={{ uri: item?.product?.product?.images[0]?.small_image_url ?? item?.product?.images[0]?.small_image_url }} style={styles.image} />
    //             <View style={styles.info}>
    //                 <Text numberOfLines={2} style={styles.name}>
    //                     {item?.product?.product?.name ?? item?.product?.name}
    //                 </Text>

    //                 {/* <Text style={styles.variant}>{item.variant}</Text> */}

    //                 <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
    //                     <Text
    //                         style={{
    //                             textDecorationLine: 'line-through',
    //                             color: '#333',
    //                             fontSize: 11
    //                         }}
    //                     >
    //                         {item?.product?.formatted_regular_price ?? item?.product?.product?.formatted_regular_price}
    //                     </Text>
    //                     <Text style={styles.price}>{item?.product?.product?.formatted_price ?? item?.product?.formatted_price}</Text>


    //                 </View>
    //                 <View style={styles.bottomRow}>
    //                     <View style={styles.qtyContainer}>
    //                         <TouchableOpacity
    //                             onPress={() => decreaseQty(item.id, item.quantity)}
    //                             style={styles.qtyButton}>
    //                             <Text style={styles.qtyText}>−</Text>
    //                         </TouchableOpacity>

    //                         <Text style={styles.qty}>{item?.quantity}</Text>

    //                         <TouchableOpacity
    //                             onPress={() => increaseQty(item.id, item.quantity)}
    //                             style={styles.qtyButton}>
    //                             <Text style={styles.qtyText}>+</Text>
    //                         </TouchableOpacity>
    //                     </View>
    //                 </View>
    //             </View>
    //         </View>
    //     </>
    // );
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={{
                    uri:
                        item?.product?.product?.images?.[0]?.small_image_url ??
                        item?.product?.images?.[0]?.small_image_url,
                }}
                style={styles.image}
            />

            <View style={styles.info}>
                <View>
                    <Text
                        numberOfLines={2}
                        style={styles.name}
                    >
                        {item?.product?.product?.name ??
                            item?.product?.name}
                    </Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.regularPrice}>
                            {item?.product?.formatted_regular_price ??
                                item?.product?.product?.formatted_regular_price}
                        </Text>

                        <Text style={styles.price}>
                            {item?.product?.product?.formatted_price ??
                                item?.product?.formatted_price}
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomRow}>
                    {/* Quantity */}
                    <View style={styles.qtyContainer}>
                        <TouchableOpacity
                            onPress={() =>
                                decreaseQty(
                                    item.id,
                                    item.quantity
                                )
                            }
                            style={styles.qtyButton}
                        >
                            <Text style={styles.qtyText}>
                                −
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.qty}>
                            {item?.quantity}
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                increaseQty(
                                    item.id,
                                    item.quantity
                                )
                            }
                            style={styles.qtyButton}
                        >
                            <Text style={styles.qtyText}>
                                +
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Remove */}
                    <TouchableOpacity
                        style={styles.removeButton}
                        activeOpacity={0.7}
                        onPress={() =>
                            removeFromCart(item.id)
                        }
                    >
                        <Ionicons
                            name="trash-outline"
                            size={17}
                            color="#E53935"
                        />

                        <Text style={styles.removeText}>
                            Remove
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
    if (!customer?.id) {
        return (
            <>
                <Header />
                <SafeAreaView style={styles.container}>
                    <PleaseLogin />
                </SafeAreaView>
            </>
        );
    }

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>


                {loading ? (
                    <CartSkeleton />
                ) : carts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="cart-outline"
                                size={55}
                                color="#0C3F80"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            Your Cart is Empty
                        </Text>

                        <Text style={styles.emptyText}>
                            Looks like you haven't added anything to your cart yet.
                        </Text>

                        <TouchableOpacity
                            style={styles.shopButton}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Ionicons
                                name="bag-outline"
                                size={20}
                                color="#fff"
                            />

                            <Text style={styles.shopButtonText}>
                                Continue Shopping
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={carts}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#0C3F80']}
                                    tintColor="#0C3F80"
                                />
                            }
                        />

                        <View style={styles.summary}>
                            <Text style={styles.summaryTitle}>
                                Order Summary
                            </Text>

                            <View style={styles.row}>
                                <Text>Subtotal</Text>
                                <Text>
                                    {cartData?.formatted_sub_total}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text>TAX</Text>
                                <Text>
                                    {cartData?.formatted_tax_total}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <View>
                                    <Text style={styles.totalText}>
                                        {cartData?.formatted_base_grand_total}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#999',
                                        }}
                                    >
                                        Total amount to be paid
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.checkoutButton}
                                    onPress={() =>
                                        navigation.navigate('Checkout')
                                    }
                                >
                                    <Text style={styles.checkoutText}>
                                        Proceed
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
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
        fontSize: 12,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    emptyIcon: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#EAF1FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 25,
    },

    shopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0C3F80',
        paddingHorizontal: 25,
        paddingVertical: 13,
        borderRadius: 25,
        elevation: 3,
    },

    shopButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },




    priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
},

regularPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 11,
},

removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFF1F1',
    marginLeft: 10,
},

removeText: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
},
});