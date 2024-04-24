import React from "react";
import { View, StyleSheet, Text } from "react-native";

const ApplicationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text> ApplicationsScreen</Text>
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

export default ApplicationsScreen;
