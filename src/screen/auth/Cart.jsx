import React, { useState } from 'react';
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
const Cart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            name: 'Apple iPhone 15 Pro',
            variant: '256GB • Black Titanium',
            price: 1799,
            qty: 1,
            image: require('../../../assets/products/1.webp'),
        },
        {
            id: '2',
            name: 'Nike Air Max',
            variant: 'Size 42 • White',
            price: 249,
            qty: 2,
            image: require('../../../assets/products/2.webp'),
        },
        {
            id: '3',
            name: 'Nike Air Max',
            variant: 'Size 42 • White',
            price: 249,
            qty: 2,
            image: require('../../../assets/products/3.webp'),
        },
        {
            id: '4',
            name: 'Nike Air Max',
            variant: 'Size 42 • White',
            price: 249,
            qty: 2,
            image: require('../../../assets/products/1.webp'),
        },
    ]);

    const increaseQty = id => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item,
            ),
        );
    };

    const decreaseQty = id => {
        setCartItems(items =>
            items.map(item =>
                item.id === id && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item,
            ),
        );
    };

    const removeItem = id => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
    );

    const shipping = subtotal > 0 ? 20 : 0;
    const total = subtotal + shipping;

    const renderItem = ({ item }) => (
        <>

            <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.info}>
                    <Text numberOfLines={2} style={styles.name}>
                        {item.name}
                    </Text>

                    <Text style={styles.variant}>{item.variant}</Text>

                    <Text style={styles.price}>${item.price}</Text>

                    <View style={styles.bottomRow}>
                        <View style={styles.qtyContainer}>
                            <TouchableOpacity
                                onPress={() => decreaseQty(item.id)}
                                style={styles.qtyButton}>
                                <Text style={styles.qtyText}>−</Text>
                            </TouchableOpacity>

                            <Text style={styles.qty}>{item.qty}</Text>

                            <TouchableOpacity
                                onPress={() => increaseQty(item.id)}
                                style={styles.qtyButton}>
                                <Text style={styles.qtyText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Text style={styles.remove}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Order Summary</Text>

                    <View style={styles.row}>
                        <Text>Subtotal</Text>
                        <Text>${subtotal}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text>Shipping</Text>
                        <Text>${shipping}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.totalText}>${total}</Text>
                            <Text style={{ fontSize: 12, color: '#999' }}>Total amount to be paid</Text>
                        </View>

                        <TouchableOpacity style={styles.checkoutButton}>
                            <Text style={styles.checkoutText}>
                                Proceed
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: '#eee',
    },

    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },

    name: {
        fontSize: 16,
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
        fontSize: 18,
        marginTop: 8,
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
        width: 35,
        height: 35,
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