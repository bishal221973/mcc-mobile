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
    Modal,
    Platform,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Header from '../../component/Header';

import {
    launchCamera,
    launchImageLibrary,
} from 'react-native-image-picker';

import DateTimePicker from '@react-native-community/datetimepicker';

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

    const [showGender, setShowGender] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Gender Options
    |--------------------------------------------------------------------------
    |
    | Bagisto customer gender values are generally:
    | Male / Female / Other
    |
    */
    const genderOptions = [
        {
            label: 'Male',
            value: 'Male',
        },
        {
            label: 'Female',
            value: 'Female',
        },
        {
            label: 'Other',
            value: 'Other',
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Fetch Profile
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

            if (data?.date_of_birth) {
                setDob(
                    String(data.date_of_birth).substring(0, 10)
                );
            } else {
                setDob('');
            }

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
    | Format Date
    |--------------------------------------------------------------------------
    */
    const formatDate = date => {
        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, '0');

        const day = String(
            date.getDate()
        ).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    /*
    |--------------------------------------------------------------------------
    | Convert API DOB to Date
    |--------------------------------------------------------------------------
    */
    const getDobDate = () => {
        if (!dob) {
            return new Date(2000, 0, 1);
        }

        const parts = dob.split('-');

        if (parts.length !== 3) {
            return new Date(2000, 0, 1);
        }

        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        return new Date(year, month, day);
    };

    /*
    |--------------------------------------------------------------------------
    | Date Changed
    |--------------------------------------------------------------------------
    */
    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            setDob(formatDate(selectedDate));
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Save Profile
    |--------------------------------------------------------------------------
    */
    const handleSave = async () => {
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

        if (!gender) {
            Toast.show({
                type: 'error',
                text1: 'Gender Required',
                text2: 'Please select your gender.',
            });
            return;
        }

        if (!dob) {
            Toast.show({
                type: 'error',
                text1: 'Date of Birth Required',
                text2: 'Please select your date of birth.',
            });
            return;
        }

        try {
            setSaving(true);

            await axios.put('/customer/profile', {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                gender: gender,
                date_of_birth: dob,
            });

            setCustomer(prev => ({
                ...prev,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                gender: gender,
                date_of_birth: dob,
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
    | Gender Select
    |--------------------------------------------------------------------------
    */
    const selectGender = value => {
        setGender(value);
        setShowGender(false);
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
            ]
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

                    {/* Profile Image */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                image
                                    ? { uri: image }
                                    : {
                                          uri:
                                              'https://i.pravatar.cc/200?img=12',
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

                    {/* Form */}
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

                        <TouchableOpacity
                            style={styles.selectContainer}
                            onPress={() =>
                                setShowGender(true)
                            }
                        >
                            <View
                                style={
                                    styles.selectLeft
                                }
                            >
                                <Ionicons
                                    name="male-female-outline"
                                    size={20}
                                    color="#666"
                                />

                                <Text
                                    style={[
                                        styles.selectText,
                                        !gender &&
                                            styles.placeholderText,
                                    ]}
                                >
                                    {gender ||
                                        'Select Gender'}
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-down-outline"
                                size={20}
                                color="#777"
                            />
                        </TouchableOpacity>

                        {/* Date of Birth */}
                        <Text style={styles.label}>
                            Date of Birth
                        </Text>

                        <TouchableOpacity
                            style={styles.selectContainer}
                            onPress={() =>
                                setShowDatePicker(true)
                            }
                        >
                            <View
                                style={
                                    styles.selectLeft
                                }
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="#666"
                                />

                                <Text
                                    style={[
                                        styles.selectText,
                                        !dob &&
                                            styles.placeholderText,
                                    ]}
                                >
                                    {dob ||
                                        'Select Date of Birth'}
                                </Text>
                            </View>

                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color="#777"
                            />
                        </TouchableOpacity>

                        {/* Android Date Picker */}
                        {showDatePicker &&
                            Platform.OS === 'android' && (
                                <DateTimePicker
                                    value={getDobDate()}
                                    mode="date"
                                    display="calendar"
                                    maximumDate={
                                        new Date()
                                    }
                                    onChange={
                                        handleDateChange
                                    }
                                />
                            )}

                        {/* iOS Date Picker */}
                        {showDatePicker &&
                            Platform.OS === 'ios' && (
                                <Modal
                                    transparent
                                    animationType="slide"
                                    visible={
                                        showDatePicker
                                    }
                                    onRequestClose={() =>
                                        setShowDatePicker(
                                            false
                                        )
                                    }
                                >
                                    <View
                                        style={
                                            styles.modalOverlay
                                        }
                                    >
                                        <View
                                            style={
                                                styles.dateModal
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.dateModalHeader
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.dateModalTitle
                                                    }
                                                >
                                                    Select Date of Birth
                                                </Text>

                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setShowDatePicker(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <Ionicons
                                                        name="close"
                                                        size={
                                                            24
                                                        }
                                                        color="#333"
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            <DateTimePicker
                                                value={getDobDate()}
                                                mode="date"
                                                display="spinner"
                                                maximumDate={
                                                    new Date()
                                                }
                                                onChange={(
                                                    event,
                                                    selectedDate
                                                ) => {
                                                    if (
                                                        selectedDate
                                                    ) {
                                                        setDob(
                                                            formatDate(
                                                                selectedDate
                                                            )
                                                        );
                                                    }
                                                }}
                                            />

                                            <TouchableOpacity
                                                style={
                                                    styles.dateDoneButton
                                                }
                                                onPress={() =>
                                                    setShowDatePicker(
                                                        false
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.dateDoneText
                                                    }
                                                >
                                                    Done
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            )}

                        {/* Save */}
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                saving &&
                                    styles.buttonDisabled,
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

            {/* Gender Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={showGender}
                onRequestClose={() =>
                    setShowGender(false)
                }
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() =>
                        setShowGender(false)
                    }
                >
                    <View
                        style={styles.genderModal}
                        onStartShouldSetResponder={() =>
                            true
                        }
                    >
                        <Text
                            style={
                                styles.genderModalTitle
                            }
                        >
                            Select Gender
                        </Text>

                        {genderOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.genderOption,
                                    gender ===
                                        option.value &&
                                        styles.selectedGender,
                                ]}
                                onPress={() =>
                                    selectGender(
                                        option.value
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.genderOptionText,
                                        gender ===
                                            option.value &&
                                            styles.selectedGenderText,
                                    ]}
                                >
                                    {option.label}
                                </Text>

                                {gender ===
                                    option.value && (
                                    <Ionicons
                                        name="checkmark"
                                        size={22}
                                        color="#0C3F80"
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
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

    selectContainer: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#DDD',
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        paddingHorizontal: 12,
    },

    selectLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    selectText: {
        fontSize: 15,
        color: '#222',
        marginLeft: 10,
    },

    placeholderText: {
        color: '#999',
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },

    genderModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
    },

    genderModalTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#222',
        marginBottom: 15,
    },

    genderOption: {
        minHeight: 52,
        borderRadius: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    selectedGender: {
        backgroundColor: '#EEF5FF',
    },

    genderOptionText: {
        fontSize: 16,
        color: '#333',
    },

    selectedGenderText: {
        color: '#0C3F80',
        fontWeight: '700',
    },

    dateModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },

    dateModalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    dateModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },

    dateDoneButton: {
        width: '100%',
        backgroundColor: '#0C3F80',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
        marginTop: 10,
    },

    dateDoneText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});