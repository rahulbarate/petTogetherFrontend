import { StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import React from "react";

const ButtonComponent = (props) => {
  return (
    <View>
      <TouchableNativeFeedback
        disabled={props.makeButtonDisabled ? props.makeButtonDisabled : false}
        onPress={props.handleButton ? props.handleButton : null}
      >
        <View style={[styles.buttonStyle, props.buttonStyle]}>
          <Text style={props.textStyle ? props.textStyle : null}>
            {props.buttonText ? props.buttonText : null}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3399ff",
  },
});
