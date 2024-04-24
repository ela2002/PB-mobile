import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { sendPasswordResetEmail } from "@firebase/auth";
import { auth } from "../../firebase/firebase";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset Email Sent",
        "Check your email to reset your password."
      );
    } catch (error) {
      Alert.alert("Forgot Password Error", error.message);
      console.error("Forgot password error:", error.message);
    }
  };

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signInText}>
            Remembered your password?{" "}
            <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light gray background
    padding: 20,
  },
  title: {
    marginTop: 10,
    marginLeft: 5,
    fontSize: 32,
    fontWeight: "bold",
    color: "#8172E8", // Purple color
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF", // White background for card
    borderRadius: 10,
    width: 310,
    height: 300,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    marginLeft: 20,
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    width: "80%",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#8172E8",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    marginLeft: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInText: {
    marginTop: 30,
    fontSize: 16,
    color: "#666666",
  },
  signInLink: {
    color: "#8172E8",
  },
});

export default ForgotPasswordScreen;
