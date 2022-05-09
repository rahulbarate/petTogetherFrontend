import React,{useState} from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView, StyleSheet, Modal,View, TextInput, Dimensions } from "react-native";
import {Card, Button , Title ,Paragraph} from 'react-native-paper';
const { width } = Dimensions.get("window");
export default function HomeScreen() {
  const Icon=(props)=>{
    const [isColor,isRed]=useState(true);
    return(
      <Button
        icon={props.name}
        onPress={() =>isRed(!isColor)
        }
        color={isColor ? "black" : "red"}
      />)
  }
  const Comment=(props)=>{
    const [isModalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const toggleModalVisibility = () => {
      setModalVisible(!isModalVisible);
    };
    return(
    <View>
      <Button icon="chat" color="black" title="Show Modal" onPress={toggleModalVisibility} />
      <Modal 
        animationType="slide" 
        transparent visible={isModalVisible} 
        presentationStyle="overFullScreen" 
        onDismiss={toggleModalVisibility}>
        <View style={styles.viewWrapper}>
        <View style={styles.modalView}>
        <TextInput 
          placeholder="Write Comment" 
          value={inputValue} style={styles.textInput} 
          onChangeText={(value) => setInputValue(value)} />
      <Button title="Close" mode="contained" onPress={toggleModalVisibility} />
      </View>
      </View>
      </Modal>
    </View>
    )
  }

    return (
    <View>
      <ScrollView>
      <Card style={styles.container}>
        <Card.Content>
            <Title>Sayali More</Title>
        </Card.Content>
        <Card.Cover source={{ uri: '' }} />
        <Card.Content>
          <Paragraph>Looking beatiful today..!!</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Icon name="heart"/>
          <Comment/>
          <Button><Ionicons name="share" color="black" /></Button>
        </Card.Actions>
      </Card>
      <Card style={styles.container}>
        <Card.Content>
            <Title>Rahul Barate</Title>
        </Card.Content>
        <Card.Cover source={{ uri: '' }} />
        <Card.Content>
          <Paragraph>Looking beatiful today..!!</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Icon name="heart"/>
          <Comment/>
          <Button><Ionicons name="share" color="black" /></Button>
        </Card.Actions>
      </Card>
      <Card style={styles.container}>
        <Card.Content>
            <Title>Mayuri Shinde</Title>
        </Card.Content>
        <Card.Cover source={{ uri: '' }} />
        <Card.Content>
          <Paragraph>Looking beatiful today..!!</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Icon name="heart"/>
          <Comment/>
          <Button><Ionicons name="share" color="black" /></Button>
        </Card.Actions>
      </Card>
      <Card style={styles.container}>
        <Card.Content>
            <Title>Dayanand Naykude</Title>
        </Card.Content>
        <Card.Cover source={{ uri: '' }} />
        <Card.Content>
          <Paragraph>Looking beatiful today..!!</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Icon name="heart"/>
          <Comment/>
          <Button><Ionicons name="share" color="black" /></Button>
        </Card.Actions>
      </Card>
      </ScrollView>
    </View>  
    );
}
const styles = StyleSheet.create({
  container :{
      alignContent:'center',
      margin:10,
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
},
viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
},
modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, 
                { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
},
textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
},
})
