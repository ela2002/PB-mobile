import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebase/firebase";
import ForgotPasswordScreen from "./ForgotPasswordScreen";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to control whether to show the ForgotPasswordScreen

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully!");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Sign-in Error", error.message);
      console.error("Sign-in error:", error.message);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true); // Show the ForgotPasswordScreen component
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      {!showForgotPassword ? (
        <View style={styles.card}>
          <Text style={styles.title}>Sign In</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ForgotPasswordScreen navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    marginTop: 10,
    marginLeft: 70,
    fontSize: 32,
    fontWeight: "bold",
    color: "#8172E8",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: 300,
    height: 360,
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
  forgotPassword: {
    marginLeft: 100,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 15,
    color: "#666666",
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
  signUpText: {
    marginLeft: 10,
    marginTop: 30,
    fontSize: 16,
    color: "#666666",
  },
  signUpLink: {
    color: "#8172E8",
  },
});

export default SignInScreen;
