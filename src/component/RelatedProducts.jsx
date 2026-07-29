import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    Dimensions 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42; // Dynamic width to reveal the next item preview slightly

const RelatedProducts = ({ onProductPress }) => {
    // Dynamic mock inventory items
    const relatedItems = [
        {
            id: '1',
            name: 'Epoxy Grout 1kg',
            price: 'Rs. 1,500',
            rating: '4.9',
            image: 'https://placeholder.com', // Replace with dynamic local or network source
        },
        {
            id: '2',
            name: 'Tile Spacer 2mm',
            price: 'Rs. 150',
            rating: '4.7',
            image: 'https://placeholder.com',
        },
        {
            id: '3',
            name: 'Notched Trowel',
            price: 'Rs. 650',
            rating: '4.6',
            image: 'https://placeholder.com',
        },
        {
            id: '4',
            name: 'Waterproof Membrane',
            price: 'Rs. 2,200',
            rating: '4.8',
            image: 'https://placeholder.com',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Related Products</Text>
                <TouchableOpacity activeOpacity={0.6}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollList}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 14} // Seamless carousel snapping alignment
            >
                {relatedItems.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => onProductPress && onProductPress(item)}
                    >
                        {/* Product Image Wrapper */}
                        <View style={styles.imageWrapper}>
                            <Image 
                                source={{ uri: item.image }} 
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={10} color="#FFB020" />
                                <Text style={styles.ratingText}>{item.rating}</Text>
                            </View>
                        </View>

                        {/* Product Metadata Info */}
                        <View style={styles.infoWrapper}>
                            <Text style={styles.productName} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={styles.productPrice}>
                                {item.price}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default RelatedProducts;

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    scrollList: {
        paddingHorizontal: 20,
        paddingBottom: 8, // Handles micro-shadow clipping layouts
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        marginRight: 14,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        overflow: 'hidden',
        // Platform Subtle Depth Shadow configuration
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    imageWrapper: {
        width: '100%',
        height: CARD_WIDTH * 0.9,
        backgroundColor: '#F8F9FA',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1A1A1A',
        marginLeft: 3,
    },
    infoWrapper: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#007AFF',
    },
});
