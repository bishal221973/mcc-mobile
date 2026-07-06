import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
const Wishlist = ({ navigation }) => {
    const [wishlist, setWishlist] = useState([
        {
            id: '1',
            name: 'Apple iPhone 15 Pro',
            category: 'Smartphone',
            price: '$1,799',
            oldPrice: '$1,999',
            discount: '10% OFF',
            rating: '4.8',
            stock: 'In Stock',
            image: require('../../../assets/products/3.webp'),
        },
        {
            id: '2',
            name: 'Nike Air Max',
            category: 'Shoes',
            price: '$249',
            oldPrice: '$299',
            discount: '17% OFF',
            rating: '4.6',
            stock: 'In Stock',
            image: require('../../../assets/products/3.webp'),
        },
        {
            id: '3',
            name: 'Samsung Galaxy Watch',
            category: 'Watch',
            price: '$599',
            oldPrice: '$699',
            discount: '14% OFF',
            rating: '4.7',
            stock: 'Only 2 Left',
            image: require('../../../assets/products/3.webp'),
        },
        {
            id: '4',
            name: 'Sony Headphones',
            category: 'Accessories',
            price: '$199',
            oldPrice: '$249',
            discount: '20% OFF',
            rating: '4.9',
            stock: 'In Stock',
            image: require('../../../assets/products/3.webp'),
        },
    ]);

    const removeItem = id => {
        setWishlist(items => items.filter(item => item.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeItem(item.id)}>
                <Ionicons name="heart" size={20} color="#E53935" />
            </TouchableOpacity>

            <Image source={item.image} style={styles.image} />

            <Text numberOfLines={2} style={styles.name}>
                {item.name}
            </Text>

            <Text style={styles.category}>{item.category}</Text>

            <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFC107" />
                <Text style={styles.rating}>{item.rating}</Text>
            </View>

            <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
            </View>

            <Text style={styles.discount}>{item.discount}</Text>

            <Text style={styles.stock}>{item.stock}</Text>

            <TouchableOpacity style={styles.cartButton}>
                <Ionicons name="cart-outline" size={18} color="#fff" />
                <Text style={styles.cartText}>Move to Cart</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Wishlist</Text>
                    <Text style={styles.headerSub}>
                        {wishlist.length} Items Saved
                    </Text>
                </View>

                <FlatList
                    data={wishlist}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
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

    header: {
        backgroundColor: '#fff',
        padding: 18,
        elevation: 2,
        marginBottom: 10,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222',
    },

    headerSub: {
        color: '#777',
        marginTop: 2,
    },

    list: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },

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
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        minHeight: 40,
    },

    category: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },

    rating: {
        marginLeft: 4,
        color: '#555',
        fontSize: 12,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },

    price: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0C3F80',
    },

    oldPrice: {
        marginLeft: 6,
        color: '#999',
        fontSize: 12,
        textDecorationLine: 'line-through',
    },

    discount: {
        color: '#28a745',
        fontWeight: '600',
        fontSize: 12,
        marginTop: 3,
    },

    stock: {
        color: '#ff9800',
        fontSize: 12,
        marginTop: 5,
    },

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
});