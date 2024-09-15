import { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { APP_FONT } from '../../styles/AppTheme';
import { APP_FONTS } from '../../styles/AppFonts';

type UserGroupChipsProps = {
	urls: string[];
	clamp?: number;
};

const UserGroupChips = memo(({ urls, clamp }: UserGroupChipsProps) => {
	const urlsToRender = clamp ? urls.slice(0, clamp) : urls;
	const remaining = urls.length > clamp ? urls.length - clamp : 0;
	return (
		<View style={styles.root}>
			{urlsToRender.map((url, index) => (
				<Image
					key={index}
					source={{ uri: url }}
					style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]}
				/>
			))}
			{remaining && (
				<View style={styles.clampIndicator}>
					<Text style={styles.text}>+{remaining}</Text>
				</View>
			)}
		</View>
	);
});

export default UserGroupChips;

const AVATAR_SIZE = 32;
const BORDER_WIDTH = 2;
const CONTAINER_SIZE = AVATAR_SIZE + 2 * BORDER_WIDTH;
const BORDER_COLOR = '#484848';

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
		borderWidth: BORDER_WIDTH,
		borderColor: BORDER_COLOR,
	},
	clampIndicator: {
		backgroundColor: '#c8c8c8',
		alignItems: 'center',
		justifyContent: 'center',
		width: CONTAINER_SIZE,
		height: CONTAINER_SIZE,
		marginLeft: -10,
		borderRadius: CONTAINER_SIZE / 2,
		borderWidth: BORDER_WIDTH,
		borderColor: BORDER_COLOR,
	},
	text: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});
