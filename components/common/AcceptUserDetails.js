import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../hooks/useAuth";
import TextInputComponent from "../common/TextInputComponent";
import DropDownPicker from "react-native-dropdown-picker";
import ButtonComponent from "../common/ButtonComponent";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RadioButton } from "react-native-paper";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const AcceptUserDetails = () => {
  //states and variables
  const navigation = useNavigation();

  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  //   const [open, setOpen] = useState(false);
  const [name, setName] = useState();
  const [recievedUserLocation, setRecievedUserLocation] = useState(false);
  const [ownerName, setOwnerName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [sellerType, setSellerType] = useState(null);
  const [pincode, setPincode] = useState();
  const [state, setState] = useState();
  const [district, setDistrict] = useState();
  const [houseNo, setHouseNo] = useState();
  const [area, setArea] = useState();

  const [items, setItems] = useState([
    { label: "Pet Essentials", value: "essentials" },
    { label: "Pets", value: "pets" },
    { label: "Both", value: "both" },
  ]);

  //functions
  const handleSignup = (enteredUserData) => {
    createUserWithEmailAndPassword(
      auth,
      enteredUserData.email,
      enteredUserData.password
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        registerUser(enteredUserData);

        // console.log(user);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const registerUser = (enteredUserData) => {
    let docType;
    if (enteredUserData.userType === "Shopkeeper") docType = "shopkeeper";
    else if (enteredUserData.userType === "Organization")
      docType = "organization";
    else docType = "individualUser";
    try {
      db.collection("Users")
        .doc(docType)
        .collection("accounts")
        .doc(enteredUserData.email)
        .set(enteredUserData)
        .then(navigation.navigate("MainComponent"));
      alert("Registered Successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  const getEnteredUserData = () => {
    let updatedData = {
      email: userDataContext.email,
      password: userDataContext.password,
      userType: userDataContext.userType,
      profileImageLink: userDataContext.profileImageLink
        ? userDataContext.profileImageLink
        : "",
      name,
      phoneNumber,
      pincode,
      state,
      district,
      houseNo,
      area,
      coordinate: userDataContext.coordinate,
    };

    if (userDataContext.userType === "Shopkeeper")
      updatedData = { ...updatedData, ownerName, sellerType };

    if (userDataContext.userType === "Organization")
      updatedData = { ...updatedData, ownerName };

    return updatedData;
  };

  const handleShopSubmit = () => {
    if (recievedUserLocation) {
      const enteredUserData = getEnteredUserData();
      setUserDataContext(enteredUserData);
      handleSignup(enteredUserData);
      // console.log(enteredUserData);
    } else {
      alert("Please select your current location");
    }
  };
  return (
    <View style={styles.mainContainerStyle}>
      <KeyboardAwareScrollView style={{ flex: 1, width: deviceWidth }}>
        <View style={styles.container1Style}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleTextStyle}>Enter Your Details </Text>
          </View>
          <TextInputComponent
            textInputStyle={styles.longTextInputStyle}
            placeholder={
              userDataContext.userType === "Shopkeeper"
                ? "Enter Shop Name"
                : userDataContext.userType === "Organization"
                ? "Enter Organization Name"
                : "Enter Your Name"
            }
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
          />
          {userDataContext.userType === "Shopkeeper" ||
          userDataContext.userType === "Organization" ? (
            <TextInputComponent
              textInputStyle={styles.longTextInputStyle}
              placeholder={"Enter Owner Name Here"}
              value={ownerName}
              onChangeText={(text) => {
                setOwnerName(text);
              }}
            />
          ) : (
            <View></View>
          )}
          <TextInputComponent
            textInputStyle={styles.longTextInputStyle}
            placeholder={"Enter Phone no here"}
            keyboardType={"phone-pad"}
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
            }}
          />
        </View>
        {userDataContext.userType === "Shopkeeper" && (
          <View style={{ marginLeft: 15, marginVertical: 5 }}>
            <Text style={{ fontSize: 20, marginLeft: 10 }}>
              What do you sell ?
            </Text>
            <View style={{ flexDirection: "row", marginVertical: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RadioButton
                  value="essentials"
                  status={sellerType === "essentials" ? "checked" : "unchecked"}
                  onPress={() => setSellerType("essentials")}
                  color={"#3399ff"}
                />
                <Text
                  style={
                    sellerType === "essentials"
                      ? styles.radioButtonTextStyle
                      : styles.radioButtonUncheckedTextStyle
                  }
                >
                  Pet's Essentials
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
                  value="essentials"
                  status={sellerType === "pets" ? "checked" : "unchecked"}
                  onPress={() => setSellerType("pets")}
                  color={"#3399ff"}
                />
                <Text
                  style={
                    sellerType === "pets"
                      ? styles.radioButtonTextStyle
                      : styles.radioButtonUncheckedTextStyle
                  }
                >
                  Pets
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
                  value="essentials"
                  status={sellerType === "both" ? "checked" : "unchecked"}
                  onPress={() => setSellerType("both")}
                  color={"#3399ff"}
                />
                <Text
                  style={
                    sellerType === "both"
                      ? styles.radioButtonTextStyle
                      : styles.radioButtonUncheckedTextStyle
                  }
                >
                  Both
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.container2Style}>
          <TextInputComponent
            textInputStyle={{
              width: "45%",
              height: 50,
              marginVertical: 5,
              marginLeft: 15,
            }}
            placeholder={"Enter pincode"}
            keyboardType={"phone-pad"}
            value={pincode}
            onChangeText={(text) => {
              setPincode(text);
            }}
          />
          <TextInputComponent
            textInputStyle={{
              width: "45%",
              height: 50,
              marginVertical: 5,
              marginHorizontal: 5,
            }}
            placeholder={"Enter State"}
            value={state}
            onChangeText={(text) => {
              setState(text);
            }}
          />
        </View>
        <View style={{flexDirection: "row",alignItems: "center"}}>
          <TextInputComponent
            textInputStyle={{
              width: "45%",
              height: 50,
              marginVertical: 5,
              marginHorizontal: 15,
            }}
            placeholder={"Enter District"}
            value={district}
            onChangeText={(text) => {
              setDistrict(text);
            }}
          />
          <View>
            <TouchableNativeFeedback
              onPress={() => {
                navigation.navigate("GetLocation", { setRecievedUserLocation });
              }}
            >
              <Text
                style={{ textDecorationLine: "underline", color: "#3399ff" }}
              >
                Set Current Location
              </Text>
            </TouchableNativeFeedback>
          </View>
        </View>
        <View style={styles.container3Style}>
          <TextInputComponent
            textInputStyle={styles.longTextInputStyle}
            placeholder={"House no,Building no,Street,etc"}
            value={houseNo}
            onChangeText={(text) => {
              setHouseNo(text);
            }}
          />
          <TextInputComponent
            textInputStyle={styles.longTextInputStyle}
            placeholder={"Area,Colony,Road Name,etc"}
            value={area}
            onChangeText={(text) => {
              setArea(text);
            }}
          />
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <ButtonComponent
              buttonStyle={styles.submitButtonStyle}
              textStyle={styles.buttonTextStyle}
              buttonText={"Submit"}
              handleButton={handleShopSubmit}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AcceptUserDetails;

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "15%",
  },
  container1Style: {
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  longTextInputStyle: {
    width: "90%",
    height: 50,
    marginVertical: 5,
  },
  container2Style: {
    flexDirection: "row",
  },
  container3Style: {
    justifyContent: "center",
    alignItems: "center",
  },
  titleTextStyle: {
    fontSize: 25,
    marginBottom: 20,
  },
  radioButtonTextStyle: {
    textDecorationLine: "underline",
    color: "#3399ff",
  },
  radioButtonUncheckedTextStyle: {
    color: "black",
  },
  submitButtonStyle: {
    width: 150,
    height: 50,
    borderRadius: 30,
  },
  buttonTextStyle: {
    fontSize: 18,
  },
});
