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
} from "react-native";
import React, { useState, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UserDetailsModal from "./UserDetailsModal";
import Modal from "react-native-modal";
import AuthContext from "../hooks/useAuth";

const SignUpPage = () => {
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
    if (userType === "") {
      alert("please choose user Type");
    } else {
      setUserDataContext(user);
      setModalVisibility(true);
      setEmail("");
      setPassword("");
      setUserType("");
    }
  };

  return modalVisibility ? (
    <Modal
      isVisible={modalVisibility}
      style={styles.modalStyle}
      onSwipeComplete={() => setModalVisibility(false)}
      onBackButtonPress={() => setModalVisibility(false)}
      swipeDirection="down"
    >
      <UserDetailsModal toggleModal={toggleModal} />
    </Modal>
  ) : (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImageStyle}
        resizeMode="cover"
        source={require("../../static/images/hedgehog.jpg")}
      >
        <View style={styles.mainContainerStyle}>
          <Text style={styles.titleTextStyle}>Choose who do you want be !</Text>
          <KeyboardAwareScrollView>
            <View style={styles.container1}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  "#AAF",
                  true,
                  150 / 2
                )}
                style={styles.circleTouchFeedbackStyle}
                onPress={() => {
                  handleUserType("Organization");
                }}
              >
                <View style={styles.circularViewStyle}>
                  <Text style={styles.textInsideCircle}>Organization</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.container2}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  "#AAF",
                  true,
                  150 / 2
                )}
                onPress={() => {
                  handleUserType("Shopkeeper");
                }}
                style={styles.circleTouchFeedbackStyle}
              >
                <View style={styles.circularViewStyle}>
                  <Text style={styles.textInsideCircle}>Shopkeeper</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  "#AAF",
                  true,
                  150 / 2
                )}
                onPress={() => {
                  handleUserType("Individual User");
                }}
                style={styles.circleTouchFeedbackStyle}
              >
                <View style={styles.circularViewStyle}>
                  <Text style={styles.textInsideCircle}>Individual User</Text>
                </View>
              </TouchableNativeFeedback>
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
      </ImageBackground>
    </View>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageStyle: {
    flex: 1,
    justifyContent: "flex-start",
  },
  mainContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  titleTextStyle: {
    fontSize: 20,
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
  textAndButtonsContainer: {
    flex: 2,
    alignItems: "center",
    // backgroundColor: "yellow",
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
});
