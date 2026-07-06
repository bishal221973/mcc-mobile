import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
const Orders = ({ navigation }) => {
    const [orders] = useState([
        {
            id: 'ORD-1001',
            date: '06 Jul 2026',
            status: 'Delivered',
            total: '$1,799',
            qty: 1,
            product: 'Apple iPhone 15 Pro',
            image: require('../../../assets/products/3.webp'),
        },
        {
            id: 'ORD-1002',
            date: '03 Jul 2026',
            status: 'Processing',
            total: '$249',
            qty: 2,
            product: 'Nike Air Max',
            image: require('../../../assets/products/3.webp'),
        },
        {
            id: 'ORD-1003',
            date: '28 Jun 2026',
            status: 'Cancelled',
            total: '$599',
            qty: 1,
            product: 'Samsung Galaxy Watch',
            image: require('../../../assets/products/3.webp'),
        },
        {
            id: 'ORD-1004',
            date: '22 Jun 2026',
            status: 'Delivered',
            total: '$129',
            qty: 1,
            product: 'Wireless Earbuds',
            image: require('../../../assets/products/3.webp'),
        },
        {
            id: 'ORD-1005',
            date: '22 Jun 2026',
            status: 'Delivered',
            total: '$129',
            qty: 1,
            product: 'Wireless Earbuds',
            image: require('../../../assets/products/3.webp'),
        },
    ]);

    const getStatusColor = status => {
        switch (status) {
            case 'Delivered':
                return '#28a745';
            case 'Processing':
                return '#ff9800';
            case 'Cancelled':
                return '#e53935';
            default:
                return '#999';
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* Top */}
            <View style={styles.topRow}>
                <View>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) },
                    ]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            {/* Product */}
            <View style={styles.productRow}>
                <Image source={item.image} style={styles.image} />

                <View style={styles.info}>
                    <Text numberOfLines={2} style={styles.productName}>
                        {item.product}
                    </Text>

                    <Text style={styles.qty}>
                        Qty: {item.qty}
                    </Text>

                    <Text style={styles.price}>{item.total}</Text>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.outlineButton}
                    onPress={() =>
                        navigation.navigate('OrderDetails', {
                            order: item,
                        })
                    }>
                    <Ionicons
                        name="document-text-outline"
                        size={16}
                        color="#0C3F80"
                    />

                    <Text style={styles.outlineText}>
                        Details
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryButton}>
                    <Ionicons
                        name="refresh-outline"
                        size={16}
                        color="#fff"
                    />

                    <Text style={styles.primaryText}>
                        Buy Again
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        My Orders
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        {orders.length} Orders Found
                    </Text>
                </View>

                <FlatList
                    data={orders}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingBottom: 20,
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </>
    );
};

export default Orders;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },

    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 16,
        elevation: 2,
        marginBottom: 8,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222',
    },

    headerSubtitle: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        elevation: 2,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    orderId: {
        fontSize: 14,
        fontWeight: '700',
        color: '#222',
    },

    date: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },

    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        resizeMode: 'cover',
    },

    info: {
        flex: 1,
        marginLeft: 12,
    },

    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },

    qty: {
        fontSize: 12,
        color: '#777',
        marginTop: 4,
    },

    price: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0C3F80',
        marginTop: 4,
    },

    buttonRow: {
        flexDirection: 'row',
        marginTop: 12,
    },

    outlineButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0C3F80',
        borderRadius: 8,
        paddingVertical: 9,
        marginRight: 5,
    },

    outlineText: {
        marginLeft: 5,
        fontSize: 13,
        color: '#0C3F80',
        fontWeight: '600',
    },

    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0C3F80',
        borderRadius: 8,
        paddingVertical: 9,
        marginLeft: 5,
    },

    primaryText: {
        marginLeft: 5,
        fontSize: 13,
        color: '#fff',
        fontWeight: '600',
    },
});