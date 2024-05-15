import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { auth, firestore } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome icons
import * as ImagePicker from "expo-image-picker";

const ProfileHeader = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [editMode, setEditMode] = useState(false); // State variable for edit mode

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
            setFullName(userData.fullName || "");
            setJobTitle(userData.jobTitle || "");
            setProfilePicture(userData.profilePicture || null);
          } else {
            console.error("User data not found for UID:", userUid);
          }
        } else {
          console.log("No user signed in.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = async () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  const handleSaveChanges = async () => {
    if (!fullName.trim() || !jobTitle.trim()) {
      Alert.alert(
        "Validation Error",
        "Full Name and Job Title cannot be empty."
      );
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userUid = user.uid;
        const userDataDocRef = doc(firestore, "employeesprofile", userUid);
        await updateDoc(userDataDocRef, {
          fullName,
          jobTitle,
          profilePicture,
        });
        setUserData({ ...userData, fullName, jobTitle, profilePicture });
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again later.");
    }

    setEditMode(false); // Exit edit mode after saving changes
  };

  const handleImagePicker = async () => {
    // Ask for permission to access camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera roll is required."
      );
      return;
    }

    // Launch image picker
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setProfilePicture(result.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick an image. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#B69FEB" />
      ) : (
        userData && (
          <>
            <Image
              source={{
                uri:
                  profilePicture ||
                  userData.profilePicture ||
                  "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg",
              }}
              alt="img"
              style={styles.profileImage}
            />
            {!editMode && (
              <TouchableOpacity
                onPress={handleEdit}
                style={styles.editIconContainer}
              >
                <FontAwesome
                  name="edit"
                  size={20}
                  color="rgba(16, 16, 17, 0.71)"
                />
              </TouchableOpacity>
            )}
            {editMode && (
              <View style={styles.editForm}>
                <TouchableOpacity
                  onPress={handleImagePicker}
                  style={styles.addPhotoButton}
                >
                  <Text style={styles.photoButtonText}>Add Photo</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full Name"
                />
                <TextInput
                  style={styles.input}
                  value={jobTitle}
                  onChangeText={setJobTitle}
                  placeholder="Job Title"
                />

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={handleSaveChanges}
                    style={[styles.saveButton, styles.saveButtonMargin]}
                  >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditMode(false)}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {!editMode && (
              <>
                <Text style={styles.username}>{fullName}</Text>
                <Text style={styles.jobTitle}>{jobTitle}</Text>
              </>
            )}
            <View style={styles.recommendationContainer}>
              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationText}>
                  Recommendations:{" "}
                  {userData.recommend !== undefined ? userData.recommend : 0}
                </Text>
              </View>
              <View style={styles.recommendationBox}>
                <Text style={styles.recommendationText}>
                  Unrecommendations:{" "}
                  {userData.Unrecommend !== undefined
                    ? userData.Unrecommend
                    : 0}
                </Text>
              </View>
            </View>
          </>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  jobTitle: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  recommendationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  recommendationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B69FEB",
    width: "46%",
    borderRadius: 15,
    padding: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: "#fff",
  },
  editIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  editForm: {
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  addPhotoButton: {
    backgroundColor: "#F6F6F6",
    borderColor: "0000",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginTop: 0,
  },
  photoButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "normal",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  saveButton: {
    backgroundColor: "#A7BEE1",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 5,
  },
  saveButtonMargin: {
    marginRight: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileHeader;
