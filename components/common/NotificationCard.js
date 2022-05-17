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

const NotificationCard = ({ item, updateWholeArray, index }) => {
  const [requestStatus, setRequestStatus] = useState(
    item.requestStatus && item.requestStatus
  );
  const { userDataContext, setUserDataContext } = useContext(AuthContext);

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

  const sendRequestAccpetedToServer = async (item) => {
    const reqStr = getRequestAcceptedString(item.notificationType);
    let data = {};
    data[reqStr] = item.userId;
    console.log(data);
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
      console.log(error.message);
    }
  };
  const sendOtherUserNotification = async (item, status) => {
    try {
      await db
        .collection("Users")
        .doc(getUserTypeDocString(item.userType))
        .collection("accounts")
        .doc(item.userId)
        .update({
          notification: Firestore.FieldValue.arrayUnion({
            name: userDataContext.name,
            userId: userDataContext.email,
            profileImageLink: userDataContext.profileImageLink,
            notificationType: `${item.notificationType}${status}`,
            requestStatus: status,
            postId: item.postId,
          }),
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const acceptButtonHandle = async (item) => {
    Alert.alert(`${item.name}'s request accepted`);
    setRequestStatus("accepted");
    await sendRequestAccpetedToServer(item);
    await updateWholeArray({ ...item, requestStatus: "accepted" }, index);
    await sendOtherUserNotification(item, "accepted");
  };

  const rejectButtonHandle = async (item) => {
    Alert.alert(`${item.name}'s request rejected`);
    setRequestStatus("rejected");
    await updateWholeArray({ ...item, requestStatus: "rejected" }, index);
    await sendOtherUserNotification(item, "rejected");
  };

  const getDescriptionString = (notificationType) => {
    switch (notificationType) {
      case "like":
        return "has liked your post";
        break;
      case "comment":
        return "has commented on your phone";
        break;
      case "petBuyRequest":
        return "want to buy your pet";
        break;
      case "reshelterRequest":
        return "want to reshelter your pet";
        break;
      case "breedRequest":
        return "sent breed request for your pet";
        break;
      case "adoptionRequest":
        return "want adopt your pet";
        break;
      case "petBuyRequestaccepted":
        return "has accepted your pet buy request";
        break;
      case "reshelterRequestaccepted":
        return "has accepted your pet reshelter request";
        break;
      case "breedRequestaccepted":
        return "has accepted your pet breed request";
        break;
      case "adoptionRequestaccepted":
        return "has accepted your pet adoption request";
        break;
      case "petBuyRequestrejected":
        return "has rejected your pet buy request";
        break;
      case "reshelterRequestrejected":
        return "has rejected your pet reshelter request";
        break;
      case "breedRequestrejected":
        return "has rejected your pet breed request";
        break;
      case "adoptionRequestrejected":
        return "has rejected your pet adoption request";
        break;
    }
  };

  const isItRequest = (notificationType) => {
    if (
      notificationType === "petBuyRequest" ||
      notificationType === "reshelterRequest" ||
      notificationType === "breedRequest"||
      notificationType === "adoptionRequest"
    )
      return true;
    else return false;
  };
  return (
    <View style={styles.item}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={item.profileImageLink && { uri: item.profileImageLink }}
        ></Image>
      </View>
      <View style={styles.nameDescriptionStyle}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{getDescriptionString(item.notificationType)}</Text>
      </View>
      {isItRequest(item.notificationType) && (
        <View style={{ flexDirection: "row" }}>
          <View>
            <TouchableNativeFeedback
              disabled={
                requestStatus === "accepted" || requestStatus === "rejected"
                  ? true
                  : false
              }
              onPress={() => {
                acceptButtonHandle(item);
              }}
            >
              <View
                style={
                  requestStatus === "accepted" || requestStatus === "rejected"
                    ? { opacity: 0.1 }
                    : {}
                }
              >
                <Ionicons name={"checkmark-circle-outline"} size={40} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <View>
            <TouchableNativeFeedback
              disabled={
                requestStatus === "accepted" || requestStatus === "rejected"
                  ? true
                  : false
              }
              onPress={() => {
                rejectButtonHandle(item);
              }}
            >
              <View
                style={
                  requestStatus === "accepted" || requestStatus === "rejected"
                    ? { opacity: 0.1 }
                    : {}
                }
              >
                <Ionicons name={"close-circle-outline"} size={40} />
              </View>
            </TouchableNativeFeedback>
          </View>
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
    paddingVertical: 13,
    margin: 10,
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: 5,
    // elevation: 3,
    // backgroundColor:"red"
  },
  nameDescriptionStyle: {
    flex: 0.8,
    flexDirection: "column",
    marginLeft: "2%",
    // backgroundColor:"white"
  },
  avatar: {
    borderRadius: 60 / 2,
    height: 60,
    width: 60,
  },
  name: {
    fontWeight: "600",
    fontSize: 20,
  },
  avatarContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 60 / 2,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
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
