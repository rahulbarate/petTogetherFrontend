import { View, Text, StyleSheet } from "react-native";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./LoginPage";
// import ShopOwnerProfile from "../shopkeeper/ShopOwnerProfile";
import WelcomePage from "./WelcomePage";
import AuthContext from "../hooks/useAuth";
import SignUpPage from "./SignUpPage";
import UserDetailsModal from "./UserDetailsModal";
import App from "../../App";
import Profile from "./Profile";
import MainComponent from "./MainComponent";
import OtherUsersProfile from "./OtherUsersProfile";

const Stack = createNativeStackNavigator();

const StackNaviagator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="WelcomePage"
        component={WelcomePage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="LoginPage"
        component={LoginPage}
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
        name="SignUpPage"
        component={SignUpPage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="UserDetailsModal"
        component={UserDetailsModal}
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
