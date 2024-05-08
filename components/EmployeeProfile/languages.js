import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    language: "",
    proficiency: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const languagesCollection = collection(
            firestore,
            `employeesprofile/${userUid}/languages`
          );
          const querySnapshot = await getDocs(languagesCollection);
          const languagesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLanguages(languagesData);
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

  const handleAddLanguage = () => {
    setShowForm(true);
  };

  const handleSaveLanguage = async () => {
    try {
      const { language, proficiency } = formData;

      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const languagesCollection = collection(
        firestore,
        `employeesprofile/${userUid}/languages`
      );
      const docRef = await addDoc(languagesCollection, {
        language,
        proficiency,
      });

      console.log("Language added successfully with ID: ", docRef.id);

      setLanguages([...languages, { id: docRef.id, ...formData }]);
      setFormData({
        language: "",
        proficiency: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding language: ", error);
    }
  };

  const handleEditLanguage = async (index, field, value) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const languageRef = doc(
        firestore,
        `employeesprofile/${userUid}/languages/${languages[index].id}`
      );
      await updateDoc(languageRef, { [field]: value });

      console.log("Language updated successfully");

      const updatedLanguages = [...languages];
      updatedLanguages[index][field] = value;
      setLanguages(updatedLanguages);
    } catch (error) {
      console.error("Error updating language: ", error);
    }
  };

  const handleDeleteLanguage = async (index) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const languageRef = doc(
        firestore,
        `employeesprofile/${userUid}/languages/${languages[index].id}`
      );
      await deleteDoc(languageRef);

      console.log("Language deleted successfully");

      const updatedLanguages = [...languages];
      updatedLanguages.splice(index, 1);
      setLanguages(updatedLanguages);
    } catch (error) {
      console.error("Error deleting language: ", error);
    }
  };

  const handleSaveEdit = async (index) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const languageRef = doc(
        firestore,
        `employeesprofile/${userUid}/languages/${languages[index].id}`
      );
      await updateDoc(languageRef, languages[index]);

      console.log("Language updated successfully");

      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving edit: ", error);
    }
  };

  const renderLanguageItem = ({ item, index }) => (
    <View key={index} style={styles.languageContainer}>
      <TextInput
        style={styles.input}
        value={item.language}
        onChangeText={(text) => handleEditLanguage(index, "language", text)}
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.proficiency}
        onChangeText={(text) => handleEditLanguage(index, "proficiency", text)}
        editable={editingIndex === index}
      />
      {editingIndex === index ? (
        <TouchableOpacity onPress={() => handleSaveEdit(index)}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setEditingIndex(index)}>
            <Ionicons
              name="create-outline"
              size={20}
              color="grey"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteLanguage(index)}>
            <Ionicons
              name="trash-outline"
              size={20}
              color="red"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAddLanguage}>
        <View style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#B69FEB" />
          <Text style={styles.addText}>Add Language</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={languages}
        renderItem={renderLanguageItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal
        visible={showForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Add Language</Text>
            <TextInput
              style={styles.input}
              placeholder="Language"
              value={formData.language}
              onChangeText={(text) =>
                setFormData({ ...formData, language: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Proficiency"
              value={formData.proficiency}
              onChangeText={(text) =>
                setFormData({ ...formData, proficiency: text })
              }
            />
            <TouchableOpacity onPress={handleSaveLanguage}>
              <Text style={styles.add}>Add</Text>
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
  add: {
    alignItems: "center",
    color: "#B69FEB",
    borderRadius: 10,
    marginLeft: 20,
  },
  addText: {
    marginLeft: 10,
  },
  languageContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    color: "black",
    paddingVertical: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    marginHorizontal: 5,
  },
  saveButton: {
    color: "blue",
    marginLeft: 140,
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
});

export default Languages;
