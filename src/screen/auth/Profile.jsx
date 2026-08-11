import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Header from '../../component/Header';
import {
    launchCamera,
    launchImageLibrary,
} from 'react-native-image-picker';
import axios from '../../services/axios';

const Profile = () => {
    const [customer, setCustomer] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');

    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Fetch Customer Profile
    |--------------------------------------------------------------------------
    */
    const fetchProfile = async () => {
        try {
            setLoading(true);

            const response = await axios.get('/customer/get');

            const data = response?.data?.data;

            if (!data) {
                throw new Error('Customer data not found');
            }

            setCustomer(data);

            setFirstName(data?.first_name || '');
            setLastName(data?.last_name || '');
            setEmail(data?.email || '');
            setPhone(data?.phone || '');
            setGender(data?.gender || '');

            // Bagisto may return a datetime.
            // Convert it to YYYY-MM-DD.
            setDob(
                data?.date_of_birth
                    ? String(data.date_of_birth).substring(0, 10)
                    : ''
            );

            /*
             * Use the image URL returned by your API if available.
             */
            if (data?.image_url) {
                setImage(data.image_url);
            } else if (data?.image) {
                setImage(data.image);
            }
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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Save Profile
    |--------------------------------------------------------------------------
    */
    const handleSave = async () => {
        if (!customer) {
            Toast.show({
                type: 'error',
                text1: 'Profile Not Loaded',
                text2: 'Please wait for your profile to load.',
            });

            return;
        }

        if (!firstName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'First Name Required',
                text2: 'Please enter your first name.',
            });

            return;
        }

        if (!lastName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Last Name Required',
                text2: 'Please enter your last name.',
            });

            return;
        }

        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Email Required',
                text2: 'Please enter your email address.',
            });

            return;
        }

        if (!dob.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Date of Birth Required',
                text2: 'Please enter your date of birth.',
            });

            return;
        }

        try {
            setSaving(true);

            const response = await axios.put(
                '/customer/profile',
                {
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    gender: gender || '',
                    date_of_birth: dob.trim(),
                }
            );

            /*
            |--------------------------------------------------------------------------
            | Update local customer
            |--------------------------------------------------------------------------
            */
            setCustomer(prev => ({
                ...prev,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                gender: gender || '',
                date_of_birth: dob.trim(),
            }));

            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your profile has been updated successfully.',
            });
        } catch (error) {
            console.log(
                'Update profile error:',
                error?.response?.data || error
            );

            const errors = error?.response?.data?.errors;

            let message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'Unable to update your profile.';

            /*
            |--------------------------------------------------------------------------
            | Bagisto Validation Errors
            |--------------------------------------------------------------------------
            */
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
                text1: 'Update Failed',
                text2: message,
            });
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Gallery
    |--------------------------------------------------------------------------
    */
    const openGallery = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
            },
            response => {
                if (response.didCancel) {
                    return;
                }

                if (response.errorCode) {
                    Toast.show({
                        type: 'error',
                        text1: 'Gallery Error',
                        text2:
                            response.errorMessage ||
                            'Unable to open gallery.',
                    });

                    return;
                }

                const asset = response?.assets?.[0];

                if (asset?.uri) {
                    setImage(asset.uri);
                }
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Camera
    |--------------------------------------------------------------------------
    */
    const openCamera = () => {
        launchCamera(
            {
                mediaType: 'photo',
                cameraType: 'front',
                quality: 0.8,
            },
            response => {
                if (response.didCancel) {
                    return;
                }

                if (response.errorCode) {
                    Toast.show({
                        type: 'error',
                        text1: 'Camera Error',
                        text2:
                            response.errorMessage ||
                            'Unable to open camera.',
                    });

                    return;
                }

                const asset = response?.assets?.[0];

                if (asset?.uri) {
                    setImage(asset.uri);
                }
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Choose Photo
    |--------------------------------------------------------------------------
    */
    const choosePhoto = () => {
        Alert.alert(
            'Profile Photo',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: openCamera,
                },
                {
                    text: 'Gallery',
                    onPress: openGallery,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            {
                cancelable: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */
    if (loading) {
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
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            My Profile
                        </Text>

                        <Text style={styles.headerSubtitle}>
                            Update your personal information
                        </Text>
                    </View>

                    {/* Profile Picture */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                image
                                    ? { uri: image }
                                    : {
                                          uri: 'https://i.pravatar.cc/200?img=12',
                                      }
                            }
                            style={styles.avatar}
                        />

                        <TouchableOpacity
                            onPress={choosePhoto}
                            style={styles.cameraButton}
                        >
                            <Ionicons
                                name="camera"
                                size={18}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Form Card */}
                    <View style={styles.card}>
                        {/* First Name */}
                        <Text style={styles.label}>
                            First Name
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                placeholderTextColor="#999"
                                value={firstName}
                                onChangeText={setFirstName}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Last Name */}
                        <Text style={styles.label}>
                            Last Name
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                placeholderTextColor="#999"
                                value={lastName}
                                onChangeText={setLastName}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Email */}
                        <Text style={styles.label}>
                            Email Address
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {/* Phone */}
                        <Text style={styles.label}>
                            Phone Number
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="call-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        {/* Gender */}
                        <Text style={styles.label}>
                            Gender
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="male-female-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Gender"
                                placeholderTextColor="#999"
                                value={gender}
                                onChangeText={setGender}
                            />
                        </View>

                        {/* Date of Birth */}
                        <Text style={styles.label}>
                            Date of Birth
                        </Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#999"
                                value={dob}
                                onChangeText={setDob}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                saving && styles.buttonDisabled,
                            ]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#fff"
                                />
                            ) : (
                                <Ionicons
                                    name="save-outline"
                                    size={20}
                                    color="#fff"
                                />
                            )}

                            <Text style={styles.saveText}>
                                {saving
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default Profile;

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

    scrollContent: {
        paddingBottom: 40,
    },

    header: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 20,
        elevation: 2,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222',
    },

    headerSubtitle: {
        marginTop: 5,
        color: '#777',
        fontSize: 14,
    },

    avatarContainer: {
        alignItems: 'center',
        marginVertical: 25,
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
    },

    cameraButton: {
        position: 'absolute',
        bottom: 0,
        marginLeft: 85,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0C3F80',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 15,
        padding: 18,
        elevation: 2,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
        marginTop: 15,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        paddingHorizontal: 12,
    },

    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontSize: 15,
        color: '#222',
    },

    saveButton: {
        backgroundColor: '#0C3F80',
        marginTop: 30,
        borderRadius: 10,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
});