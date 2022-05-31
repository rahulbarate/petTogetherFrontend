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

const SinglePostCard = ({
  item,
  profileImageLink,
  isItOtherUser,
  userData,
}) => {
  // const navigation = useNavigation();
  // console.log(userData);
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [whoseListIsPassed, setWhoseListIsPassed] = useState("userWhoLikedIds");
  const [userWhoLikedIdsArray, setUserWhoLikedIdsArray] = useState(
    item.userWhoLikedIds ? item.userWhoLikedIds : []
  );
  const [markPostString, setMarkPostString] = useState(
    item.userWhoBought
      ? "Sold"
      : item.userWhoAdopted
      ? "Adopted"
      : item.organizationWhoResheltered
      ? "Impounded"
      : item.userWhosePetBreededWith
      ?"Bred"
      :""
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
      : item.postType === "breedPost" && !item.userWhosePetBreededWith
      ? "Up for  breeding"
      : ""
  );
  const [infoText, setInfoText] = useState("show more");
  const [displayMoreInfo, setDisplayMoreInfo] = useState(false);
  // const { userDataContext } = useContext(AuthContext);
  const [likes, setLikes] = useState(
    item.userWhoLikedIds ? item.userWhoLikedIds : []
  );
  const shouldDisplayInfoText = (item) => {
    if (item.petType || item.price || item.petName || item.dateOfBirth) {
      return true;
    } else {
      return false;
    }
  };
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
      navigation.navigate("UsersList", {
        whoseListIsPassed: "userWhoLikedIds",
        usersList: userWhoLikedIdsArray,
      });
      // setModalVisibility(true);
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
  const handleMoreInfoButton = () => {
    if (displayMoreInfo) {
      setInfoText("show more");
      setDisplayMoreInfo(false);
    } else {
      setInfoText("show less");
      setDisplayMoreInfo(true);
    }
  };

  return (
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
            {/* <Text style={styles.userNameTextStyle}>{item.petName}</Text> */}
            <Text style={styles.userNameTextStyle}>{userData.name}</Text>
            {/* <Text style={styles.timeTextStyle}>pet name: {item.petName}</Text> */}
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
            {!isItOtherUser && (
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
            )}
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
                  {likes.length >= 0 && likes.length}
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={"chatbubble-outline"} size={30} />
                <Text style={{ fontSize: 20, marginBottom: 5 }}>
                  {item.comments ? item.comments.length : 0}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.showMoreTextViewStyle}>
            <TouchableNativeFeedback
              onPress={handleMoreInfoButton}
              disabled={!shouldDisplayInfoText(item)}
            >
              <Text style={{ color: "blue", textDecorationLine: "underline" }}>
                {shouldDisplayInfoText(item) ? infoText : ""}
              </Text>
            </TouchableNativeFeedback>
          </View>
        </View>
        {/* {item.postType !== "casual" &&()} */}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.descriptionDivider}></View>
        </View>
        <Text style={{ fontSize: 16, paddingLeft: 20, paddingTop: 10 }}>
          {item.postDescription}
        </Text>

        {/* {item.postType !== "casual" && (
          
        )} */}
        {displayMoreInfo && (
          <View style={styles.postDetailsStyle}>
            {item.petName && (
              <Text style={{ fontSize: 16, marginRight: "8%" }}>
                Pet name: {item.petName}
              </Text>
            )}
            <View style={{ flexDirection: "row" }}>
              {item.price && (
                <Text style={{ fontSize: 16, marginRight: "8%" }}>
                  Price: {item.price}
                </Text>
              )}
              {item.petType && (
                <Text style={{ fontSize: 16, marginRight: "8%" }}>
                  Pet: {item.petType}
                </Text>
              )}
              {item.breed && (
                <Text style={{ fontSize: 16 }}>Breed: {item.breed}</Text>
              )}
            </View>
            {item.dateOfBirth && (
              <Text style={{ fontSize: 16 }}>
                Date of birth: {item.dateOfBirth}
              </Text>
            )}
          </View>
        )}
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
  mainContainerStyle: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container1Style: {
    flex: 0.2,
    borderBottomWidth: 2,
    borderColor: "#8CC0DE",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container2Style: {
    flex: 0.5,
    // height: "75%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    // position: "relative",
    // aspectRatio: 1,
  },
  descriptionDivider: {
    borderTopWidth: 2,
    borderColor: "#8CC0DE",
    width: Dimensions.get("window").width - 200,
    marginTop:10,
    marginBottom:5,
    // alignItems: "center",
  },
  postDetailsStyle: {
    flex: 0.1,

    // paddingBottom: 10,
    paddingLeft: 20,
    // justifyContent: "flex-start",
  },
  container3Style: {
    flex: 0.1,
    borderTopWidth: 2,
    borderColor: "#8CC0DE",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: "flex-end",
    // marginBottom: 10
  },
  postCardStyle: {
    backgroundColor: "white",
    marginVertical: 5,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    // minHeight: 350,
    // maxHeight: 500,
    // height: "50%",
    width: Dimensions.get("window").width - 20,
    // borderWidth: 3,
    borderRadius: 5,
    borderColor: "#3399ff",
    paddingBottom: 10,
    // justifyContent: "center",
    // alignItems: "center",
  },

  profilePictureViewStyle: {
    marginHorizontal: 7,
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
  },
  profilePictureStyle: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
  },
  userNameAndPostTimeStyle: {
    marginHorizontal: 7,
    paddingLeft: 10,
  },
  deleteViewStyle: {
    marginHorizontal: 7,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  markPostString: {
    borderRadius: 20,
    backgroundColor: "#DCDCDC",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  markPostTextStyle: {
    fontSize: 15,
    marginHorizontal: 10,
  },
  userNameTextStyle: {
    paddingTop: 5,
    fontSize: 18,
    justifyContent: "flex-start",
    marginVertical: 2,
  },
  timeTextStyle: {
    fontSize: 15,
    marginVertical: 2,
    justifyContent: "flex-start",
  },
  postImageStyle: {
    flex: 1,
    width: "100%",
    height: 300,
    // aspectRatio: 1,
    resizeMode: "cover",

    // height: "100%",
    // width: "100%",
  },
  likeIconViewStyle: {
    flex: 1,
    // marginBottom: 10
  },
  commentIconViewStyle: {
    flex: 1,
    // marginBottom: 10
  },
  showMoreTextViewStyle: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 10,
  },
  // container4Style: {
  //   // borderTopWidth: 2,
  //   // borderColor: "#3399ff",
  //   flexDirection: "row",
  //   // justifyContent: "center",
  //   alignItems: "center",
  // },
});

// modalVisibility ? (
//   <View style={styles.container1Style}>
//     <Modal
//       isVisible={modalVisibility}
//       style={styles.modalStyle}
//       onSwipeComplete={() => setModalVisibility(false)}
//       onBackButtonPress={() => setModalVisibility(false)}
//       swipeDirection="down"
//     >
//       <FollowersFollowingList
//         whoseListIsPassed={whoseListIsPassed}
//         followersOrFollowingsArray={followersOrFollowingsArray}
//       />
//     </Modal>
//   </View>
// ) :
