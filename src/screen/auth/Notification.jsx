
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../../component/Header';
import { BASE_URL } from '../../services/config';

const NOTIFICATION_STYLES = {
    order_placed: {
        icon: 'bag-check-outline',
        color: '#2563EB',
        background: '#DBEAFE',
    },
    order_payment: {
        icon: 'card-outline',
        color: '#059669',
        background: '#D1FAE5',
    },
    order_invoiced: {
        icon: 'receipt-outline',
        color: '#7C3AED',
        background: '#EDE9FE',
    },
    order_shipped: {
        icon: 'car-outline',
        color: '#EA580C',
        background: '#FFEDD5',
    },
    order_delivered: {
        icon: 'checkmark-circle-outline',
        color: '#16A34A',
        background: '#DCFCE7',
    },
};

const DEFAULT_STYLE = {
    icon: 'notifications-outline',
    color: '#2563EB',
    background: '#DBEAFE',
};

const getRelativeTime = dateString => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const difference = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) return 'Just now';

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        ...(date.getFullYear() !== new Date().getFullYear()
            ? { year: 'numeric' }
            : {}),
    });
};

const Notification = ({navigation}) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const unreadCount = notifications.filter(
        item => !item.read,
    ).length;

    const fetchNotifications = useCallback(async () => {
        try {
            setErrorMessage('');

            const token = await AsyncStorage.getItem('token');

            if (!token) {
                setNotifications([]);
                setErrorMessage(
                    'Please log in to view your notifications.',
                );
                return;
            }

            const response = await axios.get(
                `${BASE_URL}/api/v1/customer/notifications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    timeout: 15000,
                },
            );

            console.log(response.data);
            const payload = response.data;

            const rows = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload?.notifications)
                        ? payload.notifications
                        : [];

            setNotifications(rows);
        } catch (error) {
            console.error(
                'Fetch notifications failed:',
                error.response?.data || error.message,
            );

            if (error.response?.status === 401) {
                setErrorMessage(
                    'Your session has expired. Please log in again.',
                );
            } else if (!error.response) {
                setErrorMessage(
                    'Unable to connect. Check your internet connection.',
                );
            } else {
                setErrorMessage(
                    'Unable to load notifications. Please try again.',
                );
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const markAllAsRead = () => {
        // Local UI update only.
        // Call your Laravel mark-as-read API here to persist the changes.
        setNotifications(current =>
            current.map(item => ({
                ...item,
                read: true,
            })),
        );
    };

    const markAsRead = async (notificationId) => {
    const notification = notifications.find(
        item => item.id === notificationId,
    );

    if (!notification || notification.read) {
        return;
    }

    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            console.log('Authentication token not found');
            return;
        }

        await axios.put(
            `${BASE_URL}/api/v1/customer/notifications/${notificationId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
        );

        setNotifications(current =>
            current.map(item =>
                item.id === notificationId
                    ? { ...item, read: true }
                    : item,
            ),
        );

        
    } catch (error) {
        console.error(
            'Failed to mark notification as read:',
            error.response?.status,
            error.response?.data || error.message,
        );
    }
};

    const renderItem = ({ item }) => {
        const appearance =
            NOTIFICATION_STYLES[item.type] || DEFAULT_STYLE;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.notificationCard,
                    !item.read && styles.unreadCard,
                ]}
                onPress={() => {
                    markAsRead(item.id);
                    // Navigate to order details here if needed.
                    // Example:
                    navigation.navigate('OrderShow', {
                        order: item.order,
                    });
                }}
            >
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: appearance.background },
                    ]}
                >
                    <Ionicons
                        name={appearance.icon}
                        size={25}
                        color={appearance.color}
                    />
                </View>

                <View style={styles.notificationContent}>
                    <View style={styles.titleRow}>
                        <Text
                            style={[
                                styles.notificationTitle,
                                !item.read && styles.unreadTitle,
                            ]}
                        >
                            {item.title}
                        </Text>

                        {!item.read && <View style={styles.unreadDot} />}
                    </View>

                    <Text style={styles.notificationMessage}>
                        {item.message}
                    </Text>

                    <View style={styles.footer}>
                        <View style={styles.timeContainer}>
                            <Ionicons
                                name="time-outline"
                                size={13}
                                color="#94A3B8"
                            />
                            <Text style={styles.timeText}>
                                {getRelativeTime(item.created_at)}
                            </Text>
                        </View>

                        {item.order_id != null && (
                            <View style={styles.orderBadge}>
                                <Text style={styles.orderBadgeText}>
                                    Order #{item.order_id}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <StatusBar
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <Header />

            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headingRow}>
                        <View style={styles.headingIcon}>
                            <Ionicons
                                name="notifications"
                                size={23}
                                color="#FFFFFF"
                            />
                        </View>

                        <View style={styles.headingContent}>
                            <Text style={styles.headerTitle}>
                                Notifications
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                Stay updated on your orders
                            </Text>
                        </View>
                    </View>

                    {unreadCount > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>
                                {unreadCount}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.toolbar}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Recent activity
                        </Text>
                        <Text style={styles.sectionSubtitle}>
                            {notifications.length} notification
                            {notifications.length === 1 ? '' : 's'}
                        </Text>
                    </View>

                    {unreadCount > 0 && (
                        <TouchableOpacity
                            onPress={markAllAsRead}
                            activeOpacity={0.7}
                            style={styles.markReadButton}
                        >
                            <Ionicons
                                name="checkmark-done-outline"
                                size={17}
                                color="#174A8B"
                            />
                            <Text style={styles.markReadText}>
                                Mark all read
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View style={styles.centerState}>
                        <ActivityIndicator
                            size="large"
                            color="#174A8B"
                        />
                        <Text style={styles.stateSubtitle}>
                            Loading notifications...
                        </Text>
                    </View>
                ) : errorMessage ? (
                    <View style={styles.centerState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="cloud-offline-outline"
                                size={38}
                                color="#64748B"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            Unable to load
                        </Text>
                        <Text style={styles.stateSubtitle}>
                            {errorMessage}
                        </Text>

                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                setLoading(true);
                                fetchNotifications();
                            }}
                        >
                            <Ionicons
                                name="refresh-outline"
                                size={18}
                                color="#FFFFFF"
                            />
                            <Text style={styles.retryText}>
                                Try again
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={item => String(item.id)}
                        renderItem={renderItem}
                        contentContainerStyle={[
                            styles.listContent,
                            notifications.length === 0 &&
                            styles.emptyListContent,
                        ]}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#174A8B']}
                                tintColor="#174A8B"
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIcon}>
                                    <Ionicons
                                        name="notifications-off-outline"
                                        size={42}
                                        color="#94A3B8"
                                    />
                                </View>

                                <Text style={styles.emptyTitle}>
                                    You're all caught up!
                                </Text>

                                <Text style={styles.stateSubtitle}>
                                    Your order updates and notifications
                                    will appear here.
                                </Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </>
    );
};

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB',
    },

    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#EDF1F7',
    },

    headingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    headingIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#174A8B',
        alignItems: 'center',
        justifyContent: 'center',
    },

    headingContent: {
        marginLeft: 13,
        flex: 1,
    },

    headerTitle: {
        fontSize: 23,
        fontWeight: '800',
        color: '#172B4D',
        letterSpacing: -0.5,
    },

    headerSubtitle: {
        fontSize: 13,
        color: '#718096',
        marginTop: 4,
    },

    countBadge: {
        minWidth: 30,
        height: 30,
        paddingHorizontal: 8,
        borderRadius: 15,
        backgroundColor: '#E7EEFA',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },

    countBadgeText: {
        color: '#174A8B',
        fontSize: 13,
        fontWeight: '800',
    },

    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 17,
    },

    sectionTitle: {
        color: '#172B4D',
        fontSize: 16,
        fontWeight: '800',
    },

    sectionSubtitle: {
        color: '#8492A6',
        fontSize: 12,
        marginTop: 4,
    },

    markReadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8EFF9',
        borderRadius: 9,
        paddingHorizontal: 10,
        paddingVertical: 9,
        marginLeft: 8,
    },

    markReadText: {
        color: '#174A8B',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 5,
    },

    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 25,
    },

    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EDF1F7',
        shadowColor: '#172B4D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.035,
        shadowRadius: 8,
        elevation: 2,
    },

    unreadCard: {
        backgroundColor: '#FCFDFF',
        borderColor: '#CFDDF2',
        borderLeftWidth: 3,
        borderLeftColor: '#2563EB',
    },

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    notificationContent: {
        flex: 1,
        marginLeft: 12,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    notificationTitle: {
        flex: 1,
        color: '#344054',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
    },

    unreadTitle: {
        color: '#172B4D',
        fontWeight: '800',
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2563EB',
        marginTop: 6,
        marginLeft: 8,
    },

    notificationMessage: {
        fontSize: 13,
        color: '#667085',
        lineHeight: 20,
        marginTop: 6,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 12,
        rowGap: 8,
    },

    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    timeText: {
        color: '#94A3B8',
        fontSize: 11,
        marginLeft: 4,
    },

    orderBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 6,
    },

    orderBadgeText: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '700',
    },

    centerState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 35,
    },

    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    emptyState: {
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 30,
    },

    emptyIcon: {
        width: 82,
        height: 82,
        borderRadius: 27,
        backgroundColor: '#E8EEF6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 17,
    },

    emptyTitle: {
        color: '#172B4D',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },

    stateSubtitle: {
        color: '#8492A6',
        fontSize: 13,
        lineHeight: 21,
        textAlign: 'center',
        marginTop: 8,
    },

    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#174A8B',
        paddingHorizontal: 18,
        paddingVertical: 11,
        borderRadius: 10,
        marginTop: 20,
    },

    retryText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
        marginLeft: 7,
    },
});