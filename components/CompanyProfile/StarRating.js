import React from "react";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; 

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <FontAwesome
      key={index}
      name={index < rating ? "star" : "star-o"}
      size={24}
      color={index < rating ? "#ffc107" : "#e0e0e0"}
    />
  ));

  return (
    <View style={{ flexDirection: "row" }}>
      {stars.map((star, index) => (
        <View key={index}>{star}</View>
      ))}
      <Text style={{ marginLeft: 5 }}></Text>
    </View>
  );
};

export default StarRating;
