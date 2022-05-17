import React, { useState, useCallback, useEffect, useContext } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  LogBox,
} from "react-native";
import { db } from "../../firebase";
import AuthContext from "../../components/hooks/useAuth";

LogBox.ignoreLogs(["Setting a timer"]);

const Message = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  const { name, messageWith } = route.params;

  // console.log("in message", {
  //   messageWith: messageWith,
  //   email: userDataContext.email,
  // });

  const getAllMessages = async () => {
    const docId =
      messageWith > userDataContext.email
        ? userDataContext.email + "-" + messageWith
        : messageWith + "-" + userDataContext.email;

    const querySnap = await db
      .collection("Chat")
      .doc(docId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .get();

    const allMsg = querySnap.docs.map((docSnap) => {
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });
    setMessages(allMsg);
  };

  useEffect(() => {
    //getAllMessages();
    const docId =
      messageWith > userDataContext.email
        ? userDataContext.email + "-" + messageWith
        : messageWith + "-" + userDataContext.email;

    const messageRef = db
      .collection("Chat")
      .doc(docId)
      .collection("messages")
      .orderBy("createdAt", "desc");

    messageRef.onSnapshot((querySnap) => {
      const allMsg = querySnap.docs.map((docSnap) => {
        return {
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt.toDate(),
        };
      });
      setMessages(allMsg);
    });
  }, []);

  const onSend = async (messageArray) => {
    const msg = messageArray[0];
    const myMsg = {
      ...msg,
      from: userDataContext.email,
      to: messageWith,
      createdAt: new Date(),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, myMsg)
    );

    const docId =
      messageWith > userDataContext.email
        ? userDataContext.email + "-" + messageWith
        : messageWith + "-" + userDataContext.email;

    db.collection("Chat")
      .doc(docId)
      .collection("messages")
      .add({ ...myMsg });
    console.log("ms", msg.text);
    let user = [userDataContext.email, messageWith];
    await db
      .collection("Chat")
      .doc(docId)
      .set(
        {
          latestMessage: {
            text: msg.text,
            createdAt: new Date(),
          },
          users: user,
        },

        { merge: true }
      );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <GiftedChat
        renderAvatar={() => null}
        showAvatarForEveryMessage={true}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userDataContext.email,
        }}
      />
    </View>
  );
};

export default Message;
