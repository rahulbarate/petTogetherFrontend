import { View, Text } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Card, Button, Title, Paragraph } from "react-native-paper";
import AuthContext from "../../components/hooks/useAuth";

import { localhostBaseURL } from "../../components/common/baseURLs";

const Like = (props) => {
  const { userDataContext } = useContext(AuthContext);
  const [likes, setLikes] = useState(props.userWhoLikedIds);
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => {
      return like == userDataContext.email;
    }).length > 0;

  const setPostLike = async (
    postUserEmail,
    postUserType,
    postId,
    profileImageLink,
    isLiked
  ) => {
    try {
      if (isLiked) {
        setLikes((prev) =>
          prev.filter((like) => like != userDataContext.email)
        );
      } else {
        setLikes((prev) => [...prev, userDataContext.email]);
      }
      const res = await localhostBaseURL.post("/home/setPostLike", {
        name: userDataContext.name,
        notificationType: "like",
        postId,
        profileImageLink,
        emailId: userDataContext.email,
        userType: userDataContext.userType,
        postUserType,
        postUserEmail,
        sendTime: new Date(),
        isLiked,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Button
        icon={props.name}
        onPress={() => {
          setPostLike(
            props.postUserEmail,
            props.postUserType,
            props.postId,
            props.profileImageLink,
            isLiked
          );
        }}
        color={isLiked ? "red" : "black"}
        style={props.buttonStyle ? props.buttonStyle : {}}
      >
        {likes.length > 0 && <Text>{likes.length}</Text>}
      </Button>
    </View>
  );
};

export default Like;
