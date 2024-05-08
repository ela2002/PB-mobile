import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { getStorage, ref, uploadFile, getDownloadURL } from "firebase/storage";
import { firestore, auth } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import * as FileSystem from "expo-file-system";

const Resume = () => {
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [userData, setUserData] = useState(null);

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
            setUserData({ ...userData, id: userDataDocSnapshot.id });
            fetchResumeUrl(userData);
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

  const fetchResumeUrl = async (userData) => {
    try {
      const storage = getStorage();
      const resumeRef = ref(storage, `resumes/${userData.uid}/resume.pdf`);
      const url = await getDownloadURL(resumeRef);
      setResumeUrl(url);
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const handleSelectFile = async () => {
    try {
      const { uri } = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      console.log("Selected file URI:", uri); // Add this line
      if (uri) {
        setSelectedFile(uri);
        setShowForm(true);
      } else {
        console.log("File selection cancelled or URI not found"); // Add this line
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const handleUploadResume = async () => {
    try {
      if (!selectedFile) {
        Alert.alert("Please select a file");
        return;
      }

      setUploading(true);

      const storage = getStorage();
      const resumeRef = ref(storage, `resumes/${userData.uid}/resume.pdf`);
      const uploadTask = uploadFile(resumeRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading resume:", error);
          setUploading(false);
          Alert.alert(
            "Error",
            "Failed to upload resume. Please try again later."
          );
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setResumeUrl(downloadURL);
            setUploading(false);
            setShowForm(false);
            setSelectedFile(null);
            Alert.alert("Success", "Resume uploaded successfully");
          } catch (error) {
            console.error("Error fetching download URL:", error);
            setUploading(false);
            Alert.alert(
              "Error",
              "Failed to fetch download URL. Please try again later."
            );
          }
        }
      );
    } catch (error) {
      console.error("Error uploading resume:", error);
      setUploading(false);
      Alert.alert("Error", "Failed to upload resume. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectFile}>
        <View style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#B69FEB" />
          <Text style={styles.addText}>Upload Resume</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleUploadResume}>
              <Text style={styles.uploadButton}>
                {uploading ? "Uploading..." : "Upload"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    padding: 10,
    marginBottom: 20,
  },
  addText: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    elevation: 5,
  },
  uploadButton: {
    color: "#B69FEB",
    textAlign: "center",
  },
});

export default Resume;
