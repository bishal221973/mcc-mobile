// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from "./axios"
// import { Alert } from 'react-native';

// const CART_KEY = 'cart';

// class CartService {
//     async getLocalCart() {
//         const cart = await AsyncStorage.getItem(CART_KEY);
//         return cart ? JSON.parse(cart) : [];
//     }

//     async saveLocalCart(cart) {
//         await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
//     }

//     async addToLocalCart(product, quantity = 1) {
//         const cart = await this.getLocalCart();
//         const index = cart.findIndex(item => item.product_id === product.product_id);

//         if (index > -1) {
//             cart[index].quantity += quantity;
//         } else {
//             cart.push({
//                 product: product,
//                 quantity,
//             });
//         }

//         await this.saveLocalCart(cart);
//     }

//     async removeLocalItem(productId) {
//         const cart = await this.getLocalCart();
//         const updated = cart.filter(i => i.product_id !== productId);
//         await this.saveLocalCart(updated);
//     }

//     async clearLocalCart() {
//         await AsyncStorage.removeItem(CART_KEY);
//     }

//     async getServerCart() {
//         try {
//              const token = await AsyncStorage.getItem('token');
//              console.log(token)
//             const res = await api.get('/customer/cart');
//             console.log("...........................")
//             console.log(res)
//             console.log("...........................")

//             return res.data.data;
//         } catch (error) {
//             console.log("/////////////////////////////////////")
//             console.log(error)
//             console.log("/////////////////////////////////////")
//         }
//     }


//     async addServerItem(productId, quantity) {
//     try {
//         const response = await api.post(
//             `/customer/cart/add/${productId?.product_id}`,
//             {
//                 product_id:Number(productId?.product_id),
//                 quantity,
//                 is_buy_now: 0,
//             }
//         );

        
//         return response.data;
//     } catch (error) {
//         console.log("Status:", error.response?.status);
//         console.log("Data:", error.response?.data);
//         console.log("Message:", error.message);

//     }
// }

//     async syncCart() {

//         const localCart = await this.getLocalCart();

//         if (!localCart.length) return;

//         for (const item of localCart) {
//             try {
//                 await this.addServerItem(item.product_id, item.quantity);
//             } catch (e) {
//                 console.log('Sync failed', item.product_id);
//             }
//         }

//     }

//     async getCart() {
//         const token = await AsyncStorage.getItem('token');
        
//         if (token) {
//             return this.getServerCart();
//         }

//         return this.getLocalCart();
//     }
// }

// export default new CartService();

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './axios';

const CART_CHANGED = 'cart_changed';

const CartService = {
    async getLocalCart() {
        const cart = await AsyncStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    async saveLocalCart(cart) {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));

        // Notify listeners
        this.emitCartChanged();
    },

    async addToLocalCart(product) {
        const cart = await this.getLocalCart();

        const index = cart.findIndex(
            item => item.product_id === product.product_id
        );

        if (index !== -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
            });
        }

        await this.saveLocalCart(cart);
    },

    async removeLocalItem(productId) {
        const cart = await this.getLocalCart();

        const updatedCart = cart.filter(
            item => item.product_id !== productId
        );

        await this.saveLocalCart(updatedCart);
    },

    // -----------------------------
    // Cart change event
    // -----------------------------

    listeners: [],

    subscribe(listener) {
        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter(
                item => item !== listener
            );
        };
    },

    emitCartChanged() {
        this.listeners.forEach(listener => listener());
    },

    async getServerCart() {
        const response = await axios.get('/customer/cart');

        return response.data?.data || response.data;
    },

    async syncCart() {
        // your existing sync logic
    },
};

export default CartService;