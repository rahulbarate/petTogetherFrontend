// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
// // import Geocoder from 'react-native-geocoding';
// // Geocoder.init('AIzaSyBGZVz5zw6y5XWjWkYD9TwRTl2eslUMfZA', {language: 'en'});

// const Map = () => {
//   const [latitude, setlatitude] = useState(0);
//   const [longitude, setlongitude] = useState(0);
//   const [coordinates, setcoordinates] = useState([]);

//   const loactionArray = [
//     {
//       latitude: 18.120569,
//       longitude: 75.0280187,
//     },
//     {
//       latitude: 18.1209746,
//       longitude: 75.02915,
//     },
//     {
//       latitude: 18.1219856,
//       longitude: 75.029151,
//     },
//   ];

//   const getCurrentLocation = async () => {
//     if (Platform.OS === 'android') {
//       await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//       if ('granted' === PermissionsAndroid.RESULTS.GRANTED) {
//         Geolocation.getCurrentPosition(
//           position => {
//             setlatitude(position.coords.latitude),
//               setlongitude(position.coords.longitude);
//             setcoordinates(prev =>
//               prev.concat({
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude,
//               }),
//             );
//           },
//           error => {
//             alert(error.message.toString());
//           },
//           {
//             showLocationDialog: true,
//             enableHighAccuracy: true,
//             timeout: 20000,
//             maximumAge: 0,
//           },
//         );
//       }
//     }
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   //TODO:
//   //console.log({latitude, longitude});
//   // if (latitude) {
//   //   Geocoder.from(latitude, longitude)
//   //     .then(json => {
//   //       var addressComponent = json.results[0].address_components[0];
//   //       console.log(addressComponent);
//   //     })
//   //     .catch(error => console.warn(error));
//   // }

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         region={{
//           latitude: latitude,
//           longitude: longitude,
//           latitudeDelta: 0.015,
//           longitudeDelta: 0.0121,
//         }}
//         showsUserLocation={true}
//         showsMyLocationButton={true}
//         userLocationAnnotationTitle={'you are here'}
//         showsCompass={true}>
//         {loactionArray.map((place, index) => (
//           <Marker title="click here" key={index} coordinate={place}></Marker>
//         ))}
//         <Polyline
//           coordinates={coordinates}
//           strokeColor="#bf8221"
//           strokeColors={['#bf8221', '#ffe066', '#ffe066', '#ffe066', '#ffe066']}
//           strokeWidth={3}
//         />
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });

// export default Map;