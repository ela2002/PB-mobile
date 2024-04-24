import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Navbar from "../../navbar/Navbar";
import PostCard from "../../Insightzone/PostCard";

const InsightzoneScreen = () => {
  return (
    <View>
      <Navbar></Navbar>
      <PostCard></PostCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InsightzoneScreen;
