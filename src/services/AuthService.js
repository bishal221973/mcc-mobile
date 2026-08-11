import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
const CUSTOMER_KEY = 'customer';

class AuthService {
    async getToken() {
        return await AsyncStorage.getItem(TOKEN_KEY);
    }

    async saveAuth(token, customer = null) {
        await AsyncStorage.setItem(TOKEN_KEY, token);

        if (customer) {
            await AsyncStorage.setItem(
                CUSTOMER_KEY,
                JSON.stringify(customer)
            );
        }
    }

    async logout() {
        await AsyncStorage.multiRemove([
            TOKEN_KEY,
            CUSTOMER_KEY,
        ]);
    }

    async isLoggedIn() {
        const token = await this.getToken();

        if (!token) {
            return false;
        }

        try {
            await api.get('/customer/profile');

            return true;
        } catch (error) {
            if (error.response?.status === 401) {
                await this.logout();
                return false;
            }

            // Network/server error — don't assume the token is invalid
            return false;
        }
    }
}

export default new AuthService();