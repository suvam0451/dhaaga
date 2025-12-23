import { StyleSheet, View, Text } from 'react-native';
import type { UserObjectType } from '@dhaaga/bridge';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import UserRelationPresenter from '#/features/user-profiles/presenters/UserRelationPresenter';
import { AppDividerSoft } from '#/ui/Divider';
import TextAstRendererView from '#/ui/TextAstRendererView';
import UserBadge from '#/ui/UserBadge';

type Props = {
	user: UserObjectType;
};

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
					alignItems: 'center',
				}}
			>
				<UserBadge
					userId={user.id}
					avatarUrl={user.avatarUrl}
					displayName={user.displayName}
					parsedDisplayName={user.parsedDisplayName}
					handle={user.handle}
					style={{ paddingRight: 16 }}
				/>
				<UserRelationPresenter userId={user.id} />
			</View>
			{user.description ? (
				<View style={{ marginTop: MARGIN_BOTTOM }}>
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
			) : (
				<View />
			)}
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
