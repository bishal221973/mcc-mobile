import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import axios from '../../services/axios';
import Header from '../../component/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductSkelton from '../../component/Loading/ProductSkeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from '../../services/cart';
import Toast from 'react-native-toast-message';
import CartEvents from '../../services/CartEvents';

const PRIMARY = '#0C3F80';

const AllProduct = ({ route, navigation }) => {
    const { categoryId } = route.params;

    // =========================================
    // Products
    // =========================================
    const [products, setProducts] = useState([]);

    // =========================================
    // Category
    // =========================================
    const [category, setCategory] = useState();

    // =========================================
    // Loading states
    // =========================================
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // =========================================
    // Pagination
    // =========================================
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // =========================================
    // Cart
    // =========================================
    const [addingProductId, setAddingProductId] =
        useState(null);

    const [quantity] = useState(1);

    // =========================================
    // Fetch Products
    // =========================================
    const fetchProducts = async (
        pageNumber = 1,
        isRefresh = false
    ) => {
        try {
            // First page
            if (pageNumber === 1) {
                if (!isRefresh) {
                    setLoading(true);
                }
            } else {
                setLoadingMore(true);
            }

            const res = await axios.get('/products', {
                params: {
                    category_id: categoryId,

                    // IMPORTANT
                    page: pageNumber,

                    // Your API currently returns 12,
                    // so the server is controlling the page size.
                    limit: 48,
                },
            });

            console.log(
                'Products page:',
                pageNumber
            );

            console.log(
                'Pagination:',
                res?.data?.meta
            );

            const newProducts =
                res?.data?.data || [];

            // =========================================
            // First page
            // =========================================
            if (pageNumber === 1) {
                setProducts(newProducts);
            } else {
                // =====================================
                // Append next page
                // =====================================
                setProducts(prevProducts => {
                    const existingIds = new Set(
                        prevProducts.map(
                            product => product.id
                        )
                    );

                    const uniqueProducts =
                        newProducts.filter(
                            product =>
                                !existingIds.has(
                                    product.id
                                )
                        );

                    return [
                        ...prevProducts,
                        ...uniqueProducts,
                    ];
                });
            }

            // =========================================
            // Pagination information
            // =========================================

            const currentPage =
                res?.data?.current_page ??
                res?.data?.meta?.current_page ??
                pageNumber;

            const lastPage =
                res?.data?.last_page ??
                res?.data?.meta?.last_page ??
                null;

            setPage(currentPage);

            // =========================================
            // Determine whether more products exist
            // =========================================

            if (lastPage !== null) {
                setHasMore(
                    currentPage < lastPage
                );
            } else {
                // Fallback if API doesn't provide
                // last_page.
                setHasMore(
                    newProducts.length > 0
                );
            }
        } catch (error) {
            console.log(
                'Fetch products error:',
                error?.response?.data || error
            );
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // =========================================
    // Fetch Category
    // =========================================
    const fetchCategory = async () => {
        try {
            const res = await axios.get(
                '/categories',
                {
                    params: {
                        id: categoryId,
                    },
                }
            );

            setCategory(res.data.data);
        } catch (error) {
            console.log(
                'Category error:',
                error?.response?.data || error
            );
        }
    };

    // =========================================
    // Initial Load
    // =========================================
    const loadInitialData = async () => {
        try {
            setLoading(true);

            // Reset pagination
            setProducts([]);
            setPage(1);
            setHasMore(true);

            await Promise.all([
                fetchProducts(1),
                fetchCategory(),
            ]);
        } catch (error) {
            console.log(
                'Initial loading error:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, [categoryId]);

    // =========================================
    // Load More
    // =========================================
    const loadMoreProducts = () => {
        // Don't make another request while loading
        if (loading || loadingMore) {
            return;
        }

        // No more pages
        if (!hasMore) {
            return;
        }

        const nextPage = page + 1;

        console.log(
            'Loading next page:',
            nextPage
        );

        fetchProducts(nextPage);
    };

    // =========================================
    // Refresh
    // =========================================
    const onRefresh = async () => {
        setRefreshing(true);

        try {
            // Reset pagination
            setPage(1);
            setHasMore(true);

            await Promise.all([
                fetchProducts(1, true),
                fetchCategory(),
            ]);
        } catch (error) {
            console.log(
                'Refresh error:',
                error
            );
        } finally {
            setRefreshing(false);
        }
    };

    // =========================================
    // Add To Cart
    // =========================================
    const handleAddToCart = async product => {
        // Prevent duplicate clicks
        if (
            addingProductId === product.id
        ) {
            return;
        }

        try {
            const valid =
                await AsyncStorage.getItem(
                    'token'
                );

            // =====================================
            // Guest user
            // =====================================
            if (!valid) {
                await CartService.addToLocalCart(
                    {
                        product: product,
                    },
                    quantity
                );

                navigation.replace('Login');

                return;
            }

            // =====================================
            // Logged in user
            // =====================================
            setAddingProductId(product.id);

            await CartService.addServerItem(
                {
                    product_id:
                        product.id.toString(),
                },
                quantity
            );

            Toast.show({
                type: 'success',
                text1: 'Added to Cart',
                text2:
                    'Product has been added to your cart 🛒',
            });

            CartEvents.emit([]);
        } catch (error) {
            console.log(
                'Add to cart error:',
                error?.response?.data || error
            );

            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2:
                    'Unable to add product to cart.',
            });
        } finally {
            setAddingProductId(null);
        }
    };

    // =========================================
    // Product Card
    // =========================================
    const renderProduct = ({ item }) => {
        const isAdding =
            addingProductId === item.id;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                    navigation.navigate(
                        'ProductShow',
                        {
                            id: item.id,
                        }
                    )
                }
            >
                {/* Product Image */}
                <Image
                    source={{
                        uri: item?.images?.[0]?.url,
                    }}
                    style={styles.image}
                />

                {/* Product Information */}
                <View
                    style={
                        styles.productInfo
                    }
                >
                    <Text
                        style={styles.name}
                        numberOfLines={2}
                    >
                        {item.name}
                    </Text>

                    {/* Price */}
                    <View
                        style={
                            styles.priceRow
                        }
                    >
                        <Text
                            style={
                                styles.price
                            }
                        >
                            {
                                item.formatted_price
                            }
                        </Text>
                    </View>
                </View>

                {/* Add To Cart */}
                <TouchableOpacity
                    style={[
                        styles.cartButton,
                        isAdding &&
                        styles.cartButtonLoading,
                    ]}
                    onPress={event => {
                        // Prevent parent card
                        // navigation
                        event.stopPropagation();

                        handleAddToCart(
                            item
                        );
                    }}
                    disabled={isAdding}
                    activeOpacity={0.8}
                >
                    {isAdding ? (
                        <>
                            <ActivityIndicator
                                size="small"
                                color="#fff"
                            />

                            <Text
                                style={
                                    styles.cartText
                                }
                            >
                                Adding...
                            </Text>
                        </>
                    ) : (
                        <>
                            <Ionicons
                                name="cart-outline"
                                size={18}
                                color="#fff"
                            />

                            <Text
                                style={
                                    styles.cartText
                                }
                            >
                                Add
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    // =========================================
    // Footer Loader
    // =========================================
    const renderFooter = () => {
        if (!loadingMore) {
            return null;
        }

        return (
            <View
                style={
                    styles.footerLoader
                }
            >
                <ActivityIndicator
                    size="small"
                    color={PRIMARY}
                />

                <Text
                    style={
                        styles.loadingMoreText
                    }
                >
                    Loading more...
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header />

            {/* =====================================
                Category Header
            ===================================== */}
            <View
                style={
                    styles.categoryHeader
                }
            >
                <TouchableOpacity
                    style={
                        styles.backButton
                    }
                    onPress={() =>
                        navigation.goBack()
                    }
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        color={PRIMARY}
                    />

                    <Text
                        style={
                            styles.backText
                        }
                    >
                        Back
                    </Text>
                </TouchableOpacity>

                {loading ? (
                    <View
                        style={
                            styles.categorySkeleton
                        }
                    />
                ) : (
                    <Text
                        style={
                            styles.categoryTitle
                        }
                    >
                        {category?.[0]?.name ||
                            'Category'}
                    </Text>
                )}
            </View>

            {/* =====================================
                Initial Skeleton
            ===================================== */}
            <View style={{ marginBottom: 200 }}>
                {loading ? (
                    <FlatList
                        data={Array.from({
                            length: 6,
                        })}
                        numColumns={2}
                        keyExtractor={(
                            _,
                            index
                        ) =>
                            `skeleton-${index}`
                        }
                        renderItem={() => (
                            <ProductSkelton />
                        )}
                        contentContainerStyle={
                            styles.list
                        }
                        columnWrapperStyle={
                            styles.columnWrapper
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                    />
                ) : (
                    <FlatList
                        data={products}
                        renderItem={
                            renderProduct
                        }
                        numColumns={2}
                        keyExtractor={item =>
                            item.id.toString()
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.list
                        }
                        columnWrapperStyle={
                            styles.columnWrapper
                        }

                        // =================================
                        // INFINITE SCROLL
                        // =================================
                        onEndReached={
                            loadMoreProducts
                        }

                        onEndReachedThreshold={
                            0.5
                        }

                        // =================================
                        // Footer loader
                        // =================================
                        ListFooterComponent={
                            renderFooter
                        }

                        // =================================
                        // Pull to refresh
                        // =================================
                        refreshControl={
                            <RefreshControl
                                refreshing={
                                    refreshing
                                }
                                onRefresh={
                                    onRefresh
                                }
                                colors={[
                                    PRIMARY,
                                ]}
                                tintColor={
                                    PRIMARY
                                }
                            />
                        }
                    />
                )}
            </View>
        </View>
    );
};

export default AllProduct;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    categoryHeader: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent:
            'space-between',
        alignItems: 'center',
    },

    categoryTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#111827',
    },

    categorySkeleton: {
        width: 140,
        height: 24,
        borderRadius: 7,
        backgroundColor: '#E5E7EB',
    },

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
        color: PRIMARY,
    },

    list: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },

    columnWrapper: {
        justifyContent:
            'space-between'
    },

    card: {
        width: '48%',
        backgroundColor: '#fff',
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 20,
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
    },

    productInfo: {
        paddingHorizontal: 10,
    },

    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginTop: 5,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },

    price: {
        fontSize: 13,
        fontWeight: '700',
        color: PRIMARY,
        marginBottom: 12,
    },

    cartButton: {
        marginTop: 'auto',
        backgroundColor: PRIMARY,
        borderRadius: 8,
        paddingVertical: 9,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cartButtonLoading: {
        opacity: 0.7,
    },

    cartText: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: '700',
    },

    footerLoader: {
        width: '100%',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    loadingMoreText: {
        marginLeft: 8,
        color: PRIMARY,
        fontSize: 13,
        fontWeight: '600',
    },
});
