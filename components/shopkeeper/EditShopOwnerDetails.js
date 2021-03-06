// import {
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   ToastAndroid,
//   TouchableNativeFeedback,
//   Image,
// } from "react-native";
// import React, { useContext, useState, useEffect } from "react";
// import AuthContext from "../../hooks/useAuth";
// import TextInputComponent from "../common/TextInputComponent";
// import DropDownPicker from "react-native-dropdown-picker";
// import ButtonComponent from "../common/ButtonComponent";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { useNavigation } from "@react-navigation/native";
// import { auth, db } from "../../firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { localhostBaseURL } from "../common/baseURLs";
// import useDidMountEffect from "../hooks/useDidMountEffect";
// import * as ImagePicker from "expo-image-picker";
// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";
// import { storage } from "../../firebase";

// const EditShopOwnerDetails = (props) => {
//   const { userDataContext, setUserDataContext } = useContext(AuthContext);
//   const [isDataChanged, setIsDataChanged] = useState(false);

//   const [open, setOpen] = useState(false);
//   const [name, setName] = useState(userDataContext.name);
//   const [image, setImage] = useState(userDataContext.profileImageLink);
//   const [ownerName, setOwnerName] = useState(userDataContext.ownerName);
//   const [bio, setBio] = useState(
//     "bio" in userDataContext ? userDataContext.bio : ""
//   );
//   const [phoneNumber, setPhoneNumber] = useState(userDataContext.phoneNumber);
//   const [pincode, setPincode] = useState(userDataContext.pincode);
//   const [state, setState] = useState(userDataContext.state);
//   const [district, setDistrict] = useState(userDataContext.district);
//   const [houseNo, setHouseNo] = useState(userDataContext.houseNo);
//   const [area, setArea] = useState(userDataContext.area);

//   const [items, setItems] = useState([
//     { label: "Pet Essentials", value: "essentials" },
//     { label: "Pets", value: "pets" },
//     { label: "Both", value: "both" },
//   ]);
//   const [sellerType, setSellerType] = useState(userDataContext.sellerType);

//   const displayToastMessage = (text) => {
//     ToastAndroid.show(text, ToastAndroid.SHORT);
//   };

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 4],
//       quality: 1,
//     });

//     // console.log(result);

//     if (!result.cancelled) {
//       setImage(result.uri);
//       uploadImage(result.uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     const blob = await new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       xhr.onload = () => {
//         resolve(xhr.response);
//       };
//       xhr.onerror = () => {
//         reject(new TypeError("Network request failed"));
//       };
//       xhr.responseType = "blob";
//       xhr.open("GET", uri, true);
//       xhr.send(null);
//     });

//     const storageRef = storage.ref(`${userDataContext.email}/profilePictures/`).child("profilePicture.jpeg");
//     const uploadTask = storageRef.put(blob);
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log("Upload is " + progress + "% done");
//         switch (snapshot.state) {
//           case "paused":
//             console.log("Upload is paused");
//             break;
//           case "running":
//             console.log("Upload is running");
//             break;
//         }
//       },
//       (error) => {
//         switch (error.code) {
//           case "storage/unauthorized":
//             break;
//           case "storage/canceled":
//             break;
//           case "storage/unknown":
//             break;
//         }
//         blob.close();
//         return;
//       },
//       () => {
//         uploadTask.snapshot.ref.getDownloadURL().then((url) => {
//           setImage(url);
//           sendProfilePictureUpdateRequestToServer(url);
//           blob.close();
//         });
//       }
//     );
//   };

//   const sendProfilePictureUpdateRequestToServer = async (url) => {
//     // console.log(url);
//     //   console.log("in the server req");
//     try {
//       const res = await localhostBaseURL.post("/profile/updateUserProfile", {
//         userData: { ...userDataContext, profileImageLink: url },
//       });

//       if (res.data.success) {
//         displayToastMessage("Profile Pic Updated");
//         setUserDataContext({ ...userDataContext, profileImageLink: url });
//         // setIsDataChanged(false);
//       }
//       // setUserDataContext(res.data);
//     } catch (error) {
//       alert(error);
//     }
//   };

//   const updateShopOwnerDetails = () => {
//     const updatedData = {
//       email: userDataContext.email,
//       password: userDataContext.password,
//       userType: userDataContext.userType,
//       name,
//       ownerName,
//       bio,
//       phoneNumber,
//       pincode,
//       state,
//       district,
//       houseNo,
//       area,
//       sellerType,
//     };
//     sendUpdateRequestToServer(updatedData);
//     setUserDataContext(updatedData);
//     props.toggleModal();
//   };

//   const sendUpdateRequestToServer = async (userData) => {
//     //   console.log("in the server req");
//     try {
//       const res = await localhostBaseURL.post("/profile/updateUserProfile", {
//         userData: userData,
//       });

//       if (res.data.success) {
//         displayToastMessage("Profile Updated");
//         // setIsDataChanged(false);
//       }
//       // setUserDataContext(res.data);
//     } catch (error) {
//       alert(error);
//     }
//   };

