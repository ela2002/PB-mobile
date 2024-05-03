import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { ProgressBar } from "react-native-paper";

import { auth, firestore } from "../../../firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const AddPostScreen = () => {
  const navigation = useNavigation();
  const textInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isAtTop, setIsAtTop] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const userDataDocRef = doc(firestore, "employeesprofile", userUid);
          const userDataDocSnapshot = await getDoc(userDataDocRef);
          if (userDataDocSnapshot.exists()) {
            const userData = userDataDocSnapshot.data();
            setFullName(userData.fullName || "");
            setJobTitle(userData.jobTitle || "");
            setProfilePicture(userData.profilePicture || null);
          } else {
            console.error("User data not found for UID:", userUid);
          }
        } else {
          console.log("No user signed in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const onRefresh = () => {
    // Refresh function to reset everything
    setRefreshing(true);
    // Reset all state values here
    setText("");
    setImage(null);
    setRefreshing(false);
  };
  const handleChooseImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission denied",
          "You need to allow access to your photos to select an image."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        if (pickerResult.assets && pickerResult.assets.length > 0) {
          const selectedImage = pickerResult.assets[0];
          setImage(selectedImage);
        }
      }
    } catch (error) {
      console.error("Error choosing image:", error);
      Alert.alert("Error", "Failed to choose image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!text && !image) {
      Alert.alert("Error", "Please enter text or select an image.");
      return;
    }

    try {
      let imageURL = null;
      if (image) {
        const storage = getStorage();
        const imageName = `${
          auth.currentUser.uid
        }_${Date.now()}.${getImageExtension(image.uri)}`; // Generate a unique image name with extension
        const storageRef = ref(storage, `posts/${imageName}`);
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;
            console.log("Upload is " + progress + "% done");
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            imageURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Image uploaded successfully. URL:", imageURL);

            // After image upload, add the post to Firestore
            await addPostToFirestore(imageURL);
          }
        );
      } else {
        // If no image, directly add the post to Firestore
        await addPostToFirestore();
      }
    } catch (error) {
      console.error("Error handling submit:", error);
      Alert.alert("Error", "Failed to submit post. Please try again later.");
    }
  };

  const addPostToFirestore = async (imageURL = null) => {
    const docRef = await addDoc(collection(firestore, "posts"), {
      uid: auth.currentUser.uid,
      text,
      image: imageURL,
      timestamp: serverTimestamp(),
      fullName,
      jobTitle,
      profilePicture,
    });
    console.log("Post added with ID: ", docRef.id);

    // Reset input fields
    setText("");
    setImage(null);
    navigation.goBack();

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    setIsAtTop(contentOffset.y <= 0);
  };

  const getImageExtension = (uri) => {
    const parts = uri.split(".");
    return parts[parts.length - 1];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.cardContainer}>
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            placeholder="Enter your post"
            multiline={true}
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <TouchableOpacity
            style={styles.chooseImageButton}
            onPress={handleChooseImage}
          >
            <Ionicons name="image" size={24} color="white" />
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
          {image && (
            <View>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <ProgressBar
                progress={uploadProgress}
                color="#8172E8"
                style={styles.progressBar}
              />
            </View>
          )}
          <TouchableOpacity
            style={[styles.submitButton, { opacity: isAtTop ? 0.5 : 1 }]}
            onPress={handleSubmit}
            disabled={isAtTop}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    width: "100%",
    height: "70%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    marginTop: 20,
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  chooseImageButton: {
    flexDirection: "row",
    backgroundColor: "#8172E8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    marginTop: 5,
    marginBottom: 20,
    height: 10,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#8172E8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddPostScreen;
