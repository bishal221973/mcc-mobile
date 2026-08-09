import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const OrderInfo = ({ order }) => {
    // Format the date safely
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch (e) {
            return 'N/A';
        }
    };

    // Modern status theme generator
    const getStatusTheme = (status) => {
        const normalize = status?.toLowerCase() || '';
        if (normalize.includes('deliver') || normalize.includes('success') || normalize.includes('complet')) {
            return { bg: '#E6F4EA', text: '#137333' }; // Green
        }
        if (normalize.includes('pend') || normalize.includes('process') || normalize.includes('hold')) {
            return { bg: '#FEF7E0', text: '#B06000' }; // Amber
        }
        if (normalize.includes('cancel') || normalize.includes('fail') || normalize.includes('reject')) {
            return { bg: '#FCE8E6', text: '#C5221F' }; // Red
        }
        return { bg: '#F1F3F4', text: '#3C4043' }; // Neutral Gray
    };

    const statusTheme = getStatusTheme(order?.status);

    return (
        <View style={styles.card}>
            {/* <Text>{JSON.stringify(order)}</Text> */}
            <View style={{paddingHorizontal:10}}>
                <View style={styles.row}>
                    <Text style={styles.label}>Order ID</Text>
                    <Text style={styles.valueId}>#{order?.id || 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Placed On</Text>
                    <Text style={styles.valueText}>{formatDate(order?.created_at)}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusTheme.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusTheme.text }]} />
                        <Text style={[styles.statusText, { color: statusTheme.text }]}>
                            {order?.status || 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={[styles.row,{paddingHorizontal:10,marginBottom:5}]}>
                <TouchableOpacity style={{ backgroundColor: '#e6e6e6', width: '100%', padding: 10,borderRadius:10 }}>
                    <Text style={{ textAlign: 'center',fontWeight:'bold' }}>Reorder</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OrderInfo

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingTop: 10,
        // paddingHorizontal:10,
        marginVertical: 8,
        marginHorizontal: 16,
        // Modern soft shadow for iOS
        shadowColor: '#0A0A0A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 20,
        letterSpacing: -0.3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 3
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F4F7',
        marginVertical: 12,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#667085', // Slate gray
    },
    valueText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1D2939', // Dark charcoal
    },
    valueId: {
        fontSize: 12,
        fontWeight: '700',
        color: '#007AFF', // Clean accent color for ID
        fontFamily: 'Platform-Specific-Mono', // Fallback to system default if font isn't loaded
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
})
