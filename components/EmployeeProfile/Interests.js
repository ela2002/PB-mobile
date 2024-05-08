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
  getDocs,
} from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";

const Interests = () => {
  const [interests, setInterests] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    interest: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const interestsCollection = collection(
            firestore,
            `employeesprofile/${userUid}/interests`
          );
          const querySnapshot = await getDocs(interestsCollection);
          const interestsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setInterests(interestsData);
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
  const handleAddInterest = () => {
    setShowForm(true);
  };

  const handleSaveInterest = async () => {
    try {
      const { interest, tags } = formData;

      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const interestsCollection = collection(
        firestore,
        `employeesprofile/${userUid}/interests`
      );
      const docRef = await addDoc(interestsCollection, {
        interest,
        tags,
      });

      console.log("Interest added successfully with ID: ", docRef.id);

      setInterests([...interests, { id: docRef.id, ...formData }]);
      setFormData({
        interest: "",
        tags: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding interest: ", error);
    }
  };

  const handleEditInterest = async (index, field, value) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const interestRef = doc(
        firestore,
        `employeesprofile/${userUid}/interests/${interests[index].id}`
      );
      await updateDoc(interestRef, { [field]: value });

      console.log("Interest updated successfully");

      const updatedInterests = [...interests];
      updatedInterests[index][field] = value;
      setInterests(updatedInterests);
    } catch (error) {
      console.error("Error updating interest: ", error);
    }
  };

  const handleDeleteInterest = async (index) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const interestRef = doc(
        firestore,
        `employeesprofile/${userUid}/interests/${interests[index].id}`
      );
      await deleteDoc(interestRef);

      console.log("Interest deleted successfully");

      const updatedInterests = [...interests];
      updatedInterests.splice(index, 1);
      setInterests(updatedInterests);
    } catch (error) {
      console.error("Error deleting interest: ", error);
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
      const interestRef = doc(
        firestore,
        `employeesprofile/${userUid}/interests/${interests[index].id}`
      );
      await updateDoc(interestRef, interests[index]);

      console.log("Interest updated successfully");

      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving edit: ", error);
    }
  };

  const renderInterestItem = ({ item, index }) => (
    <View key={index} style={styles.interestContainer}>
      <TextInput
        style={styles.input}
        value={item.interest}
        onChangeText={(text) => handleEditInterest(index, "interest", text)}
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.tags.join(", ")}
        onChangeText={(text) =>
          handleEditInterest(index, "tags", text.split(", "))
        }
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
          <TouchableOpacity onPress={() => handleDeleteInterest(index)}>
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
      <TouchableOpacity onPress={handleAddInterest}>
        <View style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#B69FEB" />
          <Text style={styles.addText}>Add Interest</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={interests}
        renderItem={renderInterestItem}
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
            <Text style={styles.modalHeaderText}>Add Interest</Text>
            <TextInput
              style={[styles.input, styles.largeInput]} // Adjusted styles for larger input
              placeholder="Interest"
              value={formData.interest}
              onChangeText={(text) =>
                setFormData({ ...formData, interest: text })
              }
              multiline={true} // Allow multiline input
              numberOfLines={4} // Set number of lines
            />
            <TextInput
              style={styles.input}
              placeholder="Tags"
              value={formData.tags.join(", ")}
              onChangeText={(text) =>
                setFormData({ ...formData, tags: text.split(", ") })
              }
            />
            <TouchableOpacity onPress={handleSaveInterest}>
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
  interestContainer: {
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
  largeInput: {
    height: 120, // Adjust height for larger input
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
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Interests;
