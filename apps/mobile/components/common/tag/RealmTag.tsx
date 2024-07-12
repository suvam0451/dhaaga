import { Text } from '@rneui/themed';
import { APP_THEME } from '../../../styles/AppTheme';
import { Pressable, StyleSheet } from 'react-native';
import { memo } from 'react';

type Props = {
	onPress: () => void;
	dto: {
		name: string;
		following: boolean;
		privatelyFollowing: boolean;
	};
	count?: number;
};

const RealmTag = memo(function Foo({ onPress, dto, count }: Props) {
	return (
		<Pressable style={styles.tagContainer} onPress={onPress}>
			<Text style={styles.tagText} numberOfLines={1}>
				{dto.name}
			</Text>
			{count && <Text style={styles.tagSubtext}> ({count})</Text>}
		</Pressable>
	);
});

const styles = StyleSheet.create({
	tagContainer: {
		backgroundColor: 'rgba(240,185,56,0.16)', // '#363636',
		margin: 4,
		padding: 4,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 4,
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	tagText: {
		maxWidth: 128,
		fontSize: 13,
		color: APP_THEME.COLOR_SCHEME_D_EMPHASIS,
		fontFamily: 'Montserrat-Bold',
	},
	tagSubtext: {
		maxWidth: 128,
		fontSize: 13,
		color: APP_THEME.COLOR_SCHEME_D_EMPHASIS,
		fontFamily: 'Montserrat-Bold',
	},
});

export default RealmTag;
