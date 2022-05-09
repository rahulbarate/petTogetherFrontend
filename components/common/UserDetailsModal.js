import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../hooks/useAuth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import ShopOwnerDetails from "../shopkeeper/ShopOwnerDetails";
import OrgnizationDetails from "../organization/OrganizationDetails";
import IndividualUserDetails from "../individual/IndividualUserDetails";

const UserDetailsModal = (props) => {
  const navigation = useNavigation();

  const { userDataContext } = useContext(AuthContext);
  return (
    <View style={styles.mainContainerStyle}>
      <KeyboardAwareScrollView style={styles.scrollViewStyle}>
        {userDataContext.userType === "Shopkeeper" ? (
          <ShopOwnerDetails />
        ) : userDataContext.userType === "Organization" ? (
          <OrgnizationDetails />
        ) : (
          <IndividualUserDetails />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default UserDetailsModal;

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // backgroundColor: "blue"
  },
  scrollViewStyle: {
    flex: 1,
    // backgroundColor: "blue",
    width: "100%",
    paddingTop: 10,
    paddingLeft: 10,
  },
});
