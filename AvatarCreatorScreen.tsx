import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

// آدرس عکس‌های شما در پوشه assets
const AVATAR_LIST = [
  require('./assets/avatars/boy1.png'),
  require('./assets/avatars/boy2.png'),
  require('./assets/avatars/boy3.png'),
  require('./assets/avatars/girl1.png'),
  require('./assets/avatars/girl2.png'),
  require('./assets/avatars/girl3.png'),
];

export default function AvatarCreatorScreen({ navigation }: any) {
  // به صورت پیش‌فرض اولین عکس انتخاب شده است
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_LIST[0]);

  const saveAvatar = () => {
    // ارسال عکس انتخاب شده به صفحه پروفایل
    navigation.navigate('پروفایل', { updatedAvatar: selectedAvatar });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>آواتار خودت را انتخاب کن! 🎨</Text>
      
      {/* نمایش بزرگ آواتار انتخاب شده */}
      <View style={styles.previewContainer}>
        <Image source={selectedAvatar} style={styles.previewImage} resizeMode="contain" />
      </View>

      {/* لیست آواتارها برای انتخاب */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {AVATAR_LIST.map((avatar, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.avatarCard, 
                selectedAvatar === avatar && styles.selectedCard
              ]}
              onPress={() => setSelectedAvatar(avatar)}
            >
              <Image source={avatar} style={styles.gridImage} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveBtn} onPress={saveAvatar}>
        <Text style={styles.saveBtnText}>✅ تایید و ذخیره</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff', padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20, marginTop: 40 },
  previewContainer: { width: 140, height: 140, backgroundColor: '#fff', borderRadius: 70, justifyContent: 'center', alignItems: 'center', elevation: 5, marginBottom: 30, overflow: 'hidden' },
  previewImage: { width: 120, height: 120 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
  avatarCard: { width: 80, height: 80, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2, overflow: 'hidden' },
  selectedCard: { borderWidth: 3, borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  gridImage: { width: 70, height: 70 },
  saveBtn: { backgroundColor: '#4CAF50', width: '100%', padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 20, marginBottom: 20 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
