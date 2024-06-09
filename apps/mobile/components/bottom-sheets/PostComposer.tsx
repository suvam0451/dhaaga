import {Dialog, Input, ListItem} from "@rneui/themed";
import React, {useEffect, useRef, useState} from "react";
import {
  useActivityPubRestClientContext
} from "../../states/useActivityPubRestClient";
import {Text} from "@rneui/themed"
import {Keyboard, Modal, Pressable, TouchableOpacity, View} from "react-native";
import {Image} from 'expo-image';
import {FontAwesome} from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import IconBasedFlipper from "../utils/IconBasedFlipper";
import BottomSheet from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "@expo/vector-icons/Ionicons";
import {APP_FONT} from "../../styles/AppTheme";
import CustomEmojiPicker from "../utils/CustomEmojiPicker";


type StatusActionsProps = {
  // visible: boolean
  // setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

function PostComposerBottomSheet() {
  const {me} = useActivityPubRestClientContext()
  const [ActionIndex, setActionIndex] = useState(0)
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [EmojiPickerVisible, setEmojiPickerVisible] = useState(false)

  useEffect(() => {
    if (!bottomSheetRef.current) return
    if (isKeyboardVisible) {
      bottomSheetRef.current.snapToIndex(2)
    } else {
      bottomSheetRef.current.snapToIndex(1)
    }
  }, [isKeyboardVisible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setKeyboardVisible(true); // or some other action
        }
    );
    const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardVisible(false); // or some other action
        }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  async function handleExpoFilePicker() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  }

  function backdropPress() {
    console.log("backdrop pressed !!!")
  }

  function onCustomEmojiClicked() {
    setEmojiPickerVisible(true)
  }

  // if (!visible) return <View></View>
  return <React.Fragment>
    <ListItem containerStyle={{
      backgroundColor: "#2C2C2C"
    }}>
      <View style={{display: "flex", flexDirection: "column"}}>
        <View style={{display: "flex", flexDirection: "row"}}>
          <View style={{width: 48, height: 48}}>
            <Image
                source={me.getAvatarUrl()}
                style={{
                  height: 48, width: 48
                }}
            />
          </View>
          <View style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: 8,
            flexGrow: 1
          }}>
            <View style={{
              padding: 4,
              borderWidth: 2,
              borderColor: "gray",
              width: "auto",
              maxWidth: 80,
              overflow: "hidden",
            }}>
              <Text>Everyone</Text>
            </View>
            <View style={{
              maxWidth: 148,
              overflow: "hidden",
            }}>
              <Text style={{
                opacity: 0.6,
                fontSize: 12,
              }} numberOfLines={1}
              >{me.getAppDisplayAccountUrl("N/A")}</Text>
            </View>
          </View>
          <View>
            <IconBasedFlipper items={[
              <FontAwesome6 name="pencil" size={20} color="#fff"/>,
              <FontAwesome5 name="images" size={20} color="#fff"/>,
              <FontAwesome5 name="eye" size={20} color="#fff"/>,
            ]} setIndex={setActionIndex} index={ActionIndex}/>
          </View>
        </View>
        <View style={{marginTop: 8}}>
          <Input
              multiline={true}
              placeholder={"What's on your mind?"}
              containerStyle={{
                borderBottomWidth: 0
              }}
              inputContainerStyle={{
                borderBottomWidth: 0,
              }}
              style={{
                color: "#fff",
                opacity: 0.87,
                marginHorizontal: -8,
                // backgroundColor: "red"
              }}
          />
        </View>
      </View>
    </ListItem>
    <ListItem containerStyle={{
      backgroundColor: "#2C2C2C"
    }}>
      <View style={{display: "flex", flexDirection: "row"}}>
        <TouchableOpacity onPress={handleExpoFilePicker}>
          <FontAwesome
              name="image" size={24} color={APP_FONT.MONTSERRAT_HEADER}/>
        </TouchableOpacity>
        <FontAwesome
            name="warning" size={24} color={APP_FONT.MONTSERRAT_HEADER}
            style={{marginLeft: 16}}/>
        <Pressable onPress={onCustomEmojiClicked}>
          <FontAwesome6
              name="smile" size={24} color={APP_FONT.MONTSERRAT_HEADER}
              style={{marginLeft: 16}}/>
        </Pressable>

      </View>
    </ListItem>
    <ListItem containerStyle={{
      backgroundColor: "#2C2C2C"
    }}>
      <View style={{position: "relative"}}>
        <View style={{borderRadius: 8}}>
          {image && <Image source={image} style={{
            height: 128,
            width: 100,
            borderRadius: 8
          }}/>}
        </View>

        {/*<View style={{*/}
        {/*  position: "absolute",*/}
        {/*  width: "100%",*/}
        {/*  display: "flex",*/}
        {/*  flexDirection: "row",*/}
        {/*  justifyContent: "flex-end"*/}
        {/*}}>*/}
        {/*  <View style={{position: "relative"}}>*/}
        {/*    <View style={{position: "absolute", left: -16, bottom: -16}}>*/}
        {/*      <Ionicons name="close-circle" size={28} color="red"/>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    </ListItem>
    <Modal
        animationType="slide"
        visible={EmojiPickerVisible}
        transparent={true}
        onRequestClose={() => {
          setEmojiPickerVisible(false)
        }}
    >
      <CustomEmojiPicker onBackdropPressed={() => {
        setEmojiPickerVisible(false)
      }}/>
    </Modal>
  </React.Fragment>
}

export default PostComposerBottomSheet;