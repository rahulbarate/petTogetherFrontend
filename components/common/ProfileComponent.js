import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  TouchableNativeFeedback,
  ToastAndroid,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebase";
import { localhostBaseURL } from "../common/baseURLs";
import ButtonComponent from "./ButtonComponent";
// import * as firebase from "firebase/compat/app";

const ProfileComponent = ({ profileData, editButtonHandle, isItOtherUser }) => {
  const displayToastMessage = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };
  //   console.log(profileData.profileImageLink);
  //   const { userDataContext, setUserDataContext } = useContext(AuthContext);

  const [image, setImage] = useState(profileData.profileImageLink);
  //   ? profileData.profileImageLink
  //   : "https://images.unsplash.com/photo-1497124401559-3e75ec2ed794?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  //   );
  //   const storage = getStorage();
  //   const metadata = {
  //     contentType: "image/jpeg",
  //   };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage();
    }
  };
  const sendUpdateRequestToServer = async (url) => {
    // console.log(url);
    //   console.log("in the server req");
    try {
      const res = await localhostBaseURL.post("/profile/updateUserProfile", {
        userData: { ...profileData, profileImageLink: url },
      });

      if (res.data.success) {
        displayToastMessage("Profile Pic Updated");
        // setIsDataChanged(false);
      }
      // setUserDataContext(res.data);
    } catch (error) {
      alert(error);
    }
  };

  const uploadImage = async () => {
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

    const storageRef = storage.ref().child(new Date().toISOString() + ".jpeg");
    const uploadTask = storageRef.put(blob);
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
          //   console.log("File available at", url);
          sendUpdateRequestToServer(url);
          blob.close();
        });
      }
    );
  };

  return (
    <View style={styles.container1Style}>
      {isItOtherUser ? (
        <View style={styles.container1Sub1Style}>
          <View style={styles.profilePictureViewStyle}>
            <TouchableNativeFeedback>
              <Image
                style={styles.profileImageStyle}
                source={{
                  uri: profileData.profileImageLink,
                }}
              />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.followerFollowingContainerStyle}>
            <Text style={styles.followNoTextStyle}>
              {"noOfFollowers" in profileData ? profileData.noOfFollowers : ""}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {"noOfFollowers" in profileData ? "Followers" : ""}
            </Text>
          </View>
          <View style={styles.followerFollowingContainerStyle}>
            <Text style={styles.followNoTextStyle}>
              {"noOfFollowings" in profileData
                ? profileData.noOfFollowings
                : ""}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {"noOfFollowings" in profileData ? "Followings" : ""}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.container1Sub1Style}>
          <View style={styles.followerFollowingContainerStyle}>
            <Text style={styles.followNoTextStyle}>
              {"noOfFollowers" in profileData ? profileData.noOfFollowers : ""}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {"noOfFollowers" in profileData ? "Followers" : ""}
            </Text>
          </View>
          <View style={styles.profilePictureViewStyle}>
            <TouchableNativeFeedback>
              <Image
                style={styles.profileImageStyle}
                source={{
                  uri: profileData.profileImageLink,
                }}
              />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.followerFollowingContainerStyle}>
            <Text style={styles.followNoTextStyle}>
              {"noOfFollowings" in profileData
                ? profileData.noOfFollowings
                : ""}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {"noOfFollowings" in profileData ? "Followings" : ""}
            </Text>
          </View>
        </View>
      )}
      <View>
        <Text style={styles.userNameTextStyle}>
          {"name" in profileData ? profileData.name : ""}
        </Text>
        <View style={styles.bioViewStyle}>
          <Text style={styles.bioTextStyle}>
            {"bio" in profileData ? profileData.bio : ""}
          </Text>
        </View>
        <View style={styles.editProfileTextViewStyle}>
          {isItOtherUser ? (
            <View style={{ flexDirection: "row" }}>
              <ButtonComponent
                buttonStyle={{
                  width: 100,
                  height: 30,
                  marginHorizontal: "8%",
                  borderRadius: 20,
                }}
                buttonText={"Follow"}
              />
              <ButtonComponent
                buttonStyle={{
                  width: 100,
                  height: 30,
                  borderRadius: 20,
                  marginHorizontal: "8%",
                }}
                buttonText={"Message"}
              />
            </View>
          ) : (
            <TouchableNativeFeedback onPress={editButtonHandle}>
              <Text style={styles.editProfileTextStyle}>Edit Profile</Text>
            </TouchableNativeFeedback>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileComponent;

const styles = StyleSheet.create({
  container1Style: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  container1Sub1Style: {
    width: Dimensions.get("window").width,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureViewStyle: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: "blue",
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
  followerFollowingContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 4,
  },
  userNameTextStyle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingLeft: "3%",
  },
  bioTextStyle: {
    fontSize: 14,
    paddingLeft: "3%",
    paddingRight: "2%",
  },
  bioViewStyle: {
    width: Dimensions.get("window").width,
    height: 80,
  },
  followNoTextStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editProfileTextViewStyle: {
    // backgroundColor:"red",
    paddingRight: "2%",
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "flex-end",
    width: Dimensions.get("window").width,
  },
  editProfileTextStyle: {
    marginHorizontal: 10,
    color: "blue",
    opacity: 0.8,
    textDecorationLine: "underline",
  },
});
