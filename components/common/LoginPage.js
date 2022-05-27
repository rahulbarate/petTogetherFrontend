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
  ToastAndroid,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState, useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { localhostBaseURL } from "../common/baseURLs";
import AuthContext from "../hooks/useAuth";
import Ionicons from "react-native-vector-icons/Ionicons";

const LoginPage = () => {
  const [email, setEmail] = useState("arjun@gmail.com");
  const [password, setPassword] = useState("arjun12345678");
  const [hidePass, setHidePass] = useState(true);
  const [placeholderColor, setPlaceholderColor] = useState("#C7C7CD");
  const [loginButtonText, setLoginButtonText] = useState("Login");
  //   const [userData, setUserData] = useState();

  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  //   const {setUser} = useAuth();
  const navigation = useNavigation();

  const handleSignIn = () => {
    if (!email || !password) {
      setPlaceholderColor("red");
      ToastAndroid.show("Please enter email and password", ToastAndroid.SHORT);
      return;
    }
    setLoginButtonText("Logging in...");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user;
      })
      .then((user) => {
        getDataFromServer(user.email);
        // setUserDataContext(user);
        // ToastAndroid.show("Logged In", ToastAndroid.SHORT);
        // navigation.navigate("MainComponent");
        // setTimeout(() => {
        //   setLoginButtonText("Login");
        // }, 1000);
      })
      .catch((error) => {
        setLoginButtonText("Login");
        // setPlaceholderColor("red");
        ToastAndroid.show("Incorrect email and password", ToastAndroid.SHORT);
        console.log(error.message);
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
        console.log(error);
      });
  };

  const getDataFromServer = async (email) => {
    try {
      const res = await localhostBaseURL.post("/profile/fetchUserDetails", {
        email: email,
      });

      setUserDataContext(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userDataContext.email && userDataContext.email)
      navigation.navigate("MainComponent");
    setTimeout(() => {
      setLoginButtonText("Login");
    }, 1000);
  }, [userDataContext]);

  return (
    // <AuthContext.Provider value={{userData}}>
    <View style={styles.mainContainerStyle}>
      <KeyboardAwareScrollView style={styles.textInputContainerStyle}>
        <View style={styles.textContainerStyle}>
          <View style={styles.pageTitleViewStyle}>
            <Text style={styles.pageTitleStyle}>Pet together</Text>
          </View>
          <View style={styles.introTextViewStyle}>
            <Text style={styles.introTextTitleStyle}>Welcome back!</Text>
            <Text style={styles.introTextParaStyle}>
              Let's login and start connecting with pet lovers.
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.emailTextInputViewStyle}>
            <TextInput
              placeholder="Email address"
              placeholderTextColor={placeholderColor}
              value={email}
              onChangeText={(text) => {
                setPlaceholderColor("#C7C7CD");
                setEmail(text);
              }}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.passwordTextInputViewStyle}>
            <TextInput
              secureTextEntry={hidePass ? true : false}
              // autoCapitalize={'none'}
              keyboardType={"default"}
              placeholder="Password"
              placeholderTextColor={placeholderColor}
              style={styles.passTextInputStyle}
              value={password}
              onChangeText={(text) => {
                setPlaceholderColor("#C7C7CD");
                setPassword(text);
              }}
              // keyboardType="email-address"
            ></TextInput>
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
          <View style={styles.signUpTextViewStyle}>
            <Text style={styles.noAccountTextStyle}>
              {"Don't have an account? "}
            </Text>
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate("SignUpPage");
              }}
            >
              <View>
                <Text style={styles.signupTextStyle}>signup</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        <View style={styles.buttonContainerStyle}>
          <TouchableNativeFeedback
            onPress={handleSignIn}
            disabled={loginButtonText !== "Login" && true}
          >
            <View
              style={
                loginButtonText !== "Login"
                  ? [styles.loginButtonStyle, { opacity: 0.5 }]
                  : styles.loginButtonStyle
              }
            >
              <Text style={{ fontSize: 20 }}>{loginButtonText}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </KeyboardAwareScrollView>
    </View>
    // </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  backgroundImageStyle: {
    flex: 1,
    justifyContent: "flex-start",
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
    padding: 5,
    marginTop: 10,
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
  textContainerStyle: {
    flex: 1,
    // backgroundColor: "red",
  },
  pageTitleViewStyle: {
    flex: 2,
    // backgroundColor: "blue",
  },
  pageTitleStyle: {
    marginTop: "10%",
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: "5%",
  },
  introTextViewStyle: {
    marginTop: "30%",
    flex: 6,
    marginHorizontal: "5%",
    // backgroundColor: "yellow",
  },
  introTextHeadStyle: {
    marginTop: "15%",
    fontSize: 40,
  },
  introTextTitleStyle: {
    fontSize: 30,
  },
  introTextParaStyle: {
    fontSize: 20,
    marginLeft: 5,
  },
  buttonContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
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
    marginTop: "20%",
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
    // flex:1,
    marginTop: "5%",
    backgroundColor: "rgb(255,255,255)",
    width: "90%",
    height: 50,
    marginLeft: "5%",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#3399ff",
    paddingLeft: "5%",
    // justifyContent: "center",
    flexDirection: "row",
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
export default LoginPage;
