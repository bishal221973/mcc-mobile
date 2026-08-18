import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "./axios"
import { Alert } from 'react-native';
import CartEvents from './CartEvents';

const CART_KEY = 'cart';

class CartService {
    async getLocalCart() {
        const cart = await AsyncStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }

    async saveLocalCart(cart) {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        CartEvents.emit(cart);
    }

    async addToLocalCart(product, quantity = 1) {
        const cart = await this.getLocalCart();
        const index = cart.findIndex(item => item.product_id === product.product_id);

        if (index > -1) {
            cart[index].quantity += quantity;
        } else {
            cart.push({
                product: product,
                quantity,
            });
        }

        await this.saveLocalCart(cart);
    }

    async removeLocalItem(productId) {
        const cart = await this.getLocalCart();
        const updated = cart.filter(i => i.product_id !== productId);
        await this.saveLocalCart(updated);
    }

    async clearLocalCart() {
        await AsyncStorage.removeItem(CART_KEY);
        CartEvents.emit([]);
    }

    async getServerCart() {
        try {
            const token = await AsyncStorage.getItem('token');
            // console.log(token)
            const res = await api.get('/customer/cart');
            console.log("...........................")
            console.log(res)
            console.log("...........................")

            return res.data.data;
        } catch (error) {
            // console.log("////////////////////////////////////////////")
            // console.log(error)
            // console.log("/////////////////////////////////////")
        }
    }


    async addServerItem(productId, quantity) {
        try {
            const response = await api.post(
                `/customer/cart/add/${productId?.product_id}`,
                {
                    product_id: Number(productId?.product_id),
                    quantity,
                    is_buy_now: 0,
                }
            );

            CartEvents.emit(cart);
            return response.data;
        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);
            console.log("Message:", error.message);

        }
    }

    // async syncCart() {

    //     const localCart = await this.getLocalCart();

    //     // if (!localCart.length) return;
    //     for (const item of localCart) {
    //         try {
    //             // Alert.alert(item?.product?.id.toString());
    //             console.log("/////////////////////////////////////")
    //             console.log(item)
    //             console.log("/////////////////////////////////////")
    //             await this.addServerItem(item?.product?.id, item.quantity);
    //         } catch (e) {
    //             console.log('Sync failed', item.product_id);
    //         }
    //     }
    //     this.clearLocalCart();

    // }

    async syncCart() {
        const localCart = await this.getLocalCart();

        if (!localCart.length) {
            return;
        }

        let allSynced = true;

        for (const item of localCart) {
            try {
                const productId = item?.product?.product?.id.toString();

                console.log("Sync product ID:", productId);
                console.log("Quantity:", item.quantity);

                if (!productId) {
                    console.log("Invalid product ID:", item);
                    allSynced = false;
                    continue;
                }

                await this.addServerItem(
                    {
                        product_id: productId
                    },
                    item.quantity
                );

            } catch (e) {
                allSynced = false;

                console.log(
                    'Sync failed:',
                    item?.product?.product?.id
                );
            }
        }

        // Clear local cart ONLY when everything synced
        if (allSynced) {
            await this.clearLocalCart();
        }
    }
    async getCart() {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            return this.getServerCart();
        }

        return this.getLocalCart();
    }

    async clearAllCart(){
        try {
            const response = await api.delete(
                `/customer/cart/remove`
            );

            return response.data;
        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);
            console.log("Message:", error.message);

        }   
    }
}

export default new CartService();