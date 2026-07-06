import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
const ChangePassword = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New password and confirmation password do not match.');
            return;
        }

        alert('Password changed successfully.');
        // Call your API here.
    };

    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled">

                    <Text style={styles.title}>Change Password</Text>
                    <Text style={styles.subtitle}>
                        Update your account password to keep your account secure.
                    </Text>

                    <View style={styles.card}>

                        {/* Current Password */}
                        <Text style={styles.label}>Current Password</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter current password"
                                secureTextEntry={!showCurrent}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />

                            <TouchableOpacity
                                onPress={() => setShowCurrent(!showCurrent)}>
                                <Ionicons
                                    name={
                                        showCurrent
                                            ? 'eye-off-outline'
                                            : 'eye-outline'
                                    }
                                    size={22}
                                    color="#777"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* New Password */}
                        <Text style={styles.label}>New Password</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="key-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter new password"
                                secureTextEntry={!showNew}
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />

                            <TouchableOpacity
                                onPress={() => setShowNew(!showNew)}>
                                <Ionicons
                                    name={
                                        showNew
                                            ? 'eye-off-outline'
                                            : 'eye-outline'
                                    }
                                    size={22}
                                    color="#777"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password */}
                        <Text style={styles.label}>Confirm Password</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Confirm new password"
                                secureTextEntry={!showConfirm}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />

                            <TouchableOpacity
                                onPress={() => setShowConfirm(!showConfirm)}>
                                <Ionicons
                                    name={
                                        showConfirm
                                            ? 'eye-off-outline'
                                            : 'eye-outline'
                                    }
                                    size={22}
                                    color="#777"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tipBox}>
                            <Text style={styles.tipTitle}>
                                Password Requirements
                            </Text>

                            <Text style={styles.tip}>
                                • Minimum 8 characters
                            </Text>
                            <Text style={styles.tip}>
                                • At least one uppercase letter
                            </Text>
                            <Text style={styles.tip}>
                                • At least one number
                            </Text>
                            <Text style={styles.tip}>
                                • At least one special character
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleChangePassword}>
                            <Ionicons
                                name="lock-closed"
                                size={20}
                                color="#fff"
                            />
                            <Text style={styles.buttonText}>
                                Update Password
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },

    content: {
        padding: 18,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#222',
    },

    subtitle: {
        color: '#777',
        marginTop: 5,
        marginBottom: 20,
        fontSize: 14,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 18,
        elevation: 3,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 12,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FAFAFA',
    },

    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontSize: 15,
        color: '#222',
    },

    tipBox: {
        backgroundColor: '#EEF5FF',
        borderRadius: 10,
        padding: 15,
        marginTop: 20,
    },

    tipTitle: {
        fontWeight: '700',
        color: '#0C3F80',
        marginBottom: 8,
    },

    tip: {
        color: '#555',
        fontSize: 13,
        marginBottom: 4,
    },

    button: {
        backgroundColor: '#0C3F80',
        borderRadius: 10,
        marginTop: 25,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
    },
});