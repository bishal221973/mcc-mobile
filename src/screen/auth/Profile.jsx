import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../component/Header';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Profile = () => {
    const [firstName, setFirstName] = useState('Bishal');
    const [lastName, setLastName] = useState('Chaudhary');
    const [email, setEmail] = useState('bishal@example.com');
    const [phone, setPhone] = useState('+9779800000000');
    const [gender, setGender] = useState('Male');
    const [dob, setDob] = useState('2000-01-01');

    const [image, setImage] = useState(null);

    const handleSave = () => {
        alert('Profile updated successfully!');
        // Call your API here
    };

    const openGallery = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1,
            },
            response => {
                if (response.didCancel) return;

                if (response.assets) {
                    setImage(response.assets[0].uri);
                }
            },
        );
    };

    const openCamera = () => {
        launchCamera(
            {
                mediaType: 'photo',
                cameraType: 'front',
                quality: 1,
            },
            response => {
                if (response.didCancel) return;

                if (response.assets) {
                    setImage(response.assets[0].uri);
                }
            },
        );
    };

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
  );
};
    return (
        <>
            <Header />
            <SafeAreaView style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>My Profile</Text>
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

                        <TouchableOpacity onPress={choosePhoto} style={styles.cameraButton}>
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
                        <Text style={styles.label}>First Name</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>

                        {/* Last Name */}
                        <Text style={styles.label}>Last Name</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>

                        {/* Email */}
                        <Text style={styles.label}>Email Address</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {/* Phone */}
                        <Text style={styles.label}>Phone Number</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="call-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        {/* Gender */}
                        <Text style={styles.label}>Gender</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="male-female-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Gender"
                                value={gender}
                                onChangeText={setGender}
                            />
                        </View>

                        {/* Date of Birth */}
                        <Text style={styles.label}>Date of Birth</Text>

                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                value={dob}
                                onChangeText={setDob}
                            />
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}>
                            <Ionicons
                                name="save-outline"
                                size={20}
                                color="#fff"
                            />

                            <Text style={styles.saveText}>
                                Save Changes
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
        right: '35%',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0C3F80',
        justifyContent: 'center',
        alignItems: 'center',
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

    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
});