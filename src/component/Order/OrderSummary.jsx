
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const OrderItem = ({ order }) => {
    const item = order || {};
    const product = item?.items || {};

    // Item values
    const subtotal = Number(product?.total || 0);
    const tax = Number(product?.tax_amount || 0);
    const totalInvoiced = Number(product?.total_invoiced || 0);
    const totalRefunded = Number(product?.amount_refunded || 0);

    // Order total
    const grandTotal = Number(item?.grand_total || 0);

    // Shipping is not available in your current API response
    const shipping = Number(item?.shipping_amount || 0);

    // Calculate paid amount
    const totalPaid = totalInvoiced;

    // Calculate due
    const totalDue = Math.max(grandTotal - totalPaid, 0);

    const formatAmount = (amount) => {
        return `$${Number(amount).toFixed(2)}`;
    };

    return (
        <View style={styles.card}>

            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>
                    Order Summary
                </Text>
            </View>

            <View style={styles.listContainer}>

                {/* Subtotal */}
                <View style={styles.priceQtyRow}>
                    <Text style={styles.lbl}>
                        Subtotal
                    </Text>

                    <Text style={styles.valLbl}>
                        {formatAmount(subtotal)}
                    </Text>
                </View>

                {/* Shipping */}
                <View style={styles.priceQtyRow}>
                    <Text style={styles.lbl}>
                        Shipping & Handling
                    </Text>

                    <Text style={styles.valLbl}>
                        {formatAmount(shipping)}
                    </Text>
                </View>

                {/* Tax */}
                <View style={styles.priceQtyRow}>
                    <Text style={styles.lbl}>
                        Tax
                    </Text>

                    <Text style={styles.valLbl}>
                        {formatAmount(tax)}
                    </Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Grand Total */}
                <View style={styles.priceQtyRow}>
                    <Text style={styles.grandTotalLabel}>
                        Grand Total
                    </Text>

                    <Text style={styles.grandTotalValue}>
                        {item?.formatted_grand_total ||
                            formatAmount(grandTotal)}
                    </Text>
                </View>

                {/* Total Paid */}
                <View style={styles.priceQtyRow}>
                    <Text style={styles.lbl}>
                        Total Paid
                    </Text>

                    <Text style={styles.paidValue}>
                        {formatAmount(totalPaid)}
                    </Text>
                </View>

                {/* Total Refunded */}
                <View style={styles.priceQtyRow}>
                    <Text style={styles.lbl}>
                        Total Refunded
                    </Text>

                    <Text style={styles.valLbl}>
                        {formatAmount(totalRefunded)}
                    </Text>
                </View>

                {/* Total Due */}
                <View style={styles.dueRow}>
                    <Text style={styles.dueLabel}>
                        Total Due
                    </Text>

                    <Text style={styles.dueValue}>
                        {formatAmount(totalDue)}
                    </Text>
                </View>

            </View>
        </View>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#0A0A0A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },

    headerContainer: {
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F4F7',
    },

    headerTitle: {
        fontWeight: '700',
        color: '#1A1A1A',
        fontSize: 15,
    },

    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    priceQtyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
    },

    lbl: {
        fontSize: 12,
        color: '#7C7C7C',
        fontWeight: '600',
    },

    valLbl: {
        fontSize: 12,
        fontWeight: '700',
        color: '#494949',
    },

    divider: {
        height: 1,
        backgroundColor: '#F2F4F7',
        marginVertical: 8,
    },

    grandTotalLabel: {
        fontSize: 13,
        color: '#222222',
        fontWeight: '700',
    },

    grandTotalValue: {
        fontSize: 14,
        color: '#0C3F80',
        fontWeight: '800',
    },

    paidValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#16A34A',
    },

    dueRow: {
        marginTop: 8,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dueLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#222222',
    },

    dueValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#DC2626',
    },
});