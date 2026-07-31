// services/cartService.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "./axios"
const CART_KEY = 'cart';

class CartService {
    // Get local cart
    async getLocalCart() {
        const cart = await AsyncStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }

    // Save local cart
    async saveLocalCart(cart) {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    // Add product locally
    async addToLocalCart(product, quantity = 1) {
        const cart = await this.getLocalCart();
        const index = cart.findIndex(item => item.product_id === product.product_id);

        if (index > -1) {
            cart[index].quantity += quantity;
        } else {
            cart.push({
                product_id: product.product_id,
                quantity,
            });
        }

        await this.saveLocalCart(cart);
    }

    // Remove local item
    async removeLocalItem(productId) {
        const cart = await this.getLocalCart();
        const updated = cart.filter(i => i.product_id !== productId);
        await this.saveLocalCart(updated);
    }

    // Clear local cart
    async clearLocalCart() {
        await AsyncStorage.removeItem(CART_KEY);
    }

    // Fetch server cart
    async getServerCart() {
        console.log("Callaed Live")
        const res = await api.get('/customer/cart');
        console.log(res)

        return res.data.data;
    }

    // Add item to server
    async addServerItem(productId, quantity) {
        return api.post('/customer/cart/add', {
            product_id: productId,
            quantity,
            is_buy_now: 0,
        });
    }

    // Sync local cart to server
    async syncCart() {

        console.log("Called");
        const localCart = await this.getLocalCart();

        if (!localCart.length) return;

        for (const item of localCart) {
            try {
                await this.addServerItem(item.product_id, item.quantity);
            } catch (e) {
                console.log('Sync failed', item.product_id);
            }
        }

        await this.clearLocalCart();
    }

    // Get current cart
    async getCart() {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            return this.getServerCart();
        }

        return this.getLocalCart();
    }
}

export default new CartService();