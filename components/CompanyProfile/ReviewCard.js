import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import StarRating from "./StarRating";
import { FontAwesome } from "@expo/vector-icons";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  decrement,
} from "firebase/firestore";
import { firestore, auth, getDoc } from "../../firebase/firebase";

const ReviewCard = ({ review, companyId }) => {
  const [editing, setEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(review.comment);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedTags, setEditedTags] = useState(review.tags.join(", "));
  const [editedAnonymous, setEditedAnonymous] = useState(review.anonymous);
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [totalLikes, setTotalLikes] = useState(review.likes);

  useEffect(() => {
    setTotalLikes(review.likes);
    setLiked(review.liked);
    setSaved(review.saved);
  }, [review]);

  const renderUserInfo = () => {
    if (review.anonymous) {
      return <Text style={styles.userInfo}>Anonymous</Text>;
    } else {
      return (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>{review.username}</Text>
        </View>
      );
    }
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDelete = async () => {
    try {
      const reviewDocRef = doc(
        firestore,
        `companiesprofile/${companyId}/reviews`,
        review.id
      );
      await deleteDoc(reviewDocRef);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdateReview = async () => {
    try {
      const reviewDocRef = doc(
        firestore,
        `companiesprofile/${companyId}/reviews`,
        review.id
      );
      await updateDoc(reviewDocRef, {
        comment: editedComment,
        rating: parseInt(editedRating),
        tags: editedTags.split(",").map((tag) => tag.trim()),
        anonymous: editedAnonymous,
      });
      setEditing(false);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleLike = async () => {
    try {
      const reviewDocRef = doc(
        firestore,
        `companiesprofile/${companyId}/reviews`,
        review.id
      );

      if (!liked) {
        await updateDoc(reviewDocRef, { likes: increment(1), liked: true });
        setTotalLikes(totalLikes + 1);
      } else {
        const newTotalLikes = Math.max(0, totalLikes - 1);
        await updateDoc(reviewDocRef, { likes: newTotalLikes, liked: false });
        setTotalLikes(newTotalLikes);
      }

      setLiked(!liked);
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const handleSave = async () => {
    try {
      const reviewDocRef = doc(
        firestore,
        `companiesprofile/${companyId}/reviews`,
        review.id
      );

      await updateDoc(reviewDocRef, { saved: !saved });

      setSaved(!saved);
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  if (editing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text>Your Rating:</Text>
          <View style={styles.ratingContainer}>
            {[5, 4, 3, 2, 1, 0].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.ratingButton,
                  editedRating === value ? styles.selectedRating : null,
                ]}
                onPress={() => setEditedRating(value)}
              >
                <Text>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            value={editedComment}
            onChangeText={setEditedComment}
            placeholder="Write your review..."
            multiline
          />
          <TextInput
            style={styles.input}
            value={editedTags}
            onChangeText={setEditedTags}
            placeholder="Add tags (comma-separated)"
          />
          <View style={styles.anonymousContainer}>
            <Text>Anonymous:</Text>
            <Switch
              value={editedAnonymous}
              onValueChange={setEditedAnonymous}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdateReview}>
            <Text style={styles.buttonText}>Update Review</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      {renderUserInfo()}
      <View style={styles.ratingContainer}>
        <StarRating rating={review.rating} />
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
      <View style={styles.tagsContainer}>
        {review.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.icon} onPress={handleLike}>
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={20}
            color={liked ? "#FF5252" : "#333"}
          />
          <Text style={styles.likeCount}>{totalLikes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={handleSave}>
          <FontAwesome
            name={saved ? "bookmark" : "bookmark-o"}
            size={20}
            color={saved ? "#448AFF" : "#333"}
          />
        </TouchableOpacity>
      </View>
      {auth.currentUser.uid === review.userId && (
        <TouchableOpacity
          style={styles.optionsIcon}
          onPress={handleToggleOptions}
        >
          <FontAwesome name="ellipsis-v" size={20} color="#333" />
        </TouchableOpacity>
      )}
      {showOptions && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity style={styles.option} onPress={handleEdit}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleDelete}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  container: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginLeft: 10,
    marginTop: 5,
  },
  selectedRating: {
    backgroundColor: "#8172E8",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  anonymousContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#8172E8",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  comment: {
    marginBottom: 10,
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 10,
  },
  tag: {
    marginRight: 5,
    backgroundColor: "#eee",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    color: "#333",
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
  optionsIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  optionsMenu: {
    position: "absolute",
    top: 30,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 5,
    elevation: 3,
  },
  option: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default ReviewCard;
