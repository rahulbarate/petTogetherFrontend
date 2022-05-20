import React, { useState, useContext, useEffect } from "react";
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
  Button as ReactButton,
} from "react-native";
import AuthContext from "../hooks/useAuth";
import { Card, Button, Title, Paragraph } from "react-native-paper";
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
        postUserEmail
      });
    } catch (error) {
      console.log(error);
    }
  };

  const Icon = (props) => {
    const [isColor, isRed] = useState(true);
    // const liked=props.userWhoLikedIds;
    // const isLiked=liked.includes(userDataContext.email);
    // if(isLiked){
    //   isRed(!isColor);
    // }
    // else{
    //   isRed(isColor);
    // }
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
  const RenderCard = (item) => {
    // ~console.log("item", item);
    return (
      <Card style={styles.container}>
        <Card.Content>
          <Title>{item.item.postUserName}</Title>
        </Card.Content>
        <Card.Cover
          source={{
            uri: item.item.image,
          }}
        />
        <Card.Content>
          <Paragraph></Paragraph>
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
          {/* <ModalDropdown
            style={styles.dropbox}
            options={[
              "Breed Request",
              "Buy Request",
              "Adopt Request",
              "Reshelter Request",
            ]}
          /> */}
        </Card.Actions>
      </Card>
    );
  };
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => <RenderCard item={item} />}
        keyExtractor={(item) => item.id}
      />
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
});
