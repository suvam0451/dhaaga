import {StyleSheet, View} from "react-native";
import {Text} from "@rneui/themed"
import TimelinesHeader from "../../../TimelineHeader";
import React, {useEffect, useMemo, useState} from "react";
import {APP_FONT, APP_THEME} from "../../../../styles/AppTheme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import styled from "styled-components/native";
import {TimelineFetchMode} from "../../../../states/useTimelineController";
import {useQuery} from "@realm/react";
import {UserDataTimeline} from "../../../../entities/userdata-timeline.entity";
import AntDesign from "@expo/vector-icons/AntDesign";


enum TIME_OF_DAY {
  UNKNOWN = "Unknown",
  MORNING = "Morning",
  AFTERNOON = "Afternoon",
  EVENING = "Evening",
  NIGHT = "Night"
}

const Section = styled.View`
    margin-top: 32px;
    background-color: #222222;
    padding: 8px;
    border-radius: 8px;
`

type PinnedItemProps = {
  timelineType: TimelineFetchMode
}

function PinnedItem({timelineType}: PinnedItemProps) {
  const Icon = useMemo(() => {
    switch (timelineType) {
      case TimelineFetchMode.IDLE:
        return <View></View>
      case TimelineFetchMode.HOME:
        return <FontAwesome5
            name="home" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.LOCAL:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.FEDERATED:
        return <FontAwesome6
            name="globe" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.HASHTAG:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.REMOTE_TIMELINE:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.LIST:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.USER:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      default:
        return <View></View>
    }
  }, [timelineType])

  const Label = useMemo(() => {
    switch (timelineType) {
      case TimelineFetchMode.IDLE:
        return "Home Screen"
      case TimelineFetchMode.HOME:
        return "Home"
      case TimelineFetchMode.LOCAL:
        return "Local"
      case TimelineFetchMode.FEDERATED:
        return "Federated"
      case TimelineFetchMode.HASHTAG:
        return "Hashtag"
      case TimelineFetchMode.REMOTE_TIMELINE:
        return "Remote Timeline"
      case TimelineFetchMode.LIST:
        return "List"
      case TimelineFetchMode.USER:
        return "User"
      default:
        return "N/A"
    }
  }, [])

  return <View style={styles.quickActionButtonContainer}>
    <View>
      {Icon}
    </View>
    <View style={{marginLeft: 8}}>
      <Text>{Label}</Text>
    </View>
  </View>
}


type UserDataPinnedItemProps = {
  dto: UserDataTimeline
}

function TimelineItem({dto}: UserDataPinnedItemProps) {
  const {type} = dto

  const Icon = useMemo(() => {
    switch (type) {
      case TimelineFetchMode.IDLE:
        return <View></View>
      case TimelineFetchMode.HOME:
        return <FontAwesome5
            name="home" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.LOCAL:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.FEDERATED:
        return <FontAwesome6
            name="globe" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.HASHTAG:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.REMOTE_TIMELINE:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.LIST:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      case TimelineFetchMode.USER:
        return <FontAwesome5
            name="user-friends" size={20}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      default:
        return <View></View>
    }
  }, [type])

  const Label = useMemo(() => {
    switch (type) {
      case TimelineFetchMode.IDLE:
        return "Home Screen"
      case TimelineFetchMode.HOME:
        return "Home"
      case TimelineFetchMode.LOCAL:
        return "Local"
      case TimelineFetchMode.FEDERATED:
        return "Federated"
      case TimelineFetchMode.HASHTAG:
        return "Hashtag"
      case TimelineFetchMode.REMOTE_TIMELINE:
        return "Remote Timeline"
      case TimelineFetchMode.LIST:
        return "List"
      case TimelineFetchMode.USER:
        return "User"
      default:
        return "N/A"
    }
  }, [type])

  return <View style={styles.quickActionButtonContainer}>
    <View>
      {Icon}
    </View>
    <View style={{marginLeft: 8}}>
      <Text>{Label}</Text>
    </View>
  </View>
}

