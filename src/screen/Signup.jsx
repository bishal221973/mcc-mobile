import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "../services/axios"
const PRIMARY = '#0C3F80';

const Signup = () => {

  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = () => {
    const first = firstName.trim();
    const last = lastName.trim();
    const mail = email.trim();
    const mobile = phone.trim();

    if (!first) {
      Alert.alert('Required', 'Please enter your first name.');
      return false;
    }

    if (!last) {
      Alert.alert('Required', 'Please enter your last name.');
      return false;
    }

    if (!mail) {
      Alert.alert('Required', 'Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(mail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return false;
    }

    if (!mobile) {
      Alert.alert('Required', 'Please enter your phone number.');
      return false;
    }

    if (!password) {
      Alert.alert('Required', 'Please enter a password.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 6 characters.'
      );
      return false;
    }

    if (!confirmPassword) {
      Alert.alert(
        'Required',
        'Please confirm your password.'
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Passwords do not match.'
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // setLoading(true);

      const response = await axios.post(
        '/customer/register',
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password: password,
          password_confirmation: confirmPassword,
        }
      );

      console.log(
        'Signup response:',
        response.data
      );

      Alert.alert(
        'Account Created',
        'Your account has been created successfully.',
        [
          {
            text: 'Login',
            onPress: () => {
              navigation.replace('Login');
            },
          },
        ]
      );
    } catch (error) {
      console.log(
        'Signup error:',
        error?.response?.data || error
      );

      let message =
        'Unable to create your account. Please try again.';

      const data = error?.response?.data;

      if (data?.message) {
        message = data.message;
      }
      if (data?.errors) {
        const errors = data.errors;

        const firstError = Object.values(errors)
          .flat()
          .find(Boolean);

        if (firstError) {
          message = firstError;
        }
      }

      Alert.alert(
        'Registration Failed',
        message
      );
    }

  }
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View
              style={
                styles.logoContainer
              }
            >
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text
              style={styles.subtitle}
            >
              Sign in to continue to your
              account
            </Text>
          </View>


          {/* ==================================
                                  Form
                              ================================== */}

          <View style={styles.form}>
            {/* ==========First Name========= */}
            <View
              style={
                styles.fieldContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                First Name
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    PRIMARY
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder="Enter first name"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={
                    setFirstName
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                />
              </View>
            </View>

            {/* =========Last Name=========== */}
            <View
              style={
                styles.fieldContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                Last Name
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    PRIMARY
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder="Enter last name"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={
                    setLastName
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                />
              </View>
            </View>

            {/* =========Email=========== */}
            <View
              style={
                styles.fieldContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                Email
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    PRIMARY
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder="Enter first name"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={
                    setEmail
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                />
              </View>
            </View>

            {/* ========Phone============ */}
            <View
              style={
                styles.fieldContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                Phone
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    PRIMARY
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder="Enter first name"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={
                    setPhone
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                />
              </View>
            </View>

            {/* ==========Password========== */}
            <View
              style={
                styles.fieldContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                Password
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    PRIMARY
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder="Enter first name"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={
                    setPassword
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                />
              </View>
            </View>

            {/* ==========Confirm Password======== */}
            <View
              style={
                styles.fieldContainer
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                Confirm Password
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={
                    PRIMARY
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder="Enter first name"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={
                    setConfirmPassword
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                />
              </View>
            </View>

            {/* ===========Button========= */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading &&
                styles.loginButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={
                handleRegister
              }
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.loginButtonText
                    }
                  >
                    Signing in...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.loginButtonText
                    }
                  >
                    Sign In
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#fff"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },

  // =========================================
  // Header
  // =========================================

  header: {
    alignItems: 'center',
    marginBottom: 38,
  },

  logoContainer: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: '#F1F5FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  logo: {
    width: 62,
    height: 62,
    borderRadius: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 21,
  },

  // =========================================
  // Form
  // =========================================

  form: {
    width: '100%',
  },

  fieldContainer: {
    marginBottom: 22,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 9,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY,
  },

  inputWrapper: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  inputWrapperFocused: {
    borderColor: PRIMARY,
    backgroundColor: '#FFFFFF',
    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    color: '#111827',
    fontSize: 15,
    paddingVertical: 0,
  },

  eyeButton: {
    padding: 5,
  },

  // =========================================
  // Login Button
  // =========================================

  loginButton: {
    height: 56,
    borderRadius: 15,
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,

    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },

  // =========================================
  // Register
  // =========================================

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  registerLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  registerLink: {
    fontSize: 14,
    fontWeight: '800',
    color: PRIMARY,
    marginLeft: 5,
  },

  // =========================================
  // Security
  // =========================================

  secureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 45,
  },

  secureText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#9CA3AF',
  },
})