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
} from "react-native";
import AuthContext from "../hooks/useAuth";
import { Card, Button, Title, Paragraph } from "react-native-paper";
import getUserTypeDocString from "../hooks/getUserTypeDocString";
import { db } from "../../firebase";
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [response, setResponse] = useState([]);
  const [data, setData] = useState([]);
  
  
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
    try {
      const res = await localhostBaseURL.post("/home/fetchPostDetails", {
        emailId: userDataContext.email,
        userType: userDataContext.userType,
      });
      setResponse(res);
      //  console.log(res.data);
      if(res.data==null){
        return;
      }
      let extractedData = [];
      for (each of res.data) {
        //setData(each);
        for (eachInEach of each) {
          // console.log(eachInEach);
          const retArray = {
            id: eachInEach.postId,
            postUserName: eachInEach.name,
            profileImageLink: eachInEach.profileImageLink,
            image: eachInEach.postData.postImageLink,
            postType: eachInEach.postData.postType,
            postUserEmail: eachInEach.postData.userEmail,
            postUserType: eachInEach.postData.userType,
            // userWhoLikedIds: eachInEach.postData.userWhoLikedIds,
          };
          extractedData.push(retArray);
        }
      }
      setData(extractedData);
      // console.log(extractedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataFromServer();
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
    return (
      <Card style={styles.container}>
        <Card.Content>
          <View style={styles.postContent}>
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
            name="heart"
            postId={item.item.id}
            postUserEmail={item.item.postUserEmail}
            postUserType={item.item.postUserType}
            postType={item.item.postType}
            profileImageLink={item.item.profileImageLink}
            postUserName={item.item.name}
            // userWhoLikedIds={item.item.userWhoLikedIds}
          />
          <Comment />
        </Card.Actions>
      </Card>
    );
  };
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
  postContent:{
    flex:1,
    flexDirection:"row"
  },
  requestButton:{
    flex:1,
    flexDirection:"row",
    justifyContent:"flex-end",
    paddingTop:10,
  },
});
