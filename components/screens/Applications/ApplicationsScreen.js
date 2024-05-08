import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { firestore, auth } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ApplicationsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const applicationsRef = collection(firestore, "applications");
        const querySnapshot = await getDocs(
          query(applicationsRef, where("userId", "==", user.uid))
        );
        const fetchedApplications = [];
        querySnapshot.forEach((doc) => {
          fetchedApplications.push({ id: doc.id, ...doc.data() });
        });
        setApplications(fetchedApplications);
      }
      setLoading(false);
      setRefreshing(false); // Set refreshing to false after fetching applications
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
      setRefreshing(false); // Set refreshing to false in case of error
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true); // Set refreshing to true when refresh starts
    fetchApplications();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Applications</Text>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.applicationItem}>
            <View style={styles.header}>
              <Image
                source={{ uri: item.companyPic }}
                style={styles.companyLogo}
              />
              <View style={styles.headerText}>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                <Text style={styles.companyName}>{item.companyName}</Text>
                <Text style={styles.companyName}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.appliedAt}>
              Applied At: {item.appliedAt.toDate().toLocaleString()}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#B69FEB"]} // Color of the refresh indicator
            tintColor="#B69FEB" // Color of the refresh indicator on iOS
          />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#B69FEB" />
          ) : (
            <Text>No applications found.</Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8172E8",
    textAlign: "center",
    marginBottom: 20,
  },
  applicationItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow radius
    elevation: 5, // Elevation for Android
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyName: {
    fontSize: 16,
    color: "#666",
  },
  appliedAt: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});

export default ApplicationsScreen;
