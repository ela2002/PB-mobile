import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const formatTimestamp = (timestamp) => {
  const timeDifference = Date.now() - timestamp.toDate().getTime(); // Calculate time difference
  const secondsDifference = Math.floor(timeDifference / 1000); // Convert to seconds
  if (secondsDifference < 60) {
    return `${secondsDifference}s ago`;
  } else if (secondsDifference < 3600) {
    return `${Math.floor(secondsDifference / 60)}m ago`;
  } else if (secondsDifference < 86400) {
    return `${Math.floor(secondsDifference / 3600)}h ago`;
  } else if (secondsDifference < 604800) {
    return `${Math.floor(secondsDifference / 86400)}d ago`;
  } else if (secondsDifference < 2592000) {
    return `${Math.floor(secondsDifference / 604800)}w ago`;
  } else if (secondsDifference < 31536000) {
    return `${Math.floor(secondsDifference / 2592000)}mo ago`;
  } else {
    return `${Math.floor(secondsDifference / 31536000)}y ago`;
  }
};
const JobCard = ({ job, company }) => {
  const postedDate = formatTimestamp(job.postedDate); // Directly use job.postedDate

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: company.profilePic }}
          style={styles.companyLogo}
        />
        <Text style={styles.companyName}>{company.companyName}</Text>
        <Text style={styles.postedDate}>{postedDate}</Text>
      </View>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.location}>{job.location}</Text>
      <Text style={styles.location}>{job.Salary}</Text>
      <View style={styles.tagsContainer}>
        {job.requirements.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            #{tag}
          </Text>
        ))}
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
    justifyContent: "space-between", // Add justifyContent to align items horizontally
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  companyName: {
    fontSize: 14,
    color: "#666",
    flex: 1, // Add flex: 1 to allow companyName to take remaining space
  },
  postedDate: {
    fontSize: 12,
    color: "#666",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },
  location: {
    color: "#666",
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  tag: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 12,
  },
});

export default JobCard;
