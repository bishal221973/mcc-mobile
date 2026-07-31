import React, { useEffect, useState } from 'react';
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

import ProductImageShow from '../../component/ProductImageShow';
import ProductTabs from '../../component/ProductTabs';
import RelatedProducts from '../../component/RelatedProducts';

import axios from '../../services/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from "../../services/cart"

const ProductShow = ({ route }) => {

    const { id } = route.params;

    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [product, setProduct] = useState(null);


    const fetchProduct = async () => {
        try {

            const response = await axios.get(`/products/${id}`);

            console.log(response.data);

            setProduct(response.data.data);

        } catch (error) {

            console.log(
                error.response?.data || error.message
            );

        }
    };


    useEffect(() => {
        fetchProduct();
    }, [id]);



    const handleAddToCart = async () => {

        // try {
        //     const cart = JSON.parse(await AsyncStorage.getItem('cart')) || [];

        //     const index = cart.findIndex(item => item.product_id === product.id);

        //     if (index > -1) {
        //         cart[index].quantity += quantity;
        //     } else {
        //         cart.push({
        //             product_id: product.id,
        //             name: product.name,
        //             price: product.price,
        //             image: product.base_image?.small_image_url,
        //             quantity,
        //         });
        //     }

        //     await AsyncStorage.setItem('cart', JSON.stringify(cart));
        //     Alert.alert('Success', 'Product added to cart');
        // } catch (err) {
        //     console.log(err);
        // }

        console.log("start")

        const token = await AsyncStorage.getItem('token');


        if (token) {
            // console.log(product)
            // Alert.alert("success",product.id)
            const resc= await CartService.addServerItem(
                {
                    product_id: product.id,
                },
                quantity
            );
            console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++")
            console.log(resc)
            console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++")
        } else {
            await CartService.addToLocalCart(
                {
                    product_id: product.id,
                },
                quantity
            );
        }


        console.log("end")
    };


    const handleBuyNow = () => {

        Alert.alert(
            'Checkout',
            `Buying ${quantity} item(s)`
        );

    };



    if (!product) {

        return (
            <View style={styles.loading}>
                <Text>Loading...</Text>
            </View>
        );

    }



    return (

        <SafeAreaView style={styles.mainWrapper}>


            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
            >


                {/* Product Images */}

                <ProductImageShow
                    product={product}
                />

                <TouchableOpacity
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

                </TouchableOpacity>




                {/* Product Details */}

                <View style={styles.detailsContainer}>


                    <View style={styles.titleRow}>


                        <Text style={styles.productTitle}>
                            {product.name}
                        </Text>




                    </View>
                    <Text style={[styles.productPrice, { marginTop: 5 }]}>
                        {product.formatted_price}
                    </Text>



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

                <RelatedProducts />


            </ScrollView>




            {/* Footer */}

            <View style={styles.footer}>


                <View>

                    <Text style={styles.totalLabel}>
                        Total Price
                    </Text>


                    <Text style={styles.totalPriceText}>
                        Rs. {Number(product.price) * quantity}
                    </Text>


                </View>




                <View style={styles.buttonActionGroup}>


                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={handleAddToCart}
                    >

                        <Ionicons
                            name="bag-handle-outline"
                            size={22}
                            color="#007AFF"
                        />

                    </TouchableOpacity>




                    <TouchableOpacity
                        style={styles.buyNowButton}
                        onPress={handleBuyNow}
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