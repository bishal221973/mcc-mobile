import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PRIMARY = '#0C3F80';

const PleaseLogin = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons
                    name="person-outline"
                    size={55}
                    color={PRIMARY}
                />
            </View>

            <Text style={styles.title}>
                Please Login to Continue
            </Text>

            <Text style={styles.description}>
                You need to login to your account to
                continue.
            </Text>

            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => {
                    navigation.navigate('Login');
                }}
            >
                <Ionicons
                    name="log-in-outline"
                    size={20}
                    color="#fff"
                />

                <Text style={styles.buttonText}>
                    Login
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.registerButton}
                activeOpacity={0.8}
                onPress={() => {
                    navigation.navigate('Register');
                }}
            >
                <Text style={styles.registerText}>
                    Don't have an account?{' '}
                    <Text style={styles.registerLink}>
                        Register
                    </Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PleaseLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F1F5FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 10,
    },

    description: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 25,
    },

    button: {
        width: '100%',
        height: 48,
        backgroundColor: PRIMARY,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },

    registerButton: {
        marginTop: 18,
    },

    registerText: {
        color: '#6B7280',
        fontSize: 14,
    },

    registerLink: {
        color: PRIMARY,
        fontWeight: '700',
    },
});
