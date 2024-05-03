import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import StarRating from "./StarRating";

const CompanyCard = ({ company, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: company.profilePic }}
          style={styles.companyLogo}
        />
        <View>
          <Text style={styles.companyName}>{company.companyName}</Text>
          <StarRating rating={company.globalRating} />
          <Text style={styles.industry}>{company.industry}</Text>
          <View style={styles.recommendationContainer}>
            <FontAwesome name="thumbs-o-up" size={20} color="#007bff" />
            <Text style={styles.recommended}>{company.recommended}</Text>
            <FontAwesome name="thumbs-o-down" size={20} color="#dc3545" />
            <Text style={styles.unrecommended}>{company.unrecommended}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  industry: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  recommendationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  recommended: {
    marginLeft: 5,
    marginRight: 10,
    color: "#007bff",
  },
  unrecommended: {
    color: "#dc3545",
  },
});

export default CompanyCard;
