import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountInfo = ({ customer }) => {

    const navigation = useNavigation();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: logout,
                },
            ],
            { cancelable: true }
        );
    };


    const logout = async () => {
        try {
            // Prevent multiple logout requests
            if (loggingOut) {
                return;
            }

            setLoggingOut(true);

            // Try to logout from Bagisto/API
            try {
                await axios.post('/customer/logout');
            } catch (apiError) {
                console.log(
                    'Logout API error:',
                    JSON.stringify(
                        {
                            message: apiError?.message,
                            status: apiError?.response?.status,
                            data: apiError?.response?.data,
                        },
                        null,
                        2,
                    ),
                );

                // Continue logout locally even if API fails
            }

            // Always clear local authentication data
            await AsyncStorage.multiRemove([
                'token',
                'customer',
            ]);

            Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been logged out successfully.',
            });

            // Reset navigation
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Login',
                    },
                ],
            });

        } catch (error) {
            console.log(
                'Logout error:',
                JSON.stringify(
                    {
                        message: error?.message,
                        status: error?.response?.status,
                        data: error?.response?.data,
                    },
                    null,
                    2,
                ),
            );

            // Make absolutely sure local session is removed
            try {
                await AsyncStorage.multiRemove([
                    'token',
                    'customer',
                ]);
            } catch (storageError) {
                console.log(
                    'Storage clear error:',
                    storageError,
                );
            }

            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Login',
                    },
                ],
            });

        } finally {
            setLoggingOut(false);
        }
    };


    return (
        <View style={styles.profileCard}>
            <Image
                source={{
                    uri: 'https://i.pravatar.cc/150?img=12',
                }}
                style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{customer.first_name} {customer.last_name}</Text>

                <Text style={styles.email}>
                    {customer.email}
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.editBtn}>
                        <Text style={styles.editText}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Ionicons
                            name="log-out-outline"
                            size={18}
                            color="#fff"

                        />

                        <Text style={styles.logoutText}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AccountInfo

const styles = StyleSheet.create({
    profileCard: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 40,
        marginRight: 15,
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
    },

    email: {
        color: '#777',
        marginBottom: 5,
    },
    editBtn: {
        // marginTop: 10,
        backgroundColor: '#0C3F80',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
    },

    editText: {
        color: '#fff',
        fontWeight: '600',
        fontSize:12
    },

    logoutBtn: {
        // margin: 20,
        backgroundColor: '#E53935',
        // padding: 16,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        height: 38
    },

    logoutText: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: '700',
        fontSize: 13,
    },
})