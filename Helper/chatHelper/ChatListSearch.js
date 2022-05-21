import React, { useState, useEffect, useContext } from "react";
import { Searchbar } from "react-native-paper";
import {
  Text,
  Avatar,
  TabBar,
  Tab,
  Button,
  Spinner,
} from "@ui-kitten/components";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
// import { baseUrl } from "../../baseUrl";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { localhostBaseURL } from "../../components/common/baseURLs";
import AuthContext from "../../components/hooks/useAuth";

const ChatListSearch = ({ chats, setChats, searchQuery, setSearchQuery }) => {
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userDataContext, setUserDataContext } = useContext(AuthContext);

  const onChangeSearch = async (query) => {
    if (query === " ") {
      return setSearchQuery("");
    }
    if (query.length === 0) return setSearchQuery(query);

    setSearchQuery(query);

    setLoading(true);

    try {
      const res = await localhostBaseURL.get(`/search/get/${searchQuery}`);

      if (res.data.length === 0) {
        data.length > 0 && setdata([]);
        return setLoading(false);
      }

      setdata(
        res.data.filter((element) => element.id != userDataContext.email)
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery.length === 0 && loading) {
      return setLoading(false);
    } else if (searchQuery === "") {
      setdata([]);
    }
    onChangeSearch(searchQuery);

    return () => {
      setSearchQuery("");
    };
  }, [searchQuery]);
  return (
    <View>
      <Searchbar
        placeholder="Search user"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        style={{
          marginTop: 10,
          width: "95%",
          alignSelf: "center",
          marginBottom: 10,
          height: 30,
        }}
      />
      <View>
        {loading && <LoadingSpinner />}
        {!loading &&
          searchQuery !== "" &&
          (data.length > 0 ? (
            <FlatList
              style={styles.flatList}
              data={data}
              renderItem={({ item }) => (
                <RenderItemComponent
                  item={item}
                  chats={chats}
                  setChats={setChats}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text>No result found</Text>
            </View>
          ))}
      </View>
    </View>
  );
};
const RenderItemComponent = ({ item }) => {
  const navigation = useNavigation();
  const addToChat = (item) => {
    return navigation.navigate("Message", {
      messageWith: item.id,
      name: item.name,
    });
  };

  return (
    <TouchableOpacity onPress={() => addToChat(item)}>
      <View style={styles.renderItemConainer}>
        <Avatar
          source={{
            uri: item.profileImageLink
              ? item.profileImageLink
              : "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
          }}
          size="giant"
          style={styles.profilePic}
        />
        <Text style={styles.text}>{` ${item.name}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const LoadingSpinner = () => {
  return (
    <View style={styles.spinner}>
      <Spinner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  searchBar: {
    marginTop: 30,
    width: 10,
    alignSelf: "center",
    marginBottom: 10,
    height: 30,
  },
  flatList: {
    backgroundColor: "#FFF",
  },
  renderItemConainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  profilePic: { marginRight: 16, borderColor: "red", borderWidth: 1 },
  text: {
    color: "#000",
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatListSearch;
