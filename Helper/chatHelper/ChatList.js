import React, { useState, useEffect } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  Text,
  Avatar,
  TabBar,
  Tab,
  Button,
  Spinner,
} from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const ChatList = ({ chats, connectedUsers }) => {
  const [chatList, setChatList] = useState([]);

  const Array = [
    {
      id: 1,
      name: "Daya",
    },
  ];
  const getData = async () => {
    setChatList(chats);
  };

  useEffect(() => {
    getData();
  }, [chats]);

  return (
    <View>
      <FlatList
        style={styles.flatList}
        data={chatList}
        renderItem={({ item }) => (
          <RenderItemComponent item={item} chats={chats} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
const RenderItemComponent = ({ item }) => {
  const navigation = useNavigation();

  const handleClickedItem = (item) => {
    navigation.navigate("Message", {
      messageWith: item.id,
      name: item.name,
    });
  };

  const formats = {
    sameDay: "h:mm a",
    lastDay: "[Yesterday]",
    sameElse: "DD/MM/YYYY",
  };

  return (
    <TouchableOpacity onPress={() => handleClickedItem(item)}>
      <View style={styles.chatListItemConainer}>
        <Avatar
          source={{
            uri: item.profileImageLink
              ? item.profileImageLink
              : "https://firebasestorage.googleapis.com/v0/b/pettogether-f16ce.appspot.com/o/temp%2FblankProfilePicture.png?alt=media&token=c4fd0020-8702-4f79-9871-8f4543d8d2b3",
          }}
          size="giant"
          style={styles.profilePic}
        />
        <View style={styles.chatListItemSecondSection}>
          <View>
            <Text style={styles.name}>{` ${item.name}`}</Text>
            <Text style={styles.lastMessage}>{item.latestMessage}</Text>
          </View>
          <View>
            <Text style={styles.date}>
              {moment(item.createdAt).calendar(null, formats)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatListItemConainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    marginBottom: 1,
  },
  profilePic: { marginRight: 16 },
  name: {
    color: "#000",
    fontSize: 17,
  },
  flatList: {
    backgroundColor: "#FFF",
  },
  lastMessage: {
    paddingLeft: 5,
    fontSize: 14,
  },
  date: {
    fontSize: 13,
    marginRight: 4,
  },
  chatListItemSecondSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 55,
  },
});
export default ChatList;
