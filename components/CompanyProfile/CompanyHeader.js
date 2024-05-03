import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import StarRating from "./StarRating";

const CompanyHeader = ({ company, onRecommend, onUnrecommend }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={{ uri: company.profilePic }} />
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{company.companyName}</Text>
          <Text style={styles.industry}>Industry: {company.industry}</Text>
          <StarRating rating={company.globalRating} />
          <Text style={styles.location}>Location: {company.location}</Text>
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.recommend}>
          Recommendations: {company.recommended}
        </Text>
        <Text style={styles.unrecommend}>
          Unrecommendations: {company.unrecommended}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onRecommend}>
          <Text style={styles.buttonText}>Recommend</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onUnrecommend}>
          <Text style={styles.buttonText}>Unrecommend</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 20,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginRight: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  industry: {
    fontSize: 18,
    marginBottom: 5,
  },
  globalRating: {
    fontSize: 18,
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  recommend: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  unrecommend: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#B69FEB",
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
  },
});

export default CompanyHeader;
