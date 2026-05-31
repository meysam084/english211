import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ShopScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>فروشگاه 🏪</Text>
        <Text style={styles.coins}>۱۵۰ 🪙</Text>
      </View>

      <Text style={styles.sectionTitle}>آیتم‌های ویژه ✨</Text>
      
      <View style={styles.itemCard}>
        <Text style={styles.itemIcon}>🧊</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>فریز استریک (محافظ آتش)</Text>
          <Text style={styles.itemDesc}>اگر یک روز نیومدی، آتشت خاموش نمیشه!</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyText}>۵۰ 🪙</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.itemCard}>
        <Text style={styles.itemIcon}>👕</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>لباس جدید آواتار</Text>
          <Text style={styles.itemDesc}>آواتار خودت رو خوشتیپ‌تر کن!</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyText}>۱۰۰ 🪙</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefce8', padding: 20 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingTop: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#854d0e', fontFamily: 'Vazir' },
  coins: { fontSize: 22, fontWeight: 'bold', color: '#ca8a04' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#a16207', marginBottom: 15, fontFamily: 'Vazir', textAlign: 'right' },
  itemCard: { flexDirection: 'row-reverse', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
  itemIcon: { fontSize: 40, marginLeft: 15 },
  itemInfo: { flex: 1, alignItems: 'flex-end' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#3f3f46', fontFamily: 'Vazir' },
  itemDesc: { fontSize: 12, color: '#71717a', fontFamily: 'Vazir', marginTop: 4, textAlign: 'right' },
  buyButton: { backgroundColor: '#facc15', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 10 },
  buyText: { fontWeight: 'bold', color: '#854d0e' }
});
