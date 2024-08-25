import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import AuthService from '../services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  BORDERRADIUS,
} from '../theme/theme';

interface AuthScreenProps {
  navigation: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [validationPhone, setValidationPhone] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          // Redirect to HomeScreen if user data exists
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('Error checking auth status', error);
      }
    };

    checkAuthStatus();
  }, [navigation]);

  const handleSendOTP = async () => {
    setIsLoading(true);

    if (!phone || !name || !age || !gender) {
      Alert.alert('Error', 'Please fill out all fields');
      setIsLoading(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      Alert.alert('Error', 'Invalid phone number format');
      setIsLoading(false);
      return;
    }

    if (isNaN(Number(age)) || Number(age) < 0 || Number(age) > 150) {
      Alert.alert('Error', 'Invalid age. Please enter a valid number.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthService.sendLoginOTP(phone, name, age, gender);

      console.log("response",response);        
      if (response.status === 200) {
        setValidationPhone(true);
      } else {
        Alert.alert('Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      const response = await AuthService.verifyLoginOTP(phone, code);
      if (response.status === 200) {
        // Store user information in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify({ phone, name, age, gender }));
        setIsLoading(false);
        navigation.navigate('Home');
      } else {
        setIsLoading(false);
        Alert.alert('Wrong OTP');
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.AuthContainer}>
        <Image source={require('../assets/logo.png')} style={styles.Logo} />
        <Text style={styles.Quote}>Your Salon Guide at your pocket</Text>
        <View style={styles.PhoneContainer}>
          {!validationPhone ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                onChangeText={setPhone}
                value={phone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                onChangeText={setName}
                value={name}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                keyboardType="numeric"
                onChangeText={setAge}
                value={age}
              />
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
              <TouchableOpacity onPress={handleSendOTP}>
                <View style={styles.AuthButton}>
                  <Text style={styles.Authenticate}>
                    {isLoading ? 'Processing...' : 'Send OTP'}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.OtpText}>OTP sent to your phone.</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                onChangeText={setCode}
                value={code}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={handleVerifyOTP}>
                <View style={styles.AuthButton}>
                  <Text style={styles.Authenticate}>
                    {isLoading ? 'Processing...' : 'Verify OTP'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setValidationPhone(false);
                }}>
                <Text style={styles.Back}>Back</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  AuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_30,
  },
  Logo: {
    height: 80,
    width: 80,
    marginBottom: SPACING.space_20,
  },
  Quote: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_medium,
    marginBottom: SPACING.space_36,
    textAlign: 'center',
  },
  PhoneContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  pickerContainer: {
    width: '100%',
    height: 56,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryWhiteHex,
    marginTop: SPACING.space_8,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  AuthButton: {
    width: '100%',
    height: 56,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryOrangeHex,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.space_24,
    shadowColor: COLORS.primaryOrangeHex,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  Authenticate: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_semibold,
  },
  input: {
    width: '100%',
    height: 56,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryWhiteHex,
    paddingHorizontal: SPACING.space_12,
    marginTop: SPACING.space_8,
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_regular,
  },
  OtpText: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_medium,
    textAlign: 'center',
    marginVertical: SPACING.space_16,
  },
  Back: {
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_medium,
    textAlign: 'center',
    marginTop: SPACING.space_24,
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;
