import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

const Navbar = () => {
  const navigation = useNavigation();

  const handleChatPress = () => {
    navigation.navigate("Chat");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText} numberOfLines={1}>
          PB
        </Text>
      </View>

      {/* Search input in the middle */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a company or job..."
        placeholderTextColor="#999"
      />

      {/* Chat icon on the right */}
      <TouchableOpacity
        onPress={handleChatPress}
        style={styles.chatIconContainer}
      >
        <Feather name="message-circle" size={30} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 2, // Shadow for Android
  },
  logoContainer: {
    marginRight: "auto", // Pushes the chat icon to the right
  },
  logoText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#8172E8", // Purple color for logo
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 16,
    width: 150, // Adjust this width value as needed
  },
  chatIconContainer: {
    marginLeft: "auto", // Pushes the chat icon to the right
  },
});

export default Navbar;
