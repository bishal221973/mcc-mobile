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
import axios from '../../services/axios';
import AddressSkeleton from '../../component/Loading/AddressSkeleton';
import AddressForm from '../../component/AddressForm';
import Toast from 'react-native-toast-message';

const PRIMARY = '#0C3F80';
const DANGER = '#E53935';
const SUCCESS = '#28A745';

const Address = ({ navigation }) => {
    const [addresses, setAddresses] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Address currently being edited
    const [editingAddress, setEditingAddress] = useState(null);

    // =========================================
    // Fetch Addresses
    // =========================================

    const fetchAddress = async (isRefresh = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
            }

            const response = await axios.get(
                '/customer/addresses'
            );

            setAddresses(
                response?.data?.data || []
            );
        } catch (error) {
            console.log(
                'Fetch addresses error:',
                error?.response?.data || error
            );

            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'Unable to load your addresses.',
            });
        } finally {
            if (!isRefresh) {
                setLoading(false);
            }
        }
    };

    // =========================================
    // Initial Load
    // =========================================

    useEffect(() => {
        fetchAddress();
    }, []);

    // =========================================
    // Pull To Refresh
    // =========================================

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        try {
            await fetchAddress(true);
        } finally {
            setRefreshing(false);
        }
    }, []);

    // =========================================
    // Add Address
    // =========================================

    const handleAddAddress = () => {
        setEditingAddress(null);
    };

    // =========================================
    // Edit Address
    // =========================================

    const handleEditAddress = address => {
        setEditingAddress(address);
    };

    // =========================================
    // Delete Address
    // =========================================

    const deleteAddress = id => {
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
                            await axios.delete(
                                `/customer/addresses/${id}`
                            );

                            Toast.show({
                                type: 'success',
                                text1: 'Address Removed',
                                text2:
                                    'Your address has been removed.',
                            });

                            await fetchAddress(true);
                        } catch (error) {
                            console.log(
                                'Delete address error:',
                                error?.response?.data ||
                                error
                            );

                            Toast.show({
                                type: 'error',
                                text1: 'Delete Failed',
                                text2:
                                    'Unable to remove the address.',
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

    // =========================================
    // Format Address
    // =========================================

    const formatAddress = item => {
        const street = Array.isArray(item.address)
            ? item.address.join(', ')
            : item.address || '';

        const parts = [
            street,
            item.city,
            item.state,
            item.country,
            item.postcode,
        ].filter(Boolean);

        return parts.join(', ');
    };

    // =========================================
    // Render Address
    // =========================================

    const renderItem = ({ item }) => {
        const isDefault =
            item.default === true ||
            item.default === 1 ||
            item.default_address === true ||
            item.default_address === 1;

        return (
            <View style={styles.card}>

                {/* =================================
                    Card Header
                ================================= */}

                <View style={styles.cardHeader}>

                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {item.first_name
                                    ?.charAt(0)
                                    ?.toUpperCase() || 'A'}
                            </Text>
                        </View>

                        <View style={styles.nameContainer}>
                            <Text
                                style={styles.name}
                                numberOfLines={1}
                            >
                                {item.first_name}{' '}
                                {item.last_name}
                            </Text>

                            {!!item.company_name && (
                                <Text
                                    style={
                                        styles.company
                                    }
                                    numberOfLines={1}
                                >
                                    {item.company_name}
                                </Text>
                            )}
                        </View>
                    </View>

                    {isDefault && (
                        <View
                            style={
                                styles.defaultBadge
                            }
                        >
                            <Ionicons
                                name="checkmark-circle"
                                size={13}
                                color={SUCCESS}
                            />

                            <Text
                                style={
                                    styles.defaultText
                                }
                            >
                                Default
                            </Text>
                        </View>
                    )}
                </View>

                {/* =================================
                    Divider
                ================================= */}

                <View style={styles.divider} />

                {/* =================================
                    Address
                ================================= */}

                <View style={styles.addressRow}>
                    <View style={styles.locationIcon}>
                        <Ionicons
                            name="location-outline"
                            size={18}
                            color={PRIMARY}
                        />
                    </View>

                    <Text style={styles.address}>
                        {formatAddress(item)}
                    </Text>
                </View>

                {/* =================================
                    Phone / Email
                ================================= */}

                {!!item.phone && (
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="call-outline"
                            size={15}
                            color="#777"
                        />

                        <Text style={styles.infoText}>
                            {item.phone}
                        </Text>
                    </View>
                )}

                {!!item.email && (
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="mail-outline"
                            size={15}
                            color="#777"
                        />

                        <Text style={styles.infoText}>
                            {item.email}
                        </Text>
                    </View>
                )}

                {/* =================================
                    Actions
                ================================= */}

                <View style={styles.actionRow}>

                    {/* Edit */}

                    {/* <TouchableOpacity
                        style={styles.editButton}
                        activeOpacity={0.7}
                        onPress={() =>
                            handleEditAddress(item)
                        }
                    >
                        <Ionicons
                            name="create-outline"
                            size={18}
                            color={PRIMARY}
                        />

                        <Text
                            style={
                                styles.editText
                            }
                        >
                            Edit
                        </Text>
                    </TouchableOpacity> */}
                    <View style={{flex:1}}>
                        <AddressForm
                        address={item}
                        onSuccess={async () => {
                            await fetchAddress(true);

                            // Reset edit mode
                            setEditingAddress(null);
                        }}
                        type="profile"
                    />
                    </View>

                    {/* Delete */}

                    <TouchableOpacity
                        style={styles.deleteButton}
                        activeOpacity={0.7}
                        onPress={() =>
                            deleteAddress(item.id)
                        }
                    >
                        <Ionicons
                            name="trash-outline"
                            size={18}
                            color={DANGER}
                        />

                        <Text
                            style={
                                styles.deleteText
                            }
                        >
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // =========================================
    // Empty State
    // =========================================

    const renderEmpty = () => {
        if (loading) {
            return null;
        }

        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                    <Ionicons
                        name="location-outline"
                        size={40}
                        color={PRIMARY}
                    />
                </View>

                <Text style={styles.emptyTitle}>
                    No addresses yet
                </Text>

                <Text style={styles.emptyText}>
                    Add your billing or shipping address
                    to make checkout faster.
                </Text>

                <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={handleAddAddress}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="add"
                        size={20}
                        color="#fff"
                    />

                    <Text style={styles.emptyButtonText}>
                        Add Address
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <>
            <Header />

            <SafeAreaView style={styles.container}>

                {/* =====================================
                    Page Header
                ===================================== */}

                <View style={styles.headerRow}>

                    <TouchableOpacity
                        style={styles.backButton}
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

                        <Text style={styles.backText}>
                            Back
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            My Addresses
                        </Text>

                        <Text
                            style={
                                styles.headerSubtitle
                            }
                        >
                            {addresses.length}{' '}
                            {addresses.length === 1
                                ? 'Address'
                                : 'Addresses'}
                        </Text>
                    </View>
                </View>

                {/* =====================================
                    Address List
                ===================================== */}

                {loading ? (
                    <AddressSkeleton />
                ) : (
                    <FlatList
                        data={addresses}
                        renderItem={renderItem}
                        keyExtractor={item =>
                            String(item.id)
                        }
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        contentContainerStyle={[
                            styles.list,
                            addresses.length === 0 &&
                            styles.emptyList,
                        ]}
                        showsVerticalScrollIndicator={
                            false
                        }
                        ListEmptyComponent={
                            renderEmpty
                        }
                    />
                )}

                {/* =====================================
                    Add / Edit Address Form
                ===================================== */}

                <AddressForm
                    address={editingAddress}
                    onSuccess={async () => {
                        await fetchAddress(true);

                        // Reset edit mode
                        setEditingAddress(null);
                    }}
                    type="profile"
                />

                {/* =====================================
                    Floating Add Button
                ===================================== */}

                {/* {addresses.length > 0 && ( */}
                {/* <TouchableOpacity
                        style={styles.addButton}
                        activeOpacity={0.85}
                        onPress={handleAddAddress}
                    >
                        <Ionicons
                            name="add"
                            size={22}
                            color="#fff"
                        />

                        <Text style={styles.addText}>
                            Add New Address
                        </Text>
                    </TouchableOpacity> */}
                {/* )} */}
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

    // =========================================
    // Header
    // =========================================

    headerRow: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    backButton: {
        height: 42,
        paddingHorizontal: 12,
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

    header: {
        alignItems: 'flex-end',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
    },

    headerSubtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 3,
        fontWeight: '500',
    },

    // =========================================
    // List
    // =========================================

    list: {
        padding: 15,
        paddingBottom: 110,
    },

    emptyList: {
        flexGrow: 1,
    },

    // =========================================
    // Card
    // =========================================

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,

        elevation: 3,

        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#EAF1FA',
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatarText: {
        fontSize: 17,
        fontWeight: '800',
        color: PRIMARY,
    },

    nameContainer: {
        flex: 1,
        marginLeft: 10,
    },

    name: {
        fontSize: 15,
        fontWeight: '700',
        color: '#222',
    },

    company: {
        marginTop: 3,
        fontSize: 12,
        color: '#777',
    },

    defaultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
        backgroundColor: '#EAF7EE',
    },

    defaultText: {
        marginLeft: 4,
        color: SUCCESS,
        fontSize: 11,
        fontWeight: '700',
    },

    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 13,
    },

    // =========================================
    // Address
    // =========================================

    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    locationIcon: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: '#F1F5FA',
        justifyContent: 'center',
        alignItems: 'center',
    },

    address: {
        flex: 1,
        marginLeft: 8,
        color: '#555',
        fontSize: 13,
        lineHeight: 21,
    },

    // =========================================
    // Contact Info
    // =========================================

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 38,
    },

    infoText: {
        marginLeft: 7,
        fontSize: 12,
        color: '#777',
    },

    // =========================================
    // Actions
    // =========================================

    actionRow: {
        flexDirection: 'row',
        marginTop: 15,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        alignItems:'center'
    },

    editButton: {
        flex: 1,
        height: 40,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        backgroundColor: '#F8FAFD',
    },

    editText: {
        marginLeft: 5,
        color: PRIMARY,
        fontSize: 13,
        fontWeight: '700',
    },

    deleteButton: {
        flex: 1,
        height: 40,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#F2B8B5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        backgroundColor: '#FFF8F8',
    },

    deleteText: {
        marginLeft: 5,
        color: DANGER,
        fontSize: 13,
        fontWeight: '700',
    },

    // =========================================
    // Empty
    // =========================================

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 35,
    },

    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EAF1FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },

    emptyText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 7,
    },

    emptyButton: {
        marginTop: 20,
        backgroundColor: PRIMARY,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 11,
        flexDirection: 'row',
        alignItems: 'center',
    },

    emptyButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
    },

    // =========================================
    // Floating Add
    // =========================================


});