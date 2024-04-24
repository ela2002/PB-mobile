import React from "react";
import { View, StyleSheet, Text } from "react-native";

const EmployeeProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text> EmployeeProfileScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EmployeeProfileScreen;
