import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNaviagator from "./components/common/StackNaviagator";
// import AuthContext from "../hooks/useAuth";
import React, { useState, useContext } from "react";
import { LogBox } from "react-native";
import AuthContext from "./components/hooks/useAuth";
import MainComponent from "./components/individual/MainComponent";
import {
  ApplicationProvider,
  Layout,
  IconRegistry,
} from "@ui-kitten/components";
import { mapping, light as lightTheme } from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

export default function App() {
  const [userData, setUserData] = useState({});
  // const [userData, setUserData] = useState({email:"anything"});
  return (
    <View style={styles.container}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
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
      </ApplicationProvider>
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
