import { StyleSheet } from 'react-native';

export type EmojiDto = {
	count: number;
	url?: string;
	name: string;
	type: 'text' | 'image';
	height?: number;
	width?: number;
	interactable: boolean;
	me: boolean;
};

export const styles = StyleSheet.create({
	emojiContainer: {
		backgroundColor: '#303030',
		padding: 8,
		borderRadius: 8,
		flexDirection: 'row',
		marginRight: 8,
		marginBottom: 6,
		alignItems: 'center',
	},
});
