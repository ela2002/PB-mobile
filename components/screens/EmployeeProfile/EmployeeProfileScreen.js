import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import ProfileHeader from "../../EmployeeProfile/ProfileHeader";
import BottomProfile from "../../EmployeeProfile/BottomProfile";
import Details from "../../EmployeeProfile/Details";
import Userpost from "../../EmployeeProfile/Userpost";
import Liked from "../../EmployeeProfile/Liked";
import Saved from "../../EmployeeProfile/Saved";

const EmployeeProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("Details");

  let activeComponent;

  switch (activeTab) {
    case "Details":
      activeComponent = <Details />;
      break;
    case "Userpost":
      activeComponent = <Userpost />;
      break;
    case "liked":
      activeComponent = <Liked />;
      break;
    case "saved":
      activeComponent = <Saved />;
      break;
    default:
      activeComponent = null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProfileHeader />
        <BottomProfile setActiveTab={setActiveTab} />
        {activeComponent}
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
