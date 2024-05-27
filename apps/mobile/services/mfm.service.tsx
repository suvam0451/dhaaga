import {
  decodeHTMLString,
  MfmNode,
  parseStatusContent
} from "@dhaaga/shared-utility-html-parser/src";
import {Text} from "react-native";
import HashtagProcessor from "../components/common/tag/TagProcessor";
import React from "react";
import {Image} from "@rneui/base";
import {
  EmojiMapValue
} from "@dhaaga/shared-abstraction-activitypub/src/adapters/profile/_interface";
import {randomUUID} from "expo-crypto";
import LinkProcessor from "../components/common/link/LinkProcessor";

class MfmService {
  static parseNode(
      node: MfmNode,
      count: string,
      {emojiMap, linkMap}: {
        domain: string;
        subdomain: string;
        emojiMap: Map<string, EmojiMapValue>
        linkMap?: Map<string, string>
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
        const hashtagName = this.decodeUrlString(node.props.hashtag)
        return (
            <HashtagProcessor
                key={count}
                forwardedKey={count}
                content={hashtagName}
            />
        );
      }
      case "url": {
        let displayName = null
        if (linkMap) {
          const match = linkMap.get(node.props.url)
          if (match) {
            displayName = match
          }
        }
        return (
            <LinkProcessor
                key={count}
                url={node.props.url}
                displayName={displayName}
            />
        );
      }
      case "emojiCode": {
        if (!emojiMap) return <Text key={count}></Text>;
        const match = emojiMap.get(node.props.name)

        if (!match) return <Text key={count} style={{color: "red"}}>
          {`:${node.props.name}:`}
        </Text>;
        return <Image
            key={count}
            style={{
              width: 16,
              height: 16,
            }}
            source={{uri: match.url}}
        />

        // return (
        //     <CustomEmojiFragment
        //         key={count}
        //         identifier={node.props.name}
        //         domain={domain}
        //         subdomain={subdomain}
        //     />
        // );
        break;
      }
      case "italic" : {
        console.log("[WARN]: unsupported mfm item", node)
        return (
            <Text key={count} style={{color: "white", fontStyle: "italic"}}>
              Dhaaga: Italics Not Supported
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
        console.log("[WARN]: node type not evaluated", node);
        return <Text key={count}></Text>;
      }
    }
  }

  static decodeUrlString(input: string) {
    return decodeURI(input)
  }

  private static extractUrls(item: string) {
    const mp = new Map<string, string>()
    const ex = /<a.*?href="(.*?)".*?>(.*?)<\/a>/gu

    const aRefContentCleanupRegex = /(<([^>]+)>)/ig;

    const matches = item.matchAll(ex)
    for (const match of matches) {
      const result = match[2].replace(aRefContentCleanupRegex, '');
      mp.set(match[1], result)
    }
    return mp
  }

  static renderMfm(input: string,
      {emojiMap, domain, subdomain}: {
        domain?: string,
        subdomain?: string
        emojiMap: Map<string, EmojiMapValue>
      }
  ) {
    if (!input || !domain || !subdomain || !emojiMap) return {
      reactNodes: [],
      openAiContext: []
    }

    const extractedUrls = this.extractUrls(input)

    const parsed = parseStatusContent(decodeHTMLString(input));
    let retval = [];
    let openAiContext = []
    let count = 0;
    let paraCount = 0

    for (const para of parsed) {
      retval.push([])
      for (const node of para) {
        // handle line breaks
        if (node.type === "text") {
          const splits = node.props.text.split(/<br ?\/?>/)

          const key = randomUUID()
          // first item is always text
          retval[paraCount].push(
              <Text key={key}
                    style={{
                      color: "#fff",
                      opacity: 0.87
                    }}>
                {splits[0]}
              </Text>
          )
          count++

          // each n-1 item results in a split
          for (let i = 1; i < splits.length; i++) {
            retval.push([])
            paraCount++

            const key = randomUUID()
            retval[paraCount].push(
                <Text key={key}
                      style={{
                        color: "#fff",
                        opacity: 0.87
                      }}>
                  {splits[i]}
                </Text>
            )
          }

          const txt = node.props.text.trim()
          txt.replaceAll(/<br>/g, "\n");
          openAiContext.push(txt)
          continue
        }

        const key = randomUUID()
        const item = MfmService.parseNode(node, key, {
          emojiMap: emojiMap,
          linkMap: extractedUrls,
          domain,
          subdomain,
          isHighEmphasisText: false
        })

        retval[paraCount].push(item)
        count++
      }
      paraCount++
    }

    return {
      reactNodes: retval,
      openAiContext
    }
  }
}

export default MfmService;