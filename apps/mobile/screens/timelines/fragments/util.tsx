import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {MfmNode} from "@dhaaga/shared-utility-html-parser/src";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Image} from "@rneui/base";
import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import HashtagProcessor from "../link-processors/Hashtags";
import CustomEmojiFragment from "../link-processors/CustomEmojis";

export function parseNode(
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
          <Text key={count} style={{color: isHighEmphasisText ? "#fff" : "#ffffff60"}}>
            {baseText}
          </Text>
      );
    }
    case "hashtag": {
      return (
          <HashtagProcessor
              key={count}
              forwardedKey={count}
              content={node.props.hashtag}
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

type MfmChildrenNodeType = {
  nodes: any[];
  count: string;
  extras: { emojis: any[]; domain: string; subdomain: string, isHighEmphasisText: boolean };
};

function ItalicFormattedChildrenNodes({
                                        nodes,
                                        count,
                                        extras,
                                      }: MfmChildrenNodeType) {
  const [Nodes, setNodes] = useState<JSX.Element[]>([<View></View>]);

  async function parseNodes() {
    let count = 0;
    let retval = [];
    for await (const node of nodes) {
      retval.push(parseNode(node, count + "." + count.toString(), extras));
      count++;
    }
    setNodes(retval);
  }

  useEffect(() => {
    parseNodes();
  }, []);
  return Nodes;
}
