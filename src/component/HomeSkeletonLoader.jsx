import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const Skeleton = ({ style }) => {
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
                styles.skeleton,
                style,
                { opacity },
            ]}
        />
    );
};

const HomeSkeletonLoader = () => {
    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Skeleton style={styles.logo} />

                <View style={styles.headerRight}>
                    <Skeleton style={styles.headerIcon} />
                    <Skeleton style={styles.headerIcon} />
                </View>
            </View>

            {/* Search */}
            <Skeleton style={styles.search} />

            {/* Banner */}
            <Skeleton style={styles.banner} />

            {/* Categories title */}
            <Skeleton style={styles.sectionTitle} />

            {/* Categories */}
            <View style={styles.categoryRow}>
                {[1, 2, 3, 4].map(item => (
                    <View key={item} style={styles.categoryItem}>
                        <Skeleton style={styles.categoryCircle} />
                        <Skeleton style={styles.categoryText} />
                    </View>
                ))}
            </View>

            {/* Product section */}
            <View style={styles.productHeader}>
                <Skeleton style={styles.productTitle} />
                <Skeleton style={styles.viewAll} />
            </View>

            {/* Products */}
            <View style={styles.productsRow}>
                {[1, 2].map(item => (
                    <View key={item} style={styles.productCard}>

                        <Skeleton style={styles.productImage} />

                        <Skeleton style={styles.productName} />

                        <Skeleton style={styles.productNameSmall} />

                        <Skeleton style={styles.productPrice} />

                    </View>
                ))}
            </View>

        </View>
    );
};

export default HomeSkeletonLoader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        padding: 15,
    },

    skeleton: {
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
    },

    header: {
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    logo: {
        width: 120,
        height: 25,
        borderRadius: 6,
    },

    headerRight: {
        flexDirection: 'row',
        gap: 10,
    },

    headerIcon: {
        width: 35,
        height: 35,
        borderRadius: 18,
    },

    search: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        marginTop: 15,
    },

    banner: {
        width: '100%',
        height: 170,
        borderRadius: 15,
        marginTop: 20,
    },

    sectionTitle: {
        width: 130,
        height: 22,
        marginTop: 25,
        marginBottom: 15,
    },

    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    categoryItem: {
        alignItems: 'center',
        width: (width - 50) / 4,
    },

    categoryCircle: {
        width: 65,
        height: 65,
        borderRadius: 33,
    },

    categoryText: {
        width: 55,
        height: 12,
        marginTop: 8,
        borderRadius: 5,
    },

    productHeader: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    productTitle: {
        width: 160,
        height: 22,
    },

    viewAll: {
        width: 60,
        height: 16,
    },

    productsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 15,
    },

    productCard: {
        width: (width - 42) / 2,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 10,
    },

    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },

    productName: {
        width: '90%',
        height: 15,
        marginTop: 12,
    },

    productNameSmall: {
        width: '60%',
        height: 15,
        marginTop: 7,
    },

    productPrice: {
        width: 70,
        height: 18,
        marginTop: 12,
    },
});