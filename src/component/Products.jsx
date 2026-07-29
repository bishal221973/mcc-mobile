import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../services/axios"
const PRIMARY = '#0C3F80';

// const products = [
//     {
//         id: '1',
//         name: 'Apple iPhone 15 Pro Max',
//         image: require('../../assets/products/3.webp'),
//         price: '$999',
//         oldPrice: '$1099',
//         discount: '10% OFF',
//         rating: 4.8,
//     },
//     {
//         id: '2',
//         name: 'Sony WH-1000XM5',
//         image: require('../../assets/products/1.webp'),
//         price: '$299',
//         oldPrice: '$349',
//         discount: '15% OFF',
//         rating: 4.9,
//     },
//     // {
//     //     id: '3',
//     //     name: 'Apple Watch Ultra',
//     //     image: require('../../assets/products/2.webp'),
//     //     price: '$699',
//     //     oldPrice: '$799',
//     //     discount: '12% OFF',
//     //     rating: 4.8,
//     // },
// ];

const Products = ({ title, filters }) => {

    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        console.log(filters)
        try {
            const res = await axios.get("/products", {
                params: {
                    category_id: filters.category_id,
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

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            {/* Discount Badge */}
            {/* <View style={styles.discountBadge}>
                
            </View> */}
            {/* <Text style={styles.discountText}>{item.discount}</Text> */}

            {/* Wishlist */}
            <TouchableOpacity style={styles.favorite}>
                <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>

            {/* <Text>{JSON.stringify(item?.images[0]?.url)}</Text> */}
            {/* Product Image */}
            <Image source={{ uri: item?.images[0]?.url }} style={styles.image} />

            {/* Product Name */}
            <View style={{paddingHorizontal:10}}>
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
            <TouchableOpacity style={styles.cartButton}>
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

                <TouchableOpacity>
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