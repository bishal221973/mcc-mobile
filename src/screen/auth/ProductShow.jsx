import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import ProductImageShow from '../../component/ProductImageShow';
import ProductTabs from '../../component/ProductTabs';
import RelatedProducts from '../../component/RelatedProducts';

import axios from '../../services/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from "../../services/cart"
import Toast from 'react-native-toast-message';
import Header from '../../component/Header';
import ProductInfoSkeleton from '../../component/Loading/ProductInfoSkeleton';
import CartEvents from '../../services/CartEvents';
const ProductShow = ({ route, navigation }) => {

    const { id } = route.params;

    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [product, setProduct] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [productLoading, setProductLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const fetchProduct = async () => {
        try {
            setProductLoading(true);

            const response = await axios.get(`/products/${id}`);

            setProduct(response.data.data);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        } finally {
            setProductLoading(false);
        }
    };


    useEffect(() => {
        fetchProduct();
    }, [id]);



    const handleAddToCart = async () => {


        const token = await AsyncStorage.getItem('token');


        if (token) {
            setLoading(true);
            const pId = product.id;

            const resc = await CartService.addServerItem(
                {
                    product_id: pId.toString(),
                },
                quantity
            );
            setLoading(false);
        } else {

            await CartService.addToLocalCart(
                {
                    product: product,
                },
                quantity
            );
            navigation.replace('Login');
        }
        CartEvents.emit([]);


        Toast.show({
            type: 'success',
            text1: 'Added to Cart',
            text2: 'Product has been added to your cart 🛒',
        });
    };


    const handleBuyNow = async () => {

        const token = await AsyncStorage.getItem('token');


        if (token) {
            const pId = product.id;

            await CartService.clearAllCart();

            const resc = await CartService.addServerItem(
                {
                    product_id: pId.toString(),
                },
                quantity
            );

            navigation.navigate('Checkout')

        } else {
            await CartService.addToLocalCart(
                {
                    product: product,
                },
                quantity
            );
            navigation.replace('Login');
        }


        Toast.show({
            type: 'success',
            text1: 'Added to Cart',
            text2: 'Product has been added to your cart 🛒',
        });

    };



    if (!product) {

        return (
            <ProductInfoSkeleton />
        );

    }

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await fetchProduct();
        } catch (error) {
            console.log('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    };



    return (

        <SafeAreaView style={styles.mainWrapper}>
            <Header />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0C3F80']}
                        tintColor="#0C3F80"
                    />
                }
            >


                {/* Product Images */}

                <ProductImageShow
                    product={product}
                />

                {/* <TouchableOpacity
                    style={styles.favoriteBtn}
                    onPress={() =>
                        setIsFavorite(!isFavorite)
                    }
                >

                    <Ionicons
                        name={
                            isFavorite
                                ? "heart"
                                : "heart-outline"
                        }
                        size={25}
                        color={
                            isFavorite
                                ? "#E63946"
                                : "#000"
                        }
                    />

                </TouchableOpacity> */}




                {/* Product Details */}

                <View style={styles.detailsContainer}>


                    <View style={styles.titleRow}>


                        <Text style={styles.productTitle}>
                            {product.name}
                        </Text>




                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                        <Text
                            style={{
                                textDecorationLine: 'line-through',
                                color: '#888',
                                fontSize: 12,
                            }}
                        >
                            {product?.formatted_regular_price}
                        </Text>
                        
                        <Text style={[styles.productPrice]}>
                            {product.formatted_price}
                        </Text>
                    </View>



                    <Text style={styles.sectionTitle}>
                        Description
                    </Text>


                    <Text style={styles.productDescription}>
                        {product.short_description
                            ?.replace(/<[^>]*>/g, '')
                        }
                    </Text>




                    {/* Quantity */}

                    <Text style={styles.sectionTitle}>
                        Quantity
                    </Text>



                    <View style={styles.quantityContainer}>


                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() =>
                                setQuantity(
                                    Math.max(
                                        1,
                                        quantity - 1
                                    )
                                )
                            }
                        >

                            <Ionicons
                                name="remove"
                                size={20}
                                color="#000"
                            />

                        </TouchableOpacity>



                        <Text style={styles.qtyText}>
                            {quantity}
                        </Text>



                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() =>
                                setQuantity(quantity + 1)
                            }
                        >

                            <Ionicons
                                name="add"
                                size={20}
                                color="#000"
                            />

                        </TouchableOpacity>



                    </View>


                </View>



                <ProductTabs product={product} />

                {/* <RelatedProducts /> */}


            </ScrollView>




            {/* Footer */}

            <View style={styles.footer}>


                <View>

                    <Text style={styles.totalLabel}>
                        Total Price
                    </Text>


                    <Text style={styles.totalPriceText}>
                        Rs. {Number(product?.price) * quantity}
                    </Text>


                </View>




                <View style={styles.buttonActionGroup}>


                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={handleAddToCart}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color="#007AFF"
                            />
                        ) : (
                            <Ionicons
                                name="bag-handle-outline"
                                size={22}
                                color="#007AFF"
                            />
                        )}

                    </TouchableOpacity>




                    <TouchableOpacity
                        style={styles.buyNowButton}
                        onPress={handleBuyNow}
                        disabled={loading}
                    >

                        <Text style={styles.buyNowButtonText}>
                            Buy Now
                        </Text>

                    </TouchableOpacity>



                </View>


            </View>



        </SafeAreaView>

    );

};


export default ProductShow;



const styles = StyleSheet.create({


    mainWrapper: {
        flex: 1,
        backgroundColor: '#fff'
    },


    container: {
        flex: 1,
    },


    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },


    scrollContent: {
        paddingBottom: 100
    },


    favoriteBtn: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: '#fff',
        height: 45,
        width: 45,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },


    detailsContainer: {
        backgroundColor: '#fff',
        padding: 20,
    },


    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },


    productTitle: {
        flex: 1,
        fontSize: 22,
        fontWeight: '700',
    },


    productPrice: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: '700'
    },


    sectionTitle: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '600'
    },


    productDescription: {
        marginTop: 8,
        color: '#666',
        lineHeight: 22
    },


    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#eee',
        width: 130,
        padding: 5,
        borderRadius: 10,
        justifyContent: 'space-between'
    },


    qtyBtn: {
        width: 35,
        height: 35,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },


    qtyText: {
        fontSize: 18,
        fontWeight: '600'
    },


    footer: {
        height: 80,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },


    totalLabel: {
        color: '#777'
    },


    totalPriceText: {
        fontSize: 18,
        fontWeight: '700'
    },


    buttonActionGroup: {
        flexDirection: 'row',
        alignItems: 'center'
    },


    cartButton: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },


    buyNowButton: {
        backgroundColor: '#007AFF',
        height: 50,
        paddingHorizontal: 30,
        borderRadius: 10,
        justifyContent: 'center'
    },


    buyNowButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700'
    }


});