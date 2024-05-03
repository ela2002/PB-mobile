import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { firestore } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import CompanyHeader from "./CompanyHeader";
import CompanyNavBar from "./CompanyNavBar";
import Overview from "./Overview";
import Reviews from "./Reviews";
import Jobs from "./Jobs";

const CompanyDetail = ({ route }) => {
  const { companyId } = route.params;
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyDocRef = doc(firestore, "companiesprofile", companyId);
        const companySnap = await getDoc(companyDocRef);

        if (companySnap.exists()) {
          const companyData = companySnap.data();
          setCompany(companyData);
        } else {
          console.log("No such company found!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  const handleRecommend = async () => {
    try {
      const companyRef = doc(firestore, "companiesprofile", companyId);
      await updateDoc(companyRef, { recommended: company.recommended + 1 });
      setCompany((prevCompany) => ({
        ...prevCompany,
        recommended: prevCompany.recommended + 1,
      }));
    } catch (error) {
      console.error("Error recommending company:", error);
    }
  };

  const handleUnrecommend = async () => {
    try {
      const companyRef = doc(firestore, "companiesprofile", companyId);
      await updateDoc(companyRef, {
        unrecommended: company.unrecommended + 1,
      });
      setCompany((prevCompany) => ({
        ...prevCompany,
        unrecommended: prevCompany.unrecommended + 1,
      }));
    } catch (error) {
      console.error("Error unrecommending company:", error);
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <CompanyHeader
        company={company}
        onRecommend={handleRecommend}
        onUnrecommend={handleUnrecommend}
      />
      <CompanyNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "overview" && <Overview company={company} />}
      {activeTab === "reviews" && <Reviews companyId={companyId} />}
      {activeTab === "jobs" && <Jobs company={company} />}
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

export default CompanyDetail;
