import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Header from '../../component/Header';
import axios from '../../services/axios';

const ChangePassword = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    const [customer, setCustomer] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Fetch Customer Profile
    |--------------------------------------------------------------------------
    */
    const fetchProfile = async () => {
        try {
            setProfileLoading(true);

            const response = await axios.get('/customer/get');

            setCustomer(response?.data?.data || null);
        } catch (error) {
            console.log(
                'Fetch profile error:',
                error?.response?.data || error
            );

            Toast.show({
                type: 'error',
                text1: 'Unable to Load Profile',
                text2: 'Please try again.',
            });
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */
    const handleChangePassword = async () => {
        // Profile must be loaded
        if (!customer) {
            Toast.show({
                type: 'error',
                text1: 'Profile Not Loaded',
                text2: 'Please wait for your profile to load.',
            });

            return;
        }

        // Required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Required Fields',
                text2: 'Please fill in all password fields.',
            });

            return;
        }

        // Current password and new password should not be same
        if (currentPassword === newPassword) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'New password must be different from your current password.',
            });

            return;
        }

        // Minimum length
        if (newPassword.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'Password must be at least 8 characters.',
            });

            return;
        }

        // Uppercase
        if (!/[A-Z]/.test(newPassword)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'Password must contain at least one uppercase letter.',
            });

            return;
        }

        // Number
        if (!/[0-9]/.test(newPassword)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'Password must contain at least one number.',
            });

            return;
        }

        // Special character
        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;']/g.test(newPassword)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'Password must contain at least one special character.',
            });

            return;
        }

        // Confirm password
        if (newPassword !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'New password and confirmation password do not match.',
            });

            return;
        }

        // DOB is required by Bagisto
        if (!customer?.date_of_birth) {
            Toast.show({
                type: 'error',
                text1: 'Date of Birth Required',
                text2: 'Please update your date of birth before changing your password.',
            });

            return;
        }

        try {
            setLoading(true);

            await axios.put('/customer/profile', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,

                first_name: customer?.first_name || '',
                last_name: customer?.last_name || '',
                gender: customer?.gender,
                date_of_birth: customer.date_of_birth,
                phone: customer?.phone || '',
                email: customer?.email || '',
            });

            Toast.show({
                type: 'success',
                text1: 'Password Updated',
                text2: 'Your password has been changed successfully.',
            });

            // Clear password fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            console.log(
                'Change password error:',
                error?.response?.data || error
            );

            const errors = error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'Unable to change your password.';

            // Bagisto validation errors
            if (errors) {
                const firstError = Object.values(errors)?.[0];

                if (Array.isArray(firstError)) {
                    message = firstError[0];
                } else if (typeof firstError === 'string') {
                    message = firstError;
                }
            }

            Toast.show({
                type: 'error',
                text1: 'Password Change Failed',
                text2: message,
            });
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Profile Loading
    |--------------------------------------------------------------------------
    */
    if (profileLoading) {
        return (
            <>
                <Header />

                <SafeAreaView style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#0C3F80"
                    />

                    <Text style={styles.loadingText}>
                        Loading profile...
                    </Text>
                </SafeAreaView>
            </>
        );
    }

    return (
        <>
            <Header />

            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>
                        Change Password
                    </Text>

                    <Text style={styles.subtitle}>
                        Update your account password to keep your
                        account secure.
                    </Text>

                    <View style={styles.card}>

                        {/* Current Password */}
                        <Text style={styles.label}>
                            Current Password
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter current password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showCurrent}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowCurrent(!showCurrent)
                                }
                            >
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
                        <Text style={styles.label}>
                            New Password
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="key-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter new password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showNew}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowNew(!showNew)
                                }
                            >
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
                        <Text style={styles.label}>
                            Confirm Password
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Confirm new password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showConfirm}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowConfirm(!showConfirm)
                                }
                            >
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

                        {/* Password Requirements */}
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

                        {/* Update Button */}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                loading && styles.buttonDisabled,
                            ]}
                            onPress={handleChangePassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#fff"
                                />
                            ) : (
                                <Ionicons
                                    name="lock-closed"
                                    size={20}
                                    color="#fff"
                                />
                            )}

                            <Text style={styles.buttonText}>
                                {loading
                                    ? 'Updating...'
                                    : 'Update Password'}
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

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
    },

    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
    },

    content: {
        padding: 18,
        paddingBottom: 40,
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
        lineHeight: 20,
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

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
    },
});