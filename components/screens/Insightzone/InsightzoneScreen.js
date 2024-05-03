import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Navbar from "../../navbar/Navbar";
import PostCard from "../../Insightzone/PostCard";
import {
  collection,
  getFirestore,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

const InsightzoneScreen = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true); // Set loading to true when fetching starts
    const db = getFirestore();
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const fetchedPosts = [];
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const timestamp = post.timestamp.toDate();
      const timeAgo = getTimeAgo(timestamp);
      fetchedPosts.push({ id: doc.id, ...post, timeAgo });
    });
    setPosts(fetchedPosts);
    setLoading(false); // Set loading to false when fetching is completed
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <Navbar />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingIndicator}
          />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostCard post={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    marginTop: 30,
    marginBottom: 126,
    flex: 1,
  },
  loadingIndicator: {
    marginTop: 50,
  },
});

export default InsightzoneScreen;
