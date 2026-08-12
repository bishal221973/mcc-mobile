import React from 'react';
import { View, StyleSheet } from 'react-native';

const WishlistSkeletonCard = () => {
    return (
        <View style={styles.card}>
            {/* Heart */}
            <View style={styles.skeletonHeart} />

            {/* Product Image */}
            <View style={styles.skeletonImage} />

            {/* Product Name */}
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonLineShort} />

            {/* Price */}
            <View style={styles.skeletonPrice} />

            {/* Cart Button */}
            <View style={styles.skeletonButton} />
        </View>
    );
};

const WishlistSkeleton = () => {
    return (
        <View style={styles.container}>
            {Array.from({ length: 6 }).map((_, index) => (
                <WishlistSkeletonCard key={index} />
            ))}
        </View>
    );
};

export default WishlistSkeleton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },

    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        elevation: 2,
    },

    skeletonHeart: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
        zIndex: 10,
    },

    skeletonImage: {
        width: '100%',
        height: 130,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        marginBottom: 10,
    },

    skeletonLine: {
        width: '90%',
        height: 14,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginBottom: 7,
    },

    skeletonLineShort: {
        width: '65%',
        height: 14,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
    },

    skeletonPrice: {
        width: '45%',
        height: 17,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginTop: 10,
    },

    skeletonButton: {
        width: '100%',
        height: 38,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        marginTop: 12,
    },
});