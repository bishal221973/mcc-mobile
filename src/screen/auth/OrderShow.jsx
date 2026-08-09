import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Header from '../../component/Header';
import OrderInfo from "../../component/Order/OrderInfo";
import OrderItem from "../../component/Order/OrderItem";
import OrderSummary from "../../component/Order/OrderSummary";
const OrderShow = ({ route }) => {
    const { order } = route.params;
    const [activeTab, setActiveTab] = useState('information'); // 'information' or 'invoice'

    const orderData = order?.data?.order || {};

    return (
        <>
            <Header />
            <View style={styles.container}>
                {/* Tab Headers */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'information' && styles.activeTab]}
                        onPress={() => setActiveTab('information')}
                    >
                        <Text style={[styles.tabText, activeTab === 'information' && styles.activeTabText]}>
                            Information
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'invoice' && styles.activeTab]}
                        onPress={() => setActiveTab('invoice')}
                    >
                        <Text style={[styles.tabText, activeTab === 'invoice' && styles.activeTabText]}>
                            Invoice
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <ScrollView style={styles.contentContainer}>
                    {activeTab === 'information' ? (
                        <>
                            <OrderInfo order={order?.data?.order} />
                            <OrderItem order={order?.data?.order}/>
                            <OrderSummary order={order?.data?.order}/>
                        </>
                    ) : (
                        <View style={styles.card}>
                            <Text style={styles.title}>Invoice Details</Text>
                            <Text style={styles.label}>Total Amount: <Text style={styles.value}>${orderData.total || '0.00'}</Text></Text>
                            <Text style={styles.label}>Payment Method: <Text style={styles.value}>{orderData.payment_method || 'N/A'}</Text></Text>
                            <Text style={styles.label}>Billing Address: <Text style={styles.value}>{orderData.billing_address || 'N/A'}</Text></Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    )
}

export default OrderShow

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontWeight: '500',
    },
    value: {
        color: '#333',
        fontWeight: 'normal',
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999'
    },
    val: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#535252'
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 1,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
    },

    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2E7D32',
        textTransform: 'capitalize',
    },
})
