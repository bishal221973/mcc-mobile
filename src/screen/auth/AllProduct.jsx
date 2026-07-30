import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from "../../services/axios"
import Header from '../../component/Header'
import Ionicons from 'react-native-vector-icons/Ionicons';

const PRIMARY = '#0C3F80';

// FIX: Destructured navigation from props
const AllProduct = ({ route, navigation }) => {

    const { categoryId } = route.params;
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState();

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
    useEffect(() => {
        fetchProducts();
        fetchCategory();
    }, [categoryId])

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ProductShow', { id: item.id })}
        >
            <TouchableOpacity style={styles.favorite}>
                <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>

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
        // FIX: Added flex: 1 to parent container so FlatList scrolls properly
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ backgroundColor: '#fff', padding: 10,marginBottom:10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{category?.[0]?.name}</Text>
            </View>
            <FlatList
                data={products}
                renderItem={renderProduct}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()} // Ensure key is a string
                showsVerticalScrollIndicator={false} // Changed to vertical since it is a 2-column grid
                contentContainerStyle={styles.list}
                columnWrapperStyle={{
                    justifyContent: 'space-between',

                }}
            />
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