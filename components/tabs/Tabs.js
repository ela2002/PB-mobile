import React from "react";
import { View, TouchableHighlight, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Tabs = () => {
  const navigation = useNavigation();

  const handleTabPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("Insightzone")}
        underlayColor="#DDDDDD"
      >
        <Feather name="home" size={24} color="black" />
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("Community")}
        underlayColor="#DDDDDD"
      >
        <MaterialIcons name="groups" size={24} color="black" />
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("AddPost")}
        underlayColor="#DDDDDD"
      >
        <MaterialIcons name="add-circle-outline" size={24} color="black" />
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("Applications")}
        underlayColor="#DDDDDD"
      >
        <Feather name="list" size={24} color="black" />
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.tab}
        onPress={() => handleTabPress("EmployeeProfile")}
        underlayColor="#DDDDDD"
      >
        <Ionicons name="md-person" size={24} color="black" />
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
});

export default Tabs;
