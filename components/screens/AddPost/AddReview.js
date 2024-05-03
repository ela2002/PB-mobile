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
} from "react-native";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/firebase";

const AddReview = ({ route, navigation }) => {
  const { companyId } = route.params;
  const [fullName, setFullName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState("");
  const [anonymous, setAnonymous] = useState(false);

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
            setFullName(userData.fullName || "");
            // You can set other user data as needed
          } else {
            console.error("User data not found for UID:", userUid);
          }
        } else {
          console.log("No user signed in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitReview = async () => {
    try {
      const reviewsRef = collection(
        firestore,
        `companiesprofile/${companyId}/reviews`
      );
      const reviewData = {
        userId: auth.currentUser.uid,
        username: fullName,
        comment,
        rating: parseInt(rating),
        date: new Date(),
        likes: 0,
        saved: false,
        tags: tags.split(",").map((tag) => tag.trim()),
        anonymous,
      };
      await addDoc(reviewsRef, reviewData);
      setComment("");
      setRating(0);
      setTags("");
      setAnonymous(false);

      // Navigate to the company detail page after successfully adding the review
      navigation.navigate("CompanyDetail", { companyId });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

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
                rating === value ? styles.selectedRating : null,
              ]}
              onPress={() => setRating(value)}
            >
              <Text>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="Write your review..."
          multiline
        />
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="Add tags (comma-separated)"
        />
        <View style={styles.anonymousContainer}>
          <Text>Anonymous:</Text>
          <Switch value={anonymous} onValueChange={setAnonymous} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmitReview}>
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    width: 300,
    height: 500,
    borderRadius: 10,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  ratingContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  ratingButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
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
});

export default AddReview;
