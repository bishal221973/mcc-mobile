import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SelectCountry from './SelectCountry';
import axios from '../services/axios';

const emptyForm = {
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    vatId: '',
    streetAddress: '',
    country: {
        id: 158,
        code: 'NP',
        name: 'Nepal',
    },
    state: '',
    city: '',
    zipCode: '',
    telephone: '',
};

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
                    value={value ?? ''}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    placeholderTextColor="#999"
                />
            </View>
        </View>
    );
};

export default function Checkout({
    onSuccess,
    address,
}) {
    const [addressModalVisible, setAddressModalVisible] =
        useState(false);

    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState(emptyForm);

    // =========================================
    // Convert Address -> Form
    // =========================================

    const populateForm = (item) => {
        if (!item) {
            setFormData(emptyForm);
            return;
        }

        setFormData({
            companyName: item.company_name ?? '',
            firstName: item.first_name ?? '',
            lastName: item.last_name ?? '',
            email: item.email ?? '',
            vatId: item.vat_id ?? '',

            streetAddress: Array.isArray(item.address)
                ? item.address.join(', ')
                : item.address ?? '',

            country: {
                id: item.country_id ?? 158,
                code: item.country ?? 'NP',
                name: item.country_name ?? 'Nepal',
            },

            state: item.state ?? '',
            city: item.city ?? '',
            zipCode: item.postcode ?? '',
            telephone: item.phone ?? '',
        });
    };

    // =========================================
    // Open Add
    // =========================================

    const openAddModal = () => {
        setEditMode(false);
        setFormData(emptyForm);
        setAddressModalVisible(true);
    };

    // =========================================
    // Open Edit
    // =========================================

    const openEditModal = () => {
        setEditMode(true);
        populateForm(address);
        setAddressModalVisible(true);
    };

    // =========================================
    // Input Change
    // =========================================

    const handleInputChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    // =========================================
    // Submit
    // =========================================

    const handleSubmit = async () => {
        try {
            const payload = {
                company_name: formData.companyName,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                address: [formData.streetAddress],
                country: formData.country?.code,
                state: formData.state,
                city: formData.city,
                postcode: formData.zipCode,
                phone: formData.telephone,
                default_address: 0,
                vat_id: formData.vatId,
            };

            let response;

            if (editMode && address?.id) {
                // =====================================
                // UPDATE
                // =====================================

                response = await axios.put(
                    `/customer/addresses/${address.id}`,
                    payload
                );
            } else {
                // =====================================
                // CREATE
                // =====================================

                response = await axios.post(
                    '/customer/addresses',
                    payload
                );
            }

            console.log(
                editMode
                    ? 'Address updated:'
                    : 'Address created:',
                response.data
            );

            setAddressModalVisible(false);

            onSuccess?.(response.data);
        } catch (error) {
            console.log(
                'Status:',
                error.response?.status
            );

            console.log(
                'Response:',
                JSON.stringify(
                    error.response?.data,
                    null,
                    2
                )
            );

            if (error.response?.data?.errors) {
                Object.entries(
                    error.response.data.errors
                ).forEach(([field, messages]) => {
                    console.log(
                        `${field}: ${messages.join(', ')}`
                    );
                });
            }
        }
    };

    return (
        <View style={{ marginTop: 10 }}>

            {/* =====================================
                ADD / EDIT BUTTON
            ===================================== */}

            {address?.id ? (
                <TouchableOpacity
                    style={styles.editButton}
                    activeOpacity={0.7}
                    onPress={openEditModal}
                >
                    <Ionicons
                        name="create-outline"
                        size={16}
                        color="#0C3F80"
                    />

                    <Text style={styles.editText}>
                        Edit
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.button}
                    onPress={openAddModal}
                >
                    <Ionicons
                        name="add"
                        size={30}
                        color="#444"
                    />
                </TouchableOpacity>
            )}

            {/* =====================================
                MODAL
            ===================================== */}

            <Modal
                visible={addressModalVisible}
                animationType="fade"
                transparent
                onRequestClose={() =>
                    setAddressModalVisible(false)
                }
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        {/* Header */}

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editMode
                                    ? 'Edit Billing Address'
                                    : 'Add Billing Address'}
                            </Text>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() =>
                                    setAddressModalVisible(
                                        false
                                    )
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={26}
                                    color="#444"
                                />
                            </TouchableOpacity>
                        </View>

                        <KeyboardAwareScrollView
                            enableOnAndroid
                            extraScrollHeight={120}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 40,
                            }}
                        >

                            {/* Company */}

                            <Input
                                icon="business-outline"
                                label="Company Name"
                                value={
                                    formData.companyName
                                }
                                onChangeText={text =>
                                    handleInputChange(
                                        'companyName',
                                        text
                                    )
                                }
                                placeholder="Company Name"
                            />

                            {/* First + Last */}

                            <View style={styles.row}>
                                <View
                                    style={
                                        styles.flexField
                                    }
                                >
                                    <Input
                                        icon="person-outline"
                                        label="First Name"
                                        value={
                                            formData.firstName
                                        }
                                        onChangeText={text =>
                                            handleInputChange(
                                                'firstName',
                                                text
                                            )
                                        }
                                        placeholder="First Name"
                                    />
                                </View>

                                <View
                                    style={[
                                        styles.flexField,
                                        {
                                            marginLeft: 10,
                                        },
                                    ]}
                                >
                                    <Input
                                        icon="person-outline"
                                        label="Last Name"
                                        value={
                                            formData.lastName
                                        }
                                        onChangeText={text =>
                                            handleInputChange(
                                                'lastName',
                                                text
                                            )
                                        }
                                        placeholder="Last Name"
                                    />
                                </View>
                            </View>

                            {/* Email */}

                            <Input
                                icon="mail-outline"
                                label="Email"
                                value={formData.email}
                                onChangeText={text =>
                                    handleInputChange(
                                        'email',
                                        text
                                    )
                                }
                                placeholder="Email"
                                keyboardType="email-address"
                            />

                            {/* VAT */}

                            <Input
                                icon="card-outline"
                                label="VAT ID"
                                value={formData.vatId}
                                onChangeText={text =>
                                    handleInputChange(
                                        'vatId',
                                        text
                                    )
                                }
                                placeholder="VAT ID"
                            />

                            {/* Street */}

                            <Input
                                icon="location-outline"
                                label="Street Address"
                                value={
                                    formData.streetAddress
                                }
                                onChangeText={text =>
                                    handleInputChange(
                                        'streetAddress',
                                        text
                                    )
                                }
                                placeholder="Street Address"
                            />

                            {/* Country */}

                            <SelectCountry
                                value={formData.country}
                                onChange={country =>
                                    setFormData(prev => ({
                                        ...prev,
                                        country,
                                    }))
                                }
                            />

                            {/* City */}

                            <View style={styles.row}>
                                <View
                                    style={
                                        styles.flexField
                                    }
                                >
                                    <Input
                                        icon="business-outline"
                                        label="City"
                                        value={
                                            formData.city
                                        }
                                        onChangeText={text =>
                                            handleInputChange(
                                                'city',
                                                text
                                            )
                                        }
                                        placeholder="City"
                                    />
                                </View>
                            </View>

                            {/* Telephone */}

                            <View style={styles.row}>
                                <View
                                    style={
                                        styles.flexField
                                    }
                                >
                                    <Input
                                        icon="call-outline"
                                        label="Telephone"
                                        value={
                                            formData.telephone
                                        }
                                        onChangeText={text =>
                                            handleInputChange(
                                                'telephone',
                                                text
                                            )
                                        }
                                        placeholder="Telephone"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            {/* Submit */}

                            <TouchableOpacity
                                style={
                                    styles.submitButton
                                }
                                onPress={handleSubmit}
                            >
                                <Text
                                    style={
                                        styles.submitButtonText
                                    }
                                >
                                    {editMode
                                        ? 'Update Billing Address'
                                        : 'Save Billing Address'}
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

    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },

    closeButton: {
        padding: 3,
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

    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 7,
        backgroundColor: '#F1F5FA',
    },

    editText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '700',
        color: '#0C3F80',
    },
});