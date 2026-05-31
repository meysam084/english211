import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export default function LoginScreen({ navigation }: any) {

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [step, setStep] = useState(1);

  const sendSMS = async (userPhone: string, otpCode: string) => {
    try {
      const response = await axios.post(
        'https://api.sms.ir/v1/send/verify',
        {
          mobile: userPhone,
          templateId: 392243,
          parameters: [{ name: "Code", value: otpCode }]
        },
        {
          headers: {
            'X-API-KEY': 'vyC5ahiR5sLdKby01nq8iCEOvH10mIwt3aG6wvlOGQyDJqMA',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 1) return true;
      return false;

    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const handleSendCode = async () => {

    if (phone.length < 11) {
      Alert.alert("❌ خطا", "شماره موبایل درست نیست");
      return;
    }

    const otp = generateOTP();
    setSentCode(otp);

    const success = await sendSMS(phone, otp);

    if (success) {
      setStep(2);
      Alert.alert("📩 کد ارسال شد", "کد تایید برای شما پیامک شد");
    } else {
      Alert.alert("⚠️ خطا", "ارسال پیامک انجام نشد");
    }
  };

  const handleVerify = () => {

    if (code === sentCode) {
      navigation.replace("MainApp");
    } else {
      Alert.alert("❌ اشتباه", "کد وارد شده صحیح نیست");
    }
  };

  return (

    <LinearGradient
      colors={['#5f2eea', '#7c3aed', '#9333ea']}
      style={styles.container}
    >

      <View style={styles.card}>

        <Text style={styles.title}>
          🚀 ورود به اپ
        </Text>

        <Text style={styles.subtitle}>
          یادگیری انگلیسی رو شروع کن 😎
        </Text>

        {step === 1 && (
          <>
            <TextInput
              placeholder="📱 شماره موبایل"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TouchableOpacity style={styles.button} onPress={handleSendCode}>
              <Text style={styles.buttonText}>ارسال کد ✉️</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <TextInput
              placeholder="🔑 کد تایید"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
              <Text style={styles.buttonText}>ورود 🚀</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={styles.changeNumber}>
                تغییر شماره 📱
              </Text>
            </TouchableOpacity>
          </>
        )}

      </View>

    </LinearGradient>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6d28d9'
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
    color: '#64748b'
  },

  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 15
  },

  button: {
    backgroundColor: '#7c3aed',
    padding: 15,
    borderRadius: 12
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },

  changeNumber: {
    textAlign: 'center',
    marginTop: 15,
    color: '#7c3aed'
  }

});
