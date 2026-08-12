import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

const AccountInfo = ({ customer }) => {

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
                            size={22}
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
        marginLeft: 10,
        fontWeight: '700',
        fontSize: 16,
    },
})