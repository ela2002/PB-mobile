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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
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
          const projectsCollection = collection(
            firestore,
            `employeesprofile/${userUid}/projects`
          );
          const querySnapshot = await getDocs(projectsCollection);
          const projectsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(projectsData);
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

  const handleAddProject = () => {
    setShowForm(true);
  };

  const handleSaveProject = async () => {
    try {
      const { title, description, tags } = formData;

      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const projectsCollection = collection(
        firestore,
        `employeesprofile/${userUid}/projects`
      );
      const docRef = await addDoc(projectsCollection, {
        title,
        description,
        tags,
      });

      console.log("Project added successfully with ID: ", docRef.id);

      setProjects([...projects, { id: docRef.id, ...formData }]);
      setFormData({
        title: "",
        description: "",
        tags: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  const handleEditProject = async (index, field, value) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const projectRef = doc(
        firestore,
        `employeesprofile/${userUid}/projects/${projects[index].id}`
      );
      await updateDoc(projectRef, { [field]: value });

      console.log("Project updated successfully");

      const updatedProjects = [...projects];
      updatedProjects[index][field] = value;
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error updating project: ", error);
    }
  };

  const handleDeleteProject = async (index) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const projectRef = doc(
        firestore,
        `employeesprofile/${userUid}/projects/${projects[index].id}`
      );
      await deleteDoc(projectRef);

      console.log("Project deleted successfully");

      const updatedProjects = [...projects];
      updatedProjects.splice(index, 1);
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error deleting project: ", error);
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
      const projectRef = doc(
        firestore,
        `employeesprofile/${userUid}/projects/${projects[index].id}`
      );
      await updateDoc(projectRef, projects[index]);

      console.log("Project updated successfully");

      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving edit: ", error);
    }
  };

  const renderProjectItem = ({ item, index }) => (
    <View key={index} style={styles.projectContainer}>
      <TextInput
        style={styles.input}
        value={item.title}
        onChangeText={(text) => handleEditProject(index, "title", text)}
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.description}
        onChangeText={(text) => handleEditProject(index, "description", text)}
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.tags.join(", ")}
        onChangeText={(text) =>
          handleEditProject(index, "tags", text.split(", "))
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
          <TouchableOpacity onPress={() => handleDeleteProject(index)}>
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
      <TouchableOpacity onPress={handleAddProject}>
        <View style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#B69FEB" />
          <Text style={styles.addText}>Add Project</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={projects}
        renderItem={renderProjectItem}
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
            <Text>Add Project</Text>
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
              placeholder="Tags"
              value={formData.tags.join(", ")}
              onChangeText={(text) =>
                setFormData({ ...formData, tags: text.split(", ") })
              }
            />
            <TouchableOpacity onPress={handleSaveProject}>
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
  projectContainer: {
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

export default Projects;
