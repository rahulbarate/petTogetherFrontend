import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import getUserTypeDocString from "../hooks/getUserTypeDocString";
import AuthContext from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebase";
import Like from "../../Helper/homeHelper/Like";
import { localhostBaseURL } from "./baseURLs";
import Modal from "react-native-modal";
import FollowersFollowingList from "./FollowersFollowingList";

const SinglePostCard = ({ item, profileImageLink }) => {
  // const navigation = useNavigation();
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [whoseListIsPassed, setWhoseListIsPassed] = useState("userWhoLikedIds");
  const [followersOrFollowingsArray, setFollowersOrFollowingsArray] = useState(
    item.userWhoLikedIds ? item.userWhoLikedIds : []
  );
  const [markPostString, setMarkPostString] = useState(
    item.userWhoBought
      ? "Sold"
      : item.userWhoAdopted
      ? "Adopted"
      : item.organizationWhoResheltered
      ? "Impounded"
      : ""
  );
  const [postTypeTextString, setPostTypeTextString] = useState(
    item.postType === "casual"
      ? "Casual"
      : item.postType === "petSellPost" && !item.userWhoBought
      ? "Up for sell"
      : item.postType === "reshelter" && !item.organizationWhoResheltered
      ? "Up for impounding"
      : item.postType === "petForAdoption" && !item.userWhoAdopted
      ? "Up for adoption"
      : item.postType === "breedPost"
      ? "Up for  breeding"
      : ""
  );
  // const { userDataContext } = useContext(AuthContext);
  const [likes, setLikes] = useState(
    item.userWhoLikedIds ? item.userWhoLikedIds : []
  );
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => {
      return like == userDataContext.email;
    }).length > 0;
  const navigation = useNavigation();

  // useEffect(() => {},[likes])

  //delete post function
  const deletePost = async (postId) => {
    navigation.goBack();
    // console.log(postId);
    try {
      await db
        .collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .collection("posts")
        .doc(postId)
        .delete();
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteButton = (postId) => {
    Alert.alert("Alert", "Do you want to delete this post?", [
      {
        text: "Yes",
        onPress: () => {
          // console.log(postId + "in handleDeleteButton");
          deletePost(postId);
        },
      },
      { text: "No", onPress: null },
    ]);
  };

  const handleComment = (item) => {
    const dataForComment = {
      postId: item.postId,
      postUserEmail: item.userEmail,
      postUserType: item.userType,
      postComments: item.comments,
    };
    return navigation.navigate("Comment", dataForComment);
  };
  const handleLikeButton = (item) => {
    if (item.userEmail === userDataContext.email) {
      //display list
      setModalVisibility(true);
    } else {
      //
      setPostLike(
        item.userEmail,
        item.userType,
        item.postId,
        profileImageLink,
        isLiked
      );
    }
  };
  const setPostLike = async (
    postUserEmail,
    postUserType,
    postId,
    profileImageLink,
    isLiked
  ) => {
    try {
      if (isLiked) {
        setLikes((prev) =>
          prev.filter((like) => like != userDataContext.email)
        );
      } else {
        setLikes((prev) => [...prev, userDataContext.email]);
      }
      const res = await localhostBaseURL.post("/home/setPostLike", {
        name: userDataContext.name,
        notificationType: "like",
        postId,
        profileImageLink,
        emailId: userDataContext.email,
        userType: userDataContext.userType,
        postUserType,
        postUserEmail,
        sendTime: new Date(),
        isLiked,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
    <View style={styles.mainContainerStyle}>
      <View style={styles.postCardStyle}>
        <View style={styles.container1Style}>
          <View style={styles.profilePictureViewStyle}>
            <Image
              style={styles.profilePictureStyle}
              source={{ uri: profileImageLink }}
            />
          </View>
          <View style={styles.userNameAndPostTimeStyle}>
            <Text style={styles.userNameTextStyle}>{item.petName}</Text>
            <Text style={styles.timeTextStyle}>{postTypeTextString}</Text>
          </View>
          <View style={styles.deleteViewStyle}>
            {markPostString ? (
              <View style={styles.markPostString}>
                <Text style={styles.markPostTextStyle}>{markPostString}</Text>
              </View>
            ) : (
              <View></View>
            )}

            <View style={styles.deleteButtonStyle}>
              <TouchableNativeFeedback
                onPress={() => {
                  handleDeleteButton(item.postId);
                }}
              >
                <View>
                  <Ionicons name={"trash-outline"} size={35} />
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
        <View style={styles.container2Style}>
          <Image
            style={styles.postImageStyle}
            source={{ uri: item.postImageLink }}
          />
        </View>
        <View style={styles.container3Style}>
          <View style={styles.likeIconViewStyle}>
            <TouchableNativeFeedback
              onPress={() => {
                handleLikeButton(item);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name={"heart-outline"}
                  size={35}
                  color={isLiked ? "red" : "black"}
                />
                <Text style={{ fontSize: 20, marginBottom: 5 }}>
                  {likes.length > 0 && likes.length}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.commentIconViewStyle}>
            <TouchableNativeFeedback
              onPress={() => {
                handleComment(item);
              }}
            >
              <View>
                <Ionicons name={"chatbubble-outline"} size={30} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SinglePostCard;

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
  mainContainerStyle: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postCardStyle: {
    backgroundColor: "white",
    marginVertical: 10,
    height: 500,
    // height: "50%",
    width: Dimensions.get("window").width - 20,
    borderWidth: 5,
    borderRadius: 25,
    borderColor: "#3399ff",
  },
  container1Style: {
    height: "15%",
    borderBottomWidth: 2,
    borderColor: "#3399ff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profilePictureViewStyle: {
    marginHorizontal: 7,
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
  },
  profilePictureStyle: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
  },
  userNameAndPostTimeStyle: {
    marginHorizontal: 7,
  },
  deleteViewStyle: {
    marginHorizontal: 7,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  markPostString: {
    borderRadius: 25,
    backgroundColor: "#DCDCDC",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  markPostTextStyle: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  userNameTextStyle: {
    fontSize: 20,
    justifyContent: "flex-start",
    marginVertical: 2,
  },
  timeTextStyle: {
    fontSize: 15,
    marginVertical: 2,
    justifyContent: "flex-start",
  },
  container2Style: {
    // flex: 1,
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    // position: "relative",
    // aspectRatio: 1,
  },
  postImageStyle: {
    width: "100%",
    height: "100%",
    // aspectRatio: 1,

    // height: "100%",
    // width: "100%",
  },
  container3Style: {
    borderTopWidth: 2,
    borderColor: "#3399ff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  likeIconViewStyle: {
    marginHorizontal: 50,
  },
  commentIconViewStyle: {
    marginHorizontal: 50,
  },
});
