import { Alert, AppState } from 'react-native';
import AuthService from './AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';
class AuthMonitor {
    interval = null;
    appStateSubscription = null;
    checking = false;

    start() {
        // Check immediately
       
        this.check();

        // Check when app comes back to foreground
        this.appStateSubscription = AppState.addEventListener(
            'change',
            (nextState) => {
                if (nextState === 'active') {
                    this.check();
                }
            }
        );

        // Check every 5 minutes while app is active
        this.interval = setInterval(() => {
            if (AppState.currentState === 'active') {
                this.check();
            }
        }, 3 * 60 * 1000);
    }

    async check() {
        // Prevent multiple requests at the same time
        if (this.checking) {
            return;
        }
         

        this.checking = true;

        try {
            const valid = await AuthService.isLoggedIn();
            if (!valid) {
                // Alert.alert("ss",valid ? 'asda' : 'l')
                await AsyncStorage.removeItem('token');
            }else{

            }

            console.log(
                valid
                    ? '✅ Token is valid'
                    : '🔴 Token is invalid'
            );
        } catch (error) {
            console.log('Token check failed:', error);
        } finally {
            this.checking = false;
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
    }
}

export default new AuthMonitor();