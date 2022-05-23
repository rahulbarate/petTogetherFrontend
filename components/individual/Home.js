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
import PostCard from "./PostCard";
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [response, setResponse] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(true);

  const isFocused = useIsFocused();

  const getDataFromServer = async () => {
    if (flag) {
      setLoading(true);
      setFlag(false);
    }

    try {
      const res = await localhostBaseURL.post("/home/fetchPostDetails", {
        emailId: userDataContext.email,
        userType: userDataContext.userType,
      });
      setResponse(res);

      let extractedData = [];
      for (each of res.data) {
        for (eachInEach of each) {
          const retArray = {
            id: eachInEach.postId,
            postUserName: eachInEach.name,
            profileImageLink: eachInEach.profileImageLink,
            image: eachInEach.postData.postImageLink,
            price: eachInEach.postData.price && eachInEach.postData.price,
            petType: eachInEach.postData.petType && eachInEach.postData.petType,
            breed: eachInEach.postData.breed && eachInEach.postData.breed,
            dateOfBirth:
              eachInEach.postData.dateOfBirth &&
              eachInEach.postData.dateOfBirth,
            postType: eachInEach.postData.postType,
            postUserEmail: eachInEach.postData.userEmail,
            postUserType: eachInEach.postData.userType,
            userWhoLikedIds: eachInEach.postData.userWhoLikedIds
              ? eachInEach.postData.userWhoLikedIds
              : [],
            postDescription: eachInEach.postData.postDescription,
            postComments: eachInEach.postData.comments
              ? eachInEach.postData.comments
              : [],
            interestedUsers: eachInEach.postData.interestedUsers
              ? eachInEach.postData.interestedUsers
              : [],
            userWhoBought: eachInEach.postData.userWhoBought
              ? eachInEach.postData.userWhoBought
              : null,
            userWhoAdopted: eachInEach.postData.userWhoAdopted
              ? eachInEach.postData.userWhoAdopted
              : null,
            organizationWhoResheltered: eachInEach.postData
              .organizationWhoResheltered
              ? eachInEach.postData.organizationWhoResheltered
              : null,
            userWhosePetBreededWith: eachInEach.postData.userWhosePetBreededWith
              ? eachInEach.postData.userWhosePetBreededWith
              : null,

            // userWhoBought: "userWhoBought" in eachInEach.postData?eachInEach.postData.userWhoBought:""
          };
          extractedData.push(retArray);
        }
      }
      setData(extractedData);
    } catch (error) {
      console.log(error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDataFromServer();
  }, [isFocused]);

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
  const postInformation = (postType) => {
    if (postType == "casual") return "Casual Post";
    else if (postType == "petSellPost") return "Pet Sell Post";
    else if (postType == "reshelter") return "Reshelter Post";
    else if (postType == "breedPost") return "Breed Post";
    else return "Adoption Post";
  };

  const handleSendRequestButton = (
    postUserEmail,
    postUserType,
    postId,
    profileImageLink,
    postType
  ) => {
    showAlert(postUserEmail, postUserType, postId, profileImageLink, postType);
  };
  const viewButton = (
    postUserEmail,
    postUserType,
    postId,
    profileImageLink,
    postType,
    isDisabled
  ) => {
    if (postType == "casual") return null;
    else {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>Send request</Text>

          <TouchableNativeFeedback
            // disabled={isDisabled}
            onPress={() => {
              showAlert(
                postUserEmail,
                postUserType,
                postId,
                profileImageLink,
                postType
              );
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Ionicons name={"add-circle-outline"} size={30} />
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }
  };

  // const RenderCard = (item) => {
  //   // if(item.item.petName==="Juliet")
  //   // {
  //   //   console.log(item.item);
  //   // }
  //   const navigation = useNavigation();
  //   const [canSendRequest, setCanSendRequest] = useState(true);
  //   let isDisabled;
  //   // console.log(item.petName);
  //   // console.log(item.item.use);
  //   // if(item.item.userWhoBought) {
  //   //   isDisabled = true;
  //   // }
  //   // const isDisabled = item.item.userWhoBought
  //   //   ? false
  //   //   : item.item.organizationWhoResheltered
  //   //   ? false
  //   //   : item.item.userWhoAdopted
  //   //   ? false
  //   //   : true;
  //   // useEffect(() => {

  //   // }, [canSendRequest]);

  //   const handleItemClicked = () => {
  //     navigation.navigate("OtherUsersProfile", {
  //       clickedUsersEmail: item.item.postUserEmail,
  //     });
  //   };
  //   return (
  //     <Card style={styles.container}>
  //       <Card.Content>
  //         <View style={styles.postContent}>
  //           <View>
  //             <View style={{ flexDirection: "row", marginBottom: 5 }}>
  //               <Avatar
  //                 source={{
  //                   uri: item.item.profileImageLink
  //                     ? item.item.profileImageLink
  //                     : "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
  //                 }}
  //                 size="tiny"
  //                 style={styles.profilePic}
  //               />
  //               <View style={{ marginLeft: 8 }}>
  //                 <TouchableOpacity onPress={handleItemClicked}>
  //                   <Text style={{ fontSize: 16, fontWeight: "bold" }}>
  //                     {item.item.postUserName}
  //                   </Text>
  //                 </TouchableOpacity>
  //               </View>
  //             </View>
  //             <Text>{postInformation(item.item.postType)}</Text>
  //           </View>
  //           <View style={styles.requestButton}>
  //             {item.item.postType !== "casual" && (
  //               <View
  //                 style={{ justifyContent: "center", alignItems: "center" }}
  //               >
  //                 <Text>Send request</Text>
  //                 <TouchableNativeFeedback
  //                   disabled={!canSendRequest}
  //                   onPress={() => {
  //                     setCanSendRequest(false);
  //                     handleSendRequestButton(
  //                       item.item.postUserEmail,
  //                       item.item.postUserType,
  //                       item.item.id,
  //                       item.item.profileImageLink,
  //                       item.item.postType
  //                     );
  //                   }}
  //                 >
  //                   <View
  //                     style={{ justifyContent: "center", alignItems: "center" }}
  //                   >
  //                     <Ionicons name={"add-circle-outline"} size={30} />
  //                   </View>
  //                 </TouchableNativeFeedback>
  //               </View>
  //             )}
  //             {/* {viewButton(
  //               item.item.postUserEmail,
  //               item.item.postUserType,
  //               item.item.id,
  //               item.item.profileImageLink,
  //               item.item.postType
  //             )} */}
  //           </View>
  //         </View>
  //       </Card.Content>
  //       <Card.Cover
  //         source={{
  //           uri: item.item.image,
  //         }}
  //       />
  //       <Card.Content>
  //         <Paragraph>{item.item.postDescription}</Paragraph>
  //       </Card.Content>
  //       <Card.Actions>
  //         <Like
  //           name="heart"
  //           postId={item.item.id}
  //           postUserEmail={item.item.postUserEmail}
  //           postUserType={item.item.postUserType}
  //           postType={item.item.postType}
  //           profileImageLink={item.item.profileImageLink}
  //           postUserName={item.item.name}
  //           userWhoLikedIds={item.item.userWhoLikedIds}
  //         />
  //         <Comment
  //           postId={item.item.id}
  //           postUserEmail={item.item.postUserEmail}
  //           postUserType={item.item.postUserType}
  //           postComments={item.item.postComments}
  //         />
  //       </Card.Actions>
  //     </Card>
  //   );
  // };

  const renderEachPost = (item) => {
    if (
      item.item.postType === "reshelter" &&
      userDataContext.userType !== "Organization"
    ) {
      // console.log(item.item.postType);
      // console.log(userDataContext.userType);
      return <View></View>;
    } else {
      return <PostCard item={item} />;
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {loading && <LoadingSpinner />}
      {!loading &&
        (data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={renderEachPost}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <NoPostFound />
        ))}
    </View>
  );
}

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
const LoadingSpinner = () => {
  return (
    <View style={styles.spinner}>
      <Spinner />
    </View>
  );
};

const NoPostFound = () => {
  return (
    <View style={styles.spinner}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No Post Available
      </Text>
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
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: "40%",
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
