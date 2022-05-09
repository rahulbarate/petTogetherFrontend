import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
    ScrollView,
    Dimensions,
    Image,
    TouchableNativeFeedback
  } from "react-native";
  import React, { useContext, useState, useEffect } from "react";
  import AuthContext from "../hooks/useAuth";
  import { auth, db } from "../../firebase";
  import { LogBox } from "react-native";
  import { localhostBaseURL } from "../common/baseURLs";
  import ProfileComponent from "../common/ProfileComponent";
  

const PostsListContainer = (props) => {
    const renderCardItem = (item) => {
        // console.log(item);
        return (
            <View style={styles.postCardStyle}>
                <Image style={styles.postImageStyle} source={item.item.imageLink} />
            </View>
        );
    };
    return (
        <View style={styles.container2Style}>
            <View style={styles.postTypeStyle}>
                <Text
                    style={[
                        styles.postTypeTextStyle,
                        { color: "blue", textDecorationLine: "underline", opacity: 1 },
                    ]}
                >
                    All Post
                </Text>
                <Text style={styles.postTypeTextStyle}>Categoriesed</Text>
            </View>
            <View style={styles.postViewStyle}>
                <FlatList
                    data={props.listOfPosts}
                    renderItem={renderCardItem}
                    numColumns={3}
                    keyExtractor={(item, index) => index}
                />
            </View>
        </View>

    )
}

export default PostsListContainer

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
    postTypeTextStyle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "black",
        opacity: 0.4,
        marginHorizontal: "10%",
    },
    postCardStyle: {
        width: Dimensions.get("window").width / 3 - 10,
        height: Dimensions.get("window").width / 3 - 10,
        margin: 5,
        elevation: 3,
        borderRadius: 30,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "black",
        shadowOpacity: 0.3,
        elevation: 3,
        // background color must be set
        backgroundColor: "#0000",
        // backgroundColor: "orange",
        justifyContent: "center",
        alignItems: "center",
    },
    postScrollViewStyle: {
        justifyContent: "flex-start",
    },
    postImageStyle: {
        flex: 1,
        width: Dimensions.get("window").width / 3 - 10,
        height: Dimensions.get("window").width / 3 - 10,
        borderRadius: 30,
    },
    postViewStyle: {
        marginBottom: 45,
    },
})