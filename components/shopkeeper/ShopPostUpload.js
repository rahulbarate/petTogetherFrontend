import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ButtonComponent from "../common/ButtonComponent";
import { useNavigation } from "@react-navigation/native";
import TextInputComponent from "../common/TextInputComponent";
import { RadioButton } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { Firestore, storage } from "../../firebase";
import AuthContext from "../hooks/useAuth";
import sendRequestToServer from "../hooks/sendRequestToServer";

// import Dropdown from "react-native-element-dropdown";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const ShopPostUpload = () => {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [postType, setPostType] = useState("productShowcasePost");
  const [petType, setPetType] = useState();
  const [petName, setPetName] = useState();
  const [productName, setProductName] = useState();
  const [postDescription, setPostDescription] = useState();
  const [price, setPrice] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [breed, setBreed] = useState();
  const [productCategory, setProductCategory] = useState();
  const [image, setImage] = useState("");

  const [petTypes, setPetTypes] = useState([
    {
      label: "Dog",
      value: "dog",
    },
    {
      label: "Cat",
      value: "cat",
    },
    {
      label: "Fish",
      value: "fish",
    },
  ]);
  const [productCategorys, setProductCategorys] = useState([
    { label: "Food", value: "food" },
    { label: "Grooming", value: "grooming" },
    { label: "Toys", value: "toys" },
  ]);
  const [breeds, setBreeds] = useState({
    dog: [
      { label: "Bulldog", value: "bulldog" },
      { label: "Pug", value: "pug" },
      { label: "Dobermann", value: "dobermann" },
    ],
    cat: [
      { label: "Persian", value: "persian" },
      { label: "Ragdoll", value: "ragdoll" },
      { label: "sphynx", value: "sphynx" },
      { label: "Siamese", value: "siamese" },
    ],
    fish: [
      { label: "Goldfish", value: "goldfish" },
      { label: "Koi", value: "koi" },
      { label: "Comet", value: "comet" },
    ],
  });

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
      // uploadImage(result.uri);
    }
  };

  const uploadImage = async (callback) => {
    if (image) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = () => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });

      //
      const storageRef = storage
        .ref(`${userDataContext.email}/posts/`)
        .child(`${new Date().toISOString()}.jpeg`);
      // .child("postImage.jpeg");

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
            setImage(url);
            callback(url);
            // updateProfilePic(url);
            blob.close();
          });
        }
      );
    } else {
      ToastAndroid.show("Wait for image to be uploaded", ToastAndroid.SHORT);
    }
  };

  const cleanerForUseEffect = () => {
    setOpen();
    setOpen2();
    setOpen3();
    setPostType();
    setPetType();
    setPetName();
    setProductName();
    setPostDescription();
    setPrice();
    setDateOfBirth();
    setBreed();
    setProductCategory();
    setImage();
    setPetTypes();
    setProductCategorys();
    setBreeds();
  };

  const getEnteredData = () => {
    let postData;
    postData = {
      postType,
      price,
      postDescription,
      postImageLink: image,
      uploadedOn: new Date(),
    };
    if (postType == "petSellPost") {
      postData = { ...postData, petName, petType, breed, dateOfBirth };
    }
    if (postType == "productShowcasePost") {
      postData = { ...postData, productName, productCategory };
    }
    // console.log(postData);
    return postData;
  };

  // useEffect(() => {
  //   // console.log(im);
  //   if (image.includes("firebasestorage")) {
  //     uploadPost();
  //   }
  // }, [image]);

  const uploadPost = async (url) => {
    const postData = {
      userEmail: userDataContext.email,
      userType: userDataContext.userType,
      ...getEnteredData(),
      postImageLink: url,
    };

    const response = await sendRequestToServer("/profile/uploadPost", postData);
    if (response.success) {
      ToastAndroid.show("Post uploaded ", ToastAndroid.SHORT);
      navigation.navigate("MainComponent");
    }
  };

  const handleUploadButton = () => {
    ToastAndroid.show("Uploading", ToastAndroid.SHORT);
    uploadImage(uploadPost);
    // navigation.navigate("MainComponent");
  };
  return (
    <View style={styles.mainContainerStyle}>
      <KeyboardAwareScrollView
        style={{ flex: 1, height: deviceHeight, width: deviceWidth }}
      >
        <View style={styles.cotainter1Style}>
          <View style={styles.postImageViewStyle}>
            <TouchableNativeFeedback onPress={pickImage}>
              <Image
                style={styles.postImageStyle}
                source={
                  image
                    ? { uri: image }
                    : require("../../static/images/camera1.jpeg")
                }
              />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.descriptionBoxStyle}>
            <TextInputComponent
              textInputStyle={{
                height: 150,
                justifyContent: "flex-start",
                padding: 10,
              }}
              fontSize={18}
              placeholder={"Enter post description here..."}
              textAlignVertical={"top"}
              value={postDescription}
              onChangeText={setPostDescription}
            />
          </View>
        </View>
        <View style={styles.radioButtonGroupStyle}>
          <View style={styles.radioButtonAndTextViewStyle}>
            <RadioButton
              value="petSellPost"
              status={postType === "petSellPost" ? "checked" : "unchecked"}
              onPress={() => setPostType("petSellPost")}
              color={"#3399ff"}
            />
            <Text
              style={
                postType === "petSellPost"
                  ? styles.radioButtonTextStyle
                  : styles.radioButtonUncheckedTextStyle
              }
            >
              Sell pet
            </Text>
          </View>
          <View style={styles.radioButtonAndTextViewStyle}>
            <RadioButton
              value="productShowcasePost"
              status={
                postType === "productShowcasePost" ? "checked" : "unchecked"
              }
              onPress={() => setPostType("productShowcasePost")}
              color={"#3399ff"}
            />
            <Text
              style={
                postType === "productShowcasePost"
                  ? styles.radioButtonTextStyle
                  : styles.radioButtonUncheckedTextStyle
              }
            >
              Showcase product
            </Text>
          </View>
        </View>
        <View style={styles.container2Style}>
          <TextInputComponent
            textInputStyle={{ height: 50, marginVertical: 8 }}
            placeholder={
              postType === "petSellPost"
                ? "Enter pet name"
                : "Enter product name"
            }
            value={postType === "petSellPost" ? petName : productName}
            onChangeText={
              postType === "petSellPost" ? setPetName : setProductName
            }
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 8,
            }}
          >
            <View style={{ flex: 1, paddingRight: 5 }}>
              <TextInputComponent
                textInputStyle={{ height: 50 }}
                placeholder={"Enter price"}
                keyboardType={"phone-pad"}
                value={price}
                onChangeText={setPrice}
              />
            </View>
            <View style={{ flex: 1, paddingLeft: 5 }}>
              {postType === "petSellPost" && (
                <TextInputComponent
                  textInputStyle={{
                    height: 50,
                  }}
                  placeholder={"Date of birth"}
                  keyboardType={"phone-pad"}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                />
              )}
              {postType === "productShowcasePost" && (
                <DropDownPicker
                  open={open3}
                  value={productCategory}
                  items={productCategorys}
                  setOpen={setOpen3}
                  setValue={setProductCategory}
                  setItems={setProductCategorys}
                  style={{
                    borderColor: "#3399ff",
                    borderWidth: 2,
                    borderRadius: 25,
                  }}
                  placeholder="Product type"
                  onChangeValue={(text) => {
                    setProductCategory(text);
                  }}
                />
              )}
            </View>
          </View>
          {postType === "petSellPost" && (
            <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1, paddingRight: 5 }}>
                <DropDownPicker
                  open={open}
                  value={petType}
                  items={petTypes}
                  setOpen={setOpen}
                  setValue={setPetType}
                  setItems={setPetTypes}
                  style={{
                    borderColor: "#3399ff",
                    borderWidth: 2,
                    borderRadius: 25,
                  }}
                  placeholder="Choose pet type"
                  onChangeValue={(text) => {
                    setPetType(text);
                  }}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: 5 }}>
                {petType && (
                  <DropDownPicker
                    open={open2}
                    value={breed}
                    items={breeds[petType]}
                    setOpen={setOpen2}
                    setValue={setBreed}
                    setItems={setBreeds}
                    style={{
                      borderColor: "#3399ff",
                      borderWidth: 2,
                      borderRadius: 25,
                    }}
                    placeholder="Choose breed"
                    onChangeValue={(text) => {
                      setBreed(text);
                    }}
                  />
                )}
              </View>
            </SafeAreaView>
          )}
        </View>
        <View style={styles.bottomButtonGroupStyle}>
          <ButtonComponent
            buttonStyle={{ width: 150, height: 50, borderRadius: 25 }}
            buttonText={"Upload"}
            handleButton={handleUploadButton}
          />
          <ButtonComponent
            buttonStyle={{ width: 150, height: 50, borderRadius: 25 }}
            buttonText={"Go Back"}
            handleButton={() => {
              navigation.goBack();
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ShopPostUpload;

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    height: deviceHeight,
  },
  cotainter1Style: {
    flex: 0.5,
    flexDirection: "row",
    marginVertical: 8,
  },
  postImageViewStyle: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#E0FFFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    elevation: 3,
  },
  postImageStyle: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },
  descriptionBoxStyle: {
    flex: 1,
    height: "100%",
    marginRight: 8,
  },
  radioButtonGroupStyle: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
  },
  radioButtonAndTextViewStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  radioButtonTextStyle: {
    // fontSize: 20,
    textDecorationLine: "underline",
    color: "#3399ff",
  },
  radioButtonUncheckedTextStyle: {
    // fontSize: 20,
    color: "black",
  },
  container2Style: {
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  bottomButtonGroupStyle: {
    marginTop: 100,
    justifyContent: "space-around",
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
