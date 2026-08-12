import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
import axios from '../../services/axios';
import WishlistSkeleton from '../../component/Loading/WishlistSkeleton';
import CartEvents from '../../services/CartEvents';

const Wishlist = ({ navigation }) => {
    const [wishlist, setWishlist] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [moving, setMoving] = useState(null);

    /**
     * Fetch wishlist
     *
     * showLoader = true
     * Only used for initial loading.
     */
    const fetchData = async (showLoader = false) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            const response = await axios.get('/customer/wishlist');

            setWishlist(response?.data?.data || []);
        } catch (error) {
            console.error(
                'Wishlist fetch error:',
                error?.response?.data || error.message
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    /**
     * Initial load
     */
    useEffect(() => {
        fetchData(true);
    }, []);

    /**
     * Pull to refresh
     */
    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await fetchData(false);
        } finally {
            setRefreshing(false);
        }
    };

    /**
     * Remove wishlist item
     */
    const removeItem = (id) => {
        Alert.alert(
            'Remove from Wishlist',
            'Are you sure you want to remove this item from your wishlist?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.post(`/customer/wishlist/${id}`);

                            await fetchData(false);
                        } catch (error) {
                            console.error(
                                'Remove wishlist error:',
                                error?.response?.data || error.message
                            );
                        }
                    },
                },
            ]
        );
    };

    /**
     * Move wishlist product to cart
     */
    const moveToCart = async (productId, quantity = 1) => {
        try {
            setMoving(productId);
            await axios.post(
                `/customer/wishlist/${productId}/move-to-cart?quantity=${quantity}`
            );

            await fetchData(false);
        } catch (error) {
            console.error(
                'Move to cart error:',
                error?.response?.data || error.message
            );
        } finally {
            setMoving(null);
            CartEvents.emit([]);
        }
    };

    /**
     * Wishlist item
     */
    const renderItem = ({ item }) => {
        const product = item?.product;
        const loading = item?.product?.id === moving;

        return (
            <View style={styles.card}>

                {/* Remove Wishlist */}
                <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeItem(product?.id)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="heart"
                        size={20}
                        color="#E53935"
                    />
                </TouchableOpacity>

                {/* Product Image */}
                <Image
                    source={{
                        uri: product?.base_image?.small_image_url,
                    }}
                    style={styles.image}
                />

                {/* Product Name */}
                <Text
                    numberOfLines={2}
                    style={styles.name}
                >
                    {product?.name}
                </Text>

                {/* Price */}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>
                        {product?.formatted_price}
                    </Text>
                </View>

                {/* Move To Cart */}
                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => moveToCart(product?.id)}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <>
                            <ActivityIndicator
                                size="small"
                                color="#fff"
                            />

                            <Text style={styles.cartText}>
                                Moving...
                            </Text>
                        </>
                    ) : (
                        <>
                            <Ionicons
                                name="cart-outline"
                                size={18}
                                color="#fff"
                            />

                            <Text style={styles.cartText}>
                                Move to Cart
                            </Text>
                        </>
                    )}

                </TouchableOpacity>

            </View>
        );
    };

    return (
        <>
            <Header />

            <SafeAreaView style={styles.container}>

                {/* Header */}
                <View style={styles.headerRow}>

                    {/* Back */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={20}
                            color="#0C3F80"
                        />

                        <Text style={styles.backText}>
                            Back
                        </Text>
                    </TouchableOpacity>

                    {/* Title */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            My Wishlists
                        </Text>

                        <Text style={styles.headerSubtitle}>
                            {wishlist.length}{' '}
                            {wishlist.length === 1
                                ? 'Wishlist'
                                : 'Wishlists'}
                        </Text>
                    </View>

                </View>

                {/* Content */}
                {loading ? (
                    <WishlistSkeleton />
                ) : (
                    <FlatList
                        data={wishlist}
                        keyExtractor={(item) =>
                            item?.id?.toString()
                        }
                        renderItem={renderItem}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons
                                    name="heart-outline"
                                    size={60}
                                    color="#BDBDBD"
                                />

                                <Text style={styles.emptyTitle}>
                                    Your Wishlist is Empty
                                </Text>

                                <Text style={styles.emptyText}>
                                    Add products to your wishlist
                                    and they will appear here.
                                </Text>
                            </View>
                        }
                    />
                )}

            </SafeAreaView>
        </>
    );
};

export default Wishlist;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },

    /* Header */

    headerRow: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },

    header: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
    },

    headerSubtitle: {
        fontSize: 13,
        color: '#666666',
        marginTop: 4,
        fontWeight: '500',
        textAlign: 'right',
    },

    /* Back Button */

    backButton: {
        height: 42,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: '#F1F5FA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    backText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '700',
        color: '#0C3F80',
    },

    /* List */

    list: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },

    columnWrapper: {
        justifyContent: 'space-between',
    },

    /* Product Card */

    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        elevation: 2,
    },

    removeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
    },

    image: {
        width: '100%',
        height: 130,
        resizeMode: 'contain',
        marginBottom: 10,
    },

    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
        minHeight: 38,
    },

    /* Price */

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },

    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0C3F80',
    },

    /* Cart Button */

    cartButton: {
        marginTop: 10,
        backgroundColor: '#0C3F80',
        borderRadius: 8,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cartText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 5,
        fontSize: 13,
    },

    /* Empty Wishlist */

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 100,
    },

    emptyTitle: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },

    emptyText: {
        marginTop: 6,
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        lineHeight: 20,
    },
});