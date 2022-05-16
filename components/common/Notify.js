import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import { db } from "../../firebase";
import AuthContext from "../hooks/useAuth";
export default function NotifyScreen() {
  const { userDataContext, setUserDataContext } = useContext(AuthContext);
  const [buyRequestIds, setBuyRequestIds] = useState(["jhon@gmail.com"]);

  function myButton(email) {
    Alert.alert(`${email}'s request accepted`);
  }

  function myButton2(email) {
    Alert.alert(`${email}'s request REJECTED`);
  }

  const listenRealTime = () => {
    db.collection("Users")
      .doc("individualUser")
      .collection("accounts")
      .doc(userDataContext.email)
      .collection("posts")
      .onSnapshot((snapshot) => {
        snapshot.docs.forEach((eachDoc, index) => {
          if ("buyRequestIds" in eachDoc.data()) {
            const Ids = eachDoc.data().buyRequestIds;
            // console.log(Ids);
            if (buyRequestIds.length !== Ids) {
              setBuyRequestIds(Ids);
            }
          }
        });
      });
  };
  useEffect(() => {
    listenRealTime();
  }, []);

  const profile = [
    {
      id: 1,
      name: "name  ",
      describe: "description ",
    },
    {
      id: 2,
      name: "name  ",
      describe: "description ",
    },
    {
      id: 3,
      name: "name",
      describe: "description ",
    },
    {
      id: 4,
      name: "name",
      describe: "description ",
    },
  ];

  const oneProfile = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar}></Image>
      </View>
      <View style={styles.nameDescriptionStyle}>
        <Text style={styles.name}>{item}</Text>
        <Text>has sent you a buy request</Text>
      </View>
      <View style={styles.buttonContainerStyle}>
        <View style={styles.buttonStyle}>
          <TouchableNativeFeedback
            onPress={() => {
              myButton(item);
            }}
          >
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              Accept
            </Text>
          </TouchableNativeFeedback>
        </View>
        <View style={styles.buttonStyle}>
          <TouchableNativeFeedback
            onPress={() => {
              myButton2(item);
            }}
          >
            <Text style={{ color: "red", textDecorationLine: "underline" }}>
              Reject
            </Text>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
  const itemSeparator = () => {
    return <View style={styles.separator}></View>;
  };
  
  return (
    <SafeAreaView>
      <FlatList data={buyRequestIds} renderItem={oneProfile} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#CCC",
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    margin: 10,
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: 5,
    // elevation: 3,
    // backgroundColor:"red"
  },
  nameDescriptionStyle: {
    flex: 0.8,
    flexDirection: "column",
    // backgroundColor:"white"
  },
  avatar: {
    height: 55,
    width: 55,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 13,
  },
  avatarContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 100,
    height: 89,
    width: 89,
    justifyContent: "center",
    alignItems: "center",
  },
  area: {
    backgroundColor: "#CCCCCC",
    borderRadius: 20,
    borderWidth: 2,
    padding: 2,
    margin: 2,
    //   justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // paddingTop:ConstantSourceNode.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  buttonStyle: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 3,
  },
});
