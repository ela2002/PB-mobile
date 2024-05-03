import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native"; // Import SafeAreaView
import ProfileHeader from "../../EmployeeProfile/ProfileHeader";
import BottomProfile from "../../EmployeeProfile/BottomProfile";
import Details from "../../EmployeeProfile/Details"; // Import the Details component
import Userpost from "../../EmployeeProfile/Userpost"; // Import the Userpost component
import { auth, firestore } from "../../../firebase/firebase"; // Import the auth and firestore objects

const EmployeeProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("Details");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProfileHeader />
        <BottomProfile setActiveTab={setActiveTab} />
        {(activeTab === "Details" && <Details />) ||
          (activeTab === "Userpost" && <Userpost />)}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    marginTop: 30,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#E8E8E8",
  },
});

export default EmployeeProfileScreen;
