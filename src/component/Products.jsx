import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../services/axios"
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from "../services/cart"
import Toast from 'react-native-toast-message';


const PRIMARY = '#0C3F80';

const Products = ({ title, filters }) => {

    const navigation = useNavigation();
    const [quantity, setQuantity] = useState(1);

    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const res = await axios.get("/products", {
                params: {
                    category_id: filters.category_id
                },
            });

            setProducts(res.data.data);



        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts()
    })


    const addToWishlist = async (productId) => {
        const response = await axios.post(`/customer/wishlist/${productId}`);
        fetchProducts();
        Alert.alert('success', "Saved")
    }

    const handleAddToCart = async (product) => {


        console.log("start")

        const token = await AsyncStorage.getItem('token');


        if (token) {
            const pId = product.id;

            const resc = await CartService.addServerItem(
                {
                    product_id: pId.toString(),
                },
                quantity
            );

        } else {
            await CartService.addToLocalCart(
                {
                    product: product,
                },
                quantity
            );
        }


        Toast.show({
            type: 'success',
            text1: 'Added to Cart',
            text2: 'Product has been added to your cart 🛒',
        });
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('ProductShow', {
            id: item.id
        })}>

            {/* <TouchableOpacity style={styles.favorite} onPress={() => addToWishlist(item.id)}>
                <Ionicons
                    name={item?.is_saved ? 'heart' : 'heart-outline'}
                    size={20}
                    color={item?.is_saved ? '#EF4444' : '#fff'}
                />
            </TouchableOpacity> */}

            {/* <Text>{JSON.stringify(item?.images[0]?.url)}</Text> */}
            {/* Product Image */}
            <Image source={{ uri: item?.images[0]?.url }} style={styles.image} />

            {/* Product Name */}
            <View style={{ paddingHorizontal: 10 }}>
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>



                {/* Price */}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{item.formatted_price}</Text>
                    <Text style={styles.oldPrice}>Rs. 1000</Text>
                </View>
            </View>

            {/* Add to Cart */}
            <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(item)}>
                <Ionicons name="cart-outline" size={18} color="#fff" />
                <Text style={styles.cartText}>Add</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headingRow}>
                <Text
                    style={styles.heading}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>

                <TouchableOpacity onPress={() => {
                    navigation.navigate('AllProduct', {
                        categoryId: filters.category_id
                    })
                }}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

export default Products;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },

    headingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 15,
    },

    heading: {
        fontSize: 21,
        fontWeight: '700',
        color: '#111827',
        width: '85%'
    },

    viewAll: {
        color: PRIMARY,
        fontWeight: '600',
    },

    list: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },

    card: {
        width: 190,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 15,
        // padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        borderRadius: 20,
        overflow: 'hidden'
    },

    discountBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        zIndex: 1,
    },

    discountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginTop: 0,
    },

    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        marginTop: 10,
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },

    rating: {
        marginLeft: 5,
        fontWeight: '600',
        color: '#555',
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },

    price: {
        fontSize: 17,
        fontWeight: '700',
        color: PRIMARY,
    },

    oldPrice: {
        marginLeft: 8,
        fontSize: 13,
        color: '#999',
        textDecorationLine: 'line-through',
    },

    cartButton: {
        marginTop: 12,
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
});