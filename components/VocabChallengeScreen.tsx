import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const vocabQuestions = [
  { id: 1, word: 'Essential', options: ['غیرضروری', 'ضروری', 'سخت', 'آسان'], answer: 'ضروری' },
  { id: 2, word: 'Improve', options: ['بهبود بخشیدن', 'خراب کردن', 'توقف کردن', 'شروع کردن'], answer: 'بهبود بخشیدن' },
  { id: 3, word: 'Courage', options: ['ترس', 'شجاعت', 'خشم', 'شادی'], answer: 'شجاعت' },
];

export default function VocabChallengeScreen({ navigation }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === vocabQuestions[currentQIndex].answer) {
      setScore(score + 1);
    }
    
    if (currentQIndex < vocabQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>پایان چالش!</Text>
        <Text style={styles.scoreText}>امتیاز شما: {score} از {vocabQuestions.length}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>بازگشت به صفحه اصلی</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = vocabQuestions[currentQIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>چالش لغات</Text>
      <Text style={styles.questionText}>معنی کلمه "{currentQ.word}" چیست؟</Text>
      
      {currentQ.options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.optionBtn} onPress={() => handleAnswer(option)}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#4c1d95' },
  questionText: { fontSize: 20, marginBottom: 30, textAlign: 'center' },
  timerText: { fontSize: 18, color: '#e11d48', fontWeight: 'bold', marginBottom: 20 },
  optionBtn: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, width: '100%', marginBottom: 10, alignItems: 'center' },
  optionText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  scoreText: { fontSize: 22, marginBottom: 30 },
  btn: { backgroundColor: '#10b981', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center' },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
