import {View, ActivityIndicator, Text} from "react-native";

type LoadingMoreProps = {
  visible: boolean
  loading: boolean
}

function LoadingMore({visible, loading}: LoadingMoreProps) {
  if (!visible) return <View
      style={{
        marginTop: 24,
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center"
      }}
  >
    <Text style={{color: "#fff", opacity: 0.3}}>{" "}</Text>

  </View>
  if (loading) return <View
      style={{
        marginTop: 24,
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center"
      }}>
    <Text
        style={{color: "#fff", opacity: 0.3}}>
      Loading More...</Text>
    <ActivityIndicator/>
  </View>
  return <View></View>
}

export default LoadingMore