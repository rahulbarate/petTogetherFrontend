import { Platform, Text, View, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";
import React, { useContext, useEffect, useState } from "react";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import AuthContext from "../hooks/useAuth";
import ButtonComponent from "./ButtonComponent";
import { useNavigation } from "@react-navigation/native";

const Map = ({ route }) => {
  const { userData } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainerStyle}>
      <View style={styles.topContainerStyle}>
        <Text>{`${userData.name}'s Location`}</Text>
      </View>
      <View style={styles.mapContainerStyle}>
        <MapView
          style={styles.map}
          initialRegion={{
            ...userData.coordinate.markerPosition,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
        >
          <Marker
            coordinate={userData.coordinate.markerPosition}
            tracksViewChanges={false}
          >
            <Callout>
              <Text>{`This is where ${userData.name} is`}</Text>
            </Callout>
          </Marker>
        </MapView>
      </View>
      <View style={styles.bottomContainer}>
        <ButtonComponent
          buttonStyle={styles.saveButtonStyle}
          textStyle={styles.buttonTextStyle}
          buttonText={"Go Back"}
          handleButton={() => {
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height - 100,
  },
  saveButtonStyle: {
    width: 150,
    height: 50,
    borderRadius: 30,
  },
  topContainerStyle: {
    flex: 1 / 4,
    // backgroundColor:"red",
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainerStyle: {
    flex: 1.5,
    // backgroundColor: "blue"
  },
  bottomContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  buttonTextStyle: {
    fontSize: 18,
  },
});
