import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Input from "./Input"
export default function AddForm() {
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
        saveAddress: false,
    });

    const handleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const toggleCheckbox = () => {
        setFormData({ ...formData, saveAddress: !formData.saveAddress });
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('Submitted Data:', formData);
    };

    return (
        <ScrollView>
            <View style={{ height: 650 }}
            >
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                >



                    {/* Form Fields */}
                    
                </KeyboardAvoidingView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
    },
    headerRow: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 8,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212121',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flexField: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#424242',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#BDBDBD',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        color: '#212121',
        marginBottom: 16,
        // Android material elevation/shadow shadow
        elevation: 1,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#757575',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        borderColor: '#2196F3',
        backgroundColor: '#2196F3',
    },
    checkboxCheckmark: {
        width: 10,
        height: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#212121',
    },
    submitButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 20,
        elevation: 2,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
