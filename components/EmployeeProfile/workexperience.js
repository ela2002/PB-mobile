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
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";

const Workexperience = () => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    tags: [],
    company: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const workExperiencesCollection = collection(
            firestore,
            `employeesprofile/${userUid}/workExperiences`
          );
          const querySnapshot = await getDocs(workExperiencesCollection);
          const workExperiencesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWorkExperiences(workExperiencesData);
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

  const handleAddWorkExperience = () => {
    setShowForm(true);
  };

  const handleSaveWorkExperience = async () => {
    try {
      const { title, description, duration, tags, company } = formData;

      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const workExperiencesCollection = collection(
        firestore,
        `employeesprofile/${userUid}/workExperiences`
      );
      const docRef = await addDoc(workExperiencesCollection, {
        title,
        description,
        duration,
        tags,
        company,
      });

      console.log("Work experience added successfully with ID: ", docRef.id);

      setWorkExperiences([...workExperiences, { id: docRef.id, ...formData }]);
      setFormData({
        title: "",
        description: "",
        duration: "",
        tags: [],
        company: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding work experience: ", error);
    }
  };

  const handleEditWorkExperience = async (index, field, value) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const workExperienceRef = doc(
        firestore,
        `employeesprofile/${userUid}/workExperiences/${workExperiences[index].id}`
      );
      await updateDoc(workExperienceRef, { [field]: value });

      console.log("Work experience updated successfully");

      const updatedWorkExperiences = [...workExperiences];
      updatedWorkExperiences[index][field] = value;
      setWorkExperiences(updatedWorkExperiences);
    } catch (error) {
      console.error("Error updating work experience: ", error);
    }
  };

  const handleDeleteWorkExperience = async (index) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const workExperienceRef = doc(
        firestore,
        `employeesprofile/${userUid}/workExperiences/${workExperiences[index].id}`
      );
      await deleteDoc(workExperienceRef);

      console.log("Work experience deleted successfully");

      const updatedWorkExperiences = [...workExperiences];
      updatedWorkExperiences.splice(index, 1);
      setWorkExperiences(updatedWorkExperiences);
    } catch (error) {
      console.error("Error deleting work experience: ", error);
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
      const workExperienceRef = doc(
        firestore,
        `employeesprofile/${userUid}/workExperiences/${workExperiences[index].id}`
      );
      await updateDoc(workExperienceRef, workExperiences[index]);

      console.log("Work experience updated successfully");

      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving edit: ", error);
    }
  };

  const renderWorkExperienceItem = ({ item, index }) => (
    <View key={index} style={styles.workExperienceContainer}>
      <TextInput
        style={styles.input}
        value={item.title}
        onChangeText={(text) => handleEditWorkExperience(index, "title", text)}
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.description}
        onChangeText={(text) =>
          handleEditWorkExperience(index, "description", text)
        }
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.duration}
        onChangeText={(text) =>
          handleEditWorkExperience(index, "duration", text)
        }
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.company}
        onChangeText={(text) =>
          handleEditWorkExperience(index, "company", text)
        }
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.tags.join(", ")}
        onChangeText={(text) =>
          handleEditWorkExperience(index, "tags", text.split(", "))
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
          <TouchableOpacity onPress={() => handleDeleteWorkExperience(index)}>
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
      <TouchableOpacity onPress={handleAddWorkExperience}>
        <View style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#B69FEB" />
          <Text style={styles.addText}>Add Work Experience</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={workExperiences}
        renderItem={renderWorkExperienceItem}
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
            <Text>Add Work Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
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
              placeholder="Duration"
              value={formData.duration}
              onChangeText={(text) =>
                setFormData({ ...formData, duration: text })
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
            <TextInput
              style={styles.input}
              placeholder="Company"
              value={formData.company}
              onChangeText={(text) =>
                setFormData({ ...formData, company: text })
              }
            />
            <TouchableOpacity onPress={handleSaveWorkExperience}>
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
  workExperienceContainer: {
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

export default Workexperience;
