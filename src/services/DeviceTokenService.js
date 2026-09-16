import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
    getMessaging,
    registerDeviceForRemoteMessages,
    getToken,
} from '@react-native-firebase/messaging';

import axios from './axios';

const DeviceTokenService = {

    /**
     * Get current FCM token
     */
    async getFCMToken() {
        try {
            const messagingInstance = getMessaging();

            await registerDeviceForRemoteMessages(
                messagingInstance
            );

            const token = await getToken(
                messagingInstance
            );

            console.log('FCM Token:', token);

            return token;

        } catch (error) {
            console.log(
                'FCM token error:',
                error
            );

            return null;
        }
    },


    /**
     * Save device token to server
     */
    async updateDeviceToken() {
        try {

            const authToken =
                await AsyncStorage.getItem('token');

            if (!authToken) {
                console.log(
                    'No customer auth token. Device token not saved.'
                );

                return false;
            }


            const fcmToken =
                await this.getFCMToken();

            if (!fcmToken) {
                return false;
            }


            console.log(
                'Checking device token in database...'
            );


            /**
             * First check existing token
             *
             * Your Laravel API should return:
             *
             * {
             *     saved: true,
             *     device_token: "..."
             * }
             */
            const checkResponse = await axios.get(
                '/customer/device-token',
                {
                    headers: {
                        Authorization:
                            `Bearer ${authToken}`,

                        Accept:
                            'application/json',
                    },
                }
            );


            const savedToken =
                checkResponse?.data?.device_token;


            console.log(
                'Token saved in DB:',
                savedToken
            );


            /**
             * Token already exists
             */
            if (savedToken === fcmToken) {

                console.log(
                    'FCM token already exists in database.'
                );

                return true;
            }


            /**
             * Token doesn't exist
             * OR token has changed
             */
            console.log(
                'Saving new FCM token...'
            );


            const response = await axios.post(
                '/customer/device-token',
                {
                    device_token: fcmToken,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${authToken}`,

                        Accept:
                            'application/json',

                        'Content-Type':
                            'application/json',
                    },
                }
            );


            console.log(
                'Device token saved:',
                response.data
            );


            return true;

        } catch (error) {

            console.log(
                'Device token error:',
                error.response?.status,
                error.response?.data ||
                error.message
            );

            return false;
        }
    },
};

export default DeviceTokenService;