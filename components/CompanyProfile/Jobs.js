import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import JobCard from "../Jobs/JobCard";
import { firestore } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const Jobs = ({ company }) => {
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(
          collection(firestore, "jobs"),
          where("companyId", "==", company.uid)
        );
        const querySnapshot = await getDocs(q);
        const jobs = [];
        querySnapshot.forEach((doc) => {
          jobs.push({ id: doc.id, ...doc.data() });
        });
        setCompanyJobs(jobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [company]);

  const handleJobPress = (jobId) => {
    navigation.navigate("JobDetail", { jobId: jobId });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#B69FEB" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {companyJobs.length > 0 ? (
        companyJobs.map((job) => (
          <TouchableOpacity key={job.id} onPress={() => handleJobPress(job.id)}>
            <JobCard job={job} company={company} />
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No jobs available</Text>
        </View>
      )}
    </View>
  );
};

export default Jobs;
