import { Text } from "react-native";
import { useEffect, useState } from "react";
import { EmojiService } from "../../../service/emoji.service";
import { Image } from "@rneui/base";

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
	const [Retval, setRetval] = useState(
		<Text style={{ color: "white" }}>:{identifier}:</Text>
	);

	async function resolveEmoji() {
		const emojis = await EmojiService.get(identifier, domain, subdomain);
		const match = emojis.find((o) => o.identifier === identifier);
		if (match) {
			setRetval(
				<Image
					style={{
						alignSelf: "stretch",
						minWidth: 16,
						height: 16,
					}}
					source={{ uri: match.staticUrl }}
				/>
			);
		} else {
			setRetval(<Text style={{ color: "white" }}>:{identifier}:</Text>);
		}
	}

	useEffect(() => {
		resolveEmoji();
	}, []);

	return Retval;
}

export default CustomEmojiFragment;
