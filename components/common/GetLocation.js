import { Platform, Text, View, StyleSheet, Dimensions, ToastAndroid } from "react-native";
import * as Location from "expo-location";
import React, { useContext, useEffect, useState } from "react";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import AuthContext from "../hooks/useAuth";
import ButtonComponent from "./ButtonComponent";
import { useNavigation } from "@react-navigation/native";

const GetLocation = ({ route }) => {
  const displayToastMessage = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [markerPosition, setMarkerPosition] = useState({});

  const onRegionChange = (region) => {
    // console.log(region);
    setRegion(region);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      // console.log(location);
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setMarkerPosition({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setCoordinates((prev) => {
        prev.push({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        return prev;
      });
    })();
  }, []);

  useEffect(() => {
    setUserDataContext({ ...userDataContext, coordinate: { markerPosition } });
  }, [markerPosition]);

  const saveLocation = () => {
    setUserDataContext({ ...userDataContext, coordinate: { markerPosition } });
    route.params.setRecievedUserLocation(true);
    displayToastMessage("Location recieved successfully");
    navigation.goBack();
  };
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.mainContainerStyle}>
      <View style={styles.topContainerStyle}>
        <Text style={{marginTop:20,fontSize:20}}>Set location</Text>
      </View>
      <View style={styles.mapContainerStyle}>
        {location ? (
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={onRegionChange}
            showsUserLocation={true}
            showsMyLocationButton={true}
            userLocationAnnotationTitle={"you are here"}
            showsCompass={true}
          >
            {markerPosition && (
              <Marker
                coordinate={markerPosition}
                tracksViewChanges={false}
                draggable={true}
                onDragStart={(e) => {
                  console.log(e.nativeEvent.coordinate);
                  console.log(e.nativeEvent.coordinate);
                }}
                onDragEnd={(e) => {
                  console.log(e.nativeEvent.coordinate);
                  console.log(e.nativeEvent.coordinate);
                  setMarkerPosition({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  });
                  // console.log(e.nativeEvent.position);
                }}
              >
                <Callout>
                  <Text>This is where you are</Text>
                </Callout>
              </Marker>
            )}

            {region && (
              <Polyline
                coordinates={coordinates}
                strokeColor="#bf8221"
                strokeColors={[
                  "#bf8221",
                  "#ffe066",
                  "#ffe066",
                  "#ffe066",
                  "#ffe066",
                ]}
                strokeWidth={3}
              />
            )}
          </MapView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>{text}</Text>
          </View>
        )}
      </View>
      <View style={styles.bottomContainer}>
        <ButtonComponent
          buttonStyle={styles.saveButtonStyle}
          textStyle={styles.buttonTextStyle}
          buttonText={"Save"}
          handleButton={saveLocation}
        />
        <ButtonComponent
          buttonStyle={styles.saveButtonStyle}
          textStyle={styles.buttonTextStyle}
          buttonText={"Go back"}
          handleButton={()=>{navigation.goBack()}}
        />
      </View>
    </View>
  );
};

export default GetLocation;

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
    marginHorizontal:5,
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
    flexDirection: "row",
  },
  buttonTextStyle: {
    fontSize: 18,
  },
});
