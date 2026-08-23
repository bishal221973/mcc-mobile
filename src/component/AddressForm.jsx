import React, { useState } from 'react';
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

const PRIMARY = '#0C3F80';

const createEmptyForm = () => ({
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
});

const Input = ({
    icon,
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
}) => {
    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputContainer}>
                <Ionicons
                    name={icon}
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
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

export default function AddressForm({
    onSuccess,
    address,
    type = 'default',
}) {
    const [addressModalVisible, setAddressModalVisible] =
        useState(false);

    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState(
        createEmptyForm()
    );

    // =========================================
    // Populate form for edit
    // =========================================

    const populateForm = item => {
        if (!item) {
            setFormData(createEmptyForm());
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
    // Open Add Modal
    // =========================================

    const openAddModal = () => {
        setEditMode(false);
        setFormData(createEmptyForm());
        setAddressModalVisible(true);
    };

    // =========================================
    // Open Edit Modal
    // =========================================

    const openEditModal = () => {
        if (!address?.id) {
            return;
        }

        setEditMode(true);
        populateForm(address);
        setAddressModalVisible(true);
    };

    // =========================================
    // Close Modal
    // =========================================

    const closeModal = () => {
        setAddressModalVisible(false);
        setEditMode(false);
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

                country: formData.country?.code ?? 'NP',

                state: formData.state,
                city: formData.city,
                postcode: formData.zipCode,

                phone: formData.telephone,

                default_address: 0,

                vat_id: formData.vatId,
            };

            let response;

            if (editMode && address?.id) {
                // UPDATE
                response = await axios.put(
                    `/customer/addresses/${address.id}`,
                    payload
                );
            } else {
                // CREATE
                response = await axios.post(
                    '/customer/addresses',
                    payload
                );
            }

            console.log(
                editMode
                    ? 'Address updated'
                    : 'Address created',
                response?.data
            );

            closeModal();

            // Refresh parent
            onSuccess?.(response?.data);
        } catch (error) {
            console.log(
                'Address error:',
                error?.response?.data || error
            );

            if (error?.response?.data?.errors) {
                Object.entries(
                    error.response.data.errors
                ).forEach(([field, messages]) => {
                    console.log(
                        `${field}: ${
                            Array.isArray(messages)
                                ? messages.join(', ')
                                : messages
                        }`
                    );
                });
            }
        }
    };

    // =========================================
    // Render Button
    // =========================================

    const renderActionButton = () => {
        // =====================================
        // PROFILE
        // =====================================

        if (type === 'profile') {
            if (address?.id) {
                return (
                    <TouchableOpacity
                        style={styles.profileEditButton}
                        activeOpacity={0.7}
                        onPress={openEditModal}
                    >
                        <Ionicons
                            name="create-outline"
                            size={18}
                            color={PRIMARY}
                        />

                        <Text
                            style={styles.profileEditText}
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>
                );
            }

            return (
                <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.85}
                    onPress={openAddModal}
                >
                    <Ionicons
                        name="add"
                        size={22}
                        color="#fff"
                    />

                    <Text style={styles.addText}>
                        Add New Address
                    </Text>
                </TouchableOpacity>
            );
        }

        // =====================================
        // CHECKOUT / DEFAULT
        // =====================================

        if (address?.id) {
            return (
                <TouchableOpacity
                    style={styles.editButton}
                    activeOpacity={0.7}
                    onPress={openEditModal}
                >
                    <Ionicons
                        name="create-outline"
                        size={16}
                        color={PRIMARY}
                    />

                    <Text style={styles.editText}>
                        Edit
                    </Text>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={styles.button}
                onPress={openAddModal}
                activeOpacity={0.8}
            >
                <Ionicons
                    name="add"
                    size={30}
                    color="#444"
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* =====================================
                ADD / EDIT ACTION
            ===================================== */}

            {renderActionButton()}

            {/* =====================================
                MODAL
            ===================================== */}

            <Modal
                visible={addressModalVisible}
                animationType="fade"
                transparent
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        {/* Modal Header */}

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editMode
                                    ? 'Edit Billing Address'
                                    : 'Add Billing Address'}
                            </Text>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
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
                            contentContainerStyle={
                                styles.scrollContent
                            }
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

                            {/* First / Last Name */}

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

                            {/* State */}

                            {/* <Input
                                icon="map-outline"
                                label="State"
                                value={formData.state}
                                onChangeText={text =>
                                    handleInputChange(
                                        'state',
                                        text
                                    )
                                }
                                placeholder="State"
                            /> */}

                            {/* City */}

                            <Input
                                icon="business-outline"
                                label="City"
                                value={formData.city}
                                onChangeText={text =>
                                    handleInputChange(
                                        'city',
                                        text
                                    )
                                }
                                placeholder="City"
                            />

                            {/* Zip Code */}

                            {/* <Input
                                icon="pin-outline"
                                label="Zip Code"
                                value={formData.zipCode}
                                onChangeText={text =>
                                    handleInputChange(
                                        'zipCode',
                                        text
                                    )
                                }
                                placeholder="Zip Code"
                                keyboardType="numeric"
                            /> */}

                            {/* Telephone */}

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

                            {/* Submit */}

                            <TouchableOpacity
                                style={
                                    styles.submitButton
                                }
                                onPress={handleSubmit}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={
                                        editMode
                                            ? 'checkmark-circle-outline'
                                            : 'save-outline'
                                    }
                                    size={20}
                                    color="#fff"
                                />

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
    container: {
        marginTop: 10,
    },

    // =========================================
    // Default Add Button
    // =========================================

    button: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },

    // =========================================
    // Profile Add Button
    // =========================================

    addButton: {
        position: 'absolute',
        left: 15,
        right: 15,
        bottom: 15,
        height: 52,
        borderRadius: 14,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    addText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 7,
    },

    // =========================================
    // Profile Edit
    // =========================================

    profileEditButton: {
        width: '100%',
        height: 40,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFD',
        marginTop:-10
    },

    profileEditText: {
        marginLeft: 5,
        color: PRIMARY,
        fontSize: 13,
        fontWeight: '700',
    },

    // =========================================
    // Default Edit
    // =========================================

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
        color: PRIMARY,
    },

    // =========================================
    // Modal
    // =========================================

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
        maxHeight: '92%',
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

    scrollContent: {
        paddingBottom: 40,
    },

    // =========================================
    // Form
    // =========================================

    inputWrapper: {
        marginBottom: 10,
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

    inputIcon: {
        marginRight: 10,
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: '#222',
    },

    row: {
        flexDirection: 'row',
    },

    flexField: {
        flex: 1,
    },

    // =========================================
    // Submit
    // =========================================

    submitButton: {
        backgroundColor: PRIMARY,
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
    },
});