import React, { useContext, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./Home";
import SearchScreen from "./Search";
import HighAlertScreen from "./HighAlert";
import NotifyScreen from "../common/Notify";
import ProfileScreen from "../common/Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import SendNotification from "../common/SendNotification";
import { Alert, BackHandler, Button, View } from "react-native";
import ButtonComponent from "../common/ButtonComponent";
import AuthContext from "../hooks/useAuth";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import Chat from "../common/Chat";
const homeName = "Home";
const searchName = "Search";
const chatName = "Chat";
const notificationName = "Notify";
const profileName = "Profile";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  const { setUserDataContext } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUserDataContext({});
        navigation.navigate("LoginPage");
      })
      .catch((error) => {
        console.log(error.message);
        // An error happened.
      });
  };
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
          } else if (rn === chatName) {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
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
      {/* <Tab.Screen name="HighAlert" component={HighAlertScreen} /> */}
      <Tab.Screen name="Chat" component={Chat} />

      <Tab.Screen name="Notify" component={NotifyScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerRight: () => {
            return (
              <View style={{ flexDirection: "row" }}>
                <View style={{ marginHorizontal: 10 }}>
                  <ButtonComponent
                    buttonStyle={{
                      paddingHorizontal: 10,
                      height: 30,
                      borderRadius: 25,
                    }}
                    buttonText={"Logout"}
                    handleButton={handleSignOut}
                  />
                </View>
                {/* <View style={{ marginHorizontal: 10 }}>
                  <ButtonComponent
                    buttonStyle={{paddingHorizontal:10, height: 30, borderRadius: 25 }}
                    buttonText={"Edit profile"}
                  />
                </View> */}
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
