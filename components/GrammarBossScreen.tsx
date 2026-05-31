import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const grammarQuestions = [
  { id: 1, question: 'She ___ to school every day.', options: ['go', 'goes', 'going'], answer: 'goes' },
  { id: 2, question: 'I have never ___ to Paris.', options: ['be', 'was', 'been'], answer: 'been' },
  { id: 3, question: 'If it rains, we ___ at home.', options: ['will stay', 'stayed', 'staying'], answer: 'will stay' },
];

export default function GrammarBossScreen({ navigation }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 ثانیه زمان
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === grammarQuestions[currentQIndex].answer) {
      setScore(score + 1);
    }
    
    if (currentQIndex < grammarQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const isBossDefeated = score >= 2; // حد نصاب قبولی
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{isBossDefeated ? '🎉 غول شکست خورد! 🎉' : '💀 غول تو رو شکست داد! 💀'}</Text>
        <Text style={styles.scoreText}>امتیاز شما: {score} از {grammarQuestions.length}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>بازگشت</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = grammarQuestions[currentQIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>⏱ زمان باقی‌مانده: {timeLeft} ثانیه</Text>
      <Text style={styles.title}>مبارزه با غول گرامر</Text>
      <Text style={styles.questionText}>{currentQ.question}</Text>
      
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
