import React, {useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {Text} from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import {APP_FONT} from "../../../styles/AppTheme";

type UserProfileExtraInformationProps = {
  fields: any[]
}

function UserProfileExtraInformation({fields}: UserProfileExtraInformationProps) {
  const [IsExpanded, setIsExpanded] = useState(false)

  return <View>
    <View style={{
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      paddingHorizontal: 16
    }}>
      <TouchableOpacity
          onPress={() => {
            setIsExpanded(!IsExpanded);
          }}
      >
        <View
            style={{
              marginVertical: 6,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
              backgroundColor: "#272727",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 8
            }}
        >
          <Text style={{color: "white", flexGrow: 1}}>Additional Info</Text>
          <Ionicons name={IsExpanded ? "chevron-down" : "chevron-forward"}
                    size={24} color={APP_FONT.MONTSERRAT_BODY}/>
        </View>
      </TouchableOpacity>
      <View style={{
        display: IsExpanded ? "flex" : "none",
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "#1E1E1E",
        borderRadius: 8
      }}>
        {fields?.map((x, i) => (
            <React.Fragment key={i}>
              <View style={{paddingTop: 8, paddingBottom: 8}}>
                <Text style={{color: "#fff"}}>{x.name}</Text>
                <View>
                  <Text>{x.value}</Text>
                  {/*NOTE: Bugged*/}
                  {/*{x.verifiedAt && (*/}
                  {/*    <IconCheck*/}
                  {/*        style={{*/}
                  {/*          color: "green",*/}
                  {/*        }}*/}
                  {/*    />*/}
                  {/*)}*/}
                  {/*<RenderHTML baseStyle={{color: "#fff"}}*/}
                  {/*            source={{html: x.value}}*/}
                  {/*            contentWidth={Dimensions.get('window').width}*/}
                  {/*/>*/}
                </View>
              </View>
            </React.Fragment>
        ))}
      </View>
    </View>
  </View>
}

export default UserProfileExtraInformation;