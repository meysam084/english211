import React, { useState, useEffect, useContext, createContext  } from 'react';
import { ThemeProvider } from './ThemeContext'; // مطمئن شوید آدرس فایل کانتکست درست است
import { Easing } from 'react-native';
import { useRef } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
  Animated
} from 'react-native';
import AppText from './components/AppText'

import {  useTheme } from './ThemeContext';
import VocabChallengeScreen from './components/VocabChallengeScreen';
import GrammarBossScreen from './components/GrammarBossScreen';
import AudioPlayerScreen from './components/AudioPlayerScreen';
import QuizScreen from './components/QuizScreen';
import StreakScreen from './components/StreakScreen';
import SplashScreen from './components/SplashScreen';
import ShopScreen from './components/ShopScreen';
import AvatarCreatorScreen from './AvatarCreatorScreen';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font'
import { Switch } from 'react-native';
import { Settings as SettingsIcon } from 'lucide-react-native';

import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenCapture from 'expo-screen-capture';

import {
  Home,
  PlayCircle,
  User,
  GraduationCap,
  ArrowRight,
  Video as VideoIcon,
  Languages,
  Activity,
  Mic2,
  Headset,
  ChevronLeft,
  Trophy,
  BookOpen,
  Book,
  ClipboardCheck,
  Crown
} from 'lucide-react-native';
import VideoPlayerScreen from "./components/VideoPlayer";
   import ProfileScreen from './components/ProfileScreen';


import LoginScreen from './components/LoginScreen';
const { width } = Dimensions.get('window');





const Tab = createBottomTabNavigator();

import { db } from './firebaseConfig';
import { Video, ResizeMode } from 'expo-av';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import MyWordsScreen from './MyWordsScreen';
import CourseSelectionScreen from './CourseSelectionScreen';


// تعریف Context برای گیمیفیکیشن
export const GamificationContext = createContext<any>(null);

export const GamificationProvider = ({ children }: any) => {
  const [coins, setCoins] = useState(150); // تعداد سکه اولیه کاربر
  const [streak, setStreak] = useState(3); // تعداد روزهای متوالی ورود (آتش)

  return (
    <GamificationContext.Provider value={{ coins, setCoins, streak, setStreak }}>
      {children}
    </GamificationContext.Provider>
  );
};

// --- کامپوننت دکمه‌های جذاب برای نوجوانان ---
const DetailButton = ({ title, icon: IconComponent, color, emoji, onPress }: any) => (
  <TouchableOpacity style={styles.detailBtn} onPress={onPress}>
    <LinearGradient colors={[color, color + 'DD']} style={styles.detailBtnGradient}>
      <View style={styles.iconCircle}>
        <IconComponent color={color} size={24} />
      </View>
      <Text style={styles.detailBtnText}>{title} {emoji}</Text>
      <ChevronLeft color="#fff" size={20} />
    </LinearGradient>
  </TouchableOpacity>
);

// --- ۱. صفحه اختصاصی هر درس (با ۶ بخش جذاب) ---
const LessonDetailsScreen = ({ route, navigation }: any) => {
  const { title } = route.params;
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.headerDetail}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#fff" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitleDetail}>{title} 📚</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.detailScroll}>
        <DetailButton title="ویدیو آموزشی" emoji="📺" icon={Video} color="#6366f1" />
        <DetailButton title="انیمیشن مکالمه" emoji="💬" icon={Languages} color="#8b5cf6" />
        <DetailButton title="انیمیشن تمرین" emoji="🎮" icon={Activity} color="#ec4899" />
        <DetailButton title="بخش Sound and Letters" emoji="🔤" icon={Mic2} color="#f59e0b" />
        <DetailButton title="فایل صوتی Listening" emoji="🎧" icon={Headset} color="#10b981" />
        {/* بخش آزمون که اضافه شد */}
        <DetailButton 
          title="آزمون آنلاین" 
          emoji="🏆" 
          icon={Trophy} 
          color="#ef4444" 
          onPress={() => Alert.alert("آماده‌ای؟", "بزن بریم برای کسب مدال طلا! 🥇")}
        />
      </ScrollView>
    </View>
  );
};

// --- ۲. کارت‌های دروس در صفحه اصلی ---
const AdvancedVideoCard = ({ title, colors, navigation, emoji }: any) => (
  <TouchableOpacity 
    style={styles.videoWrapper} 
    onPress={() => navigation.navigate('LessonDetails', { title })}
  >
    <LinearGradient colors={colors} style={styles.videoCard}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={styles.videoCardText}>{title}</Text>
      <View style={styles.startBadge}>
        <Text style={styles.startBadgeText}>شروع کن 🚀</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);
