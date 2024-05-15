// Liked.js
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import PostCard from "../Insightzone/PostCard";

const Liked = () => {
  const [userUid, setUserUid] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
        setLikedPosts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userUid) {
      fetchLikedPosts(userUid);
    }
  }, [userUid]);

  const fetchLikedPosts = async (userId) => {
    try {
      const likedPostsData = [];

      const postsQuerySnapshot = await getDocs(collection(firestore, "posts"));

      for (const postDoc of postsQuerySnapshot.docs) {
        const likesCollectionRef = collection(postDoc.ref, "likes");

        const likeDocSnapshot = await getDoc(doc(likesCollectionRef, userId));

        if (likeDocSnapshot.exists()) {
          likedPostsData.push({ id: postDoc.id, ...postDoc.data() });
        }
      }

      setLikedPosts(likedPostsData);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching liked posts:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userUid) {
    return (
      <View style={styles.noUserContainer}>
        <Text>No user signed in.</Text>
      </View>
    );
  }

  if (likedPosts.length === 0) {
    return (
      <View style={styles.noPostsContainer}>
        <Text>No liked posts yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {likedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUserContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginBottom: 80,
  },
});

export default Liked;
