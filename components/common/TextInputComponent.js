import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

const TextInputComponent = (props) => {
  return (
    <View style={[styles.textInputStyle, props.textInputStyle]}>
      <TextInput
        multiline={true}
        placeholder={props.placeholder}
        placeholderStyle={
          props.placeholderStyle ? props.placeholderStyle : { paddingLeft: 5 }
        }
        keyboardType={props.keyboardType ? props.keyboardType : "default"}
        value={props.value}
        onChangeText={props.onChangeText}
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          fontSize: props.fontSize && props.fontSize,
          // backgroundColor: "yellow",
          textAlignVertical: props.textAlignVertical
            ? props.textAlignVertical
            : "center",
        }}
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
