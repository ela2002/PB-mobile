import React, { useState, useEffect } from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { auth, firestore } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Tabs = () => {
  const navigation = useNavigation();
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const userDataDocRef = doc(firestore, "employeesprofile", userUid);
          const userDataDocSnapshot = await getDoc(userDataDocRef);
          if (userDataDocSnapshot.exists()) {
            const userData = userDataDocSnapshot.data();
            setProfilePicture(userData.profilePicture || null);
          } else {
            console.error("User data not found for UID:", userUid);
          }
        } else {
          console.log("No user signed in.");
        }
      } catch (error) {
        console.error("Error fetching user profile picture:", error);
      }
    };

    fetchUserProfilePicture();
  }, []);

  const handleTabPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("Insightzone")}
        underlayColor="#B69FEB"
      >
        <Feather name="home" size={24} color="gray" />
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("Community")}
        underlayColor="#B69FEB"
      >
        <MaterialIcons name="groups" size={24} color="gray" />
      </TouchableHighlight>

      <TouchableHighlight
        style={[styles.tab, styles.addButton]}
        onPress={() => handleTabPress("AddPost")}
        underlayColor="#DDDDDD"
      >
        <MaterialIcons name="add-circle" size={38} color="#B69FEB" />
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("Applications")}
        underlayColor="#B69FEB"
      >
        <Feather name="list" size={24} color="gray" />
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("EmployeeProfile")}
        underlayColor="#B69FEB"
      >
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePictureTab}
          />
        ) : (
          <Ionicons name="md-person" size={22} color="gray" />
        )}
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 5,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButton: {
    bottom: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dropdown: {
    position: "absolute",
    top: -100, // Adjust this value as needed
    width: 100,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 3,
    zIndex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 19,
  },
  profilePictureTab: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
});

export default Tabs;
