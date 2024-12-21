import { View, Text, StyleProp, TextStyle } from 'react-native';
import { useState } from 'react';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type ReadMoreTextProps = {
	text: string;
	maxLines?: number;
	bold?: boolean;
	textStyle?: StyleProp<TextStyle>;
};

function ReadMoreText({ text, maxLines = 2, textStyle }: ReadMoreTextProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	const [show, setShow] = useState(false); //To show ur remaining Text
	const [showPrompt, setShowPrompt] = useState(false); //to show the "Read more & Less Line"
	const toggleShowMoreLess = () => {
		//To toggle the show text or hide it
		setShow(!show);
	};

	function onTextLayout(e: any) {
		setShowPrompt(e.nativeEvent.lines.length >= maxLines);
	}

	return (
		<View
			style={{
				// height: 20 * maxLines,
				overflow: 'scroll',
			}}
		>
			<Text
				onTextLayout={onTextLayout}
				numberOfLines={show ? undefined : maxLines}
				style={textStyle}
			>
				{text}
			</Text>
		</View>
	);
}

export default ReadMoreText;
