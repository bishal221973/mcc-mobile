import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
import axios from "../../services/axios"
const Address = ({ navigation }) => {
    const [addresses, setAddresses] = useState([]);

    const deleteAddress = id => {
        setAddresses(items => items.filter(item => item.id !== id));
    };

    const fetchAddress=async()=>{
        const response=await axios.get('/customer/addresses');
        setAddresses(response?.data?.data);

    }

    useEffect(()=>{
        fetchAddress();
    })

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.badges}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{item.first_name} {item.last_name} ({item.company_name})</Text>
                    </View>

                    {item.default && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                        </View>
                    )}
                </View>
            </View>


            <Text style={styles.address}>{item.address}</Text>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                        navigation.navigate('EditAddress', {
                            address: item,
                        })
                    }>
                    <Ionicons
                        name="create-outline"
                        size={18}
                        color="#0C3F80"
                    />
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteAddress(item.id)}>
                    <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#E53935"
                    />
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                {/* Header */}

                {/* <Text>{JSON.stringify(addresses)}</Text> */}

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        My Addresses
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        {addresses.length} Saved Address
                        {addresses.length > 1 ? 'es' : ''}
                    </Text>
                </View>

                {/* Address List */}

                <FlatList
                    data={addresses}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{
                        padding: 15,
                        paddingBottom: 100,
                    }}
                    showsVerticalScrollIndicator={false}
                />

                {/* Bottom Button */}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                        navigation.navigate('AddAddress')
                    }>
                    <Ionicons
                        name="add-circle-outline"
                        size={22}
                        color="#fff"
                    />

                    <Text style={styles.addText}>
                        Add New Address
                    </Text>
                </TouchableOpacity>

                {/* Floating Button */}

                
            </SafeAreaView>
        </>
    );
};

export default Address;

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

    headerSubtitle: {
        color: '#777',
        marginTop: 2,
        fontSize: 13,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    badges: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    typeBadge: {
        backgroundColor: '#0C3F80',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    typeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },

    defaultBadge: {
        marginLeft: 8,
        backgroundColor: '#28A745',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    defaultText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },

    name: {
        marginTop: 12,
        fontSize: 17,
        fontWeight: '700',
        color: '#222',
    },

    phone: {
        marginTop: 6,
        color: '#555',
        fontSize: 14,
    },

    address: {
        marginTop: 8,
        color: '#666',
        lineHeight: 22,
        fontSize: 14,
    },

    actionRow: {
        flexDirection: 'row',
        marginTop: 18,
    },

    editBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0C3F80',
        borderRadius: 8,
        paddingVertical: 10,
        marginRight: 6,
    },

    editText: {
        color: '#0C3F80',
        fontWeight: '600',
        marginLeft: 5,
    },

    deleteBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E53935',
        borderRadius: 8,
        paddingVertical: 10,
        marginLeft: 6,
    },

    deleteText: {
        color: '#E53935',
        fontWeight: '600',
        marginLeft: 5,
    },

    addButton: {
        position: 'absolute',
        left: 15,
        right: 15,
        bottom: 20,
        backgroundColor: '#0C3F80',
        borderRadius: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 5,
    },

    addText: {
        color: '#fff',
        fontWeight: '700',
        marginLeft: 8,
        fontSize: 16,
    },

    fab: {
        position: 'absolute',
        right: 22,
        bottom: 90,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0C3F80',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
});