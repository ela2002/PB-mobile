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

const AcademicBackground = () => {
  const [academicBackgrounds, setAcademicBackgrounds] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    duration: "",
    description: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const academicBackgroundsCollection = collection(
            firestore,
            `employeesprofile/${userUid}/academicBackground`
          );
          const querySnapshot = await getDocs(academicBackgroundsCollection);
          const academicBackgroundsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAcademicBackgrounds(academicBackgroundsData);
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

  const handleAddAcademicBackground = () => {
    setShowForm(true);
  };

  const handleSaveAcademicBackground = async () => {
    try {
      const { degree, institution, duration, description, tags } = formData;

      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const academicBackgroundsCollection = collection(
        firestore,
        `employeesprofile/${userUid}/academicBackground`
      );
      const docRef = await addDoc(academicBackgroundsCollection, {
        degree,
        institution,
        duration,
        description,
        tags,
      });

      console.log(
        "Academic background added successfully with ID: ",
        docRef.id
      );

      setAcademicBackgrounds([
        ...academicBackgrounds,
        { id: docRef.id, ...formData },
      ]);
      setFormData({
        degree: "",
        institution: "",
        duration: "",
        description: "",
        tags: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding academic background: ", error);
    }
  };

  const handleEditAcademicBackground = async (index, field, value) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const academicBackgroundRef = doc(
        firestore,
        `employeesprofile/${userUid}/academicBackground/${academicBackgrounds[index].id}`
      );
      await updateDoc(academicBackgroundRef, { [field]: value });

      console.log("Academic background updated successfully");

      const updatedAcademicBackgrounds = [...academicBackgrounds];
      updatedAcademicBackgrounds[index][field] = value;
      setAcademicBackgrounds(updatedAcademicBackgrounds);
    } catch (error) {
      console.error("Error updating academic background: ", error);
    }
  };

  const handleDeleteAcademicBackground = async (index) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const academicBackgroundRef = doc(
        firestore,
        `employeesprofile/${userUid}/academicBackground/${academicBackgrounds[index].id}`
      );
      await deleteDoc(academicBackgroundRef);

      console.log("Academic background deleted successfully");

      const updatedAcademicBackgrounds = [...academicBackgrounds];
      updatedAcademicBackgrounds.splice(index, 1);
      setAcademicBackgrounds(updatedAcademicBackgrounds);
    } catch (error) {
      console.error("Error deleting academic background: ", error);
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
      const academicBackgroundRef = doc(
        firestore,
        `employeesprofile/${userUid}/academicBackground/${academicBackgrounds[index].id}`
      );
      await updateDoc(academicBackgroundRef, academicBackgrounds[index]);

      console.log("Academic background updated successfully");

      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving edit: ", error);
    }
  };

  const renderAcademicBackgroundItem = ({ item, index }) => (
    <View key={index} style={styles.academicBackgroundContainer}>
      <TextInput
        style={styles.input}
        value={item.degree}
        onChangeText={(text) =>
          handleEditAcademicBackground(index, "degree", text)
        }
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.institution}
        onChangeText={(text) =>
          handleEditAcademicBackground(index, "institution", text)
        }
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.duration}
        onChangeText={(text) =>
          handleEditAcademicBackground(index, "duration", text)
        }
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.description}
        onChangeText={(text) =>
          handleEditAcademicBackground(index, "description", text)
        }
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.tags.join(", ")}
        onChangeText={(text) =>
          handleEditAcademicBackground(index, "tags", text.split(", "))
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
          <TouchableOpacity
            onPress={() => handleDeleteAcademicBackground(index)}
          >
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
      <TouchableOpacity onPress={handleAddAcademicBackground}>
        <View style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#B69FEB" />
          <Text style={styles.addText}>Add Academic Background</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={academicBackgrounds}
        renderItem={renderAcademicBackgroundItem}
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
            <Text>Add Academic Background</Text>
            <TextInput
              style={styles.input}
              placeholder="Degree"
              value={formData.degree}
              onChangeText={(text) =>
                setFormData({ ...formData, degree: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Institution"
              value={formData.institution}
              onChangeText={(text) =>
                setFormData({ ...formData, institution: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Duration"
              value={formData.duration}
              onChangeText={(text) =>
                setFormData({ ...formData, duration: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Tags"
              value={formData.tags.join(", ")}
              onChangeText={(text) =>
                setFormData({ ...formData, tags: text.split(", ") })
              }
            />
            <TouchableOpacity onPress={handleSaveAcademicBackground}>
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
    marginLeft: 50,
  },
  addText: {
    marginLeft: 10,
  },
  academicBackgroundContainer: {
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

export default AcademicBackground;
