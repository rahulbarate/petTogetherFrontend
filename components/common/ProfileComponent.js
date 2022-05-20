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
  ImageBackground,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db, Firestore, storage } from "../../firebase";
import { localhostBaseURL } from "../common/baseURLs";
import ButtonComponent from "./ButtonComponent";
import { useNavigation } from "@react-navigation/native";
import getUserTypeDocString from "../hooks/getUserTypeDocString";
import AuthContext from "../hooks/useAuth";
import FollowersFollowingList from "./FollowersFollowingList";
import Modal from "react-native-modal";
// import * as firebase from "firebase/compat/app";

const ProfileComponent = ({
  profileData,
  editButtonHandle,
  isItOtherUser,
  followRequestsSentArray,
  // currentUserFollowingArray,
  // currentUserFollowersArray,
}) => {
  // console.log(profileData.name + "=>" + profileData.profileImageLink + "|");
  const navigation = useNavigation();
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [whoseListIsPassed, setWhoseListIsPassed] = useState();
  const [followersOrFollowingsArray, setFollowersOrFollowingsArray] = useState(
    []
  );
  // const [followRequestsSent, setFollowRequestsSent] = useState(
  //   followRequestsSentArray
  // );
  const [followButtonText, setFollowButtonText] = useState("Loading");
  const displayToastMessage = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  const [image, setImage] = useState(profileData.profileImageLink);

  //remove Current User From Followers Of Other User
  const unfollowOtherUser = async () => {
    try {
      db.collection("Users")
        .doc(getUserTypeDocString(profileData.userType))
        .collection("accounts")
        .doc(profileData.email)
        .update({
          followersArray: Firestore.FieldValue.arrayRemove(
            userDataContext.email
          ),
        });

      db.collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .update({
          followingArray: Firestore.FieldValue.arrayRemove(profileData.email),
        });
    } catch (err) {
      console.log(err);
    }
  };

  //send follow request method
  const sendFollowRequestToOtherUser = async () => {
    try {
      await db
        .collection("Users")
        .doc(getUserTypeDocString(profileData.userType))
        .collection("accounts")
        .doc(profileData.email)
        .update({
          notification: Firestore.FieldValue.arrayUnion({
            notificationType: "followRequest",
            userType: userDataContext.userType,
            userId: userDataContext.email,
            name: userDataContext.name,
            profileImageLink: userDataContext.profileImageLink,
            requestStatus: "waiting",
          }),
        });
    } catch (err) {
      console.log(err.message);
    }
  };
  //adding data in our follow request sent
  const addDataInFollowRequestSentArray = async () => {
    try {
      await db
        .collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .update({
          followRequestsSentArray: Firestore.FieldValue.arrayUnion(
            profileData.email
          ),
        });
    } catch (err) {
      console.log(err.message);
    }
  };

  //handle follow Button
  const handleFollowButton = async () => {
    if (followButtonText === "Follow") {
      setFollowButtonText("Request sent");
      sendFollowRequestToOtherUser();
      addDataInFollowRequestSentArray();
    } else if (followButtonText === "Following") {
      setFollowButtonText("Follow");
      await unfollowOtherUser();
    }
  };

  useEffect(() => {
    if (followRequestsSentArray.length !== 0) {
      // console.log(followRequestsSentArray);
      if (followRequestsSentArray.includes(profileData.email))
        setFollowButtonText("Request sent");
      // else {
      // }
    }
    if ("followingArray" in userDataContext) {
      if (userDataContext.followingArray.includes(profileData.email))
        setFollowButtonText("Following");
      else {
        setFollowButtonText("Follow");
      }
    }
  }, [followRequestsSentArray]);

  return modalVisibility ? (
    <View style={styles.container1Style}>
      <Modal
        isVisible={modalVisibility}
        style={styles.modalStyle}
        onSwipeComplete={() => setModalVisibility(false)}
        onBackButtonPress={() => setModalVisibility(false)}
        swipeDirection="down"
      >
        <FollowersFollowingList
          whoseListIsPassed={whoseListIsPassed}
          followersOrFollowingsArray={followersOrFollowingsArray}
        />
      </Modal>
    </View>
  ) : (
    <View style={styles.container1Style}>
      {isItOtherUser ? (
        <View style={styles.container1Sub1Style}>
          <View style={styles.profilePictureViewStyle}>
            <TouchableNativeFeedback>
              <ImageBackground
                style={styles.profilePictureViewStyle}
                source={require("../../static/images/blankProfilePicture.png")}
                imageStyle={styles.profileImageStyle}
              >
                <Image
                  style={styles.profileImageStyle}
                  source={
                    profileData.profileImageLink && {
                      uri: profileData.profileImageLink,
                    }
                  }
                />
              </ImageBackground>
            </TouchableNativeFeedback>
          </View>
          <TouchableNativeFeedback
            onPress={() => {
              setWhoseListIsPassed("followers");
              setFollowersOrFollowingsArray(profileData.followersArray);
              setModalVisibility(true);
            }}
          >
            <View style={styles.followerFollowingContainerStyle}>
              <Text style={styles.followNoTextStyle}>
                {"followersArray" in profileData
                  ? profileData.followersArray.length
                  : "0"}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {"followersArray" in profileData ? "Followers" : ""}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => {
              setWhoseListIsPassed("followings");
              setFollowersOrFollowingsArray(profileData.followingArray);
              setModalVisibility(true);
            }}
          >
            <View style={styles.followerFollowingContainerStyle}>
              <Text style={styles.followNoTextStyle}>
                {"followingArray" in profileData
                  ? profileData.followingArray.length
                  : "0"}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {"followingArray" in profileData ? "Followings" : ""}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      ) : (
        <View style={styles.container1Sub1Style}>
          <TouchableNativeFeedback
            onPress={() => {
              setWhoseListIsPassed("followers");
              setFollowersOrFollowingsArray(profileData.followersArray);
              setModalVisibility(true);
            }}
          >
            <View style={styles.followerFollowingContainerStyle}>
              <Text style={styles.followNoTextStyle}>
                {"followersArray" in profileData
                  ? profileData.followersArray.length
                  : "0"}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {"followersArray" in profileData ? "Followers" : ""}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <View style={styles.profilePictureViewStyle}>
            <TouchableNativeFeedback>
              <ImageBackground
                style={styles.profilePictureViewStyle}
                source={require("../../static/images/blankProfilePicture.png")}
                imageStyle={styles.profileImageStyle}
              >
                <Image
                  style={styles.profileImageStyle}
                  source={
                    profileData.profileImageLink && {
                      uri: profileData.profileImageLink,
                    }
                  }
                />
              </ImageBackground>
            </TouchableNativeFeedback>
          </View>
          <TouchableNativeFeedback
            onPress={() => {
              setWhoseListIsPassed("followings");
              setFollowersOrFollowingsArray(profileData.followingArray);
              setModalVisibility(true);
            }}
          >
            <View style={styles.followerFollowingContainerStyle}>
              <Text style={styles.followNoTextStyle}>
                {"followingArray" in profileData
                  ? profileData.followingArray.length
                  : "0"}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {"followingArray" in profileData ? "Followings" : ""}
              </Text>
            </View>
          </TouchableNativeFeedback>
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
        <View
          style={
            isItOtherUser
              ? styles.otherUserProfileViewStyle
              : styles.editProfileTextViewStyle
          }
        >
          {isItOtherUser ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ButtonComponent
                buttonStyle={{
                  width: 100,
                  height: 30,
                  marginHorizontal: "2%",
                  borderRadius: 20,
                  backgroundColor:
                    followButtonText !== "Follow" ? "#A9A9A9" : "#3399ff",
                }}
                makeButtonDisabled={
                  followButtonText === "Request sent" ||
                  followButtonText === "Loading"
                    ? true
                    : false
                }
                buttonText={followButtonText}
                handleButton={() => {
                  handleFollowButton();
                }}
              />
              <ButtonComponent
                buttonStyle={{
                  width: 100,
                  height: 30,
                  borderRadius: 20,
                  marginHorizontal: "2%",
                }}
                buttonText={"Message"}
                handleButton={() => {
                  if (profileData) {
                    navigation.navigate("Message", {
                      messageWith: profileData.email,
                      name: profileData.name,
                    });
                  }
                }}
              />
              {profileData.userType !== "Individual User" && (
                <ButtonComponent
                  buttonStyle={{
                    width: 100,
                    height: 30,
                    borderRadius: 20,
                    marginHorizontal: "2%",
                  }}
                  buttonText={"Visit"}
                  handleButton={() => {
                    if (profileData.coordinate) {
                      navigation.navigate("Map", { userData: profileData });
                    }
                  }}
                />
              )}
            </View>
          ) : (
            <ButtonComponent
              buttonStyle={{
                paddingHorizontal: 10,
                height: 25,
                borderRadius: 25,
              }}
              buttonText={"Edit profile"}
              handleButton={editButtonHandle}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileComponent;

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    marginTop: "15%",
    borderRadius: 30,
  },
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
    maxHeight: 80,
  },
  followNoTextStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editProfileTextViewStyle: {
    // backgroundColor:"red",
    paddingRight: "2%",
    justifyContent: "center",
    alignItems: "flex-end",
    width: Dimensions.get("window").width,
  },
  otherUserProfileViewStyle: {
    // backgroundColor:"red",
    marginVertical: "2%",
    paddingRight: "2%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "3%",
    width: Dimensions.get("window").width,
  },
  editProfileTextStyle: {
    marginHorizontal: 10,
    color: "blue",
    opacity: 0.8,
    textDecorationLine: "underline",
  },
});
