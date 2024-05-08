import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ProfileHeader from "./ProfileHeader";
import BottomProfile from "./BottomProfile";
import Details from "./deatiles"; // Import the Details component
import Userpost from "./userposts"; // Import the Userpost component
import { auth, firestore } from "../../firebase/firebase"; // Import the auth and firestore objects

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Details");

  return (
    <View style={styles.container}>
      <ProfileHeader />

      <BottomProfile setActiveTab={setActiveTab} />
      {(activeTab === "Details" && <Details />) ||
        (activeTab === "Userpost" && <Userpost />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8E8",
  },
});

export default Profile;
