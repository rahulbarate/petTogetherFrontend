import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import SinglePostCard from "./SinglePostCard";

const SinglePostList = ({ route }) => {
  //   const allPosts = [
  //     {
  //       name: "username",
  //       createdAt: "time1",
  //       profileImageLink: require("../../static/images/post1.jpg"),
  //       postImageLink: require("../../static/images/post1.jpg"),
  //     },
  //     {
  //       name: "username",
  //       createdAt: "time2",
  //       profileImageLink: require("../../static/images/post1.jpg"),
  //       postImageLink: require("../../static/images/post2.jpg"),
  //     },
  //     {
  //       name: "username",
  //       createdAt: "time3",
  //       profileImageLink: require("../../static/images/post1.jpg"),
  //       postImageLink: require("../../static/images/post3.jpg"),
  //     },
  //     {
  //       name: "username",
  //       createdAt: "time4",
  //       profileImageLink: require("../../static/images/post1.jpg"),
  //       postImageLink: require("../../static/images/post4.jpg"),
  //     },
  //     {
  //       name: "username",
  //       createdAt: "time5",
  //       profileImageLink: require("../../static/images/post1.jpg"),
  //       postImageLink: require("../../static/images/post1.jpg"),
  //     },
  //   ];
  const { allPosts, initialScrollIndex, profileImageLink } = route.params;
  const renderEachPost = ({ item }) => {
    return <SinglePostCard item={item} profileImageLink={profileImageLink} />;
  };
  const getItemLayout = (data, index) => {
    return {
      length: 500,
      offset: 500 * index,
      index: index,
    };
  };
  return (
    <View style={styles.mainContainerStyle}>
      {/* <Text>Hello</Text> */}
      <View style={{marginTop:40}}>
        <FlatList
          style={styles.flatListStyle}
          data={allPosts}
          renderItem={renderEachPost}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialScrollIndex}
        />
      </View>
    </View>
  );
};

export default SinglePostList;

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    // marginTop: 20,
    backgroundColor: "#808080",
    // marginBottom: 10,
    // paddingBottom: 100,
  },
  flatListStyle: {
    // paddingTop: 20,
    // paddingBottom: 100,
    backgroundColor: "#808080",
    // borderColor: "#3399ff",
    // backgroundColor: "#3399ff",

    // flex: 1,
    // height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
});
