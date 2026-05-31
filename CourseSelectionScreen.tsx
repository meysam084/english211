import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function CourseSelectionScreen({ navigation }: any) {
  const [selectedGrade, setSelectedGrade] = useState<7 | 8 | 9 | null>(7);

  const grades = [
    { level: 7, title: 'هفتم 🎒', color: '#FF6B6B' },
    { level: 8, title: 'هشتم 🛹', color: '#4ECDC4' },
    { level: 9, title: 'نهم 🎓', color: '#FFE66D' },
  ];

  // تولید 8 درس با ایموجی‌های مختلف
  const lessons = ['🍎', '🐶', '⚽️', '🚗', '🎨', '🍕', '🎸', '🚀'];

  const openLesson = (grade: number, lesson: number) => {
    // ارسال پایه و شماره درس به صفحه لغات
    navigation.navigate('MyWordsScreen', { grade, lesson });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>🌟 مسیر یادگیری من 🌟</Text>

      {/* انتخاب پایه */}
      <View style={styles.gradeContainer}>
        {grades.map((g) => (
          <TouchableOpacity
            key={g.level}
            style={[
              styles.gradeCard, 
              { backgroundColor: selectedGrade === g.level ? g.color : '#f1f5f9' }
            ]}
            onPress={() => setSelectedGrade(g.level as 7 | 8 | 9)}
          >
            <Text style={[styles.gradeText, { color: selectedGrade === g.level ? '#fff' : '#475569' }]}>
              {g.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* انتخاب درس */}
      {selectedGrade && (
        <ScrollView contentContainerStyle={styles.lessonsGrid}>
          {lessons.map((emoji, index) => {
            const lessonNum = index + 1;
            return (
              <TouchableOpacity
                key={lessonNum}
                style={styles.lessonCard}
                onPress={() => openLesson(selectedGrade, lessonNum)}
              >
                <Text style={styles.lessonEmoji}>{emoji}</Text>
                <Text style={styles.lessonTitle}>درس {lessonNum}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#1e293b' },
  gradeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  gradeCard: { flex: 1, paddingVertical: 15, marginHorizontal: 5, borderRadius: 15, alignItems: 'center', elevation: 3 },
  gradeText: { fontSize: 18, fontWeight: 'bold' },
  lessonsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  lessonCard: { 
    width: '47%', backgroundColor: '#fff', padding: 20, marginBottom: 15, 
    borderRadius: 20, alignItems: 'center', elevation: 2,
    borderWidth: 2, borderColor: '#e2e8f0'
  },
  lessonEmoji: { fontSize: 40, marginBottom: 10 },
  lessonTitle: { fontSize: 16, fontWeight: 'bold', color: '#334155' }
});
