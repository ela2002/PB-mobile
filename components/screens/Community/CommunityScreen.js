import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../../firebase/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";

const CommunityScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    bio: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [uniqueParticipantIds, setUniqueParticipantIds] = useState([]);
  const navigation = useNavigation();

  const handleDiscoverParticipant = (participant) => {
    navigation.navigate("participantdetail", { employeeId: participant.id });
    console.log(participant.id);
  };

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "chatrooms"));
        const chatroomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          bio: doc.data().bio,
          image: doc.data().image,
          participants: doc.data().participants,
          joined: false,
        }));
        setChatrooms(chatroomsData);
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
      }
    };

    fetchChatrooms();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "employeesprofile")
        );
        const participantsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          fullName: doc.data().fullName,
          bio: doc.data().bio,
          profilePicture: doc.data().profilePicture,
          recommend: doc.data().recommend,
          Unrecommend: doc.data().Unrecommend,
        }));

        // Filter out the current user's profile
        const filteredParticipants = participantsData.filter(
          (participant) => participant.id !== currentUser.uid
        );

        // Get unique participant IDs
        const uniqueIds = Array.from(
          new Set(filteredParticipants.map((participant) => participant.id))
        );
        setUniqueParticipantIds(uniqueIds);

        setParticipants(filteredParticipants);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, [currentUser]);

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFormValues({ ...formValues, image: result.uri });
    }
  };

  const handleCreateChatroom = async () => {
    setLoading(true);

    try {
      let imageURI = null;
      if (formValues.image) {
        // Upload image to Firebase Storage
        imageURI = await uploadImage(formValues.image);
      }

      // Add chatroom to Firestore
      const docRef = await addDoc(collection(firestore, "chatrooms"), {
        name: formValues.name,
        bio: formValues.bio,
        image: imageURI,
        participants: [],
      });

      console.log("Chatroom created with ID: ", docRef.id);

      setFormValues({ name: "", bio: "", image: null });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating chatroom:", error);
    }

    setLoading(false);
  };

  const uploadImage = async (imageURI) => {
    try {
      const storage = getStorage();
      const imageName = imageURI.substring(imageURI.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `images/${imageName}`);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      return getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  const handleJoinChatroom = async (chatroomId) => {
    try {
      const chatroomRef = doc(firestore, "chatrooms", chatroomId);
      const chatroomSnapshot = await getDoc(chatroomRef);
      const chatroomData = chatroomSnapshot.data();

      // Check if the current user is already a participant in the chatroom
      if (chatroomData.participants.includes(currentUser.uid)) {
        console.log("You have already joined this chatroom");
        navigation.navigate("ChatListScreen", { chatroomId });

        return;
      }

      // Update the participants array in the chatroom document
      await updateDoc(chatroomRef, {
        participants: arrayUnion(currentUser.uid),
      });

      // Add the chatroom to the chatrooms state if it's not already included
      if (!chatrooms.some((room) => room.id === chatroomId)) {
        setChatrooms((prevChatrooms) => [
          ...prevChatrooms,
          { id: chatroomId, ...chatroomData },
        ]);
      }

      console.log("You have joined the chatroom successfully");
      navigation.navigate("ChatListScreen", { chatroomId });
    } catch (error) {
      console.error("Error joining chatroom:", error);
    }
  };

  const renderChatroomCard = ({ item }) => (
    <TouchableOpacity
      style={styles.chatroomCard}
      onPress={() => handleJoinChatroom(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.chatroomImage} />
      <View style={styles.chatroomInfo}>
        <Text style={styles.chatroomName}>{item.name}</Text>
        <Text style={styles.bio}>{item.bio}</Text>
        <Text
          style={styles.participants}
        >{`${item.participants.length} participants`}</Text>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinChatroom(item.id)}
          disabled={item.joined}
        >
          <Text style={styles.joinText}>{item.joined ? "Joined" : "Join"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderParticipantCard = ({ item }) => {
    // Check if the participant ID is included in the unique participant IDs
    if (!uniqueParticipantIds.includes(item.id)) {
      return null; // Skip rendering if the participant ID is not unique
    }
    const handleNetworkPress = (participant) => {
      navigation.navigate("ChatListScreen", { employeeId: participant.id });
    };

    return (
      <View style={styles.participantContainer}>
        <TouchableOpacity style={styles.participantCard}>
          <Image
            source={{
              uri:
                item.profilePicture ||
                "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg",
            }}
            alt="img"
            style={styles.participantImage}
          />
          <Text style={styles.fullName}>{item.fullName}</Text>
          <Text style={styles.fullName}>{item.jobTitle}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.discoverButton}
              onPress={() => handleDiscoverParticipant(item)}
            >
              <Text style={styles.recommended}>Discover</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.networkButton}
              onPress={() => handleNetworkPress(item)}
            >
              <Text style={styles.unrecommended}>Network</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowCreateForm(true)}
      >
        <Text style={styles.addText}>Create Chatroom</Text>
      </TouchableOpacity>
      {showCreateForm && (
        <View style={styles.createForm}>
          <TextInput
            style={styles.input}
            placeholder="Chatroom Name"
            value={formValues.name}
            onChangeText={(text) =>
              setFormValues({ ...formValues, name: text })
            }
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline={true}
            numberOfLines={4}
            value={formValues.bio}
            onChangeText={(text) => setFormValues({ ...formValues, bio: text })}
          />
          <TouchableOpacity
            style={styles.imageInputButton}
            onPress={handleChooseImage}
          >
            <Text style={styles.imageInputButtonText}>Choose Image</Text>
          </TouchableOpacity>
          {formValues.image && (
            <Image
              source={{ uri: formValues.image.uri }}
              style={styles.selectedImage}
            />
          )}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateChatroom}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={chatrooms}
        renderItem={renderChatroomCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        style={styles.first}
      />
      <Text style={styles.discoverTitle}>DISCOVER POTENTIAL CONNECTIONS</Text>
      <FlatList
        data={participants}
        renderItem={renderParticipantCard}
        keyExtractor={(item) => item.id}
        horizontal={false}
        contentContainerStyle={styles.participantContainer}
        numColumns={2}
      />
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
    marginTop: 0,
    marginBottom: 60,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  chatroomCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8,
    width: windowWidth - 40,
    height: 175,
    marginBottom: 50,
    elevation: 3,
  },
  first: {
    marginTop: 0,
  },
  second: {
    marginTop: 50,
  },
  chatroomImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  chatroomInfo: {
    flex: 1,
  },
  chatroomName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  bio: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  participants: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: "#B69FEB",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  joinText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#B69FEB",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createForm: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    width: windowWidth - 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
  },
  imageInputButton: {
    backgroundColor: "#B69FEB",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 5,
  },
  imageInputButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#B69FEB",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  createText: {
    color: "#fff",
    fontWeight: "bold",
  },
  discoverTitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 70,
    marginTop: 20,
    color: "#B69FEB",
  },
  participantContainer: {
    paddingHorizontal: 8,
    marginTop: 0,
    flexGrow: 1,
  },
  participantCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    width: windowWidth / 2 - 47,
    height: 160, // Set a fixed height for equal size
    marginRight: 10,
  },
  participantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
    //marginLeft:50,
    alignSelf: "center", // Center the image horizontally
  },
  fullName: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  discoverButton: {
    backgroundColor: "#A7BEE1",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  networkButton: {
    backgroundColor: "#A7BEE1",
    padding: 5,
    borderRadius: 5,
  },
  recommended: {
    color: "#fff",
    fontSize: 12,
  },
  unrecommended: {
    color: "#fff",
    fontSize: 12,
  },
});

export default CommunityScreen;
