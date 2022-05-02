import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

const TextInputComponent = (props) => {
  return (
    <View style={[styles.textInputStyle, props.textInputStyle]}>
      <TextInput
        placeholder={props.placeholder}
        keyboardType={props.keyboardType ? props.keyboardType : "default"}
        value={props.value}
        onChangeText={props.onChangeText}
      />
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  textInputStyle: {
    backgroundColor: "rgb(255,255,255)",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#3399ff",
    paddingLeft: "5%",
    justifyContent: "center",
  },
});
