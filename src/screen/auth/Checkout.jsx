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
import AddressForm from "../../component/AddressForm"
import AddressList from "../../component/AddressList"
import Ionicons from 'react-native-vector-icons/Ionicons';
import IsSameShipping from "../../component/IsSameShipping";
import ShippingMethod from "../../component/ShippingMethod";
import PaymentMethod from '../../component/PaymentMethod';
// FIXED: Destructured navigation from props to prevent crash during redirect


const esewaIcon = require('../../../assets/images/esewa.png');
const codIcon = require('../../../assets/images/cod.png');
const creditIcon = require('../../../assets/images/credit.png');
const connectIpsIcon = require('../../../assets/images/connect.png');
const Checkout = ({ navigation }) => {

    const [carts, setCarts] = useState([]);
    const [cartData, setCartData] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [refreshAddress, setRefreshAddress] = useState(0);
    const [isSameShippingAddress, setIsSameShippingAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [shippingPrice, setShippingPrice] = useState({amount:0})

    const [continueProcess, setContinueProcess] = useState(false);

    const toggleShippingAddress = (checked) => {
        // Alert.alert('success', checked ? "hlo" : '1')
        setIsSameShippingAddress(checked);
        // setShippingAddress(id ?? null);
        if (checked) {
            setShippingAddress(selectedAddress)
        } else {
            setShippingAddress(null)
        }
    }

    const fetchAddress = async () => {
        try {
            const response = await axios.get('/customer/addresses');
            const data = response.data.data || [];

            setAddresses(data);

            const defaultAddress = data.find(item => item.default_address);

            if (defaultAddress) {
                setSelectedAddress(defaultAddress.id);
                onSelectAddress?.(defaultAddress);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddress();
    }, []);

    const renderAddress = ({ item }) => {
        const selected = selectedAddress?.id === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedAddress(item)}
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

    const renderShippingAddress = ({ item }) => {
        const selected = shippingAddress?.id === item.id;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShippingAddress(item)}
                style={[
                    styles.card,
                    selected && styles.selectedCard,
                ]}>
                {/* <Text>{JSON.stringify(shippingAddress)}</Text> */}
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

    const handleAddressAdded = () => {
        setRefreshAddress(prev => prev + 1);
    };

    const processForShipping = () => {
        // Alert.alert('success',"Clicked")
        setContinueProcess(true)

    }


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

    useEffect(() => {
        fetchConfig();
    }, []);

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
            title: 'Free Shipping',
            amount: 0,
        },
        {
            code: 'flat_rate',
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


    const renderPaymentItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => selectPaymentMethod(item)}
            style={[
                styles.cardPayment,
                selectedPayment === item.codePayment && styles.selectedCardPayment,
            ]}>
            <Ionicons
                name={
                    selectedPayment === item.code
                        ? 'radio-button-on'
                        : 'radio-button-off'
                }
                size={22}
                color="#0C3F80"
                style={styles.radioPayment}
            />

            <Image
                source={item.image}
                style={styles.iconPayment}
                resizeMode="contain"
            />

            <Text style={styles.titlePayment}>{item.title}</Text>
        </TouchableOpacity>
    );

    // FIXED: Wrapped non-list items into a single function component to safely handle screen scrolling behaviors
    const renderFooter = () => (
        <View style={{ marginTop: 5, elevation: 10 }}>
            <View style={styles.summary}>
                <View style={styles.row}>
                    <Text style={[styles.totalText, { color: '#303030' }]}>Subtotal</Text>
                    <Text>{cartData?.formatted_sub_total}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.totalText, { color: '#303030' }]}>TAX</Text>
                    <Text>{cartData?.formatted_tax_total}</Text>
                </View>

                <View style={styles.divider} />
                <View style={styles.row}>
                    <Text style={styles.totalText}>Grand Total</Text>
                    <Text style={styles.totalText}>Rs. {cartData?.base_grand_total + shippingPrice?.amount ?? 0}</Text>
                </View>
            </View>

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
                {/* <Text>{JSON.stringify(selectedAddress)}</Text> */}
                {/* <Text>{JSON.stringify(shippingAddress)}</Text> */}
                <IsSameShipping
                    value={isSameShippingAddress}
                    onChange={toggleShippingAddress}
                />
                {/* <IsSameShipping value="isSameShippingAddress" onChange="toggleShippingAddress" /> */}
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
            {/* <IsSameShipping value="isSameShippingAddress" onChange="toggleShippingAddress" /> */}
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

                    onPress={processForShipping}
                >
                    <Text
                        style={{
                            color: '#fff',
                            textAlign: 'center',
                        }}
                    >
                        Proceed
                    </Text>
                </TouchableOpacity>

                {/* <Text>{continueProcess ? 'Yes' : 'no'}</Text> */}
            </View>

            <View style={styles.containerShipping}>
                <Text style={styles.headingShipping}>Shipping Method</Text>

                <View style={styles.rowShipping}>
                    {shippingMethods.map(item => {
                        const active = selectedShippingMethod === item.code;

                        return (
                            <TouchableOpacity
                                key={item.code}
                                style={[
                                    styles.cardShipping,
                                    active && styles.selectedCardShipping,
                                ]}
                                onPress={() => selectShippingMethod(item.code)}
                            >
                                <Ionicons
                                    name={active ? 'radio-button-on' : 'radio-button-off'}
                                    size={22}
                                    color="#0C3F80"
                                />

                                <View style={styles.info}>
                                    <Text style={styles.titleShipping}>{item.title}</Text>
                                    <Text style={styles.priceShipping}>
                                        Rs. {item.amount.toFixed(2)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
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
            {/* <PaymentMethod /> */}
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

                    onPress={processForShipping}
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

                {/* <Text>{continueProcess ? 'Yes' : 'no'}</Text> */}
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











    // ===============================
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

    // =======Shipping
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

    cardShipping: {
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

    selectedCardShipping: {
        borderColor: '#0C3F80',
        borderWidth: 2,
    },

    infoShipping: {
        marginLeft: 10,
        flex: 1,
    },

    titleShipping: {
        fontSize: 14,
        fontWeight: '600',
    },

    priceShipping: {
        marginTop: 4,
        fontSize: 13,
        color: '#0C3F80',
        fontWeight: '700',
    },
    // ==============payment
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

    rowPayment: {
        justifyContent: 'space-between',
    },

    cardPayment: {
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

    selectedCardPayment: {
        borderWidth: 2,
        borderColor: '#0C3F80',
        backgroundColor: '#F5F9FF',
    },

    radioPayment: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

    iconPayment: {
        width: 150,
        height: 65,
        marginBottom: 12,
    },

    titlePayment: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
    },

    subtitlePayment: {
        marginTop: 6,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});
