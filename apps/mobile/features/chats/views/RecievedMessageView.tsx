import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { DatetimeUtil } from '#/utils/datetime.utils';
import type { MessageObjectType } from '@dhaaga/bridge';
import { useAppTheme } from '#/states/global/hooks';

const MINI_AVATAR_SIZE = 28;

type Props = {
	avatarUrl: string;
	item: MessageObjectType;
};

function RecievedMessageView({ item, avatarUrl }: Props) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.root}>
			<View style={styles.avatarContainer}>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{
						uri: avatarUrl,
					}}
					style={{
						width: MINI_AVATAR_SIZE,
						height: MINI_AVATAR_SIZE,
						borderRadius: MINI_AVATAR_SIZE / 2,
					}}
				/>
			</View>
			<View
				style={[
					styles.messageContentBox,
					{
						backgroundColor: theme.complementary.a0,
					},
				]}
			>
				<AppText.Normal style={{ color: 'black' }}>
					{item.content?.raw}
				</AppText.Normal>
			</View>
			<View>
				<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
					{DatetimeUtil.timeAgo(item.createdAt)}
				</AppText.Normal>
			</View>
		</View>
	);
}

export default RecievedMessageView;

const styles = StyleSheet.create({
	root: {
		flexDirection: 'row',
		marginBottom: 8,
		marginLeft: 10,
		alignItems: 'center',
	},
	avatarContainer: {
		alignItems: 'flex-start',
		height: '100%',
	},
	messageContentBox: {
		alignSelf: 'flex-end',
		maxWidth: '60%',
		padding: 6,
		borderRadius: 8,
		marginRight: 10,
		borderTopLeftRadius: 0,
		marginLeft: 8,
	},
});
