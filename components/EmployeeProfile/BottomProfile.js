import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const BottomProfile = ({ setActiveTab }) => {
  const [activeTab, setActiveTabLocal] = useState("Details");

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    setActiveTabLocal(tab);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Details" && styles.activeTab]}
        onPress={() => handleTabPress("Details")}
      >
        <Text style={styles.tabText}>Details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Userpost" && styles.activeTab]}
        onPress={() => handleTabPress("Userpost")}
      >
        <Text style={styles.tabText}>Posts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "liked" && styles.activeTab]}
        onPress={() => handleTabPress("liked")}
      >
        <Text style={styles.tabText}>Likes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "saved" && styles.activeTab]}
        onPress={() => handleTabPress("saved")}
      >
        <Text style={styles.tabText}>Saves</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#B69FEB",
    marginLeft: 20,
    marginRight: 20,
  },
  tabText: {
    fontSize: 16,
    color: "#555555",
  },
});

export default BottomProfile;
