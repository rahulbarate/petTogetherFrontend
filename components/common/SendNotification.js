import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useContext, useState } from "react";
import TextInputComponent from "./TextInputComponent";
import ButtonComponent from "./ButtonComponent";
import { db, Firestore } from "../../firebase";
import AuthContext from "../hooks/useAuth";

const SendNotification = () => {
  const [interestedUserEmail, setInterestingUserEmail] = useState();
  const [postId, setPostId] = useState();
  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  const addIdToPost = async () => {
    if (interestedUserEmail) {
      try {
        await db
          .collection("Users")
          .doc("individualUser")
          .collection("accounts")
          .doc(userDataContext.email)
          .collection("posts")
          .doc("sLAmbtiKxgEKQaQ4DS5R")
          .update({
            buyRequestIds: Firestore.FieldValue.arrayUnion(interestedUserEmail),
          });
      } catch (error) {
        console.log(error.message);
      }
    }
    ToastAndroid.show("Updated", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.mainContainerStyle}>
      <Text>SendNotification</Text>
      <TextInputComponent
        textInputStyle={{ height: 50, width: 300, marginVertical: 8 }}
        onChangeText={setInterestingUserEmail}
      />
      <ButtonComponent
        buttonStyle={{ height: 50, width: 150, borderRadius: 25 }}
        buttonText={"Send"}
        handleButton={addIdToPost}
      />
    </View>
  );
};

export default SendNotification;

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
