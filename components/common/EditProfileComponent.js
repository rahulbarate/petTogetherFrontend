import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ToastAndroid,
  TouchableNativeFeedback,
  Image,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
// import AuthContext from "../../hooks/useAuth";
import TextInputComponent from "../common/TextInputComponent";
import DropDownPicker from "react-native-dropdown-picker";
import ButtonComponent from "../common/ButtonComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { localhostBaseURL } from "../common/baseURLs";
// import useDidMountEffect from "../hooks/useDidMountEffect";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebase";
import sendRequestToServer from "../hooks/sendRequestToServer";
import AuthContext from "../hooks/useAuth";
// import sendRequestToServer from "./sendRequestToServer";

const EditProfileComponent = (props) => {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(userDataContext.name);
  const [image, setImage] = useState(userDataContext.profileImageLink);
  const [ownerName, setOwnerName] = useState(userDataContext.ownerName);
  const [bio, setBio] = useState(
    "bio" in userDataContext ? userDataContext.bio : ""
  );
  const [phoneNumber, setPhoneNumber] = useState(userDataContext.phoneNumber);
  const [pincode, setPincode] = useState(userDataContext.pincode);
  const [state, setState] = useState(userDataContext.state);
  const [district, setDistrict] = useState(userDataContext.district);
  const [houseNo, setHouseNo] = useState(userDataContext.houseNo);
  const [area, setArea] = useState(userDataContext.area);
  const [items, setItems] = useState([
    { label: "Pet Essentials", value: "essentials" },
    { label: "Pets", value: "pets" },
    { label: "Both", value: "both" },
  ]);
  const [sellerType, setSellerType] = useState(userDataContext.sellerType);

  //functions
  const displayToastMessage = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    //
    const storageRef = storage
      .ref(`${userDataContext.email}/profilePictures/`)
      .child("profilePicture.jpeg");

    const uploadTask = storageRef.put(blob);
    // setIsDataChanged(false);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
        blob.close();
        return;
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          setImage(url);
          updateProfilePic(url);
          blob.close();
        });
      }
    );
  };

  const updateProfilePic = async (url) => {
    const updatedData = {
      ...userDataContext,
      profileImageLink: url,
    };

    const response = await sendRequestToServer(
      "/profile/updateUserProfile",
      updatedData
    );
    if (response.success) {
      displayToastMessage("Profile Pic Updated");
      setUserDataContext(updatedData);
      // setIsDataChanged(false);
    }
  };

  const getUpdatedData = () => {
    let updatedData = {
      email: userDataContext.email,
      password: userDataContext.password,
      userType: userDataContext.userType,
      profileImageLink: userDataContext.profileImageLink
        ? userDataContext.profileImageLink
        : "",
      name,
      bio,
      phoneNumber,
      pincode,
      state,
      district,
      houseNo,
      area,
    };

    if (userDataContext.userType === "Shopkeeper")
      updatedData = { ...updatedData, ownerName, sellerType };

    if (userDataContext.userType === "Organization")
      updatedData = { ...updatedData, ownerName };

    return updatedData;
  };

  const updateUserDetails = async () => {
    const updatedData = getUpdatedData();

    const response = await sendRequestToServer(
      "/profile/updateUserProfile",
      updatedData
    );
    if (response.success) {
      displayToastMessage("Profile Updated");
      setUserDataContext(updatedData);
      props.toggleModal();
    }
  };

  return (
    <View style={styles.mainContainerStyle}>
      <KeyboardAwareScrollView style={styles.scrollViewStyle}>
        <View style={styles.shopUserContainerStyle}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleTextStyle}>Edit Details </Text>
          </View>
          <View style={styles.profilePictureViewStyle}>
            <TouchableNativeFeedback onPress={pickImage}>
              <Image
                style={styles.profileImageStyle}
                source={{
                  uri: image,
                }}
              />
            </TouchableNativeFeedback>
          </View>
          <TextInputComponent
            textInputStyle={styles.longTextInputStyle}
            placeholder={
              userDataContext.userType === "Shopkeeper"
                ? "Shop name"
                : userDataContext.userType === "Organization"
                ? "Organization name"
                : "Your name"
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
              placeholder={"Owner name here"}
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
            placeholder={"Phone number"}
            keyboardType={"phone-pad"}
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
            }}
          />
          <TextInputComponent
            // textInputStyle={styles.bioTextStyle}
            textInputStyle={{
              height: 100,
              width: "90%",
              justifyContent: "flex-start",
              padding: 10,
            }}
            placeholder={"About you"}
            textAlignVertical={"top"}
            value={bio}
            onChangeText={(text) => {
              setBio(text);
            }}
          />
          {userDataContext.userType === "Shopkeeper" ? (
            <DropDownPicker
              open={open}
              value={sellerType}
              items={items}
              setOpen={setOpen}
              setValue={setSellerType}
              setItems={setItems}
              style={{
                borderColor: "#3399ff",
                borderWidth: 2,
                borderRadius: 25,
                marginVertical: 5,
              }}
              containerStyle={{ width: 200 }}
              placeholder="What do you sell?"
              placeholderStyle={{ paddingLeft: 10 }}
              textStyle={{ paddingLeft: 10 }}
              onChangeValue={(text) => {
                setSellerType(text);
              }}
            />
          ) : (
            <View></View>
          )}
        </View>
        <View>
          <TextInputComponent
            textInputStyle={styles.longTextInputStyle}
            placeholder={"House no, Building no, Street, etc"}
            value={houseNo}
            onChangeText={(text) => {
              setHouseNo(text);
            }}
          />
          <TextInputComponent
            textInputStyle={styles.longTextInputStyle}
            placeholder={"Area, Colony, Road name, etc"}
            value={area}
            onChangeText={(text) => {
              setArea(text);
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <TextInputComponent
            textInputStyle={{
              width: "43%",
              height: 50,
              marginVertical: 5,
              marginHorizontal: 5,
            }}
            placeholder={"pincode"}
            keyboardType={"phone-pad"}
            value={pincode}
            onChangeText={(text) => {
              setPincode(text);
            }}
          />
          <TextInputComponent
            textInputStyle={{
              width: "43%",
              height: 50,
              marginVertical: 5,
              marginHorizontal: 5,
            }}
            placeholder={"State"}
            value={state}
            onChangeText={(text) => {
              setState(text);
            }}
          />
        </View>
        <TextInputComponent
          textInputStyle={{
            width: "43%",
            height: 50,
            marginVertical: 5,
            marginHorizontal: 5,
          }}
          placeholder={"District"}
          value={district}
          onChangeText={(text) => {
            setDistrict(text);
          }}
        />
        <View
          style={{
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <ButtonComponent
            buttonStyle={styles.submitButtonStyle}
            textStyle={styles.buttonTextStyle}
            buttonText={"Save"}
            handleButton={updateUserDetails}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditProfileComponent;

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // backgroundColor: "blue"
  },

  scrollViewStyle: {
    flex: 1,
    // backgroundColor: "blue",
    width: "100%",
    paddingTop: 10,
    paddingLeft: 10,
  },
  longTextInputStyle: {
    width: "90%",
    height: 50,
    marginVertical: 5,
  },
  bioTextStyle: {
    width: 300,
    height: 100,
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
  profilePictureViewStyle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    elevation: 3,
  },
  profileImageStyle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
  },
});
