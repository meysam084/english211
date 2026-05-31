import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

export default function AudioPlayerScreen() {

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  // ⬅⬅⬅ این تابع را آوردیم بالا
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 1);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  useEffect(() => {
    async function loadAudio() {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../assets/Lesson1.mp3'),
          { volume: 0.5 },
          onPlaybackStatusUpdate  // حالا درست کار می‌کند
        );
        setSound(newSound);
      } catch (error) {
        console.log('Error loading audio:', error);
      }
    }

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);




  // مدیریت پخش و توقف
  const handlePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // مدیریت کم و زیاد کردن صدا
  const changeVolume = async (amount: number) => {
    if (!sound) return;
    let newVolume = volume + amount;
    if (newVolume > 1) newVolume = 1;
    if (newVolume < 0) newVolume = 0;
    
    await sound.setVolumeAsync(newVolume);
    setVolume(newVolume);
  };

  // تبدیل میلی‌ثانیه به دقیقه و ثانیه
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // محاسبه درصد پیشرفت نوار
  const progressPercent = (position / duration) * 100;

  return (
    <View style={styles.container}>
      {/* عنوان و کاور جذاب */}
      <Text style={styles.title}>🎧 فایل صوتی درس 🎧</Text>
      
      <View style={styles.coverArtContainer}>
        <Text style={styles.coverIcon}>🎵</Text>
      </View>

      <Text style={styles.subtitle}>در حال یادگیری...</Text>

      {/* نوار پیشرفت (Progress Bar) */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* کنترل‌کننده‌ها */}
      <View style={styles.controlsContainer}>
        {/* دکمه کم کردن صدا */}
        <TouchableOpacity style={styles.volumeButton} onPress={() => changeVolume(-0.1)}>
          <Text style={styles.volumeIcon}>🔉</Text>
        </TouchableOpacity>

        {/* دکمه پخش/توقف */}
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
        </TouchableOpacity>

        {/* دکمه زیاد کردن صدا */}
        <TouchableOpacity style={styles.volumeButton} onPress={() => changeVolume(0.1)}>
          <Text style={styles.volumeIcon}>🔊</Text>
        </TouchableOpacity>
      </View>
      
      {/* نمایش سطح صدا */}
      <Text style={styles.volumeText}>سطح صدا: {Math.round(volume * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2C', // رنگ پس‌زمینه تیره و جذاب
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  coverArtContainer: {
    width: 220,
    height: 220,
    backgroundColor: '#383850',
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15, // افکت سایه زیبا
  },
  coverIcon: {
    fontSize: 100,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A0B0',
    marginBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.85,
    marginBottom: 40,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#383850',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6', // رنگ بنفش جذاب
    borderRadius: 4,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    width: 45,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.6,
  },
  playButton: {
    width: 80,
    height: 80,
    backgroundColor: '#8B5CF6',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  playIcon: {
    fontSize: 35,
    marginLeft: 5, // تنظیم موقعیت آیکون پلی
  },
  volumeButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2D2D40',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeIcon: {
    fontSize: 24,
  },
  volumeText: {
    marginTop: 20,
    color: '#A0A0B0',
    fontSize: 14,
  },
});
