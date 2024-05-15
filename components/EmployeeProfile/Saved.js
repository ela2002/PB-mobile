// Saved.js
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import PostCard from "../Insightzone/PostCard";

const Saved = () => {
  const [userUid, setUserUid] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
        setSavedPosts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userUid) {
      fetchSavedPosts(userUid);
    }
  }, [userUid]);

  const fetchSavedPosts = async (userId) => {
    try {
      const savedPostsData = [];

      const postsQuerySnapshot = await getDocs(collection(firestore, "posts"));

      for (const postDoc of postsQuerySnapshot.docs) {
        const savesCollectionRef = collection(postDoc.ref, "saves");

        const saveDocSnapshot = await getDoc(doc(savesCollectionRef, userId));

        if (saveDocSnapshot.exists()) {
          savedPostsData.push({ id: postDoc.id, ...postDoc.data() });
        }
      }

      setSavedPosts(savedPostsData);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching saved posts:", error);
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

  if (savedPosts.length === 0) {
    return (
      <View style={styles.noPostsContainer}>
        <Text>No saved posts yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {savedPosts.map((post) => (
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

export default Saved;
