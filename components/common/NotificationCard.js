import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import { db, Firestore } from "../../firebase";
import AuthContext from "../hooks/useAuth";
import sendRequestToServer from "../hooks/sendRequestToServer";
import Ionicons from "react-native-vector-icons/Ionicons";
import getUserTypeDocString from "../hooks/getUserTypeDocString";
import moment from "moment";

const NotificationCard = ({ item, updateWholeArrayForPost, index }) => {
  const [requestStatus, setRequestStatus] = useState(
    item.requestStatus && item.requestStatus
  );
  const formats = {
    sameDay: "h:mm a",
    lastDay: "[Yesterday]",
    sameElse: "DD/MM/YYYY",
  };
  // const [
  //   otherUserFollowRequestsSentArray,
  //   setOtherUserFollowRequestsSentArray,
  // ] = useState([]);
  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  //methods

  const getOtherUserFollowRequestSentArray = async (item) => {
    // console.log(item);
    try {
      const result = await db
        .collection("Users")
        .doc(getUserTypeDocString(item.userType))
        .collection("accounts")
        .doc(item.userId)
        .get();
      if (result.data().followRequestsSentArray) {
        // console.log(result.data().followRequestsSentArray);
        return result.data().followRequestsSentArray;
        // setOtherUserFollowRequestsSentArray(result);
      } else {
        return [];
      }
    } catch (error) {
      console.log("getotheruserlog: " + error.message);
    }
  };

  const getRequestAcceptedString = (notificationType) => {
    switch (notificationType) {
      case "petBuyRequest":
        return "userWhoBought";
        break;
      case "reshelterRequest":
        return "organizationWhoResheltered";
        break;
      case "breedRequest":
        return "userWhosePetBreededWith";
        break;
      case "adoptionRequest":
        return "userWhoAdopted";
        break;
    }
  };

  const sendPostRequestAccpetedToServer = async (item) => {
    const reqStr = getRequestAcceptedString(item.notificationType);
    let data = {};
    data[reqStr] = item.userId;
    // console.log(data);
    try {
      await db
        .collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .collection("posts")
        .doc(item.postId)
        .update({ ...data });
    } catch (error) {
      console.log("sendpostreqacceptedlog: " + error.message);
    }
  };

  const sendOtherUserNotification = async (item, status, isItFollowRequest) => {
    const dataToBeUpdated = {
      name: userDataContext.name,
      userId: userDataContext.email,
      profileImageLink: isItFollowRequest
        ? userDataContext.profileImageLink
        : item.profileImageLink,
      notificationType: `${item.notificationType}${status}`,
      requestStatus: status,
      sendTime: new Date(),
      postId: item.postId ? item.postId : "",
    };
    try {
      await db
        .collection("Users")
        .doc(getUserTypeDocString(item.userType))
        .collection("accounts")
        .doc(item.userId)
        .update({
          notification: Firestore.FieldValue.arrayUnion(dataToBeUpdated),
        });
    } catch (error) {
      console.log("sendOtherUserNotificationlog: " + error.message);
    }
  };

  const acceptTheFollowRequest = async (item, index) => {
    // console.log(item);
    try {
      //add current user in other user's following array
      await db
        .collection("Users")
        .doc(getUserTypeDocString(item.userType))
        .collection("accounts")
        .doc(item.userId)
        .update({
          followingArray: Firestore.FieldValue.arrayUnion(
            userDataContext.email
          ),
        });

      //add other user in current user's followers array
      await db
        .collection("Users")
        .doc(getUserTypeDocString(userDataContext.userType))
        .collection("accounts")
        .doc(userDataContext.email)
        .update({
          followersArray: Firestore.FieldValue.arrayUnion(item.userId),
        });

      //update array of followRequestSent in other user's profile
      await updateFollowRequestsSentArray(item, index);
    } catch (error) {
      console.log("accept req log :" + error.message);
    }
  };

  const updateFollowRequestsSentArray = async (item, index) => {
    try {
      const result = await db
        .collection("Users")
        .doc(getUserTypeDocString(item.userType))
        .collection("accounts")
        .doc(item.userId)
        .get();
      if (result.data().followRequestsSentArray) {
        const oldFollowRequestsSentArray =
          result.data().followRequestsSentArray;
        const newFollowRequestsSentArray = [
          ...oldFollowRequestsSentArray.slice(0, index),
          ...oldFollowRequestsSentArray.slice(
            index + 1,
            oldFollowRequestsSentArray.length
          ),
        ];

        await db
          .collection("Users")
          .doc(getUserTypeDocString(item.userType))
          .collection("accounts")
          .doc(item.userId)
          .update({ followRequestsSentArray: newFollowRequestsSentArray });
        // console.log(result.data().followRequestsSentArray);
        // return result.data().followRequestsSentArray;
        // setOtherUserFollowRequestsSentArray(result);
      }
      // else {
      //   return [];
      // }
    } catch (error) {
      console.log("updateFollowRequestsSentArray: " + error.message);
    }
  };

  const acceptButtonHandle = async (item, index) => {
    Alert.alert(`${item.name}'s request accepted`);
    setRequestStatus("accepted");
    if (item.notificationType === "followRequest") {
      await acceptTheFollowRequest(item, index);
      await updateWholeArrayForPost(
        {
          ...item,
          requestStatus: "accepted",
        },
        index
      );
      await sendOtherUserNotification(item, "accepted", true);
    } else {
      await sendPostRequestAccpetedToServer(item);
      await updateWholeArrayForPost(
        {
          ...item,
          requestStatus: "accepted",
        },
        index
      );
      await sendOtherUserNotification(item, "accepted", false);
    }
    // await sendOtherUserNotification(item, "accepted",);
  };

  const rejectButtonHandle = async (item, index) => {
    Alert.alert(`${item.name}'s request rejected`);
    setRequestStatus("rejected");
    await updateWholeArrayForPost(
      { ...item, requestStatus: "rejected" },
      index
    );
    await sendOtherUserNotification(item, "rejected", true);
    if (item.notificationType === "followRequest") {
      await updateFollowRequestsSentArray(item, index);
    }
  };

  const getDescriptionString = (notificationType, requestStatus, name) => {
    if (notificationType === "like") return `${name} has liked your post`;
    if (notificationType === "comment")
      return `${name} has commented on your post`;

    //pet buy request string
    if (notificationType === "petBuyRequest" && requestStatus === "waiting")
      return `${name} wants to buy your pet`;
    if (notificationType === "petBuyRequest" && requestStatus === "accepted")
      return `accepted ${name}'s pet buy request`;
    if (notificationType === "petBuyRequest" && requestStatus === "rejected")
      return `rejected ${name}'s pet buy request`;

    //pet reshelter string
    if (notificationType === "reshelterRequest" && requestStatus === "waiting")
      return `${name} wants to impound your pet`;
    if (notificationType === "reshelterRequest" && requestStatus === "accepted")
      return `accepted ${name}'s impounding request`;
    if (notificationType === "reshelterRequest" && requestStatus === "rejected")
      return `rejected ${name}'s impounding request`;

    //pet breed request
    if (notificationType === "breedRequest" && requestStatus === "waiting")
      return `${name} sent breed request for your pet`;
    if (notificationType === "breedRequest" && requestStatus === "accepted")
      return `accepted ${name}'s breed request for your pet`;
    if (notificationType === "breedRequest" && requestStatus === "rejected")
      return `rejected ${name}'s breed request for your pet`;

    //pet adoption reqeust
    if (notificationType === "adoptionRequest" && requestStatus === "waiting")
      return `${name} wants to adopt your pet`;
    if (notificationType === "adoptionRequest" && requestStatus === "accepted")
      return `accepted ${name}'s pet adoption request`;
    if (notificationType === "adoptionRequest" && requestStatus === "rejected")
      return `rejected ${name}'s pet adoption request`;

    //follow request
    if (notificationType === "followRequest" && requestStatus === "waiting")
      return `${name} sent you a follow request`;
    if (notificationType === "followRequest" && requestStatus === "accepted")
      return `${name} started following you`;
    if (notificationType === "followRequest" && requestStatus === "rejected")
      return `rejected ${name}'s follow request`;

    switch (notificationType) {
      case "followRequestaccepted":
        return `${name} has accepted your follow request`;
        break;
      case "petBuyRequestaccepted":
        return `${name} has accepted your pet buy request`;
        break;
      case "reshelterRequestaccepted":
        return `${name} has accepted your pet impounding request`;
        break;
      case "breedRequestaccepted":
        return `${name} has accepted your pet breed request`;
        break;
      case "adoptionRequestaccepted":
        return `${name} has accepted your pet adoption request`;
        break;
      case "followRequestrejected":
        return `${name} has rejected your follow request`;
        break;
      case "petBuyRequestrejected":
        return `${name} has rejected your pet buy request`;
        break;
      case "reshelterRequestrejected":
        return `${name} has rejected your pet impounding request`;
        break;
      case "breedRequestrejected":
        return `${name} has rejected your pet breed request`;
        break;
      case "adoptionRequestrejected":
        return `${name} has rejected your pet adoption request`;
        break;
    }
  };

  const isItRequest = (notificationType) => {
    if (
      notificationType === "petBuyRequest" ||
      notificationType === "reshelterRequest" ||
      notificationType === "breedRequest" ||
      notificationType === "adoptionRequest" ||
      notificationType === "followRequest"
    )
      return true;
    else return false;
  };

  return (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={item.profileImageLink && { uri: item.profileImageLink }}
          ></Image>
        </View>
      </View>
      <View style={styles.nameDescriptionStyle}>
        {/* <Text style={styles.name}>{item.name}</Text> */}
        <Text style={{ fontSize: 16 }}>
          {getDescriptionString(
            item.notificationType,
            item.requestStatus ? item.requestStatus : "",
            item.name
          )}
        </Text>
        <Text>
          {/* {"at " + moment(item.sendTime.toDate()).calendar(null, formats)} */}
        </Text>
      </View>
      {isItRequest(item.notificationType) ? (
        <View style={{ flexDirection: "row" }}>
          {item.requestStatus === "accepted" ||
          item.requestStatus == "rejected" ? (
            <View></View>
          ) : (
            <View>
              <TouchableNativeFeedback
                disabled={
                  item.requestStatus === "accepted" ||
                  item.requestStatus === "rejected"
                    ? true
                    : false
                }
                onPress={() => {
                  acceptButtonHandle(item, index);
                }}
              >
                <View
                  style={
                    item.requestStatus === "accepted" ||
                    item.requestStatus === "rejected"
                      ? { opacity: 0.1 }
                      : {}
                  }
                >
                  <Ionicons name={"checkmark-circle-outline"} size={40} />
                </View>
              </TouchableNativeFeedback>
            </View>
          )}

          {item.requestStatus === "accepted" ||
          item.requestStatus == "rejected" ? (
            <View></View>
          ) : (
            <View>
              <TouchableNativeFeedback
                disabled={
                  item.requestStatus === "accepted" ||
                  item.requestStatus === "rejected"
                    ? true
                    : false
                }
                onPress={() => {
                  rejectButtonHandle(item, index);
                }}
              >
                <View
                  style={
                    item.requestStatus === "accepted" ||
                    item.requestStatus === "rejected"
                      ? { opacity: 0.1 }
                      : {}
                  }
                >
                  <Ionicons name={"close-circle-outline"} size={40} />
                </View>
              </TouchableNativeFeedback>
            </View>
          )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={item.postImageLink && { uri: item.postImageLink }}
            ></Image>
          </View> */}
        </View>
      )}
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#CCC",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingLeft: 5,
    elevation: 3,
    backgroundColor: "white",
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderColor: "#8CC0DE",
  },
  nameDescriptionStyle: {
    flex: 4,
    flexDirection: "column",
    marginLeft: "2%",
    // backgroundColor:"white"
  },
  avatar: {
    flex: 1,
    borderRadius: 50 / 2,
    height: 50,
    width: 50,
  },
  avatarContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 50 / 2,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontWeight: "600",
    fontSize: 20,
  },
  area: {
    backgroundColor: "#CCCCCC",
    borderRadius: 20,
    borderWidth: 2,
    padding: 2,
    margin: 2,
    //   justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // paddingTop:ConstantSourceNode.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});
