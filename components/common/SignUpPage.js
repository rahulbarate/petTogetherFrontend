import {
  View,
  Button,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableNativeFeedback,
  ScrollView,
  ToastAndroid,
  Dimensions,
} from "react-native";
import React, { useState, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UserDetailsModal from "./UserDetailsModal";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../hooks/useAuth";
import { RadioButton } from "react-native-paper";

const SignUpPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const { setUserDataContext } = useContext(AuthContext);
  // const [modalVisibility, setModalVisibility] = useState(false);

  const [modalVisibility, setModalVisibility] = useState(false);
  const toggleModal = () => {
    setModalVisibility(!modalVisibility);
  };

  const handleUserType = (type) => {
    setUserType(type);
    ToastAndroid.show(type + " is choosen", ToastAndroid.SHORT);
  };
  const handleNextButton = () => {
    const user = {
      email,
      password,
      userType,
    };
    if (!userType || !email || !password) {
      alert("Please enter all details");
    } else {
      // console.log(userType);
      setUserDataContext(user);
      navigation.navigate("AcceptUserDetails");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainerStyle}>
        <Text style={styles.titleTextStyle}>Choose your role !</Text>
        <KeyboardAwareScrollView>
          <View
            style={{
              marginVertical: 5,
              marginTop: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Organization"
                  status={userType === "Organization" ? "checked" : "unchecked"}
                  onPress={() => setUserType("Organization")}
                  color={"#3399ff"}
                />
                <Text
                  style={
                    userType === "Organization"
                      ? styles.radioButtonTextStyle
                      : styles.radioButtonUncheckedTextStyle
                  }
                >
                  Organization
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Shopkeeper"
                  status={userType === "Shopkeeper" ? "checked" : "unchecked"}
                  onPress={() => setUserType("Shopkeeper")}
                  color={"#3399ff"}
                />
                <Text
                  style={
                    userType === "Shopkeeper"
                      ? styles.radioButtonTextStyle
                      : styles.radioButtonUncheckedTextStyle
                  }
                >
                  Shopkeeper
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="Individual User"
                  status={
                    userType === "Individual User" ? "checked" : "unchecked"
                  }
                  onPress={() => setUserType("Individual User")}
                  color={"#3399ff"}
                />
                <Text
                  style={
                    userType === "Individual User"
                      ? styles.radioButtonTextStyle
                      : styles.radioButtonUncheckedTextStyle
                  }
                >
                  Individual User
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.textAndButtonsContainer}>
            <View style={styles.emailTextInputViewStyle}>
              <TextInput
                placeholder="Enter email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
              />
            </View>
            <View style={styles.passwordTextInputViewStyle}>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              />
            </View>
            <View style={styles.buttonContainerStyle}>
              <TouchableNativeFeedback onPress={handleNextButton}>
                <View style={styles.nextButtonStyle}>
                  <Text style={{ fontSize: 20 }}>Next</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  mainContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(255,255,255,0.3)",
    width: Dimensions.get("window").width,
    marginTop: 100,
  },
  textAndButtonsContainer: {
    flex: 2,
    alignItems: "center",
    width: Dimensions.get("window").width,
    // backgroundColor: "yellow",
  },
  backgroundImageStyle: {
    flex: 1,
    justifyContent: "flex-start",
  },
  titleTextStyle: {
    fontSize: 35,
    marginTop: 40,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue",
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  textInsideCircle: {
    fontSize: 20,
  },
  circularViewStyle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  circularViewSelectedStyle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: "#AAF",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  emailTextInputViewStyle: {
    backgroundColor: "rgb(255,255,255)",
    height: 50,
    width: "90%",
    marginTop: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#3399ff",
    paddingLeft: "5%",
    justifyContent: "center",
  },
  passwordTextInputViewStyle: {
    marginTop: "5%",
    backgroundColor: "rgb(255,255,255)",
    height: 50,
    width: "90%",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#3399ff",
    paddingLeft: "5%",
    justifyContent: "center",
  },
  buttonContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonStyle: {
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3399ff",
    height: 50,
    width: 150,
    borderRadius: 30,
  },
  modalStyle: {
    margin: 0,
    marginTop: "15%",
    borderRadius: 30,
  },
  radioButtonTextStyle: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#3399ff",
  },
  radioButtonUncheckedTextStyle: {
    fontSize: 20,
    color: "black",
  },
});
