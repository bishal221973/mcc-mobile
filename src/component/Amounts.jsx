import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Amounts = ({
    totalAmount = 0,
    paidAmount = 0,
}) => {
    const dueAmount = totalAmount - paidAmount;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment Summary</Text>

            <View style={styles.row}>
                <View style={styles.item}>
                    <Text style={styles.label}>Total Amount</Text>
                    <Text style={styles.total}>
                        Rs. {totalAmount.toLocaleString()}
                    </Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>Paid Amount</Text>
                    <Text style={styles.paid}>
                        Rs. {paidAmount.toLocaleString()}
                    </Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.label}>Due Amount</Text>
                    <Text style={styles.due}>
                        Rs. {dueAmount.toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Amounts;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        margin: 10,
        elevation: 2,
    },

    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#222',
        marginBottom: 15,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    item: {
        flex: 1,
    },

    label: {
        fontSize: 12,
        color: '#777',
        marginBottom: 5,
    },

    total: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0C3F80',
    },

    paid: {
        fontSize: 14,
        fontWeight: '700',
        color: '#28A745',
    },

    due: {
        fontSize: 14,
        fontWeight: '700',
        color: '#E53935',
    },
});