function WelcomeBack() {
  const [TimeOfDay, setTimeOfDay] = useState<TIME_OF_DAY>(TIME_OF_DAY.UNKNOWN)
  const userDataTimelines = useQuery(UserDataTimeline).filter((o) => o.pinned)

  useEffect(() => {
    const currentHours = new Date().getHours()
    let timeOfDay: TIME_OF_DAY = null
    if (currentHours >= 21 || (currentHours >= 0 && currentHours < 6)) {
      timeOfDay = TIME_OF_DAY.NIGHT
    } else if (currentHours >= 6 && currentHours < 12) {
      timeOfDay = TIME_OF_DAY.MORNING
    } else if (currentHours >= 12 && currentHours < 17) {
      timeOfDay = TIME_OF_DAY.AFTERNOON
    } else {
      timeOfDay = TIME_OF_DAY.EVENING
    }
    setTimeOfDay(timeOfDay)
  }, []);

  const PinnedItems = useMemo(() => {
    const retval = []
    for (let i = 0; i < userDataTimelines.length; i = i + 2) {

      if (i + 2 < userDataTimelines.length) {
        retval.push(
            <View style={styles.quickActionButtonGroupContainer}>
              <TimelineItem dto={userDataTimelines[i]}/>
              <TimelineItem dto={userDataTimelines[i + 1]}/>
            </View>
        )
      } else {
        retval.push(
            <View style={styles.quickActionButtonGroupContainer}>
              <TimelineItem dto={userDataTimelines[i]}/>
              <View style={{flex: 1, marginHorizontal: 16}}></View>
            </View>
        )
      }
    }
    return <View>{retval.map((o, i) => <View key={i}>{o}</View>)}</View>
  }, [userDataTimelines])

  return <View>
    <TimelinesHeader
        SHOWN_SECTION_HEIGHT={50}
        HIDDEN_SECTION_HEIGHT={50}
    />
    <View
        style={{
          height: "100%",
          paddingTop: 54,
          backgroundColor: "#121212",
          paddingHorizontal: 8
        }}>
      {TimeOfDay === TIME_OF_DAY.MORNING &&
          <Text>Good Morning</Text>}
      {TimeOfDay === TIME_OF_DAY.AFTERNOON &&
          <Text>Good Afternoon</Text>}
      {TimeOfDay === TIME_OF_DAY.EVENING &&
          <Text style={{fontSize: 28, fontFamily: "Montserrat-Bold"}}>Good
              Evening</Text>}
      {TimeOfDay === TIME_OF_DAY.NIGHT &&
          <Text style={{fontSize: 28, fontFamily: "Montserrat-Bold"}}>Good Night
              🌙</Text>}
      <View>
        <Section>
          <Text style={{
            fontFamily: "Montserrat-Bold",
            fontSize: 20
          }}><FontAwesome6 name="clock-rotate-left" size={24} color="black"/>
            Continue browsing</Text>

        </Section>
        <View style={styles.featureNotAvailableNoteContainer}>
          <View style={{width: 28}}>
            <FontAwesome6 name="toolbox" size={24}
                          color={APP_FONT.MONTSERRAT_HEADER}/>
          </View>
          <Text>This feature is not available yet</Text>
        </View>
        <Section>
          <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}>

            <View style={{width: 24}}>
              <AntDesign name="pushpin" size={24}
                         color={APP_THEME.COLOR_SCHEME_B}
                         style={{marginRight: 4}}/>
            </View>
            <Text style={{
              fontFamily: "Montserrat-Bold",
              fontSize: 20,
              marginLeft: 4,
              flexGrow: 1
            }}>
              Pinned</Text>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              <View style={{marginRight: 8}}>
                <Text>Show All</Text>
              </View>
              <View>
                <FontAwesome6
                    name="chevron-right" size={20}
                    color={APP_FONT.MONTSERRAT_BODY}/>
              </View>


            </View>

          </View>

        </Section>
        {PinnedItems}

        {/*<Section>*/}
        {/*  <View style={{*/}
        {/*    display: "flex", flexDirection: "row", padding: 4,*/}
        {/*    borderRadius: 8,*/}
        {/*    backgroundColor: "#222222"*/}
        {/*  }}>*/}
        {/*    <View style={{flexGrow: 1}}>*/}
        {/*      <Text style={{*/}
        {/*        fontFamily: "Montserrat-Bold",*/}
        {/*        fontSize: 18,*/}
        {/*        color: APP_FONT.MONTSERRAT_HEADER*/}
        {/*      }}>Show all timelines</Text>*/}
        {/*    </View>*/}
        {/*    <View style={{width: 24}}>*/}
        {/*      <FontAwesome6 name="chevron-right" size={24}*/}
        {/*                    color={APP_FONT.MONTSERRAT_BODY}/>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</Section>*/}
      </View>
    </View>
  </View>
}

const styles = StyleSheet.create({
  quickActionButtonGroupContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16
  },
  quickActionButtonContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: APP_THEME.MENTION,
    padding: 8,
    borderRadius: 4
  },
  featureNotAvailableNoteContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    opacity: 0.6,
    borderColor: APP_THEME.COLOR_SCHEME_C
  }
})

export default WelcomeBack