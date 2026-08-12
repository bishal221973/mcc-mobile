import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
import axios from "../../services/axios";

const Orders = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/customer/orders');
            console.log('Orders response:', res.data);
            setOrders(res.data?.data || []);
        } catch (error) {
            console.log(
                'Failed to fetch order:',
                error?.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchOrders();
        } finally {
            setRefreshing(false);
        }
    };

    // const getStatusStyles = (status) => {
    //     switch (status) {
    //         case 'Delivered':
    //             return { text: '#2E7D32', bg: '#E8F5E9' };
    //         case 'Processing':
    //             return { text: '#EF6C00', bg: '#FFF3E0' };
    //         case 'Cancelled':
    //             return { text: '#C62828', bg: '#FFEBEE' };
    //         default:
    //             return { text: '#616161', bg: '#F5F5F5' };
    //     }
    // };
    const getStatusStyles = (status) => {
        const normalizedStatus = String(status || '').trim().toLowerCase();

        switch (normalizedStatus) {
            case 'delivered':
                return { text: '#2E7D32', bg: '#E8F5E9' };

            case 'processing':
                return { text: '#0991B2', bg: '#0991B210' };

            case 'cancelled':
            case 'canceled':
                return { text: '#C62828', bg: '#FFEBEE' };
            case 'pending':
                return { text: '#C62828', bg: '#FFEBEE' };

            default:
                return { text: '#616161', bg: '#F5F5F5' };
        }
    };

    const renderItem = ({ item }) => {
        const statusStyle = getStatusStyles(item.status);

        const itemImage =
            item?.items?.[0]?.product?.image_url ||
            'https://placeholder.com';

        const itemName = item?.items?.[0]?.name || 'Order Items';
        const totalItems = item?.items?.length || 1;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate('OrderShow', {
                        order: item,
                    })
                }
            >
                <View style={styles.topRow}>
                    <View>
                        <Text style={styles.orderId}>
                            Order #{item.id}
                        </Text>

                        <Text style={styles.date}>
                            {item.created_at}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor: statusStyle.bg,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                {
                                    color: statusStyle.text,
                                },
                            ]}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="bag-handle-outline" size={64} color="#B0BEC5" />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>When you place an order, it will appear here.</Text>
        </View>
    );

    return (
        <View style={styles.screenWrapper}>
            <Header />
            <SafeAreaView style={styles.container}>
                <View style={[styles.headerRow]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={20}
                            color="#0C3F80"
                        />

                        <Text style={styles.backText}>
                            Back
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>My Orders</Text>
                        <Text style={styles.headerSubtitle}>
                            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                        </Text>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0C3F80" />
                    </View>
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmptyState}
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
                )}
            </SafeAreaView>
        </View>
    );
};

export default Orders;

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
    },
    headerRow: {
        backgroundColor: '#fff',
        // paddingHorizontal: 20,
        // paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        // paddingLeft:10
        paddingHorizontal: 20,
    },
    header: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#666666',
        marginTop: 4,
        fontWeight: '500',
        textAlign:'right'
    },

    card: {
        backgroundColor: '#fff',
        // borderRadius: 16,
        padding: 16,
        marginBottom: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        // borderBottomWidth: 1,
        // borderBottomColor: '#F5F5F5',
        paddingBottom: 1,
        marginBottom: 12,
    },
    orderId: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    date: {
        fontSize: 12,
        color: '#888888',
        marginTop: 3,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
    },
    info: {
        flex: 1,
        marginLeft: 14,
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2C3E50',
    },
    qty: {
        fontSize: 13,
        color: '#7F8C8D',
        marginTop: 3,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginTop: 12,
        // backgroundColor:'#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    priceContainer: {
        flexDirection: 'column',
    },
    priceLabel: {
        fontSize: 11,
        color: '#888888',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 1,
    },
    outlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F4F8',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    outlineText: {
        marginRight: 4,
        fontSize: 13,
        color: '#0C3F80',
        fontWeight: '700',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#455A64',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#90A4AE',
        textAlign: 'center',
        marginTop: 6,
        paddingHorizontal: 32,
    },
    backButton: {
        height: 42,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: '#F1F5FA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    backText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '700',
        color: '#0C3F80',
    },
});
