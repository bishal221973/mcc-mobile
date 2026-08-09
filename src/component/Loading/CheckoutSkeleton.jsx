import React from 'react';
import {
    StyleSheet,
    View,
    Animated,
} from 'react-native';

const SkeletonBox = ({ style }) => (
    <View style={[styles.skeleton, style]} />
);

const CheckoutSkeleton = () => {
    return (
        <View style={styles.container}>

            {/* Cart Summary */}
            <SkeletonBox style={styles.title} />

            <View style={styles.productCard}>
                <SkeletonBox style={styles.productImage} />

                <View style={styles.productInfo}>
                    <SkeletonBox style={styles.productName} />
                    <SkeletonBox style={styles.productNameShort} />
                    <SkeletonBox style={styles.productPrice} />
                </View>
            </View>

            <View style={styles.productCard}>
                <SkeletonBox style={styles.productImage} />

                <View style={styles.productInfo}>
                    <SkeletonBox style={styles.productName} />
                    <SkeletonBox style={styles.productNameShort} />
                    <SkeletonBox style={styles.productPrice} />
                </View>
            </View>

            {/* Price Summary */}
            <View style={styles.summary}>
                <SkeletonBox style={styles.sectionTitle} />

                <View style={styles.row}>
                    <SkeletonBox style={styles.label} />
                    <SkeletonBox style={styles.value} />
                </View>

                <View style={styles.row}>
                    <SkeletonBox style={styles.label} />
                    <SkeletonBox style={styles.value} />
                </View>

                <View style={styles.row}>
                    <SkeletonBox style={styles.label} />
                    <SkeletonBox style={styles.value} />
                </View>

                <View style={styles.totalRow}>
                    <SkeletonBox style={styles.totalLabel} />
                    <SkeletonBox style={styles.totalValue} />
                </View>
            </View>

            {/* Billing Address */}
            <View style={styles.summary}>
                <SkeletonBox style={styles.sectionTitle} />

                <View style={styles.addressCard}>
                    <SkeletonBox style={styles.addressName} />
                    <SkeletonBox style={styles.addressLine} />
                    <SkeletonBox style={styles.addressLineLong} />
                    <SkeletonBox style={styles.addressLineShort} />
                </View>

                <SkeletonBox style={styles.addAddressButton} />
            </View>

            {/* Shipping Address */}
            <View style={styles.summary}>
                <SkeletonBox style={styles.sectionTitle} />

                <View style={styles.addressCard}>
                    <SkeletonBox style={styles.addressName} />
                    <SkeletonBox style={styles.addressLine} />
                    <SkeletonBox style={styles.addressLineLong} />
                </View>
            </View>

            {/* Shipping Method */}
            <View style={styles.section}>
                <SkeletonBox style={styles.sectionTitle} />

                <View style={styles.methodRow}>
                    <View style={styles.methodCard}>
                        <SkeletonBox style={styles.methodTitle} />
                        <SkeletonBox style={styles.methodSubtitle} />
                    </View>

                    <View style={styles.methodCard}>
                        <SkeletonBox style={styles.methodTitle} />
                        <SkeletonBox style={styles.methodSubtitle} />
                    </View>
                </View>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
                <SkeletonBox style={styles.sectionTitle} />

                <View style={styles.paymentGrid}>
                    <View style={styles.paymentCard}>
                        <SkeletonBox style={styles.paymentIcon} />
                        <View style={styles.paymentInfo}>
                            <SkeletonBox style={styles.paymentTitle} />
                            <SkeletonBox style={styles.paymentSubtitle} />
                        </View>
                    </View>

                    <View style={styles.paymentCard}>
                        <SkeletonBox style={styles.paymentIcon} />
                        <View style={styles.paymentInfo}>
                            <SkeletonBox style={styles.paymentTitle} />
                            <SkeletonBox style={styles.paymentSubtitle} />
                        </View>
                    </View>

                    <View style={styles.paymentCard}>
                        <SkeletonBox style={styles.paymentIcon} />
                        <View style={styles.paymentInfo}>
                            <SkeletonBox style={styles.paymentTitle} />
                            <SkeletonBox style={styles.paymentSubtitle} />
                        </View>
                    </View>

                    <View style={styles.paymentCard}>
                        <SkeletonBox style={styles.paymentIcon} />
                        <View style={styles.paymentInfo}>
                            <SkeletonBox style={styles.paymentTitle} />
                            <SkeletonBox style={styles.paymentSubtitle} />
                        </View>
                    </View>
                </View>
            </View>

            {/* Place Order */}
            <SkeletonBox style={styles.placeOrder} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },

    skeleton: {
        backgroundColor: '#E2E2E2',
        borderRadius: 6,
    },

    title: {
        width: 150,
        height: 22,
        marginBottom: 15,
        borderRadius: 5,
    },

    productCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
    },

    productImage: {
        width: 85,
        height: 85,
        borderRadius: 8,
    },

    productInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },

    productName: {
        width: '85%',
        height: 15,
        marginBottom: 8,
    },

    productNameShort: {
        width: '55%',
        height: 13,
        marginBottom: 12,
    },

    productPrice: {
        width: 80,
        height: 16,
    },

    summary: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },

    section: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },

    sectionTitle: {
        width: 150,
        height: 20,
        marginBottom: 15,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 13,
    },

    label: {
        width: 100,
        height: 14,
    },

    value: {
        width: 65,
        height: 14,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },

    totalLabel: {
        width: 90,
        height: 18,
    },

    totalValue: {
        width: 90,
        height: 18,
    },

    addressCard: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 14,
    },

    addressName: {
        width: 130,
        height: 16,
        marginBottom: 10,
    },

    addressLine: {
        width: '65%',
        height: 13,
        marginBottom: 8,
    },

    addressLineLong: {
        width: '90%',
        height: 13,
        marginBottom: 8,
    },

    addressLineShort: {
        width: '45%',
        height: 13,
    },

    addAddressButton: {
        width: 120,
        height: 38,
        marginTop: 12,
        borderRadius: 18,
    },

    methodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    methodCard: {
        width: '48%',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 14,
    },

    methodTitle: {
        width: '75%',
        height: 15,
        marginBottom: 10,
    },

    methodSubtitle: {
        width: '55%',
        height: 12,
    },

    paymentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    paymentCard: {
        width: '48%',
        minHeight: 75,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },

    paymentIcon: {
        width: 42,
        height: 42,
        borderRadius: 8,
    },

    paymentInfo: {
        flex: 1,
        marginLeft: 10,
    },

    paymentTitle: {
        width: '75%',
        height: 13,
        marginBottom: 7,
    },

    paymentSubtitle: {
        width: '90%',
        height: 10,
    },

    placeOrder: {
        height: 52,
        width: '100%',
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 30,
    },
});

export default CheckoutSkeleton;