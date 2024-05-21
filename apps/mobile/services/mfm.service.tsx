import {MfmNode} from "@dhaaga/shared-utility-html-parser/src";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Text} from "react-native";
import HashtagProcessor from "../screens/timelines/link-processors/Hashtags";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Image} from "@rneui/base";
import CustomEmojiFragment
  from "../screens/timelines/link-processors/CustomEmojis";

export type MfmChildrenNodeType = {
  nodes: any[];
  count: string;
  extras: {
    emojis: any[];
    domain: string;
    subdomain: string,
    isHighEmphasisText: boolean
  };
};

class MfmService {
  static parseNode(
      node: MfmNode,
      count: string,
      {
        domain,
        subdomain,
        emojis,
        isHighEmphasisText = false
      }: {
        domain: string;
        subdomain: string;
        emojis?: mastodon.v1.CustomEmoji[] | any[];
        isHighEmphasisText: boolean
      }
  ) {
    switch (node.type) {
      case "unicodeEmoji": {
        return <Text key={count}>{node.props.emoji}</Text>;
      }
      case "text": {
        let baseText = node.props.text;
        baseText = baseText.replaceAll(/<br>/g, "\n");
        return (
            <Text key={count}
                  style={{
                    color: "#fff",
                    opacity: 0.87
                  }}>
              {baseText}
            </Text>
        );
      }
      case "hashtag": {
        const hashtagName =  this.decodeUrlString(node.props.hashtag)
        return (
            <HashtagProcessor
                key={count}
                forwardedKey={count}
                content={hashtagName}
            />
        );
      }
      case "url": {
        return (
            <React.Fragment key={count}>
              <Text style={{color: "orange", opacity: 1}}>
                <Text style={{paddingRight: 4}}>{node.props.url}</Text>
                <Ionicons
                    name="open-outline"
                    style={{
                      marginLeft: 4,
                      paddingLeft: 2,
                    }}
                    size={18}
                    color="orange"
                />
              </Text>
            </React.Fragment>
        );
      }
      case "emojiCode": {
        if (!emojis || !emojis.find) return <Text key={count}></Text>;
        const renderer = emojis?.find((o) => o.shortcode === node.props.name);
        if (renderer) {
          return (
              <Image
                  key={count}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                  source={{uri: renderer.staticUrl}}
              />
          );
        } else {
          return (
              <CustomEmojiFragment
                  key={count}
                  identifier={node.props.name}
                  domain={domain}
                  subdomain={subdomain}
              />
          );
        }
        break;
      }
      case "italic": {
        return (
            <Text key={count} style={{color: "white", fontStyle: "italic"}}>
              Doesn't Work
              {/* <ItalicFormattedChildrenNodes
						count={count}
						nodes={node.children}
						extras={{
							emojis,
							domain,
							subdomain,
						}}
					/> */}
            </Text>
        );

        // <Text key={count} style={{ color: "white", fontStyle: "italic" }}>
        // 		{node.children}
        // 	</Text>
      }
      default: {
        // console.log("[WARN]: node type not evaluated", node);
        return <Text key={count}></Text>;
      }
    }
  }

  static decodeUrlString(input: string) {
    return decodeURI(input)
  }
}

export default MfmService;