const CourseViewer = ({ route, navigation }: any) => {
  const { lesson } = route.params;

  // اضافه کردن مشخصه type به هر بخش برای تشخیص مسیر
  const sections = [
    {
      id: 1,
      title: "ویدیوی تدریس استاد 👨‍🏫",
      icon: <VideoIcon color="#fff" />,
      color: "#7c3aed",
      type: "video"
    },
    {
      id: 2,
      title: "انیمیشن مکالمه (Conversation) 💬",
      icon: <Languages color="#fff" />,
      color: "#10b981",
      type: "video"
    },
    {
      id: 3,
      title: "انیمیشن تمرین‌ها (Practice) ✍️",
      icon: <Activity color="#fff" />,
      color: "#f59e0b",
      type: "video"
    },
    {
      id: 4,
      title: "قسمت Sound and Letters 🔤",
      icon: <Mic2 color="#fff" />,
      color: "#ef4444",
      type: "video"
    },
    {
      id: 5,
      title: "فایل‌های صوتی Listening 🎧",
      icon: <Headset color="#fff" />,
      color: "#3b82f6",
      type: "audio" // <-- نوع صوتی
    },
    {
      id: 6,
      title: "خودآزمایی و تست 📝",
      icon: <Trophy color="#fff" />,
      color: "#6366f1",
      type: "quiz" // <-- نوع آزمون
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {/* هدر درس */}
      <View style={styles.lessonHeader}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSub}>
          پایه {lesson.grade} — ماه {lesson.month}
        </Text>
      </View>

      {/* بخش‌های درس */}
      <View style={{ padding: 20 }}>
        {sections.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.modernActionCard}
            onPress={() => {
              // بررسی نوع آیتم و هدایت به صفحه مناسب
              if (item.type === 'audio') {
                navigation.navigate('AudioPlayerScreen', { lesson: lesson });
              } else if (item.type === 'quiz') {
                navigation.navigate('QuizScreen', { lesson: lesson });
              } else {
                // برای ویدیوها (فعلا ویدیو تستی گذاشته شده تا بعدا داینامیک کنید)
                navigation.navigate("VideoPlayer", {
                  video: require("./assets/video/lesson1.mp4"),
                });
              }
            }}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color }]}>
              {item.icon}
            </View>

            <Text style={styles.actionText}>{item.title}</Text>

            <ArrowRight color="#cbd5e1" size={18} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const GradeLessonsScreen = ({ route, navigation }: any) => {
  const { title, lessons } = route.params;
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  // 👈 چند رنگ شاد و ملایم (آبی، سبز، زرد، صورتی، بنفش)
  const funColors = ['#e0f2fe', '#dcfce7', '#fef3c7', '#fce7f3', '#f3e8ff'];
  const funBorders = ['#bae6fd', '#bbf7d0', '#fde047', '#fbcfe8', '#e9d5ff'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8fafc' }]}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 20, color: isDarkMode ? '#f8fafc' : '#1e293b' }}>
          لیست کامل {title}
        </Text>

        {/* 👈 اضافه شدن index برای انتخاب رنگ */}
        {lessons.map((lesson: any, index: number) => (
          <TouchableOpacity
            key={lesson.id}
            style={[
              styles.horizontalCard, 
              { 
                width: '100%', 
                marginBottom: 15, 
                alignSelf: 'center', 
                // اختصاص رنگ‌های شاد به پس‌زمینه و حاشیه کارت‌ها
                backgroundColor: isDarkMode ? '#1e293b' : funColors[index % funColors.length],
                borderWidth: 2,
                borderColor: isDarkMode ? '#334155' : funBorders[index % funBorders.length],
              }
            ]}
            onPress={() => navigation.navigate('CourseViewer', { lesson })}
          >
            <Image source={{ uri: lesson.image }} style={styles.cardImage} />
            <Text style={[styles.cardTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>{lesson.title}</Text>
            <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 10}}>
              <Text style={styles.cardDuration}>{lesson.duration}</Text>
              <Text>{lesson.icon}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const VideosScreen = ({ navigation }: any) => {
  // ۱. اضافه کردن کانتکست تم برای خواندن وضعیت تیره/روشن
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

 const gradesData = [
  {
    title: 'پایه هفتم (Prospect 1) 🎒',
    color: '#10b981',
    lessons: [
      { id: '7-1', title: 'Lesson 1: My Name', duration: '12:00', icon: '👋' },
      { id: '7-2', title: 'Lesson 2: My Classmates', duration: '15:30', icon: '👦' },
      { id: '7-3', title: 'Lesson 3: My Age', duration: '14:15', icon: '🎂' },
      { id: '7-4', title: 'Lesson 4: My Family', duration: '16:45', icon: '👨‍👩‍👧‍👦' },
      { id: '7-5', title: 'Lesson 5: My Appearance', duration: '13:20', icon: '👀' },
      { id: '7-6', title: 'Lesson 6: My House', duration: '18:00', icon: '🏠' },
      { id: '7-7', title: 'Lesson 7: My Address', duration: '11:50', icon: '📍' },
      { id: '7-8', title: 'Lesson 8: My Favorite Food', duration: '17:10', icon: '🍕' },
    ]
  },
  // بقیه پایه‌ها...


    {
      title: 'پایه هشتم (Prospect 2) 🏫',
      color: '#f59e0b',
      lessons: [
        { id: '8-1', title: 'Lesson 1: My Nationality', grade: 'هشتم', videoUrl: 'v', convAnim: 'c', pracAnim: 'p', soundLetters: 's', audioFile: 'a' },
        { id: '8-2', title: 'Lesson 3: My Abilities', grade: 'هشتم', videoUrl: 'v' },
      ]
    },
    {
      title: 'پایه نهم (Prospect 3) 🎓',
      color: '#ef4444',
      lessons: [
        { id: '9-1', title: 'Lesson 1: Personality', grade: 'نهم', videoUrl: 'v', convAnim: 'c', pracAnim: 'p', soundLetters: 's', audioFile: 'a' },
        { id: '9-2', title: 'Lesson 2: Travel', grade: 'نهم', videoUrl: 'v' },
      ]
    }
  ];

  return (
    // ۲. داینامیک کردن رنگ پس‌زمینه کل صفحه
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8fafc' }]}>
           <LinearGradient 
        // 👈 رنگ‌های جدید: ترکیب آبی آسمانی و بنفش خیلی ملایم
        colors={['#38bdf8', '#818cf8']} 
        style={styles.headerDetail}
      >
        <Text style={styles.headerTitleDetail}>کتابخانه جامع ویدیویی 📽️</Text>
      </LinearGradient>

      {gradesData.map((section, index) => (
        <View key={index} style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 }}>
            {/* ۳. داینامیک کردن رنگ متن عناوین (پایه هفتم، هشتم...) */}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#1e293b' }}>{section.title}</Text>
              <TouchableOpacity 
               onPress={() => navigation.navigate('GradeLessons', { 
                 title: section.title, 
                 lessons: section.lessons 
               })}
            >
              <Text style={{color: section.color}}>مشاهده همه</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            {section.lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                // ۴. داینامیک کردن رنگ کارت‌های افقی
                style={[styles.horizontalCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}
                onPress={() => navigation.navigate('CourseViewer', { lesson })}
              >
                <LinearGradient colors={[section.color, section.color + 'dd']} style={styles.cardIcon}>
                  <PlayCircle color="#fff" size={30} />
                </LinearGradient>
                {/* ۵. داینامیک کردن رنگ متن داخل کارت‌ها */}
                <Text style={[styles.cardTitle, { color: isDarkMode ? '#ffffff' : '#1e293b' }]} numberOfLines={1}>{lesson.title}</Text>
                <Text style={styles.cardTitle}>۶ بخش محتوا</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  );
};


const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});

const MainApp = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  // دریافت سکه و آتش از Context
  const { coins, streak } = useContext(GamificationContext);

  return (
    <Tab.Navigator
      initialRouteName="اصلی"
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: '#7c3aed',
        headerTitle: "English21",
        headerTitleAlign: 'center',
        
        // 👇 این بخش برای نمایش سکه و آتش در سمت راست هدر است
       headerRight: () => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginRight: 15, gap: 10 }}>
    
    {/* بخش سکه (لینک به صفحه ShopScreen) */}
    <TouchableOpacity 
      style={{ flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fef08a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}
      onPress={() => navigation.navigate('ShopScreen')}
    >
      <Text style={{ fontWeight: 'bold', color: '#ca8a04', marginLeft: 4 }}>{coins}</Text>
      <Text>🪙</Text>
    </TouchableOpacity>

    {/* بخش آتش/Streak (لینک به صفحه StreakScreen) */}
    <TouchableOpacity 
      style={{ flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fecdd3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}
      onPress={() => navigation.navigate('StreakScreen')}
    >
      <Text style={{ fontWeight: 'bold', color: '#e11d48', marginLeft: 4 }}>{streak}</Text>
      <Text>🔥</Text>
    </TouchableOpacity>

  </View>
),

          })}
    >
      {/* تب پروفایل در سمت چپ */}
      <Tab.Screen 
        name="پروفایل" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({color}) => <User color={color} size={24} /> }} 
      />
      
      {/* 👇 تب جدید: لغات من */}
      <Tab.Screen 
        name="لغات من" 
          component={CourseSelectionScreen} 
        options={{ tabBarIcon: ({color}) => <Book color={color} size={24} /> }} 
      />
      
      {/* تب ویدیوها */}
      <Tab.Screen 
        name="ویدیوها" 
        component={VideosScreen} 
        options={{ tabBarIcon: ({color}) => <GraduationCap color={color} size={24} /> }} 
      />
      
      {/* تب اصلی در سمت راست (تب پیش‌فرض) */}
      <Tab.Screen 
        name="اصلی" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({color}) => <Home color={color} size={24} /> }} 
      />
    </Tab.Navigator>
  );
};
const VoicePracticeCard = ({ word = "Serendipity" }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // ۱. تابع تلفظ لغت (معلم)
  const speakWord = () => {
    // سرعت رو 0.8 گذاشتیم تا بچه‌ها واضح‌تر بشنوند
    Speech.speak(word, { language: 'en-US', rate: 0.8 }); 
  };

  // ۲. شروع ضبط صدای کاربر
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // ۳. پایان ضبط صدا
  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    if (uri) {
      // آماده‌سازی صدا برای پخش
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
    }
    setRecording(null);
  };

  // ۴. پخش صدای ضبط شده کاربر
  const playMyVoice = async () => {
    if (sound) {
      await sound.playAsync();
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 3, alignItems: 'center', marginVertical: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 }}>{word}</Text>
      
      <View style={{ flexDirection: 'row-reverse', gap: 15 }}>
        {/* دکمه تلفظ معلم */}
        <TouchableOpacity onPress={speakWord} style={{ backgroundColor: '#3b82f6', padding: 15, borderRadius: 50 }}>
          <Text style={{ fontSize: 20 }}>📢</Text>
        </TouchableOpacity>

        {/* دکمه ضبط صدا */}
        <TouchableOpacity 
          onPressIn={startRecording} // نگه داشتن دکمه برای ضبط
          onPressOut={stopRecording} // رها کردن دکمه برای پایان
          style={{ backgroundColor: isRecording ? '#ef4444' : '#ecfdf5', padding: 15, borderRadius: 50, borderWidth: 2, borderColor: isRecording ? '#ef4444' : '#10b981' }}
        >
          <Text style={{ fontSize: 20 }}>{isRecording ? '⏺️' : '🎙️'}</Text>
        </TouchableOpacity>

        {/* دکمه پخش صدای کاربر (فقط اگه صدایی ضبط شده باشه نشون داده میشه) */}
        {sound && (
          <TouchableOpacity onPress={playMyVoice} style={{ backgroundColor: '#a855f7', padding: 15, borderRadius: 50 }}>
            <Text style={{ fontSize: 20 }}>▶️</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ color: '#64748b', fontSize: 12, marginTop: 10 }}>
        {isRecording ? 'در حال ضبط... رها کنید تا قطع شود' : 'برای ضبط صدات، دکمه میکروفون رو نگه دار'}
      </Text>
    </View>
  );
};


