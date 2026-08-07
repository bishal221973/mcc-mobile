import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

const ShippingMethod = ({ selectShippingMethod, item, active }) => {
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
    )
}

export default ShippingMethod

const styles = StyleSheet.create({
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
})