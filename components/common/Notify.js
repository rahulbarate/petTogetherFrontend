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
export default function NotifyScreen() {
  function myButton() {
    Alert.alert("request accepted", "Button", [{ text: "OK" }]);
  }

  function myButton2() {
    Alert.alert("request REJECTED", "Button", [{ text: "OK" }]);
  }

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
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.name}>{item.describe}</Text>
      </View>
      <View style={styles.buttonContainerStyle}>
        <View
          style={{
            backgroundColor: "white",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 2,
            justifyContent: "center",
            alignItems: "center",
            marginVertical:5
          }}
        >
          <TouchableNativeFeedback onPress={myButton}>
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              Accept
            </Text>
          </TouchableNativeFeedback>
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 5,
            paddingVertical: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableNativeFeedback onPress={myButton2}>
            <Text style={{ color: "red", textDecorationLine: "underline" }}>
              Reject
            </Text>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
  itemSeparator = () => {
    return <View style={styles.separator}></View>;
  };
  return (
    <SafeAreaView>
      <FlatList
        data={profile}
        renderItem={oneProfile}
        ItemSeparatorComponent={itemSeparator}
      />
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
    paddingLeft:5
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
});