const AdminPanel = ({ navigation }: any) => {
  const [lessonData, setLessonData] = useState({
    title: '',
    grade: 'هفتم',
    videoUrl: '',
    convAnim: '',
    pracAnim: '',
    soundLetters: '',
    audioFile: ''
  });

  const handleUpload = async () => {
    // چک کردن پر بودن فیلد اصلی
    if (!lessonData.title || !lessonData.videoUrl) {
      Alert.alert("استاد عزیز! ⚠️", "لطفاً حداقل عنوان و لینک ویدیو رو وارد کنید.");
      return;
    }

    try {
      await addDoc(collection(db, "Lessons"), {
  ...lessonData,
  adminKey: "mySecretKey", // این کلید باید با اونی که در Rules نوشتی یکی باشه
  createdAt: serverTimestamp(),
});
      Alert.alert("ایول! 🎉", "محتوا با موفقیت برای دانش‌آموزان منتشر شد.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("خطا در آپلود ❌", "ارتباط با فایربیس برقرار نشد.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.headerDetail}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#fff" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitleDetail}>پنل انتشار محتوا 🛠️</Text>
      </LinearGradient>

      <View style={{ padding: 20 }}>
        <Text style={styles.adminLabel}>انتخاب پایه تحصیلی:</Text>
        <View style={styles.gradePicker}>
          {['هفتم', 'هشتم', 'نهم'].map((g) => (
            <TouchableOpacity 
              key={g} 
              style={[styles.adminGradeBtn, lessonData.grade === g && styles.activeAdminGrade]}
              onPress={() => setLessonData({...lessonData, grade: g})}
            >
              <Text style={{color: lessonData.grade === g ? '#fff' : '#1e293b'}}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput placeholder="عنوان درس (مثلاً: درس سوم - سفر)" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, title: t})} />
        <TextInput placeholder="🔗 لینک ویدیو آموزشی" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, videoUrl: t})} />
        <TextInput placeholder="🔗 لینک انیمیشن مکالمه" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, convAnim: t})} />
        <TextInput placeholder="🔗 لینک انیمیشن تمرین" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, pracAnim: t})} />
        <TextInput placeholder="🔗 لینک Sound and Letters" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, soundLetters: t})} />
        <TextInput placeholder="🔗 لینک فایل صوتی Listening" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, audioFile: t})} />

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
          <Text style={styles.loginBtnText}>تایید و انتشار نهایی 🚀</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// بقیه ایمپورت‌های شما...

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      {/* 👈 اضافه شدن Provider گیمیفیکیشن */}
      <GamificationProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
  name="Splash" 
  component={SplashScreen} 
  options={{ headerShown: false }} 
