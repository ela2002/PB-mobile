import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import PostCard from "../Insightzone/PostCard";

const Userpost = () => {
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchPosts(user.uid);
      } else {
        setUserId(null);
        setPosts([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPosts = async (userId) => {
    try {
      const q = query(
        collection(firestore, "posts"),
        where("uid", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map((doc) => {
        const post = doc.data();
        const timestamp = post.timestamp.toDate();
        const timeAgo = getTimeAgo(timestamp);
        return { id: doc.id, ...post, timeAgo };
      });
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const seconds = Math.floor((now - timestamp) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return `${interval}y ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval}mo ago`;
    }
    interval = Math.floor(seconds / 604800);
    if (interval > 1) {
      return `${interval}w ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval}d ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval}h ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval}min ago`;
    }
    return `${Math.floor(seconds)}s ago`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.noUserContainer}>
        <Text>No user signed in.</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.noPostsContainer}>
        <Text>No posts yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {posts.map((post) => (
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

export default Userpost;
