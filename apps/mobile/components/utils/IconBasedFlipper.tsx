import {TouchableOpacity, View} from "react-native";
import React from "react";

type IconBasedFlipperProps = {
  items: any[],
  index: number,
  setIndex: React.Dispatch<React.SetStateAction<number>>
}

function IconBasedFlipper({items, index, setIndex}: IconBasedFlipperProps) {
  return <View
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgb(64,64,64)",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "rgb(36,36,36)",
      }}>
    {items.map((o, i) =>
        <TouchableOpacity key={i} onPress={() => {
          setIndex(i)
        }}>
          <View key={i}
                style={{
                  backgroundColor: index === i ? "rgb(32,32,32)" : "rgb(48,48,48)",
                  opacity: index === i ? 0.87 : 0.6,
                  borderTopLeftRadius: i === 0 ? 8 : 0,
                  borderBottomLeftRadius: i === 0 ? 8 : 0
                }}>
            <View style={{
              marginHorizontal: 4,
              padding: 8,
            }}>
              {o}
            </View>
          </View>
        </TouchableOpacity>)
    }
  </View>
}

export default IconBasedFlipper