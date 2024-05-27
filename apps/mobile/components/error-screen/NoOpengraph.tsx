import {View} from "react-native";
import {Text} from "@rneui/themed"

function NoOpengraph() {
  return <View style={{
    display: "flex",
    alignItems: "center",
    marginTop: 32,
    padding: 16,
  }}>
    <View style={{
      borderWidth: 1,
      borderColor: "#ffffff60",
      padding: 16,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      maxWidth: 360
    }}>
      <Text style={{fontSize: 24, marginVertical: 8}}>Weird 🤔</Text>
      <Text style={{
        fontSize: 16,
        opacity: 0.6,
        textAlign: "left",
        marginVertical: 8
      }}>I could not fetch OpenGraph information for this website.</Text>
      <Text style={{
        fontSize: 16,
        opacity: 0.6,
        textAlign: "left",
        marginVertical: 8
      }}>Double check the link before you proceed.</Text>
    </View>
  </View>
}

export default NoOpengraph