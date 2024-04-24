// PostScreen.js
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PostCard from "./PostCard";

const PostScreen = () => {
  const posts = [
    {
      id: 1,
      postText: "This is the first post.",

      userName: "User1",
    },
    {
      id: 2,
      postText: "This is the second post.",

      userName: "User2",
    },
  ];

  const handleLike = (postId) => {
    console.log(`Liked post with ID ${postId}`);
  };

  const handleSave = (postId) => {
    console.log(`Saved post with ID ${postId}`);
  };

  return (
    <View style={styles.container}>
      <Text> hello ya broo winy el data </Text>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          postText={post.postText}
          userName={post.userName}
          onPressLike={() => handleLike(post.id)}
          onPressSave={() => handleSave(post.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default PostScreen;
