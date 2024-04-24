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
        <Image
          source={require("../../assets/logo_1.png")}
          style={styles.image}
        />
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
    backgroundColor: "rgba(182, 159, 235, 0.5)",
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  slogan: {
    fontSize: 16,
    marginBottom: 20,
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#8172E8",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
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
