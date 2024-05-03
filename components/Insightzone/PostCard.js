import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  updateDoc,
  doc,
  deleteDoc,
  query,
  collection,
  where,
  getDocs,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import * as ImagePicker from "expo-image-picker";

const formatTimestamp = (timestamp) => {
  const timeDifference = Date.now() - timestamp.toDate().getTime(); // Calculate time difference
  const secondsDifference = Math.floor(timeDifference / 1000); // Convert to seconds
  if (secondsDifference < 60) {
    return `${secondsDifference}s ago`;
  } else if (secondsDifference < 3600) {
    return `${Math.floor(secondsDifference / 60)}m ago`;
  } else if (secondsDifference < 86400) {
    return `${Math.floor(secondsDifference / 3600)}h ago`;
  } else if (secondsDifference < 604800) {
    return `${Math.floor(secondsDifference / 86400)}d ago`;
  } else if (secondsDifference < 2592000) {
    return `${Math.floor(secondsDifference / 604800)}w ago`;
  } else if (secondsDifference < 31536000) {
    return `${Math.floor(secondsDifference / 2592000)}mo ago`;
  } else {
    return `${Math.floor(secondsDifference / 31536000)}y ago`;
  }
};

const PostCard = ({ post }) => {
  const {
    uid,
    id,
    fullName,
    profilePicture,
    jobTitle,
    timestamp,
    text: initialText,
    image: initialImage,
    bookmarked,
  } = post;
  const [likePressed, setLikePressed] = useState(false);
  const [bookmarkPressed, setBookmarkPressed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [text, setText] = useState(initialText);
  const [image, setImage] = useState(initialImage);
  const [showEdit, setShowEdit] = useState(false);
  const [editedText, setEditedText] = useState(initialText);
  const [editedImage, setEditedImage] = useState(initialImage);
  const avatar = "../../assets/avatar.jpg";
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likesQuerySnapshot = await getDocs(
          collection(firestore, "posts", id, "likes")
        );
        const likesData = likesQuerySnapshot.docs.map((doc) => doc.data());
        setLikes(likesData);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    fetchLikes();
  }, [id]);

  const handleLikePress = async () => {
    try {
      const userUid = auth.currentUser.uid;
      const likeRef = doc(firestore, "posts", id, "likes", userUid);

      if (!likePressed) {
        // Add the user's UID to the likes subcollection
        await setDoc(likeRef, { id: userUid });
        setLikes([...likes, { id: userUid }]);
      } else {
        // Check if the like document exists before trying to delete it
        const likeDoc = await getDoc(likeRef);
        if (likeDoc.exists()) {
          // Remove the user's UID from the likes subcollection
          await deleteDoc(likeRef);
          setLikes(likes.filter((like) => like.id !== userUid));
        } else {
          console.warn("Like document does not exist.");
        }
      }

      setLikePressed(!likePressed);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleBookmarkPress = async () => {
    setBookmarkPressed(!bookmarkPressed);
    try {
      const postRef = doc(firestore, "posts", id);
      await updateDoc(postRef, { bookmarked: !bookmarkPressed });
    } catch (error) {
      console.error("Error updating bookmark status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const postRef = doc(firestore, "posts", id);
      await deleteDoc(postRef);
      console.log("Post deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPress = async () => {
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      const postRef = doc(firestore, "posts", id);
      // Update the post data in Firestore
      await updateDoc(postRef, { text: editedText, image: editedImage });
      // Close the edit mode
      setShowEdit(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleChooseImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        console.error("Permission to access camera roll is required!");
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!pickerResult.cancelled) {
        setEditedImage(pickerResult.uri);
      }
    } catch (error) {
      console.error("Error choosing image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={{ uri: profilePicture || avatar }}
          style={styles.profilePicture}
        />
        <View style={styles.userDetails}>
          <Text style={styles.fullName}>{fullName}</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
        </View>
      </View>
      {auth.currentUser.uid === uid && (
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setShowOptions(!showOptions)}
        >
          <FontAwesome name="ellipsis-v" size={24} color="black" />
        </TouchableOpacity>
      )}
      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleEditPress}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleDelete}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.postContent}>
        {showEdit ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editTextInput}
              value={editedText}
              onChangeText={setEditedText}
              multiline={true}
              placeholder="Edit your post"
            />
            {editedImage && (
              <Image source={{ uri: editedImage }} style={styles.editImage} />
            )}
            <TouchableOpacity
              style={styles.chooseImageButton}
              onPress={handleChooseImage}
            >
              <FontAwesome name="image" size={24} color="white" />
              <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.text}>{text}</Text>
            {image && (
              <Image source={{ uri: image }} style={styles.postImage} />
            )}
          </>
        )}
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.icon} onPress={handleLikePress}>
          <FontAwesome
            name={likePressed ? "heart" : "heart-o"}
            size={20}
            color={likePressed ? "red" : "#333"}
          />
          <Text style={styles.likeCount}>{likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={handleBookmarkPress}>
          <FontAwesome
            name={bookmarkPressed ? "bookmark" : "bookmark-o"}
            size={20}
            color={bookmarkPressed ? "black" : "#333"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: 355,
    marginLeft: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  fullName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  jobTitle: {
    color: "#666",
    marginBottom: 2,
  },
  timestamp: {
    color: "#666",
  },
  optionsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "transparent",
    padding: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  likeCount: {
    marginLeft: 5,
  },
  optionsContainer: {
    position: "absolute",
    top: 45,
    right: 10,
    zIndex: 3,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  optionButton: {
    padding: 10,
  },
  postContent: {
    marginBottom: 10,
  },
  text: {
    marginBottom: 5,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },

  likeCount: {
    marginLeft: 5,
    color: "#666",
  },
  bookmarkText: {
    marginLeft: 5,
    color: "#666",
  },
  editContainer: {
    marginBottom: 10,
  },
  editTextInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 100,
  },
  editImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 5,
  },
  chooseImageButton: {
    flexDirection: "row",
    backgroundColor: "#8172E8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#8172E8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 16 },
});

export default PostCard;
