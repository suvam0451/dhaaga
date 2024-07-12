import { memo } from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';

const POST_SPACING_VALUE = 4;

/**
 * Adds a reply indicator to the post
 *
 * NOTE: adjust margin and padding,
 * then the post is boosted and
 * is also a reply
 */
export const RepliedStatusFragment = memo(function Foo({
	mt,
	paddingVertical,
}: {
	mt?: number;
	paddingVertical?: number;
}) {
	return (
		<View
			style={{
				backgroundColor: '#1e1e1e',
				marginBottom: POST_SPACING_VALUE,
				marginVertical: mt || 0,
			}}
		>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: '#1e1e1e',
					paddingVertical: paddingVertical === undefined ? 10 : paddingVertical,
					paddingHorizontal: 10,
				}}
			>
				<Ionicons color={'#888'} name={'arrow-redo-outline'} size={14} />
				<Text style={{ color: '#888', fontWeight: '500', marginLeft: 4 }}>
					Continues a thread
				</Text>
			</View>
		</View>
	);
});
