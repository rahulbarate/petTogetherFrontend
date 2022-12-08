import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Avatar } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";

const RenderItemComponent = ({ item }) => {
  const navigation = useNavigation();

  //navigate logged use to the clicked user profile section
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
          source={item.profileImageLink? { uri: item.profileImageLink }:{ uri:"https://firebasestorage.googleapis.com/v0/b/pettogether-f16ce.appspot.com/o/temp%2FblankProfilePicture.png?alt=media&token=c4fd0020-8702-4f79-9871-8f4543d8d2b3" }}
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
