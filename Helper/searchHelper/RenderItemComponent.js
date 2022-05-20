import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Avatar } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";

const RenderItemComponent = ({ item }) => {
  const navigation = useNavigation();
  const handleItemClicked = () => {
    navigation.navigate("OtherUsersProfile", {
      clickedUsersEmail: item.email,
      clickedUsersType: item.userType,
    });
  };

  return (
    <TouchableOpacity onPress={handleItemClicked}>
      <View style={styles.conainer}>
        <Avatar
          source={item.profileImageLink && { uri: item.profileImageLink }}
          size="giant"
          style={styles.profilePic}
        />
        <Text style={styles.text}>{` ${item.name}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemComponent;

const styles = StyleSheet.create({
  conainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  profilePic: { marginRight: 16 },
  text: {
    color: "#000",
  },
});
