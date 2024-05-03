import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const CompanyNavBar = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[
          styles.navItem,
          activeTab === "overview" && styles.activeNavItem,
        ]}
        onPress={() => setActiveTab("overview")}
      >
        <Text
          style={[
            styles.navText,
            activeTab === "overview" && styles.activeNavText,
          ]}
        >
          Overview
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navItem,
          activeTab === "reviews" && styles.activeNavItem,
        ]}
        onPress={() => setActiveTab("reviews")}
      >
        <Text
          style={[
            styles.navText,
            activeTab === "reviews" && styles.activeNavText,
          ]}
        >
          Reviews
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, activeTab === "jobs" && styles.activeNavItem]}
        onPress={() => setActiveTab("jobs")}
      >
        <Text
          style={[styles.navText, activeTab === "jobs" && styles.activeNavText]}
        >
          Jobs
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

export default CompanyNavBar;
