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
  ActivityIndicator,
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
import sendRequestToServer from "../hooks/sendRequestToServer";
// import * as firebase from "firebase/compat/app";
// import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SkeletonContent from "react-native-skeleton-content";

const ProfileComponent = ({
  profileEmail,
  profileType,
  editButtonHandle,
  isItOtherUser,
  followRequestsSentArray,
  // currentUserFollowingArray,
  // currentUserFollowersArray,
}) => {
  // console.log(profileData.name + "=>" + profileData.profileImageLink + "|");
  // console.log(profileDataToBeSent);
  const navigation = useNavigation();
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState({});
  const [modalVisibility, setModalVisibility] = useState(false);
  const [whoseListIsPassed, setWhoseListIsPassed] = useState();
  const [followersOrFollowingsArray, setFollowersOrFollowingsArray] = useState(
    []
  );
  const [followButtonText, setFollowButtonText] = useState("Loading");
  // const [image, setImage] = useState(profileData.profileImageLink);
  // const [currentUserFollowingArray, setCurrentUserFollowingArray] = useState(
  //   []
  // );
  // const [followRequestsSent, setFollowRequestsSent] = useState(
  //   followRequestsSentArray
  // );
  // const displayToastMessage = (text) => {
  //   ToastAndroid.show(text, ToastAndroid.SHORT);
  // };
  const fetchLatestData = () => {
    // console.log("fetched Latest");
    db.collection("Users")
      .doc(getUserTypeDocString(profileType))
      .collection("accounts")
      .doc(profileEmail)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setProfileData(snapshot.data());
        }
      });
  };

  const fetchCurrentUserLatestData = () => {
    db.collection("Users")
      .doc(getUserTypeDocString(userDataContext.userType))
      .collection("accounts")
      .doc(userDataContext.email)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          // console.log(snapshot.data());
          setCurrentUserData(snapshot.data());
        }
      });
  };

  useEffect(() => {
    fetchLatestData();
    fetchCurrentUserLatestData();
    // setLoading(false);
  }, [profileEmail]);

  useEffect(() => {
    // console.log(profileData.name);
    if (profileData.name) {
      setLoading(false);
    }
  }, [profileData]);

  //remove Current User From Followers Of Other User
  const unfollowOtherUser = async () => {
    try {
      await db
        .collection("Users")
        .doc(getUserTypeDocString(profileData.userType))
        .collection("accounts")
        .doc(profileData.email)
        .update({
          followersArray: Firestore.FieldValue.arrayRemove(
            userDataContext.email
          ),
        });

      await db
        .collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .update({
          followingArray: Firestore.FieldValue.arrayRemove(profileData.email),
        });
      await db
        .collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .update({
          followRequestsSentArray: Firestore.FieldValue.arrayRemove(
            profileData.email
          ),
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
            sendTime: new Date().toISOString(),
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

  const checkObjectAreEqualOrNot = (oldUserData, newUserData) => {
    if (
      oldUserData.name === newUserData.name &&
      oldUserData.bio === newUserData.bio &&
      oldUserData.profileImageLink === newUserData.profileImageLink &&
      oldUserData.followingArray.length === newUserData.followingArray.length &&
      oldUserData.followersArray.length === newUserData.followersArray.length
    ) {
      return true;
    } else return false;
  };
  const listenRealTimeProfileChanges = async () => {
    await db
      .collection("Users")
      .doc(getUserTypeDocString(profileData.userType))
      .collection("accounts")
      .doc(profileData.email)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          if (checkObjectAreEqualOrNot(profileData, snapshot.data())) {
            setProfileData(snapshot.data());
          }
        }
      });
  };

  // useEffect(() => {
  //   listenRealTimeProfileChanges();
  // });

  // const getCurrentUserFollowingArr
  useEffect(() => {
    if (isItOtherUser) {
      // console.log(userDataContext.followRequestsSentArray);
      if (
        "followersArray" in profileData &&
        profileData.followersArray.length !== 0 &&
        profileData.followersArray.includes(userDataContext.email)
      ) {
        setFollowButtonText("Following");
        // console.log("here1");
      } else if (
        "followRequestsSentArray" in currentUserData &&
        currentUserData.followRequestsSentArray.length !== 0 &&
        currentUserData.followRequestsSentArray.includes(profileData.email)
      ) {
        setFollowButtonText("Request sent");
        // console.log("here2");
      } else {
        // console.log("here3");
        setFollowButtonText("Follow");
      }
    }
  });

  // useEffect(async () => {``
  //   const result = await sendRequestToServer("profile/fetchUserDetails", {
  //     email: profileData.email,
  //   });
  //   if (result.followingArray.length !== 0) {
  //     setCurrentUserFollowingArray(result.followingArray);
  //   }
  // }, [followButtonText]);

  return (
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
            disabled={
              "followersArray" in profileData
                ? profileData.followersArray.length > 0
                  ? false
                  : true
                : true
            }
            onPress={() => {
              navigation.navigate("UsersList", {
                whoseListIsPassed: "followers",
                usersList: profileData.followersArray,
              });
            }}
          >
            <View style={styles.followerFollowingContainerStyle}>
              <Text style={styles.followNoTextStyle}>
                {"followersArray" in profileData
                  ? profileData.followersArray.length
                  : ""}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {"followersArray" in profileData
                  ? profileData.followersArray.length === 1
                    ? "Follower"
                    : "Followers"
                  : ""}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            disabled={
              "followingArray" in profileData
                ? profileData.followingArray.length > 0
                  ? false
                  : true
                : true
            }
            onPress={() => {
              navigation.navigate("UsersList", {
                whoseListIsPassed: "following",
                usersList: profileData.followingArray,
              });
            }}
          >
            <View style={styles.followerFollowingContainerStyle}>
              <Text style={styles.followNoTextStyle}>
                {"followingArray" in profileData
                  ? profileData.followingArray.length
                  : ""}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {"followingArray" in profileData ? "Following" : ""}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      ) : loading ? (
        <View
          style={{
            width: Dimensions.get("window").width,
            marginTop: 50,
            marginBottom: 50,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 80,
              marginHorizontal: "3%",
            }}
          >
            <SkeletonContent isLoading={loading}>
              <View style={{ width: 50, height: 50 }}></View>
            </SkeletonContent>
            <SkeletonContent isLoading={loading}>
              <View style={{ width: 80, height: 20 }}></View>
            </SkeletonContent>
          </View>
          <View>
            <SkeletonContent isLoading={loading}>
              <View
                style={{ width: 150, height: 150, borderRadius: 150 / 2 }}
              ></View>
            </SkeletonContent>
          </View>
          <View
            style={{
              height: 80,
              marginHorizontal: "3%",
            }}
          >
            <SkeletonContent isLoading={loading}>
              <View style={{ width: 50, height: 50 }}></View>
            </SkeletonContent>
            <SkeletonContent isLoading={loading}>
              <View style={{ width: 80, height: 20 }}></View>
            </SkeletonContent>
          </View>
        </View>
      ) : (
        <View style={styles.container1Sub1Style}>
          <View>
            <TouchableNativeFeedback
              disabled={
                "followersArray" in profileData
                  ? profileData.followersArray.length > 0
                    ? false
                    : true
                  : true
              }
              onPress={() => {
                navigation.navigate("UsersList", {
                  whoseListIsPassed: "followers",
                  usersList: profileData.followersArray,
                });
              }}
            >
              <View style={styles.followerFollowingContainerStyle}>
                <Text style={styles.followNoTextStyle}>
                  {"followersArray" in profileData
                    ? profileData.followersArray.length
                    : ""}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {"followersArray" in profileData
                    ? profileData.followersArray.length === 1
                      ? "Follower"
                      : "Followers"
                    : ""}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
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
          <View>
            <TouchableNativeFeedback
              disabled={
                "followingArray" in profileData
                  ? profileData.followingArray.length > 0
                    ? false
                    : true
                  : true
              }
              onPress={() => {
                navigation.navigate("UsersList", {
                  whoseListIsPassed: "following",
                  usersList: profileData.followingArray,
                });
              }}
            >
              <View style={styles.followerFollowingContainerStyle}>
                <Text style={styles.followNoTextStyle}>
                  {"followingArray" in profileData
                    ? profileData.followingArray.length
                    : ""}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {"followingArray" in profileData ? "Following" : ""}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      )}
      {loading ? (
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 50,
            paddingLeft: "3%",
            alignItems: "flex-start",
          }}
        >
          <SkeletonContent isLoading={loading}>
            <View style={{ width: 150, height: 20 }}></View>
          </SkeletonContent>
          <SkeletonContent isLoading={loading}>
            <View style={{ width: 300, height: 20 }}></View>
          </SkeletonContent>
        </View>
      ) : (
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
      )}
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
    backgroundColor: "white",
  },
  container1Sub1Style: {
    width: Dimensions.get("window").width,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal:20
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
    paddingLeft: "5%",
  },
  bioTextStyle: {
    fontSize: 14,
    paddingLeft: "5%",
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
