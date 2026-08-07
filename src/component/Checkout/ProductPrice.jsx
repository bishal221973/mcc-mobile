import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProductPrice = ({ cartData, shippingPrice }) => {
    return (
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
    )
}

export default ProductPrice

const styles = StyleSheet.create({
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
    totalText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
})