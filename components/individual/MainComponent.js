import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./Home";
import SearchScreen from "./Search";
import HighAlertScreen from "./HighAlert";
import NotifyScreen from "../common/Notify";
import ProfileScreen from "../common/Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
const homeName = "Home";
const searchName = "Search";
const alertName = "HighAlert";
const notificationName = "Notify";
const profileName = "Profile";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName={profileName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn === homeName) {
            iconName = focused ? "home" : "home";
          } else if (rn === searchName) {
            iconName = focused ? "search" : "search";
          } else if (rn === alertName) {
            iconName = focused ? "alert" : "alert";
          } else if (rn === notificationName) {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (rn === profileName) {
            iconName = focused ? "paw" : "paw";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      options={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "black",
        labelstyle: { paddingBottom: 10, fontsize: 10 },
        tabBarStyle: { padding: 10, height: 70 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="HighAlert" component={HighAlertScreen} />
      <Tab.Screen name="Notify" component={NotifyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
