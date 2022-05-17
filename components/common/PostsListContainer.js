import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../hooks/useAuth";
import { auth, db } from "../../firebase";
import { LogBox } from "react-native";
import { localhostBaseURL } from "../common/baseURLs";
import ProfileComponent from "../common/ProfileComponent";
import ButtonComponent from "./ButtonComponent";
import { useNavigation } from "@react-navigation/native";
import getUserTypeDocString from "../hooks/getUserTypeDocString";
import { Spinner } from "@ui-kitten/components";

const PostsListContainer = ({ userData, isItOtherUser }) => {
  const navigation = useNavigation();
  const [listOfAllPosts, setListOfAllPosts] = useState([]);
  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  const listenRealTimePostUpdate = () => {
    const userTypeDoc = getUserTypeDocString(userData.userType);
    db.collection("Users")
      .doc(userTypeDoc)
      .collection("accounts")
      .doc(userData.email)
      .collection("posts")
      .orderBy("uploadedOn", "desc")
      .onSnapshot((snapshot) => {
        if (listOfAllPosts.length !== snapshot.docs.length) {
          let postArr = [];
          // setListOfAllPosts([]);
          snapshot.docs.forEach((eachPost) => {
            postArr.push(eachPost.data());
          });

          setListOfAllPosts(postArr);
        }
      });
  };

  const formatData = (data, numColumns) => {
    const numOfFullRows = Math.floor(data.length / numColumns);
    let numElementsInLastRow = data.length - numColumns * numOfFullRows;
    while (numElementsInLastRow !== numColumns && numElementsInLastRow !== 0) {
      data.push({ empty: true });
      numElementsInLastRow += 1;
    }
    return data;
  };

  // useEffect(() => {
  //   listenRealTimePostUpdate();
  // }, []);
  useEffect(() => {
    listenRealTimePostUpdate();
  });

  // useEffect(() => {
  //   console.log(listOfAllPosts);
  // }, [listOfAllPosts]);
  const LoadingSpinner = () => {
    return (
      <View>
        <Spinner/>
      </View>
    );
  };
  const renderCardItem = ({ item }) => {
    if (item.postImageLink) {
      return (
        <View style={styles.postCardStyle}>
          <LoadingSpinner />
          <Image
            style={styles.postImageStyle}
            source={{ uri: item.postImageLink }}
          />
        </View>
      );
    }
  };
  const postUploadButtonHandle = () => {
    if (userData.userType === "Shopkeeper") {
      navigation.navigate("ShopPostUpload");
    } else if (userData.userType === "Organization") {
      navigation.navigate("OrganizationPostUpload");
    } else {
      navigation.navigate("IndividualUserPostUpload");
    }
  };

  //
  return (
    <View style={styles.container2Style}>
      <View style={styles.postTypeStyle}>
        <Text style={[styles.postTypeTextStyle, { opacity: 1 }]}>
          All posts
        </Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: Dimensions.get("window").width - 20,
            height: 1.5,
            backgroundColor: "black",
            marginBottom: 10,
          }}
        ></View>
      </View>
      <View style={styles.postViewStyle}>
        <FlatList
          data={listOfAllPosts}
          renderItem={renderCardItem}
          numColumns={3}
          style={{ width: Dimensions.get("window").width }}
          keyExtractor={(item, index) => index.toString()}
        />
        {!isItOtherUser && (
          <View
            style={{
              // borderWidth: 1,
              // borderColor: "rgba(0,0,0,0.2)",
              alignItems: "center",
              justifyContent: "center",
              width: 70,
              position: "absolute",
              bottom: 10,
              right: 10,
              height: 70,
              // backgroundColor: "#fff",
              borderRadius: 100,
            }}
          >
            <ButtonComponent
              buttonStyle={{
                width: 60,
                height: 60,
                borderRadius: 60 / 2,
              }}
              buttonText={"+"}
              textStyle={{ fontSize: 40 }}
              handleButton={postUploadButtonHandle}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default PostsListContainer;

const styles = StyleSheet.create({
  container2Style: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: "green",
  },
  postTypeStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postTypeTextStyle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
    opacity: 0.4,
    marginHorizontal: "10%",
  },
  postCardStyle: {
    // flex: 1,
    width: Dimensions.get("window").width / 3 - 15,
    height: Dimensions.get("window").width / 3 - 15,
    elevation: 3,
    borderRadius: 30,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    marginHorizontal: "2%",
    marginVertical: "2%",
    // elevation: 3,
    // background color must be set
    backgroundColor: "#0000",
    // backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },
  transparentCard: {
    width: Dimensions.get("window").width / 3 - 15,
    height: Dimensions.get("window").width / 3 - 15,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  postScrollViewStyle: {
    alignItems: "flex-start",
  },
  postImageStyle: {
    // flex: 1,
    position: "absolute",
    zIndex: 2,
    width: Dimensions.get("window").width / 3 - 15,
    height: Dimensions.get("window").width / 3 - 15,
    borderRadius: 30,
  },
  postViewStyle: {
    flex: 1,
  },
});
