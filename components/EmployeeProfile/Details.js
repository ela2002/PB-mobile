import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { auth, firestore } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Details = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [editingField, setEditingField] = useState(null);

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
            setEmail(userData.email || "");
            setBio(userData.bio || "");
            setIndustry(userData.industry || "");
            setCompanyName(userData.companyName || "");
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

  const handleUpdateField = async (fieldName, value) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userUid = user.uid;
        const userDataDocRef = doc(firestore, "employeesprofile", userUid);
        await updateDoc(userDataDocRef, {
          [fieldName]: value,
        });
        setUserData((prevUserData) => ({
          ...prevUserData,
          [fieldName]: value,
        }));
      } else {
        console.log("No user signed in.");
      }
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
    }
  };

  const handleEditField = (fieldName) => {
    setEditingField(fieldName);
  };
  const navigation = useNavigation(); // Initialize navigation

  const handleNavigateToInformation = () => {
    navigation.navigate("Informations"); // Navigate to the Information component
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User logged out successfully.");
        navigation.navigate("SignIn"); // Navigate to the sign-in page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#B69FEB" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <MaterialIcons
                  name="email"
                  size={18}
                  color="grey"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  onBlur={() => handleUpdateField("email", email)}
                  placeholder="Email"
                  editable={editingField === "email"}
                />
                <TouchableOpacity onPress={() => handleEditField("email")}>
                  <AntDesign
                    name="edit"
                    size={24}
                    color="#B69FEB"
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <AntDesign
                  name="pushpino"
                  size={18}
                  color="grey"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={bio}
                  onChangeText={(text) => setBio(text)}
                  onBlur={() => handleUpdateField("bio", bio)}
                  placeholder="Bio"
                  editable={editingField === "bio"}
                />
                <TouchableOpacity onPress={() => handleEditField("bio")}>
                  <AntDesign
                    name="edit"
                    size={24}
                    color="#B69FEB"
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <FontAwesome5
                  name="layer-group"
                  size={18}
                  color="grey"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={industry}
                  onChangeText={(text) => setIndustry(text)}
                  onBlur={() => handleUpdateField("industry", industry)}
                  placeholder="Industry"
                  editable={editingField === "industry"}
                />
                <TouchableOpacity onPress={() => handleEditField("industry")}>
                  <AntDesign
                    name="edit"
                    size={24}
                    color="#B69FEB"
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <MaterialIcons
                  name="business"
                  size={19}
                  color="grey"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={companyName}
                  onChangeText={(text) => setCompanyName(text)}
                  onBlur={() => handleUpdateField("companyName", companyName)}
                  placeholder="Company Name"
                  editable={editingField === "companyName"}
                />
                <TouchableOpacity
                  onPress={() => handleEditField("companyName")}
                >
                  <AntDesign
                    name="edit"
                    size={24}
                    color="#B69FEB"
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={handleNavigateToInformation}>
                <View style={styles.inputBox}>
                  <Ionicons
                    name="information"
                    size={19}
                    color="grey"
                    style={styles.icon}
                  />
                  <Text style={styles.input}>More Content Here...</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <Text style={styles.input} onPress={handleLogout}>
                  Log out
                </Text>
                <Feather
                  name="log-out"
                  size={24}
                  color="black"
                  style={styles.editIcon}
                />
              </View>
            </View>
            <View style={[styles.inputContainer, styles.lastInputContainer]}>
              <View style={styles.inputBox}>
                <Ionicons
                  name="information"
                  size={19}
                  color="grey"
                  style={styles.icon}
                />
                <Text style={styles.input}>More Informations..</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
    overflow: "hidden", // Hide overflow content
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  lastInputContainer: {
    marginBottom: 0,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  editIcon: {
    marginLeft: 10,
  },
  input: {
    color: "black",
    flex: 1,
    fontSize: 16,
    fontFamily: "Roboto",
    marginTop: 10,
  },
});

export default Details;
