import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const SkeletonBox = ({ style }) => {
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

const CategorySkeleton = () => {
    const items = Array.from({ length: 8 });

    return (
        <View style={styles.container}>
            {items.map((_, index) => (
                <View key={index} style={styles.card}>
                    <SkeletonBox style={styles.image} />

                    <SkeletonBox style={styles.name} />

                    <SkeletonBox style={styles.nameSmall} />
                </View>
            ))}
        </View>
    );
};

export default CategorySkeleton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },

    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,

        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    skeleton: {
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
    },

    image: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },

    name: {
        width: '80%',
        height: 15,
        marginTop: 12,
        borderRadius: 5,
    },

    nameSmall: {
        width: '55%',
        height: 15,
        marginTop: 7,
        borderRadius: 5,
    },
});