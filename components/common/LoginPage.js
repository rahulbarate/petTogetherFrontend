import {
  View,
  Button,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AuthContext from "../../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [userData, setUserData] = useState();

  const { setUserDataContext } = useContext(AuthContext);
  //   const {setUser} = useAuth();
  const navigation = useNavigation();

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user;
      })
      .then((user) => {
        // console.log(user);
        // setUserData(user);
        setUserDataContext(user);
        // console.log(userData);
        alert("Logged In");
        navigation.navigate("ShopOwnerProfile");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    // <AuthContext.Provider value={{userData}}>
    <View style={styles.mainContainerStyle}>
      <ImageBackground
        style={styles.backgroundImageStyle}
        resizeMode="cover"
        source={require("../../static/images/girlwithdog.jpg")}
      >
        <KeyboardAvoidingView style={styles.textInputContainerStyle}>
          <View>
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
            <View style={styles.signUpTextViewStyle}>
              <Text style={styles.noAccountTextStyle}>
                Don't Have an Account,
              </Text>
              <TouchableNativeFeedback onPress={() =>{navigation.navigate("SignUpPage")}}>
                <View>
                  <Text style={styles.signupTextStyle}>Signup</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.buttonContainerStyle}>
          <TouchableNativeFeedback onPress={handleSignIn}>
            <View style={styles.loginButtonStyle}>
              <Text style={{ fontSize: 20 }}>Login</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </ImageBackground>
    </View>
    // </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  backgroundImageStyle: {
    flex: 1,
    justifyContent: "flex-start",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  textInputContainerStyle: {
    flex: 8,
    backgroundColor: "rgba(255,255,255,0)",
  },
  signUpTextViewStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    alignSelf: "center",
    borderRadius: 30,
    padding:5,
    marginTop:10
  },
  noAccountTextStyle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  signupTextStyle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "blue",
    textDecorationLine: "underline",
  },
  buttonContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3399ff",
    height: 50,
    width: 300,
    borderRadius: 30,
  },
  emailTextInputViewStyle: {
    marginTop: "80%",
    backgroundColor: "rgb(255,255,255)",
    width: "90%",
    height: 50,
    marginLeft: "5%",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#3399ff",
    paddingLeft: "5%",
    justifyContent: "center",
  },
  passwordTextInputViewStyle: {
    marginTop: "5%",
    backgroundColor: "rgb(255,255,255)",
    width: "90%",
    height: 50,
    marginLeft: "5%",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#3399ff",
    paddingLeft: "5%",
    justifyContent: "center",
  },
});
export default LoginPage;
