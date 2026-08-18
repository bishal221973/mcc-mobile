import React, { useRef, useState } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../services/axios';

const PRIMARY = '#0C3F80';

const Signup = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================
  // Input Refs
  // =========================================

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // =========================================
  // Validation
  // =========================================

  const validateForm = () => {
    const first = firstName.trim();
    const last = lastName.trim();
    const mail = email.trim();
    const mobile = phone.trim();

    if (!first) {
      Alert.alert(
        'Required',
        'Please enter your first name.',
      );
      firstNameRef.current?.focus();
      return false;
    }

    if (!last) {
      Alert.alert(
        'Required',
        'Please enter your last name.',
      );
      lastNameRef.current?.focus();
      return false;
    }

    if (!mail) {
      Alert.alert(
        'Required',
        'Please enter your email address.',
      );
      emailRef.current?.focus();
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(mail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.',
      );
      emailRef.current?.focus();
      return false;
    }

    if (!mobile) {
      Alert.alert(
        'Required',
        'Please enter your phone number.',
      );
      phoneRef.current?.focus();
      return false;
    }

    if (!password) {
      Alert.alert(
        'Required',
        'Please enter a password.',
      );
      passwordRef.current?.focus();
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 6 characters.',
      );
      passwordRef.current?.focus();
      return false;
    }

    if (!confirmPassword) {
      Alert.alert(
        'Required',
        'Please confirm your password.',
      );
      confirmPasswordRef.current?.focus();
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Passwords do not match.',
      );
      confirmPasswordRef.current?.focus();
      return false;
    }

    return true;
  };

  // =========================================
  // Register
  // =========================================

  const handleRegister = async () => {
    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        '/customer/register',
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          password_confirmation: confirmPassword,
        },
      );

      console.log(
        'Signup response:',
        response.data,
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
        ],
      );
    } catch (error) {
      console.log(
        'Signup error:',
        error?.response?.data || error,
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
        message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 0 : 20
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios'
              ? 'interactive'
              : 'on-drag'
          }
          bounces={false}
        >
          {/* =================================
              Header
          ================================= */}

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>
              Create Account
            </Text>

            <Text style={styles.subtitle}>
              Sign up to get started with your account
            </Text>
          </View>

          {/* =================================
              Form Card
          ================================= */}

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              Personal Information
            </Text>

            <Text style={styles.formSubtitle}>
              Enter your details below
            </Text>

            {/* =================================
                First Name
            ================================= */}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                First Name
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  ref={firstNameRef}
                  style={styles.input}
                  placeholder="Enter your first name"
                  placeholderTextColor="#A1AAB8"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  editable={!loading}
                  onSubmitEditing={() => {
                    lastNameRef.current?.focus();
                  }}
                />
              </View>
            </View>

            {/* =================================
                Last Name
            ================================= */}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Last Name
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  ref={lastNameRef}
                  style={styles.input}
                  placeholder="Enter your last name"
                  placeholderTextColor="#A1AAB8"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  editable={!loading}
                  onSubmitEditing={() => {
                    emailRef.current?.focus();
                  }}
                />
              </View>
            </View>

            {/* =================================
                Email
            ================================= */}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Email Address
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#A1AAB8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  editable={!loading}
                  onSubmitEditing={() => {
                    phoneRef.current?.focus();
                  }}
                />
              </View>
            </View>

            {/* =================================
                Phone
            ================================= */}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Phone Number
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  ref={phoneRef}
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#A1AAB8"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  editable={!loading}
                  onSubmitEditing={() => {
                    passwordRef.current?.focus();
                  }}
                />
              </View>
            </View>

            {/* =================================
                Password
            ================================= */}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Password
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="#A1AAB8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={
                    !showPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  editable={!loading}
                  onSubmitEditing={() => {
                    confirmPasswordRef.current?.focus();
                  }}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowPassword(
                      !showPassword,
                    )
                  }
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      showPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={21}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* =================================
                Confirm Password
            ================================= */}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Confirm Password
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#94A3B8"
                />

                <TextInput
                  ref={confirmPasswordRef}
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#A1AAB8"
                  value={confirmPassword}
                  onChangeText={
                    setConfirmPassword
                  }
                  secureTextEntry={
                    !showConfirmPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  editable={!loading}
                  onSubmitEditing={
                    handleRegister
                  }
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword,
                    )
                  }
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={21}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* =================================
                Password Hint
            ================================= */}

            <View style={styles.passwordHint}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#64748B"
              />

              <Text
                style={
                  styles.passwordHintText
                }
              >
                Password must contain at least
                6 characters
              </Text>
            </View>

            {/* =================================
                Create Account Button
            ================================= */}

            <TouchableOpacity
              style={[
                styles.registerButton,
                loading &&
                  styles.registerButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                  <Text
                    style={styles.buttonText}
                  >
                    Creating Account...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={styles.buttonText}
                  >
                    Create Account
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={21}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* =================================
              Login
          ================================= */}

          <View style={styles.loginContainer}>
            <Text style={styles.loginLabel}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.replace('Login')
              }
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* =================================
              Security
          ================================= */}

          
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 35,
  },

  // =========================================
  // Header
  // =========================================

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,

    shadowColor: '#0C3F80',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  logo: {
    width: 56,
    height: 56,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.6,
  },

  subtitle: {
    marginTop: 7,
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // =========================================
  // Form
  // =========================================

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,

    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  formSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 23,
  },

  // =========================================
  // Fields
  // =========================================

  fieldContainer: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  inputWrapper: {
    height: 54,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 11,
    color: '#111827',
    fontSize: 15,
    paddingVertical: 0,
  },

  eyeButton: {
    padding: 5,
    marginLeft: 5,
  },

  // =========================================
  // Password Hint
  // =========================================

  passwordHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -5,
    marginBottom: 20,
  },

  passwordHintText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    marginLeft: 5,
  },

  // =========================================
  // Register Button
  // =========================================

  registerButton: {
    height: 56,
    borderRadius: 15,
    backgroundColor: PRIMARY,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9,
    elevation: 5,
  },

  registerButtonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },

  // =========================================
  // Login
  // =========================================

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom:50
  },

  loginLabel: {
    color: '#64748B',
    fontSize: 14,
  },

  loginLink: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 5,
  },

  // =========================================
  // Security
  // =========================================

  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  securityText: {
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 5,
  },
});
