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
  const [filters, setFilters] = useState({}); // State for filters
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
    if (selectedOption === "jobs") {
      // Search for jobs
      const filteredJobs = jobs.filter(
        (job) =>
          (job.title &&
            job.title.toLowerCase().includes(searchText.toLowerCase())) ||
          (job.location &&
            job.location.toLowerCase().includes(searchText.toLowerCase()))
        // Add more filters like salary if needed
      );
      setJobs(filteredJobs);
    } else if (selectedOption === "companies") {
      // Search for companies
      const filteredCompanies = companies.filter(
        (company) =>
          (company.companyName &&
            company.companyName
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (company.industry &&
            company.industry.toLowerCase().includes(searchText.toLowerCase()))
        // Add more filters like location if needed
      );
      setCompanies(filteredCompanies);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Fetch and display data based on the selected option
  };

  const handleApplyFilters = () => {
    // Get the selected filters
    const { location, companyName, Salary } = filters;

    // Filter jobs based on location, company name, and salary
    const filteredJobs = jobs.filter((job) => {
      // Check if job's location matches the selected location filter
      const locationMatch =
        !location ||
        (job.location &&
          job.location.toLowerCase().includes(location.toLowerCase()));

      // Check if job's company name matches the selected company name filter
      const companyNameMatch =
        !companyName ||
        (job.companyName &&
          job.companyName.toLowerCase().includes(companyName.toLowerCase()));

      // Check if job's salary matches the selected salary filter
      const SalaryMatch =
        !Salary ||
        (job.Salary && job.Salary.toLowerCase().includes(Salary.toLowerCase()));

      // Return true if all filter criteria match
      return locationMatch && companyNameMatch && SalaryMatch;
    });

    // Update the state variable with filtered jobs
    setJobs(filteredJobs);
  };

  const handleApplyCompanyFilters = () => {
    // Get the selected filters for companies
    const { industry, globalRating } = filters;

    // Filter companies based on industry and globalRating
    const filteredCompanies = companies.filter((company) => {
      // Check if company's industry matches the selected industry filter
      const industryMatch =
        !industry ||
        (company.industry &&
          company.industry.toLowerCase().includes(industry.toLowerCase()));

      // Check if company's globalRating matches the selected globalRating filter
      const globalRatingMatch =
        !globalRating || company.globalRating === parseInt(globalRating);

      // Return true if both filter criteria match
      return industryMatch && globalRatingMatch;
    });

    // Update the state variable with filtered companies
    setCompanies(filteredCompanies);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };
  const handleReset = () => {
    setSearchText("");
    setFilters({});
    // Refetch jobs and companies
    fetchJobs();
    fetchCompanies();
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
      {(selectedOption === "jobs" || selectedOption === "companies") && (
        <View style={styles.filterContainer}>
          {selectedOption === "jobs" && (
            <>
              <TextInput
                style={styles.filterInput}
                placeholder="Location"
                value={filters.location || ""}
                onChangeText={(text) => handleFilterChange("location", text)}
              />
              <TextInput
                style={styles.filterInput}
                placeholder="Salary"
                value={filters.Salary || ""}
                onChangeText={(text) => handleFilterChange("Salary", text)}
              />
              <TextInput
                style={styles.filterInput}
                placeholder="CompanyName"
                value={filters.companyName || ""}
                onChangeText={(text) => handleFilterChange("companyName", text)}
              />
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyFiltersButtonText}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={handleReset}
              >
                <Text style={styles.applyFiltersButtonText}>Reset</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedOption === "companies" && (
            <>
              <TextInput
                style={styles.filterInput}
                placeholder="Industry"
                value={filters.industry || ""}
                onChangeText={(text) => handleFilterChange("industry", text)}
              />
              <TextInput
                style={styles.filterInput}
                placeholder="Rating"
                keyboardType="numeric" // Set keyboard type to numeric to only allow numbers
                value={filters.globalRating || ""}
                onChangeText={(text) =>
                  handleFilterChange("globalRating", text)
                }
              />

              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={handleApplyCompanyFilters}
              >
                <Text style={styles.applyFiltersButtonText}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={handleReset}
              >
                <Text style={styles.applyFiltersButtonText}>Reset</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
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
              color="#A7BEE1"
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
    marginBottom: 200,
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
    backgroundColor: "#B69FEB",
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
    backgroundColor: "#A7BEE1",
  },
  navigationOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  applyFiltersButton: {
    backgroundColor: "#B69FEB",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  applyFiltersButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default SearchScreen;
