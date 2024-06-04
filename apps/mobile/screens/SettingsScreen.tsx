import {useState} from "react";
import {View, Text} from "react-native";
import {Button} from "@rneui/base";
import {ScrollView} from "react-native";

function SettingsScreen() {
  const [EmojiCount, setEmojiCount] = useState(0);
  const [Emojis, setEmojis] = useState([]);

  async function onClick() {
  }

  return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ScrollView>
          <Text>Settings!</Text>
          <Text>{EmojiCount}</Text>
          {Emojis.map((o, i) => (
              <Text style={{color: "black"}} key={i}>
                {o.name}
              </Text>
          ))}
        </ScrollView>
        <Button onPress={onClick}>Click Me!</Button>
      </View>
  );
}

export default SettingsScreen;
