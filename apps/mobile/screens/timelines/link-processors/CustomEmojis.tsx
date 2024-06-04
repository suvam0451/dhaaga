import {Text} from "react-native";
import {useEffect, useState} from "react";
import {EmojiService} from "../../../services/emoji.service";
import {Image} from "@rneui/base";
import {useRealm} from "@realm/react";

type CustomEmojiFragmentProps = {
  identifier: string;
  domain: string;
  subdomain: string;
};

/**
 * fetches and renders a custom emoji
 * @returns
 */
function CustomEmojiFragment({
  identifier,
  domain,
  subdomain,
}: CustomEmojiFragmentProps) {
  const db = useRealm()
  const [Retval, setRetval] = useState(
      <Text style={{color: "white"}}>:{identifier}:</Text>
  );

  async function resolveEmoji() {
    const found = await EmojiService.find(db, {
      id: identifier,
      domain,
      subdomain
    });
    if (found) {
      setRetval(
          <Image
              style={{
                alignSelf: "stretch",
                minWidth: 16,
                height: 16,
              }}
              source={{uri: found.staticUrl}}
          />
      );
    } else {
      setRetval(<Text style={{color: "white"}}>:{identifier}:</Text>);
    }
  }

  useEffect(() => {
    resolveEmoji();
  }, []);

  return Retval;
}

export default CustomEmojiFragment;
