import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { auth, firestore } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    try {
      if (!email) {
        throw new Error("Email cannot be empty");
      }

      if (!password) {
        throw new Error("Password cannot be empty");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      await setDoc(doc(firestore, "employeesprofile", userId), {
        email,
        fullName,
        Unrecommend: "",
        bio: "",
        companyName: "",
        industry: "",
        jobTitle: "",
        profilePicture: "",
        recommend: "",
        role: "employee",
      });

      console.log("User signed up successfully!");
      navigation.navigate("SignIn");
    } catch (error) {
      Alert.alert("Sign-up Error", error.message);
      console.error("Sign-up error:", error.message);
    }
  };

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="fullName"
          value={fullName}
          onChangeText={setfullName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signInText}>
            Already have an account?{" "}
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
    backgroundColor: "#f0f0f0",
  },
  title: {
    marginTop: 10,
    marginLeft: 70,
    fontSize: 32,
    fontWeight: "bold",
    color: "#8172E8", // Purple color
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: 300,
    height: 450,
    borderRadius: 10,
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
    marginLeft: 10,
    marginTop: 30,
    fontSize: 16,
    color: "#666666",
  },
  signInLink: {
    color: "#8172E8",
  },
});

export default SignUpScreen;
