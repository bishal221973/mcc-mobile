import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
const Notification = () => {
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            title: 'Order Delivered',
            message:
                'Your order #ORD-1001 has been delivered successfully.',
            time: '10 min ago',
            type: 'checkmark-circle',
            color: '#28A745',
            unread: true,
        },
        {
            id: '2',
            title: 'Order Shipped',
            message:
                'Your order #ORD-1002 has been shipped and is on the way.',
            time: '2 hours ago',
            type: 'car-outline',
            color: '#0C3F80',
            unread: true,
        },
        {
            id: '3',
            title: 'Special Offer',
            message:
                'Enjoy 20% OFF on all fashion products this weekend.',
            time: 'Yesterday',
            type: 'pricetag-outline',
            color: '#FF9800',
            unread: false,
        },
        {
            id: '4',
            title: 'Payment Successful',
            message:
                'Your payment of $249 has been received successfully.',
            time: '2 days ago',
            type: 'card-outline',
            color: '#673AB7',
            unread: false,
        },
        {
            id: '5',
            title: 'Wishlist Price Drop',
            message:
                'One of your wishlist items is now available at a lower price.',
            time: '3 days ago',
            type: 'heart-outline',
            color: '#E53935',
            unread: false,
        },
    ]);

    const markAllAsRead = () => {
        setNotifications(items =>
            items.map(item => ({
                ...item,
                unread: false,
            })),
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.card,
                item.unread && styles.unreadCard,
            ]}>
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: item.color + '20' },
                ]}>
                <Ionicons
                    name={item.type}
                    size={24}
                    color={item.color}
                />
            </View>

            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.title}>{item.title}</Text>

                    {item.unread && <View style={styles.dot} />}
                </View>

                <Text style={styles.message}>
                    {item.message}
                </Text>

                <Text style={styles.time}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                {/* Header */}

                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>
                            Notifications
                        </Text>

                        <Text style={styles.headerSubtitle}>
                            {notifications.length} Notifications
                        </Text>
                    </View>

                    <TouchableOpacity onPress={markAllAsRead}>
                        <Text style={styles.readText}>
                            Mark all as read
                        </Text>
                    </TouchableOpacity>
                </View>

                {notifications.length > 0 ? (
                    <FlatList
                        data={notifications}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            padding: 15,
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.empty}>
                        <Ionicons
                            name="notifications-off-outline"
                            size={70}
                            color="#bbb"
                        />

                        <Text style={styles.emptyTitle}>
                            No Notifications
                        </Text>

                        <Text style={styles.emptyText}>
                            You're all caught up.
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        </>
    );
};

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },

    header: {
        backgroundColor: '#fff',
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222',
    },

    headerSubtitle: {
        color: '#777',
        marginTop: 2,
        fontSize: 13,
    },

    readText: {
        color: '#0C3F80',
        fontWeight: '600',
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        elevation: 2,
    },

    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#0C3F80',
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

    content: {
        flex: 1,
        marginLeft: 14,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
        flex: 1,
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#0C3F80',
        marginLeft: 8,
    },

    message: {
        marginTop: 5,
        color: '#666',
        lineHeight: 20,
        fontSize: 14,
    },

    time: {
        marginTop: 8,
        fontSize: 12,
        color: '#999',
    },

    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyTitle: {
        marginTop: 15,
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },

    emptyText: {
        marginTop: 8,
        color: '#777',
        fontSize: 15,
    },
});