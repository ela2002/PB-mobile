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

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    organization: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userUid = user.uid;
          const certificationsCollection = collection(
            firestore,
            `employeesprofile/${userUid}/certifications`
          );
          const querySnapshot = await getDocs(certificationsCollection);
          const certificationsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCertifications(certificationsData);
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

  const handleAddCertification = () => {
    setShowForm(true);
  };

  const handleSaveCertification = async () => {
    try {
      const { title, date, organization, tags } = formData;

      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const certificationsCollection = collection(
        firestore,
        `employeesprofile/${userUid}/certifications`
      );
      const docRef = await addDoc(certificationsCollection, {
        title,
        date,
        organization,
        tags,
      });

      console.log("Certification added successfully with ID: ", docRef.id);

      setCertifications([...certifications, { id: docRef.id, ...formData }]);
      setFormData({
        title: "",
        date: "",
        organization: "",
        tags: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding certification: ", error);
    }
  };

  const handleEditCertification = async (index, field, value) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const certificationRef = doc(
        firestore,
        `employeesprofile/${userUid}/certifications/${certifications[index].id}`
      );
      await updateDoc(certificationRef, { [field]: value });

      console.log("Certification updated successfully");

      const updatedCertifications = [...certifications];
      updatedCertifications[index][field] = value;
      setCertifications(updatedCertifications);
    } catch (error) {
      console.error("Error updating certification: ", error);
    }
  };

  const handleDeleteCertification = async (index) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const userUid = user.uid;
      const certificationRef = doc(
        firestore,
        `employeesprofile/${userUid}/certifications/${certifications[index].id}`
      );
      await deleteDoc(certificationRef);

      console.log("Certification deleted successfully");

      const updatedCertifications = [...certifications];
      updatedCertifications.splice(index, 1);
      setCertifications(updatedCertifications);
    } catch (error) {
      console.error("Error deleting certification: ", error);
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
      const certificationRef = doc(
        firestore,
        `employeesprofile/${userUid}/certifications/${certifications[index].id}`
      );
      await updateDoc(certificationRef, certifications[index]);

      console.log("Certification updated successfully");

      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving edit: ", error);
    }
  };

  const renderCertificationItem = ({ item, index }) => (
    <View key={index} style={styles.certificationContainer}>
      <TextInput
        style={styles.input}
        value={item.title}
        onChangeText={(text) => handleEditCertification(index, "title", text)}
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.date}
        onChangeText={(text) => handleEditCertification(index, "date", text)}
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.organization}
        onChangeText={(text) =>
          handleEditCertification(index, "organization", text)
        }
        editable={editingIndex === index}
      />
      <TextInput
        style={styles.input}
        value={item.tags.join(", ")}
        onChangeText={(text) =>
          handleEditCertification(index, "tags", text.split(", "))
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
          <TouchableOpacity onPress={() => handleDeleteCertification(index)}>
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
      <TouchableOpacity onPress={handleAddCertification}>
        <View style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#B69FEB" />
          <Text style={styles.addText}>Add Certification</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={certifications}
        renderItem={renderCertificationItem}
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
            <Text>Add Certification</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Organization"
              value={formData.organization}
              onChangeText={(text) =>
                setFormData({ ...formData, organization: text })
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
            <TouchableOpacity onPress={handleSaveCertification}>
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
  certificationContainer: {
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

export default Certifications;
