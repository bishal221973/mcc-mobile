import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const InputField = ({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  autoCapitalize = 'sentences',
  autoCorrect = false,
  maxLength,
}) => {
  return (
    <View style={styles.fieldContainer}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          !editable && styles.disabledContainer,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color="#0C3F80"
          style={styles.icon}
        />

        <TextInput
          style={[
            styles.textInput,
            multiline && styles.multilineInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
        />
      </View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    paddingHorizontal: 10,
    minHeight: 40,
  },

  multilineContainer: {
    alignItems: 'flex-start',
    paddingTop: 12,
  },

  icon: {
    marginRight: 10,
    marginTop: 2,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    paddingVertical: 12,
  },

  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  disabledContainer: {
    backgroundColor: '#F5F5F5',
  },
});