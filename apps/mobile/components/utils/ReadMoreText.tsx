import { View, Text, StyleProp, TextStyle } from 'react-native';
import { useState } from 'react';

type ReadMoreTextProps = {
	text: string;
	maxLines?: number;
	bold?: boolean;
	textStyle?: StyleProp<TextStyle>;
};

function ReadMoreText({ text, maxLines = 2, textStyle }: ReadMoreTextProps) {
	const [show, setShow] = useState(false);
	const [showPrompt, setShowPrompt] = useState(false);

	function onTextLayout(e: any) {
		setShowPrompt(e.nativeEvent.lines.length >= maxLines);
	}

	return (
		<View
			style={{
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
