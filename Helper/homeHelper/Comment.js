import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../components/hooks/useAuth";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { localhostBaseURL } from "../../components/common/baseURLs";

const Comment = ({ route }) => {
  const { postId, postUserEmail, postUserType, postComments } = route.params;
  const { userDataContext } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [comments, setComments] = useState(postComments ? postComments : []);

  // reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  comments.length > 0 &&
    comments.sort((a, b) => new Date(b.date) - new Date(a.date));
  const onSubmit = async (text) => {
    try {
      const res = await localhostBaseURL.post("/home/addComment", {
        name: userDataContext.name,
        commentUserEmail: userDataContext.email,
        postUserType,
        postUserEmail,
        postId,
        profileImageLink: userDataContext.profileImageLink
          ? userDataContext.profileImageLink
          : "",
        content: text,
        userType: userDataContext.userType,
      });

      const newComment = {
        _id: res.data,
        commentUserId: userDataContext.email,
        content: text,
        profileImageLink: userDataContext.profileImageLink,
        date: Date.now(),
        name: userDataContext.name,
      };

      setComments((prev) => [newComment, ...prev]);
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitEditing = ({ nativeEvent: { text } }) => {
    console.log(text);
    setText({ text }, submit());
  };

  const submit = () => {
    if (text) {
      onSubmit(text);
    } else {
      alert("Please enter your comment first");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <FlatList
        style={{ flex: 1 }}
        data={comments}
        renderItem={({ item }) => (
          <RenderItem item={item} loggedUserId={userDataContext.email} />
        )}
        keyExtractor={(item) => item._id}
      />

      <View style={styles.container}>
        <TextInput
          placeholder="Add a comment..."
          keyboardType="twitter"
          autoFocus={true}
          style={styles.input}
          value={text}
          onChangeText={(data) => setText(data)}
          onSubmitEditing={onSubmitEditing}
        />

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={[styles.text, !text ? styles.inactive : []]}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NoCommentsMessage = () => {};

const RenderItem = ({ item, loggedUserId }) => {
  const navigation = useNavigation();
  const handleItemClicked = () => {
    if (item.commentUserId !== loggedUserId)
      navigation.navigate("OtherUsersProfile", {
        clickedUsersEmail: item.commentUserId,
      });
  };
  
  return (
    <View style={styles.RenderItemcontainer}>
      <View style={styles.avatarContainer}>
        {item.profileImageLink ? (
          <Image
            resizeMode="contain"
            style={styles.avatar}
            source={
              item.profileImageLink
                ? {
                    uri: item.profileImageLink,
                  }
                : {}
            }
          />
        ) : (
          <View></View>
        )}
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={handleItemClicked}>
          <Text style={[styles.renderText, styles.name]}>{item.name}</Text>
        </TouchableOpacity>

        <Text style={styles.renderText}>{item.content}</Text>
        <Text style={[styles.renderText, styles.created]}>
          {moment(item.date).fromNow()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  button: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inactive: {
    color: "#CCC",
  },
  text: {
    color: "#3F51B5",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  RenderItemcontainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  avatarContainer: {
    alignItems: "center",
    marginLeft: 5,
    paddingTop: 10,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    padding: 5,
  },
  avatar: {
    borderColor: "#EEE",
    borderRadius: 70,
    width: 35,
    height: 35,
  },
  renderText: {
    color: "#000",
    fontSize: 15,
  },
  name: {
    fontWeight: "bold",
  },
  created: {
    color: "#BBB",
  },
});

export default Comment;
