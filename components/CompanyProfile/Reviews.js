import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReviewCard from "./ReviewCard";
import { firestore } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const Reviews = ({ companyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(
          firestore,
          `companiesprofile/${companyId}/reviews`
        );
        const querySnapshot = await getDocs(reviewsCollection);
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [companyId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleAddReview = () => {
    navigation.navigate("AddReview", { companyId: companyId });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAddReview} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Review</Text>
      </TouchableOpacity>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard key={review.id} review={review} companyId={companyId} />
        ))
      ) : (
        <View style={styles.noReviewsContainer}>
          <Text>No reviews available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noReviewsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#8172E8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Reviews;
