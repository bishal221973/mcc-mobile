import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

const Address = ({ setBillingAddress, item, selected }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setBillingAddress(item)}
            style={[
                styles.card,
                selected && styles.selectedCard,
            ]}>
            <View style={styles.header}>
                <View style={styles.left}>
                    <Ionicons
                        name={
                            selected
                                ? 'radio-button-on'
                                : 'radio-button-off'
                        }
                        size={22}
                        color="#0C3F80"
                    />

                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.name}>
                            {item.first_name} {item.last_name}
                        </Text>

                        {!!item.company_name && (
                            <Text style={styles.company}>
                                {item.company_name}
                            </Text>
                        )}
                    </View>
                </View>


            </View>

            <View style={styles.addressRow}>
                <Ionicons
                    name="location-outline"
                    size={18}
                    color="#666"
                />

                <Text style={styles.address}>
                    {Array.isArray(item.address)
                        ? item.address.join(', ')
                        : item.address}
                    {', '}
                    {item.city}, {item.state}
                    {', '}
                    {item.country} - {item.postcode}
                </Text>
            </View>


        </TouchableOpacity>
    )
}

export default Address

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 15,
    },
    selectedCard: {
        borderColor: '#0C3F80',
        borderWidth: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },

    company: {
        color: '#777',
        marginTop: 3,
    },
    addressRow: {
        flexDirection: 'row',
        marginTop: 15,
    },

    address: {
        marginLeft: 10,
        flex: 1,
        color: '#555',
        lineHeight: 22,
    },

})