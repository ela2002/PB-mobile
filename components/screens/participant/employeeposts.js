import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import PostCard from "../../Insightzone/PostCard";

const Employeeposts = ({ employee }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [employee]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(firestore, "posts"),
        where("uid", "==", employee.uid)
      );
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => {
        const postData = doc.data();
        const timestamp = postData.timestamp.toDate();
        const timeAgo = getTimeAgo(timestamp);

        return { id: doc.id, ...postData, timeAgo };
      });
      setPosts(postsData);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
    <SafeAreaView style={styles.container}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Employeeposts;
