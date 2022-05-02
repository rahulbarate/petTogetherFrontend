import { View, Text, StyleSheet, Button } from "react-native";
import React, { useContext } from "react";
import AuthContext from "../../hooks/useAuth";
import { auth, db } from "../../firebase";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const ShopOwnerProfile = () => {
  const { userDataContext,setUserDataContext } = useContext(AuthContext);

  const fetchUserData = async () => {
    // console.log(userDataContext);
    const docRef = db
      .collection("Users")
      .doc("shopkeeper")
      .collection("shopAccounts")
      .doc(userDataContext.email);
    const userData = await docRef.get();

    if (!userData.exists) {
      console.log("not found");
    } else {
      console.log(userData.data());
      setUserDataContext(userData.data())
    }
  };
  // fetchUserData();

  // console.log("user data is :");
  // console.log(userDataContext);
  return (
    <View style={styles.mainContainerStyle}>
      <Text>Shop Owner Profile</Text>
      <Text>Email : {userDataContext && userDataContext.email}</Text>
      <Text>Shop Name : {userDataContext && userDataContext.shopName}</Text>
      <Button title="fetch" onPress={fetchUserData} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ShopOwnerProfile;
