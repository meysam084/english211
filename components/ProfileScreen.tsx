  
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SvgUri } from 'react-native-svg';
export default function ProfileScreen({ navigation, route }: any) {
  // گرفتن عکس آواتار از پارامترهای ارسالی، اگر نبود یک عکس پیش‌فرض نشان می‌دهد
  const [avatar, setAvatar] = useState(route.params?.updatedAvatar || require('../assets/avatars/boy1.png'));

  // هر بار که از صفحه انتخاب آواتار برمی‌گردیم این کد اجرا می‌شود تا عکس جدید اعمال شود
  useEffect(() => {
    if (route.params?.updatedAvatar) {
      setAvatar(route.params.updatedAvatar);
    }
  }, [route.params?.updatedAvatar]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* بخش آواتار و هدر بالا */}
      <View style={styles.avatarHeader}>
        
        <View style={styles.profileHeader}>
        {/* نمایش آواتار به صورت تصویر */}
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatarImage} resizeMode="contain" />
        </View>
         </View>

        {/* ۴. دستور رفتن به صفحه ساخت آواتار به دکمه اضافه شد */}
         <TouchableOpacity 
           style={styles.changeAvatarBtn} 
           onPress={() => navigation.navigate('AvatarCreator')}
        >
          <Text style={styles.changeAvatarText}>ساخت آواتار من ✏️</Text>
        </TouchableOpacity>

      </View>

      {/* اطلاعات کاربر */}
      <View style={styles.userInfoSection}>
        <Text style={styles.userName}>کاربر قهرمان 🥇</Text>
        <Text style={styles.joinDate}>عضویت: فروردین ۱۴۰۵</Text>
      </View>

      {/* بخش آمار من */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 آمار من</Text>
        
        {/* در بخش statsContainer یا مشابه آن در ProfileScreen */}

<View style={styles.statsGrid}>
  {/* کارت استریک */}
  <TouchableOpacity 
    style={styles.statCard} 
    // نکته: اگر اسم صفحه را در App.tsx فارسی گذاشتید (مثلا 'استریک')، اینجا هم فارسی بنویسید
    onPress={() => navigation.navigate('Streak')} // به جای 'استریک'
  >
    <Text style={styles.statValue}>🔥 3</Text>
    <Text style={styles.statLabel}>روزهای فعال</Text>
  </TouchableOpacity>

  {/* کارت سکه */}
  <TouchableOpacity 
    style={styles.statCard} 
    // نکته: اگر اسم صفحه را در App.tsx فارسی گذاشتید، اینجا همان را بنویسید
 onPress={() => navigation.navigate('Shop')}   // به جای 'فروشگاه'
  >
    <Text style={styles.statValue}>🪙 150</Text>
    <Text style={styles.statLabel}>سکه ها</Text>
  </TouchableOpacity>
</View>

      </View>

      {/* سایر بخش‌ها */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>🚀 سایر بخش‌ها</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>👑 وضعیت اشتراک</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>📥 مدیریت دانلودها</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🔄 بروزرسانی اپلیکیشن</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  avatarHeader: { backgroundColor: '#3b82f6', alignItems: 'center', paddingTop: 50, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarPlaceholder: { width: 120, height: 120, backgroundColor: '#bfdbfe', borderRadius: 60, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  avatarEmoji: { fontSize: 70 },
  editAvatarBtn: { marginTop: 15, backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  editAvatarText: { color: '#fff', fontFamily: 'Vazir', fontWeight: 'bold' },
  userInfoSection: { alignItems: 'center', marginTop: 15, paddingHorizontal: 20 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', fontFamily: 'Vazir' },
  joinDate: { fontSize: 14, color: '#6b7280', fontFamily: 'Vazir', marginTop: 5 },
  statsContainer: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', fontFamily: 'Vazir', textAlign: 'right', marginBottom: 15 },
  statsGrid: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
   profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changeAvatarBtn: {
    marginTop: 10,
    backgroundColor: '#E0F7FA', // یک رنگ پس‌زمینه ملایم
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  changeAvatarText: {
    color: '#0097A7',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 2, borderColor: '#e5e7eb', alignItems: 'center' },
  statHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginLeft: 5 },
  statIcon: { fontSize: 20 },
  statLabel: { fontSize: 13, color: '#6b7280', fontFamily: 'Vazir' },
  menuContainer: { marginTop: 10, paddingHorizontal: 20, paddingBottom: 30 },
  menuItem: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  menuText: { fontSize: 16, fontFamily: 'Vazir', textAlign: 'right', color: '#4b5563' },
  // ... بقیه استایل‌ها
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 10,
    overflow: 'hidden'
  },
  avatarImage: {
    width: 90,
    height: 90,
  },
});