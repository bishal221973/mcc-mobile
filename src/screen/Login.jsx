import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    StatusBar,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../services/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartService from '../services/cart';

const PRIMARY = '#0C3F80';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const syncCartItem = async () => {
        try {
            await CartService.syncCart();
        } catch (error) {
            console.log('Load cart error:', error);
        }
    };

    const handleLogin = async () => {
        // ==============================
        // Validation
        // ==============================

        if (!email.trim()) {
            Alert.alert(
                'Email Required',
                'Please enter your email address.'
            );
            return;
        }

        if (!password) {
            Alert.alert(
                'Password Required',
                'Please enter your password.'
            );
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                '/customer/login',
                {
                    email: email.trim(),
                    password,
                    device_name: 'android',
                }
            );

            console.log(response.data);

            const token = response.data.token;
            const customer = response.data.data;

            // ==============================
            // Save authentication
            // ==============================

            await AsyncStorage.setItem(
                'token',
                token
            );

            await AsyncStorage.setItem(
                'customer',
                JSON.stringify(customer)
            );

            // ==============================
            // Sync local cart
            // ==============================

            await syncCartItem();

            // ==============================
            // Go to application
            // ==============================

            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Drawer',
                    },
                ],
            });
        } catch (error) {
            console.log(
                'Login error:',
                error?.response?.data || error
            );

            Alert.alert(
                'Login Failed',
                error?.response?.data?.message ||
                    'Invalid email or password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#fff"
            />

            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={
                        styles.scrollContent
                    }
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ==================================
                        Header
                    ================================== */}

                    <View style={styles.header}>
                        <View
                            style={
                                styles.logoContainer
                            }
                        >
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.title}>
                            Welcome Back
                        </Text>

                        <Text
                            style={styles.subtitle}
                        >
                            Sign in to continue to your
                            account
                        </Text>
                    </View>

                    {/* ==================================
                        Form
                    ================================== */}

                    <View style={styles.form}>
                        {/* Email */}

                        <View
                            style={
                                styles.fieldContainer
                            }
                        >
                            <Text
                                style={
                                    styles.label
                                }
                            >
                                Email Address
                            </Text>

                            <View
                                style={[
                                    styles.inputWrapper,
                                    emailFocused &&
                                        styles.inputWrapperFocused,
                                ]}
                            >
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={
                                        emailFocused
                                            ? PRIMARY
                                            : '#9CA3AF'
                                    }
                                />

                                <TextInput
                                    style={
                                        styles.input
                                    }
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={
                                        setEmail
                                    }
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={
                                        false
                                    }
                                    onFocus={() =>
                                        setEmailFocused(
                                            true
                                        )
                                    }
                                    onBlur={() =>
                                        setEmailFocused(
                                            false
                                        )
                                    }
                                />
                            </View>
                        </View>

                        {/* Password */}

                        <View
                            style={
                                styles.fieldContainer
                            }
                        >
                            <View
                                style={
                                    styles.labelRow
                                }
                            >
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Password
                                </Text>

                                {/* <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate(
                                            'ForgotPassword'
                                        )
                                    }
                                >
                                    <Text
                                        style={
                                            styles.forgotText
                                        }
                                    >
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity> */}
                            </View>

                            <View
                                style={[
                                    styles.inputWrapper,
                                    passwordFocused &&
                                        styles.inputWrapperFocused,
                                ]}
                            >
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={
                                        passwordFocused
                                            ? PRIMARY
                                            : '#9CA3AF'
                                    }
                                />

                                <TextInput
                                    style={
                                        styles.input
                                    }
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={
                                        setPassword
                                    }
                                    secureTextEntry={
                                        !showPassword
                                    }
                                    autoCapitalize="none"
                                    autoCorrect={
                                        false
                                    }
                                    onFocus={() =>
                                        setPasswordFocused(
                                            true
                                        )
                                    }
                                    onBlur={() =>
                                        setPasswordFocused(
                                            false
                                        )
                                    }
                                />

                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    style={
                                        styles.eyeButton
                                    }
                                >
                                    <Ionicons
                                        name={
                                            showPassword
                                                ? 'eye-outline'
                                                : 'eye-off-outline'
                                        }
                                        size={21}
                                        color="#6B7280"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* ==================================
                            Login Button
                        ================================== */}

                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                loading &&
                                    styles.loginButtonDisabled,
                            ]}
                            activeOpacity={0.85}
                            onPress={
                                handleLogin
                            }
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator
                                        size="small"
                                        color="#fff"
                                    />

                                    <Text
                                        style={
                                            styles.loginButtonText
                                        }
                                    >
                                        Signing in...
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text
                                        style={
                                            styles.loginButtonText
                                        }
                                    >
                                        Sign In
                                    </Text>

                                    <Ionicons
                                        name="arrow-forward"
                                        size={20}
                                        color="#fff"
                                    />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* ==================================
                        Register
                    ================================== */}

                    <View
                        style={
                            styles.registerContainer
                        }
                    >
                        <Text
                            style={
                                styles.registerLabel
                            }
                        >
                            Don't have an account?
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate(
                                    'Signup'
                                )
                            }
                        >
                            <Text
                                style={
                                    styles.registerLink
                                }
                            >
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ==================================
                        Bottom
                    ================================== */}

                    <View
                        style={
                            styles.secureContainer
                        }
                    >
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={16}
                            color="#6B7280"
                        />

                        <Text
                            style={
                                styles.secureText
                            }
                        >
                            Your information is secure
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    keyboard: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 30,
    },

    // =========================================
    // Header
    // =========================================

    header: {
        alignItems: 'center',
        marginBottom: 38,
    },

    logoContainer: {
        width: 82,
        height: 82,
        borderRadius: 24,
        backgroundColor: '#F1F5FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },

    logo: {
        width: 62,
        height: 62,
        borderRadius: 16,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },

    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 21,
    },

    // =========================================
    // Form
    // =========================================

    form: {
        width: '100%',
    },

    fieldContainer: {
        marginBottom: 22,
    },

    labelRow: {
        flexDirection: 'row',
        justifyContent:
            'space-between',
        alignItems: 'center',
        marginBottom: 9,
    },

    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 9,
    },

    forgotText: {
        fontSize: 13,
        fontWeight: '600',
        color: PRIMARY,
    },

    inputWrapper: {
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        backgroundColor: '#F9FAFB',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },

    inputWrapperFocused: {
        borderColor: PRIMARY,
        backgroundColor: '#FFFFFF',
        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 2,
    },

    input: {
        flex: 1,
        height: '100%',
        marginLeft: 12,
        color: '#111827',
        fontSize: 15,
        paddingVertical: 0,
    },

    eyeButton: {
        padding: 5,
    },

    // =========================================
    // Login Button
    // =========================================

    loginButton: {
        height: 56,
        borderRadius: 15,
        backgroundColor: PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.22,
        shadowRadius: 10,
        elevation: 5,
    },

    loginButtonDisabled: {
        opacity: 0.7,
    },

    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
        marginRight: 10,
    },

    // =========================================
    // Register
    // =========================================

    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
    },

    registerLabel: {
        fontSize: 14,
        color: '#6B7280',
    },

    registerLink: {
        fontSize: 14,
        fontWeight: '800',
        color: PRIMARY,
        marginLeft: 5,
    },

    // =========================================
    // Security
    // =========================================

    secureContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: 45,
    },

    secureText: {
        marginLeft: 6,
        fontSize: 12,
        color: '#9CA3AF',
    },
});
