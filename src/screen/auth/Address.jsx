import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
import axios from "../../services/axios";
import AddressSkeleton from "../../component/Loading/AddressSkeleton"
import AddressForm from "../../component/AddressForm"
import Toast from 'react-native-toast-message';


const Address = ({ navigation }) => {
    const [addresses, setAddresses] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const fetchAddress = async (isRefresh = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
            }
            const response = await axios.get('/customer/addresses');
            setAddresses(response?.data?.data || []);
        }
        catch (error) {
            console.log('Fetch addresses error:', error);
        } finally {
            if (!isRefresh) {
                setLoading(false);
            }
        }
    };

    // Pull to refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            await fetchAddress();
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchAddress();
    }, []);

    const deleteAddress = (id) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to remove this address?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`/customer/addresses/${id}`);

                            Toast.show({
                                type: 'success',
                                text1: 'Address Removed',
                                text2: 'Your address has been removed',
                            });

                            fetchAddress();
                        } catch (error) {
                            console.log('Delete address error:', error);

                            Toast.show({
                                type: 'error',
                                text1: 'Delete Failed',
                                text2: 'Unable to remove the address',
                            });
                        }
                    },
                },
            ],
            {
                cancelable: true,
            }
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <View style={styles.badges}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>
                            {item.first_name} {item.last_name}
                            {item.company_name
                                ? ` (${item.company_name})`
                                : ''}
                        </Text>
                    </View>

                    {item.default && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>
                                Default
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <Text style={styles.address}>
                {item.address}
            </Text>

            <View style={styles.actionRow}>
                {/* <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                        navigation.navigate('EditAddress', {
                            address: item,
                        })
                    }
                >
                    <Ionicons
                        name="create-outline"
                        size={18}
                        color="#0C3F80"
                    />

                    <Text style={styles.editText}>
                        Edit
                    </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteAddress(item.id)}
                >
                    <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#E53935"
                    />

                    <Text style={styles.deleteText}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            <Header />

            <SafeAreaView style={styles.container}>
                <View style={[styles.headerRow]}>
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
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>My Wishlists</Text>
                        <Text style={styles.headerSubtitle}>
                            {addresses.length} {addresses.length === 1 ? 'Address' : 'Addresses'}
                        </Text>
                    </View>
                </View>


                {loading ? (
                    <AddressSkeleton />
                ) : (
                    <FlatList
                        data={addresses}
                        renderItem={renderItem}
                        keyExtractor={item => String(item.id)}
                        refreshing={refreshing}
                        onRefresh={
                            async () => {
                                setRefreshing(true);
                                try {
                                    await fetchAddress(true);
                                } finally {
                                    setRefreshing(false);
                                }
                            }
                        }
                        contentContainerStyle={{ padding: 15, paddingBottom: 100, }}
                        showsVerticalScrollIndicator={false} />
                )
                }
                <AddressForm
                    onSuccess={fetchAddress}
                />
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

    headerRow: {
        backgroundColor: '#fff',
        // paddingHorizontal: 20,
        // paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingLeft:10
        paddingHorizontal: 20,
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
        textAlign: 'right'
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