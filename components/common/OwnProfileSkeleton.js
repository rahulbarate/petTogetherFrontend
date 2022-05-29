import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OwnProfileSkeleton = () => {
  return (
    <View style={styles.container1Style} >
        
    </View>
  )
}

export default OwnProfileSkeleton

const styles = StyleSheet.create({
    modalStyle: {
      margin: 0,
      marginTop: "15%",
      borderRadius: 30,
    },
    container1Style: {
      justifyContent: "center",
      alignItems: "center",
      width: Dimensions.get("window").width,
      backgroundColor: "white",
    },
    container1Sub1Style: {
      width: Dimensions.get("window").width,
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    profilePictureViewStyle: {
      width: 150,
      height: 150,
      borderRadius: 150 / 2,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 8,
      elevation: 3,
    },
    profileImageStyle: {
      width: 150,
      height: 150,
      borderRadius: 150 / 2,
    },
    followerFollowingContainerStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: Dimensions.get("window").width / 4,
    },
    userNameTextStyle: {
      fontSize: 22,
      fontWeight: "bold",
      paddingLeft: "3%",
    },
    bioTextStyle: {
      fontSize: 14,
      paddingLeft: "3%",
      paddingRight: "2%",
    },
    bioViewStyle: {
      width: Dimensions.get("window").width,
      maxHeight: 80,
    },
    followNoTextStyle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    editProfileTextViewStyle: {
      // backgroundColor:"red",
      paddingRight: "2%",
      justifyContent: "center",
      alignItems: "flex-end",
      width: Dimensions.get("window").width,
    },
    otherUserProfileViewStyle: {
      // backgroundColor:"red",
      marginVertical: "2%",
      paddingRight: "2%",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "3%",
      width: Dimensions.get("window").width,
    },
    editProfileTextStyle: {
      marginHorizontal: 10,
      color: "blue",
      opacity: 0.8,
      textDecorationLine: "underline",
    },
  });