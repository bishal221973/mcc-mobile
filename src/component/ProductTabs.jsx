import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ProductTabs = () => {
    const [activeTab, setActiveTab] = useState('description');

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'reviews', label: 'Reviews (14)' },
        { id: 'specs', label: 'Specifications' },
    ];

    // 1. Render Description Tab Content
    const renderDescription = () => (
        <View style={styles.contentBody}>
            <Text style={styles.paragraphText}>
                Our premium Tile Adhesive is engineered for high-performance bonding of ceramic, porcelain, and natural stone tiles. It offers exceptional workability, high sag resistance, and extended open time for both interior and exterior applications.
            </Text>
            <Text style={styles.paragraphText}>
                Perfect for heavy-duty floor installations, wet areas like bathrooms and kitchens, and demanding commercial spaces.
            </Text>
        </View>
    );

    // 2. Render Specifications Tab Content
    const renderSpecifications = () => {
        const specsData = [
            { key: 'Material Base', value: 'High-grade Polymer Cement' },
            { key: 'Open Time', value: '20 - 25 minutes' },
            { key: 'Curing Time', value: '24 hours' },
            { key: 'Coverage', value: '55 - 60 sq. ft. per 20kg bag' },
            { key: 'Water Resistance', value: 'Excellent' },
            { key: 'Shelf Life', value: '12 Months' },
        ];

        return (
            <View style={styles.contentBody}>
                {specsData.map((item, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.specRow, 
                            index % 2 === 0 && styles.specRowEven
                        ]}
                    >
                        <Text style={styles.specKey}>{item.key}</Text>
                        <Text style={styles.specValue}>{item.value}</Text>
                    </View>
                ))}
            </View>
        );
    };

    // 3. Render Reviews Tab Content
    const renderReviews = () => {
        const dummyReviews = [
            { id: 1, name: 'Ramesh K.', rating: 5, date: '2 days ago', comment: 'Excellent bonding strength. Used it for large format porcelain tiles and it holds perfectly.' },
            { id: 2, name: 'Sita T.', rating: 4, date: '1 week ago', comment: 'Very good workability and setting time. Highly recommend for bathroom walls.' },
        ];

        return (
            <View style={styles.contentBody}>
                {/* Rating Overview Summary */}
                <View style={styles.ratingSummaryCard}>
                    <View>
                        <Text style={styles.ratingBigNumber}>4.8</Text>
                        <Text style={styles.ratingSubLabel}>out of 5 stars</Text>
                    </View>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Ionicons key={s} name="star" size={18} color="#FFB020" />
                        ))}
                    </View>
                </View>

                {/* Review List */}
                {dummyReviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{review.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.reviewerInfo}>
                                <Text style={styles.reviewerName}>{review.name}</Text>
                                <View style={styles.reviewStars}>
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <Ionicons key={i} name="star" size={12} color="#FFB020" />
                                    ))}
                                </View>
                            </View>
                            <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                        <Text style={styles.reviewComment}>{review.comment}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Tab Header Selector */}
            <View style={styles.tabBar}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tabButton, isActive && styles.activeTabButton]}
                            onPress={() => setActiveTab(tab.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Dynamic Content Switching */}
            <View style={styles.contentContainer}>
                {activeTab === 'description' && renderDescription()}
                {activeTab === 'specs' && renderSpecifications()}
                {activeTab === 'reviews' && renderReviews()}
            </View>
        </View>
    );
};

export default ProductTabs;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
    },
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabButton: {
        borderBottomColor: '#007AFF',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#868E96',
    },
    activeTabLabel: {
        fontWeight: '600',
        color: '#007AFF',
    },
    contentContainer: {
        paddingVertical: 16,
    },
    contentBody: {
        paddingHorizontal: 20,
    },
    paragraphText: {
        fontSize: 15,
        color: '#495057',
        lineHeight: 22,
        marginBottom: 12,
        textAlign: 'justify',
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    specRowEven: {
        backgroundColor: '#F8F9FA',
    },
    specKey: {
        fontSize: 14,
        fontWeight: '500',
        color: '#495057',
    },
    specValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'right',
        maxWidth: '60%',
    },
    ratingSummaryCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    ratingBigNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    ratingSubLabel: {
        fontSize: 12,
        color: '#868E96',
        marginTop: -2,
    },
    starsRow: {
        flexDirection: 'row',
    },
    reviewCard: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
        paddingBottom: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E9ECEF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#495057',
    },
    reviewerInfo: {
        marginLeft: 12,
        flex: 1,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    reviewStars: {
        flexDirection: 'row',
        marginTop: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: '#ADB5BD',
    },
    reviewComment: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
});
