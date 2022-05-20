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
import sendRequestToServer from "../hooks/sendRequestToServer";
import getUserTypeDocString from "../hooks/getUserTypeDocString";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const OtherUsersProfile = ({ route }) => {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [otherUserData, setOtherUserData] = useState();
  const [listOfAllPosts, setListOfAllPosts] = useState();
  const [followRequestsSentArray, setFollowRequestsSentArray] = useState([]);
  const [currentUserFollowingArray, setCurrentUserFollowingArray] = useState(
    []
  );
  const [currentUserFollowersArray, setCurrentUserFollowersArray] = useState(
    []
  );
  // const {usersEmail,setUsersEmail} = useState(route.email);
  const { clickedUsersEmail } = route.params;

  // const [response, setResponse] = useState({});
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
  // const [listOfData, setListOfData] = useState(data);
  const [modalVisibility, setModalVisibility] = useState(false);

  const fetchUsersData = async () => {
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

  const getUsersData = async () => {
    // console.log(clickedUsersEmail);
    try {
      const res = await sendRequestToServer("/profile/fetchUserDetails", {
        email: clickedUsersEmail,
      });
      //   console.log(res);
      //   setResponse(res);
      setOtherUserData(res);
    } catch (error) {
      alert(error);
    }
  };

  const listenRealTimePostUpdate = () => {
    const userTypeDoc = getUserTypeDocString(otherUserData.userType);
    db.collection("Users")
      .doc(userTypeDoc)
      .collection("accounts")
      .doc(otherUserData.email)
      .collection("posts")
      .orderBy("uploadedOn", "desc")
      .onSnapshot((snapshot) => {
        if (listOfAllPosts.length !== snapshot.docs.length) {
          let postArr = [];
          // setListOfAllPosts([]);
          snapshot.docs.forEach((eachPost) => {
            postArr.push({ ...eachPost.data(), postId: eachPost.id });
          });

          setListOfAllPosts(postArr);
        }
      });
  };

  const getLoggedInUserFollowRequestSentArray = async () => {
    try {
      const result = await db
        .collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            if (snapshot.data().followRequestsSentArray) {
              // console.log(snapshot.data().followRequestsSentArray);
              setFollowRequestsSentArray(
                snapshot.data().followRequestsSentArray
              );
            }
          }
        });
      // .get();
    } catch (error) {
      console.log(error.message);
    }
  };
  const getLoggedInUserFollowAndFollowingArray = async () => {
    try {
      db.collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            if ("followingArray" in snapshot.data()) {
              // console.log("In followingArray");
              // console.log(snapshot.data().followingArray);
              setCurrentUserFollowingArray(snapshot.data().followingArray);
            }
            if ("followersArray" in snapshot.data()) {
              // console.log("In followers array");
              // console.log(snapshot.data().followersArray);
              setCurrentUserFollowersArray(snapshot.data().followersArray);
            }
          }
        });

      // .get();
    } catch (error) {
      console.log(error.message);
    }
  };

  // useEffect(() => {
  //   listenRealTimePostUpdate();
  // });
  useEffect(async () => {
    await getUsersData();
    // await getLoggedInUserFollowRequestSentArray();
    // await getLoggedInUserFollowAndFollowingArray();
  }, []);

  return (
    <View style={styles.mainContainerStyle}>
      <ProfileComponent
        profileData={{ ...otherUserData }}
        editButtonHandle={() => setModalVisibility(true)}
        isItOtherUser={true}
        followRequestsSentArray={followRequestsSentArray}
        currentUserFollowersArray={[]}
        // currentUserFollowingArray={currentUserFollowingArray}
      />
      <PostsListContainer
        userData={{ ...otherUserData }}
        allPosts={listOfAllPosts}
        isItOtherUser={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
  },
  modalStyle: {
    margin: 0,
    marginTop: "15%",
    borderRadius: 30,
  },
});
export default OtherUsersProfile;
