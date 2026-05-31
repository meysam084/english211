import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { Volume2, RefreshCcw } from 'lucide-react-native';
import { allWords, Word } from './data/wordsData'; // ایمپورت دیتابیس جامع

export default function MyWordsScreen({ route, navigation }: any) {
  // دریافت پایه و درس از صفحه قبل
 // کد اصلاح شده:
const { grade = 7, lesson = 1 } = route?.params || {};

  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [lessonWords, setLessonWords] = useState<Word[]>([]);

  useEffect(() => {
    // فیلتر کردن لغات فقط برای این پایه و این درس
    const filteredWords = allWords.filter(w => w.grade === grade && w.lesson === lesson);
    setLessonWords(filteredWords);
  }, [grade, lesson]);

  const currentWord = lessonWords[currentIndex];

  if (lessonWords.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 20}}>هنوز لغتی برای این درس اضافه نشده! 🥺</Text>
      </View>
    );
  }
  const speakWord = () => {
    Speech.speak(currentWord.word, {
      language: 'en-US',
      pitch: 1,
      rate: 0.8, 
    });
  };

  const handleNextWord = (difficulty: 'hard' | 'good' | 'easy') => {
    console.log(`Word: ${currentWord.word}, Difficulty selected: ${difficulty}`);
    
    if (currentIndex < lessonWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false); 
    } else {
      Alert.alert('🎉 آفرین قهرمان!', 'مرور لغات امروزت عالی بود و تمام شد! 🥇👏');
      setCurrentIndex(0);
      setShowTranslation(false);
    }
  };

  if (!currentWord) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>🌟 جعبه کلمات جادویی من 🪄</Text>
      
      <View style={styles.cardContainer}>
        {/* اضافه شدن View با استایل imageContainer */}
        <View style={styles.imageContainer}>
          <Image source={currentWord.image} style={styles.wordImage} />
        </View>

        {/* کلمه انگلیسی و دکمه تلفظ */}
        <View style={styles.wordRow}>
          <Text style={styles.englishWord}>{currentWord.word}</Text>
          <TouchableOpacity onPress={speakWord} style={styles.speakerButton}>
            <Volume2 color="#4f46e5" size={28} />
          </TouchableOpacity>
        </View>

        <Text style={styles.wordType}>({currentWord.type})</Text>

        {/* بخش نمایش معنی یا دکمه مشاهده */}
        {!showTranslation ? (
          <TouchableOpacity 
            style={styles.showAnswerButton} 
            onPress={() => setShowTranslation(true)}
          >
            <RefreshCcw color="#fff" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.showAnswerText}>👀 نمایش معنی</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.translationContainer}>
            <Text style={styles.persianTranslation}>✨ {currentWord.translation} ✨</Text>
            <Text style={styles.exampleText}>📝 مثال: {currentWord.example}</Text>
            
            {/* دکمه‌های جعبه لایتنر */}
            <Text style={styles.questionText}>🤔 یادآوری این کلمه چطور بود؟</Text>
            <View style={styles.ankiButtonsRow}>
              <TouchableOpacity style={[styles.ankiBtn, styles.btnHard]} onPress={() => handleNextWord('hard')}>
                <Text style={styles.ankiBtnText}>سخت بود 🥵</Text>
                <Text style={styles.ankiBtnSub}>مرور در 1 دقیقه</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.ankiBtn, styles.btnGood]} onPress={() => handleNextWord('good')}>
                <Text style={styles.ankiBtnText}>خوب 🙂</Text>
                <Text style={styles.ankiBtnSub}>مرور در 10 دقیقه</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.ankiBtn, styles.btnEasy]} onPress={() => handleNextWord('easy')}>
                <Text style={styles.ankiBtnText}>آسان بود 😎</Text>
                <Text style={styles.ankiBtnSub}>مرور در 1 روز</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    marginTop: 10,
    fontFamily: 'vazir', 
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 220, 
    backgroundColor: 'transparent',
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  wordImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  englishWord: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 10,
  },
  speakerButton: {
    backgroundColor: '#e0e7ff',
    padding: 10,
    borderRadius: 50,
  },
  wordType: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 5,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  showAnswerButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  showAnswerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  translationContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  persianTranslation: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981', 
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  questionText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  ankiButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ankiBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  btnHard: {
    backgroundColor: '#ef4444', 
  },
  btnGood: {
    backgroundColor: '#f59e0b', 
  },
  btnEasy: {
    backgroundColor: '#3b82f6', 
  },
  ankiBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ankiBtnSub: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.8,
    marginTop: 4,
  }
});
