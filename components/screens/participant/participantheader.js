import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const ParticipantHeader = ({ employee }) => {
  if (!employee) {
    return null; // or you can return a loading indicator or a message
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={{ uri: employee.profilePicture }}
          />
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{employee.fullName}</Text>
          <Text style={styles.industry}>{employee.jobTitle}</Text>
          <Text style={styles.work}> {employee.companyName}</Text>
          <Text style={styles.location}>{employee.bio}</Text>
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.recommend}>
          Recommendations: {employee.recommend}
        </Text>
        <Text style={styles.unrecommend}>
          Unrecommendations: {employee.Unrecommend}
        </Text>
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
    fontSize: 10,
    marginBottom: 5,
    color: "grey",
  },
  work: {
    fontSize: 15,
    marginBottom: 5,
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

export default ParticipantHeader;
