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

const Navbar = () => {
  const navigation = useNavigation();

  const handleChatPress = () => {
    navigation.navigate("Chat");
  };

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText} numberOfLines={1}>
          PB
        </Text>
      </View>

      {/* Search input in the middle */}
      <TouchableOpacity
        onPress={handleSearchPress}
        style={styles.searchInputContainer}
      >
        <Feather
          name="search"
          size={24}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a company or job..."
          placeholderTextColor="#999"
          editable={false} // Disable editing directly in the navbar
        />
      </TouchableOpacity>

      {/* Chat icon on the right */}
      <TouchableOpacity
        onPress={handleChatPress}
        style={styles.chatIconContainer}
      >
        <Feather name="message-circle" size={30} color="#8172E8" />
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 2,
    height: 60,
    borderRadius: 15,
  },
  logoContainer: {
    marginRight: "auto", // Pushes the chat icon to the right
  },
  logoText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#8172E8", // Purple color for logo
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 30,
    marginRight: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  chatIconContainer: {
    marginLeft: "auto", // Pushes the chat icon to the right
  },
});

export default Navbar;
