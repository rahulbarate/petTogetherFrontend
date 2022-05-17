import React from "react";
import { TabBar, Tab, Layout, Text, Avatar } from "@ui-kitten/components";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlatList, View, StyleSheet } from "react-native";
import RenderItemComponent from "../../Helper/searchHelper/RenderItemComponent";

const { Navigator, Screen } = createMaterialTopTabNavigator();

const TopTabNavigation = ({ data }) => {
  return (
    <Navigator tabBar={(props) => <TopTabBar {...props} />}>
      <Screen name="All">{() => <AllUser data={data} />}</Screen>
      <Screen name="Shop">{() => <Shop data={data} />}</Screen>
      <Screen name="NGO">{() => <NGO data={data} />}</Screen>
      <Screen name="Indivisual">{() => <Indivisual data={data} />}</Screen>
    </Navigator>
  );
};

const TopTabBar = ({ navigation, state }) => (
  <>
    <TabBar
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
      indicatorStyle={{ backgroundColor: "#080808" }}
    >
      <Tab
        title={() => (
          <Text
            style={{
              color: state.index == 0 ? "#080808" : "#A9A9A9",
              fontWeight: "bold",
            }}
          >
            All User
          </Text>
        )}
      />
      <Tab
        title={() => (
          <Text
            style={{
              color: state.index == 1 ? "#080808" : "#A9A9A9",
              fontWeight: "bold",
            }}
          >
            Shop
          </Text>
        )}
      />
      <Tab
        title={() => (
          <Text
            style={{
              color: state.index == 2 ? "#080808" : "#A9A9A9",
              fontWeight: "bold",
            }}
          >
            NGO
          </Text>
        )}
      />
      <Tab
        title={() => (
          <Text
            style={{
              color: state.index == 3 ? "#080808" : "#A9A9A9",
              fontWeight: "bold",
            }}
          >
            Individual User
          </Text>
        )}
      />
    </TabBar>
  </>
);

const Indivisual = ({ data }) => {
  return (
    <FlatList
      style={styles.flatList}
      data={data.filter((result) => result.userType === "Individual User")}
      renderItem={({ item }) => <RenderItemComponent item={item} />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={RenderSeparator}
    />
  );
};
const Shop = ({ data }) => {
  return (
    <FlatList
      style={styles.flatList}
      data={data.filter((result) => result.userType === "Shopkeeper")}
      renderItem={({ item }) => <RenderItemComponent item={item} />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={RenderSeparator}
    />
  );
};

const NGO = ({ data }) => {
  return (
    <FlatList
      style={styles.flatList}
      data={data.filter((result) => result.userType === "Organization")}
      renderItem={({ item }) => <RenderItemComponent item={item} />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={RenderSeparator}
    />
  );
};
const AllUser = ({ data }) => {
  return (
    <FlatList
      style={styles.flatList}
      data={data}
      renderItem={({ item }) => <RenderItemComponent item={item} />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={RenderSeparator}
    />
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

export default TopTabNavigation;
const styles = StyleSheet.create({
  flatList: {
    backgroundColor: "#FFF",
  },
});