//   return (
//     <View style={styles.mainContainerStyle}>
//       <KeyboardAwareScrollView style={styles.scrollViewStyle}>
//         <View style={styles.shopUserContainerStyle}>
//           <View style={{ alignItems: "center" }}>
//             <Text style={styles.titleTextStyle}>Edit Your Shop Details: </Text>
//           </View>
//           <View style={styles.profilePictureViewStyle}>
//             <TouchableNativeFeedback onPress={pickImage}>
//               <Image
//                 style={styles.profileImageStyle}
//                 source={{
//                   uri: image,
//                 }}
//               />
//             </TouchableNativeFeedback>
//           </View>
//           <TextInputComponent
//             textInputStyle={styles.longTextInputStyle}
//             placeholder={"Enter Shop Name Here"}
//             value={name}
//             onChangeText={(text) => {
//               setName(text);
//             }}
//           />
//           <TextInputComponent
//             textInputStyle={styles.longTextInputStyle}
//             placeholder={"Enter Owner Name Here"}
//             value={ownerName}
//             onChangeText={(text) => {
//               setOwnerName(text);
//             }}
//           />
//           <TextInputComponent
//             textInputStyle={styles.longTextInputStyle}
//             placeholder={"Enter Phone no here"}
//             keyboardType={"phone-pad"}
//             value={phoneNumber}
//             onChangeText={(text) => {
//               setPhoneNumber(text);
//             }}
//           />
//           <TextInputComponent
//             textInputStyle={styles.bioTextStyle}
//             placeholder={"Enter About you here"}
//             value={bio}
//             onChangeText={(text) => {
//               setBio(text);
//             }}
//           />
//           <DropDownPicker
//             open={open}
//             value={sellerType}
//             items={items}
//             setOpen={setOpen}
//             setValue={setSellerType}
//             setItems={setItems}
//             style={{ width: 200, marginVertical: 5 }}
//             containerStyle={{ width: 200 }}
//             placeholder="What Do you Sell?"
//             onChangeValue={(text) => {
//               setSellerType(text);
//             }}
//           />
//         </View>
//         <View style={{ flexDirection: "row" }}>
//           <TextInputComponent
//             textInputStyle={{
//               width: "40%",
//               height: 50,
//               marginVertical: 5,
//               marginHorizontal: 5,
//             }}
//             placeholder={"Enter pincode"}
//             keyboardType={"phone-pad"}
//             value={pincode}
//             onChangeText={(text) => {
//               setPincode(text);
//             }}
//           />
//           <TextInputComponent
//             textInputStyle={{
//               width: "40%",
//               height: 50,
//               marginVertical: 5,
//               marginHorizontal: 5,
//             }}
//             placeholder={"Enter State"}
//             value={state}
//             onChangeText={(text) => {
//               setState(text);
//             }}
//           />
//         </View>
//         <View>
//           <TextInputComponent
//             textInputStyle={{
//               width: "40%",
//               height: 50,
//               marginVertical: 5,
//               marginHorizontal: 5,
//             }}
//             placeholder={"Enter District"}
//             value={district}
//             onChangeText={(text) => {
//               setDistrict(text);
//             }}
//           />
//           <TextInputComponent
//             textInputStyle={styles.longTextInputStyle}
//             placeholder={"House no,Building no,Street,etc"}
//             value={houseNo}
//             onChangeText={(text) => {
//               setHouseNo(text);
//             }}
//           />
//           <TextInputComponent
//             textInputStyle={styles.longTextInputStyle}
//             placeholder={"Area,Colony,Road Name,etc"}
//             value={area}
//             onChangeText={(text) => {
//               setArea(text);
//             }}
//           />
//           <View style={{ alignItems: "center", marginBottom: 20 }}>
//             <ButtonComponent
//               buttonStyle={styles.submitButtonStyle}
//               textStyle={styles.buttonTextStyle}
//               buttonText={"Update"}
//               handleButton={updateShopOwnerDetails}
//             />
//           </View>
//         </View>
//       </KeyboardAwareScrollView>
//     </View>
//   );
// };

// export default EditShopOwnerDetails;

// const styles = StyleSheet.create({
//   mainContainerStyle: {
//     flex: 1,
//     width: "100%",
//     alignItems: "flex-start",
//     backgroundColor: "white",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     // backgroundColor: "blue"
//   },

//   scrollViewStyle: {
//     flex: 1,
//     // backgroundColor: "blue",
//     width: "100%",
//     paddingTop: 10,
//     paddingLeft: 10,
//   },
//   longTextInputStyle: {
//     width: 300,
//     height: 50,
//     marginVertical: 5,
//   },
//   bioTextStyle: {
//     width: 300,
//     height: 100,
//     marginVertical: 5,
//   },
//   titleTextStyle: {
//     fontSize: 20,
//     marginBottom: 30,
//   },
//   submitButtonStyle: {
//     width: 150,
//     height: 50,
//     borderRadius: 30,
//   },
//   buttonTextStyle: {
//     fontSize: 18,
//   },
//   profilePictureViewStyle: {
//     width: 150,
//     height: 150,
//     borderRadius: 150 / 2,
//     backgroundColor: "blue",
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 8,
//     elevation: 3,
//   },
//   profileImageStyle: {
//     width: 150,
//     height: 150,
//     borderRadius: 150 / 2,
//   },
// });
