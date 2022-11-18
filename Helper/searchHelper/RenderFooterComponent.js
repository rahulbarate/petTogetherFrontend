import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

const RenderFooterComponent = ({ setvisibleComponent }) => {
  return (
    <View style={styles.conatiner}>
      <TouchableOpacity
        onPress={() => setvisibleComponent("topTab")} //callback for diplaying the top tab navigation 
        style={styles.resultButton}
      >
        <Text style={styles.resultButtonText}>See all results</Text>
      </TouchableOpacity>
    </View>
  );
};
export default RenderFooterComponent;

const styles = StyleSheet.create({
  conatiner: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
  },
  resultButton: { justifyContent: "center", alignItems: "center" },
  resultButtonText: { color: "blue" },
});