/>
                <Stack.Screen name="GradeLessons" component={GradeLessonsScreen} options={{ title: 'لیست درس‌ها' }} />
<Stack.Screen name="CourseSelection" component={CourseSelectionScreen} />
<Stack.Screen name="MyWordsScreen" component={MyWordsScreen} />
<Stack.Screen name="AudioPlayerScreen" component={AudioPlayerScreen} />
<Stack.Screen name="QuizScreen" component={QuizScreen} />
<Stack.Screen name="Shop" component={ShopScreen} options={{ title: 'فروشگاه' }} />
        <Stack.Screen name="Streak" component={StreakScreen} options={{ title: 'استریک' }} />
        <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} options={{ title: 'پخش صدا' }} />
<Stack.Screen name="AvatarCreator" component={AvatarCreatorScreen} options={{ headerShown: false }} />
           <Stack.Screen name="VocabChallenge" component={VocabChallengeScreen} />
    <Stack.Screen name="GrammarBoss" component={GrammarBossScreen} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Stack.Screen name="DailyQuizScreen" component={DailyQuizScreen} />
          <Stack.Screen name="VipScreen" component={VipScreen} />
          <Stack.Screen name="ProgressReportScreen" component={ProgressReportScreen} />
          <Stack.Screen name="LibraryScreen" component={LibraryScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="CourseViewer" component={CourseViewer} />
          <Stack.Screen name="AdminPanel" component={AdminPanel} />
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="LessonDetails" component={LessonDetailsScreen} />
         </Stack.Navigator>
        </NavigationContainer>
      </GamificationProvider>
    </ThemeProvider>
  );
}








