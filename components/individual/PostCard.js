import React, { useState, useContext, useEffect, Component } from "react";
// import ModalDropdown from "react-native-modal-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import { localhostBaseURL } from "../common/baseURLs";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Modal,
  View,
  Text,
  TextInput,
  Dimensions,
  Alert,
  Button as ReactButton,
  ShadowPropTypesIOS,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import AuthContext from "../hooks/useAuth";
import { Card, Button, Title, Paragraph } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Avatar, TabBar, Tab, Spinner } from "@ui-kitten/components";

import getUserTypeDocString from "../hooks/getUserTypeDocString";
import { db } from "../../firebase";
import Like from "../../Helper/homeHelper/Like";
const { width } = Dimensions.get("window");

export default PostCard = ({ item }) => {
  const { userDataContext } = useContext(AuthContext);
  //   console.log(item.item);
  //   if ("interestedUsers" in item.item) {
  //     console.log(item.item.interestedUsers);
  //   } else {
  //     // console.log("not found");
  //   }
  const navigation = useNavigation();
  const [canSendRequest, setCanSendRequest] = useState(
    item.item.interestedUsers
      ? item.item.interestedUsers.includes(userDataContext.email)
        ? false
        : true
      : true
  );
  const [isItAvailable, setIsItAvailable] = useState();
  const [markPostString, setMarkPostString] = useState("");
  const [displayMoreInfo, setDisplayMoreInfo] = useState(false);
  const [infoText, setInfoText] = useState("show more");
  const sendRequest = async (
    postUserEmail,
    postUserType,
    postId,
    profileImageLink,
    postType
  ) => {
    try {
      const res = await localhostBaseURL.post("/home/setNotification", {
        name: userDataContext.name,
        notificationType: postType,
        postId,
        profileImageLink,
        emailId: userDataContext.email,
        userType: userDataContext.userType,
        postUserType,
        postUserEmail,
        sendTime: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const showAlert = (
    postUserEmail,
    postUserType,
    postId,
    profileImageLink,
    postType
  ) =>
    Alert.alert("Send Request", "Do you want to send Request ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          setCanSendRequest(false);
          sendRequest(
            postUserEmail,
            postUserType,
            postId,
            profileImageLink,
            postType
          );
        },
      },
    ]);

  const handleSendRequestButton = (
    postUserEmail,
    postUserType,
    postId,
    profileImageLink,
    postType
  ) => {
    showAlert(postUserEmail, postUserType, postId, profileImageLink, postType);
  };

  const postInformation = (postType) => {
    if (postType == "casual") return "Casual Post";
    else if (postType == "petSellPost") return "Pet Sell Post";
    else if (postType == "reshelter") return "Reshelter Post";
    else if (postType == "breedPost") return "Breed Post";
    else return "Adoption Post";
  };
  const checkIsItAlreadyDone = (item) => {
    if (
      ("userWhoBought" in item && item.userWhoBought) ||
      ("userWhoAdopted" in item && item.userWhoAdopted) ||
      ("organizationWhoResheltered" in item &&
        item.organizationWhoResheltered) ||
      ("userWhosePetBreededWith" in item && item.userWhosePetBreededWith)
    ) {
      //   console.log(item);
      return true;
    }
    // console.log(false);
    return false;
  };

  const handleItemClicked = () => {
    navigation.navigate("OtherUsersProfile", {
      clickedUsersEmail: item.item.postUserEmail,
    });
  };

  const checkIsItAvailable = (item) => {
    if (
      item.userWhoBought ||
      item.userWhoAdopted ||
      item.organizationWhoResheltered ||
      item.userWhosePetBreededWith
    ) {
      if (item.userWhoBought) setMarkPostString("Sold");
      else if (item.userWhoAdopted) setMarkPostString("Adopted");
      else if (item.organizationWhoResheltered) setMarkPostString("Impounded");
      else setMarkPostString("");
      //   console.log(item);
      return false;
    }
    // console.log(false);
    return true;
  };
  const getLatestDataAboutPost = () => {
    try {
      db.collection("Users")
        .doc(getUserTypeDocString(item.item.postUserType))
        .collection("accounts")
        .doc(item.item.postUserEmail)
        .collection("posts")
        .doc(item.item.id)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            if (checkIsItAvailable(snapshot.data())) {
              setIsItAvailable(true);
            } else {
              setIsItAvailable(false);
            }
          }
        });
    } catch (error) {
      console.log("getLatestDataAboutPost: " + error.message);
    }
  };

  useEffect(() => {
    getLatestDataAboutPost();
  }, [item]);
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
  const handleMoreInfoButton = () => {
    if (displayMoreInfo) {
      setInfoText("show more");
      setDisplayMoreInfo(false);
    } else {
      setInfoText("show less");
      setDisplayMoreInfo(true);
    }
  };

  const shouldDisplayInfoText = (item) => {
    if (item.petType || item.price || item.petName || item.dateOfBirth) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.postContent}>
          <View>
            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Avatar
                source={{
                  uri: item.item.profileImageLink
                    ? item.item.profileImageLink
                    : "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
                }}
                size="tiny"
                style={styles.profilePic}
              />
              <View style={{ marginLeft: 8 }}>
                <TouchableOpacity onPress={handleItemClicked}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {item.item.postUserName}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text>{postInformation(item.item.postType)}</Text>
          </View>
          <View style={styles.requestButton}>
            {item.item.postType === "casual" ||
            item.item.postType === "productShowcasePost" ||
            item.item.postType === "eventPost" ? (
              <View></View>
            ) : isItAvailable ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableNativeFeedback
                  disabled={!canSendRequest}
                  onPress={() => {
                    // setCanSendRequest(false);
                    handleSendRequestButton(
                      item.item.postUserEmail,
                      item.item.postUserType,
                      item.item.id,
                      item.item.profileImageLink,
                      item.item.postType
                    );
                  }}
                >
                  <View
                    style={
                      canSendRequest
                        ? { justifyContent: "center", alignItems: "center" }
                        : {
                            opacity: 0.1,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                  >
                    <Ionicons
                      name={
                        canSendRequest
                          ? "send-outline"
                          : "checkmark-circle-outline"
                      }
                      size={25}
                    />
                  </View>
                </TouchableNativeFeedback>
                <Text>Send request</Text>
              </View>
            ) : (
              <View style={styles.markPostString}>
                <Text style={styles.markPostTextStyle}>{markPostString}</Text>
              </View>
            )}
          </View>
        </View>
      </Card.Content>
      <Card.Cover
        source={{
          uri: item.item.image,
        }}
        resizeMode="stretch"
        style={{
          height: 300,
          borderTopWidth: 2,
          borderBottomWidth: 2,
          borderColor: "#8CC0DE",
        }}
      />
      {/* <Card.Content>
        
      </Card.Content> */}
      <Card.Actions>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Like
                name="heart"
                postId={item.item.id}
                postUserEmail={item.item.postUserEmail}
                postUserType={item.item.postUserType}
                postType={item.item.postType}
                profileImageLink={userDataContext.profileImageLink}
                postUserName={item.item.name}
                userWhoLikedIds={item.item.userWhoLikedIds}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Comment
                postId={item.item.id}
                postUserEmail={item.item.postUserEmail}
                postUserType={item.item.postUserType}
                postComments={item.item.postComments}
              />
            </View>
            <View
              style={{
                flex: 2.5,
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: 10,
              }}
            >
              <TouchableNativeFeedback
                onPress={handleMoreInfoButton}
                disabled={!shouldDisplayInfoText(item.item)}
              >
                <Text
                  style={{ color: "blue", textDecorationLine: "underline" }}
                >
                  {shouldDisplayInfoText(item.item) ? infoText : ""}
                </Text>
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={{ paddingLeft: 10 }}>
            <Paragraph>
              <Text style={{ fontSize: 16 }}>{item.item.postDescription}</Text>
            </Paragraph>
            {displayMoreInfo && (
              <View>
                <View style={{ flexDirection: "row" }}>
                  {item.item.petName && (
                    <Paragraph style={{ fontSize: 16, marginRight: "5%" }}>
                      Pet name: {item.item.petName}
                    </Paragraph>
                  )}
                  {item.item.price && (
                    <Paragraph style={{ fontSize: 16, marginRight: "5%" }}>
                      Price: {item.item.price}
                    </Paragraph>
                  )}
                </View>
                <View style={{ flexDirection: "row" }}>
                  {item.item.petType && (
                    <Paragraph style={{ fontSize: 16, marginRight: "5%" }}>
                      Pet: {item.item.petType}
                    </Paragraph>
                  )}
                  {item.item.breed && (
                    <Paragraph style={{ fontSize: 16 }}>
                      Breed: {item.item.breed}
                    </Paragraph>
                  )}
                </View>
                {item.item.dateOfBirth && (
                  <Paragraph style={{ fontSize: 16 }}>
                    Date of birth: {item.item.dateOfBirth}
                  </Paragraph>
                )}
              </View>
            )}
          </View>
        </View>
      </Card.Actions>
    </Card>
  );
};
const Comment = (props) => {
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const addComment = () => {
    return navigation.navigate("Comment", props);
  };
  return (
    <View>
      <Button icon="chat" color="black" title="Show Modal" onPress={addComment}>
        {props.postComments.length >= 0 && (
          <Text>{props.postComments.length}</Text>
        )}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    margin: 10,
    backgroundColor: "white",
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  },
  dropbox: {
    paddingHorizontal: "35%",
  },
  postContent: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
  },
  requestButton: {
    // width:30,
    // height:30,
    // borderRadius:30/2,
    // borderWidth:2,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
