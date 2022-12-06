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
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

const SignUpPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("any@gmail.com");
  const [password, setPassword] = useState("any12345678");
  const [hidePass, setHidePass] = useState(true);
  const [placeholderColor, setPlaceholderColor] = useState("#C7C7CD");
  const [userType, setUserType] = useState("");
  const [open, setOpen] = useState(false);
  const [userTypes, setUserTypes] = useState([
    { label: "Shopkeeper", value: "Shopkeeper" },
    { label: "Organization", value: "Organization" },
    { label: "Individual User", value: "Individual User" },
  ]);

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
    // console.log(user);
    if (!userType || !email || !password) {
      setPlaceholderColor("red");
      ToastAndroid.show("Please enter all details", ToastAndroid.SHORT);
      return;
      // console.log("Please enter all details");
    } else {
      // console.log(userType);
      // setUserDataContext(user);
      navigation.navigate("AcceptUserDetails",{user:user});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainerStyle}>
        <Text style={styles.titleTextStyle}>Enter signup details</Text>
        <KeyboardAwareScrollView>
          <View style={styles.textAndButtonsContainer}>
            <View style={styles.emailTextInputViewStyle}>
              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
              />
            </View>
            <View style={styles.passwordTextInputViewStyle}>
              <TextInput
                secureTextEntry={hidePass ? true : false}
                keyboardType={"default"}
                placeholder="Password"
                placeholderTextColor={placeholderColor}
                style={styles.passTextInputStyle}
                value={password}
                onChangeText={(text) => {
                  setPlaceholderColor("#C7C7CD");
                  setPassword(text);
                }}
              />
              <View style={styles.eyeIconStyle}>
                <TouchableNativeFeedback
                  onPress={() => {
                    setHidePass(!hidePass);
                  }}
                >
                  <Ionicons
                    name={hidePass ? "eye-off-outline" : "eye-outline"}
                    size={25}
                  />
                </TouchableNativeFeedback>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "5%",
              }}
            >
              <DropDownPicker
                open={open}
                value={userType}
                items={userTypes}
                setOpen={setOpen}
                setValue={setUserType}
                setItems={setUserTypes}
                style={{
                  borderColor: "#3399ff",
                  borderWidth: 2,
                  borderRadius: 25,
                }}
                containerStyle={{ width: "90%" }}
                placeholder="Choose your role"
                placeholderStyle={{marginLeft: "3%"}}
                textStyle={{ marginLeft: "3%"}}
                onChangeValue={(text) => {
                  setUserType(text);
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
    fontSize: 25,
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
    flexDirection: "row",
  },
  buttonContainerStyle: {
    marginTop: "15%",
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
  passTextInputStyle: {
    flex: 1,
  },
  eyeIconStyle: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    padding: 5,
  },
});

{
  /* <View
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
          </View> */
}