const SimpleVideoCard = ({ title, colors }: any) => (
  <View style={styles.simpleCard}>
    <LinearGradient colors={colors} style={styles.videoCard}>
      <PlayCircle color="#fff" size={35} />
      <Text style={styles.videoCardText}>{title}</Text>
    </LinearGradient>
  </View>
);
// ----------------------------
//  صفحات placeholder
// ----------------------------
const VipScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: 22 }}>VIP Screen 💎</Text>
  </View>
);

const ProgressReportScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: 22 }}>Progress Report 📊</Text>
  </View>
);

const LibraryScreen = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  return (
    <ScrollView style={[styles.libraryContainer, { backgroundColor: isDarkMode ? '#121212' : '#f8fafc' }]}>
      
      {/* 📚 بخش کتاب‌های درسی */}
      <Text style={[styles.librarySectionTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>کتاب‌های درسی 📚</Text>
      
      <TouchableOpacity style={[styles.libraryCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderLeftColor: '#10b981' }]}>
        <Text style={[styles.libraryCardTitle, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}>کتاب پایه هفتم (Prospect 1)</Text>
        <Text style={[styles.libraryCardSub, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>دانلود فایل PDF کتاب درسی</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.libraryCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderLeftColor: '#f59e0b' }]}>
        <Text style={[styles.libraryCardTitle, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}>کتاب پایه هشتم (Prospect 2)</Text>
        <Text style={[styles.libraryCardSub, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>دانلود فایل PDF کتاب درسی</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.libraryCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderLeftColor: '#ef4444' }]}>
        <Text style={[styles.libraryCardTitle, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}>کتاب پایه نهم (Prospect 3)</Text>
        <Text style={[styles.libraryCardSub, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>دانلود فایل PDF کتاب درسی</Text>
      </TouchableOpacity>

      {/* 📝 بخش نمونه سوالات امتحانی */}
      <Text style={[styles.librarySectionTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b', marginTop: 20 }]}>نمونه سوالات امتحانی 📝</Text>
      
      <TouchableOpacity style={[styles.libraryCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderLeftColor: '#8b5cf6' }]}>
        <Text style={[styles.libraryCardTitle, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}>فایل امتحانات پایه هفتم</Text>
        <Text style={[styles.libraryCardSub, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>سوالات نوبت اول و دوم + پاسخنامه</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.libraryCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderLeftColor: '#8b5cf6' }]}>
        <Text style={[styles.libraryCardTitle, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}>فایل امتحانات پایه هشتم</Text>
        <Text style={[styles.libraryCardSub, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>سوالات نوبت اول و دوم + پاسخنامه</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.libraryCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', borderLeftColor: '#8b5cf6' }]}>
        <Text style={[styles.libraryCardTitle, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}>فایل امتحانات پایه نهم</Text>
        <Text style={[styles.libraryCardSub, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>سوالات نوبت اول و دوم + پاسخنامه</Text>
      </TouchableOpacity>

      <View style={{height: 100}} />
    </ScrollView>
  );
};


// ----------------------------
//     نسخه جدید HomeScreen
// ----------------------------
const HomeScreen = ({ navigation }: any) => {
  // دریافت وضعیت تم
 const { theme } = useContext(ThemeContext);
const isDarkMode = theme === 'dark'; // بررسی می‌کند که آیا تم تیره است یا خیر


  return (
    // داینامیک کردن پس‌زمینه صفحه اصلی
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8fafc' }]}>

      <LinearGradient colors={['#7c3aed', '#4c1d95']} style={[styles.banner, { alignItems: 'center' }]}>
        <Text style={[styles.bannerText, { textAlign: 'center' }]}>سلام قهرمان 👋</Text>
        <Text style={[styles.bannerSub, { textAlign: 'center' }]}>آماده‌ای امروز یه قدم به انگلیسی مسلط‌تر بشی؟</Text>
      </LinearGradient>

      {/* 🔥 پیشنهاد ویژه امروز */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>پیشنهاد ویژه امروز 🔥</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, flexDirection: "row-reverse" }}>
        <TouchableOpacity onPress={() => navigation.navigate('VocabChallenge')}>
          <SimpleVideoCard title="چالش لغات 🎯" colors={['#f59e0b', '#d97706']} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GrammarBoss')}>
          <SimpleVideoCard title="غول گرامر 👹" colors={['#ec4899', '#be185d']} />
        </TouchableOpacity>
      </ScrollView>

      {/* 🟩 مسیر یادگیری */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>مسیر یادگیری 🚀</Text>

      <View style={[styles.learningPathCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}>
        <Text style={[styles.pathTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>Unit 1 — سلام و معرفی</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "30%" }]} />
        </View>
        <Text style={[styles.pathSmallText, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>۳۰٪ تکمیل شده</Text>
      </View>

      <View style={[styles.learningPathCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}>
        <Text style={[styles.pathTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>Unit 2 — اعداد و زمان</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "10%" }]} />
        </View>
        <Text style={[styles.pathSmallText, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>۱۰٪ تکمیل شده</Text>
      </View>

            {/* 🟦 کوییز روزانه */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>کوییز روزانه 🎯</Text>

      {/* 👇 این خط تغییر کرده و onPress به آن اضافه شده است 👇 */}
      <TouchableOpacity 
        style={[styles.dailyQuizBox, { backgroundColor: isDarkMode ? '#334155' : '#f1f5f9' }]}
        onPress={() => navigation.navigate('DailyQuizScreen')}
      >
        <Text style={[styles.dailyQuizTitle, { color: isDarkMode ? '#f8fafc' : '#0f172a' }]}>بزن بریم! امروز ۵ سؤال داری 💡</Text>
        
        <Text style={[styles.dailyQuizSub, { color: isDarkMode ? '#cbd5e1' : '#475569' }]}>با هر کوییز ۵ سکه جایزه بگیر 🪙</Text>
      </TouchableOpacity>


      

      {/* ✨ منوی جادویی */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>منوی جادویی ✨</Text>

      <View style={styles.toolGrid}>

        {/* VIP */}
        <TouchableOpacity style={[styles.toolCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}
          onPress={() => navigation.navigate("VipScreen")}
        >
          <View style={[styles.toolIconCircle, { backgroundColor: "#fef3c7" }]}>
            <Crown color="#f59e0b" size={24} />
          </View>
          <Text style={[styles.toolText, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>اشتراک VIP 💎</Text>
        </TouchableOpacity>

        {/* Progress */}
        <TouchableOpacity style={[styles.toolCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}
          onPress={() => navigation.navigate("ProgressReportScreen")}
        >
          <View style={[styles.toolIconCircle, { backgroundColor: "#dcfce7" }]}>
            <ClipboardCheck color="#10b981" size={24} />
          </View>
          <Text style={[styles.toolText, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>کارنامه 📊</Text>
        </TouchableOpacity>

        {/* Library */}
        <TouchableOpacity style={[styles.toolCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}
          onPress={() => navigation.navigate("LibraryScreen")}
        >
          <View style={[styles.toolIconCircle, { backgroundColor: "#e0e7ff" }]}>
            <BookOpen color="#6366f1" size={24} />
          </View>
          <Text style={[styles.toolText, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>کتابخانه 📚</Text>
        </TouchableOpacity>

      </View>

      <View style={{height: 100}} />
    </ScrollView>
  );
};
export const DailyQuizScreen = ({ navigation }: any) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // لیست ۵ سوال
  const questions = [
    { question: 'معنی کلمه "Beautiful" چیست؟', options: ['زشت', 'زیبا', 'بزرگ', 'کوچک'], answer: 'زیبا' },
    { question: 'کدام کلمه یک رنگ است؟', options: ['Car', 'Blue', 'Book', 'Tree'], answer: 'Blue' },
    { question: 'گذشته فعل "Go" چیست؟', options: ['Going', 'Goes', 'Went', 'Gone'], answer: 'Went' },
    { question: 'جمع کلمه "Child" چه می‌شود؟', options: ['Childs', 'Children', 'Childrens', 'Childes'], answer: 'Children' },
    { question: 'مخالف کلمه "Fast" چیست؟', options: ['Slow', 'Quick', 'Hard', 'Easy'], answer: 'Slow' },
  ];

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 5); // 5 امتیاز برای هر جواب درست
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <View style={styles.quizContainer}>
      {showScore ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>آزمون تمام شد! 🎉</Text>
          <Text style={styles.scoreText}>امتیاز شما: {score} از {questions.length * 5}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>بازگشت به خانه</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.questionCounter}>سوال {currentQuestion + 1} از {questions.length}</Text>
          <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionBtn} onPress={() => handleAnswer(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};



      




const styles = StyleSheet.create({
  

  container: { flex: 1, backgroundColor: '#f0f4ff' },
  adminLabel: { textAlign: 'right', marginBottom: 10, fontWeight: 'bold', color: '#475569' },
  adminInput: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, textAlign: 'right', borderWidth: 1, borderColor: '#cbd5e1' },
  adminGradeBtn: { padding: 10, borderRadius: 10, backgroundColor: '#e2e8f0', width: '30%', alignItems: 'center' },
  activeAdminGrade: { backgroundColor: '#7c3aed' },
  uploadBtn: {
    backgroundColor: '#10b981',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },

  avatarWrapper: { position: 'relative' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
    elevation: 5,
  },
  toolIconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gradePicker: { flexDirection: 'row-reverse', justifyContent: 'space-around', paddingHorizontal: 15 },

  activeGrade: { backgroundColor: '#7c3aed', transform: [{ scale: 1.1 }] },
  headerDetail: { height: 90, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerTitleDetail: { color: '#fff', fontSize: 21, fontWeight: 'bold', marginTop: 10 },
  backBtn: { position: 'absolute', left: 20, top: 60 },

  detailScroll: { padding: 20 },
  detailBtn: {
    width: '100%',
    height: 85,
    marginBottom: 15,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  detailBtnGradient: { flex: 1, borderRadius: 25, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 20 },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  detailBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'right', marginRight: 15 },

  videoWrapper: { marginLeft: 15, width: 180, height: 160 },
  cardEmoji: { fontSize: 40, marginBottom: 5 },
  videoCardText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },

  startBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 10,
  },
  startBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  welcomeBox: { padding: 20, alignItems: 'center' },
  welcomeText: { fontSize: 16, fontWeight: 'bold', color: '#4c1d95' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginHorizontal: 25,
    marginTop: 10,
    color: '#1e293b',
  },
  gradeContainer: { marginBottom: 10 },

  toolText: { marginTop: 5, fontSize: 10, fontWeight: 'bold', color: '#4c1d95' },
  nameInput: { fontSize: 18, fontWeight: 'bold', marginTop: 15, width: '60%', borderBottomWidth: 1, borderBottomColor: '#ccc' },

  adminBtn: {
    backgroundColor: '#1e293b',
    flexDirection: 'row-reverse',
    padding: 15,
    borderRadius: 12,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminBtnText: { color: '#fff', fontWeight: 'bold', marginRight: 10 },

  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd' },
  gradeSection: { marginTop: 25, paddingHorizontal: 20 },
  gradeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    elevation: 3,
  },
  gradeBtnText: { color: '#64748b', fontWeight: 'bold', fontSize: 14 },
  activeGradeText: { color: '#fff' },

  bannerText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  bannerSub: { color: '#e0e0e0', fontSize: 12 },

  toolGrid: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: 20 },
  banner: {
    width: width - 40,
    height: 100,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
  toolCard: { width: '31%', backgroundColor: '#fff', padding: 12, borderRadius: 15, alignItems: 'center', elevation: 2 },
  simpleCard: { marginLeft: 15, width: 160 },

  tapHint: { color: '#e0e0e0', fontSize: 10, marginTop: 5 },

  videoCard: {
    backgroundColor: '#fff',
    flexDirection: 'row-reverse',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },

  actionCard: {
    backgroundColor: '#fff',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 4,
    borderRightWidth: 6,
  },
  actionIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  actionText: { flex: 1, textAlign: 'right', fontWeight: 'bold', fontSize: 16, color: '#1e293b' },

  sectionLabel: { textAlign: 'right', color: '#64748b', marginBottom: 15, fontSize: 14 },
  videoInfo: { flex: 1, marginRight: 15 },
  videoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', textAlign: 'right' },
  videoSubtitle: { fontSize: 12, color: '#64748b', textAlign: 'right', marginTop: 4 },

  detailItem: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  horizontalCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 15,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    alignItems: 'center',
  },
  cardIcon: {
    width: '100%',
    height: 90,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  libraryContainer: {
    flex: 1,
    padding: 20,
  },
  librarySectionTitle: {
    fontSize: 20,
    fontFamily: 'VazirBold', // اگر فونت وزیر دارید، وگرنه پاک کنید
    marginBottom: 15,
    textAlign: 'right',
  },
  libraryCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5, // خط رنگی سمت چپ برای زیبایی
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  libraryCardTitle: {
    fontSize: 16,
    fontFamily: 'VazirBold',
    textAlign: 'right',
    marginBottom: 5,
  },
  libraryCardSub: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'right',
  },
  cardTitle: { fontWeight: 'bold', fontSize: 14, color: '#1e293b', textAlign: 'center' },
  cardSub: { fontSize: 11, color: '#94a3b8', marginTop: 4 },

  modernActionCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  detailItemText: { marginRight: 15, fontWeight: '600', fontSize: 16 },

  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashTitle: { color: '#fff', fontSize: 42, fontWeight: 'bold' },
  splashSub: { color: '#e0e0e0', fontSize: 16 },

  loginContainer: { flex: 1, backgroundColor: '#fff', padding: 30, justifyContent: 'center' },
  loginHeader: { marginBottom: 40, alignItems: 'flex-end' },

  profileHeader: { alignItems: 'center', marginTop: 30 },

  loginTitle: { fontSize: 28, fontWeight: 'bold' },
  loginSub: { fontSize: 14, color: '#64748b' },

  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
  },
  phoneInput: { flex: 1, textAlign: 'right' },

  loginBtn: {
    backgroundColor: '#7c3aed',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  skipBtn: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  skipText: { color: '#64748b' },
lessonHeader: {
  backgroundColor: '#7c3aed',
  padding: 25,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
  alignItems: 'flex-end'
},

lessonTitle: {
  color: '#fff',
  fontSize: 22,
  fontWeight: 'bold'
},

lessonSub: {
  color: '#e9d5ff',
  marginTop: 5,
  fontSize: 13
},

continueBtn: {
  backgroundColor: '#22c55e',
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 12,
  marginTop: 15,
  alignSelf: 'flex-start'
},

continueBtnText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14
},

learningPathCard: {
  backgroundColor: '#fff',
  marginHorizontal: 20,
  marginTop: 20,
  padding: 18,
  borderRadius: 20,
  elevation: 3
},

pathTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1e293b',
  textAlign: 'right'
},

pathSmallText: {
  fontSize: 12,
  color: '#64748b',
  textAlign: 'right',
  marginTop: 4
},

progressBarBg: {
  height: 10,
  backgroundColor: '#e2e8f0',
  borderRadius: 10,
  marginTop: 10,
  overflow: 'hidden'
},

progressBarFill: {
  height: 10,
  backgroundColor: '#7c3aed',
  width: '40%',
  borderRadius: 10

},
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: 'cover',
  },
  cardDuration: {
    fontSize: 12,
    color: '#64748b', // رنگ خاکستری ملایم
    marginTop: 8,
    fontFamily: 'Vazir', // اگر از فونت دیگری استفاده می‌کنید نام آن را بنویسید
  },

dailyQuizBox: {
  backgroundColor: '#fff',
  marginHorizontal: 20,
  marginTop: 20,
  padding: 20,
  borderRadius: 20,
  elevation: 3,
  flexDirection: 'row-reverse',
  alignItems: 'center'
},

dailyQuizTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1e293b',
  textAlign: 'right'
},

dailyQuizSub: {
  fontSize: 12,
  color: '#64748b',
  textAlign: 'right',
  marginTop: 3
},
themeSwitcher: {
    flexDirection: 'row-reverse', // از راست به چپ
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHeaderHorizontal: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 15, // فاصله عکس و نام
  },
  avatarSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
  nameInputBox: {
    backgroundColor: '#7c3aed',
    color: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  linkItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2, // سایه برای اندروید
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  linkText: {
    textAlign: 'right',
    fontSize: 16,
  },
  quizContainer: { flex: 1, padding: 20, backgroundColor: '#f3f4f6', justifyContent: 'center' },
  questionCounter: { fontSize: 16, fontFamily: 'Vazir', color: '#6b7280', marginBottom: 10, textAlign: 'center' },
  questionText: { fontSize: 22, fontFamily: 'VazirBold', color: '#1f2937', marginBottom: 30, textAlign: 'center' },
   optionBtn: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, width: '100%', marginBottom: 10, alignItems: 'center' },
  optionText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  resultBox: { alignItems: 'center' },
  resultText: { fontSize: 28, fontFamily: 'VazirBold', color: '#10b981', marginBottom: 10 },
  scoreText: { fontSize: 22, fontFamily: 'Vazir', color: '#1f2937', marginBottom: 30 },
  btn: { backgroundColor: '#8b5cf6', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontFamily: 'VazirBold' }

});



