import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { firestore } from "../../../firebase/firebase"; // Import Firebase configuration
import { collection, getDocs, doc } from "firebase/firestore";

const Employeedetails = ({ employeeId }) => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [interests, setInterests] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [academicBackground, setAcademicBackground] = useState([]); // Change to an array

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Fetch Work Experiences
        const workExperiencesRef = collection(
          firestore,
          `employeesprofile/${employeeId}/workExperiences`
        );
        const workExperiencesSnapshot = await getDocs(workExperiencesRef);
        const workExperiencesData = workExperiencesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkExperiences(workExperiencesData);

        // Fetch Academic Background
        const academicBackgroundRef = collection(
          firestore,
          `employeesprofile/${employeeId}/academicBackground`
        );
        const academicBackgroundSnapshot = await getDocs(academicBackgroundRef);
        const academicBackgroundData = academicBackgroundSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );
        setAcademicBackground(academicBackgroundData);

        // Fetch Projects
        const projectsRef = collection(
          firestore,
          `employeesprofile/${employeeId}/projects`
        );
        const projectsSnapshot = await getDocs(projectsRef);
        const projectsData = projectsSnapshot.docs.map((doc) => doc.data());
        setProjects(projectsData);

        // Fetch Certifications
        const certificationsRef = collection(
          firestore,
          `employeesprofile/${employeeId}/certifications`
        );
        const certificationsSnapshot = await getDocs(certificationsRef);
        const certificationsData = certificationsSnapshot.docs.map((doc) =>
          doc.data()
        );
        setCertifications(certificationsData);

        // Fetch Languages
        const languagesRef = collection(
          firestore,
          `employeesprofile/${employeeId}/languages`
        );
        const languagesSnapshot = await getDocs(languagesRef);
        const languagesData = languagesSnapshot.docs.map((doc) => doc.data());
        setLanguages(languagesData);

        // Fetch Interests
        const interestsRef = collection(
          firestore,
          `employeesprofile/${employeeId}/interests`
        );
        const interestsSnapshot = await getDocs(interestsRef);
        const interestsData = interestsSnapshot.docs.map((doc) => doc.data());
        setInterests(interestsData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  return (
    <View style={styles.container}>
      {/* Work Experiences */}
      <View style={styles.box}>
        <Text style={styles.heading}>Work Experiences:</Text>
        {workExperiences.map((experience, index) => (
          <View key={index} style={styles.item}>
            <Text>{experience.title}</Text>
            <Text>{experience.company}</Text>
            <Text>{experience.duration}</Text>
            <Text>{experience.description}</Text>
            <View style={styles.tags}>
              {experience.tags.map((tag, tagIndex) => (
                <Text key={tagIndex}>{tag}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Academic Background */}
      <View style={styles.box}>
        <Text style={styles.heading}>Academic Background:</Text>
        {academicBackground.map((background, index) => (
          <View key={index}>
            <Text>{background.degree}</Text>
            <Text>{background.institution}</Text>
            <Text>{background.duration}</Text>
          </View>
        ))}
      </View>

      {/* Projects */}
      <View style={styles.box}>
        <Text style={styles.heading}>Projects:</Text>
        {projects.map((project, index) => (
          <View key={index} style={styles.item}>
            <Text>{project.title}</Text>
            <Text>{project.description}</Text>
            <View style={styles.tags}>
              {project.tags.map((tag, tagIndex) => (
                <Text key={tagIndex}>{tag}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Certifications */}
      <View style={styles.box}>
        <Text style={styles.heading}>Certifications:</Text>
        {certifications.map((certification, index) => (
          <View key={index} style={styles.item}>
            <Text>{certification.title}</Text>
            <Text>{certification.organization}</Text>
            <Text>{certification.date}</Text>
            <View style={styles.tags}>
              {certification.tags.map((tag, tagIndex) => (
                <Text key={tagIndex}>{tag}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Languages */}
      <View style={styles.box}>
        <Text style={styles.heading}>Languages:</Text>
        {languages.map((language, index) => (
          <View key={index} style={styles.item}>
            <Text>Language: {language.language}</Text>
            <Text>Proficiency: {language.proficiency}</Text>
          </View>
        ))}
      </View>

      {/* Interests */}
      <View style={styles.box}>
        <Text style={styles.heading}>Interests:</Text>
        {interests.map((interest, index) => (
          <View key={index} style={styles.item}>
            <Text>{interest.title}</Text>
            <View style={styles.tags}>
              {interest.tags.map((tag, tagIndex) => (
                <Text key={tagIndex}>{tag}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 30,
  },
  box: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    marginBottom: 5,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default Employeedetails;
