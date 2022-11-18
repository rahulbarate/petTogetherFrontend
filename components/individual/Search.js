import React, { useState, useEffect, useContext } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Searchbar } from "react-native-paper";
import { Text, Spinner } from "@ui-kitten/components";
import TopTabNavigation from "./TopTabNavigation";
import RenderItemComponent from "../../Helper/searchHelper/RenderItemComponent";
import RenderFooterComponent from "../../Helper/searchHelper/RenderFooterComponent";
import { AntDesign } from "@expo/vector-icons";
import { localhostBaseURL } from "../common/baseURLs";
import AuthContext from "../hooks/useAuth";

const SearchScreen = () => {
  const { userDataContext, setUserDataContext } = useContext(AuthContext); // global state for accessing user data

  const [searchQuery, setSearchQuery] = useState(""); // state for storing user input

  const [data, setdata] = useState([]); //state for storing response got from backend

  const [loading, setLoading] = useState(false); // state for loading spinner

  const [visibleComponent, setvisibleComponent] = useState("search"); // state for conditionally rendering component

  // backend call when search input is changed
  const onChangeSearch = async (query) => {
    //return if input contain space  
    if (query === " ") {
      return setSearchQuery("");
    }
    
    //return if input is empty
    if (query.length === 0) return setSearchQuery(query);

    setSearchQuery(query);

    setLoading(true);

    try {
      //backend api call
      const res = await localhostBaseURL.get(`/search/get/${searchQuery}`);

      //if response is empty then setting data state to empty array
      if (res.data.length === 0) {
        data.length > 0 && setdata([]);
        return setLoading(false);
      }

      //set data state with filtering out the logged used record from the response if it exists
      setdata(
        res.data.filter((element) => element.id != userDataContext.email)
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  //runsn when searchQuery dependency is changed(dynamic search)
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
            onChangeText={(text) => setSearchQuery(text)} //callback set input text to search query
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
      
       {/* display loading spinner when request goes to backend */}
        {loading && visibleComponent === "search" && <LoadingSpinner />}

        {visibleComponent === "search" ? (
          data.length > 0 ? (
            // component for displying the first three records
            <FlatList
              style={styles.flatList}
              data={data.slice(0, 3)}  //only pass the first three records
              renderItem={({ item }) => <RenderItemComponent item={item} />} //callback for rendering component which displays the record
              keyExtractor={(item) => item.id} 
              ItemSeparatorComponent={RenderSeparator} 
              ListFooterComponent={() => (     //footer component for displaying see more results button
                <RenderFooterComponent
                  setvisibleComponent={setvisibleComponent} 
                />
              )}
            />
          ) : (
            // componenent for displaying nor records found
            searchQuery !== "" &&
            !loading && <NoResultFound searchQuery={searchQuery} />
          )
        ) : (
          <>
          {/* component for displaying detailed results according to user type */}
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

//seprate the result list 
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

//
const NoResultFound = ({ searchQuery }) => {
  return (
    <View style={styles.spinner}>
      <Text>No result found for "{searchQuery}"</Text>
    </View>
  );
};

//
const LoadingSpinner = () => {
  return (
    <View style={styles.spinner}>
      <Spinner />
    </View>
  );
};

//styles for component
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
