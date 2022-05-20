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

//
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const IndividualUserPostUpload = () => {
  const navigation = useNavigation();
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [postType, setPostType] = useState("casual");
  const [petType, setPetType] = useState();
  const [petName, setPetName] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [postDescription, setPostDescription] = useState();
  const [breed, setBreed] = useState();
  const [price, setPrice] = useState();
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

  //methods
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

  const getEnteredData = () => {
    let postData;
    postData = {
      postType,
      postDescription,
      postImageLink: image,
      uploadedOn: new Date(),
    };
    if (postType == "petSellPost") {
      postData = { ...postData, petName, petType, price, breed, dateOfBirth };
    }
    if (postType == "casual") {
      postData = { ...postData, petName };
    }
    if (postType == "reshelter") {
      postData = { ...postData, petName, petType, breed, dateOfBirth };
    }
    if (postType == "breedPost") {
      postData = { ...postData, petName, petType, breed };
    }
    return postData;
  };

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
    // console.log(getEnteredData());
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
                source={image ? { uri: image } : {}}
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
              placeholder={"Post description here..."}
              textAlignVertical={"top"}
              value={postDescription}
              onChangeText={setPostDescription}
            />
          </View>
        </View>
        <View style={styles.radioButtonGroupStyle}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              marginHorizontal: 15,
            }}
          >
            <View style={styles.radioButtonAndTextViewStyle}>
              <RadioButton
                value="casual"
                status={postType === "casual" ? "checked" : "unchecked"}
                onPress={() => setPostType("casual")}
                color={"#3399ff"}
              />
              <Text
                style={
                  postType === "casual"
                    ? styles.radioButtonTextStyle
                    : styles.radioButtonUncheckedTextStyle
                }
              >
                Casual post
              </Text>
            </View>
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
                Sell post
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              marginHorizontal: 15,
            }}
          >
            <View style={styles.radioButtonAndTextViewStyle}>
              <RadioButton
                value="reshelter"
                status={postType === "reshelter" ? "checked" : "unchecked"}
                onPress={() => setPostType("reshelter")}
                color={"#3399ff"}
              />
              <Text
                style={
                  postType === "reshelter"
                    ? styles.radioButtonTextStyle
                    : styles.radioButtonUncheckedTextStyle
                }
              >
                Re-shelter
              </Text>
            </View>
            <View style={styles.radioButtonAndTextViewStyle}>
              <RadioButton
                value="breedPost"
                status={postType === "breedPost" ? "checked" : "unchecked"}
                onPress={() => setPostType("breedPost")}
                color={"#3399ff"}
              />
              <Text
                style={
                  postType === "breedPost"
                    ? styles.radioButtonTextStyle
                    : styles.radioButtonUncheckedTextStyle
                }
              >
                Up for breed
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.container2Style}>
          <TextInputComponent
            textInputStyle={{ height: 50, marginVertical: 8 }}
            placeholder={"Pet name here"}
            value={petName}
            onChangeText={setPetName}
          />
        </View>
        <View style={styles.container3Style}>
          {(postType === "petSellPost" ||
            postType === "reshelter" ||
            postType === "breedPost") && (
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
        <View style={styles.container4Style}>
          {(postType === "petSellPost" || postType === "reshelter") && (
            <View style={{ flex: 1 / 2, marginHorizontal: 10 }}>
              <TextInputComponent
                textInputStyle={{
                  height: 50,
                }}
                placeholder={"Date of birth"}
                keyboardType={"phone-pad"}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
            </View>
          )}
          {postType === "petSellPost" && (
            <View style={{ flex: 1 / 2, marginHorizontal: 10 }}>
              <TextInputComponent
                textInputStyle={{ height: 50 }}
                placeholder={"Enter price"}
                keyboardType={"phone-pad"}
                value={price}
                onChangeText={setPrice}
              />
            </View>
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

export default IndividualUserPostUpload;

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
  },
  container3Style: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  container4Style: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bottomButtonGroupStyle: {
    marginTop: 100,
    justifyContent: "space-around",
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
