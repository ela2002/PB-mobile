import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import JobCard from "../../Jobs/JobCard";
import CompanyCard from "../../CompanyProfile/CompanyCard";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const navigation = useNavigation();

  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const companiesSnapshot = await getDocs(
        collection(firestore, "companiesprofile")
      );
      const companiesData = companiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompanies(companiesData);
      setLoadingCompanies(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setLoadingCompanies(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      let jobsCollection = collection(firestore, "jobs");
      const jobsSnapshot = await getDocs(jobsCollection);
      const jobsData = [];

      for (const jobDoc of jobsSnapshot.docs) {
        const jobData = jobDoc.data();

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

          const jobWithCompany = {
            id: jobDoc.id,
            ...jobData,
            companyName: companyData.companyName,
            companyLogoUrl: companyData.profilePic,
          };

          jobsData.push(jobWithCompany);
        } else {
          console.error(`Company data not found for companyId: ${companyId}`);
        }
      }

      setJobs(jobsData);
      setLoadingJobs(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchJobs();
  }, []);

  const handleCardPress = (companyId) => {
    navigation.navigate("CompanyDetail", { companyId: companyId });
  };
  const handleJobPress = (jobId) => {
    navigation.navigate("JobDetail", { jobId: jobId }); // Navigate to JobDetail with jobId
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchText);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Fetch and display data based on the selected option
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a company or job..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navigationOption,
            selectedOption === "jobs" && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect("jobs")}
        >
          <Text style={styles.navigationOptionText}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navigationOption,
            selectedOption === "companies" && styles.selectedOption,
          ]}
          onPress={() => handleOptionSelect("companies")}
        >
          <Text style={styles.navigationOptionText}>Companies</Text>
        </TouchableOpacity>
      </View>
      {selectedOption === "jobs" ? (
        <View>
          {loadingJobs ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loadingIndicator}
            />
          ) : jobs.length === 0 ? (
            <Text>No jobs available</Text>
          ) : (
            <FlatList
              data={jobs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleJobPress(item.id)}>
                  <JobCard
                    job={item}
                    company={companies.find(
                      (company) => company.uid === item.companyId
                    )}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      ) : (
        <View>
          {loadingCompanies ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loadingIndicator}
            />
          ) : companies.length === 0 ? (
            <Text>No companies available</Text>
          ) : (
            <FlatList
              data={companies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCardPress(item.id)}>
                  <CompanyCard company={item} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 130,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#8172E8",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  navigationOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#d5d5d5",
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: "#B69FEB",
  },
  navigationOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
});

export default SearchScreen;
