// PostCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you have FontAwesome icons installed

const PostCard = ({ postText, userName, onPressLike, onPressSave }) => {
  return (
    <View style={styles.container}>
      {/* User Profile Pic */}
      <Image source={{ uri: 'https://media.internazionale.it/images/2016/02/04/120867-md.jpg' }} style={styles.profilePic} />

      {/* Username and Post Text */}
      <View style={styles.textContainer}>
        <Text style={styles.userName}>Jamila</Text>
        <Text style={styles.postText}>I want to thank microsoft for giving me the opprtunity tO work with , REALLY such a good company with a good atmospher</Text>
      </View>

      {/* Like and Save Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={onPressLike} style={styles.actionButton}>
          <FontAwesome name="heart" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressSave} style={styles.actionButton}>
          <FontAwesome name="bookmark" size={24} color="black" />
        </TouchableOpacity>
      </View>


      
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    margin:20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor:'white',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    marginBottom:60,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postText: {
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
  },
});

export default PostCard;
