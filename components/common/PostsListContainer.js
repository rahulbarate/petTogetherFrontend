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
  ImageBackground,
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

const PostsListContainer = ({ userData, isItOtherUser, allPosts }) => {
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
            postArr.push({ ...eachPost.data(), postId: eachPost.id });
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
        <Spinner />
      </View>
    );
  };
  const displaySinglePost = (listOfAllPosts, index, profileImageLink,isItOtherUser,userData) => {
    navigation.navigate("SinglePostList", {
      allPosts: listOfAllPosts,
      initialScrollIndex: index,
      profileImageLink,
      isItOtherUser,
      userData
    });
  };
  const renderCardItem = ({ item, index }) => {
    if (item.postImageLink) {
      const postTypeTextString =
        item.postType === "casual"
          ? "Casual"
          : item.postType === "petSellPost" && !item.userWhoBought
          ? "Up for sell"
          : item.postType === "reshelter" && !item.organizationWhoResheltered
          ? "Up for impounding"
          : item.postType === "petForAdoption" && !item.userWhoAdopted
          ? "Up for adoption"
          : item.postType === "breedPost"
          ? "Up for  breeding"
          : item.userWhoBought
          ? "Sold"
          : item.organizationWhoResheltered
          ? "Impounded"
          : "Adopted";
      return (
        <TouchableNativeFeedback
          onPress={() => {
            displaySinglePost(
              listOfAllPosts,
              index,
              userDataContext.profileImageLink,
              isItOtherUser,
              userData
            );
          }}
        >
          <View style={styles.postCardStyle}>
            <LoadingSpinner />
            <ImageBackground
              style={styles.postImageStyle}
              source={{ uri: item.postImageLink }}
            >
              <View
                style={{
                  borderColor: "#8CC0DE",
                  backgroundColor: "white",
                  borderBottomWidth: 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 15 }}>{postTypeTextString}</Text>
              </View>
              <View
                style={{
                  borderColor: "#8CC0DE",
                  backgroundColor: "white",
                  borderTopWidth: 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 18 }}>{item.petName}</Text>
              </View>
            </ImageBackground>
          </View>
        </TouchableNativeFeedback>
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
      <View style={{ justifyContent: "center", alignItems: "center",backgroundColor:"white" }}>
        <View
          style={{
            width: Dimensions.get("window").width - 30,
            height: 1.5,
            backgroundColor: "#8CC0DE",
            marginBottom: 10,
          }}
        ></View>
      </View>
      <View style={styles.postViewStyle}>
        <FlatList
          data={listOfAllPosts}
          renderItem={renderCardItem}
          numColumns={2}
          style={{ width: Dimensions.get("window").width,backgroundColor:"white" }}
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
    backgroundColor:"white"
    // backgroundColor: "green",
  },
  postTypeStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor:"white"
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

  transparentCard: {
    width: Dimensions.get("window").width / 2 - 15,
    height: Dimensions.get("window").width / 2 - 15,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  postScrollViewStyle: {
    alignItems: "flex-start",
  },
  postCardStyle: {
    borderWidth:0.8,
    borderColor: "#8CC0DE",
    // flex: 1,
    width: Dimensions.get("window").width / 2 - 15,
    height: Dimensions.get("window").width / 2 - 15,
    borderRadius: 10,
    marginHorizontal: "2%",
    marginVertical: "1%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    // borderWidth:2,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    // elevation: 3,
    // background color must be set
    // backgroundColor: "#0000",
    // backgroundColor: "orange",
  },
  postImageStyle: {
    // borderWidth:2,
    overflow: "hidden",
    // flex: 1,
    position: "absolute",
    zIndex: 2,
    width: Dimensions.get("window").width / 2 - 15,
    height: Dimensions.get("window").width / 2 - 15,
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth:0.8,
    borderColor: "#8CC0DE",
  },
  postViewStyle: {
    flex: 1,
  },
});
