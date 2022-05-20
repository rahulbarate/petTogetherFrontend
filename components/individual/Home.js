import React, { useState, useContext, useEffect, Component } from "react";
import ModalDropdown from "react-native-modal-dropdown";
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
<<<<<<< HEAD
  TouchableOpacity,
} from "react-native";
import AuthContext from "../hooks/useAuth";
import { Card, Button, Title, Paragraph } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Avatar, TabBar, Tab, Spinner } from "@ui-kitten/components";

import getUserTypeDocString from "../hooks/getUserTypeDocString";
import { db } from "../../firebase";
import Like from "../../Helper/homeHelper/Like";
=======
} from "react-native";
import AuthContext from "../hooks/useAuth";
import { Card, Button, Title, Paragraph } from "react-native-paper";
import getUserTypeDocString from "../hooks/getUserTypeDocString";
import { db } from "../../firebase";
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [response, setResponse] = useState([]);
  const [data, setData] = useState([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(true);

  const isFocused = useIsFocused();

  const getDataFromServer = async () => {
    if (flag) {
      setLoading(true);
      setFlag(false);
    }

=======
  
  
  const setPostLike = async (postUserEmail, postUserType, postId,profileImageLink) => {
    try {
      const res = await localhostBaseURL.post("/home/setPostLike", {
        name:userDataContext.name,
        notificationType:"like",
        postId,
        profileImageLink,
        emailId: userDataContext.email,
        userType: userDataContext.userType,
        postUserType,
        postUserEmail,
        sendTime:new Date()
      });
    } catch (error) {
      console.log(error);
    }
  };

  const Icon = (props) => {
    const [isColor, isRed] = useState(true);
    
    return (
      <Button
        icon={props.name}
        onPress={() => {
          isRed(!isColor);
          setPostLike(
            props.postUserEmail, 
            props.postUserType, 
            props.postId,
            props.profileImageLink
          );
        }}
        color={isColor ? "black" : "red"}
      />
    );
  };

  const getDataFromServer = async () => {
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
    try {
      const res = await localhostBaseURL.post("/home/fetchPostDetails", {
        emailId: userDataContext.email,
        userType: userDataContext.userType,
      });
      setResponse(res);
<<<<<<< HEAD

      let extractedData = [];
      for (each of res.data) {
        for (eachInEach of each) {
=======
      //  console.log(res.data);
      if(res.data==null){
        return;
      }
      let extractedData = [];
      for (each of res.data) {
        //setData(each);
        for (eachInEach of each) {
          // console.log(eachInEach);
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
          const retArray = {
            id: eachInEach.postId,
            postUserName: eachInEach.name,
            profileImageLink: eachInEach.profileImageLink,
            image: eachInEach.postData.postImageLink,
            postType: eachInEach.postData.postType,
            postUserEmail: eachInEach.postData.userEmail,
            postUserType: eachInEach.postData.userType,
<<<<<<< HEAD
            userWhoLikedIds: eachInEach.postData.userWhoLikedIds
              ? eachInEach.postData.userWhoLikedIds
              : [],
            postDescription: eachInEach.postData.postDescription,
            postComments: eachInEach.postData.comments
              ? eachInEach.postData.comments
              : [],
=======
            // userWhoLikedIds: eachInEach.postData.userWhoLikedIds,
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
          };
          extractedData.push(retArray);
        }
      }
      setData(extractedData);
<<<<<<< HEAD
    } catch (error) {
      console.log(error);
      setData([]);
    }
    setLoading(false);
=======
      // console.log(extractedData);
    } catch (error) {
      console.log(error);
    }
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
  };

  useEffect(() => {
    getDataFromServer();
<<<<<<< HEAD
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
=======
  }, []);
  const Comment = (props) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const toggleModalVisibility = () => {
      setModalVisible(!isModalVisible);
    };
    return (
      <View>
        <Button
          icon="chat"
          color="black"
          title="Show Modal"
          onPress={toggleModalVisibility}
        />
        <Modal
          animationType="slide"
          transparent
          visible={isModalVisible}
          presentationStyle="overFullScreen"
          onDismiss={toggleModalVisibility}
        >
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Write Comment"
                value={inputValue}
                style={styles.textInput}
                onChangeText={(value) => setInputValue(value)}
              />
              <ReactButton title="Close" onPress={toggleModalVisibility} />
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  const sendRequest=async(postUserEmail,postUserType,postId,profileImageLink,postType)=>{
    try {
        const res = await localhostBaseURL.post("/home/setNotification", {
        name:userDataContext.name,
        notificationType:postType,
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
        postId,
        profileImageLink,
        emailId: userDataContext.email,
        userType: userDataContext.userType,
        postUserType,
        postUserEmail,
<<<<<<< HEAD
        sendTime: new Date(),
=======
        sendTime:new Date()
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
      });
    } catch (error) {
      console.log(error);
    }
  };
<<<<<<< HEAD
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
  const viewButton = (
    postUserEmail,
    postUserType,
    postId,
    profileImageLink,
    postType
  ) => {
    if (postType == "casual") return null;
    else {
      return (
        <Button
          type="outline"
          icon="plus"
          onPress={() => {
            showAlert(
              postUserEmail,
              postUserType,
              postId,
              profileImageLink,
              postType
            );
          }}
        ></Button>
      );
    }
  };

  const RenderCard = (item) => {
    const navigation = useNavigation();
    const handleItemClicked = () => {
      navigation.navigate("OtherUsersProfile", {
        clickedUsersEmail: item.item.postUserEmail,
      });
    };
=======
  const showAlert = (postUserEmail,postUserType,postId,profileImageLink,postType) =>
    Alert.alert('Send Request','Do you want to send Request ?',[
      {text: 'Cancel',onPress: () => console.log('Cancel Pressed'),style:'cancel'},  
      {text: 'OK', onPress:()=>{
        sendRequest(postUserEmail,postUserType,postId,profileImageLink,postType)
      }},  
    ]  
  );
  const postInformation=(postType)=>{
    if(postType == "casual")
      return("Casual Post");
    else if(postType == "petSellPost")
      return("Pet Sell Post");
    else if(postType == "reshelter")
      return("Reshelter Post");
    else if(postType == "breedPost")
      return("Breed Post");
    else
      return("Adoption Post");
  }
  const viewButton =(postUserEmail,postUserType,postId,profileImageLink,postType)=>{
    if(postType=="casual")
      return(null);
    else{
      return(
        <Button type="outline" icon="plus" onPress={()=>{
          showAlert(postUserEmail,postUserType,postId,profileImageLink,postType)
        }}></Button>);
    }
  }
  const RenderCard = (item) => {
    // console.log("item", item);
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
    return (
      <Card style={styles.container}>
        <Card.Content>
          <View style={styles.postContent}>
<<<<<<< HEAD
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
              {viewButton(
                item.item.postUserEmail,
                item.item.postUserType,
                item.item.id,
                item.item.profileImageLink,
                item.item.postType
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
=======
            <View >
              <Title>{item.item.postUserName}</Title>
              <Text>{postInformation(item.item.postType)}</Text>
            </View>
            <View style={styles.requestButton}>
              {viewButton(item.item.postUserEmail,item.item.postUserType,item.item.id,item.item.profileImageLink,item.item.postType)}
            </View>
          </View>
        </Card.Content>
          <Card.Cover
          source={{
            uri: item.item.image,
          }}
          />
        <Card.Content>
        </Card.Content>
        <Card.Actions>
          <Icon
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
            name="heart"
            postId={item.item.id}
            postUserEmail={item.item.postUserEmail}
            postUserType={item.item.postUserType}
            postType={item.item.postType}
            profileImageLink={item.item.profileImageLink}
            postUserName={item.item.name}
<<<<<<< HEAD
            userWhoLikedIds={item.item.userWhoLikedIds}
          />
          <Comment
            postId={item.item.id}
            postUserEmail={item.item.postUserEmail}
            postUserType={item.item.postUserType}
            postComments={item.item.postComments}
          />
=======
            // userWhoLikedIds={item.item.userWhoLikedIds}
          />
          <Comment />
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
        </Card.Actions>
      </Card>
    );
  };
<<<<<<< HEAD

  return (
    <View style={{ flex: 1 }}>
      {loading && <LoadingSpinner />}
      {!loading &&
        (data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={({ item }) => <RenderCard item={item} />}
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
=======
  const showPost=()=>{
    if(data.length===0){
      return <Text alignItems="center" justifyContent="center">There is no post to display.</Text>
    }
    else{
      return <FlatList
        data={data}
        renderItem={({ item }) => <RenderCard item={item} />}
        keyExtractor={(item) => item.id}
        />
    }
  }
  return (
    <View>
      {showPost()}
    </View>
  );
}
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b

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
<<<<<<< HEAD
  postContent: {
    flex: 1,
    flexDirection: "row",
  },
  requestButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 10,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
=======
  postContent:{
    flex:1,
    flexDirection:"row"
  },
  requestButton:{
    flex:1,
    flexDirection:"row",
    justifyContent:"flex-end",
    paddingTop:10,
>>>>>>> 686dfd78a30e868dd0a39bfa9accb15afa69275b
  },
});
