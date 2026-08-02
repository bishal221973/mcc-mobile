import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const Input = ({
    icon,
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
}) => {
    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputContainer}>
                <Ionicons
                    name={icon}
                    size={20}
                    color="#666"
                    style={{ marginRight: 10 }}
                />

                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    placeholderTextColor="#999"
                />
            </View>
        </View>
    );
};

export default function Checkout() {
    const [addressModalVisible, setAddressModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        vatId: '',
        streetAddress: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        telephone: '',
    });

    const handleInputChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    const handleSubmit = () => {
        console.log(formData);
        setAddressModalVisible(false);
    };

    return (
        <View style={{ padding: 16 }}>
            <Text style={styles.heading}>Billing Address</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => setAddressModalVisible(true)}>
                <Ionicons name="add" size={30} color="#444" />
            </TouchableOpacity>

            <Modal
                visible={addressModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setAddressModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setAddressModalVisible(false)}
                        >
                            <Ionicons name="close" size={28} color="#444" />
                        </TouchableOpacity>

                        <KeyboardAwareScrollView
                            enableOnAndroid
                            extraScrollHeight={120}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 40,
                            }}
                        >

                            <Input
                                icon="business-outline"
                                label="Company Name"
                                value={formData.companyName}
                                onChangeText={(text) =>
                                    handleInputChange('companyName', text)
                                }
                                placeholder="Company Name"
                            />

                            <View style={styles.row}>
                                <View style={styles.flexField}>
                                    <Input
                                        icon="person-outline"
                                        label="First Name"
                                        value={formData.firstName}
                                        onChangeText={(text) =>
                                            handleInputChange('firstName', text)
                                        }
                                        placeholder="First Name"
                                    />
                                </View>

                                <View style={[styles.flexField, { marginLeft: 10 }]}>
                                    <Input
                                        icon="person-outline"
                                        label="Last Name"
                                        value={formData.lastName}
                                        onChangeText={(text) =>
                                            handleInputChange('lastName', text)
                                        }
                                        placeholder="Last Name"
                                    />
                                </View>
                            </View>

                            <Input
                                icon="mail-outline"
                                label="Email"
                                value={formData.email}
                                onChangeText={(text) =>
                                    handleInputChange('email', text)
                                }
                                placeholder="Email"
                                keyboardType="email-address"
                            />

                            <Input
                                icon="card-outline"
                                label="VAT ID"
                                value={formData.vatId}
                                onChangeText={(text) =>
                                    handleInputChange('vatId', text)
                                }
                                placeholder="VAT ID"
                            />

                            <Input
                                icon="location-outline"
                                label="Street Address"
                                value={formData.streetAddress}
                                onChangeText={(text) =>
                                    handleInputChange('streetAddress', text)
                                }
                                placeholder="Street Address"
                            />

                            <Input
                                icon="earth-outline"
                                label="Country"
                                value={formData.country}
                                onChangeText={(text) =>
                                    handleInputChange('country', text)
                                }
                                placeholder="Country"
                            />

                            <View style={styles.row}>
                                <View style={styles.flexField}>
                                    <Input
                                        icon="map-outline"
                                        label="State"
                                        value={formData.state}
                                        onChangeText={(text) =>
                                            handleInputChange('state', text)
                                        }
                                        placeholder="State"
                                    />
                                </View>

                                <View style={[styles.flexField, { marginLeft: 10 }]}>
                                    <Input
                                        icon="business-outline"
                                        label="City"
                                        value={formData.city}
                                        onChangeText={(text) =>
                                            handleInputChange('city', text)
                                        }
                                        placeholder="City"
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.flexField}>
                                    <Input
                                        icon="pin-outline"
                                        label="Zip Code"
                                        value={formData.zipCode}
                                        onChangeText={(text) =>
                                            handleInputChange('zipCode', text)
                                        }
                                        placeholder="Zip Code"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={[styles.flexField, { marginLeft: 10 }]}>
                                    <Input
                                        icon="call-outline"
                                        label="Telephone"
                                        value={formData.telephone}
                                        onChangeText={(text) =>
                                            handleInputChange('telephone', text)
                                        }
                                        placeholder="Telephone"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitButtonText}>
                                    Save Billing Address
                                </Text>
                            </TouchableOpacity>

                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginBottom: 15,
    },

    button: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 20,
        paddingTop: 15,
        maxHeight: '90%',
    },

    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },

    row: {
        flexDirection: 'row',
    },

    flexField: {
        flex: 1,
    },

    label: {
        marginBottom: 6,
        color: '#333',
        fontWeight: '600',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        height: 50,
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: '#222',
    },

    submitButton: {
        backgroundColor: '#1976D2',
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 20,
    },

    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
    },
});