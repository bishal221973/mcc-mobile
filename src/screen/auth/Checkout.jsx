import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Alert,
    RefreshControl,
    ActivityIndicator,
    Modal
} from 'react-native';
import Header from '../../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from "../../services/cart"
import axios from "../../services/axios"
import AddressForm from "../../component/AddressForm"
import Ionicons from 'react-native-vector-icons/Ionicons';
import IsSameShipping from "../../component/IsSameShipping";
import ProductRender from "../../component/Checkout/ProductRender"
import ProductPrice from "../../component/Checkout/ProductPrice"
import Address from "../../component/Checkout/Address"
import ShippingMethod from "../../component/Checkout/ShippingMethod"
import Payment from "../../component/Checkout/Payment"
import CheckoutSkeleton from '../../component/Loading/CheckoutSkeleton';

import CartEvents from '../../services/CartEvents'

const esewaIcon = require('../../../assets/images/esewa.png');
const codIcon = require('../../../assets/images/cod.png');
const creditIcon = require('../../../assets/images/credit.png');
const connectIpsIcon = require('../../../assets/images/connect.png');
const Checkout = ({ navigation }) => {

    const [carts, setCarts] = useState([]);
    const [cartData, setCartData] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [refreshAddress, setRefreshAddress] = useState(0);
    const [isSameShippingAddress, setIsSameShippingAddress] = useState(true);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [shippingPrice, setShippingPrice] = useState({ amount: 0 })
    const [refreshing, setRefreshing] = useState(false);
    const [customer, setCustomer] = useState([]);

    const toggleShippingAddress = (checked) => {
        setIsSameShippingAddress(checked);
        if (checked) {
            setShippingAddress(selectedAddress)
        } else {
            setShippingAddress(null)
        }
    }

    const setBillingAddress = (address) => {
        setSelectedAddress(address);
        if (isSameShippingAddress) {
            setShippingAddress(address)
        }
    }

    // const fetchAddress = async () => {
    //     try {
    //         const response = await axios.get('/customer/addresses');
    //         const data = response.data.data || [];

    //         setAddresses(data);

    //         const defaultAddress = data.find(item => item.default_address);

    //         if (defaultAddress) {
    //             setSelectedAddress(defaultAddress.id);
    //             onSelectAddress?.(defaultAddress);
    //         }
    //     } catch (error) {
    //         console.log(error.response?.data || error.message);
    //     } finally {
    //     }
    // };

    const fetchAddress = async () => {
        try {
            const response = await axios.get('/customer/addresses');

            const data = response?.data?.data || [];

            setAddresses(data);

            // Find default address
            const defaultAddress = data.find(
                item => item.default_address
            );

            if (defaultAddress) {
                setSelectedAddress(defaultAddress);

                if (isSameShippingAddress) {
                    setShippingAddress(defaultAddress);
                }
            } else if (data.length > 0) {
                // Optional: select first address if no default exists
                setSelectedAddress(data[0]);

                if (isSameShippingAddress) {
                    setShippingAddress(data[0]);
                }
            } else {
                setSelectedAddress(null);
                setShippingAddress(null);
            }

        } catch (error) {
            console.log(
                'Fetch addresses error:',
                error.response?.data || error.message
            );
        }
    };



    const renderAddress = ({ item }) => {
        const selected = selectedAddress?.id === item.id;
        return (
            <Address setBillingAddress={setBillingAddress} item={item} selected={selected} onEdit={handleAddressAdded} />

        );
    };

    const renderShippingAddress = ({ item }) => {
        const selected = shippingAddress?.id === item.id;
        return (
            <Address setBillingAddress={setShippingAddress} item={item} selected={selected} />

        );
    };

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

    const redirectLogin = async () => {
        // const token = await AsyncStorage.getItem('token');

        // if (!token) {
        //     navigation.replace('Login');
        // }
        try {
            const response = await axios.get('/customer/get');
            setCustomer(response?.data?.data);
            if (!response?.data?.data) {
                navigation.replace('Login');
            }


            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        redirectLogin();
    }, [navigation]);

    const renderItem = ({ item }) => (
        <ProductRender item={item} />
    );

    const handleAddressAdded = async () => {
        await fetchAddress();
    };



    // ======================Shipping/Payment Method==================
    const [flatRate, setFlatRate] = useState('0');
    const [selectedShippingMethod, setSelectedShippingMethod] = useState('free_shipping');

    const [selectedPayment, setSelectedPayment] = useState('');

    const [enableEsewa, setEnableEsewa] = useState(false);
    const [enableCreditPayment, setEnableCreditPayment] = useState(false);
    const [enableConnectIps, setEnableConnectIps] = useState(false);
    const [enableCashOnDelivery, setEnableCashOnDelivery] = useState(false);
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


            // Payment====
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
                setSelectedPayment(defaultMethod);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };



    const selectShippingMethod = method => {
        setSelectedShippingMethod(method);
        setShippingPrice?.({
            method,
            amount: method === 'free_shipping' ? 0 : Number(flatRate),
        });
    };

    const shippingMethods = [
        {
            code: 'free_shipping',
            method: 'free_free',
            title: 'Free Shipping',
            amount: 0,
        },
        {
            code: 'flat_rate',
            method: 'flatrate_flatrate',
            title: 'Flat Rate',
            amount: Number(flatRate),
        },
    ];


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

    const selectPaymentMethod = method => {
        setSelectedPayment(method.code);
    };


    // const renderPaymentItem = ({ item }) => (
    //     {

    //         <Text>{JSON.stringify(customer?.group?.allow_credit_payment)}</Text>
    //         <Text>{JSON.stringify(customer?.group?.allow_credit_payment)}</Text>
    //     }

    //     // <Payment selectPaymentMethod={selectPaymentMethod} key={item.id} item={item} selectedPayment={selectedPayment} />
    // );

    const renderPaymentItem = ({ item }) => (
        <>
            {/* <Text> */}
            {/* {JSON.stringify(customer?.group?.allow_credit_payment)} */}
            {/* {JSON.stringify(item)} */}
            {/* </Text> */}

            {(item.code !== 'creditpayment' || customer?.group?.allow_credit_payment == 1) && (
                <Payment
                    selectPaymentMethod={selectPaymentMethod}
                    key={item.id}
                    item={item}
                    selectedPayment={selectedPayment}
                />
            )}
        </>
    );

    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [placedOrder, setPlacedOrder] = useState(null);

    const saveAddress = async () => {
        if (placingOrder) return;

        try {
            if (!selectedAddress || !shippingAddress) {
                Alert.alert('Error', 'Please select address');
                return;
            }

            // Alert.alert(JSON.stringify(selectedShippingMethod === "free_shipping" ? 'free_free' : 'flatrate_flatrate'));

            // return;
            setPlacingOrder(true);

            const addressPayload = {
                shipping: {
                    address: shippingAddress.address,
                    save_as_address: false,
                    first_name: shippingAddress.first_name,
                    last_name: shippingAddress.last_name,
                    email: shippingAddress.email,
                    company_name: shippingAddress.company_name,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    country: shippingAddress.country,
                    postcode: shippingAddress.postcode,
                    phone: shippingAddress.phone,
                    vat_id: shippingAddress.vat_id,
                },

                billing: {
                    address: selectedAddress.address,
                    save_as_address: false,
                    first_name: selectedAddress.first_name,
                    last_name: selectedAddress.last_name,
                    email: selectedAddress.email,
                    company_name: selectedAddress.company_name,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    country: selectedAddress.country,
                    postcode: selectedAddress.postcode,
                    phone: selectedAddress.phone,
                    vat_id: selectedAddress.vat_id,
                },

                shipping_method: selectedShippingMethod === "free_shipping" ? 'free_free' : 'flatrate_flatrate',

                payment: {
                    method: selectedPayment,
                },
            };

            console.time('PLACE ORDER');

            // 1. Save address
            console.time('save-address');

            await axios.post(
                '/customer/checkout/save-address',
                addressPayload
            );

            console.timeEnd('save-address');

            // 2. Save shipping
            console.time('save-shipping');

            await axios.post(
                '/customer/checkout/save-shipping',
                {
                    shipping_method: selectedShippingMethod == 'free_shipping'
                        ? 'free_free'
                        : 'flatrate_flatrate',
                }
            );

            console.timeEnd('save-shipping');

            // 3. Save payment
            console.time('save-payment');

            await axios.post(
                '/customer/checkout/save-payment',
                {
                    payment: {
                        method: selectedPayment,
                    },
                }
            );

            console.timeEnd('save-payment');

            // 4. Place order
            console.time('save-order');

            const orderResponse = await axios.post(
                '/customer/checkout/save-order'
            );

            console.timeEnd('save-order');
            console.timeEnd('PLACE ORDER');

            console.log('Order:', orderResponse.data);

            // Store order response
            setPlacedOrder(orderResponse.data);

            // Hide loading and show success modal
            setPlacingOrder(false);
            setOrderSuccess(true);

            CartEvents.emit([]);

        } catch (error) {
            console.error(
                'Order error:',
                error.response?.data || error.message
            );

            setPlacingOrder(false);

            Alert.alert(
                'Order Failed',
                error.response?.data?.message ||
                'Unable to place order. Please try again.'
            );
        }
    };


    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await Promise.all([
                loadCart(),
                fetchAddress(),
                fetchConfig(),
                redirectLogin(),
            ]);
        } catch (error) {
            console.log('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const renderFooter = () => (
        <View style={{ elevation: 10 }}>
            <ProductPrice cartData={cartData} shippingPrice={shippingPrice} />


            <View style={[styles.summary, { marginTop: 10, marginBottom: 10 }]}>

                <Text style={styles.heading}>Billing Address</Text>

                <FlatList
                    data={addresses}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderAddress}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 30 }}>
                            No Address Found
                        </Text>
                    }
                />
                <AddressForm
                    onSuccess={handleAddressAdded}
                />
                <IsSameShipping
                    value={isSameShippingAddress}
                    onChange={toggleShippingAddress}
                />
            </View>



            {!isSameShippingAddress && (
                <View style={[styles.summary, { marginBottom: 20 }]}>
                    <>
                        <Text style={styles.heading}>Shipping Address</Text>
                        <FlatList
                            data={addresses}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderShippingAddress}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                            ListEmptyComponent={
                                <Text style={{ textAlign: 'center', marginTop: 30 }}>
                                    No Address Found
                                </Text>
                            }
                        />

                        <AddressForm
                            onSuccess={handleAddressAdded}
                        />
                    </>
                </View>
            )}


            <View style={styles.containerShipping}>
                <Text style={styles.headingShipping}>Shipping Method</Text>

                <View style={styles.rowShipping}>
                    <Text>{JSON.stringify(selectShippingMethod)}</Text>

                    {shippingMethods.map(item => {
                        const active = selectedShippingMethod === item.code;


                        return (
                            <ShippingMethod key={item.code} selectShippingMethod={selectShippingMethod} item={item} active={active} />
                        );
                    })}
                </View>
            </View>

            <View style={styles.containerPayment}>
                <Text style={styles.headingPayment}>Payment Method</Text>

                <FlatList
                    data={paymentMethods}
                    keyExtractor={item => item.code}
                    renderItem={renderPaymentItem}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.rowPayment}
                    contentContainerStyle={{ paddingBottom: 5 }}
                />
            </View>
            <View style={{ paddingHorizontal: 50, marginBottom: 20 }}>
                <TouchableOpacity
                    disabled={!selectedAddress || !shippingAddress}
                    style={{
                        backgroundColor:
                            !selectedAddress || !shippingAddress
                                ? '#BDBDBD'
                                : '#0C3F80',
                        padding: 15,
                        borderRadius: 20,
                        opacity:
                            !selectedAddress || !shippingAddress
                                ? 0.6
                                : 1,
                    }}

                    onPress={saveAddress}
                >
                    <Text
                        style={{
                            color: '#fff',
                            textAlign: 'center',
                        }}
                    >
                        Place Order
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadCheckout = async () => {
            setLoading(true);

            try {
                await Promise.all([
                    loadCart(),
                    fetchAddress(),
                    fetchConfig(),
                ]);
            } catch (error) {
                console.log('Checkout loading error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCheckout();
    }, []);



    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                {loading ? (<CheckoutSkeleton />) : (<FlatList
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
                    ListHeaderComponent={
                        <View style={{ padding: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cart Summary</Text>
                        </View>
                    }
                    ListFooterComponent={renderFooter}
                />)}

                {placingOrder && (
                    <View style={styles.loadingOverlay}>
                        <View style={styles.loadingBox}>
                            <ActivityIndicator
                                size="large"
                                color="#0C3F80"
                            />

                            <Text style={styles.loadingTitle}>
                                Placing your order
                            </Text>

                            <Text style={styles.loadingText}>
                                Please wait while we process your order...
                            </Text>
                        </View>
                    </View>
                )}

                <Modal
                    visible={orderSuccess}
                    transparent
                    animationType="fade"
                    onRequestClose={() => { }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.successModal}>

                            {/* Success Icon */}
                            <View style={styles.successIcon}>
                                <Ionicons
                                    name="checkmark"
                                    size={42}
                                    color="#fff"
                                />
                            </View>

                            <Text style={styles.successTitle}>
                                Order Placed!
                            </Text>

                            <Text style={styles.successMessage}>
                                Your order has been placed successfully.
                            </Text>

                            {placedOrder?.data?.increment_id && (
                                <Text style={styles.orderNumber}>
                                    Order #{placedOrder.data.increment_id}
                                </Text>
                            )}

                            {/* Continue Shopping */}
                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={() => {
                                    setOrderSuccess(false);
                                    navigation.replace('Drawer');
                                }}
                            >
                                <Text style={styles.continueButtonText}>
                                    Continue Shopping
                                </Text>
                            </TouchableOpacity>

                            {/* View Order */}
                            <TouchableOpacity
                                style={styles.viewOrderButton}
                                onPress={() => {
                                    setOrderSuccess(false);
                                    navigation.replace('OrderShow', {
                                        order: placedOrder
                                    });
                                }}
                            >
                                <Text style={styles.viewOrderButtonText}>
                                    View Order
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    );
};

export default Checkout;

const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginBottom: 15,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    containerShipping: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#fff'
    },

    headingShipping: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#222',
    },
    rowShipping: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerPayment: {
        marginTop: 15,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
    },
    headingPayment: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginBottom: 15,
    },




    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },

    loadingBox: {
        width: '82%',
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 30,
        paddingHorizontal: 25,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },

    loadingTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginTop: 18,
    },

    loadingText: {
        fontSize: 14,
        color: '#777',
        marginTop: 8,
        textAlign: 'center',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },

    successModal: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 25,
        alignItems: 'center',
        elevation: 15,
    },

    successIcon: {
        width: 75,
        height: 75,
        borderRadius: 40,
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
    },

    successTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#222',
    },

    successMessage: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 21,
    },

    orderNumber: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0C3F80',
        marginTop: 15,
    },

    continueButton: {
        width: '100%',
        backgroundColor: '#0C3F80',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 25,
    },

    continueButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700',
    },

    viewOrderButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#0C3F80',
        marginTop: 10,
    },

    viewOrderButtonText: {
        color: '#0C3F80',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '700',
    },
});
