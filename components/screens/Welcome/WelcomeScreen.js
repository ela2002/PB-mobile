import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Shaping Better Workplaces, {"\n"}One Review at a Time
        </Text>
        <Text style={styles.caption}>
          Ready to take control of your career journey?
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 310,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#8172E8", // Title text color
    textAlign: "center",
  },
  caption: {
    fontSize: 16,
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#8172E8",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 10,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  signUpButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default WelcomeScreen;
