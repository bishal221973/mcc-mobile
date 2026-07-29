import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
import ProductImageShow from '../../component/ProductImageShow';
import ProductTabs from '../../component/ProductTabs';
import RelatedProducts from '../../component/RelatedProducts';
const Account = ({ navigation }) => {
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleAddToCart = () => {
        Alert.alert('Success', `${quantity} item(s) added to cart.`);
    };

    const handleBuyNow = () => {
        Alert.alert('Checkout', `Proceeding straight to checkout with ${quantity} item(s).`);
    };

    return (
        <View style={styles.mainWrapper}>
            <Header />
            
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Image Section */}
                    <View style={styles.imageContainer}>
                        <ProductImageShow />
                        <TouchableOpacity 
                            style={styles.favoriteBtn}
                            onPress={() => setIsFavorite(!isFavorite)}
                        >
                            <Ionicons 
                                name={isFavorite ? "heart" : "heart-outline"} 
                                size={22} 
                                color={isFavorite ? "#E63946" : "#1A1A1A"} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Product Details Card */}
                    <View style={styles.detailsContainer}>
                        <View style={styles.titleRow}>
                            <Text style={styles.productTitle}>Tile Adhesive</Text>
                            <Text style={styles.productPrice}>Rs. 1,000</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.productDescription}>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum obcaecati recusandae cum ad atque accusantium eum possimus et ex quia?
                        </Text>

                        {/* Quantity Selector Section */}
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity 
                                style={styles.qtyBtn}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Ionicons name="remove" size={20} color="#1A1A1A" />
                            </TouchableOpacity>
                            
                            <Text style={styles.qtyText}>{quantity}</Text>
                            
                            <TouchableOpacity 
                                style={styles.qtyBtn}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Ionicons name="add" size={20} color="#1A1A1A" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <ProductTabs/>
                        <RelatedProducts/>
                    </View>
                </ScrollView>

                {/* Sticky Action Footer */}
                <View style={styles.footer}>
                    <View style={styles.totalPriceContainer}>
                        <Text style={styles.totalLabel}>Total Price</Text>
                        <Text style={styles.totalPriceText}>Rs. {1000 * quantity}</Text>
                    </View>
                    
                    <View style={styles.buttonActionGroup}>
                        <TouchableOpacity 
                            style={styles.cartButton} 
                            onPress={handleAddToCart}
                        >
                            <Ionicons name="bag-handle-outline" size={18} color="#007AFF" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.buyNowButton} 
                            onPress={handleBuyNow}
                        >
                            <Text style={styles.buyNowButtonText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default Account;

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: '#FFF',
    },
    favoriteBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 5,
        height: 44,
        width: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    detailsContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    productTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        marginRight: 10,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '700',
        color: '#007AFF',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
        marginTop: 12,
    },
    productDescription: {
        fontSize: 15,
        color: '#666666',
        lineHeight: 22,
        textAlign: 'justify',
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F3F5',
        borderRadius: 12,
        width: 130,
        height: 44,
        paddingHorizontal: 4,
        justifyContent: 'space-between',
        marginTop: 4,
    },
    qtyBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    qtyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    totalPriceContainer: {
        flexDirection: 'column',
    },
    totalLabel: {
        fontSize: 13,
        color: '#868E96',
        marginBottom: 2,
    },
    totalPriceText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    buttonActionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartButton: {
        height: 48,
        width: 48,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#007AFF',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    buyNowButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        height: 48,
        paddingHorizontal: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buyNowButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
