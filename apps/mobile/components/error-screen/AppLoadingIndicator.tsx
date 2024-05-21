import {ActivityIndicator, View} from "react-native";
import {Text} from "@rneui/themed";

type LoadingIndicatorProps = {
  text: string
  subtext?: string
  searchTerm?: string
}

function AppLoadingIndicator({
  text,
  subtext,
  searchTerm
}: LoadingIndicatorProps) {
  return <View style={{
    display: "flex",
    alignItems: "center",
    marginTop: 32,
    padding: 16
  }}>
    <View style={{
      borderWidth: 1,
      borderColor: "#ffffff60",
      padding: 16,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
    }}>
      <Text style={{fontSize: 24}}>{text}</Text>
      <ActivityIndicator size={24}/>
      {subtext && <Text style={{fontSize: 16, opacity: 0.6}}>{subtext}</Text>}
      {searchTerm && <Text>
          <Text>You are searching for: </Text>
          <Text style={{color: "purple"}}>{searchTerm}</Text>
      </Text>}
    </View>
  </View>
}

export default AppLoadingIndicator