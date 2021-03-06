import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./LoginPage";
// import ShopOwnerProfile from "../shopkeeper/ShopOwnerProfile";
import WelcomePage from "./WelcomePage";
import AuthContext from "../hooks/useAuth";
import SignUpPage from "./SignUpPage";
import UserDetailsModal from "./UserDetailsModal";
import Profile from "./Profile";
import MainComponent from "../individual/MainComponent";
import OtherUsersProfile from "./OtherUsersProfile";
import GetLocation from "./GetLocation";
import AcceptUserDetails from "./AcceptUserDetails";
import Map from "./Map";
import Message from "../../Helper/chatHelper/Message";
import PostUploadScreen from "./PostUploadScreen";
import ShopPostUpload from "../shopkeeper/ShopPostUpload";
import OrganizationPostUpload from "../organization/OrganizationPostUpload";
import IndividualUserPostUpload from "../individual/IndividualUserPostUpload";
import SinglePostCard from "./SinglePostCard";
import SinglePostList from "./SinglePostList";
import Comment from "../../Helper/homeHelper/Comment";
import UsersList from "./UsersList";

const Stack = createNativeStackNavigator();

const StackNaviagator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="LoginPage"
        component={LoginPage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SinglePostList"
        component={SinglePostList}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SinglePostCard"
        component={SinglePostCard}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PostUploadScreen"
        component={PostUploadScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="UsersList"
        component={UsersList}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="WelcomePage"
        component={WelcomePage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Map"
        component={Map}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SignUpPage"
        component={SignUpPage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="GetLocation"
        component={GetLocation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AcceptUserDetails"
        component={AcceptUserDetails}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="OtherUsersProfile"
        component={OtherUsersProfile}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="UserDetailsModal"
        component={UserDetailsModal}
      />
      <Stack.Screen
        name="Message"
        component={Message}
        options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen name="Comment" component={Comment} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ShopPostUpload"
        component={ShopPostUpload}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="OrganizationPostUpload"
        component={OrganizationPostUpload}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="IndividualUserPostUpload"
        component={IndividualUserPostUpload}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="MainComponent"
        component={MainComponent}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  navigatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StackNaviagator;
