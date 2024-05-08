import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { firestore } from "../../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ParticipantHeader from "./participantheader";
import ParticipantNavBar from "./nav";
import Employeedetails from "./employeedetails";
import Employeeposts from "./employeeposts";

const ParticipantDetail = ({ route }) => {
  const { employeeId } = route.params;
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("detailss");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const employeeDocRef = doc(firestore, "employeesprofile", employeeId);
        const employeeSnap = await getDoc(employeeDocRef);

        if (employeeSnap.exists()) {
          const employeeData = employeeSnap.data(); // Corrected variable name
          setEmployee(employeeData); // Corrected variable name
        } else {
          console.log("No such employee found!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#B69FEB" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ParticipantHeader employee={employee} />
      <ParticipantNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "detailss" && <Employeedetails employeeId={employeeId} />}
      {activeTab === "posts" && <Employeeposts employee={employee} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ParticipantDetail;
