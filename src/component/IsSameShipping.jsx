import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const IsSameShipping = ({ value, onChange }) => {
  const [checked, setChecked] = useState(value ?? true);

  const toggleCheck = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={toggleCheck}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
        ]}
      >
        {checked && (
          <Ionicons
            name="checkmark"
            size={16}
            color="#fff"
          />
        )}
      </View>

      <Text style={styles.label}>
        Use same address for shipping ?
      </Text>
    </TouchableOpacity>
  );
};

export default IsSameShipping;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#0C3F80',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },

  checkboxChecked: {
    backgroundColor: '#0C3F80',
  },

  label: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
});