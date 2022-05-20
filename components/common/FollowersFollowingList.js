import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";

const UserDetailsCard = (props) => {
  const [userData, setUserData] = useState({});
  getUserData(props.item, setUserData);
  useEffect(() => {
    return () => {
      setUserData([]);
    };
  }, []);
  return (
    //outer container
    <View style={styles.mainCardContainer}>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.avatar}
          source={
            userData.profileImageLink && { uri: userData.profileImageLink }
          }
        />
      </View>
      <View style={styles.userNameAndEmailContainer}>
        <Text style={{ fontSize: 18 }}>{userData.name}</Text>
        <Text>{userData.email}</Text>
      </View>
    </View>
  );
};

const getUserData = async (email, setUserData) => {
  const data = await sendRequestToServer("/profile/fetchUserDetails", {
    email: email,
  });
  const item = {
    name: data.name,
    email: data.email,
    profileImageLink: data.profileImageLink,
  };
  setUserData(item);
};

const FollowersFollowingList = (props) => {
  //renderSingleItem
  const renderCardItem = ({ item, index }) => {
    return <UserDetailsCard item={item} index={index} />;
  };
  const [modalVisibility, setModalVisibility] = useState(props.modalVisibility);
  return (
    <View style={styles.mainContainerStyle}>
      <Text style={{ fontSize: 25, marginBottom: 50, marginTop: 20 }}>
        {props.whoseListIsPassed === "followers"
          ? "These people follows you"
          : "You follow these people"}
      </Text>
      <FlatList
        data={props.followersOrFollowingsArray}
        renderItem={renderCardItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default FollowersFollowingList;

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    marginTop: "10%",
    borderRadius: 30,
  },
  mainContainerStyle: {
    flex: 1,
    width: Dimensions.get("window").width,
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // backgroundColor: "blue"
  },
  mainCardContainer: {
    flex: 1,
    width: Dimensions.get("window").width - 30,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingLeft: 5,
  },
  profileImageContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 80 / 2,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  userNameAndEmailContainer: {
    flex: 0.8,
    flexDirection: "column",
    marginLeft: "2%",
    // backgroundColor:"white"
  },
  avatar: {
    borderRadius: 80 / 2,
    height: 80,
    width: 80,
  },
});
