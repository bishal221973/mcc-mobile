import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
} from 'react-native';

const AddressSkeleton = () => {
    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, []);

    return (
        <Animated.View
            style={[
                styles.card,
                { opacity },
            ]}
        >
            {/* Name / Type */}
            <View style={styles.topRow}>
                <View style={styles.nameSkeleton} />

                <View style={styles.defaultSkeleton} />
            </View>

            {/* Address lines */}
            <View style={styles.addressLine} />
            <View style={styles.addressLineShort} />
            <View style={styles.addressLineMedium} />

            {/* Buttons */}
            <View style={styles.actionRow}>
                <View style={styles.buttonSkeleton} />
                <View style={styles.buttonSkeleton} />
            </View>
        </Animated.View>
    );
};

const AddressSkeletonList = () => {
    return (
        <View style={styles.container}>
            <AddressSkeleton />
            <AddressSkeleton />
            <AddressSkeleton />
            <AddressSkeleton />
        </View>
    );
};

export default AddressSkeletonList;

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    nameSkeleton: {
        width: 150,
        height: 25,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },

    defaultSkeleton: {
        width: 65,
        height: 25,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        marginLeft: 8,
    },

    addressLine: {
        width: '100%',
        height: 14,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginTop: 15,
    },

    addressLineShort: {
        width: '70%',
        height: 14,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginTop: 8,
    },

    addressLineMedium: {
        width: '85%',
        height: 14,
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        marginTop: 8,
    },

    actionRow: {
        flexDirection: 'row',
        marginTop: 18,
        gap: 12,
    },

    buttonSkeleton: {
        flex: 1,
        height: 42,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
    },
});