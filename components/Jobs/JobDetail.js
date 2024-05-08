import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { firestore, auth } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const JobDetail = ({ route }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false); // State to track if application submitted

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDocRef = doc(firestore, "jobs", jobId);
        const jobSnap = await getDoc(jobDocRef);

        if (jobSnap.exists()) {
          const jobData = jobSnap.data();
          setJob(jobData);

          // Fetch company details based on companyId
          const companyId = jobData.companyId;
          const companyQuerySnapshot = await getDocs(
            query(
              collection(firestore, "companiesprofile"),
              where("uid", "==", companyId)
            )
          );

          if (!companyQuerySnapshot.empty) {
            const companyDoc = companyQuerySnapshot.docs[0];
            const companyData = companyDoc.data();
            setCompany(companyData);
          } else {
            console.log("No such company found!");
          }
        } else {
          console.log("No such job found!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    const checkIfApplied = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const applicationsRef = collection(firestore, "applications");
          const querySnapshot = await getDocs(
            query(
              applicationsRef,
              where("userId", "==", user.uid),
              where("jobId", "==", jobId)
            )
          );
          if (!querySnapshot.empty) {
            setApplied(true);
          }
        }
      } catch (error) {
        console.error("Error checking if applied:", error);
      }
    };

    fetchJobDetails();
    checkIfApplied();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in.");
        return;
      }

      const applicationData = {
        jobId: jobId,
        jobTitle: job.title,
        userId: user.uid,
        status: "in progress",
        companyName: company.companyName,
        companyPic: company.profilePic,
        appliedAt: new Date(),
      };

      const docRef = await addDoc(
        collection(firestore, "applications"),
        applicationData
      );

      console.log(
        "Job application submitted successfully! Application ID:",
        docRef.id
      );
      Alert.alert("Success", "Job application submitted successfully!");
      setApplied(true); // Set applied to true after successful submission
    } catch (error) {
      console.error("Error submitting job application:", error);
      Alert.alert(
        "Error",
        "Failed to submit job application. Please try again later."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#B69FEB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {job && company && (
          <>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.company}>{company.companyName}</Text>
            <Image
              source={{ uri: company.profilePic }}
              style={styles.companyLogo}
            />
            <Text style={styles.location}>Location: {job.location}</Text>
            <Text style={styles.description}>{job.description}</Text>
            <Text style={styles.salary}>Salary: {job.salary}</Text>
            <Text style={styles.requirements}>Requirements:</Text>
            <View style={styles.requirementsList}>
              {job.requirements.map((requirement, index) => (
                <Text key={index} style={styles.requirement}>
                  {requirement}
                </Text>
              ))}
            </View>
            {!applied && ( // Render the Apply button only if not already applied
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            )}
            {applied && ( // Render a disabled Apply button if already applied
              <TouchableOpacity
                style={[styles.applyButton, styles.disabledButton]}
                disabled
              >
                <Text style={styles.applyButtonText}>Applied</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  company: {
    fontSize: 20,
    marginBottom: 10,
    color: "#666",
  },
  companyLogo: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 20,
  },
  location: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
  salary: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
  requirements: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
  },
  requirementsList: {
    marginLeft: 20,
    marginBottom: 20,
  },
  requirement: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666",
  },
  applyButton: {
    backgroundColor: "#B69FEB",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default JobDetail;
