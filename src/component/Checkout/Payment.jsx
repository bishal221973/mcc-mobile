import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';


const Payment = ({ selectPaymentMethod, item, selectedPayment }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => selectPaymentMethod(item)}
            style={[
                styles.cardPayment,
                selectedPayment === item.codePayment && styles.selectedCardPayment,
            ]}>
            <Ionicons
                name={
                    selectedPayment === item.code
                        ? 'radio-button-on'
                        : 'radio-button-off'
                }
                size={22}
                color="#0C3F80"
                style={styles.radioPayment}
            />

            <Image
                source={item.image}
                style={styles.iconPayment}
                resizeMode="contain"
            />

            <Text style={styles.titlePayment}>{item.title}</Text>
        </TouchableOpacity>
    )
}

export default Payment

const styles = StyleSheet.create({


   

    rowPayment: {
        justifyContent: 'space-between',
    },

    cardPayment: {
        width: '48%',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: 150,
    },

    selectedCardPayment: {
        borderWidth: 2,
        borderColor: '#0C3F80',
        backgroundColor: '#F5F9FF',
    },

    radioPayment: {
        position: 'absolute',
        top: 10,
        right: 10,
    },

    iconPayment: {
        width: 150,
        height: 65,
        marginBottom: 12,
    },

    titlePayment: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
    },

    subtitlePayment: {
        marginTop: 6,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
})