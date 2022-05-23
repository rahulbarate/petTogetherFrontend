import React, { useState, useEffect, useContext } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Searchbar } from "react-native-paper";
import {
  Text,
  Avatar,
  TabBar,
  Tab,
  Button,
  Spinner,
} from "@ui-kitten/components";
import TopTabNavigation from "./TopTabNavigation";
import RenderItemComponent from "../../Helper/searchHelper/RenderItemComponent";
import RenderFooterComponent from "../../Helper/searchHelper/RenderFooterComponent";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import { localhostBaseURL } from "../common/baseURLs";
import axios from "axios";
import AuthContext from "../hooks/useAuth";

const SearchScreen = ({ navigation, state }) => {
  const {userDataContext, setUserDataContext} = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleComponent, setvisibleComponent] = useState("search");

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

      setdata(res.data.filter((element) => element.id != userDataContext.email));
      
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
  }, [searchQuery]);

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {visibleComponent !== "search" && (
            <TouchableOpacity onPress={() => setvisibleComponent("search")}>
              <AntDesign
                style={styles.backIcon}
                name="left"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          )}
          <Searchbar
            placeholder="Search user"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
            style={{
              marginTop: 10,
              width: visibleComponent === "search" ? "90%" : "80%",
              alignSelf: "center",
              marginBottom: 10,
              height: 30,
            }}
          />
        </View>
        {loading && visibleComponent === "search" && <LoadingSpinner />}
        {visibleComponent === "search" ? (
          data.length > 0 ? (
            <FlatList
              style={styles.flatList}
              data={data.slice(0, 3)}
              renderItem={({ item }) => <RenderItemComponent item={item} />}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={RenderSeparator}
              ListFooterComponent={() => (
                <RenderFooterComponent
                  setvisibleComponent={setvisibleComponent}
                />
              )}
            />
          ) : (
            searchQuery !== "" &&
            !loading && <NoResultFound searchQuery={searchQuery} />
          )
        ) : (
          <>
            <TopTabNavigation data={data} />
            {loading && <LoadingSpinner />}
            {data.length === 0 && searchQuery !== "" && !loading && (
              <NoResultFound searchQuery={searchQuery} />
            )}
          </>
        )}
      </View>
    </>
  );
};

const RenderSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "86%",
        backgroundColor: "#CED0CE",
        marginLeft: "5%",
      }}
    />
  );
};
const NoResultFound = ({ searchQuery }) => {
  return (
    <View style={styles.spinner}>
      <Text>No result found for "{searchQuery}"</Text>
    </View>
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
    marginTop: 10,
    width: 10,
    alignSelf: "center",
    marginBottom: 10,
    height: 30,
  },
  flatList: {
    backgroundColor: "#FFF",
  },
  backIcon: {
    height: 30,
    alignSelf: "center",
    marginTop: 5,
    marginRight: 4,
    backgroundColor: "#FFF",
    borderColor: "#FFF",
    paddingHorizontal: 20,
    borderRadius: 3,
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchScreen;
