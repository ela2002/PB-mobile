import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../../firebase/firebase";
import { signOut } from "@firebase/auth";

const HomeScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("User signed out successfully!");
      navigation.navigate("SignIn");
    } catch (error) {
      console.error("Sign-out error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home Screen</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeScreen;
