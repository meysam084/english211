import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  // مقدار اولیه برای انیمیشن (اندازه)
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // ایجاد انیمیشن تپش (بزرگ و کوچک شدن)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1, // بزرگ شدن
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9, // کوچک شدن
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // انتقال به صفحه اصلی بعد از 3.5 ثانیه
    // توجه: نام 'Home' را با نام صفحه اصلی خود در App.tsx جایگزین کنید (مثلا 'MainTabs' یا 'Home')
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* بخش انیمیشن دار مرکزی */}
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.mascot}>🦉🚀</Text>
        <Text style={styles.titleTitle}>English 21</Text>
      </Animated.View>

      {/* متن پایین صفحه */}
      <View style={styles.footer}>
        <Text style={styles.subtitle}>مجموعه آموزش زبان انگلیسی</Text>
        <Text style={styles.author}>وحید غفروئی</Text>
        <Text style={styles.stars}>✨ 🌟 ✨</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD166', // رنگ زرد/نارنجی شاد و انرژی‌بخش برای کودکان
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    shadowColor: '#EF476F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 50,
  },
  mascot: {
    fontSize: 70,
    marginBottom: 10,
  },
  titleTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#118AB2', // آبی جذاب
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#073B4C',
    marginBottom: 5,
  },
  author: {
    fontSize: 24,
    fontWeight: '900',
    color: '#EF476F', // صورتی/قرمز شاد
    marginBottom: 10,
  },
  stars: {
    fontSize: 20,
  },
});
