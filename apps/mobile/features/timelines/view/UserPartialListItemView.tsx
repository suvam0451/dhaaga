import { StyleSheet, View, Text } from 'react-native';
import type { UserObjectType } from '@dhaaga/bridge';
import { useAppTheme } from '#/states/global/hooks';
import { APP_FONTS } from '#/styles/AppFonts';
import { appDimensions } from '#/styles/dimensions';
import { Image } from 'expo-image';
import UserRelationPresenter from '#/features/user-profiles/presenters/UserRelationPresenter';
import { AppDividerSoft } from '#/ui/Divider';
import TextAstRendererView from '#/ui/TextAstRendererView';

type Props = {
	user: UserObjectType;
};

const ICON_SIZE = 42;
const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin * 0.75;

/**
 * An alternative layout, since at proto
 * does not offer profile stats
 * @param props
 * @constructor
 */
function UserPartialListItemView({ user }: Props) {
	const { theme } = useAppTheme();

	return (
		<View style={[styles.root, { backgroundColor: theme.background.a20 }]}>
			<View
				style={{
					flexDirection: 'row',
					marginBottom: MARGIN_BOTTOM,
					alignItems: 'center',
				}}
			>
				<Image
					source={{ uri: user.avatarUrl }}
					style={{
						width: ICON_SIZE,
						height: ICON_SIZE,
						borderRadius: ICON_SIZE / 2,
					}}
				/>
				<View style={styles.usernameArea}>
					<View style={{ flex: 1 }}>
						<TextAstRendererView
							tree={user.parsedDisplayName}
							variant={'displayName'}
							mentions={[]}
							emojiMap={user.calculated.emojis}
						/>
						<Text
							style={{
								color: theme.secondary.a30,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								fontSize: 13,
							}}
							numberOfLines={1}
						>
							{user.handle}
						</Text>
					</View>
					<UserRelationPresenter userId={user.id} />
				</View>
			</View>
			<AppDividerSoft
				style={{
					marginVertical: MARGIN_BOTTOM,
				}}
			/>
			<TextAstRendererView
				tree={user.parsedDescription}
				variant={'bodyContent'}
				mentions={[]}
				emojiMap={user.calculated.emojis}
			/>
		</View>
	);
}

export default UserPartialListItemView;

const styles = StyleSheet.create({
	root: {
		borderRadius: 12,
		marginHorizontal: 6,
		paddingHorizontal: 10,
		paddingVertical: 16, // since there are no banners in bluesky
	},
	usernameArea: {
		marginLeft: 12,
		flex: 1,
		flexDirection: 'row',
	},
});
