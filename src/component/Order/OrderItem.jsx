import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const OrderItem = ({ order }) => {
    const items = order?.items || [];

    return (
        <View style={styles.card}>
            {/* Header Container */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Items Ordered</Text>
                <Text style={styles.itemCount}>
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </Text>
            </View>

            {/* Product List */}
            <View style={styles.listContainer}>
                {items.length > 0 ? (
                    items.map((item, index) => {
                        // Safe fallback variations for your backend schema
                        const itemTitle = item?.product_name || item?.name || 'Unknown Item';
                        const itemPrice = item?.price || 0;
                        const itemQty = item?.quantity || item?.qty || 1;
                        const itemImage = item?.image || item?.product_image;
                        const itemMeta = item?.variant || item?.attributes || '';

                        return (
                            <View key={item?.id || index}>
                                <View style={styles.itemRow}>
                                    {/* Item Specs Container */}
                                    <View style={styles.detailsContainer}>
                                        <Text style={styles.productName} numberOfLines={2}>
                                            {itemTitle}
                                        </Text>

                                        <View style={styles.priceQtyRow}>
                                            <Text style={styles.lbl}>SKU</Text>
                                            <Text style={styles.valLbl}>
                                                {item?.sku}
                                            </Text>
                                        </View>
                                        <View style={styles.priceQtyRow}>
                                            <Text style={styles.lbl}>Item Status</Text>
                                            <Text style={styles.valLbl}>
                                                Ordered ({item?.qty_ordered})
                                            </Text>
                                        </View>
                                        <View style={styles.priceQtyRow}>
                                            <Text style={styles.lbl}>Price</Text>
                                            <Text style={styles.valLbl}>
                                                Rs. {item?.price}
                                            </Text>
                                        </View>
                                        <View style={styles.priceQtyRow}>
                                            <Text style={styles.lbl}>Sub Total</Text>
                                            <Text style={styles.valLbl}>
                                                {item?.formatted_total}
                                            </Text>
                                        </View>
                                        <View style={styles.priceQtyRow}>
                                            <Text style={styles.lbl}>Tax Percent</Text>
                                            <Text style={styles.valLbl}>
                                                {item?.tax_percent}
                                            </Text>
                                        </View>
                                        <View style={styles.priceQtyRow}>
                                            <Text style={styles.lbl}>Tax Amount</Text>
                                            <Text style={styles.valLbl}>
                                                {item?.base_tax_amount}
                                            </Text>
                                        </View>
                                        <View style={styles.priceQtyRow}>
                                            <Text style={styles.lbl}>Grand Total</Text>
                                            <Text style={styles.valLbl}>
                                                {item?.formatted_base_total}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Micro divider between sub-items but excludes the last one */}
                                {index < items.length - 1 && <View style={styles.itemDivider} />}
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.emptyText}>No items found in this order.</Text>
                )}
            </View>
        </View>
    )
}

export default OrderItem

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#0A0A0A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    headerContainer: {
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F4F7',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontWeight: '700',
        color: '#1A1A1A',
        fontSize: 15,
        letterSpacing: -0.2,
    },
    itemCount: {
        fontSize: 13,
        color: '#667085',
        fontWeight: '500',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    itemRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
    },
    imageContainer: {
        marginRight: 14,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#F2F4F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 22,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#3b3b3b',
        marginBottom: 4,
        lineHeight: 18,
    },
    productMeta: {
        fontSize: 12,
        color: '#667085',
        marginBottom: 6,
    },
    priceQtyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    lbl: {
        fontSize: 11,
        color: '#7c7c7c',
        fontWeight: 'bold',
    },
    valLbl: {
        fontSize: 11,
        fontWeight: '700',
        color: '#494949',
    },
    itemDivider: {
        height: 1,
        backgroundColor: '#F2F4F7',
    },
    emptyText: {
        textAlign: 'center',
        color: '#667085',
        paddingVertical: 20,
        fontSize: 14,
    },
})
