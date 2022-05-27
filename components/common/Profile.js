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
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import Modal from "react-native-modal";
import AuthContext from "../hooks/useAuth";
import { db } from "../../firebase";
import { LogBox } from "react-native";
import { localhostBaseURL } from "../common/baseURLs";
import ProfileComponent from "../common/ProfileComponent";
import PostsListContainer from "../common/PostsListContainer";
// import EditShopOwnerDetails from "./EditShopOwnerDetails";
import EditProfileComponent from "../common/EditProfileComponent";
import getUserTypeDocString from "../hooks/getUserTypeDocString";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const Profile = () => {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  const [modalVisibility, setModalVisibility] = useState(false);

  const fetchUserData = async () => {
    // console.log(userDataContext);
    const docRef = db
      .collection("Users")
      .doc("shopkeeper")
      .collection("shopAccounts")
      .doc(userDataContext.email);
    const userData = await docRef.get();

    if (!userData.exists) {
      console.log("not found");
    } else {
      console.log(userData.data());
      setUserDataContext(userData.data());
    }
  };

  const toggleModal = () => {
    setModalVisibility(!modalVisibility);
  };

  const getDataFromServer = async () => {
    // console.log("getting data from server");
    // alert("request sent");
    try {
      const res = await localhostBaseURL.post("/profile/shopkeeper", {
        emailId: userDataContext.email,
      });
      // console.log("Response is here");
      // console.log(res.data);
      setResponse(res);
      setUserDataContext(res.data);
    } catch (error) {
      alert(error);
    }
  };

  const getLoggedInUserFollowAndFollowingArray = async () => {
    try {
      const result = await db
        .collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .get();
      if (!result.exists) {
        console.log("doc not found");
      } else {
        if ("followingArray" in result.data()) {
          console.log(result.data());
          setCurrentUserFollowingArray(result.data().followingArray);
        }
        if ("followersArray" in result.data()) {
          setCurrentUserFollowersArray(result.data().followersArray);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return modalVisibility ? (
    <Modal
      isVisible={modalVisibility}
      style={styles.modalStyle}
      onSwipeComplete={() => setModalVisibility(false)}
      onBackButtonPress={() => setModalVisibility(false)}
      swipeDirection="down"
    >
      <EditProfileComponent toggleModal={toggleModal} />
    </Modal>
  ) : (
    <View style={styles.mainContainerStyle}>
      <ProfileComponent
        // profileData={{ ...userDataContext }}
        profileEmail={userDataContext.email}
        profileType={userDataContext.userType}
        editButtonHandle={() => setModalVisibility(true)}
        isItOtherUser={false}
        followRequestsSentArray={[]}
        currentUserFollowersArray={[]}
        currentUserFollowingArray={[]}
      />
      <PostsListContainer
        userData={{ ...userDataContext }}
        isItOtherUser={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalStyle: {
    margin: 0,
    marginTop: "15%",
    borderRadius: 30,
  },
});
export default Profile;
