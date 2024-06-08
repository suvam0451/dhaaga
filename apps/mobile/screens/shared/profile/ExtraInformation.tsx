import React, {useMemo, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {Text} from "@rneui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import {APP_FONT} from "../../../styles/AppTheme";
import MfmService from "../../../services/mfm.service";
import {randomUUID} from "expo-crypto";
import {useActivitypubUserContext} from "../../../states/useProfile";
import {useRealm} from "@realm/react";
import {useGlobalMmkvContext} from "../../../states/useGlobalMMkvCache";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";

type ExtraInformationFieldProps = {
  fieldName: string,
  value: string
}

function ExtraInformationField({fieldName, value}: ExtraInformationFieldProps) {
  const {primaryAcct} = useActivityPubRestClientContext()
  const domain = primaryAcct?.domain
  const subdomain = primaryAcct?.subdomain
  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()
  const {user} = useActivitypubUserContext()

  const ParsedValue = useMemo(() => {
    if (!value) return <View></View>

    const {reactNodes} = MfmService.renderMfm(value, {
      emojiMap: user.getEmojiMap(),
      domain,
      subdomain,
      db,
      globalDb,
      remoteSubdomain: user?.getInstanceUrl()
    })
    return reactNodes?.map(
        (para, i) => {
          const uuid = randomUUID()
          return <Text key={uuid} style={{color: "#fff", opacity: 0.87}}>
            {para.map((o, j) => o)}
          </Text>
        }
    )
  }, [value])

  return <View style={{paddingTop: 8, paddingBottom: 8}}>
    <Text style={{color: "#fff"}}>{fieldName}</Text>
    <View>
      <Text>{ParsedValue}</Text>
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
}

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
          <Text style={{color: APP_FONT.MONTSERRAT_HEADER, flexGrow: 1}}>Additional
            Info</Text>
          <Ionicons
              name={IsExpanded ? "chevron-down" : "chevron-forward"}
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
              <ExtraInformationField fieldName={x.name} value={x.value}/>
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