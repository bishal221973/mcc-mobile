import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProductInfoSkeleton = () => {
    return (
        <View style={styles.container}>

            {/* Product name */}
            <View style={styles.image} />
            <View style={styles.title} />
            <View style={styles.titleShort} />

            {/* Price */}
            <View style={styles.price} />

            {/* Description title */}
            <View style={styles.sectionTitle} />

            {/* Description */}
            <View style={styles.description} />
            <View style={styles.description} />
            <View style={[styles.description, styles.descriptionShort]} />

            {/* Quantity title */}
            <View style={styles.sectionTitle} />

            {/* Quantity selector */}
            <View style={styles.quantityContainer}>
                <View style={styles.qtyButton} />
                <View style={styles.qtyNumber} />
                <View style={styles.qtyButton} />
            </View>

            <View style={styles.tabs}>
                <View style={styles.tab} />
                <View style={styles.tab} />
                <View style={styles.tab} />
            </View>

        </View>
    );
};

export default ProductInfoSkeleton;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 400,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginBottom: 20,
    },

    title: {
        width: '90%',
        height: 22,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
    },

    titleShort: {
        width: '55%',
        height: 22,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginTop: 8,
    },

    price: {
        width: 110,
        height: 20,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginTop: 12,
    },

    sectionTitle: {
        width: 100,
        height: 17,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
        marginTop: 20,
    },

    description: {
        width: '100%',
        height: 12,
        borderRadius: 5,
        backgroundColor: '#E5E7EB',
        marginTop: 10,
    },

    descriptionShort: {
        width: '65%',
    },

    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#E5E7EB',
        width: 130,
        height: 45,
        padding: 5,
        borderRadius: 10,
        justifyContent: 'space-between',
    },

    qtyButton: {
        width: 35,
        height: 35,
        borderRadius: 8,
        backgroundColor: '#D1D5DB',
    },

    qtyNumber: {
        width: 20,
        height: 18,
        borderRadius: 5,
        backgroundColor: '#D1D5DB',
    },
    tabs: {
        width: '100%',
        height: 50,
        backgroundColor: '#E5E7EB',
        marginTop: 20,
        flexDirection: 'row',
        gap: 30,
        padding: 5,
        borderRadius: 10,
    },
    tab: {
        flex: 1,
        height: '100%',
        backgroundColor: '#D1D5DB',
        flexDirection: 'row',
        gap: 30,
        borderRadius: 10,
    }
});