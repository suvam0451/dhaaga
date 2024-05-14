import React, {useState} from "react";
import {Dimensions, TouchableOpacity, View} from "react-native";
import {Text} from "@rneui/themed";
import RenderHTML from "react-native-render-html";
import Ionicons from "@expo/vector-icons/Ionicons";

type UserProfileExtraInformationProps = {
  fields: any[]
}

function UserProfileExtraInformation({fields}: UserProfileExtraInformationProps) {
  const [IsExpanded, setIsExpanded] = useState(false)

  return <View>
    <TouchableOpacity
        onPress={() => {
          setIsExpanded(!IsExpanded);
        }}
    >
      <View
          style={{
            margin: 6,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            backgroundColor: "#222",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
      >
        <Text style={{color: "white", flexGrow: 1}}>Additional Info</Text>
        <Ionicons name={IsExpanded ? "chevron-down" : "chevron-forward"} size={24} color="white"/>
      </View>
    </TouchableOpacity>
    <View style={{display: IsExpanded ? "flex" : "none", paddingLeft: 8, paddingRight: 8}}>
      {fields?.map((x, i) => (
          <React.Fragment key={i}>
            <View style={{paddingTop: 8, paddingBottom: 8}}>
              <Text style={{color: "#fff"}}>{x.name}</Text>
              <View>
                {/*NOTE: Bugged*/}
                {/*{x.verifiedAt && (*/}
                {/*    <IconCheck*/}
                {/*        style={{*/}
                {/*          color: "green",*/}
                {/*        }}*/}
                {/*    />*/}
                {/*)}*/}
                <RenderHTML baseStyle={{color: "#fff"}}
                            source={{html: x.value}}
                            contentWidth={Dimensions.get('window').width}
                />
              </View>
            </View>
          </React.Fragment>
      ))}
    </View>
  </View>
}

export default UserProfileExtraInformation;