import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Overview = ({ company }) => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionContent}>{company.description}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone Number</Text>
        <Text style={styles.sectionContent}>{company.phoneNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Website</Text>
        <Text style={styles.sectionContent}>{company.website}</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: "#666",
  },
});

export default Overview;
