import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './NavBar/Home';
import SearchScreen from './NavBar/Search';
import NotifyScreen from './NavBar/Notify';
import ProfileScreen from './NavBar/Profile';
import HighAlertScreen from './NavBar/HighAlert'
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
const homeName= "Home";
const searchName= "Search";
const alertName= "HighAlert";
const notificationName= "Notify";
const profileName= "Profile";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({route})=>({
                tabBarIcon:({focused, color, size})=>{
                let iconName;
                let rn=route.name;
                if (rn === homeName){
                    iconName=focused?'home':'home';
                }
                else if(rn === searchName){
                    iconName=focused?'search':'search';
                }
                else if(rn === alertName){
                    iconName=focused?'alert':'alert';
                }
                else if(rn === notificationName){
                    iconName=focused?'notifications':'notifications-outline';
                }
                else if(rn === profileName){
                    iconName=focused?'paw':'paw';
                }
                return <Ionicons name={iconName} size={size} color={color}/>;
                },
                })}
                tabBarOptions={{
                activeTintColor: "tomato",
                inactiveTintColor: "black",
                labelstyle:{paddingBottom:10, fontsize:10},
                style:{padding:10,height:70}
            }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="HighAlert" component={HighAlertScreen} />
            <Tab.Screen name="Notify" component={NotifyScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
            </NavigationContainer>
    );
}