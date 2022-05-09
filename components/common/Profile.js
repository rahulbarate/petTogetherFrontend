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

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const Profile = () => {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [response, setResponse] = useState({});
  const data = [
    {
      key: "1",
      data: "key 1",
      imageLink: require("../../static/images/post1.jpg"),
    },
    {
      key: "2",
      data: "key 2",
      imageLink: require("../../static/images/post2.jpg"),
    },
    {
      key: "3",
      data: "key 3",
      imageLink: require("../../static/images/post3.jpg"),
    },
    {
      key: "4",
      data: "key 4",
      imageLink: require("../../static/images/post4.jpg"),
    },
    {
      key: "5",
      data: "key 5",
      imageLink: require("../../static/images/hedgehog.jpg"),
    },
    {
      key: "6",
      data: "key 6",
      imageLink: require("../../static/images/back.jpg"),
    },
    {
      key: "7",
      data: "key 7",
      imageLink: require("../../static/images/back3.jpg"),
    },
    {
      key: "8",
      data: "key 8",
      imageLink: require("../../static/images/back4.jpg"),
    },
    {
      key: "9",
      data: "key 9",
      imageLink: require("../../static/images/back5.jpg"),
    },
    {
      key: "10",
      data: "key 10",
      imageLink: require("../../static/images/back6.jpg"),
    },
    {
      key: "11",
      data: "key 11",
      imageLink: require("../../static/images/back7.jpg"),
    },
  ];
  const [listOfData, setListOfData] = useState(data);
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
        profileData={{ ...userDataContext }}
        editButtonHandle={() => setModalVisibility(true)}
      />
      <PostsListContainer listOfPosts={listOfData} />
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
