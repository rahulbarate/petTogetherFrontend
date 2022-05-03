import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../hooks/useAuth";
import TextInputComponent from "../common/TextInputComponent";
import DropDownPicker from "react-native-dropdown-picker";
import ButtonComponent from "../common/ButtonComponent";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

const ShopOwnerDetails = () => {
  const navigation = useNavigation();

  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [shopName, setShopName] = useState();
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
  const handleSignup = () => {
    createUserWithEmailAndPassword(
      auth,
      userDataContext.email,
      userDataContext.password
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const registerShopUser = () => {
    try {
      console.log("data in modal :");
      console.log(userDataContext);

      db.collection("Users")
        .doc("shopkeeper")
        .collection("shopAccounts")
        .doc(userDataContext.email)
        .set(userDataContext)
        .then(navigation.navigate("ShopOwnerProfile"));
      alert("Shop User Added ");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if ("shopName" in userDataContext) {
      registerShopUser();
    }
  }, [userDataContext]);

  const handleShopSubmit = () => {
    setUserDataContext((prevState) => {
      return {
        ...prevState,
        shopName,
        ownerName,
        phoneNumber,
        sellerType,
        pincode,
        state,
        district,
        houseNo,
        area,
      };
    });
    handleSignup();
  };

  return (
    <View>
      <View style={styles.shopUserContainerStyle}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.titleTextStyle}>Enter Your Shop Details: </Text>
        </View>
        <TextInputComponent
          textInputStyle={styles.longTextInputStyle}
          placeholder={"Enter Shop Name Here"}
          value={shopName}
          onChangeText={(text) => {
            setShopName(text);
          }}
        />
        <TextInputComponent
          textInputStyle={styles.longTextInputStyle}
          placeholder={"Enter Owner Name Here"}
          value={ownerName}
          onChangeText={(text) => {
            setOwnerName(text);
          }}
        />
        <TextInputComponent
          textInputStyle={styles.longTextInputStyle}
          placeholder={"Enter Phone no here"}
          keyboardType={"phone-pad"}
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
          }}
        />
        <DropDownPicker
          open={open}
          value={sellerType}
          items={items}
          setOpen={setOpen}
          setValue={setSellerType}
          setItems={setItems}
          style={{ width: 200, marginVertical: 5 }}
          containerStyle={{ width: 200 }}
          placeholder="What Do you Sell?"
          onChangeValue={(text) => {
            setSellerType(text);
          }}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <TextInputComponent
          textInputStyle={{
            width: "40%",
            height: 50,
            marginVertical: 5,
            marginHorizontal: 5,
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
            width: "40%",
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
      <View>
        <TextInputComponent
          textInputStyle={{
            width: "40%",
            height: 50,
            marginVertical: 5,
            marginHorizontal: 5,
          }}
          placeholder={"Enter District"}
          value={district}
          onChangeText={(text) => {
            setDistrict(text);
          }}
        />
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
    </View>
  );
};

export default ShopOwnerDetails;

const styles = StyleSheet.create({
  longTextInputStyle: {
    width: 300,
    height: 50,
    marginVertical: 5,
  },
  titleTextStyle: {
    fontSize: 20,
    marginBottom: 30,
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
