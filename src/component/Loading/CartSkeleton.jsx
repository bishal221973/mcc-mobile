import React from 'react';
import { View, StyleSheet } from 'react-native';

const CartSkeleton = () => {
    return (
        <View style={styles.container}>

            {/* Cart items */}
            {[1, 2, 3].map(item => (
                <View key={item} style={styles.card}>

                    {/* Product image */}
                    <View style={styles.image} />

                    <View style={styles.info}>

                        {/* Product name */}
                        <View style={styles.name} />
                        <View style={styles.nameShort} />

                        {/* Price */}
                        <View style={styles.price} />

                        {/* Quantity */}
                        <View style={styles.qtyContainer}>
                            <View style={styles.qtyButton} />
                            <View style={styles.qtyNumber} />
                            <View style={styles.qtyButton} />
                        </View>

                    </View>
                </View>
            ))}

            {/* Summary */}
            <View style={styles.summary}>

                <View style={styles.summaryTitle} />

                <View style={styles.row}>
                    <View style={styles.label} />
                    <View style={styles.amount} />
                </View>

                <View style={styles.row}>
                    <View style={styles.label} />
                    <View style={styles.amount} />
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                    <View>
                        <View style={styles.total} />
                        <View style={styles.totalSubtext} />
                    </View>

                    <View style={styles.checkoutButton} />
                </View>

            </View>

        </View>
    );
};

export default CartSkeleton;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
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
        backgroundColor: '#E5E7EB',
    },

    info: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        width: '85%',
        height: 15,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
    },

    nameShort: {
        width: '55%',
        height: 15,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
        marginTop: 7,
    },

    price: {
        width: 80,
        height: 15,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
        marginTop: 10,
    },

    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        width: 105,
        height: 32,
        marginTop: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 3,
    },

    qtyButton: {
        width: 28,
        height: 26,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
    },

    qtyNumber: {
        width: 20,
        height: 14,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },

    summary: {
        backgroundColor: '#fff',
        marginTop: 20,
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    summaryTitle: {
        width: 130,
        height: 20,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginBottom: 15,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },

    label: {
        width: 70,
        height: 14,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
    },

    amount: {
        width: 80,
        height: 14,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
    },

    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginTop: 5,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },

    total: {
        width: 100,
        height: 20,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
    },

    totalSubtext: {
        width: 130,
        height: 11,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
        marginTop: 7,
    },

    checkoutButton: {
        width: 95,
        height: 45,
        borderRadius: 30,
        backgroundColor: '#E5E7EB',
    },
});