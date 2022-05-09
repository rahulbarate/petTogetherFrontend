import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNaviagator from "./components/common/StackNaviagator";
// import AuthContext from "../hooks/useAuth";
import React, { useState, useContext } from "react";
import { LogBox } from "react-native";
import AuthContext from "./components/hooks/useAuth";
import MainComponent from "./components/common/MainComponent";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default function App() {
  const [userData, setUserData] = useState({});
  // const [userData, setUserData] = useState({email:"anything"});
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <AuthContext.Provider
          value={{
            userDataContext: userData,
            setUserDataContext: setUserData,
          }}
        >
          {userData.isUserAvailable ? <MainComponent /> : <StackNaviagator />}
        </AuthContext.Provider>
      </NavigationContainer>
    </View>
    // <MainComponent />
    // <NavigationContainer>
    //   <AuthContext.Provider value={{userDataContext:userData,setUserDataContext:setUserData}}>
    //     <StackNaviagator />
    //   </AuthContext.Provider>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
