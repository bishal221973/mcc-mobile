import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, RefreshControl,ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "../../services/axios"
import Header from '../../component/Header'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductSkelton from "../../component/Loading/ProductSkeleton"
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from "../../services/cart"
import Toast from 'react-native-toast-message';
import CartEvents from '../../services/CartEvents';

const PRIMARY = '#0C3F80';

// FIX: Destructured navigation from props
const AllProduct = ({ route, navigation }) => {

    const { categoryId } = route.params;
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addingProductId, setAddingProductId] = useState(null);
const [quantity, setQuantity] = useState(1);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products", {
                params: {
                    category_id: categoryId
                },
            });
            setProducts(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCategory = async () => {
        try {
            const res = await axios.get("/categories", {
                params: {
                    id: categoryId
                },
            });
            setCategory(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    // FIX: Added dependency array to stop the infinite render loop
    // useEffect(() => {
    //     try {
    //         setLoading(true);
    //         fetchProducts();
    //         fetchCategory();
    //     } catch (error) {

    //     } finally {
    //         setLoading(false);
    //     }
    // }, [categoryId])

    const loadInitialData = async () => {
        try {
            setLoading(true);

            await Promise.all([
                fetchProducts(),
                fetchCategory(),
            ]);
        } catch (error) {
            console.log('Initial loading error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, [categoryId]);

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await Promise.all([
                fetchProducts(),
                fetchCategory(),
            ]);
        } catch (error) {
            console.log('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleAddToCart = async (product) => {
        // Prevent duplicate clicks
        const valid = await AsyncStorage.getItem('token');
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

        if (addingProductId === product.id) {
            return;
        }

        try {

            setAddingProductId(product.id);

            const pId = product.id;

            await CartService.addServerItem(
                {
                    product_id: pId.toString(),
                },
                quantity
            );
            Toast.show({
                type: 'success',
                text1: 'Added to Cart',
                text2: 'Product has been added to your cart 🛒',
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
                text2: 'Unable to add product to cart.',
            });

        } finally {
            setAddingProductId(null);
        }
    };

    const renderProduct = ({ item }) => {
        const isAdding = addingProductId === item.id;
        return (

            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ProductShow', { id: item.id })}
            >

                <Image source={{ uri: item?.images[0]?.url }} style={styles.image} />

                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={styles.name} numberOfLines={2}>
                        {item.name}
                    </Text>

                    {/* Price */}
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{item.formatted_price}</Text>
                    </View>
                </View>

                {/* Add to Cart */}
                <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(item)}>
                    {isAdding ? (
                                            <>
                                                <ActivityIndicator
                                                    size="small"
                                                    color="#fff"
                                                />
                    
                                                <Text style={styles.cartText}>
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
                    
                                                <Text style={styles.cartText}>
                                                    Add
                                                </Text>
                                            </>
                                        )}
                </TouchableOpacity>
            </TouchableOpacity>
        )
    };

    return (
        // FIX: Added flex: 1 to parent container so FlatList scrolls properly
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ backgroundColor: '#fff', padding: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                {loading ? (
                    <View style={styles.categorySkeleton} />
                ) : (
                    <Text style={{ fontWeight: 'bold' }}>
                        {category?.[0]?.name || 'Category'}
                    </Text>
                )}
                {/* <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{category?.[0]?.name}</Text> */}
            </View>
            {loading ? (
                <FlatList
                    data={Array.from({ length: 6 })}
                    numColumns={2}
                    keyExtractor={(_, index) => `skeleton-${index}`}
                    renderItem={() => <ProductSkelton />}
                    contentContainerStyle={styles.list}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                    }}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[PRIMARY]}
                            tintColor={PRIMARY}
                        />
                    }
                />
            )}
        </View>
    )
}

export default AllProduct

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },

    row: {
        justifyContent: 'space-between',
    },

    card: {
        width: '48%',           // Fixed width
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

    favorite: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        backgroundColor: '#0C3F8099',
        elevation: 10,
        height: 30,
        width: 30,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: '100%',
        height: 120,
        resizeMode: 'contain',
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
        marginBottom: 12
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

    cartText: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: '700',
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
        color: '#0C3F80',
    },
});