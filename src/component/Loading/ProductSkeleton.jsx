import React from 'react';
import {
    View,
    StyleSheet,
    Animated,
} from 'react-native';

const ProductSkeleton = () => {
    return (
        <View style={styles.card}>
            {/* Image skeleton */}
            <View style={styles.imageSkeleton} />

            <View style={styles.content}>
                {/* Product name */}
                <View style={styles.nameSkeleton} />
                <View style={[styles.nameSkeleton, styles.nameShort]} />

                {/* Price */}
                <View style={styles.priceSkeleton} />

                {/* Add button */}
                <View style={styles.buttonSkeleton} />
            </View>
        </View>
    );
};

export default ProductSkeleton;

const styles = StyleSheet.create({
    card: {
        width: '48%',
        backgroundColor: '#fff',
        marginBottom: 12,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    imageSkeleton: {
        width: '100%',
        height: 120,
        backgroundColor: '#E5E7EB',
    },

    content: {
        padding: 10,
    },

    nameSkeleton: {
        height: 12,
        width: '90%',
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginTop: 5,
    },

    nameShort: {
        width: '60%',
        marginTop: 7,
    },

    priceSkeleton: {
        width: '40%',
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginTop: 12,
    },

    buttonSkeleton: {
        width: '100%',
        height: 36,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        marginTop: 12,
    },
});