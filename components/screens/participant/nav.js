import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const ParticipantNavBar = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[
          styles.navItem,
          activeTab === "detailss" && styles.activeNavItem,
        ]}
        onPress={() => setActiveTab("detailss")}
      >
        <Text
          style={[
            styles.navText,
            activeTab === "detailss" && styles.activeNavText,
          ]}
        >
          Details
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, activeTab === "posts" && styles.activeNavItem]}
        onPress={() => setActiveTab("posts")}
      >
        <Text
          style={[
            styles.navText,
            activeTab === "posts" && styles.activeNavText,
          ]}
        >
          Posts
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    elevation: 3,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  activeNavItem: {
    backgroundColor: "#B69FEB",
    borderRadius: 10,
  },
  navText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  activeNavText: {
    color: "#fff",
  },
});

export default ParticipantNavBar;
