import React from "react";
import { View, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRoute } from "@react-navigation/native";

export default function VideoPlayerScreen() {

  const route: any = useRoute();
  const videoSource = route.params.video;

  return (
    <View style={styles.container}>
      <Video
        source={videoSource}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: 300,
  },
});
