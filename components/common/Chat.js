import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import ChatList from "../../Helper/chatHelper/ChatList";
import ChatListSearch from "../../Helper/chatHelper/ChatListSearch";
import AuthContext from "../../components/hooks/useAuth";
import { useIsFocused } from "@react-navigation/native";

import { localhostBaseURL } from "./baseURLs";

const Chat = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  const isFocused = useIsFocused();

  const [messages, setMessages] = useState([]);

  const getChats = async () => {
    try {
      const res = await localhostBaseURL.get(
        `/chat/get/chats/${userDataContext.email}`
      );

      setChats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChats();
  }, [isFocused]);

  return (
    <View style={{ backgroundColor: "#FFF", flex: 1 }}>
      <View>
        <ChatListSearch
          chats={chats}
          setChats={setChats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </View>
      {chats.length > 0 && searchQuery === "" && <ChatList chats={chats} />}
    </View>
  );
};

export default Chat;
