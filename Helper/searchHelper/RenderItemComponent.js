import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Avatar } from "@ui-kitten/components";

const RenderItemComponent = ({ item }) => {
  return (
    <TouchableOpacity onPress={() => alert(`${item.name} pressed`)}>
      <View style={styles.conainer}>
        <Avatar
          source={{ uri: item.profileImageLink }}
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
