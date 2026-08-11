const listeners = new Set();

const CartEvents = {
    subscribe(callback) {
        listeners.add(callback);

        return () => {
            listeners.delete(callback);
        };
    },

    emit(cart) {
        listeners.forEach(callback => callback(cart));
    },
};

export default CartEvents;