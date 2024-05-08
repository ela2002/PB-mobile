import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Informations = () => {
  const navigation = useNavigation();

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const InfoBlock = ({ icon, text, screenName }) => (
    <TouchableOpacity
      style={styles.infoContainer}
      onPress={() => handleNavigation(screenName)}
    >
      <View style={styles.infoBox}>
        {icon}
        <Text style={styles.infoText}>{text}</Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Ionicons name="chevron-forward-outline" size={24} color="grey" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InfoBlock
        icon={<Ionicons name="briefcase-outline" size={24} color="grey" />}
        text="Work Experience"
        screenName="Workexperience"
      />
      <InfoBlock
        icon={
          <MaterialCommunityIcons
            name="certificate-outline"
            size={24}
            color="grey"
          />
        }
        text="Certifications"
        screenName="Certifications"
      />
      <InfoBlock
        icon={<Ionicons name="construct-outline" size={24} color="grey" />}
        text="Projects"
        screenName="Projects"
      />
      <InfoBlock
        icon={<Ionicons name="language-outline" size={24} color="grey" />}
        text="Languages"
        screenName="Languages"
      />
      <InfoBlock
        icon={<Ionicons name="school-outline" size={24} color="grey" />}
        text="Academic Background"
        screenName="AcademicBackground"
      />
      <InfoBlock
        icon={<Ionicons name="ios-heart-outline" size={24} color="grey" />}
        text="Interests"
        screenName="Interests"
      />
      <InfoBlock
        icon={<Ionicons name="document-outline" size={24} color="grey" />}
        text="Resume"
        screenName="Resume"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: "grey",
  },
});

export default Informations;
