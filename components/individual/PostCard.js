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
          <View
            style={
              canSendRequest
                ? styles.requestButton
                : { opacity: 0.1, ...styles.requestButton }
            }
          >
            {(
              checkIsItAlreadyDone(item.item) === true ? (
                <View></View>
              ) : (
                item.item.postType !== "casual"
              )
            ) ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text>Send request</Text>
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
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Ionicons name={"add-circle-outline"} size={30} />
                  </View>
                </TouchableNativeFeedback>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </View>
      </Card.Content>
      <Card.Cover
        source={{
          uri: item.item.image,
        }}
      />
      <Card.Content>
        <Paragraph>{item.item.postDescription}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Like
          name="heart"
          postId={item.item.id}
          postUserEmail={item.item.postUserEmail}
          postUserType={item.item.postUserType}
          postType={item.item.postType}
          profileImageLink={item.item.profileImageLink}
          postUserName={item.item.name}
          userWhoLikedIds={item.item.userWhoLikedIds}
        />
        <Comment
          postId={item.item.id}
          postUserEmail={item.item.postUserEmail}
          postUserType={item.item.postUserType}
          postComments={item.item.postComments}
        />
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
      <Button
        icon="chat"
        color="black"
        title="Show Modal"
        onPress={addComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    margin: 10,
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
});
